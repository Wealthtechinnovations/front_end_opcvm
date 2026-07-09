# CHANGELOG — Africafunds OPCVM Platform

## [2026-07-09] #63 RESOLU tous pays (barres ratios EUR/USD) + fix #62 pousse (garde null-category)

### Donnees (EXECUTE en prod, verifie via API publique)
- **#63 termine** : peuplement complet des ratios 3 ans dans `performences_eurs/usds` (tous fonds, EUR+USD, sans throttle apres le fix rate-limiter du 07-03) + recompute des classements EUR/USD. Barres "Par rapport a la Cat" servies partout : Maroc 866 ranksharpe 181/272 EUR et 187/272 USD ; Nigeria 1142 7/19 et 5/19 ; Tunisie 2415 38/45 et 30/45. Entretien assure par le cron `cron_daily_eur_usd` (21h30), desormais debloque.

### API (commit `10dafc0`, pousse — A DEPLOYER puis executer, cf SUIVI.md POINT DE REPRISE)
- **#62 cause racine** : les fonds recents (2863-2881) ont `categorie_fundafrica_regionale/globale` NULL ; `calculateRankRegionalDev(null)` classait ces fonds dans le groupe `IS NULL` (18 fonds) → classements absurdes type "6/18".
- `src/services/ranking.service.js` : garde `if (!category) return error` dans `calculateRankNationalDev` et `calculateRankRegionalDev` (alignement sur `calculateRankGlobalDev`).
- `scripts/fix/fix_fundafrica_categories.js` (nouveau) : derive les categories FundAfrica manquantes par vote majoritaire des pairs (meme pays + meme categorie_national), dry-run par defaut, jamais d'invention (skip si pas de pair/egalite) ; met a jour fond_investissements + performences/_eurs/_usds.

## [2026-07-03] INCIDENT api-monolith + bascule Node 18 + fix rate-limiter interne

### Incident (resolu) — api-monolith crash-loop apres restart
- Un restart d'api-monolith a charge le node_modules disque, upgrade vers des packages Node 15/18 (helmet@8, ethers/node:crypto, puppeteer-core `??=`) incompatibles avec le Node 14.16 sur lequel tournait l'app. API DOWN ~25 min.
- **Fix** : bascule de l'interpreteur PM2 sur **Node 18.20.8** (nvm) + `pm2 save`. Scripts `scripts/fix/restart_api_node18.js` + `scripts/fix/pm2_save.js`. Shims Node14 additifs dans app.js (inoffensifs). Commits `0895f74`, `55a2642`, `aa9daf7`, `fca504b`.

