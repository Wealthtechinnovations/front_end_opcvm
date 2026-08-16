#!/bin/bash
#
# Build du frontend avec le MEME Node.js que celui qui l execute en production.
#
# POURQUOI CE SCRIPT
# ------------------
# Le 2026-08-16, `deploy_project_s2 front_end_opcvm` a echoue :
#
#     > next build
#     You are using Node.js 14.16.0. For Next.js, Node.js version >= v18.17.0 is required.
#
# Le frontend etait alors fige depuis un mois : son bundle datait d avant le
# 3 juillet, privant la production des correctifs UI deja merges (quartile
# EUR/USD, barres de ratios dynamiques).
#
# Diagnostic du serveur :
#   - le shell de deploiement utilise /usr/local/bin/node = v14.16.0 ;
#   - PM2 lance pourtant le frontend avec
#     /root/.nvm/versions/node/v18.20.8/bin/node (verifie dans ~/.pm2/dump.pm2
#     et confirme par /proc/<pid>/exe : next-server v14.2.3 tourne bien en 18.20.8).
#
# Le runtime n a donc jamais ete le probleme — seul le PATH du build l etait.
# Construire avec une version differente de celle qui execute est de toute
# facon une mauvaise pratique : ce script aligne les deux.
#
# Il ne modifie ni PATH global, ni configuration systeme, ni PM2. Il choisit un
# interpreteur pour la duree du build, et rien d autre.

set -euo pipefail

VERSION_MINIMALE_MAJEURE=18

# Candidats par ordre de preference. Le premier est l interpreteur reellement
# utilise par PM2 en production : construire avec lui garantit que le bundle
# produit et le processus qui le sert partagent la meme version.
CANDIDATS=(
  "/root/.nvm/versions/node/v18.20.8/bin"
  "/opt/plesk/node/20/bin"
  "/opt/plesk/node/18/bin"
  "/root/.nvm/versions/node/v20.20.2/bin"
)

majeure_de() {
  "$1/node" --version 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/'
}

# Si le node deja actif convient, ne rien changer : c est le cas en local et en
# CI, ou imposer un chemin serveur serait absurde.
COURANT="$(node --version 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/' || echo 0)"
if [ -n "$COURANT" ] && [ "$COURANT" -ge "$VERSION_MINIMALE_MAJEURE" ] 2>/dev/null; then
  echo "Build avec $(node --version) (deja actif dans le PATH)"
  exec npm run build:next
fi

NODE_BIN=""
for c in "${CANDIDATS[@]}"; do
  if [ -x "$c/node" ]; then
    m="$(majeure_de "$c" || echo 0)"
    if [ -n "$m" ] && [ "$m" -ge "$VERSION_MINIMALE_MAJEURE" ] 2>/dev/null; then
      NODE_BIN="$c"
      break
    fi
  fi
done

if [ -n "$NODE_BIN" ]; then
  export PATH="$NODE_BIN:$PATH"
  echo "Build avec $("$NODE_BIN/node" --version) ($NODE_BIN)"
else
  # Aucun candidat : on n echoue pas ici. Si le node courant convient, le build
  # passe ; sinon Next affichera lui-meme un message explicite. Mieux vaut
  # laisser l outil se plaindre que masquer la cause derriere la notre.
  echo "AVERTISSEMENT : aucun Node >= ${VERSION_MINIMALE_MAJEURE} trouve parmi les chemins connus."
  echo "                build tente avec $(node --version 2>/dev/null || echo 'node introuvable')"
fi

exec npm run build:next
