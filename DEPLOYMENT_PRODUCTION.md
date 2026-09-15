# DEPLOYMENT_PRODUCTION.md -- Frontend (front_end_opcvm)

> Procedure de deploiement et maintenance en production pour le frontend Africafunds.
> Ce document est la reference unique pour toutes les operations de deploiement frontend.

---

## Informations generales

| Element | Valeur |
|---------|--------|
| Serveur | Ionos VPS, Ubuntu 22.04 |
| IP | 217.160.249.254 |
| Domaine | africafunds.chainsolutions.fr |
| Port frontend | 3000 |
| Processus PM2 | fundafrique-frontend |
| Reverse proxy | Nginx (tout sauf `/api/` -> port 3000) |
| Framework | Next.js 14.2.3 (App Router) |
| Node.js | 18.20.8 |
| TypeScript | Oui |
| CSS | Tailwind CSS |
| Graphiques | Highcharts (datetime axis) |
| Branche Git | `claude/code-review-improvements-ikvuj` |
| Chemin serveur | `/var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend` |
| API backend | http://localhost:3005 (PM2: api-monolith) |
| API URL publique | https://africafunds.chainsolutions.fr/api/ |

---

## 1. Checklist pre-deploiement

### 1.1 Verification locale (poste de developpement)

```bash
# Verifier l'etat Git
cd /home/user/front_end_opcvm
git status
git log --oneline -5

# Verifier que le build passe localement (0 erreur obligatoire)
npm run build

# Verifier les types TypeScript (inclus dans le build Next.js)
# Si le build reussit, les types sont valides
```

### 1.2 Verification de l'etat de production

```bash
# Verifier que le site est actuellement accessible
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/home
# Attendu : 200

# Verifier le statut PM2
pm2 status fundafrique-frontend

# Verifier les logs recents
pm2 logs fundafrique-frontend --lines 20 --nostream
```

### 1.3 Verification de compatibilite API

Avant de deployer le frontend, s'assurer que :
- L'API backend est operationnelle (`pm2 status api-monolith`)
- Les routes API consommees par les pages modifiees sont fonctionnelles
- Si des changements API sont necessaires, deployer l'API EN PREMIER

### 1.4 Points de vigilance

- Le `npm run build` Next.js DOIT produire 0 erreur (build statique + SSR)
- Le build genere toutes les pages statiques (verifier le nombre de pages generees)
- Ne JAMAIS deployer pendant les heures de fort trafic sans necessite
- Ne JAMAIS deployer un frontend qui depend de changements API non encore deployes
- Les graphiques Highcharts utilisent le type `datetime` (pas `category`) -- ne pas changer

---

## 2. Procedure de deploiement standard

### 2.1 Deploiement pas a pas

```bash
# Se placer dans le repertoire de production
cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend

# Sauvegarder les modifications locales eventuelles
git stash

# Recuperer les derniers changements
git pull --rebase origin claude/code-review-improvements-ikvuj

# Restaurer les modifications locales (ignorer si rien a restaurer)
git stash pop 2>/dev/null || true

# Construire l'application (etape critique -- doit produire 0 erreur)
npm run build

# Redemarrer le processus PM2
pm2 restart fundafrique-frontend

# Attendre le demarrage complet
sleep 10

# Verification rapide
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/home
# Attendu : 200
```

### 2.2 Commande en une ligne (deploiement rapide)

```bash
cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend && git stash && git pull --rebase origin claude/code-review-improvements-ikvuj && git stash pop 2>/dev/null || true && npm run build && pm2 restart fundafrique-frontend
```

### 2.3 Si le build echoue

```bash
# NE PAS redemarrer PM2 si le build echoue
# L'ancienne version compilee (.next/) est encore presente et fonctionnelle

# Lire les erreurs de build attentivement
npm run build 2>&1 | tail -50

# Causes frequentes :
# - Erreur TypeScript (type manquant, import incorrect)
# - Module introuvable (verifier package.json, faire npm install si necessaire)
# - Erreur d'import d'image ou de composant
# - Variable d'environnement manquante

# Si besoin, restaurer le code precedent
git checkout HEAD~1
npm run build
pm2 restart fundafrique-frontend
```

