#!/bin/bash
#
# Selectionne un Node.js >= 18.17 et l ajoute en tete du PATH, pour la duree du
# processus appelant uniquement.
#
# Partage par scripts/build.sh et scripts/start.sh : construire et executer
# doivent utiliser la meme version, et la logique de choix ne doit exister
# qu a un seul endroit.
#
# Ne modifie ni PATH global, ni configuration systeme, ni PM2.
# S utilise par `source`, jamais en execution directe.

VERSION_MINIMALE_MAJEURE=18

# Ordre de preference. Le premier est l interpreteur enregistre par PM2 pour
# ce projet (~/.pm2/dump.pm2) : s aligner dessus garantit que le bundle produit
# et le processus qui le sert partagent la meme version.
_CANDIDATS=(
  "/root/.nvm/versions/node/v18.20.8/bin"
  "/opt/plesk/node/20/bin"
  "/opt/plesk/node/18/bin"
  "/root/.nvm/versions/node/v20.20.2/bin"
)

_majeure() { "$1" --version 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/'; }

# Si le node deja actif convient, ne rien changer : c est le cas en local et en
# CI, ou imposer un chemin serveur serait absurde.
_courant="$(_majeure node || echo 0)"
if [ -n "$_courant" ] && [ "$_courant" -ge "$VERSION_MINIMALE_MAJEURE" ] 2>/dev/null; then
  echo "Node $(node --version) (deja actif dans le PATH)"
  return 0 2>/dev/null || exit 0
fi

for _c in "${_CANDIDATS[@]}"; do
  if [ -x "$_c/node" ]; then
    _m="$(_majeure "$_c/node" || echo 0)"
    if [ -n "$_m" ] && [ "$_m" -ge "$VERSION_MINIMALE_MAJEURE" ] 2>/dev/null; then
      export PATH="$_c:$PATH"
      echo "Node $("$_c/node" --version) ($_c)"
      return 0 2>/dev/null || exit 0
    fi
  fi
done

# Aucun candidat : ne pas echouer ici. Si le node courant convient malgre tout,
# la commande passera ; sinon Next affichera lui-meme un message explicite.
# Mieux vaut laisser l outil se plaindre que masquer la cause derriere la notre.
echo "AVERTISSEMENT : aucun Node >= ${VERSION_MINIMALE_MAJEURE} trouve parmi les chemins connus."
echo "                poursuite avec $(node --version 2>/dev/null || echo 'node introuvable')"
