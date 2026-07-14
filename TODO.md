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
- [x] **Indices** : rebranchement 5 sources 2026 + fix MONIA + fix Tunindex case + outils diagnostic/correction — commits `5314fe0`,`9feb550`,`8a8520b` — DEPLOYE (correction historique executee, benchmarks verifies prod 06-27)
- [x] **#62** classement regional/continental fonds recents (categories FundAfrica NULL) — commits `10dafc0`,`da208bb` — DEPLOYE + verifie prod 07-09 (2870 : 6/18 → 44/347)
- [x] **#63** barres ratios EUR/USD tous pays — fix rate-limiter `d57deaa` + populate + recompute — verifie prod 07-09 (866 : ranksharpe 187/272)
- [x] **Cron indices auto-reparant** : `--backfill-days 7` (`ebf1305`) + **fix MONIA v2 parsing HTML** (`bfd1a64`) — DEPLOYES serveur 07-14 via MCP (Lot G) ; 1er passage cron 18h30 du 07-14 comble 07-10→07-14 + debloque MONIA
- [x] **Installer cron** `cron_indices_daily.sh` (30 18 * * 1-5) — INSTALLE et actif (verifie crontab 07-09)
- [x] **Chantier BENCHMARKS 3 couches — conception F1/F2/F3** : `api_opcv/docs/BENCHMARKS_AUDIT_F1.md` + `BENCHMARKS_SOURCES_F2.md` + `BENCHMARKS_F3_MAPPING_SCHEMA.md` — F4 bloque sur 4 decisions utilisateur

## A deployer sur VPS

- [ ] **Frontend BUILD JAMAIS REFAIT depuis les fixes merges** : le serveur front a pulle `b2fc30c` (07-14) mais AUCUN `npm run build` + `pm2 restart fundafrique-frontend` depuis — le bundle servi date d'avant le 3 juillet. Inclut AUDIT-D quartile EUR/USD (`8a60083`) et barres ratios dynamiques (`cf6dba2`). **Action : `deploy_project_s2 project=front_end_opcvm` (build + restart) — VALIDATION UTILISATEUR requise (restart PM2).**
- [ ] **#52 ClickHouse resilience** — commit `b815153` : dans l'historique pulle, mais actif seulement apres restart api-monolith (a coupler avec un prochain restart planifie)

## Actions cron (sans risque de regression)

- [ ] **#40** Supprimer ghost cron fix-brvm-nginx.py de la crontab (script absent du VPS) — operation crontab VPS
- [ ] `pm2 flush api-monolith` : log d'erreur 1,1 Go herite du crash-loop du 07-03
- [ ] Basculer workers `worker-data-import`/`worker-recalculation` en Node 18 (encore Node 14) + `engines` dans package.json

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

- [x] UEMOA : **comble** — cron BRVM BOC operationnel (VL J-1 au 07-14)
- [x] Tunisie indRef 2011-2021 : **backfill 180310 VL** (Lot B 07-03), couverture 99,9%
- [ ] CEMAC : derniere VL 2024-12-12 (34 fonds). **Indice = source transmise et identifiee** (`BVMAC_INDICES` → bvm-ac.org/indices, referentiel_fundafrica.json ; mapping CEMAC=BVMAC corrige ; RFR BEAC en base). **VL fonds = source manquante** (COSUMAF a fournir : export regulateur ou fichiers societes de gestion). Cf CODE_REVIEW #70 MAJ 07-14.
- [ ] TUNISIE EUR/USD gap 24% : attente fichier VL avec dividendes
- [ ] Nigeria : SEC a change format, ~195 fonds absents des fichiers recents ; 337 fonds actifs sans VL >30j toutes zones (politique dormants a decider)
- [ ] Ratios locaux 641 < EUR/USD 947 : realigner le populate local (apres F4)

## Decisions utilisateur en attente (bloquent la suite)

1. **Couche Afrique** : proxy synthetique maison (reco, sans licence, is_synthetic=true) OU licence S&P DJI ?
2. **CEMAC VL** : fournir la source des valeurs liquidatives (l'indice BVMAC, lui, est identifie)
3. **337 fonds dormants** : diagnostic + desactivation validee (reco) OU laisser en l'etat ?
4. **Priorite F4 benchmarks** : par pays (reco : couche 1 complete pays par pays) OU par couche ?
5. **Build+restart frontend** : autoriser `deploy_project_s2 front_end_opcvm` pour activer les fixes UI en attente depuis le 13/06 ?

## Surveillance

- [ ] OOM MariaDB — surveiller memoire VPS
- [ ] Crons 4 et 5 (eur_usd 21h30, health 22h) : verifier logs
