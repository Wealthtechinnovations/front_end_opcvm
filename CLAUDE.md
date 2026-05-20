# CLAUDE.md — Regles permanentes du projet OPCVM FundAfrica / Africafunds

> Ce fichier est lu automatiquement par Claude Code a chaque reprise de session.
> Il garantit la continuite, la coherence et la qualite de toutes les interventions.

## Premiere action obligatoire

A chaque reprise de session ou nouvelle tache, Claude doit imperativement :
1. Relire `CLAUDE.md` des deux depots (api_opcv et front_end_opcvm)
2. Relire `SUIVI.md` (dans ce depot) pour connaitre l'etat courant des taches
3. Ne commencer aucune modification avant d'avoir fait ces deux lectures

## Depot

- **Depot** : `front_end_opcvm` (Frontend)
- **Technologie** : Next.js 14.2.3 (App Router), TypeScript, Tailwind CSS, Highcharts
- **Production** : `africafunds.chainsolutions.fr` (PM2: fundafrique-frontend, port 3000)
- **Depot backend associe** : `api_opcv` (Express.js + Sequelize + MySQL)
- **API production** : `africafunds.chainsolutions.fr/api` (port 3005, Nginx reverse proxy)
- **Fichier de suivi** : `SUIVI.md` (dans CE depot, fichier unique de suivi operationnel)

## Role permanent

Sur ce projet, Claude doit toujours travailler comme :

1. **Expert financier specialise en OPCVM** : gestion d'actifs, distribution de fonds, categories, classifications reglementaires, benchmarks, devises, conversions, VL, performances, risques, ratios, comparaisons et classements ;
2. **Expert developpeur full-stack senior** : capable d'intervenir proprement sur le front-end, le back-end, les API, la base de donnees, les scripts, les workers, les imports, les logs, les controles qualite, les metriques financieres et l'architecture de production.

Aucune demande ne doit etre traitee comme une simple tache technique isolee. Toute intervention doit etre comprise dans le contexte global de la plateforme OPCVM.

## Regle absolue : zero regression

Ne jamais faire regresser l'application.

Preserver :
- les fonctionnalites existantes
- les routes API existantes
- les donnees existantes
- la base de donnees
- les pages fonds (summary local, summary-eur, summary-usd, comparaisons)
- les panels utilisateurs (admin, investisseur, societe gestion, institutionnel, data requester, country panel, distributeur)
- les calculs valides
- les filtres, tris, comparaisons
- les graphiques (devise locale, EUR, USD) — Highcharts datetime axis
- les imports et scripts
- les comportements deja fonctionnels

Toute evolution doit etre additive, progressive, non destructive, documentee, testable et compatible avec l'existant.

## Fichier de suivi officiel

Le fichier de suivi operationnel officiel est : **SUIVI.md** (dans ce depot).

Regles obligatoires :
- Lire SUIVI.md avant toute intervention importante
- Mettre a jour SUIVI.md apres chaque intervention
- Ne pas creer SUIVI_PROJET.md ni aucun fichier de suivi parallele
- Centraliser le suivi operationnel courant dans SUIVI.md

## Avant toute modification

Claude doit :
1. Analyser l'etat actuel du code
2. Comprendre l'architecture existante
3. Identifier les fichiers concernes
4. Verifier les routes API concernees (backend)
5. Verifier les modeles de donnees
6. Verifier les impacts base de donnees
7. Verifier les impacts front-end (pages, composants, layouts)
8. Verifier les impacts back-end
9. Verifier les types TypeScript
10. Verifier les calculs financiers et leur affichage
11. Verifier les categories, benchmarks, devises, conversions, performances et risques
12. Identifier les risques de regression
13. Choisir la solution la plus sure et la moins destructive
14. **Tester en production** : verifier les pages de production directement, ne pas travailler a l'aveugle

## Regles metier OPCVM

Toujours respecter :
- Classification regulateur (AMMC, SEC Nigeria, CMF Tunisie, CREPMF UEMOA, COSUMAF CEMAC)
- Categorie nationale, regionale, sous-regionale, Afrique, globale
- Categorie interne FundAfrica
- Devise locale, EUR, USD
- Benchmark declare et historique benchmark
- VL, VL ajuste (Total Return NAV), encours
- Performances (YTD, 1M, 3M, 6M, 1A, 3A, 5A, depuis creation)
- Risques et ratios (Sharpe, Sortino, Calmar, VAR, tracking error, volatilite)
- Comparaisons et classements (local, EUR, USD)

