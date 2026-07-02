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

### 45. ~~Absence de validation CSV (formula injection)~~ — CORRIGE (2026-06-13)
- Fichiers: api_opcv/src/routes/routes_vl.js (uploadsfilevl, uploadsfileindice, uploadsocietefilenew)
- Probleme: Cellules CSV/Excel importees sans sanitisation contre injection de formules (`=CMD(...)`, `@SUM`, etc.)
- Correction: `sanitizeCellValue()` + `sanitizeRow()` ajoutees — strip `\t\r\n` prefix + prepend `'` devant `=` et `@`
- Commit: `277ae47` (api_opcv)
- Priorite: MOYENNE — CORRIGE

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

### 52. ~~ClickHouse incident saturation disque~~ — CORRIGE (2026-06-17)
- Incident: ClickHouse crash-loop + logging verbeux sans rotation → stderr.log ~41 Go, saturation disque VPS
- Correction code: Flag `CLICKHOUSE_ENABLED` (.env), coupe-circuit sync (N echecs), timeout 30s, lecture VL paginee keyset
- Correction serveur: ClickHouse systemd arrete et desactive (`systemctl stop/disable clickhouse-server`)
- Commit API: `b815153` (pousse, pas encore deploye sur VPS)
- Priorite: CRITIQUE — CORRIGE (service desactive, code resilient pret)

### 53. Code mort ClickHouse dans apigestionsavequotidien.js
- Fichier: api_opcv/src/routes/apigestionsavequotidien.js
- Probleme: References ClickHouse residuelles dans les routes batch (sync classements, INSERT historique)
- Impact: Code inerte (CLICKHOUSE_ENABLED=false), aucun risque fonctionnel
- Recommandation: Nettoyage pour lisibilite et reduction taille fichier monolithique
- Priorite: BASSE

### 54. ~~Rankings null/Infinity dans buildRankResult~~ — CORRIGE (LOT 1, 2026-06-17)
- Fichier: api_opcv/src/services/ranking.service.js
- Probleme: `buildRankResult()` retournait Infinity quand total=0 (division par zero), null handling manquant
- Impact: Classements avec valeurs Infinity stockees en base
- Correction: Guard division par zero + null handling
- Priorite: HAUTE — CORRIGE

### 55. ~~Moyennes par categorie vides~~ — CORRIGE (LOT 2, 2026-06-17)
- Fichier: api_opcv/src/routes/apigestionsavequotidien.js
- Probleme: Calcul des moyennes par categorie produisait des valeurs NULL
- Correction: Fix du calcul (25 moyennes non-null verifiees en production)
- Priorite: HAUTE — CORRIGE

### 56. ~~Inconsistance transactionnelle routes classement~~ — CORRIGE (LOT 3, 2026-06-18)
- Fichier: api_opcv/src/routes/apigestionsavequotidien.js
- Probleme: `destroy()` dans transaction mais `findOne()`/`save()`/`create()` hors transaction
  - Le DELETE verouillait les lignes, les INSERT/UPDATE hors transaction causaient deadlocks ou perte de donnees
  - 3 routes affectees: classementmysql, classementeur, classementusd
  - 27 operations Sequelize hors transaction (9 par route)
- Correction: Ajout `{ transaction }` aux 27 operations + null guards sur `rankingData`
- Commit API: `e3d8fec`
- Verification production: 3545 local + 3579 EUR + 3579 USD classements peuples correctement
- Fonds 866: rank3Mois=86/300, rank3Moistotalm=300 (type1) confirme
- Priorite: CRITIQUE — CORRIGE

### 51. Performance fallback silencieux (findValueAtDate)
- Fichier: api_opcv/scripts/fix/fix_populate_performances.js (l.48-66)
- Probleme: Si aucune VL n'existe a/avant la date cible, retourne la premiere VL de la serie au lieu de null
- Impact: Perf 3A/5A calculee contre une baseline trop ancienne sans avertissement
- Priorite: MOYENNE
- Note: Comportement existant depuis longtemps, changement = risque de regression sur les calculs

