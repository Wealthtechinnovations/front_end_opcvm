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

## T16 — pages secondaires (fund-managers, countries, country-panel)

Date : 2026-06-03
Suite directe de la section 5 (pages SECONDAIRES reportees a un lot ulterieur).
Meme pattern defensif que T14, applique a `src/app/fund-managers/**`,
`src/app/countries/**`, `src/app/country-panel/**`. Zero regression, additif uniquement.

### T16.1 Methode

- Recensement : **115 `fetch(`** dans les 3 arbres cibles (30 fichiers contiennent au moins un `fetch`).
- Cible : les helpers `(await fetch(...)).json()` / `await fetch(...)` puis `.json()` SANS garde
  `response.ok`, et les `generateMetadata` (page.server.ts) qui font `.json()` puis
  destructuration directe.
- Choix du fallback **verifie cote consommateur** (regle T14) :
  - `null` si le consommateur lit via optional chaining (`data?.x`) ou passe a un `setState<...|null>` ;
  - `{ data: [] }` si le consommateur fait un acces direct `data.data` ou `data?.data.X` (1er hop direct `.data`) ;
  - `[]` (cas nouveau) quand le consommateur affecte le retour a un `useState<T[]>` lu en `.map()` direct
    (ex: `setActualites(data8)` + `actualites.map`) : `null`/`{data:[]}` casseraient le `.map`.
- Les fetches inline sous loader Swal : enrobage `if (response.ok) { ... }` (loader ferme dans tous les cas).

### T16.2 Fichiers CORRIGES (26)

page.server.ts (generateMetadata) — durcis sur le modele DEJA present dans
`fund-managers/[fondId]/page.server.ts` (try/catch + `if (response.ok)` + fallback slug) :
| Fichier | Avant | Apres |
|---------|-------|-------|
| fund-managers/funds/[fondId]/page.server.ts | `fund.data.societe` direct | try/catch + ok + fallback `nom=slug` |
| fund-managers/statistique/[fondId]/page.server.ts | idem | idem |
| countries/funds/[fondId]/page.server.ts | `fund.data.pays` direct | try/catch + ok + fallback `pays=slug` |
| countries/statistique/[fondId]/page.server.ts | idem | idem |
| countries/fund-managers/[fondId]/page.server.ts | idem | idem |
| countries/[paysId]/page.server.ts | idem | idem |

