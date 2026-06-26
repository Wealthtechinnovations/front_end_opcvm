# TODO — Africafunds OPCVM (vue actionnable)

> Source de verite operationnelle : **SUIVI.md** (ce depot). Dette technique detaillee : **CODE_REVIEW.md**. Vision moyen/long terme : **ROADMAP.md**.
> Ce fichier est une vue synthetique des actions a court terme. Ne pas dupliquer les details ici.

## Deploye (confirme en production)

- [x] T8-T12 : classements, securite admin, .catch routes, response.ok critical — 2026-06-03
- [x] T14 : response.ok 9 pages critiques — 2026-06-03
- [x] T16 : response.ok 26 pages secondaires — 2026-06-05
- [x] T15 : indRef UEMOA 100% (111/111 fonds) — 2026-06-04
- [x] T17 : routes_vl.js multiplication→division (10 lignes) — 2026-06-04
- [x] T19 : fix crash EUR/USD className — 2026-06-05
- [x] T20 : Nigeria mise a jour (82 VL) — 2026-06-05
- [x] T35 : module BRVM BOC + 4406 VL UEMOA + cron_brvm_daily.sh — 2026-06-12
- [x] AUDIT-C : ClickHouse dead route 410 + path traversal multer fix — 2026-06-13
- [x] AUDIT-D : quartile EUR/USD null guard + worker SQL injection fix — 2026-06-13 (API deploye, frontend a deployer)
- [x] LOT 1 (#54) : rankings null/Infinity fix — 2026-06-17
- [x] LOT 2 (#55) : category averages fix (25 moyennes non-null) — 2026-06-17
- [x] LOT 3 (#56) : transaction consistency fix (3545+3579+3579 classements OK) — 2026-06-18
- [x] **#45** CSV formula injection sanitisation (sanitizeCellValue/Row) — commit `277ae47` (verifie code 2026-06-26)
- [x] **#46** .catch() + guard headersSent sur 11 routes apigestionperformance.js — commit `89cabd4` (verifie code 2026-06-26)
- [x] **#49** cron `set -e` supprime + run_step/run_curl (ou ERRORS counter inline pour eur_usd) — commit `26d1f93` (verifie code 2026-06-26)
- [x] **#50** validation HTTP status dans les crons (HTTP_CODE + ERRORS counter) — commit `26d1f93` (verifie code 2026-06-26)
- [x] **Indices** : rebranchement 5 sources 2026 + fix MONIA + fix Tunindex case + outils diagnostic/correction — commits `5314fe0`,`9feb550`,`8a8520b` (a deployer + executer correction)

## A deployer sur VPS

- [ ] **Indices** : deployer `8a8520b` (fix Tunindex) puis executer la correction historique (cf SUIVI.md POINT DE REPRISE — commandes SSH)
- [ ] **Frontend AUDIT-D** : quartile EUR/USD fix (FundSubView.tsx summary-eur + summary-usd) — commit `8a60083`, `npm run build` + `pm2 restart fundafrique-frontend`
- [ ] **#52 ClickHouse resilience** — commit `b815153`, pas encore deploye

## Actions cron (sans risque de regression)

- [ ] **#40** Supprimer ghost cron fix-brvm-nginx.py de la crontab (script absent du VPS) — operation crontab VPS
- [ ] **Installer cron** `cron_indices_daily.sh` (30 18 * * 1-5) — apres correction historique indices

## Dette technique (cf CODE_REVIEW.md)

- [ ] #51 — findValueAtDate() fallback silencieux vers premiere VL (risque regression calcul — prudence)
- [ ] #28 — Factoriser duplication panel/investor vs panel/portfolio (~100 pages)
- [ ] #39 — Cron monitoring sans alerting (email/webhook sur exit non-zero)
- [ ] #27 — Backfill ClickHouse `performance_historique` (FAIBLE — ClickHouse desactive)
- [ ] #15 — Parametrer INSERT ClickHouse batch (FAIBLE — ClickHouse desactive)

## En attente (validation Eric)

- [ ] #44 — authenticate middleware sur routes POST (ajoutVL, uploadsfilevl, postfond, updatefond)
- [ ] #2 — Index UNIQUE sur valorisations(fund_id, date)
- [ ] B5 — Securisation ttyd
- [ ] B6 — Nettoyage 244 VL Nigeria extremes

## Donnees

- [x] UEMOA : **comble** — derniere VL 2026-06-12 (cron BRVM BOC operationnel)
- [ ] CEMAC : derniere VL 2024-12-12 (source COSUMAF a identifier, 539+ jours stale)
- [ ] TUNISIE EUR/USD gap 24% : attente fichier VL avec dividendes
- [ ] Nigeria : SEC a change format, ~195 fonds absents des fichiers recents

## Surveillance

- [ ] OOM MariaDB — surveiller memoire VPS
- [ ] Crons 4 et 5 (eur_usd 21h30, health 22h) : verifier logs