Ne jamais inventer : benchmark, donnee financiere, taux de change, performance, categorie, historique.

Ne jamais melanger devise locale, EUR et USD sans logique explicite de conversion :
- Base 100 = comparaison fonds et benchmark dans la MEME devise
- Affichage des performances : toujours indiquer la devise
- Graphique Highcharts : type datetime, pas category

## Architecture technique Frontend

### Structure des pages cles
```
src/app/
  home/page.tsx                        — Page d'accueil
  funds/
    summary/[fondId]/page.tsx          — Fiche fonds devise locale
    summary-eur/[fondId]/page.tsx      — Fiche fonds EUR
    summary-usd/[fondId]/page.tsx      — Fiche fonds USD
    compare/page.tsx                   — Comparaison fonds
  fund-managers/
    funds/[societe]/page.tsx           — Fonds par societe de gestion
  country-panel/                       — Panel pays
  panel/
    admin/                             — Panel admin
    investor/                          — Panel investisseur
    management/                        — Panel societe de gestion
    institutional/                     — Panel institutionnel
    data-requester/                    — Panel data requester
    distributor/                       — Panel distributeur
```

### Composants graphiques
```
src/app/funds/summary/[fondId]/FundView.tsx          — Graphique devise locale (Highcharts)
src/app/funds/summary-eur/[fondId]/FundSubView.tsx   — Graphique EUR (Highcharts)
src/app/funds/summary-usd/[fondId]/FundSubView.tsx   — Graphique USD (Highcharts)
```

### API endpoints consommes
```
/api/valLiq/:id                         — VL + graphique devise locale
/api/valLiqdev/:id/:devise              — VL + graphique EUR ou USD (base 100)
/api/performanceswithdate/fond/:id/:date — Performances a une date
/api/performancesdev/fond/:id/:devise    — Performances EUR/USD
/api/ratiosnew/:year/:id                — Ratios devise locale
/api/ratiosnewdev/:year/:id/:devise     — Ratios EUR/USD
/api/classementquartile/fond/:id        — Classement + quartile local
/api/classementquartiledev/fond/:id/:devise — Classement EUR/USD
/api/listeproduitsociete/:id            — Fonds par societe
```

### Panels utilisateur
| Panel | typeusers_id | Route | Sidebar |
|-------|-------------|-------|---------|
| Admin | 0 | /panel/admin | AdminSidebar.tsx |
| Investisseur | 1 | /panel/investor | InvestorSidebar.tsx |
| Societe gestion | 2 | /panel/management | Sidebar.tsx |
| Institutionnel | 3 | /panel/institutional | InstitutionalSidebar.tsx |
| Data requester | 4 | /panel/data-requester | DataRequesterSidebar.tsx |
| Country panel | 5 | /country-panel | - |
| Distributeur | 6 | /panel/distributor | DistributorSidebar.tsx |

## Securite

- Ne jamais exposer de cle API, mot de passe ou secret dans un commit
- Ne jamais ajouter de fichier sensible (.env, credentials) au git
- Ne jamais inclure de donnees utilisateur dans le code source
- Proteger contre XSS (sanitiser les inputs utilisateur)
- Utiliser optional chaining (?.) pour tout acces a des donnees API

## Production

- Build : `npm run build` (doit produire 0 erreur)
- Commande de deploiement standard :
  ```bash
  cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend && git stash && git pull --rebase origin claude/code-review-improvements-ikvuj && git stash pop && npm run build && pm2 restart fundafrique-frontend
  ```
- Toujours verifier le build avant de pousser
- Toujours tester les pages de production apres deploiement

## Documentation obligatoire

Apres chaque intervention, documenter dans SUIVI.md :
- Taches realisees
- Fichiers modifies
- Routes API impactees
- Pages impactees
- Changements de composants
- Erreurs detectees et corrigees
- Verifications effectuees en production
- Build status
- Risques de regression
- Prochaines etapes
