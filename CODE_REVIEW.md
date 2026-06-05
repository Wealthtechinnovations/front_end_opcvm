# CODE_REVIEW — Audit technique et dette technique

## Risques critiques

### 1. ~~Injection SQL dans analytics.js~~ — CORRIGE (2026-06-01)
- Fichier: src/routes/analytics.js
- Probleme: Interpolation directe de parametres dans les requetes ClickHouse (classement-historique routes)
- Correction: Whitelist validation pour devise/date + requetes parametrees ClickHouse ({paramName:Type} + query_params)
- Commit: `acb09b8` (api_opcv)

### 2. Pas d'index UNIQUE sur valorisations(fund_id, date)
- Table: valorisations
- Probleme: Seul un index non-unique idx_valorisations_fund_id_date existe
- Impact: Doublons possibles, INSERT IGNORE inefficace
- Priorite: MOYENNE
- Recommandation: Ajouter un index UNIQUE apres nettoyage des doublons existants

### 3. ~~Route classementmysql TRUNCATE destructif~~ — CORRIGE (2026-06-02)
- Fichier: src/routes/apigestionsavequotidien.js
- Probleme: 3 routes classement (local/EUR/USD) faisaient TRUNCATE avant recalcul. Si interrompu, donnees perdues.
- Correction: Remplacement TRUNCATE par DELETE transactionnel (transaction.commit/rollback)
- Routes corrigees: /api/classementmysql, /api/classementeur, /api/classementusd

## Dette technique

### 4. ~~Aucun test automatise~~ — PARTIELLEMENT CORRIGE (T24, 2026-06-05)
- API: 118 tests unitaires (8 suites) couvrant slug, dates, performances, newratios2, utils
- Frontend: 0 tests (Next.js App Router — a evaluer)
- Commits API: `ff81ae6`, `f91d53d`, `771434e`

### 5. apigestionsavequotidien.js — fichier monolithique
- Taille: ~1800 lignes
- Recommandation: Deja partiellement refactorise (ranking.service.js). Continuer extraction.

### 6. performance_historique ClickHouse vide
- Table: performance_historique dans ClickHouse
- Probleme: Table creee mais jamais peuplee
- Recommandation: Implementer le backfill depuis MySQL

### 7. ~~11 fonds sans classification~~ — CORRIGE (2026-05-21)
- Correction: Tous les 1196 fonds classes (100% coverage)
- Voir tache A1 dans SUIVI.md

### 8. ~~NaN dans affichage performances~~ — CORRIGE (2026-06-01)
- Fichier: src/app/funds/performance/[fondId]/page.tsx
- Probleme: parseFloat(undefined) < 0 retourne false → cellules vides affichees en vert (text-success)
- Correction: Helpers `perfColorClass`/`diffColorClass` qui retournent '' pour NaN
- Commit: `f8ae92e` (front_end_opcvm)

### 10. Credentials hardcodes dans sync_production.sh — CORRIGE (2026-06-01)
- Fichier: scripts/deploy/sync_production.sh
- Probleme: Mot de passe DB en clair dans le script
- Correction: Remplacement par `source .env` + variables avec fallback
- Commit: `acb09b8` (api_opcv)

### 11. ~~Manque d'automatisation data pour Tunisie~~ — CORRIGE (2026-06-02) / UEMOA, CEMAC
- ~~TUNISIE: Script import existe (import_vl_tunisie_cmf.js) mais pas de scraper CMF automatise~~
  - Correction: Scraper Python automatise cree (`scripts/scraper/cmf_tunisie_daily.py`)
  - Scraping CMF multi-pages, parsing Excel bi-section, matching fuzzy, quarantaine extremes >20%
  - Cron deploye: `0 19 * * 1-5` dans crontab production (2026-06-03)
- UEMOA: Script import existe (import_vl_uemoa.js) mais pas de scraper BRVM automatise

### 26. ~~Generalisation response.ok frontend~~ — CORRIGE (2026-06-03, T14+T16)
- Probleme: 87% des fetch() frontend faisaient `.json()` sans verifier `response.ok`, causant des crashs JSON.parse quand API renvoie 404/500.
- T14: 9 pages fonds critiques durci (summary local/EUR/USD, portfolio, download-nav, history, documents, performance, search). Commit `4c49a44`. DEPLOYE.
- T16: 26 pages secondaires durci (countries/, country-panel/, fund-managers/). 115 fetch audites. Commit `2814e9a`. A deployer.
- Pattern: `if (!response.ok) return null|{data:[]}|[]` selon consommateur (verifie). Build OK, QA zero regression.
- Reste: helpers morts non touches (volontaire), formulaires entremeles (fondscharge) notes pour traitement ulterieur prudent.

