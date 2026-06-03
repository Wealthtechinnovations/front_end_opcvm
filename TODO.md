# TODO — Africafunds OPCVM (vue actionnable)

> Source de verite operationnelle : **SUIVI.md** (ce depot). Dette technique detaillee : **CODE_REVIEW.md**. Vision moyen/long terme : **ROADMAP.md**.
> Ce fichier est une vue synthetique des actions a court terme. Ne pas dupliquer les details ici.

## Deploye le 2026-06-03

- [x] **Deployer API** (commits T8-T11) : `git pull --rebase` + `pm2 restart api-monolith` — FAIT
- [x] **Recalculer les classements** : `classementmysql` + `classementeur` + `classementusd` — FAIT (type1 OK)
- [x] **Deployer Frontend** (commits T8-T12) : `git pull --rebase` + `npm run build` + `pm2 restart` — FAIT
- [x] **Ajouter 2 crons** : `cron_tunisie_daily.sh` (19h L-V) + `cron_health_check.sh` (22h) — FAIT
- [x] **Classement national type1 confirme OK** en production apres recalcul

## A deployer (pret, commite, non encore en prod)

- [ ] **#26 response.ok** : 9 pages fonds critiques durci (commit `4c49a44`). Deployer frontend.
- [ ] **T13 diagnostic indices** : rapport + requetes SQL pret (commit API `e06798b`). Actions data a lancer sur VPS.

## Dette technique a traiter (cf CODE_REVIEW.md)

- [ ] #28 — Factoriser la duplication panel/investor vs panel/portfolio (~100 pages)
- [ ] #27 — Script de backfill ClickHouse `performance_historique` (quand ClickHouse en prod)
- [ ] #2 — Index UNIQUE sur valorisations(fund_id, date) apres nettoyage doublons
- [ ] #15 — Parametrer les INSERT ClickHouse batch (apigestionsavequotidien.js)

## Donnees a rafraichir (cf SUIVI.md ETAT PRODUCTION)

- [ ] UEMOA : derniere VL 2025-10-15 (scraper BRVM automatise a creer)
- [ ] CEMAC : derniere VL 2024-12-12 (source COSUMAF a identifier)

## Surveillance

- [ ] OOM MariaDB 2026-06-02 — surveiller memoire VPS (ClickHouse ~922MB)