---

## 3. Verification post-deploiement

Apres chaque deploiement, verifier systematiquement les pages critiques.

### 3.1 Pages publiques principales

```bash
# Page d'accueil
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/home
# Attendu : 200

# Fiche fonds -- devise locale
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/funds/summary/866
# Attendu : 200

# Fiche fonds -- EUR
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/funds/summary-eur/866
# Attendu : 200

# Fiche fonds -- USD
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/funds/summary-usd/866
# Attendu : 200

# Comparaison de fonds
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/funds/compare
# Attendu : 200

# Fonds par societe de gestion
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/fund-managers/funds/1
# Attendu : 200
```

### 3.2 Panels utilisateur

```bash
# Panel admin
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/panel/admin
# Attendu : 200 ou 302 (redirection login)

# Panel investisseur
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/panel/investor
# Attendu : 200 ou 302

# Panel societe de gestion
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/panel/management
# Attendu : 200 ou 302

# Panel institutionnel
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/panel/institutional
# Attendu : 200 ou 302

# Panel data requester
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/panel/data-requester
# Attendu : 200 ou 302

# Panel distributeur
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/panel/distributor
# Attendu : 200 ou 302

# Country panel
curl -s -o /dev/null -w '%{http_code}' https://africafunds.chainsolutions.fr/country-panel
# Attendu : 200 ou 302
```

### 3.3 Verification visuelle (navigateur)

Ouvrir dans un navigateur et verifier visuellement :

1. **Page d'accueil** (`/home`) -- Affichage correct, liens fonctionnels
2. **Fiche fonds locale** (`/funds/summary/866`) -- Graphique Highcharts charge, VL affichees, performances visibles, ratios presents, classement visible
3. **Fiche fonds EUR** (`/funds/summary-eur/866`) -- Graphique base 100, performances EUR, classement EUR
4. **Fiche fonds USD** (`/funds/summary-usd/866`) -- Graphique base 100, performances USD, classement USD
5. **Comparaison** (`/funds/compare`) -- Selection de fonds, graphique de comparaison
6. **Un panel utilisateur** -- Connexion, sidebar, navigation interne

### 3.4 Points a verifier specifiquement

- Les graphiques Highcharts se chargent correctement (pas de zone vide)
- Les performances affichent des valeurs numeriques (pas "NaN" ou "null" ou "undefined")
- Les classements et quartiles s'affichent
- La navigation entre devise locale / EUR / USD fonctionne
- Les filtres et tris fonctionnent sur les pages de listing
- Aucune erreur JavaScript dans la console du navigateur (F12 > Console)

---

## 4. Procedure de rollback

### 4.1 Rollback rapide

```bash
cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend

# Identifier le commit precedent
git log --oneline -5

# Revenir au commit precedent
git checkout HEAD~1

# Reconstruire avec l'ancien code
npm run build

# Redemarrer
pm2 restart fundafrique-frontend
sleep 10

# Verifier
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/home
```

### 4.2 Rollback vers un commit specifique

```bash
cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend

# Identifier le commit cible
git log --oneline -20

# Revenir au commit cible
git checkout <commit_hash>

# Reconstruire
npm run build

# Redemarrer
pm2 restart fundafrique-frontend
```

### 4.3 En cas de crash total du frontend

```bash
# Verifier les logs PM2
pm2 logs fundafrique-frontend --lines 100 --nostream

# Si le processus ne demarre pas
pm2 delete fundafrique-frontend
pm2 start npm --name fundafrique-frontend -- start
pm2 save

# Verifier que le port 3000 est ecoute
ss -tlnp | grep 3000

# Verifier la config Nginx
nginx -t
grep -A5 "location /" /etc/nginx/sites-enabled/* | head -20

# Verifier Node.js
node --version
# Attendu : v18.20.8

# Verifier les dependances
npm ls --depth=0 2>&1 | grep "MISSING"
# Si des dependances manquent :
npm install
npm run build
pm2 restart fundafrique-frontend
```

---

## 5. Pages cles a verifier

### 5.1 Structure des pages

