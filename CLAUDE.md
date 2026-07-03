# CLAUDE.md — Regles permanentes du projet OPCVM FundAfrica / Africafunds

> Ce fichier est lu automatiquement par Claude Code a chaque reprise de session.
> Il garantit la continuite, la coherence et la qualite de toutes les interventions.

## Premiere action obligatoire

A chaque reprise de session ou nouvelle tache, Claude doit imperativement :
1. Relire `CLAUDE.md` des deux depots (api_opcv et front_end_opcvm)
2. Relire `SUIVI.md` (dans ce depot) pour connaitre l'etat courant des taches
3. Ne commencer aucune modification avant d'avoir fait ces deux lectures

## Depot

- **Depot** : `front_end_opcvm` (Frontend)
- **Technologie** : Next.js 14.2.3 (App Router), TypeScript, Tailwind CSS, Highcharts
- **Production** : `africafunds.chainsolutions.fr` (PM2: fundafrique-frontend, port 3000)
- **Depot backend associe** : `api_opcv` (Express.js + Sequelize + MySQL)
- **API production** : `africafunds.chainsolutions.fr/api` (port 3005, Nginx reverse proxy)
- **Fichier de suivi** : `SUIVI.md` (dans CE depot, fichier unique de suivi operationnel)

## Role permanent

Sur ce projet, Claude doit toujours travailler comme :

1. **Expert financier specialise en OPCVM** : gestion d'actifs, distribution de fonds, categories, classifications reglementaires, benchmarks, devises, conversions, VL, performances, risques, ratios, comparaisons et classements ;
2. **Expert developpeur full-stack senior** : capable d'intervenir proprement sur le front-end, le back-end, les API, la base de donnees, les scripts, les workers, les imports, les logs, les controles qualite, les metriques financieres et l'architecture de production.

Aucune demande ne doit etre traitee comme une simple tache technique isolee. Toute intervention doit etre comprise dans le contexte global de la plateforme OPCVM.

## Regle absolue : zero regression

Ne jamais faire regresser l'application.

Preserver :
- les fonctionnalites existantes
- les routes API existantes
- les donnees existantes
- la base de donnees
- les pages fonds (summary local, summary-eur, summary-usd, comparaisons)
- les panels utilisateurs (admin, investisseur, societe gestion, institutionnel, data requester, country panel, distributeur)
- les calculs valides
- les filtres, tris, comparaisons
- les graphiques (devise locale, EUR, USD) — Highcharts datetime axis
- les imports et scripts
- les comportements deja fonctionnels

Toute evolution doit etre additive, progressive, non destructive, documentee, testable et compatible avec l'existant.

## Fichier de suivi officiel

Le fichier de suivi operationnel officiel est : **SUIVI.md** (dans ce depot).

Regles obligatoires :
- Lire SUIVI.md avant toute intervention importante
- Mettre a jour SUIVI.md apres chaque intervention
- Ne pas creer SUIVI_PROJET.md ni aucun fichier de suivi parallele
- Centraliser le suivi operationnel courant dans SUIVI.md

## Avant toute modification

Claude doit :
1. Analyser l'etat actuel du code
2. Comprendre l'architecture existante
3. Identifier les fichiers concernes
4. Verifier les routes API concernees (backend)
5. Verifier les modeles de donnees
6. Verifier les impacts base de donnees
7. Verifier les impacts front-end (pages, composants, layouts)
8. Verifier les impacts back-end
9. Verifier les types TypeScript
10. Verifier les calculs financiers et leur affichage
11. Verifier les categories, benchmarks, devises, conversions, performances et risques
12. Identifier les risques de regression
13. Choisir la solution la plus sure et la moins destructive
14. **Tester en production** : verifier les pages de production directement, ne pas travailler a l'aveugle

## Regles metier OPCVM

Toujours respecter :
- Classification regulateur (AMMC, SEC Nigeria, CMF Tunisie, CREPMF UEMOA, COSUMAF CEMAC)
- Categorie nationale, regionale, sous-regionale, Afrique, globale
- Categorie interne FundAfrica
- Devise locale, EUR, USD
- Benchmark declare et historique benchmark
- VL, VL ajuste (Total Return NAV), encours
- Performances (YTD, 1M, 3M, 6M, 1A, 3A, 5A, depuis creation)
- Risques et ratios (Sharpe, Sortino, Calmar, VAR, tracking error, volatilite)
- Comparaisons et classements (local, EUR, USD)

Ne jamais inventer : benchmark, donnee financiere, taux de change, performance, categorie, historique.

Ne jamais melanger devise locale, EUR et USD sans logique explicite de conversion :
- Base 100 = comparaison fonds et benchmark dans la MEME devise
- Affichage des performances : toujours indiquer la devise
- Graphique Highcharts : type datetime, pas category

