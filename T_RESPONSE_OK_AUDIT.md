# Audit `response.ok` cote frontend — Dette technique #26

Date : 2026-06-03
Branche : claude/code-review-improvements-ikvuj
Objectif : generaliser la verification `response.ok` avant `.json()` pour eviter
les crashs `JSON.parse` quand l'API renvoie 404/500 (pages fonds qui ne s'affichent pas).
Contrainte : zero regression, modifications additives et defensives uniquement.

## 1. Methode

- Recensement de tous les `fetch(` dans `src/` : **672 occurrences**.
- Analyse priorisee sur les pages fonds critiques (graphiques VL/performances Highcharts) :
  `src/app/funds/**` (summary local + EUR + USD, portfolio, download-nav, history,
  documents, performance, search).
- Pour chaque appel : verification de la presence d'une garde `res.ok` / `response.ok`,
  d'un `try/catch`, et de la forme du fallback cote consommateur (optional chaining ?.).

## 2. Constat (pattern recurrent a risque)

Les composants de fonds definissent des helpers du type :

```js
async function getPost(id) {
  const data = (await fetch(`${urlconstant}/api/valLiq/${id}`)).json();
  return data;
}
```

Probleme : aucun controle de `response.ok`. Si l'API renvoie 404/500 avec un corps
non-JSON, `.json()` rejette. Comme ces helpers s'executent en chaine sequentielle dans
`fetchData()`, l'echec d'un seul endpoint (ex: `valLiq`) interrompt TOUT le chargement
de la page (graphique non rendu, Swal qui ne se ferme pas correctement, page vide).

Helpers concernes (memes noms repliques dans plusieurs fichiers) :
- `getPost` -> `/api/valLiq/:id` ou `/api/valLiqdev/:id/:dev` (donnees graphique VL — CRITIQUE)
- `getlastvl1` / `getfonds` -> `/api/searchFunds`
- `getperfcategorieannuel` -> `/api/performancescategorie` / `performancesdevcategorie`
- `getperfind` / `getlastvl` -> `/api/performancesindice`, `/api/valLiq`
- `getclassement` -> `/api/classementquartilemysql` / `classementquartiledev`
- `getdateavailable` -> `/api/getdateavailable/:id`
- `getfavoris` -> `/api/favoritesdata/:id`
- `getallsociete` / `getpays` -> `/api/getsocieterecherche`, `/api/getPays`
- fetches inline (history) -> `performancemonthyear`, `performanceindicemonthyear`, valLiq(dev)

## 3. Correction appliquee (pattern defensif minimal)

Avant `.json()`, ajout d'une garde retournant un fallback sur que les consommateurs
gerent deja via optional chaining :

```js
async function getPost(id) {
  const response = await fetch(`${urlconstant}/api/valLiq/${id}`, {...});
  if (!response.ok) return null;          // consommateur: data?.data?.graphs
  return response.json();
}
```

Choix des fallbacks (verifies cote consommateur) :
- `null` pour les helpers dont le resultat est lu via optional chaining
  (`data?.data?.graphs`, `data1?.data?.funds`) ou passe a un `setState<... | null>`.
- `{ data: [] }` pour `getdateavailable`, car le consommateur fait `data3.data`
  (acces direct sans `?.`) — un `null` aurait provoque un crash.

Aucune URL, aucun calcul financier, aucune logique metier modifie. Aucune donnee
financiere inventee : sur echec API, on renvoie une valeur vide/nulle deja toleree.

### Cas particulier — history/FundSubView.tsx (fetches inline)
- Les fetches inline `performancemonthyear` / `performanceindicemonthyear` :
  enrobage `if (response.ok) { ... setState ... }` (les blocs etaient deja sous try/catch).
- Le fetch inline `url5` (valLiq/valLiqdev, donnees graphique) : ajout
  `if (!response5.ok) { Swal.close(); return; }` AVANT le `.map` sur `data5?.data?.graphs`,
  pour fermer proprement le loader et eviter un map sur undefined.

## 4. Fichiers modifies (9)

| Fichier | Helpers / fetches durcis |
|---------|--------------------------|
| src/app/funds/[fondId]/FundView.tsx | getlastvl1, getPost(valLiq), getperfcategorieannuel ; getdateavailable -> fallback {data:[]} |
| src/app/funds/summary-eur/[fondId]/FundSubView.tsx | getclassement, getdateavailable, getfavoris, getlastvl1, getPost(valLiqdev), getperfcategorieannuel |
| src/app/funds/summary-usd/[fondId]/FundSubView.tsx | getclassement, getperfcategorieannuel, getdateavailable, getfavoris, getlastvl1, getPost(valLiqdev) |
| src/app/funds/portfolio/[fondId]/FundSubView.tsx | getclassement, getdateavailable, getfavoris, getlastvl1, getPost(valLiq) |
| src/app/funds/download-nav/[fondId]/FundSubView.tsx | getclassement, getdateavailable, getfavoris, getlastvl1, getPost(valLiq) |
| src/app/funds/history/[fondId]/FundSubView.tsx | getclassement, getdateavailable, getfavoris, getlastvl1, getPost(valLiq) + 5 fetches inline (perf month/year + url5) |
| src/app/funds/documents/[fondId]/FundSubView.tsx | getfavoris, getlastvl1, getPost(valLiq) |
| src/app/funds/performance/[fondId]/page.tsx | getlastvl, getperfind, getperfcategorieannuel, getlastvl1 |
| src/app/funds/search/FundView.tsx | getfonds, getallsociete, getpays |

## 5. Appels NON modifies (laisses volontairement) et pourquoi

- **`src/lib/api.ts`** (apiGet/apiPost/apiUpload) : deja conformes (gestion 401 +
  `if (!response.ok)` + `.catch`). Aucune action.
- **`src/app/funds/summary-*/[fondId]/page.server.ts`, portfolio/download-nav/[fondId]/page.server.ts,
  funds/[fondId]/page.server.ts** : generation de metadata, deja gardes
  (`if (!response.ok) return { title: ... }` + try/catch). Aucune action.
- **Fetches POST d'actions (favorites add/remove, exportToExcel)** : soit deja gardes
  par `if (response.ok)`, soit effets de bord non bloquants pour le rendu. Non touches
  pour rester minimal et eviter tout changement de comportement.
- **fund-managers/** et **countries/** (FundView.tsx, page.server.ts) : memes helpers a
  risque que funds/, MAIS hors perimetre prioritaire de ce lot. A traiter dans un lot
  ulterieur identique (faible risque, meme pattern). NON modifies ici.
- **panels (admin/management/investor/country-panel/...)** et **questionnaire/** :
  ~600 fetch restants, majoritairement deja sous try/catch ou avec `if (response.ok)`.
  Hors perimetre du lot critique fonds. A auditer progressivement (lots courts) si besoin.
- **Aucun endroit "trop risque / logique entremelee"** n'a du etre laisse dans le perimetre
  fonds traite : toutes les corrections etaient des transformations 1-pour-1 sures.

## 6. Resultat build

- Commande : `npm run build` (Next.js 14.2.3) dans /home/user/front_end_opcvm
- Resultat : **Compiled successfully** — 0 erreur, 0 type error.
- Warnings : uniquement des `react-hooks/exhaustive-deps` PRE-EXISTANTS (pages KYC),
  sans rapport avec ces modifications.

## 7. Risque de regression

Tres faible. Modifications strictement additives : on n'ajoute qu'une garde qui, en cas
de reponse non-ok, renvoie une valeur vide deja toleree par les composants (optional
chaining / setState nullable). En cas de reponse ok (cas nominal), le comportement est
identique a l'avant (`response.json()`).