### 31. ~~Couverture indRef EUR/USD~~ — UEMOA RESOLU (T15c, 2026-06-04), TUNISIE/CEMAC ouvert
Resultat final UEMOA : **111/111 fonds (100%), 33 830/33 830 VL (100%)** local + EUR + USD.
- Avant T15: 8/111 fonds (7.2%), 7 577/33 830 VL (22.4%)
- Corrections: mapping BRVM + division EUR/USD + DB fallback + case-insensitive matching
- Commits API: `f6d7cb2`, `ac1cf98`, `2990351`. Execution prod: step 2 + step 4 + perfs + classements.
- TUNISIE: indRef LOCAL 100%, conversion EUR/USD 24%. Attente fichier utilisateur pour refonte data.
- CEMAC 0%: aucun indice BVMAC dans indice_references. Decision metier requise.

### 32. ~~Incohérence conversion devise routes_vl.js~~ — CORRIGE (T17, 2026-06-04)
- Fichier: api_opcv/src/routes/routes_vl.js
- Probleme: 10 lignes utilisaient MULTIPLICATION au lieu de DIVISION pour conversion local→EUR/USD
- Routes affectees: `POST /api/updateValues/:id` (lignes 3027-3039) + `POST /api/uploadsfilevl/:id` (lignes 6334-6347)
- Champs corriges: value_EUR/USD, actif_net_EUR/USD, dividende_EUR/USD
- Preuve de la regle: indRef_EUR/USD dans le meme fichier (lignes 6352-6353) utilisait deja la division correcte
- Impact: ces routes ecrivent directement en base — les VL inserees via upload CSV ou saisie manuelle avaient des conversions EUR/USD fausses
- Note: les conversions EUR↔USD dans le contexte portefeuille (lignes 2383-2392, 2518-2527) sont un cas different (cross rate) et n'ont pas ete modifiees

### 33. ~~import_indices_excel.js step 4 multiplication→division~~ — CORRIGE ET DEPLOYE (T15c)
- **FIX T15** `f6d7cb2`: `indRef * rate` → `indRef / rate` (division, coherent avec recalc_eur_usd_daily_rate.js)
- **DEPLOYE** et re-execute en production: 26 253 VL UEMOA convertis correctement
- Sanity check: XOF local=198.58 eur=0.29 → DIVISION confirmee (OK)

### 34. Donnees UEMOA/CEMAC stales
- UEMOA: donnees stales 233 jours (derniere VL 2025-10-15), pas de scraper BRVM automatise
- CEMAC: donnees stales 539 jours (derniere VL 2024-12-12), aucune source COSUMAF identifiee

### 35. ~~Routes API sans try/catch (hanging requests)~~ — CORRIGE (T22, 2026-06-05)
- 20 routes async avec `await` sans try/catch dans 5 fichiers (apigestionpays, apigestionsociete, apigestionfonds, apigestionsavequotidien, routes_vl)
- 2 helpers `findCategoryByFundId` avec `sequelize.query()` sans error handling
- Fix special: `/api/tsr/:year` n'envoyait aucune reponse et faisait `throw` direct
- Commits API: `d386ec6`, `5c3b26b`, `6966852`

### 36. ~~Null-safety frontend + response.ok search/comparison~~ — CORRIGE (T23, 2026-06-05)
- 4 `.map()` sans `?.` dans FundView.tsx (funds, graphs, adaptValues1, meilleursFonds)
- 5 `excelData[0]` sans guard dans download CSV (5 fichiers)
- 5 `dates.length` sans `?.` dans pages detail panel/country-panel
- 7 fetch sans `response.ok` dans tools/search, tools/comparison, funds/search
- Commits Frontend: `55b1442`, `bf5a8b9`

### 9. Gateway microservices non active
- Fichier: services/gateway/index.js + serviceRegistry.js
- Probleme: Architecture microservices preparee mais non utilisee en production (monolithe actif)
- Recommandation: Documenter comme roadmap, ne pas activer sans migration complete

