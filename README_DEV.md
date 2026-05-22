# README_DEV — Guide developpeur Africafunds

## Architecture

### Backend (api_opcv)
- Express.js + Sequelize ORM + MySQL
- Port: 3005 (PM2: api-monolith)
- 113+ endpoints API
- ClickHouse optionnel pour analytics

### Frontend (front_end_opcvm)
- Next.js 14.2.3 (App Router)
- TypeScript, Tailwind CSS, Highcharts
- Port: 3000 (PM2: fundafrique-frontend)

### Base de donnees
- MySQL: fund_opcvm (host: 127.0.0.1, user: fund_opcvm)
- Tables principales: fond_investissements, valorisations, performences, classementfonds, devisedechanges, societes, indice_references
- ClickHouse: fund_analytics (port 8123, optionnel)

## Branches
- Branche de dev: claude/code-review-improvements-ikvuj
- Ne jamais pousser sur main sans validation

## Deploiement

### API
```bash
cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/api
git stash && git pull --rebase origin claude/code-review-improvements-ikvuj && git stash pop
pm2 restart api-monolith
```

### Frontend
```bash
cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend
git stash && git pull --rebase origin claude/code-review-improvements-ikvuj && git stash pop
npm run build && pm2 restart fundafrique-frontend
```

## Scripts de maintenance
- recalc_vl_ajuste.js : Recalcul VL ajustees (value + cumul dividendes)
- recalc_eur_usd_daily_rate.js : Conversion EUR/USD (DIVISION par taux)
- fix_populate_performances.js : Calcul performances locales (SQL direct)
- fix_populate_performances_eur_usd.js : Performances EUR/USD
- fix_tsr_per_country.js : TSR par pays
- import_vl_tunisie_cmf.js : Import VL Tunisie CMF
- import_vl_nigeria_sec.js : Import VL Nigeria SEC

## Crons
- 0 20 * * 1-5 : cron_daily_update.sh (9 etapes)
- 30 21 * * * : cron_daily_eur_usd.sh
- 0 10 * * 1 : cron_nigeria_weekly.sh
- 0 * * * * : sync_production.sh (snapshot PRODUCTION_STATE.json)

## Conventions
- Conversion devise : DIVISION par taux (jamais multiplication)
- Pays en MAJUSCULES (MAROC, TUNISIE, NIGERIA, UEMOA, CEMAC)
- Securite : ne jamais exposer secrets dans git
- Zero regression : toute evolution additive et non destructive