| Page | Route | Composant graphique | Description |
|------|-------|---------------------|-------------|
| Accueil | `/home` | -- | Page d'accueil publique |
| Fiche fonds (locale) | `/funds/summary/[fondId]` | FundView.tsx (Highcharts) | VL, performances, ratios, classement en devise locale |
| Fiche fonds (EUR) | `/funds/summary-eur/[fondId]` | FundSubView.tsx (Highcharts) | Base 100, performances EUR |
| Fiche fonds (USD) | `/funds/summary-usd/[fondId]` | FundSubView.tsx (Highcharts) | Base 100, performances USD |
| Comparaison | `/funds/compare` | -- | Comparaison multi-fonds |
| Societe de gestion | `/fund-managers/funds/[societe]` | -- | Liste fonds par societe |
| Panel admin | `/panel/admin` | -- | Administration plateforme |
| Panel investisseur | `/panel/investor` | -- | Portefeuille, watchlist |
| Panel societe gestion | `/panel/management` | -- | Gestion fonds, import VL |
| Panel institutionnel | `/panel/institutional` | -- | Vue institutionnelle |
| Panel data requester | `/panel/data-requester` | -- | Demandes de donnees |
| Panel distributeur | `/panel/distributor` | -- | Distribution fonds |
| Country panel | `/country-panel` | -- | Vue par pays |
| Pays | `/countries` | -- | Liste des pays |
| Actualites | `/news` | -- | Actualites du marche |
| Contact | `/contact` | -- | Page de contact |

### 5.2 Composants graphiques Highcharts

| Fichier | Utilisation | Type d'axe |
|---------|-------------|------------|
| `src/app/funds/summary/[fondId]/FundView.tsx` | Graphique devise locale | datetime |
| `src/app/funds/summary-eur/[fondId]/FundSubView.tsx` | Graphique EUR (base 100) | datetime |
| `src/app/funds/summary-usd/[fondId]/FundSubView.tsx` | Graphique USD (base 100) | datetime |

**Rappel** : les graphiques Highcharts utilisent obligatoirement un axe de type `datetime`, jamais `category`.

### 5.3 Endpoints API consommes par le frontend

| Endpoint API | Page(s) consommatrice(s) |
|-------------|--------------------------|
| `/api/valLiq/:id` | summary (devise locale) |
| `/api/valLiqdev/:id/:devise` | summary-eur, summary-usd |
| `/api/performanceswithdate/fond/:id/:date` | summary |
| `/api/performancesdev/fond/:id/:devise` | summary-eur, summary-usd |
| `/api/performancescategorie/fond/:id` | summary |
| `/api/performancesdevcategorie/fond/:id/:devise` | summary-eur, summary-usd |
| `/api/ratiosnew/:year/:id` | summary |
| `/api/ratiosnewdev/:year/:id/:devise` | summary-eur, summary-usd |
| `/api/classementquartile/fond/:id` | summary |
| `/api/classementquartiledev/fond/:id/:devise` | summary-eur, summary-usd |
| `/api/listeproduitsociete/:id` | fund-managers |
| `/api/getactualite` | home, news |

---

## 6. Problemes courants et depannage

### 6.1 Le build Next.js echoue

```bash
# Lire les erreurs de build
npm run build 2>&1 | tail -100

# Causes frequentes :
# 1. Erreur TypeScript
#    -> Corriger le type dans le fichier indique
#    -> Utiliser optional chaining (?.) pour les acces API nullable

# 2. Import manquant
#    -> Verifier que le composant ou module importe existe
#    -> npm install si un package est manquant

# 3. Erreur de page statique (getStaticProps/generateStaticParams)
#    -> Verifier que les donnees de l'API sont accessibles pendant le build

# 4. Memoire insuffisante pendant le build
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### 6.2 Le site charge mais les graphiques ne s'affichent pas

- Verifier que l'API backend est operationnelle (`curl http://localhost:3005/api/valLiq/1`)
- Verifier la console JavaScript du navigateur (F12)
- Verifier que Highcharts est correctement importe dans le composant
- Verifier que les donnees API renvoient bien des tableaux de VL

### 6.3 Les performances affichent "NaN" ou "null"

