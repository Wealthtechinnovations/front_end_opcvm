# ROADMAP — Africafunds OPCVM Platform

## Vision
Plateforme de reference pour les OPCVM africains : donnees VL, performances, classements, comparaisons multi-devises (locale, EUR, USD), referentiel FundAfrica, panels utilisateurs.

## Fait (2026-06-02)

### Infrastructure
- Serveur Ionos VPS (217.160.249.254)
- Nginx reverse proxy (SSL, CORS)
- PM2 : api-monolith (3005), fundafrique-frontend (3000), worker-recalculation, worker-data-import
- MySQL fund_opcvm, ClickHouse fund_analytics (analytics optionnel)

### Donnees
- 1,207 fonds, 963,862 VL
- 5 marches : MAROC (640), NIGERIA (284), TUNISIE (131), UEMOA (118/111 actifs), CEMAC (34)
- Forex 21 paires historiques + cron quotidien
- Indices : MASI, Tunindex, NSE, BRVM, MONIA
- Performances 3 devises (local/EUR/USD)
- Classements 3 types x 3 devises
- Rendements 1.09M lignes
- Referentiel FundAfrica : 5 tables, 99.1% fonds mappes

### Securite (2026-06-01)
- eval() RCE elimine (144 appels dans routes_vl.js)
- SQL injection corrigee (analytics.js, apigestionsavequotidien.js)
- Rate limiting auth 10 req/15min sur login/password
- Multer 5MB file size limit sur 13 routes upload
- Credentials retires de sync_production.sh (source .env)
- NaN className corrige sur 5 pages frontend (147 patterns)

### Automatisation data
- MAROC : cron_daily_update.sh (ASFIM, lun-ven 20h) — AUTOMATISE
- NIGERIA : cron_nigeria_weekly.sh (SEC, lundi 10h) — AUTOMATISE
- TUNISIE : cmf_tunisie_daily.py (CMF, lun-ven 19h) — CREE 2026-06-02, a deployer
- UEMOA : import_vl_uemoa.js (BRVM, manuel) — A AUTOMATISER
- CEMAC : aucun script, aucune source (COSUMAF) — A INVESTIGUER

### Crons actifs
- cron_daily_update.sh (lun-ven 20h) : ASFIM + forex + recalculs (9 etapes)
- cron_daily_eur_usd.sh (21h30) : perf EUR/USD + classements
- cron_nigeria_weekly.sh (lundi 10h) : SEC Nigeria
- sync_production.sh (horaire) : snapshot PRODUCTION_STATE.json
- cron_health_check.sh (22h quotidien) : monitoring sante systeme — CREE, a deployer
- cron_tunisie_daily.sh (lun-ven 19h) : CMF Tunisie scraper — CREE, a deployer

### Frontend
- Fiches fonds (local/EUR/USD), comparaisons, graphiques Highcharts
- 7 panels utilisateurs
- SEO, null-safety, classement type 3 Afrique

## En cours

### Deploiement securite + CMF Tunisie (PRIORITE HAUTE)
- Commits securite + CMF scraper pushes, a deployer sur production
- 14 jours de VL Tunisie manquantes a rattraper (2026-05-19 → 2026-06-01)

### Priorite B restante
- B5 : Securisation ttyd (auth Basic + IP whitelist)
- B6 : Nettoyage 244 VL Nigeria extremes

## Backlog (moyen terme)

### Qualite donnees
- Ajouter index UNIQUE sur valorisations(fund_id, date)
- Backfill performance_historique ClickHouse
- Tests automatises sur calculs financiers

### Automatisation data
- UEMOA : investiguer API/site BRVM pour scraper automatise (230j stale)
- CEMAC : investiguer COSUMAF pour source donnees (537j stale)

### Panels
- Panel admin cockpit (dashboard, CRUD, rattachements)
- Panel societe de gestion (import-nav, documents, staff, reporting)

### Architecture
- Migration progressive vers microservices (gateway preparee mais non activee)
- Monitoring crons (alertes si echec)
- Contraintes FK reelles MySQL
