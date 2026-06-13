# ROADMAP — Africafunds OPCVM Platform

## Vision
Plateforme de reference pour les OPCVM africains : donnees VL, performances, classements, comparaisons multi-devises (locale, EUR, USD), referentiel FundAfrica, panels utilisateurs.

## Fait (mis a jour 2026-06-13)

### Infrastructure
- Serveur Ionos VPS (217.160.249.254)
- Nginx reverse proxy (SSL, CORS)
- PM2 : api-monolith (3005), fundafrique-frontend (3000), worker-recalculation, worker-data-import
- MySQL fund_opcvm, ClickHouse fund_analytics (analytics optionnel)

### Donnees (snapshot 2026-06-13)
- 1,208 fonds, 981,909 VL
- 5 marches : MAROC (640), NIGERIA (284), TUNISIE (131), UEMOA (111), CEMAC (34)
- Forex 21 paires historiques + cron quotidien
- Indices : MASI, Tunindex, NSE, BRVM Composite, MONIA
- Performances 3 devises : 61,306 local + 8,023 EUR + 8,256 USD
- Classements 3 types x 3 devises : ~3,550 par devise
- Rendements 1.09M lignes
- Referentiel FundAfrica : 5 tables, 99.1% fonds mappes

### Securite (2026-06-01 → 2026-06-13)
- eval() RCE elimine (144 appels dans routes_vl.js)
- SQL injection corrigee (analytics.js, apigestionsavequotidien.js, worker-recalculation.js)
- Rate limiting auth 10 req/15min sur login/password
- Multer 5MB file size limit sur 13 routes upload + path traversal filename fix
- Credentials retires de sync_production.sh (source .env)
- NaN className corrige sur 5 pages frontend (147 patterns)
- ClickHouse dead route (`/api/classementquartile/:id`) remplacee par 410 Gone
- Quartile EUR/USD null guard (division par undefined)

### Automatisation data
- MAROC : cron_daily_update.sh (ASFIM, lun-ven 20h) — AUTOMATISE
- NIGERIA : cron_nigeria_weekly.sh (SEC, lundi 10h) — AUTOMATISE
- TUNISIE : cron_tunisie_daily.sh (CMF, lun-ven 19h) — AUTOMATISE
- UEMOA : cron_brvm_daily.sh (BRVM BOC PDF, lun-ven 19h30) — AUTOMATISE (T35, 2026-06-12)
- CEMAC : aucun script, aucune source (COSUMAF) — A INVESTIGUER

### Crons actifs (8 dans crontab, 7 operationnels)
- cron_tunisie_daily.sh (lun-ven 19h) : CMF Tunisie scraper
- cron_brvm_daily.sh (lun-ven 19h30) : BRVM BOC PDF scraper — DEPLOYE 2026-06-12
- cron_daily_update.sh (lun-ven 20h) : ASFIM + forex + recalculs (9 etapes)
- cron_daily_eur_usd.sh (21h30) : perf EUR/USD + classements
- cron_health_check.sh (22h quotidien) : monitoring sante systeme
- cron_nigeria_weekly.sh (lundi 10h) : SEC Nigeria
- sync_production.sh (horaire) : snapshot PRODUCTION_STATE.json
- fix-brvm-nginx.py (toutes les 5 min) : GHOST — script absent du VPS (CODE_REVIEW #40, a supprimer)

### Frontend
- Fiches fonds (local/EUR/USD), comparaisons, graphiques Highcharts
- 7 panels utilisateurs
- SEO, null-safety, classement type 3 Afrique
- response.ok guards sur 35 pages (672+115 fetch audites)

### Audit global (LOTs AUDIT-A a D, 2026-06-13)
- 51 items documentes dans CODE_REVIEW.md
- 5 corrections deployees (#42, #43, #47, #48 securite/correctness)
- Classements locaux : 22 fonds diagnostiques, 17 resolus par crons, 5 exclusion attendue
- Performances : formules verifiees, conversion DIVISION confirmee
- Workers : SQL injection corrigee, scheduling naif documente

## En cours

### Priorite B (en attente validation Eric)
- B5 : Securisation ttyd (auth Basic + IP whitelist)
- B6 : Nettoyage 244 VL Nigeria extremes
- Index UNIQUE valorisations(fund_id, date)

### Ameliorations crons (CODE_REVIEW #49, #50)
- cron_daily_update.sh : remplacer `set -e` par gardes par etape
- Ajouter validation HTTP status aux curl dans les crons

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
