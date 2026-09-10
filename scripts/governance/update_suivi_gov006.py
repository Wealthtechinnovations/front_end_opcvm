from pathlib import Path
import re

p = Path("SUIVI.md")
text = p.read_text(encoding="utf-8")
marker = "## POINT DE REPRISE COURANT — GOV-006 / gouvernance GitHub ↔ S2"

checkpoint = """## POINT DE REPRISE COURANT — GOV-006 / gouvernance GitHub ↔ S2

> **Statut : `TECHNICALLY_RECONCILED / DOCUMENTATION_CLOSURE_IN_PROGRESS` — 2026-09-10.**
> Ce checkpoint prime sur les anciennes lignes P2-05 relatives aux snapshots Git S2.

### Réalisé et vérifié

- gouvernance Regulatory complémentaire intégrée sans remplacer la gouvernance FundAfrica existante ;
- branches canoniques des deux dépôts maintenues sur `claude/code-review-improvements-ikvuj` ;
- `00_START_HERE.md`, `GOVERNANCE.md`, `SOURCE_OF_TRUTH.md`, `AGENTS.md`, `LOOP_ENGINEERING.md` synchronisés entre API et frontend ;
- `governance-contract` inter-repository introduit et exécuté avec succès ;
- divergence API S2 analysée : **854 commits locaux exclusifs = 854 snapshots `PRODUCTION_STATE.json`, 0 commit applicatif local** ;
- cause racine : `sync_production.sh`/cron fabriquait un historique Git depuis le runtime ;
- snapshot live déplacé vers `/var/lib/fundafrica/runtime/PRODUCTION_STATE.json` ;
- `check_doc_drift.js` rendu backward-compatible avec fallback historique ;
- mutations Git automatiques retirées du producteur de snapshot et contrôlées par CI ;
- ancienne branche API S2 sauvegardée pendant la réconciliation dans `/var/backups/fundafrica-governance/20260910T020803Z/api/local-branch-before.bundle` avec `git bundle verify` réussi ;
- réalignement API réalisé sans `git reset --hard`, sans `git clean -fd`, sans force-push et sans suppression des untracked ;
- changement local frontend `package-lock.json` reconnu légitime (`engines.node >=18.17.0`) et remonté dans GitHub avant synchronisation ;
- `.mcp_logs/` classé comme log local et ignoré sans suppression ;
- avant le lot documentaire GOV-006, GitHub et S2 étaient fraîchement attestés identiques : API `723f893da2d6925b03cd1c81c9a91b6440ddaacf`, frontend `edd597b18e5879667152c92164226437a259f42b` ;
- documentation canonique ajoutée sous `docs/governance/`, `docs/architecture/`, `docs/runbooks/` et `docs/evidence/`.

### Vigilance conservée

- les répertoires API `data/datejour_snapshots/`, `data/naira_snapshots/`, `data/scale_break_snapshots/`, `sec_ng_downloads/` sont préservés ;
- l'artefact API S2 non suivi `0` reste **`UNKNOWN`** : ne pas supprimer, ignorer ou committer avant classification ;
- la divergence PM2 in-memory/local observée est une maintenance séparée, pas un sous-lot opportuniste de GOV-006 ;
- les anomalies métier/data historiques (Nigeria, performances, CEMAC, etc.) restent des chantiers distincts.

### Autorités et runbook

- post-mortem : `docs/governance/GOV-006_GITHUB_S2_RECONCILIATION_2026-09-10.md` ;
- architecture : `docs/architecture/GITHUB_S2_RUNTIME_AUTHORITY_MODEL.md` ;
- runbook : `docs/runbooks/GITHUB_S2_RECONCILIATION_RUNBOOK.md` ;
- preuves structurées : `docs/evidence/GOV-006_EVIDENCE_2026-09-10.json`.

### Garde de clôture

Ne passer GOV-006 à `CERTIFIED` qu'après : relecture des nouveaux HEAD GitHub documentaires, synchronisation S2 non destructive, preuve `API_S2=API_GITHUB` et `FRONT_S2=FRONT_GITHUB`, CI de gouvernance verte et vérification runtime/HTTP post-documentation.

### Prochaine action unique

**Terminer l'attestation post-documentation GOV-006. `INST-001` reste fermé jusqu'à cette preuve.**

---

"""

if marker not in text:
    first_sep = text.find("---\n")
    if first_sep == -1:
        raise SystemExit("Top separator not found in SUIVI.md")
    insert_at = first_sep + len("---\n")
    text = text[:insert_at] + "\n" + checkpoint + text[insert_at:].lstrip("\n")

replacement = "| ~~P2-05~~ | Infra | **RESOLU GOV-006 le 2026-09-10** : les commits S2 provenaient du snapshot horaire `PRODUCTION_STATE.json`. Classification finale : 854/854 snapshots, 0 commit applicatif local. Le snapshot live est maintenant hors Git dans `/var/lib/fundafrica/runtime/PRODUCTION_STATE.json` et le producteur ne doit plus muter Git. | **PROD + GOV-006** | Surveiller le contrat CI et appliquer le runbook `docs/runbooks/GITHUB_S2_RECONCILIATION_RUNBOOK.md` à toute nouvelle divergence. |"
text, n = re.subn(r"(?m)^\| P2-05 \| Infra \|.*$", replacement, text, count=1)
if n != 1 and "~~P2-05~~" not in text:
    raise SystemExit(f"Expected one P2-05 row, replaced={n}")

plan_replacement = "| **B** | ~~P2-05 — reparer `sync_production.sh`~~ **RESOLU GOV-006** | Clos | Snapshot live hors Git + controle CI ; appliquer le runbook en cas de nouvelle divergence |"
text, n2 = re.subn(r"(?m)^\| \*\*B\*\* \| P2-05 — reparer `sync_production\.sh` \|.*$", plan_replacement, text, count=1)
if n2 not in (0, 1):
    raise SystemExit(f"Unexpected plan-row replacements={n2}")

p.write_text(text, encoding="utf-8")
print(f"SUIVI updated; checkpoint_added={marker in text}; p2_05_replacements={n}; plan_replacements={n2}")
