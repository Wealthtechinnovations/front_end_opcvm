# TODO — Africafunds OPCVM (vue actionnable)

> Source de verite operationnelle : **SUIVI.md** (ce depot). Dette technique detaillee : **CODE_REVIEW.md**. Vision moyen/long terme : **ROADMAP.md**.
> Ce fichier est une vue synthetique des actions a court terme. Ne pas dupliquer les details ici.

## A faire immediatement (deploiement en attente)

- [ ] **Deployer API** (commit `6644682`) : `git pull --rebase` + `pm2 restart api-monolith`
- [ ] **Recalculer les classements** apres deploiement API : `classementmysql`, `classementeur`, `classementusd`
- [ ] **Deployer Frontend** (commit `be1b45e`) : `git pull --rebase` + `npm run build` + `pm2 restart fundafrique-frontend`
- [ ] **Ajouter 2 crons** (crontab) : `cron_tunisie_daily.sh` (19h L-V), `cron_health_check.sh` (22h)
- [ ] **Verifier post-deploiement** : classementType1 non vide, totaux USD coherents (voir SUIVI.md ETAPE 5)

## Dette technique a traiter (cf CODE_REVIEW.md)

- [ ] #26 — Generaliser le check `response.ok` sur les fetch frontend (12.7% couverts)
- [ ] #28 — Factoriser la duplication panel/investor vs panel/portfolio (~100 pages)
- [ ] #27 — Script de backfill ClickHouse `performance_historique` (quand ClickHouse en prod)
- [ ] #2 — Index UNIQUE sur valorisations(fund_id, date) apres nettoyage doublons
- [ ] #15 — Parametrer les INSERT ClickHouse batch (apigestionsavequotidien.js)

## Donnees a rafraichir (cf SUIVI.md ETAT PRODUCTION)

- [ ] UEMOA : derniere VL 2025-10-15 (scraper BRVM automatise a creer)
- [ ] CEMAC : derniere VL 2024-12-12 (source COSUMAF a identifier)

## Surveillance

- [ ] OOM MariaDB 2026-06-02 — surveiller memoire VPS (ClickHouse ~922MB)
