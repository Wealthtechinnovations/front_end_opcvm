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
| T16 | 2026-06-03 | #26 response.ok : 26 pages secondaires (countries, country-panel, fund-managers) | Commite, a deployer | `2814e9a` |

## Prochain lot envisage

- LOT T15 : Corrections indRef EUR/USD suite T13 (recalc TND, mapping BRVM→UEMOA, decision metier CEMAC) — ATTEND donnees DB du VPS
- LOT T17 : Fix incohérence route_vl.js multiplication vs division (P5 T13) — route prod sensible
- LOT T18 : #28 factoriser duplication panel/investor vs panel/portfolio

> Pour reprendre : lire SUIVI.md > POINT DE REPRISE COURANT, puis CODE_REVIEW.md.
