#!/bin/bash
#
# Demarre le frontend avec un Node.js compatible avec Next 14 (>= 18.17).
#
# POURQUOI CE SCRIPT
# ------------------
# Incident du 2026-08-16 : apres un build reussi sous Node 18.20.8, le site est
# tombe en 503 et PM2 a boucle en `errored`. Les logs donnaient la cause :
#
#     You are using Node.js 14.16.0. For Next.js, Node.js version >= v18.17.0 is required.
#
# PM2 avait pourtant l interpreteur nvm 18.20.8 enregistre pour ce process. Mais
# le script de deploiement lance `pm2 restart fundafrique-frontend --update-env`,
# et `--update-env` remplace l environnement enregistre par celui du shell
# courant — dont le PATH expose /usr/local/bin/node en 14.16.0.
#
# Le demarrage doit donc etre ancre comme le build, sans dependre du PATH
# herite. C est le pendant de scripts/build.sh : meme logique de selection,
# meme version pour construire et pour executer.

set -euo pipefail

cd "$(dirname "$0")/.."
# shellcheck source=./_pick-node.sh
source ./scripts/_pick-node.sh

exec npm run start:next
