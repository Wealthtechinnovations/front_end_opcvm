# CHANGELOG — Africafunds OPCVM Platform

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

### Pret a deployer (T13/T14)
- T13: Diagnostic liaison indices↔fonds — causes racines couverture EUR/USD (TUNISIE 24%/UEMOA 22%/CEMAC 0%). Commit API `e06798b`
- T14 (#26): response.ok guards sur 9 pages fonds critiques (672 fetch audites, 0 erreur build). Commit Frontend `4c49a44`

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