## Audit 2026-06-26 (reprise indices + audit hang/crash multi-agents)

### 57. ~~Indices : id_indice Tunindex en majuscules~~ — CORRIGE (2026-06-26)
- Fichiers: api_opcv/scripts/scraper/{scrape_indices_daily,diagnose_index_history,fix_index_tail}.js
- Probleme: les scripts utilisaient `id_indice: 'TUNINDEX'` alors que la table `indice_references` stocke `'Tunindex'`. Les lookups JS etant sensibles a la casse, `propagateIndRef` sautait silencieusement TOUS les fonds tunisiens (indexDataByIndice['TUNINDEX'] = undefined). De plus, un run `--execute` aurait insere une serie dedoublee (lignes 'TUNINDEX' majuscule).
- Correction: `id_indice: 'Tunindex'` + champ `dbId` dans les configs des 3 scripts, utilise dans les requetes SELECT/INSERT.
- Commit: `8a8520b`
- Priorite: HAUTE — CORRIGE (deploiement VPS en attente)

### 58. ~~Routes API qui hangent sur erreur (unhandled rejection)~~ — CORRIGE (2026-06-26)
- Fichiers: api_opcv/src/routes/routes_vl_robotadvisor.js + routes_vl.js
- Probleme: 5 routes async ne renvoyaient jamais de reponse en cas d'erreur (requete suspendue indefiniment) :
  - robotadvisor: getsimulationportefeuillebyuser / getsimulationbyuser / getportefeuillebysimulation (`.then()` sans `.catch()`)
  - routes_vl forgot-password: `await users.findOne()` hors du try
  - routes_vl dates-manquantes: `await fond.findOne()` hors du try (+ crash si fond null)
  - routes_vl rechercheravance-fonds: `await fetchFundsByValorisationfirst()` hors du try
- Correction: `.catch()` avec guard `headersSent` (robotadvisor) ; deplacement des `await` dans le try existant + null guards (routes_vl). Additif, chemin d'erreur uniquement.
- Commit: `95febbb`
- Priorite: HAUTE — CORRIGE

