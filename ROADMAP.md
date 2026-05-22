# ROADMAP — Africafunds OPCVM Platform

## Vision
Plateforme de reference pour les OPCVM africains : donnees VL, performances, classements, comparaisons multi-devises (locale, EUR, USD), referentiel FundAfrica, panels utilisateurs.

## Fait (2026-05-22)

### Infrastructure
- Serveur Ionos VPS (217.160.249.254)
- Nginx reverse proxy (SSL, CORS)
- PM2 : api-monolith (3005), fundafrique-frontend (3000), worker-recalculation, worker-data-import
- MySQL fund_opcvm, ClickHouse fund_analytics (analytics optionnel)

### Donnees
- 1,203 fonds actifs, 962,580 VL
- 5 marches : MAROC (640), NIGERIA (279), TUNISIE (131), UEMOA (111), CEMAC (34)
- Forex 21 paires historiques + cron quotidien
- Indices : MASI, Tunindex, NSE, BRVM, MONIA
- Performances 3 devises (local/EUR/USD)
- Classements 3 types x 3 devises
- Rendements 1.09M lignes
- Referentiel FundAfrica : 5 tables, 99.1% fonds mappes

### Crons actifs
- cron_daily_update.sh (lun-ven 20h) : ASFIM + forex + recalculs
- cron_daily_eur_usd.sh (21h30) : perf EUR/USD + classements
- cron_nigeria_weekly.sh (lundi 10h) : SEC Nigeria
- sync_production.sh (horaire) : snapshot etat

### Frontend
- Fiches fonds (local/EUR/USD), comparaisons, graphiques Highcharts
- 7 panels utilisateurs
- SEO, null-safety, classement type 3 Afrique

## En cours

### Priorite B (court terme)
- B3 : Affichage indice FundAfrica distinct du benchmark
- B5 : Securisation ttyd (auth Basic + IP whitelist)
- B6 : Nettoyage 244 VL Nigeria extremes

### Classements Tunisie
- Relance classementmysql/classementeur/classementusd avec les 131 fonds Tunisie

## Backlog (moyen terme)

### Qualite donnees
- Ajouter index UNIQUE sur valorisations(fund_id, date)
- Backfill performance_historique ClickHouse
- Corriger 11 fonds sans classification
- Tests automatises sur calculs financiers

### Securite
- Corriger injection SQL dans analytics.js
- Audit complet endpoints API (auth, CORS)
- Securisation ttyd Nginx

### Panels
- Panel admin cockpit (dashboard, CRUD, rattachements)
- Panel societe de gestion (import-nav, documents, staff, reporting)
- Corriger bugs serialisation JSON panel portfolio

### Architecture
- Migration progressive vers microservices (gateway preparee mais non activee)
- Monitoring crons (alertes si echec)
- Contraintes FK reelles MySQL