## Architecture technique Frontend

### Structure des pages cles
```
src/app/
  home/page.tsx                        — Page d'accueil
  funds/
    summary/[fondId]/page.tsx          — Fiche fonds devise locale
    summary-eur/[fondId]/page.tsx      — Fiche fonds EUR
    summary-usd/[fondId]/page.tsx      — Fiche fonds USD
    compare/page.tsx                   — Comparaison fonds
  fund-managers/
    funds/[societe]/page.tsx           — Fonds par societe de gestion
  country-panel/                       — Panel pays
  panel/
    admin/                             — Panel admin
    investor/                          — Panel investisseur
    management/                        — Panel societe de gestion
    institutional/                     — Panel institutionnel
    data-requester/                    — Panel data requester
    distributor/                       — Panel distributeur
```

### Composants graphiques
```
src/app/funds/summary/[fondId]/FundView.tsx          — Graphique devise locale (Highcharts)
src/app/funds/summary-eur/[fondId]/FundSubView.tsx   — Graphique EUR (Highcharts)
src/app/funds/summary-usd/[fondId]/FundSubView.tsx   — Graphique USD (Highcharts)
```

### API endpoints consommes
```
/api/valLiq/:id                         — VL + graphique devise locale
/api/valLiqdev/:id/:devise              — VL + graphique EUR ou USD (base 100)
/api/performanceswithdate/fond/:id/:date — Performances a une date
/api/performancesdev/fond/:id/:devise    — Performances EUR/USD
/api/ratiosnew/:year/:id                — Ratios devise locale
/api/ratiosnewdev/:year/:id/:devise     — Ratios EUR/USD
/api/classementquartile/fond/:id        — Classement + quartile local
/api/classementquartiledev/fond/:id/:devise — Classement EUR/USD
/api/listeproduitsociete/:id            — Fonds par societe
```

### Panels utilisateur
| Panel | typeusers_id | Route | Sidebar |
|-------|-------------|-------|---------|
| Admin | 0 | /panel/admin | AdminSidebar.tsx |
| Investisseur | 1 | /panel/investor | InvestorSidebar.tsx |
| Societe gestion | 2 | /panel/management | Sidebar.tsx |
| Institutionnel | 3 | /panel/institutional | InstitutionalSidebar.tsx |
| Data requester | 4 | /panel/data-requester | DataRequesterSidebar.tsx |
| Country panel | 5 | /country-panel | - |
| Distributeur | 6 | /panel/distributor | DistributorSidebar.tsx |

## Securite

- Ne jamais exposer de cle API, mot de passe ou secret dans un commit
- Ne jamais ajouter de fichier sensible (.env, credentials) au git
- Ne jamais inclure de donnees utilisateur dans le code source
- Proteger contre XSS (sanitiser les inputs utilisateur)
- Utiliser optional chaining (?.) pour tout acces a des donnees API

## Production

- Build : `npm run build` (doit produire 0 erreur)
- Commande de deploiement standard :
  ```bash
  cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend && git stash && git pull --rebase origin claude/code-review-improvements-ikvuj && git stash pop && npm run build && pm2 restart fundafrique-frontend
  ```
- Toujours verifier le build avant de pousser
- Toujours tester les pages de production apres deploiement

## Documentation obligatoire

Apres chaque intervention, documenter dans SUIVI.md :
- Taches realisees
- Fichiers modifies
- Routes API impactees
- Pages impactees
- Changements de composants
- Erreurs detectees et corrigees
- Verifications effectuees en production
- Build status
- Risques de regression
- Prochaines etapes

## Gouvernance documentaire

1. **SUIVI.md** est le fichier operationnel principal. Le lire avant chaque intervention, le mettre a jour apres chaque intervention significative.
2. Les autres fichiers documentaires ne doivent pas etre mis a jour mecaniquement.
3. **CLAUDE.md** : ne mettre a jour que si les regles permanentes changent.
4. **README_DEV.md** : ne mettre a jour que si l'architecture, les commandes, les environnements, les tests, les procedures de deploiement ou les informations developpeur durables changent.
5. **ROADMAP.md** : ne mettre a jour que si une decision produit ou technique moyen/long terme est ajoutee ou modifiee.
6. **CODE_REVIEW.md** : ne mettre a jour que si une revue de code, un audit, une dette technique, un risque ou une recommandation structurelle est identifie.
7. **CHANGELOG.md** : ne mettre a jour que si une modification significative est livree ou deployee.
8. Ne pas disperser la meme information dans plusieurs fichiers.
9. Toute mise a jour d'un fichier documentaire complementaire doit etre mentionnee brievement dans SUIVI.md.