FundView.tsx (helpers + fetches inline) :
| Fichier | Helpers durcis (fallback) |
|---------|---------------------------|
| fund-managers/[fondId]/FundView.tsx | getsociete `{data:[]}`, getallsociete `null`, getfavoris `null` ; inline `getSocietebyidfisrt?query` (handleDeviseChange) -> `if(ok){...}` |
| fund-managers/statistique/[fondId]/FundView.tsx | getsociete `{data:[]}`, getfavoris `null` ; 2 inline `getSocietebyidstat` (fetchData + handleDeviseChange) -> `if(ok){...}` |
| fund-managers/funds/[fondId]/FundView.tsx | getsociete `{data:[]}`, getFonds `{data:[]}` |
| fund-managers/search/FundView.tsx | getsociete `{data:[]}`, getpays `{data:[]}` |
| countries/[paysId]/FundView.tsx | getsociete `{data:[]}`, getpays `null`, getfavoris `null` (les 2 inline handleDeviseChange etaient deja gardes `if(!response.ok) throw`) |
| countries/fund-managers/[fondId]/FundView.tsx | getsociete `{data:[]}`, getpays `{data:[]}`, getlastvl1 `null` (dead, harmonise) |
| countries/funds/[fondId]/FundView.tsx | getFonds `{data:[]}` |
| countries/statistique/[fondId]/FundView.tsx | getfavoris `null` ; inline `getPaysbyidstat` (fetchData) -> `if(ok){...}` (handleDeviseChange deja garde) |
| countries/FundView.tsx | getpays `null` (consommateur `setPays(data)` etat `Funds|null` + catch affiche deja un message d'erreur) |

country-panel (pages rendu-critiques) :
| Fichier | Helpers durcis (fallback) |
|---------|---------------------------|
| country-panel/dashboard/page.tsx | getsociete `{data:[]}`, getFonds `null`, getactualite `[]`, getpays `{data:[]}`, getregulateur `{data:[]}`, getdevise `{data:[]}` |
| country-panel/fonds/page.tsx | getFonds `null` (etat `Funds|null`, init null deja tolere par `funds?.data?.funds.slice/map`) |
| country-panel/validated-funds/page.tsx | getFonds `null` (idem) |
| country-panel/news/page.tsx | getactualite `[]` (etat `Actualite[]`, `actualites.map` direct) |
| country-panel/anomalies/page.tsx | getAnomalie `{data:[]}` (consommateur `setFundsData(data.data)`, etat `Fund[]`) |
| country-panel/anomalies/nav-anomalies/page.tsx | inline fetchData `getfondsanomalie` -> `if(ok){...}` (3 helpers getPortefeuille/getlastvl1/getlastvl2 = MORTS, laisses) |
| country-panel/fonds/details/page.tsx | getMissingDates `[]`, getMissingindDates `[]`, getFonds(valLiq) `null` |
| country-panel/validated-funds/details/page.tsx | idem (3 helpers) |
| country-panel/fonds/update/page.tsx | getpays `{data:[]}`, getregulateur `{data:[]}`, getdevise `{data:[]}` |
| country-panel/validated-funds/update/page.tsx | idem (3 helpers) |
| country-panel/add-nav/page.tsx | getpays `{data:[]}`, getregulateur `{data:[]}`, getdevise `{data:[]}` |

Note importante sur le fallback `null` pour les listes de fonds country-panel
(`getFonds` de fonds/validated-funds/dashboard) : l'etat est `useState<Funds | null>(null)`
et le rendu utilise `funds?.data?.funds.slice/map`. Retourner `null` reproduit EXACTEMENT
l'etat initial `null` deja tolere par la page au premier rendu — donc strictement non regressif.

### T16.3 Endroits LAISSES volontairement (et pourquoi)

- **Helpers MORTS (definis, jamais appeles)** : `searchFunds` (8 fichiers FundView),
  `getlastvl1` (countries/fund-managers, add-nav, update), `getPortefeuille`/`getlastvl1`/`getlastvl2`
  (nav-anomalies). Aucun consommateur a proteger ; meme politique que T14 (qui n'avait pas
  touche `searchFunds`). Non modifies pour rester minimal.
- **`fondscharge(id)`** (fonds/update + validated-funds/update) : ENTREMELE avec l'etat de
  formulaire. Consommateur `setFund(data2)` ou `fund` est `useState<FormData>({...})` (objet a
  ~30 champs string lus directement dans des inputs controles). Un fallback `null`/`{data:[]}`
  changerait la forme de l'objet et risquerait des warnings React controlled/uncontrolled
  (changement de comportement). LAISSE intact et signale, conformement a la regle "ne pas
  toucher si trop entremele".
- **Chaines `.then(response => response.json())` de soumission de formulaire** (fund-managers/funds,
  fund-managers/search, countries/fund-managers, countries/funds — `listeproduitsociete` /
  `listesociete` / `listesocietepays` / `listeproduitpayssociete` avec `?query=`) : toutes
  possedent deja un `.catch()` qui ferme le loader et affiche un Swal d'erreur. Deja
  defensives ; non touchees (meme politique POST que T14).
- **Fetches POST inline dans fetchData** (`listeproduitsociete`/`listesociete`/... en POST sans
  query) : sous try/catch avec `if (responseData && responseData.code === 200)`. Le `.json()`
  potentiellement rejete est capture par le try/catch environnant. Non touches (deja proteges).
- **page.server.ts deja garde** : `fund-managers/[fondId]/page.server.ts` (modele de reference).
- **country-panel/login, login/register, import-nav** : possedent deja des gardes `response.ok`
  (POST auth/upload). Non touches.

### T16.4 Resultat build

- Commande : `npm run build` (Next.js 14.2.3) dans /home/user/front_end_opcvm.
- Resultat : **✓ Compiled successfully** — 0 erreur, 0 type error.
- Warnings : uniquement `react-hooks/exhaustive-deps` PRE-EXISTANTS (pages KYC), aucun
  fichier touche par T16 n'en genere.

### T16.5 Risque de regression

Tres faible, identique a T14. Sur reponse ok (nominal) : comportement strictement inchange
(`response.json()`). Sur reponse non-ok : valeur vide deja toleree par le consommateur
(verifie au cas par cas : optional chaining, setState nullable, ou `[]` pour les etats tableau).
Aucune URL, aucun calcul financier, aucune logique metier, aucune donnee inventee.