### Fix — rate-limiter n'exempte plus les appels internes (commit `d57deaa`)
- `src/middleware/validate.js` : les appels loopback SANS `X-Forwarded-For` (crons/scripts batch sur localhost:3005) sont exemptes du rate-limit 200/15min. `trust proxy=1` -> les clients externes gardent leur IP reelle et restent limites (zero impact securite externe).
- **Cause** : le peuplement ratios EUR/UST (#63) et les crons appellent l'API en boucle en interne et etaient throttles (429 -> ratios null). Explique la couverture partielle des ratios.

## [2026-07-03] Backfill benchmark Tunindex Tunisie 2011-2021 (via MCP WealthTech)

### API (donnees prod, EXECUTE via bridge scoped-write)
- **indRef Tunisie historique** : `propagate_indref_range.js --since=2011-01-01 --until=2021-12-31 --pays=TUNISIE --execute` → **180310 indRef remplis** (2011-2021 n'avaient aucun benchmark ; 2022+ deja couvert). Additif : que du null->valeur, 0 ecrasement, 0 sans match. Tunindex `indice_references` verifie reel (4952 en 2011 → 19807 en 2026).
- **Recalc EUR/USD** : `recalc_eur_usd_daily_rate.js 2415 2538` → 124 fonds, 302904 VL, indRef_EUR/USD calcules. 0 erreur.
- **Resultat** : couverture indRef Tunisie 124031 → **304341 (99,9%)**, local=EUR=USD. Fiches tunisiennes affichent le benchmark depuis 2011 (verifie prod 2415/2439). Zero regression.
- **Code** : `propagate_indref_range.js` commit `1a7e70a` (parsing `--flag=value` compat bridge MCP). Bridge deploy debloque (stash+rebase+pop).

## [2026-06-22] Fix classement EUR/USD + population ratios 3 ans EUR/USD

### API (commit `4adcb80`, deploye) — Fix erreur classement EUR/USD
- `ranking.service.js` : nouveau constant `PERF_PERIODS_FULL_DEV` (sans les 7 colonnes "m" perfveillem/perf3mm/perf6mm/perf1anm/perf3ansm/perf5ansm/ytdm absentes des tables EUR/USD). `calculateRankNationalDev` l'utilise a la place de `PERF_PERIODS_FULL`.
- Corrige l'erreur runtime `{"error":"Erreur classement EUR/USD"}` (MySQL "Unknown column"). Recalcul renvoie desormais `finishrank`.

### API (commit `c68d5ef`, pousse — A DEPLOYER) — Population ratios EUR/USD
- `scripts/fix/fix_populate_performances_eur_usd.js` : calcule et stocke les 10 ratios 3 ans (volatility3an, ratiosharpe3an, pertemax3an, sortino3an, info3an, calamar3an, var953an, betabaissier3an, omega3an, dsr3an) dans `performences_eurs/usds`.
- Source : endpoint EUR/USD valide `/api/ratiosnewdevwithdate/3/:id/:devise/:date` (REUSE des formules validees, aucune reimplementation). Additif et fail-safe (API indisponible => NULL, zero regression).
- Objectif : remplir `ranksharpe`/`rankvolatilite`/... dans `classementfonds_eurs/usds` (etaient NULL) => barres ratios EUR/USD visibles.

### Note indices
- Indices BRVM/MASI/MONIA/NSE/Tunindex arretes au 2026-05-14/15 (pipeline d'import stoppe). Scraper `scrape_indices_daily.js` pret (option `--date` pour backfill jour par jour). A executer en production + installer cron.

## [2026-06-20] Barres ratios EUR/USD dynamiques + ratio ranks classement

### Frontend (commit `cf6dba2`, pousse — A BUILDER sur VPS)
- Barres de notation "Par rapport a la Cat" rendues dynamiques sur les pages EUR et USD (10 ratios : Volatilite, Perte max, DSR, Beta baissier, VAR95, Sharpe, Info, Sortino, Omega, Calamar)
- Nouveau helper `src/lib/ratioRating.ts` (getNotationClasses + getEstimationFromRankTotal), partage avec la page devise locale (FundView refactorise)

### API (commit `4ce1aae`, deploye)
- Modeles `classementfond_eurs/usds` : +32 colonnes ratio ranking
- `ranking.service.js` : `calculateRankNationalDev` utilise PERF_PERIODS_FULL (corrige l'incoherence de classement national XOF vs EUR)
- `apigestionsavequotidien.js` : routes classement EUR/USD sauvegardent les ratio ranks
- Migration `add_ratio_ranks_eur_usd.sql` : colonnes + conversion tables classement MyISAM -> InnoDB (crash-safe)

### Scraper indices (commit `6c0db08`)
- `scripts/scraper/scrape_indices_daily.js` + `scripts/cron/cron_indices_daily.sh` (BRVM/MASI/Tunindex/NSE/MONIA, quotidien Mon-Fri) — gere les donnees futures, pas le backfill historique

## [2026-06-18] LOT 1-3 — Fix classements/rankings (API deploye)

### Deploye API (LOT 1 — #54)
- **#54** Fix rankings null/Infinity dans `ranking.service.js`
  - `buildRankResult()` retournait Infinity quand total=0 (division par zero) → corrige
  - Null handling ajoute dans les calculs de classement

### Deploye API (LOT 2 — #55)
- **#55** Fix moyennes par categorie dans `apigestionsavequotidien.js`
  - Calcul des moyennes categorie corrige
  - 25 moyennes non-null verifiees en production

### Deploye API (LOT 3 — #56) — 2026-06-18
- **#56** Fix consistance transactionnelle dans `apigestionsavequotidien.js`
  - 3 routes classement (classementmysql, classementeur, classementusd) : ajout `{ transaction }` aux 27 operations Sequelize findOne/save/create qui etaient hors transaction
  - Ajout null guards sur l'acces aux donnees de classement
  - Commit API: `e3d8fec`
  - Verifie en production : 3545 local + 3579 EUR + 3579 USD classements peuples correctement
  - Fonds 866 : rank3Mois=86/300, rank3Moistotalm=300 confirme

### Pousse, pas encore deploye (#52)
- **#52** ClickHouse resilience : flag `CLICKHOUSE_ENABLED`, circuit breaker, timeout 30s, lecture paginee keyset
  - ClickHouse service arrete et desactive sur VPS (incident saturation disque)
  - Commit API: `b815153`

## [2026-06-13] LOT AUDIT-C/D — Audit securite + correctness + crons

### Deploye API (LOT AUDIT-C)
- **#42** Route ClickHouse `/api/classementquartile/:id` : variable `clickhouse` jamais importee, crash ReferenceError → remplacee par stub 410 Gone (dead code)
- **#43** Path traversal multer filename (routes_vl.js:332) → ajout `path.basename(file.originalname)`
- Commit API: `e5dddb6`

### Deploye Frontend (LOT AUDIT-D)
- **#47** Quartile EUR/USD division par undefined (NaN) → null guard sur FundSubView.tsx (summary-eur + summary-usd)
- Build frontend : 0 erreurs apres fix. Commit Frontend: `8a60083`

### Deploye API (LOT AUDIT-D)
- **#48** SQL injection dans worker-recalculation.js : `fund_id` parametrise (etait interpole dans la query)
- Commit API: `e5dddb6`

### Audit complete documente (CODE_REVIEW #42-#51)
- #44 Routes POST sans authenticate middleware — a valider avec Eric
- #45 CSV formula injection — sanitisation a ajouter
- #46 Promise chains sans .catch() (apigestionperformance.js)
- #49 cron_daily_update.sh `set -e` stoppe pipeline entier sur moindre erreur
- #50 Crons curl sans validation HTTP status
- #51 findValueAtDate() fallback silencieux vers premiere VL

## [2026-06-12] T35 — Module BRVM BOC + backfill UEMOA

### Deploye en production
- **Module BRVM BOC complet** : scraper PDF BOC BRVM, parseur multi-format, promotion VL, page admin /api/brvm/boc/status
- **4406 VL promues** pour 111 fonds UEMOA (gap comble depuis 2022)
- **cron_brvm_daily.sh installe** (lun-ven 19h30) — scraping quotidien automatise
- EVOLUTIS (fund_id 2594) : 4 VL nov 2022 recuperees via salvage_implausible_year()
- Commits API: `8a3a707` + precedents T35
- Tables BRVM ajoutees : brvm_boc_sources, brvm_boc_navs_raw, brvm_fund_aliases, brvm_import_logs, brvm_missing_navs

## [2026-06-05] T19 deploye + T20 Nigeria mise a jour

### Deploye en production (T20)
- **Nigeria donnees mises a jour**: cron_nigeria_weekly.sh execute manuellement
  - 21 fichiers SEC Nigeria 2026 extraits, 82 VL inserees, 1 fonds cree
  - Recalc EUR/USD (926 897 VL) + VL ajuste (926 917 VL) + performances + classements
  - **Constat**: SEC Nigeria a change format fin avril — fichiers recents ne contiennent que ~40 fonds au lieu de ~220
  - Nigeria derniere VL : 22 mai 2026 (40 fonds) / 24 avril 2026 (195 fonds)

### Deploye en production (T19)
- **Fix CRITIQUE**: pages fonds EUR/USD crashaient ("Cannot read properties of undefined (reading '1')")
  - Cause: className perf annuelles dereferencait slicedPostc[n][2] sans guard (premier rendu, postc=null)
  - Fix: guard optional chaining sur summary-eur + summary-usd FundSubView.tsx
  - Build OK (217/217 pages), PM2 restart OK. Commit `0dc046b`

## [2026-06-04] UEMOA indRef 100% + Fix conversion

### Deploye en production (T17)
- **Fix CRITIQUE**: routes_vl.js 10 lignes multiplication→division pour conversion local→EUR/USD
  - `POST /api/updateValues/:id` (saisie manuelle VL): value_EUR/USD
  - `POST /api/uploadsfilevl/:id` (upload CSV): value_EUR/USD, actif_net_EUR/USD, dividende_EUR/USD
  - Les deux routes ecrivent directement en base — le bug affectait les donnees inserees via l'UI

### Deploye en production
- **UEMOA indRef couverture**: 22% → **100%** (111/111 fonds, 33830/33830 VL) local + EUR + USD
- Fix import_indices_excel.js: ajout 'UEMOA' dans mapping BRVM + multiplication→division EUR/USD. Commits API: `f6d7cb2`
- Resilience: DB fallback quand Excel absent + case-insensitive matching. Commits API: `ac1cf98`, `2990351`
- Nouveau script diagnostic read-only: `scripts/diag/check_indref_coverage.js`
- Execution production: step 2 (33829 VL) + step 4 (26253 VL) + perfs EUR/USD (108 fonds) + classements
- Sanity check: DIVISION confirmee (XOF local=198.58, eur=0.29)

## [2026-06-03] Classements + securite + resilience + response.ok + diagnostic indices

### Deploye en production (T8-T12)
- Classement NATIONAL local etait systematiquement vide (filtre date fixe) → MAX(date)/fond. Commit API `6644682`. **RECALCUL EFFECTUE, type1 OK.**
- Totaux classement EUR/USD gonfles par doublons de date → dedup keepLatestPerFund(). Commit API `6644682`
- Page USD affichait le benchmark annuel en EUR → corrige en USD. Commit Frontend `be1b45e`
- 8 routes admin recalc protegees par JWT authenticate+authorize('admin'). Commit API `5540d95`
- 10 routes routes_vl.js: ajout .catch() (fin des requetes qui hangent). Commit API `5b70838`
- valLiq/valLiqdev: 404 au lieu de 500 pour fonds inexistants. Commit API `bb03081`
- Suppression Math.random() (fausses performances) sur pages fonds. Commit Frontend `b7c962b`
- cron_daily_eur_usd.sh: bit executable ajoute. Commit API `5540d95`
- 2 crons ajoutes au crontab production : cron_tunisie_daily.sh (19h L-V), cron_health_check.sh (22h)

### Deploye (T14)
- T14 (#26): response.ok guards sur 9 pages fonds critiques (672 fetch audites, 0 erreur build). Commit Frontend `4c49a44`. Verifie: 9 pages HTTP 200.

### Pret a deployer (T13/T16)
- T13: Diagnostic liaison indices↔fonds — causes racines couverture EUR/USD (TUNISIE 24%/UEMOA 22%/CEMAC 0%). Commit API `e06798b`
- T16 (#26 suite): response.ok guards sur 26 pages secondaires (countries/, country-panel/, fund-managers/). 115 fetch audites, build independant OK, QA zero regression. Commit Frontend `2814e9a`

## [2026-06-02] CMF Tunisie + Forex EUR/TND fix + Fix classement

### Fix forex EUR/TND data quality (LOT T4)
- Probleme: 5,959 entries EUR/TND dans devisedechanges mais seule 1 avec value>0 (Yahoo Finance ne renvoie pas TND valide)
- Ajout ECB Data API comme fallback pour EUR/* quand Yahoo <100 entries valides
- Ajout derivation cross-rate: USD/X = EUR/X / EUR/USD pour paires insuffisantes
- Correction UPDATE des entrees existantes avec value=0 (remplissage retroactif)
- Script diagnostic: scripts/diag/check_forex_tnd.js (read-only, verification taux TND)
- Script: scripts/import/scrape_forex_import.js (ameliore)
- Commit API: `97a5f22`

### Fix deploy health check
- Correction route /api/pays (n'existe pas) → /api/ref/pays dans deploy_2026_06_02.sh
- Commit API: `6156414`

### Deep audit + bug fixes (LOT T5)
- API: fix totalfondscompose doubling (3 occurrences apigestionpays.js) — comptage fonds errone
- API: fix 5 null dereferences critiques (apigestionpays, apigestionsociete, apigestionfonds)
- API: fix searchFunds broken replacements (selectedPays/selectedRegion non passes a Sequelize)
- API: add .catch() sur 6 routes admin sans error handler (requetes qui hangent)
- API: DB resilience — retry 5 tentatives avec match patterns erreurs connexion
- Frontend: fix 7 page.server.ts crash quand API indisponible
- Frontend: fix sitemap.ts crash sur fetch error
- Frontend: fix performance diff NaN toFixed crash
- Commits: `f3ddd6a` (API), `4af1b35` (Frontend)

### Fix classement destructif
- Routes /api/classementmysql, /api/classementeur, /api/classementusd:
  TRUNCATE remplace par DELETE transactionnel (rollback si erreur mid-recalcul)

### Automatisation data Tunisie
- Nouveau scraper Python automatise: `scripts/scraper/cmf_tunisie_daily.py`
- Scraping CMF multi-pages (9 pages, ~235 fichiers)
- Parsing Excel bi-section (Capitalisation + Distribution avec dividendes)
- Matching fonds multi-niveaux (exact, partial, fuzzy via rapidfuzz)
- Quarantaine variations extremes >20% (table `cmf_extreme_variations`)
- File validation nouveaux fonds (table `cmf_new_funds_queue`)
- Import idempotent, transactionnel, avec conversion EUR/USD
- Mode dry-run / production avec lockfile
- Audit trail (table `cmf_import_audit`)
- Cron wrapper: `scripts/cron/cron_tunisie_daily.sh` (Mon-Fri 19h)
- Test dry-run: 3,550 NAV parsees, 0 erreurs, 127 fonds/fichier

## [2026-06-01] Audit securite + corrections frontend

### Securite (API)
- Fix injection SQL dans analytics.js : routes classement-historique parametrees (ClickHouse)
- Fix credentials hardcodes dans sync_production.sh : remplaces par sourcing .env
- Ajout `set -e` dans cron_daily_update.sh et cron_nigeria_weekly.sh
- Fix .toJSON() sur objets ClickHouse dans apigestionquartile.js

### Securite critique (API)
- Elimination 144 eval() RCE dans routes_vl.js (filtres fonds avec user input)
- Rate limiting strict 10/15min sur routes auth (login, password)
- Multer file size limit 5MB sur 13 routes upload (etait illimite)
- Parametrisation ClickHouse SELECT dans batch classement

### Frontend
- Fix NaN className dans 5 pages : 147 cellules performance corrigees
  (performance, summary local/EUR/USD, portfolio)
- Helpers perfColorClass/diffColorClass pour page performance
- isNaN guard automatise pour toutes les autres pages

### Monitoring
- Nouveau cron_health_check.sh (quotidien 22h)

### Diagnostic
- Audit complet automatisation data : MAROC+NIGERIA OK, Tunisie/UEMOA/CEMAC manuels
- Identification staleness : UEMOA 229j, CEMAC 537j

## [2026-05-22] Import Tunisie CMF V1.8.3
- Import 227,998 VL + 61,650 mises a jour pour 131 fonds Tunisie
- Creation de 7 nouveaux fonds (SICAV CAPITALISATION PLUS, AFC AMANETT SICAV, FCP CEA BMCE CAPITAL VALUE, FCP BNA CEA, ATTIJARI PREMIUM SICAV, STRATEGIE HIGH YIELD SICAV, FCP VALEURS MONETAIRE)
- Integration dividendes (1,055 dividendes, 122 fonds)
- Recalcul VL ajustees, EUR/USD, performances locale/EUR/USD
- Correction casse pays "Tunisie" -> "TUNISIE"
- Fix syntax errors apigestionsavequotidien.js (7 stray limit: 500)
- Script: scripts/import/import_vl_tunisie_cmf.js
- Fichiers: src/routes/apigestionsavequotidien.js

## [2026-05-22] Priorite B — Taches B1, B2, B4
- B1: Extraction ranking.service.js (refactoring classement)
- B2: Routes referentiel /api/ref/* (8 endpoints)
- B4: Ajout R2 et Alpha de Jensen aux metriques de risque

## [2026-05-21] LOTs 0-6 — Deploiement complet
- LOT 0-1: Audit DB, corrections, enrichissement
- LOT 2: Imports VL Maroc/UEMOA/Nigeria
- LOT 3: Forex historique 21 paires + cron quotidien
- LOT 4: Nettoyage 535K doublons VL
- LOT 5: Performances 3 devises + classements + rendements
- LOT 6: TSR par pays + Referentiel FundAfrica
- Frontend: classementType3, graphiques datetime, SEO, null-safety
- Securite: helmet, CORS, rate limiting, input sanitization
- Crons: cron_daily_update.sh, cron_daily_eur_usd.sh, cron_nigeria_weekly.sh
