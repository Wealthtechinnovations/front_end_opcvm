# TASKS — Africafunds OPCVM (journal des lots)

> Source de verite operationnelle : **SUIVI.md**. Ce fichier resume l'historique des lots (LOT Tx) pour une lecture rapide.
> Detail complet de chaque lot : voir SUIVI.md.

| Lot | Date | Objet | Statut | Commit(s) |
|-----|------|-------|--------|-----------|
| T4 | 2026-06-02 | Forex EUR/TND (ECB fallback, cross-rate) | Deploye | `97a5f22` |
| T5 | 2026-06-02 | Deep audit (totalfondscompose, null safety, DB resilience) | Deploye | `f3ddd6a`, `4af1b35` |
| T6 | 2026-06-03 | Deploiement production T4+T5 | Deploye | — |
| T7 | 2026-06-03 | Crash page fonds 'reading 1' (FundView slicedPostc) | Deploye | `ddf7b3f` |
| T8 | 2026-06-03 | Analyse bout en bout + securite (auth admin, Math.random, valLiq 404) | Deploye | `5540d95`, `bb03081`, `b7c962b` |
| T9 | 2026-06-03 | routes_vl.js : 10 .catch() (resilience) | Deploye | `5b70838` |
| T10 | 2026-06-03 | Classement national local vide → MAX(date)/fond | Deploye + recalc OK | `6644682` |
| T11 | 2026-06-03 | Totaux EUR/USD gonfles → keepLatestPerFund() | Deploye + recalc OK | `6644682` |
| T12 | 2026-06-03 | Page USD benchmark annuel EUR→USD | Deploye | `be1b45e` |
| T13 | 2026-06-03 | Diagnostic liaison indices↔fonds (couverture indRef EUR/USD) | Diagnostic pret | `e06798b` |
| T14 | 2026-06-03 | #26 response.ok : 9 pages fonds critiques (672 fetch audites) | Deploye, 9 pages 200 | `4c49a44` |
| T16 | 2026-06-03 | #26 response.ok : 26 pages secondaires (countries, country-panel, fund-managers) | Deploye, pages 200 | `2814e9a` |
| T15 | 2026-06-04 | Fix indRef: UEMOA mapping + step4 mul→div | Deploye | `f6d7cb2` |
| T17 | 2026-06-04 | Fix routes_vl.js mul→div (10 lignes, conversion devise) | Deploye | — |
| T19 | 2026-06-05 | Fix crash EUR/USD className slicedPostc | Deploye | `0dc046b` |
| T20 | 2026-06-05 | Nigeria mise a jour (82 VL, SEC 2026) | Deploye | — |
| T35 | 2026-06-12 | Module BRVM BOC + 4406 VL UEMOA + cron | Deploye | `8a3a707` |
| AUDIT-A | 2026-06-13 | Health check + diagnostic classement local | Diagnostic | — |
| AUDIT-B | 2026-06-13 | EVOLUTIS VL recovery (salvage_implausible_year) | Deploye | — |
| AUDIT-C | 2026-06-13 | Securite API (#42 ClickHouse, #43 multer) | Deploye | `e5dddb6` |
| AUDIT-D | 2026-06-13 | Quartile EUR/USD + worker SQL injection | Deploye (API), a deployer (frontend) | `8a60083` |
| LOT 1 (#54) | 2026-06-17 | Rankings null/Infinity fix | Deploye | — |
| LOT 2 (#55) | 2026-06-17 | Category averages fix (25 moyennes non-null) | Deploye + verifie | — |
| LOT 3 (#56) | 2026-06-18 | Transaction consistency fix (3545+3579+3579 classements OK) | Deploye + verifie | `e3d8fec` |

## Lots recents (MCP WealthTech, autonomie)

| Lot | Date | Objet | Statut | Commit(s) |
|-----|------|-------|--------|-----------|
| Indices | 2026-06-26/27 | Correction sources indices + propagation indRef + fix valLiq/casse | Deploye + verifie | `85b1d1c`, `d4a237d` |
| Audit | 2026-07-02 | Audit complet plateforme (secu/finance/data/frontend) | Documente (#64-#72) | `797e1ed` |
| Lot B | 2026-07-03 | Backfill indRef Tunisie 2011-2021 (180310) + recalc EUR/USD | EXECUTE + verifie prod | `1a7e70a` |

**A faire (priorise)** : #62 recompute classement 19 fonds a cache perime · #63 populate ratios EUR/USD (script `fix_populate_performances_eur_usd.js` existe, a whitelister) · #64-#66 securite (secrets git, routes admin non authentifiees).

## Prochain lot envisage

- **#49** : cron_daily_update.sh `set -e` → gardes par etape
- **#46** : .catch() promise chains apigestionperformance.js
- **T31** : #28 factoriser duplication panel/investor vs panel/portfolio
- **T35-suite** : page admin supervision BRVM BOC + validation UNMATCHED/AMBIGUOUS

> Pour reprendre : lire SUIVI.md > POINT DE REPRISE COURANT, puis CODE_REVIEW.md.