## Regle obligatoire — Lecture du snapshot production avant toute action

Le fichier `api_opcv/PRODUCTION_STATE.json` est genere automatiquement par `sync_production.sh` (cron horaire).
Il contient l'etat reel de la production : tables, counts, derniere VL, dernier classement, git log, PM2 status.

A chaque reprise de session ou nouvelle tache, Claude doit :
1. Verifier que `PRODUCTION_STATE.json` existe et sa date de derniere modification
2. Considerer ce fichier comme la source de verite sur l'etat de production
3. Ne jamais supposer un etat de production sans l'avoir verifie (via ce fichier ou via curl API)
4. En cas de doute, interroger directement l'API de production (`curl https://africafunds.chainsolutions.fr/api/...`)

Ce fichier NE DOIT PAS etre modifie manuellement. Il est genere automatiquement.

## Protocole anti-compactage, anti-limite et anti-taches inachevees

### 1. Principe general

La conversation Claude ne doit jamais etre consideree comme la memoire principale du projet.

La memoire principale du projet est portee par :
- les deux CLAUDE.md (api_opcv et front_end_opcvm) ;
- SUIVI.md ;
- les fichiers documentaires utiles lorsqu'ils existent.

A chaque reprise de session, nouvelle tache, compactage ou interruption, Claude doit relire :
- api_opcv/CLAUDE.md ;
- front_end_opcvm/CLAUDE.md ;
- SUIVI.md.

Aucune modification ne doit commencer avant ces lectures.

### 2. Travail obligatoire en lots courts

Claude ne doit jamais lancer une tache longue, large ou risquee en un seul bloc.

Toute tache complexe doit etre decoupee en lots courts, coherents et terminables.

Chaque lot doit avoir :
- un objectif unique ;
- un perimetre clair ;
- des fichiers concernes identifies ;
- un risque de regression evalue ;
- un resultat verifiable ;
- une mise a jour de SUIVI.md a la fin.

Claude ne doit pas traiter plusieurs chantiers en meme temps si cela augmente le risque d'interruption ou de regression.

Exemples de lots corrects :
- Lot 1 : diagnostic uniquement ;
- Lot 2 : correction ciblee d'un fichier ;
- Lot 3 : test de la correction ;
- Lot 4 : documentation dans SUIVI.md ;
- Lot 5 : commit/push si l'etat est stable.

Exemples de lots interdits :
- corriger le front-end, le back-end, la base de donnees, les scripts, les calculs et le deploiement en une seule action ;
- modifier plusieurs modules sans diagnostic prealable ;
- commencer une migration sans point de reprise ;
- lancer une correction longue alors que la limite d'utilisation approche.

### 3. Point de reprise obligatoire

Claude doit maintenir dans SUIVI.md une section permanente intitulee :

**## POINT DE REPRISE COURANT**

Cette section doit etre creee si elle n'existe pas.

Elle doit etre mise a jour :
- apres chaque lot significatif ;
- avant toute interruption probable ;
- avant toute pause ;
- avant tout compactage pressenti ;
- avant d'atteindre une limite d'utilisation ;
- apres une erreur bloquante ;
- apres un etat stable important ;
- avant de passer a une nouvelle tache risquee.

La section POINT DE REPRISE COURANT doit contenir au minimum :
- **Dernier etat stable** : decrire le dernier etat connu stable du projet.
- **Dernier lot termine** : decrire precisement le dernier lot termine.
- **Fichiers modifies dans le dernier lot** : lister les fichiers modifies.
- **Commandes executees** : lister les commandes reellement executees.
- **Tests realises** : indiquer les tests ou verifications realises.
- **Resultat des tests** : indiquer clairement si OK, partiels, echoues ou non executes.
- **Erreurs restantes** : lister les erreurs restantes, si elles existent.
- **Tache en cours** : indiquer la tache en cours au moment de la mise a jour.
- **Prochaine action recommandee** : indiquer l'action suivante la plus sure.
- **Risques connus** : lister les risques de regression, conflits Git, production, base de donnees, API, front-end ou donnees financieres.
- **A ne pas faire a la reprise** : lister les actions a eviter si elles sont dangereuses ou prematurees.

### 4. Regle avant interruption, compactage ou limite

Si Claude detecte que :
- la limite d'utilisation approche ;
- la conversation devient trop longue ;
- un compactage est probable ;
- la session risque d'etre interrompue ;
- une tache ne pourra pas etre terminee proprement ;

alors Claude doit arreter de commencer de nouvelles modifications.

