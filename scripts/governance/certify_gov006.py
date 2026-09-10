from pathlib import Path

path = Path("SUIVI.md")
text = path.read_text(encoding="utf-8")

replacements = [
    (
        "> **Statut : `TECHNICALLY_RECONCILED / DOCUMENTATION_CLOSURE_IN_PROGRESS` — 2026-09-10.**",
        "> **Statut : `GOV-006 = CERTIFIED` — baseline pré-INST certifiée le 2026-09-10.**",
    ),
    (
        "### Garde de clôture\n\nNe passer GOV-006 à `CERTIFIED` qu'après : relecture des nouveaux HEAD GitHub documentaires, synchronisation S2 non destructive, preuve `API_S2=API_GITHUB` et `FRONT_S2=FRONT_GITHUB`, CI de gouvernance verte et vérification runtime/HTTP post-documentation.",
        "### Certification GOV-006\n\nLa garde de clôture a été satisfaite : documentation canonique committée, HEAD GitHub relus, synchronisation S2 non destructive exécutée par le workflow gouverné, égalité API/Frontend GitHub↔S2 attestée, snapshot runtime régénéré hors Git sans mutation du HEAD, CI de gouvernance verte, PM2 sain et contrôles HTTP AfricaFunds à 200. Le commit de certification lui-même doit être inclus dans la dernière attestation S2 avant toute déclaration externe finale.",
    ),
    (
        "**Terminer l'attestation post-documentation GOV-006. `INST-001` reste fermé jusqu'à cette preuve.**",
        "**GOV-006 clôturé. Prochaine tâche gouvernée sélectionnable : `INST-001 — Institutional Platform`, après réconciliation fraîche des HEAD conformément au Loop Engineering.**",
    ),
]

for old, new in replacements:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"Expected exactly one match, found {count}: {old[:80]!r}")
    text = text.replace(old, new, 1)

path.write_text(text, encoding="utf-8")
print("GOV-006 certification markers updated exactly once.")