- L'API renvoie des valeurs null pour certains champs
- Verifier que le code utilise l'optional chaining (`performances?.data?.perf1An`)
- Verifier le null check avant `.toFixed(2)` : `value != null ? value.toFixed(2) : '-'`

### 6.4 Erreur 502 Bad Gateway

```bash
# Verifier que le processus PM2 tourne
pm2 status fundafrique-frontend

# Verifier que le port 3000 est ecoute
ss -tlnp | grep 3000

# Verifier Nginx
nginx -t
sudo systemctl reload nginx
```

### 6.5 Les pages de panel renvoient 404

- Verifier que la structure de dossiers `src/app/panel/` est correcte
- Verifier que chaque panel a un `page.tsx`
- Verifier les liens dans les sidebars correspondantes

### 6.6 Conflit Git au deploiement

```bash
cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend

# Voir l'etat
git status

# Si conflit apres stash pop
git checkout --theirs .
# OU
git checkout --ours .

# En dernier recours
git stash drop
git reset --hard origin/claude/code-review-improvements-ikvuj
npm run build
pm2 restart fundafrique-frontend
```

---

## 7. Structure des fichiers de configuration

| Fichier | Role |
|---------|------|
| `next.config.js` | Configuration Next.js (rewrites, redirects, images) |
| `tailwind.config.js` | Configuration Tailwind CSS |
| `tsconfig.json` | Configuration TypeScript |
| `package.json` | Dependances et scripts npm |
| `.env` ou `.env.local` | Variables d'environnement (URL API, etc.) -- NE PAS COMMITTER |
| `src/app/layout.tsx` | Layout principal de l'application |
| `src/app/globals.css` | Styles globaux |

---

## 8. Relation avec le deploiement backend

### 8.1 Ordre de deploiement

Si des changements impactent a la fois le frontend et le backend :

1. **Deployer le backend EN PREMIER** (api_opcv)
2. Verifier que les nouvelles routes API fonctionnent
3. **Deployer le frontend ENSUITE** (front_end_opcvm)
4. Verifier que le frontend consomme correctement les nouvelles routes

### 8.2 Si seul le frontend change

- Le deploiement frontend est independant tant que les routes API consommees n'ont pas change
- Toujours verifier que l'API est operationnelle avant de deployer le frontend

### 8.3 Si seul le backend change

- Le frontend existant continue de fonctionner avec le nouveau backend
- Verifier la retrocompatibilite des routes API modifiees
- Les anciennes routes doivent continuer a renvoyer le meme format de donnees

---

## 9. Commandes PM2 utiles

```bash
# Statut du processus frontend
pm2 status fundafrique-frontend

# Redemarrer le frontend
pm2 restart fundafrique-frontend

# Recharger sans downtime (graceful reload)
pm2 reload fundafrique-frontend

# Arreter le frontend
pm2 stop fundafrique-frontend

# Demarrer (si arrete)
pm2 start fundafrique-frontend

# Logs en temps reel
pm2 logs fundafrique-frontend

# Derniers logs (N lignes)
pm2 logs fundafrique-frontend --lines 50 --nostream

# Monitoring CPU/RAM en temps reel
pm2 monit

# Voir la configuration complete du processus
pm2 show fundafrique-frontend

# Lister tous les processus (frontend + API)
pm2 list

# Sauvegarder la liste PM2 (persistence apres reboot serveur)
pm2 save

# Flush des logs (si les fichiers de log deviennent trop volumineux)
pm2 flush fundafrique-frontend

# Recreer le processus si la config PM2 est corrompue
pm2 delete fundafrique-frontend
pm2 start npm --name fundafrique-frontend -- start
pm2 save
```

---

## 10. Contacts et references

- Fichier de suivi operationnel : `SUIVI.md` (ce depot)
- Regles permanentes frontend : `CLAUDE.md` (ce depot)
- Regles permanentes backend : `../api_opcv/CLAUDE.md`
- Deploiement backend : `../api_opcv/DEPLOYMENT_PRODUCTION.md`
- Snapshot production : `../api_opcv/PRODUCTION_STATE.json` (genere automatiquement)

---

*Derniere mise a jour : 2026-06-18*
