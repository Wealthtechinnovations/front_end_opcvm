# AfricaFunds Regulatory Plus Integration — Implementation Plan

> **For agentic workers:** exécuter ce plan tâche par tâche, sur les branches canoniques existantes, sans nouvelle branche et sans régression.

**Goal:** intégrer dans AfricaFunds les mécanismes de gouvernance génériques réellement présents dans `chainsolutions-wealthtech/Regulatory`, en les adaptant à l’architecture bi-repository AfricaFunds et en préservant intégralement les documents, décisions, données, scripts, workflows et historiques existants.

**Architecture:** `front_end_opcvm` reste le dépôt du checkpoint opérationnel global ; `api_opcv` reste l’autorité backend/data. Les deux dépôts reçoivent les mêmes fonctions transversales de gouvernance, mais les documents spécialisés deviennent des adaptateurs ou spécialisations lorsqu’une autorité historique existe déjà. Loop Engineering orchestre les autorités existantes et les nouveaux registres de continuité ; il ne crée pas une vérité parallèle.

**Tech Stack:** GitHub Git Data/Contents API, Markdown, GitHub Actions existantes, JSON/YAML/CSV existants, Node.js/Next.js côté frontend, Node.js/Sequelize côté API.

**Spec:** `GOVERNANCE.md`, `SOURCE_OF_TRUTH.md`, `LOOP_ENGINEERING.md`, `DIRECTIVE_TRAVAIL.md`, `docs/governance/GOV-006_GITHUB_S2_RECONCILIATION_2026-09-10.md`, et modèle de référence `chainsolutions-wealthtech/Regulatory@main`.

## Global Constraints

- Produit canonique : **AfricaFunds**.
- API : `Wealthtechinnovations/api_opcv`.
- Frontend : `Wealthtechinnovations/front_end_opcvm`.
- Branche canonique des deux dépôts : `claude/code-review-improvements-ikvuj`.
- `NEW_BRANCH_CREATION = FORBIDDEN`.
- `FORCE_PUSH = FORBIDDEN`.
- `HISTORY_REWRITE = FORBIDDEN`.
- `ZERO_REGRESSION = REQUIRED`.
- Aucun document historique utile n’est supprimé, renommé, déplacé ou remplacé pour satisfaire cette intégration.
- Préférer : `KEEP_EXISTING → ENRICH_EXISTING → CREATE_ADAPTER/INDEX → CREATE_CANONICAL`.
- `FUND_STATE = (API_HEAD, FRONTEND_HEAD, SUIVI_CHECKPOINT, PRODUCTION_ATTESTATION)`.
- `front_end_opcvm/SUIVI.md` reste l’historique/checkpoint global ; les nouveaux `STATUS`, `WORK_LOG`, `LOOP_STATE`, `CURRENT_ITERATION`, `HANDOFF`, `NEXT_ACTION` ont des rôles complémentaires, jamais concurrents.
- Le chemin technique historique `/var/lib/fundafrica/runtime/PRODUCTION_STATE.json` reste inchangé tant que l’infrastructure réelle n’est pas migrée ; seul le nom produit dans la documentation nouvelle devient AfricaFunds.

---

### Task 1: Baseline et matrice d’intégration

**Files:**
- Create: `DOCUMENT_INTEGRATION_MATRIX.md`
- Create: `FILES_CATALOG.md`
- Create: `MANIFEST.md`

- [ ] Relever les HEAD API et frontend.
- [ ] Comparer les rôles Regulatory aux documents AfricaFunds existants.
- [ ] Classer chaque capacité en `KEEP`, `ENRICH`, `ADAPT`, `CREATE` ou `CONDITIONAL`.
- [ ] Vérifier qu’aucune action destructive n’est nécessaire.
- [ ] Persister la matrice et le manifeste.

### Task 2: Mémoire opérationnelle structurée

**Files:**
- Create: `PROJECT_CONTEXT.md`, `STATUS.md`, `NEXT_ACTION.md`, `LOOP_STATE.md`, `CURRENT_ITERATION.md`, `WORK_LOG.md`, `HANDOFF.md`, `OPEN_QUESTIONS.md`, `BOOTSTRAP_CHECKLIST.md`
- Modify: `00_START_HERE.md`, `LOOP_ENGINEERING.md`

- [ ] Créer les registres avec rôles distincts.
- [ ] Raccorder l’ordre de lecture.
- [ ] Maintenir `SUIVI.md` comme historique/checkpoint global.
- [ ] Exiger une prochaine action unique à chaque clôture de boucle.

### Task 3: Gouvernance, décisions, qualité et sécurité

**Files:**
- Create/adapt: `docs/01-governance/*`, `docs/03-architecture/*`, `docs/04-development/*`, `docs/05-quality/*`, `docs/08-security/*`, `docs/adr/*`

- [ ] Réutiliser les canons existants via adaptateurs lorsque nécessaire.
- [ ] Formaliser Ready/Done, exceptions, escalade, ownership/RACI, audit trail et change management.
- [ ] Formaliser non-régression, quality gates, tests, sécurité et politique de secrets.
- [ ] Enregistrer les décisions structurantes dans des ADR sans réécrire l’histoire.

### Task 4: Delivery, opérations et S2

**Files:**
- Create/adapt: `docs/06-delivery/*`, `docs/07-operations/*`

- [ ] Relier build/CI/CD/déploiement/rollback aux workflows AfricaFunds existants.
- [ ] Conserver GOV-006 comme autorité sur GitHub↔S2↔runtime.
- [ ] Ne jamais transformer les documents Regulatory en procédures de production fictives : toute procédure doit renvoyer vers les scripts/workflows AfricaFunds réellement existants.

### Task 5: Loop Engineering et gouvernance IA

**Files:**
- Create/adapt: `docs/09-loop/*`, `docs/10-ai/*`, `docs/11-templates/*`

- [ ] Formaliser drift, failures, hypotheses, learning, metrics, restart et retrospective.
- [ ] Formaliser capacités IA, autonomie, approbation humaine, politique d’outils et handoff.
- [ ] Conserver `AGENTS.md`, `CLAUDE.md`, `GPT.md`, `MCP_AUTONOMY.md` comme historique/adaptateurs lorsque leur contenu reste utile.

### Task 6: Git knowledge system machine-readable

**Files:**
- Create: `.governance/schemas/*`, `.governance/knowledge/*`, `.governance/matrices/*`, `.governance/loop/*`

- [ ] Lier `source/decision → requirement → acceptance criteria → task → change → test → evidence → SHA → handoff`.
- [ ] Déclarer explicitement l’autorité humaine vs machine pour empêcher une vérité parallèle.
- [ ] Faire échouer la clôture si une preuve requise ou un point de reprise est absent.

### Task 7: Vérification et persistance

- [ ] Réobserver les deux HEAD.
- [ ] Vérifier les nouveaux arbres et les collisions de chemins.
- [ ] Vérifier que tous les anciens blobs/documents sont encore présents.
- [ ] Vérifier les workflows/checks disponibles.
- [ ] Mettre à jour `STATUS`, `WORK_LOG`, `LOOP_STATE`, `HANDOFF`, `NEXT_ACTION` et append-only `SUIVI.md` selon le résultat réel.
- [ ] Ne déclarer `DEPLOYED/PRODUCTION_VERIFIED` qu’après mesure réelle GitHub↔S2↔runtime.