### 12. ~~eval() RCE dans routes_vl.js~~ — CORRIGE (2026-06-01)
- 144 appels eval() avec donnees utilisateur (req.body.formData.value)
- Remplacement par parseFloat() comparisons et objet fieldValues
- Commit: `1187ccb` (api_opcv)

### 13. ~~Multer sans limite de taille~~ — CORRIGE (2026-06-01)
- 13 fichiers routes avec `multer({ dest: 'uploads/' })` sans fileSize limit
- Ajout `limits: { fileSize: 5 * 1024 * 1024 }` (5MB)
- Commit: `8834c14` (api_opcv)

### 14. ~~Rate limiting insuffisant sur auth~~ — CORRIGE (2026-06-01)
- Routes login/password avaient seulement le rate limit global (200/15min)
- Ajout rate limit strict 10 req/15min sur /api/login, /api/userlogin, /api/forgot-password, /api/reset-password
- Commit: `8834c14` (api_opcv)

### 15. ClickHouse queries non parametrees dans apigestionsavequotidien.js (batch routes)
- INSERT INTO et ALTER TABLE UPDATE avec interpolation directe
- Risque: FAIBLE (donnees viennent de MySQL, pas d'input utilisateur)
- Recommandation: Refactorer vers client.insert() pour les INSERT (effort moyen)
- Les SELECT ont ete parametres (commit `2f320b5`)

### 16. ~~totalfondscompose logic bug~~ — CORRIGE (2026-06-02)
- Fichier: src/routes/apigestionpays.js (lignes 457, 501, 545)
- Probleme: `totalfondscompose += totalfondscompose` doublait la valeur au lieu d'incrementer (+= 1)
- Impact: Comptage fonds errone sur les pages pays (EUR, USD, local)
- Commit API: `f3ddd6a`

### 17. ~~6 routes admin sans .catch()~~ — CORRIGE (2026-06-02)
- Fichier: src/routes/routes_vl_admin.js
- Routes: getfraisbyadmin, getfondbyadmin, getfondbyuser, getfondbyuservalide, getfondbysociete, getfondbypays
- Probleme: .then() sans .catch() — requetes qui hangent en cas d'erreur DB
- Commit API: `f3ddd6a`

### 18. ~~7 page.server.ts crash si API indisponible~~ — CORRIGE (2026-06-02)
- Fichiers: funds/[fondId], documents, download-nav, history, portfolio, summary-eur, summary-usd
- Probleme: pas de response.ok check ni null guard sur fund.funds
- Commit Frontend: `4af1b35`

### 20. ~~Crash page fonds "Cannot read properties of undefined (reading '1')"~~ — CORRIGE (2026-06-03)
- Fichier: src/app/funds/[fondId]/FundView.tsx (lignes 1558, 1567, 1576)
- Probleme: className ternaire `slicedPostc && slicedPostc[N] && isNaN(...) ? '' : parseFloat(slicedPostc[N][1]) < 0 ...`
  La branche else evalue `slicedPostc[N][1]` quand `slicedPostc[N]` est undefined → crash client.
- Declencheur: fonds "rendement" avec < 4 perfs annuelles benchmark (slicedPostc = postc.data.multipliedValues)
  Ex: AC SECUR RENDEMENT (MA0000038630)
- Correction: garde `!slicedPostc?.[N] || isNaN(...)` qui couvre aussi la branche else (coherent avec cellules valeur)
- Commit Frontend: a deployer

### 19. ~~Forex EUR/TND data quality~~ — RESOLU (2026-06-03)
- Diagnostic production 2026-06-03: EUR/TND = 5963 entrees, 100% value>0, derniere 2026-06-03
- Le probleme initial (1 seule value>0) etait deja resolu par les imports anterieurs
- scrape_forex_import.js execute: 0 corrections necessaires, donnees saines
- Note residuelle: EUR/TND min_val=0.06 (vs max 3.46) → quelques entrees anciennes suspectes a investiguer (priorite FAIBLE)

### 19-bis. Forex EUR/TND data quality — historique (2026-06-02)
- Table: devisedechanges
- Probleme: 5,959 entries EUR/TND mais seule 1 avec value>0 (Yahoo Finance ne renvoie pas TND valide)
- Impact: Toutes les conversions EUR pour fonds tunisiens utilisent un seul point de donnee
- Fix: ECB fallback + cross-rate derivation + cleanup value=0 dans scrape_forex_import.js
- Commit API: `97a5f22`
- Statut: Code pousse, a deployer et executer sur production

### 21. ~~Math.random() fake data dans pages fonds~~ — CORRIGE (2026-06-03)
- Fichiers: portfolio/FundSubView.tsx (3 cellules affichaient des % aleatoires au lieu de benchmark)
- Aussi: FundView.tsx, summary-eur/FundSubView.tsx, summary-usd/FundSubView.tsx, download-nav/FundSubView.tsx (code mort)
- Impact: Utilisateurs voyaient des performances inventees dans la page portfolio
- Correction: Remplacement par '-' (pas de donnees benchmark disponibles sur cette page)
- Commit Frontend: `b7c962b`

### 22. ~~8 routes admin sans authentification~~ — CORRIGE (2026-06-03)
- Fichier: src/routes/routes_recalc_admin.js
- Probleme: Toutes les routes /api/admin/recalc/* et /api/admin/import/* et /api/admin/scheduler/* etaient accessibles sans token JWT
- Impact: N'importe qui pouvait trigger des recalculs, annuler des jobs, activer/desactiver le scheduler
- Correction: Ajout authenticate + authorize('admin') sur les 8 routes
- Bonus: authorize() accepte maintenant typeusers_id=0 comme admin fallback
- Commit API: `5540d95`

### 23. Routes valLiq/valLiqdev retournaient 500 au lieu de 404
- Fichier: src/routes/apigestionfonds.js
- Probleme: /api/valLiq/:id et /api/valLiqdev/:id/:devise retournaient HTTP 500 pour des fonds inexistants
- Correction: Ajout validation fundId (400) + changement empty results 500→404
- Commit API: `bb03081`

### 24. cron_daily_eur_usd.sh sans bit executable — CORRIGE (2026-06-03)
- Correction: chmod +x
- Commit API: `5540d95`

### 29. ~~Classement national local (type 1) systematiquement vide~~ — CORRIGE (2026-06-03)
- Fichier: src/services/ranking.service.js (calculateRankNational)
- Probleme: filtre `WHERE date = :date` (datejour du fond) exigeait que tous les pairs aient la meme derniere date de VL. Comme les fonds se mettent a jour a des jours differents, le classement national etait vide → non affiche sur la page devise locale.
- Correction: `MAX(date)` par fond (INNER JOIN), pattern identique au regional/global valide
- Effet: apres recalcul `classementmysql`
- Commit API: `6644682`

### 30. ~~Totaux classement EUR/USD gonfles (doublons de date)~~ — CORRIGE (2026-06-03)
- Fichier: src/services/ranking.service.js (calculateRankNationalDev/RegionalDev/GlobalDev)
- Probleme: lecture de TOUTES les dates par fond dans performences_eurs/usds (~4/fond) → totaux multiplies (ex OBLIGATIONS MAROC USD: 1883 au lieu de ~344), rangs fausses
- Correction: helper `keepLatestPerFund()` (derniere date par fond)
- Effet: apres recalcul `classementeur`/`classementusd`
- Commit API: `6644682`

### 31. ~~Page USD: benchmark annuel en EUR~~ — CORRIGE (2026-06-03)
- Fichier: src/app/funds/summary-usd/[fondId]/FundSubView.tsx (getperfcategorieannuel)
- Probleme: `dev="EUR"` hardcode sur la page USD → performance categorie annuelle du benchmark en EUR
- Correction: `dev="USD"`
- Commit Frontend: `be1b45e`

## Dette technique restante

### 25. ~~routes_vl.js — 11 .then() sans .catch() hors try/catch~~ — CORRIGE (2026-06-03)
- Routes: getportefeuillebyuser, getportefeuille, getDevises, getSocietes, getSocietesbypays, getPays, getData, performancesportefeuillewithindice, ratiosportefeuille, ratiosportefeuilledev
- /api/comparaison etait deja correctement gere
- Solution: Ajout .catch() avec log + res.status(500).json
- Commit API: `5b70838`

### 26. 87% des fetch() frontend sans response.ok check
- 638 appels fetch(), seulement 81 avec response.ok check (12.7%)
- Impact: Erreurs API silencieuses, donnees corrompues affichees
- Priorite: MOYENNE

### 27. ClickHouse performance_historique jamais peuple
- Table creee mais aucun script de backfill n'existe
- Aucune route API ne lit cette table
- Priorite: FAIBLE (a creer quand ClickHouse sera installe en production)

### 28. Duplication massive panels (10,000-14,000 lignes)
- **admin/pending-funds vs management/pending-funds**: 99% identique (~6,500 lignes). Difference: AdminSidebar vs Sidebar, API getfondbyadmin vs getfondbyuser/{id}
- **management/pending-funds vs country-panel/fonds**: 85-92% similaire (~2,800 lignes). Differences: layout, hooks, form fields (souscription vs dividende)
- **country-panel/fonds vs country-panel/validated-funds**: 97% identique (~2,100 lignes). Seule difference: API endpoint (getfondbyuser vs getfondbyuservalide)
- **panel/investor vs panel/portfolio**: 50 pages identiques dans chaque repertoire
- Impact: Maintenance x3-4, corrections inconsistantes, risque de divergence
- Priorite: MOYENNE (fonctionnel mais dette technique lourde)
- Recommandation: Extraire composants partages parametres par role (sidebar, API endpoint, user context)

### 37. newratios2.js — inconsistance format input portfolio vs benchmark
- Fichier: src/functions/newratios2.js
- Probleme: Les fonctions haut-niveau (calculateBetanew, calculateTrackingError, calculateInformationRatio, calculateUpCaptureRatio, calculateDownCaptureRatio, calculateDownsideBeta) traitent le portfolio via `calculateRendementsForPeriod()` (attend objects `{vl}`, retourne numbers) mais le benchmark via `selectDataForPeriod()` (juste slice, garde le format original)
- Impact: Si benchmark est passe en objects `{vl}`, `calculateCovariance()` recoit des objects au lieu de numbers → crash `math.mean()`. Si benchmark est passe en numbers, `selectDataForPeriod` retourne des numbers → fonctionne, mais l'API appelante doit connaitre cette asymetrie
- Priorite: FAIBLE (les appelants actuels dans apigestionratios.js semblent passer le bon format)
- Recommandation: Uniformiser en passant portfolio ET benchmark a travers `calculateRendementsForPeriod`, ou documenter l'asymetrie

### 38. ~~ratioInfo.js — code incomplet non fonctionnel~~ — SUPPRIME (T28, 2026-06-05)
- Fichier: src/functions/ratioInfo.js (supprime)
- Probleme: `calculateInformationRatio()` utilisait `moyExces` et `volatility` jamais definis
- Zero imports dans tout le codebase (confirme par grep)
- Commit API: `c0304ab`

### 39. Cron monitoring sans alerting
- Fichier: scripts/monitoring/check_cron_health.js
- Probleme: Le script verifie correctement la fraicheur des donnees (VL, classements, forex, performances, logs) mais les resultats ne sont ecrits que dans les logs — aucun mecanisme d'alerte email/Slack
- Manquent egalement: API health checks HTTP, monitoring PM2, disk space, log rotation
- Impact: Les pannes de cron ne sont detectees que par inspection manuelle des logs
- Priorite: MOYENNE
- Recommandation: Ajouter email alert wrapper ou webhook Slack sur exit code non-zero

### 40. fix-brvm-nginx.py — script fantome dans crontab
- Crontab reference: `*/5 * * * * fix-brvm-nginx.py`
- Le script n'existe pas sur le filesystem
- Impact: Erreur silencieuse dans cron toutes les 5 minutes (stderr redirige nulle part)
- Recommandation: Supprimer l'entree crontab ou creer le script si necessaire

### 41. ~~Panels portfolio/portefeuille sans authentification middleware~~ — CORRIGE (T25, 2026-06-05)
- Fichier: src/middleware.ts
- Probleme: `/panel/portfolio/*` et `/panel/portefeuille/*` n'etaient pas dans panelConfig → acces sans JWT
- Impact: Pages dashboard, favorites, selected-funds, reconstruction accessibles sans authentification
- Correction: Ajout des 2 paths avec allowedTypes: [1] (investor)
- Commit Frontend: `71b791b`
