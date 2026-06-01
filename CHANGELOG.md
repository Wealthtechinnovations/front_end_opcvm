# CHANGELOG — Africafunds OPCVM Platform

## [2026-06-01] Audit securite + corrections frontend

### Securite (API)
- Fix injection SQL dans analytics.js : routes classement-historique parametrees (ClickHouse)
- Fix credentials hardcodes dans sync_production.sh : remplaces par sourcing .env
- Ajout `set -e` dans cron_daily_update.sh et cron_nigeria_weekly.sh
- Fix .toJSON() sur objets ClickHouse dans apigestionquartile.js

### Frontend
- Fix NaN className dans performance page : cellules manquantes n'affichent plus vert
- Helpers perfColorClass/diffColorClass (40+ cellules corrigees)

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