### 59. ~~Crashs client render-path dans les panels~~ — CORRIGE (2026-06-26)
- Fichiers: front_end_opcvm/src/app/panel/** + country-panel/**
- Probleme: optional chaining incomplet `funds?.data.funds` (s'arrete a `funds`) → si `funds.data.funds` undefined, `.slice`/`.map`/`Math.ceil(.length)` crashent au render (ecran blanc non rattrapable). 6 pages: management/validated-funds, management/reporting, admin/pending-funds, country-panel/fonds, country-panel/validated-funds.
- Correction: `funds?.data?.funds` + defaut `[]` (`?? []`) sur les chemins slice/map.
- Aussi corrige: investor/dashboard (response.ok + guards null/div-par-zero sur calcul perf portefeuille) ; country-panel nav-anomalies (response.ok + `?.` sur fundsData) ; admin/api-management (`if (data.code=200)` assignment → `=== 200`, backend renvoie bien `code:200` verifie).
- Commit: `d3023e6`
- Priorite: HAUTE — CORRIGE

### ~~60. Risques residuels identifies (audit 2026-06-26)~~ — CORRIGE (2026-06-26)
- **60.1 api_opcv routes_vl.js `/api/comparaison`** : 3 `return` ajoutes devant les `Promise.all(promessesAPI2/3/4)` internes pour que les rejections remontent au `.catch` externe. Commit API: `2d04a86`.
- **60.2 front_end_opcvm reconstruction/buy** : `parseFloat(taux)` utilisait l'etat React perime (`""` au premier appel → NaN). Remplace par `Number(data8)` (valeur fraiche de l'API) + garde division par zero. Investor + portfolio versions. Commit frontend: `76ceefe`.
- **60.3 robot-advisor advisor/page.tsx** : `efficientFrontierData.risks.map(...)` garde avec `?? []` + `returns?.[index]`. Investor + portfolio versions. Commit frontend: `76ceefe`.
- Build frontend: OK (0 erreurs)

### 61. Trou de propagation indRef (indice_references -> valorisations) — OUTILLE (2026-06-26)
- **Constat** : `fix_index_tail.js` corrige la table `indice_references` (valeurs brutes des indices),
  mais les pages fonds (`/api/valLiq`, `/api/valLiqdev`, perfs, ratios) lisent
  `valorisations.indRef` / `indRef_EUR` / `indRef_USD` — une copie par-fond alimentee separement.
- **Verifie (agent Explore + lecture code)** : AUCUNE route ne lit `indice_references` en direct.
  La propagation native `propagateIndRef` (scrape_indices_daily.js) ne couvre que **+/-7 jours**
  autour d'une date scrapee. `import_indices_excel.js --step 2` lit le **fichier Excel** (fige),
  PAS la DB → inadapte pour propager une correction DB.
- **Consequence** : un indice fige plusieurs mois dans `indice_references` laisse
  `valorisations.indRef` faux sur toute la periode, meme apres `fix_index_tail`.
- **Solution (additive, zero regression)** : nouveau script `propagate_indref_range.js`
  (api_opcv, commit `d4a237d`) — propage `indice_references` -> `valorisations.indRef` sur une
  fenetre `[since,until]` complete, logique validee (mapping pays->indice, match exact/+-7j),
  DRY-RUN par defaut, idempotent. EUR/USD recalcule ensuite par `recalc_eur_usd_daily_rate.js`.
- **Securite operationnelle** : sauvegarde des colonnes indRef dans une table datee AVANT
  l'UPDATE de masse (rollback possible). Voir SUIVI.md POINT DE REPRISE pour la sequence SSH.
- Priorite: MOYENNE — OUTILLE, execution prod en attente (donnee financiere sensible).

### 62. Classement regional/continental incoherent pour le lot de fonds recents (casse) — DIAGNOSTIQUE (2026-06-27)
- **Symptome (prod, fonds 2870 USD)** : national "OBLIGATIONS Tunisie" /54, regional "OBLIGATIONS Afrique du Nord" /18 (< national, illogique), continental "OBLIGATIONS Afrique" = vide.
- **Confirme par API** : un fonds tunisien NORMAL (2415) donne 54 <= 344 (regional) <= 480 (continental) = COHERENT. Seuls les fonds recents (lot ~2869-2875) sont anormaux.
- **Cause racine (casse)** : le classement Type2/Type3 groupe par la chaine exacte `categorie_fundafrica_regionale` / `categorie_fundafrica_globale` (via `ranking.service.js` `calculateRankRegionalDev`/`GlobalDev`, filtre `where categorie_fundafrica_regionale = category`). La majorite des fonds portent `OBLIGATIONS AFRIQUE DU NORD` (MAJUSCULES) → groupe de 344 ; les fonds recents portent `OBLIGATIONS Afrique du Nord` (Casse Titre) → groupe isole de 18, et pas de niveau continental (categorie_fundafrica_globale absente/incoherente) → Type3 null.
- **Mapping pays->region** (uppercase) defini dans `routes_vl.js:300-345` (PAYS_AFRIQUE_DU_NORD = ALGERIE, MAROC, TUNISIE, LIBYE, EGYPTE, MAURITANIE...).
- **Fix envisage (a valider)** : normaliser la casse de `categorie_fundafrica_regionale`/`_globale` (choisir UNE casse) sur les fonds concernes + recompute classement. Data-fix cible + source (la fonction qui remplit ces colonnes FundAfrica). Sensible (classement) → diagnostic-first, confirmer la casse cible.
- Priorite: MOYENNE.

### 63. Barres de ratio absentes en EUR/USD (Sharpe, Sortino, Volatilite...) — DIAGNOSTIQUE (2026-06-27)
- **Symptome (prod)** : sur les pages summary-eur / summary-usd, `ranksharpe=null / ranksharpetotal=0` (idem volatilite, DSR, sortino, info, omega, calmar) → aucune barre "Par rapport a la Cat".
- **Cause racine (backend)** : `upsertPerformanceDevise()` (`apigestionsavequotidien.js:1147-1182`) qui peuple `performences_eurs`/`performences_usds` **n'ecrit QUE les colonnes de performance, PAS les ratios** — contrairement a `upsertPerformance()` (local, l.1362-1431) qui ajoute `getRatioDataFields(ratioData, '1an'|'3an'|'5an')`. Donc `ratiosharpe3an` & co restent NULL en EUR/USD → `rankFundInList` filtre `!= null` → 0 fonds → `ranksharpetotal=0` → pas de barre.
- **Fix envisage (a valider)** : (1) ajouter les ratios dans `upsertPerformanceDevise` (parite avec la version locale), (2) repeupler `performences_eurs`/`performences_usds` PAR LOTS (leçon incident MariaDB : jamais tout d'un coup), (3) recompute classements EUR/USD. Sensible (ratios/calculs) → confirmer avant ecriture.
- Priorite: MOYENNE.

## ============================================================
## AUDIT COMPLET PLATEFORME — 2026-07-02 (lecture seule, 4 agents + tests live)
## ============================================================
> Etat prod verifie (PRODUCTION_STATE.json 2026-07-01 + curl live). Rien modifie. Findings priorises.
> Site OPERATIONNEL : home/tools/fiches fonds/API principales = 200. Base repond (987815 VL, 1209 fonds).

### 64. [CRITIQUE — SECU] Secrets reels suivis par git
- `api_opcv/.env`, `api_opcv/.env.production`, `api_opcv/.env.production.plan-b` **trackes** (dans .gitignore mais commites avant) → `DB_PASSWORD`, `JWT_SECRET`, `EMAIL_PASSWORD`, `MAGIC_SECRET_KEY` en clair dans l'historique git.
- `front_end_opcvm/.env.production(.plan-b)` trackes → `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_STABLECOIN_API_KEY`.
- **Reco (operateur)** : ROTER tous ces secrets, puis `git rm --cached` + purge historique (git filter-repo/BFG). Ne PAS faire a l'aveugle en prod (le JWT_SECRET rote invalide les sessions). Decision utilisateur requise.

### 65. [CRITIQUE — SECU] Routes d'ecriture/admin non authentifiees
- `apigestionsavequotidien.js` : `/api/classementmysql|eur|usd`, `/api/saveperfdate{mysql,eur,usd}`, `/api/savevlmanquante`, `/api/updatewithdividende` — ecritures batch lourdes OUVERTES.
- **DoS** : `/api/killlimiter` (1184) + `/api/startlimiter/:max/:min` (1190) desactivent le rate-limiter, publiquement.
- `routes_vl.js` : `/api/ajoutVL/:id`, `/api/ajoutIndice/:id`, `/api/updatefond`, `/api/postfond`, `/api/deleteportefeuille`, `/api/uploadsfilevl/:id`, `/api/uploadsfileindice/:id`, `/api/uploadsocietefilenew` — non authentifiees (upload arbitraire inclus).
- `routes_vl_admin.js` : `/api/reject-user`, `/api/activate-user`, `/api/createfrais` — moderation sans auth.
- Middleware `middleware/auth.js` existe (JWT+authorize('admin')) et est applique sur `routes_recalc_admin.js` (8 routes OK) mais PAS sur les ci-dessus. **Reco** : appliquer `authenticate,authorize('admin')` — MAIS verifier d'abord qu'aucun cron/process interne n'appelle ces routes en public (CLAUDE.md dit deja "recalcul classement = localhost:3005"). A faire par lots, tester chaque route.

### 66. [HAUTE — SECU] Middleware frontend contournable
- `front_end_opcvm/src/middleware.ts` : un cookie `isLoggedIn` present SANS `token` passe le garde (`:67`), et le controle de type (`:71-79`) ne s'execute que `if (token)`. JWT decode via `atob` sans verif de signature. **L'autorisation reelle DOIT etre refaite cote API** (cf #65).

### 67. [MOYENNE — FINANCE] Incoherence de base VL (Total Return vs Price Return)
- Perf LOCALE live = `vl_ajuste` (Total Return, dividendes) — `apigestionperformance.js:306`.
- Perf EUR/USD live = `value_EUR/value_USD` (price return) — `:1480-1485` ; ratios + moyennes categorie + table `performences` = `value` brute.
- `vl_ajuste_EUR/USD` existent (`models/vl.js:44-48`) mais INUTILISES.
- **Impact** : comparaisons local vs EUR/USD et fonds vs categorie non homogenes (ecart = rendement dividendes). Choix a trancher : tout en `vl_ajuste*` ou tout en `value`.

### 68. [MOYENNE — FINANCE] Historique insuffisant → 0,00 % au lieu de null
- `findNearestDate*` (`functions/dates.js`) fallback sur `lastDate` si la cible precede le 1er point → perf 3A/5A/YTD d'un fonds trop jeune = `calculatePerformance(last,last)` = **0,00 %** (donnee inventee, pas `null`). Fausse tris/classements/selection. Idem YTD si aucune VL l'annee N-1.
- Gardes qualite partielles : numerateur nul/negatif, VL <=0, dates futures non controles ; `calculerCAGR` (`newratios.js:116`) renvoie `1` (=+100%) si base<=0.

### 69. [MOYENNE — API] `/api/ratiosnew/:year/:id` timeout sur certaines valeurs
- Live : year=1/3/5/10 → 200 (~1,5s) ; year=2/4/2025/2026 → **timeout >20s** (000). Requete qui s'emballe selon le parametre. Combine avec #65 (route non protegee) = vecteur de charge. A borner/valider le parametre.

### 70. [MOYENNE — DATA] CEMAC sans pipeline d'alimentation
- Aucun script d'import CEMAC/BVMAC/COSUMAF (verifie scripts/import + scraper = NONE). VL figees au 2024-12-12 (34 fonds, 2134 VL). Les 4 autres pays ont un cron. **Reco** : identifier une source BVMAC/COSUMAF ou marquer explicitement CEMAC "donnees arretees au 2024-12".

### 71. [MOYENNE — DATA] Indices doublons de casse/cle + MONIA/BRVM
- `indice_references` : cles en double `Indice_monetaire_maroc` (2 nom_indice differents), `masi_all_shares` vs `MASI`, `INDICE MONETAIRE MAROC`. A consolider (lecture seule d'abord).
- MONIA fige 2026-05-14 (WAF bkam.ma sur VPS). BRVM `indice_references` frais (2026-06-29) mais propagation UEMOA a verifier. Couverture indRef EUR/USD : TUNISIE 124031/304544 (=40%, cf recalc EUR/USD a finir par lots), UEMOA 41295/42286.

### 72. [FAIBLE→MOYENNE] Scripts fix/ destructifs sans transaction + doc perimee
- `scripts/fix/fix_database_phase2.js` et `fix_nigeria_pays_casing.js` : `DELETE FROM valorisations/...` SANS dry-run ni transaction. `fix_database_phase1.js` : commentaire "wrapped in transactions / nothing deleted" FAUX (DELETE reels). `import_vl_tunisie_cmf.js --force` = UPSERT destructif. → a ne lancer qu'en connaissance de cause, ajouter garde/transaction.
- **Doc perimee** : CLAUDE.md documente `funds/summary/[fondId]/page.tsx` + `FundView.tsx` a cet endroit — FAUX (route reelle = `funds/[fondId]`, `/funds/summary/:id` renvoie 404). Bloc "Crons actifs" de CLAUDE.md incomplet (manque brvm/tunisie/indices/health ; `fix-brvm-nginx.py` reference mais ABSENT du depot).
- Frontend : `error1.tsx` (code mort, mauvais nom → pas d'error boundary), perfs sans devise/date de reference affichee, formats `%` incoherents, pas de separateur de milliers, `tools/comparison` + `tools/search` sans metadata SEO. `fileFilter` MIME absent sur multer (#65 lie).
