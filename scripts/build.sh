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
#   - PM2 lance le frontend avec /root/.nvm/versions/node/v18.20.8/bin/node
#     (verifie dans ~/.pm2/dump.pm2 et confirme par /proc/<pid>/exe).
#
# Construire avec une version differente de celle qui execute est de toute
# facon une mauvaise pratique : ce script aligne les deux. Son pendant au
# demarrage est scripts/start.sh.
#
# Il ne modifie ni PATH global, ni configuration systeme, ni PM2.

set -euo pipefail

cd "$(dirname "$0")/.."
# shellcheck source=./_pick-node.sh
source ./scripts/_pick-node.sh

exec npm run build:next
