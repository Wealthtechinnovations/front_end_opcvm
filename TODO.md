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

## A deployer sur VPS

- [ ] **Frontend AUDIT-D** : quartile EUR/USD fix (FundSubView.tsx summary-eur + summary-usd) — commit `8a60083`, `npm run build` + `pm2 restart fundafrique-frontend`

## Actions cron (sans risque de regression)

- [ ] **#49** cron_daily_update.sh : remplacer `set -e` par gardes par etape (risque : pipeline coupe si un curl echoue)
- [ ] **#50** Ajouter validation HTTP status aux curl dans les crons
- [ ] **#40** Supprimer ghost cron fix-brvm-nginx.py de la crontab (script absent du VPS)

## Dette technique (cf CODE_REVIEW.md)

- [ ] #46 — Ajouter .catch() aux promise chains dans apigestionperformance.js
- [ ] #45 — CSV formula injection sanitisation dans routes upload
- [ ] #51 — findValueAtDate() fallback silencieux vers premiere VL
- [ ] #28 — Factoriser duplication panel/investor vs panel/portfolio (~100 pages)
- [ ] #27 — Backfill ClickHouse `performance_historique`
- [ ] #15 — Parametrer INSERT ClickHouse batch

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
