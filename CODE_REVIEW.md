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

### 4. ~~Aucun test automatise~~ — PARTIELLEMENT CORRIGE (T24+T29, 2026-06-05)
- API: 199 tests unitaires (12 suites) couvrant slug, dates, performances, newratios2, utils, delai_Beta, ratios, beta, delai_Beta_capture
- Frontend: 0 tests (Next.js App Router — a evaluer)
- Commits API: `ff81ae6`, `f91d53d`, `771434e`, `c6812ed`

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

### 23. ~~Routes valLiq/valLiqdev retournaient 500 au lieu de 404~~ — CORRIGE
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

### 26. 87% des fetch() frontend sans response.ok check — PARTIELLEMENT CORRIGE (T23+T30b)
- T23: 7 fichiers corriges (tools/search, tools/comparison, funds/search, country-panel)
- T30b: 15 fichiers publics corriges (countries, fund-managers, funds pages, comparison-view)
- Restant: ~120 locations dans panels (admin, investor, management, portfolio, distributor, data-requester)
- Priorite: BASSE (panels derriere auth, impact utilisateur limite)

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

### 37. ~~newratios2.js — inconsistance format input portfolio vs benchmark~~ — CORRIGE (T30, 2026-06-11)
- Fichier: src/functions/newratios2.js
- Probleme: 6 fonctions dual-input (Beta, TrackingError, IR, UpCapture, DownCapture, DownsideBeta) traitaient le benchmark via `selectDataForPeriod()` (juste slice) au lieu de `calculateRendementsForPeriod()` (conversion objets→rendements)
- Correction: Les 6 fonctions utilisent maintenant `calculateRendementsForPeriod()` pour les deux inputs
- Note: newratios2.js n'est pas importe par les routes de production (newratios.js est utilise a la place)
- Commit API: `eed7d88`

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

### 42. ~~Route ClickHouse /api/classementquartile/:id — crash systematique~~ — CORRIGE (audit 2026-06-13)
- Fichier: api_opcv/src/routes/apigestionquartile.js (ligne 81-141)
- Probleme: `clickhouse` jamais importe ni initialise — tout appel crashait avec ReferenceError. Parametres `?` non lies (SQL injection potentielle si ClickHouse etait connecte).
- Impact: Route morte, non utilisee par le frontend (qui utilise `/api/classementquartilemysql/:id`), mais crash serveur si appelee directement
- Correction: Remplacement par un handler 410 Gone renvoyant vers la route MySQL
- Priorite: BASSE (dead code)

### 43. ~~Path traversal dans multer filename~~ — CORRIGE (audit 2026-06-13)
- Fichier: api_opcv/src/routes/routes_vl.js (ligne 332)
- Probleme: `file.originalname` utilise tel quel dans le nom de fichier — un attaquant peut injecter `../../etc/cron.d/malicious`
- Correction: Ajout `path.basename(file.originalname)` pour ne garder que le nom de fichier
- Priorite: HAUTE

### 44. Routes d'ecriture sans middleware authenticate
- Fichiers: api_opcv/src/routes/routes_vl.js
- Routes concernees: `/api/ajoutVL/:id` (l.6055), `/api/uploadsfilevl/:id` (l.6294), `/api/uploadsfileindice/:id` (l.6487), `/api/postfond` (l.5767), `/api/updatefond/:id` (l.5685)
- Probleme: Le middleware `authenticate` est importe mais pas applique sur ces routes POST sensibles
- Impact: Toute requete non authentifiee peut modifier les donnees fonds/VL
- Priorite: HAUTE — a corriger apres validation Eric (risque de casser les imports cron si auth requise)
- Note: Les routes admin (`routes_recalc_admin.js`, `routes_vl_admin.js`) utilisent correctement `authenticate`

### 45. Absence de validation CSV (formula injection)
- Fichier: api_opcv/src/routes/routes_vl.js (l.6294-6487)
- Probleme: Les cellules CSV importees ne sont pas sanitisees contre l'injection de formules (`=CMD(...)`, `+cmd`, etc.)
- Impact: Si les donnees sont re-exportees en Excel, execution de code possible cote utilisateur
- Priorite: MOYENNE
- Recommandation: Sanitiser les champs texte avec prefixe `'` si commence par `=`, `+`, `@`, `-`

### 46. ~~Promise chains sans .catch() dans apigestionperformance.js~~ — CORRIGE (2026-06-13)
- Fichier: api_opcv/src/routes/apigestionperformance.js
- Probleme: 11 routes utilisent `.then()` sans `.catch()` — unhandled promise rejection, requetes qui hangent
- Correction: `.catch()` ajoute a chaque chaine avec guard `!res.headersSent`
- Commit: `89cabd4` (api_opcv)
- Priorite: MOYENNE — CORRIGE

### 47. ~~Quartile EUR/USD division par undefined~~ — CORRIGE (audit 2026-06-13)
- Fichiers: front_end_opcvm/src/app/funds/summary-eur/[fondId]/FundSubView.tsx (l.631)
            front_end_opcvm/src/app/funds/summary-usd/[fondId]/FundSubView.tsx (l.633)
- Probleme: Meme bug que #41 (FundView.tsx local) — Math.ceil(undefined/undefined*4) → NaN
- Correction: Guard ternaire avec null fallback
- Priorite: CRITIQUE — CORRIGE

### 48. ~~SQL injection worker-recalculation.js~~ — CORRIGE (audit 2026-06-13)
- Fichier: api_opcv/src/workers/worker-recalculation.js (l.233)
- Probleme: `fund_id = ${parseInt(job.fond_id)}` — interpolation directe dans SQL
- Correction: Requete parametree avec ? placeholder
- Priorite: HAUTE — CORRIGE

### 49. ~~Cron set -e stoppe le pipeline entier~~ — CORRIGE (2026-06-13)
- Fichiers: 6 scripts dans api_opcv/scripts/cron/ (daily_update, eur_usd, nigeria, tunisie, brvm, health_check)
- Probleme: `set -e` fait que la moindre erreur stoppe les 9 etapes
- Correction: `set -e` supprime, fonctions `run_step()` et `run_curl()` avec compteur d'erreurs et log par etape
- Commit: `26d1f93` (api_opcv)
- Priorite: HAUTE — CORRIGE

### 50. ~~Crons curl sans validation HTTP status~~ — CORRIGE (2026-06-13)
- Fichiers: cron_daily_update.sh, cron_daily_eur_usd.sh, cron_nigeria_weekly.sh
- Probleme: `curl -s localhost:3005/api/...` sans verifier le code retour HTTP
- Correction: `run_curl()` verifie HTTP 2xx, log erreur si non, compteur d'erreurs en fin de script
- Commit: `26d1f93` (api_opcv)
- Priorite: HAUTE — CORRIGE

### 51. Performance fallback silencieux (findValueAtDate)
- Fichier: api_opcv/scripts/fix/fix_populate_performances.js (l.48-66)
- Probleme: Si aucune VL n'existe a/avant la date cible, retourne la premiere VL de la serie au lieu de null
- Impact: Perf 3A/5A calculee contre une baseline trop ancienne sans avertissement
- Priorite: MOYENNE
- Note: Comportement existant depuis longtemps, changement = risque de regression sur les calculs