Il doit immediatement :
1. stabiliser ce qui peut l'etre ;
2. ne pas entamer de nouveau chantier ;
3. mettre a jour SUIVI.md ;
4. renseigner POINT DE REPRISE COURANT ;
5. indiquer clairement a l'utilisateur ce qui est termine, ce qui ne l'est pas, et quelle est la prochaine action sure.

Claude ne doit jamais laisser une tache critique dans un etat ambigu sans point de reprise documente dans SUIVI.md.

### 5. Reduction de la consommation de tokens

Claude doit eviter les reponses inutilement longues dans le chat lorsque l'information peut etre documentee dans SUIVI.md.

Dans le chat, Claude doit privilegier les bilans operationnels courts contenant :
- ce qui a ete fait ;
- les fichiers modifies ;
- les commandes executees ;
- les tests realises ;
- le resultat ;
- les erreurs restantes ;
- la prochaine etape ;
- la confirmation de mise a jour de SUIVI.md.

Claude ne doit pas recopier de longs fichiers dans le chat sauf demande explicite.

Claude ne doit pas repeter tout le contexte permanent deja present dans CLAUDE.md.

Claude doit ecrire les details durables dans SUIVI.md ou dans le fichier documentaire approprie, plutot que de surcharger la conversation.

### 6. Regle de non-dispersion documentaire

SUIVI.md reste le fichier operationnel principal.

Claude ne doit pas creer de fichier SUIVI_PROJET.md.

Claude ne doit pas disperser les memes informations dans plusieurs fichiers.

Les autres fichiers documentaires ne doivent etre mis a jour que s'ils sont reellement concernes :
- CLAUDE.md : uniquement si les regles permanentes changent ;
- README_DEV.md : si une information durable d'architecture, de commande, d'environnement, de test ou de deploiement change ;
- ROADMAP.md : si une decision produit ou technique moyen/long terme change ;
- CODE_REVIEW.md : si un audit, une dette technique, un risque ou une recommandation structurelle est identifie ;
- CHANGELOG.md : si une modification significative est livree ou deployee.

Toute mise a jour d'un fichier documentaire complementaire doit etre mentionnee brievement dans SUIVI.md.

### 7. Regle Git et etat stable

Avant toute modification de code, Claude doit verifier l'etat Git des deux depots.

Claude doit tenir compte de sync_production.sh et des eventuels commits automatiques pour eviter les conflits, divergences ou ecrasements.

Apres un lot coherent et stable, Claude doit proposer ou realiser un commit/push lorsque c'est pertinent et autorise.

Claude ne doit pas empiler de nombreuses modifications non commitees sur plusieurs lots sans justification.

A la fin de chaque lot, Claude doit indiquer :
- l'etat Git ;
- les fichiers modifies ;
- si le working tree est clean ou non ;
- le dernier commit si un commit a ete effectue.

### 8. Regle de securite pour les taches sensibles

Pour les taches sensibles, Claude doit obligatoirement commencer par un diagnostic et ne pas modifier immediatement.

Sont considerees comme sensibles :
- base de donnees ;
- migrations ;
- production ;
- conversions devise locale / EUR / USD ;
- benchmarks ;
- categories OPCVM ;
- calculs de performance ;
- calculs de risque ;
- routes API utilisees en production ;
- scripts cron ;
- scripts d'import ;
- authentification ;
- variables d'environnement ;
- secrets ;
- deploiement ;
- workers ;
- PM2 ;
- tout fichier ou processus pouvant casser l'application.

Pour ces taches, Claude doit travailler en deux temps :
1. diagnostic et plan court ;
2. modification ciblee uniquement apres comprehension de l'impact.

### 9. Regle de fin de lot

A la fin de chaque lot, Claude doit fournir un bilan court :

- Lot traite :
- Objectif du lot :
- Fichiers modifies :
- Commandes executees :
- Tests realises :
- Resultat :
- SUIVI.md mis a jour : oui / non
- POINT DE REPRISE COURANT mis a jour : oui / non
- Etat Git :
- Prochaine etape recommandee :

### 10. Regle de reprise

A chaque reprise de session ou nouvelle tache, Claude doit :
1. relire les deux CLAUDE.md ;
2. relire SUIVI.md ;
3. lire POINT DE REPRISE COURANT ;
4. verifier l'etat Git ;
5. identifier le dernier etat stable ;
6. reprendre uniquement a partir de la prochaine action recommandee ;
7. ne pas supposer que la memoire de conversation est complete.

---

## Mémoire MCP persistante

Avant toute intervention, Claude doit lire et respecter :

- MCP_AUTONOMY.md

Ce fichier contient les règles d'autonomie MCP, les limites projet, les règles Git, les règles de déploiement et les obligations de documentation.
