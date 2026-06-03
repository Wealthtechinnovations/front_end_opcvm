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

### 4. Aucun test automatise
- Impact: Regressions non detectees
- Recommandation: Ajouter tests unitaires sur les calculs financiers critiques

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
  - Cron recommande: `0 19 * * 1-5` (avant cron_daily_update)
- UEMOA: Script import existe (import_vl_uemoa.js) mais pas de scraper BRVM automatise
- CEMAC: Aucun script, aucune source identifiee (COSUMAF)
- Priorite restante: MOYENNE (UEMOA/CEMAC)
- Impact: Donnees UEMOA stales 229 jours, CEMAC 537 jours

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

## Dette technique restante

### 25. routes_vl.js — 11 .then() sans .catch() hors try/catch
- Lignes: 3135, 3209, 4578, 4791, 5069, 5095, 5122, 5668, 6647, 7022, 8652
- Impact: Requetes qui pourraient hang en cas d'erreur
- Priorite: FAIBLE (risque mitige par Express global error handler)

### 26. 87% des fetch() frontend sans response.ok check
- 638 appels fetch(), seulement 81 avec response.ok check (12.7%)
- Impact: Erreurs API silencieuses, donnees corrompues affichees
- Priorite: MOYENNE

### 27. ClickHouse performance_historique jamais peuple
- Table creee mais aucun script de backfill n'existe
- Aucune route API ne lit cette table
- Priorite: FAIBLE (a creer quand ClickHouse sera installe en production)

### 28. Duplication panel/investor vs panel/portfolio (100 pages)
- 50 pages identiques dans chaque repertoire
- Plus panel/portefeuille (3 pages supplementaires)
- Impact: Triple maintenance, corrections inconsistantes
- Priorite: MOYENNE
