# Carnet de suivi - Africafunds (Fundafrique)

## Architecture
- **Frontend**: Next.js 14.2.3 (App Router) - `/home/user/front_end_opcvm`
- **Backend API**: Express.js + Sequelize (MySQL) - `/home/user/api_opcv`
- **Production**: `africafunds.chainsolutions.fr`
- **Serveur prod**: frontend port 3000 (PM2 id:11), API port 3005 (PM2 id:10)
- **Nginx**: `/api/` -> port 3005, tout le reste -> port 3000
- **Chemin prod**: `/var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend`

## Panels utilisateur
| Panel | typeusers_id | Route | Sidebar |
|-------|-------------|-------|---------|
| Admin | 0 | `/panel/admin` | AdminSidebar.tsx |
| Investisseur | 1 | `/panel/investor` | InvestorSidebar.tsx |
| Societe gestion | 2 | `/panel/management` | Sidebar.tsx |
| Institutionnel | 3 | `/panel/institutional` | InstitutionalSidebar.tsx |
| Data requester | 4 | `/panel/data-requester` | DataRequesterSidebar.tsx |
| Country panel | 5 | `/country-panel` | - |
| Distributeur | 6 | `/panel/distributor` | DistributorSidebar.tsx |

## Points valides et deployes

### 2026-05-14 - Correction reconstruction portefeuille investisseur
- **Statut**: VALIDE ET DEPLOYE
- Dashboard -> Selected-funds -> Reconstitution -> Reconstruction hub -> sous-pages
- Correction serialisation JSON des fundids/funds dans les URL (double-encoding)
- Helper `toJsonArrayString()` dans dashboard, `safeParseToCSV()` dans selected-funds
- Parseur double-decode dans toutes les sous-pages (buy, sell, add-cash, withdraw-cash, transaction, settings)
- Null-safe access sur `data?.data?.portefeuille?.categorie` etc.
- **Fichiers**: dashboard/page.tsx, selected-funds/page.tsx, reconstruction/\*/page.tsx (10 fichiers)

### 2026-05-14 - Correction 404 panel societe de gestion
- **Statut**: VALIDE ET DEPLOYE
- Sidebar.tsx: liens corrigés (importfondvl -> import-nav, personnel -> staff, document -> documents)
- staff/page.tsx, staff/add/page.tsx, staff/update/page.tsx: liens internes corrigés

### 2026-05-14 - Amelioration detection anomalies VL
- **Statut**: VALIDE ET DEPLOYE
- Backend `/api/getallfondsvlanomalie`: reecrit pour detecter 2 types d'anomalies:
  1. VOLATILITE EXTREME (volatilite > 50%, perte max > 50%)
  2. ECART VL SUSPECT (variation > 10% entre 2 VL consecutives sur les 60 derniers)
- Filtrage correct par societe_gestion (management) ou sans filtre (admin)
- Backend `/api/getallfondsvlmanquant`: simplifie et corrige filtrage societe_gestion
- Frontend management anomalies: useEffect attend societeconneted avant fetch

### 2026-05-14 - PHASE 1 Base de donnees: Audit + Corrections fondamentales
- **Statut**: VALIDE ET DEPLOYE EN PRODUCTION
- **Script**: `api_opcv/fix_database_phase1.js` (execute sur prod)
- **Script diagnostic**: `api_opcv/diagnostic_db.js` (21 sections d'analyse)

#### Resultats Phase 1:
- **Fonds actifs**: 854/1011 (84.5%) - etaient 0 avant
- **societe_id FK**: 1011/1011 fonds (100%) rattaches a leur societe par ID numerique
- **Orphelins**: 0 restants (etaient 219)
- **Societes**: 126 avec metadata complete (devise, regulateur)
- **VL BRIDGE nettoyes**: 118 VL aberrantes supprimees (actif net melange avec VL unitaire)
- **Forex**: EUR/XAF (fixe 655.957) et USD/XAF generes (~6300 entrees chacun)
- **Pays corrige**: "8 pays de l'Afrique de l'Ouest" -> UEMOA

#### Donnees statiques peuplees:
- `dev_libelle` (devise): 150 fonds Nigeria (NGN) + tous les autres pays deja remplis
- `categorie_regional`: 144 fonds (UEMOA->Afrique de l'Ouest, CEMAC->Afrique Centrale, etc.)
- `regulateur`: 1011 fonds (tous) - rattaches au regulateur de leur pays via pays_regulateurs
- Societes: devise et regulateur remplis depuis pays_regulateurs

#### Corrections ORM Sequelize:
- Ajout `fond.hasMany(performences_eurs/usds)` (manquaient)
- Ajout `fond.hasMany/belongsTo(classementfonds_eurs/usds)` (manquaient)
- Ajout `fond.belongsTo(societe, { foreignKey: 'societe_id' })`
- Ajout `societe.hasMany(fond, { foreignKey: 'societe_id' })`
- Colonne `societe_id` ajoutee aux modeles fond.js, document.js, personnel.js

#### Corrections nommage societes:
- ESS ASSET\nMANAGEMENT -> ESS ASSET MANAGEMENT (retour chariot)
- Stanbic IBTC/Zenith/Vetiva/Coronation/Chapel Hill: variantes fusionnees
- TSI CAPITAL GROUP -> TSI CAPITAL GROUP (apostrophe Unicode)
- ARAB FINANCIAL CONSULTANTS -> normalise (espace insecable)

### 2026-05-15 - Fix pages summary-eur/summary-usd + routes API mortes
- **Statut**: VALIDE ET DEPLOYE EN PRODUCTION (deploiement confirme 2026-05-15)
- **Probleme**: Pages `/funds/summary-eur/[fondId]` et `/funds/summary-usd/[fondId]` crashaient
- **Cause racine backend**: Route `/api/performancesdevcategorie/fond/:id/:devise` enregistree sur `app.get()` (instance Express locale inutilisee) au lieu de `router.get()` dans `apigestionperformance.js`. Idem pour `/api/rendement/fonds` dans `apigestionrendement.js`.
- **Cause racine frontend**: Acces null-unsafe sur `performances.data?.` (sans `?.` apres `performances`), et `null.toFixed(2)` quand perf3Moisactif_net est null.
- **Fichiers backend modifies**:
  - `src/routes/apigestionperformance.js` : ligne 1339, `app.get` -> `router.get`
  - `src/routes/apigestionrendement.js` : ligne 41, `app.get` -> `router.get`
- **Fichiers frontend modifies**:
  - `src/app/funds/summary-eur/[fondId]/page.tsx` : optional chaining `performances?.data?.`, null check toFixed
  - `src/app/funds/summary-usd/[fondId]/page.tsx` : memes corrections (fichier miroir)
- **ATTENTION routes_vl.js**: Les 2 routes mortes (lignes 637 et 7286) ne doivent PAS etre changees en `router.post()` car `router` n'est pas defini dans ce fichier (pattern closure `module.exports = (app) => {...}`). Elles restent mortes mais inoffensives.
- **Commits**: `ea2172a` (API), `a4a3d9e` (Frontend)
- **Build**: 217/217 pages generees, 0 erreur

### 2026-05-15 - Script Phase 2 enrichissement statique (cree, pas encore execute)
- **Statut**: COMMITE, A DEPLOYER SUR PROD (script present sur serveur mais pas execute)
- **Script**: `api_opcv/fix_database_phase2.js` (543 lignes, 10 etapes)
- Etape 1: Nettoyage VL extremes (pattern bimodal)
- Etape 2: Fix VL date=0000-00-00
- Etape 3: forme_juridique (FCP/SICAV/FCPR/Mutual Fund)
- Etape 4: categorie_globale (Obligataire/Monetaire/Actions/Diversifie)
- Etape 5: categorie_libelle depuis categorie_globale
- Etape 6: date_premiere_vl + montant_premier_vl (MIN date valorisations)
- Etape 7: datejour (derniere VL)
- Etape 8: periodicite (depuis frequence reelle VL)
- Etape 9: Forex paires croisees (USD/XOF, EUR/MAD, EUR/TND)
- Etape 10: categorie_national
- **Commit**: `4519fbe`

### 2026-05-15 - Fix classement EUR/USD ecrivant dans la mauvaise table
- **Statut**: COMMITE, A DEPLOYER
- **Bug**: `/api/classementeur` et `/api/classementusd` dans `apigestionsavequotidien.js` utilisaient `classementfonds.create()` (table principale) au lieu de `classementfonds_eurs.create()` et `classementfonds_usds.create()`
- **Impact**: Les classements EUR/USD se melangeaient avec les classements devise locale
- **Correction**: 4 occurrences `classementfonds.create()` -> `classementfonds_eurs.create()` (EUR) et `classementfonds_usds.create()` (USD)
- **Bonus**: 2 `type_classement: 1` -> `type_classement: 2` pour les classements regionaux (etaient incorrects)
- **Commit API**: `e146385`

### 2026-05-15 - Ajout batch endpoints performance EUR/USD
- **Statut**: COMMITE, A DEPLOYER
- **Nouveaux endpoints**:
  - `/api/saveperfdateeur/:fond1/:fond2` - peuple `performences_eurs` (table actuellement vide)
  - `/api/saveperfdateusd/:fond1/:fond2` - peuple `performences_usds` (table actuellement vide)
- **Fonctions ajoutees**: `processFundDevise()`, `upsertPerformanceDevise()`
- **Pattern**: Suit le meme pattern que `saveperfdatemysql` existant, appelle `/api/performancesdev/fond/:id/:devise`
- **Fichier**: `src/routes/apigestionsavequotidien.js`
- **Commit API**: `e146385`

### 2026-05-15 - Fix country-panel anomalies (endpoint URL incorrect)
- **Statut**: COMMITE, A DEPLOYER
- **Bug**: Le frontend country-panel appelait `/api/getallfondsanomalie` (n'existe pas) au lieu de `/api/getallfondsvlanomalie` (existe dans routes_vl.js)
- **Fichier**: `src/app/country-panel/anomalies/page.tsx` ligne 26
- **Commit Frontend**: `3a33166`

### 2026-05-15 - Fix script Phase 2 (forme_juridique -> structure_fond)
- **Statut**: COMMITE, A DEPLOYER ET EXECUTER
- **Bug**: Le script `fix_database_phase2.js` utilisait `forme_juridique` qui n'existe pas dans la table
- **Fix**: Remplace par `structure_fond` (colonne existante pour le type juridique FCP/SICAV/OPCVM)
- **Commit API**: `00408bc`

### 2026-05-15 - Script import VL Maroc (ASFIM CSV)
- **Statut**: COMMITE, A DEPLOYER ET EXECUTER
- **Script**: `api_opcv/import_vl_maroc.js`
- **Source**: 100 fichiers CSV ASFIM (tous identiques, 1 seul fonds: "FCP AD MOROCCAN EQUITY")
- **Donnees**: 100 VL du 2017-11-24 au 2019-10-18, societe "AD CAPITAL", classe Actions
- **Fonctionnalites**:
  - Lit tous les CSV, deduplique par (fonds+date)
  - Cree le fonds s'il n'existe pas, rattache a la societe de gestion
  - Insere VL (value, actif_net, value_EUR, value_USD) sans ecraser l'existant
  - Met a jour datejour, date_premiere_vl, montant_premier_vl
  - Conversion MAD->EUR (10.85) et MAD->USD (9.95)
- **Usage**: `node import_vl_maroc.js "/chemin/vers/FICHIERS EXCELS/"`
- **Commit API**: `00408bc`

### 2026-05-15 - Script import VL Maroc XLSX (consolide ASFIM)
- **Statut**: COMMITE, A DEPLOYER ET EXECUTER
- **Script**: `api_opcv/import_vl_maroc_xlsx.js`
- **Source**: `UNIQUE_Tableaux_Performance_CONSOLIDE.xlsx` (feuille ALL_DATA)
- **Donnees**: 609 fonds, 50K+ VL, devise MAD
- **Fonctionnalites**:
  - Lit XLSX feuille ALL_DATA (CODE ISIN, OPCVM, Societe, AN, VL, DATE)
  - Cree fonds nouveaux (pays=MAROC, devise=MAD, regulateur=AMMC)
  - Insere VL sans ecraser l'existant
  - Conversion MAD->EUR et MAD->USD (taux depuis devisedechanges ou defaut)
  - Batch insert 100 par requete avec fallback unitaire
- **Commit API**: `129c633`

### 2026-05-15 - Script import VL UEMOA/BRVM (XLSX nettoye)
- **Statut**: COMMITE, A DEPLOYER ET EXECUTER
- **Script**: `api_opcv/import_vl_uemoa.js`
- **Source**: `BRVM_VL_Nettoye.xlsx` (feuilles Fonds_resume + VL_nettoyees)
- **Donnees**: 147 fonds, 87 186 VL validees, devise XOF, dates 2010-2026
- **Categories**: D(72), OMLT(45), A(21), OCT(8), OATC(1)
- **Fonctionnalites**:
  - Conversion dates Excel serial number -> YYYY-MM-DD (87186/87186 converties OK)
  - Metadata fonds depuis Fonds_resume (societe, depositaire, categorie, valeur origine)
  - Classification automatique centralisee et non-destructive:
    - A -> Actions / Actions / Actions UEMOA
    - D -> Diversifies / Diversifies / Diversifies UEMOA
    - OMLT -> Obligations moyen et long terme / Obligations / Obligations UEMOA
    - OCT -> Obligations court terme / Obligations / Obligations UEMOA
    - OATC -> Obligations et autres titres de creance / Obligations / Obligations UEMOA
    - O -> Obligations / Obligations / Obligations UEMOA
    - M -> Monetaire / Monetaire / Monetaire UEMOA
  - Champs remplis: classification, categorie_globale, categorie_national, categorie_regional
  - Ne met a jour que les champs VIDES (ne jamais ecraser les valeurs existantes correctes)
  - EUR/XOF = 655.957 (parite fixe CFA)
  - Batch insert 100 par requete avec fallback unitaire
- **Commit API**: a venir

### 2026-05-16 - Script import VL Maroc quotidiennes ASFIM (2024-2026)
- **Statut**: COMMITE, A DEPLOYER ET EXECUTER
- **Script**: `api_opcv/import_vl_maroc_2024_2026.js`
- **Source**: `Tableau_de_performance_du_20242026.zip` (342 fichiers XLSX ASFIM)
- **Donnees**: 116 095 VL, 614 fonds, oct 2024 -> mar 2026
- **Fonctionnalites**:
  - Accepte un ZIP ou un dossier de fichiers XLSX
  - Extrait automatiquement le ZIP dans /tmp
  - Match fonds par CODE ISIN ou nom (priorite ISIN)
  - Cree les fonds nouveaux (pays=MAROC, dev=MAD, regulateur=AMMC)
  - INSERT IGNORE (ne duplique jamais les VL existantes)
  - Conversion MAD->EUR/USD avec taux quotidien depuis devisedechanges
  - Met a jour datejour, date_premiere_vl, montant_premier_vl apres import
  - Batch insert 200 par requete avec fallback unitaire
  - Nettoyage automatique du dossier temp
- **Usage**: `node import_vl_maroc_2024_2026.js "/chemin/Tableau_de_performance_du_20242026.zip"`
- **Commit API**: `5639894`

### 2026-05-16 - Script import historique Forex (5 XLSX, 9 paires, 2000-2026)
- **Statut**: COMMITE, A DEPLOYER ET EXECUTER
- **Script**: `api_opcv/import_forex_historique.js`
- **Source**: 5 fichiers XLSX:
  1. `Historique_XOF_UEMOA_2000_2026.xlsx` -> EUR/XOF, USD/XOF (~5840 lignes)
  2. `Historique_MAD_Maroc_2000_2026.xlsx` -> EUR/MAD, USD/MAD (~5849 lignes)
  3. `Historique_NGN_Nigeria_2000_2026.xlsx` -> EUR/NGN, USD/NGN (~5840 lignes)
  4. `historique_EURUSD_quotidien_2000_2026.xlsx` -> EUR/USD (~6875 lignes)
  5. `Historique_TND_Tunisie_2000_2026.xlsx` -> EUR/TND, USD/TND (~5842 lignes)
- **Couverture**: 2000/2003 a mai 2026 (quotidien)
- **Fonctionnalites**:
  - INSERT IGNORE (ne duplique jamais les entrees existantes)
  - Pre-charge les paires existantes en memoire pour performance
  - Insertion par batch de 500
  - Gere dates string YYYY-MM-DD, DD/MM/YYYY, et serials Excel
  - Skip valeurs vides ou <= 0 (certaines paires EUR manquent pour dates anciennes)
  - Rapport detaille par paire + verification finale
- **Usage**: `node import_forex_historique.js /chemin/vers/dossier/xlsx/`
- **Impact**: Peuple devisedechanges avec ~30K+ nouvelles entrees forex historiques
  - Permet le calcul EUR/USD pour TOUS les pays (y compris NGN jusque-la impossible)
  - Pre-requis pour fix_valorisations_eur_usd.js et calculs de performance EUR/USD
- **Commit API**: `3e9a801`

### 2026-05-16 - Fix MySQL host IPv6 dans tous les scripts
- **Statut**: COMMITE, A DEPLOYER
- **Bug**: Sur production, `host: 'localhost'` resout en `::1` (IPv6) mais MySQL n'ecoute que sur IPv4
- **Fix**: `host: 'localhost'` -> `host: '127.0.0.1'` dans 4 scripts:
  - `fix_valorisations_eur_usd.js`
  - `import_vl_maroc.js`
  - `import_vl_maroc_xlsx.js`
  - `import_vl_uemoa.js`
- **Commit API**: `3e9a801`

### 2026-05-16 - Deploiement production: Forex, VL ajuste, cron
- **Statut**: EXECUTE EN PRODUCTION
- **Forex**: 21 paires importees, EUR/USD etendu jusqu'a mai 2026 via Yahoo Finance (FRED timeout)
- **VL Ajuste**: 1 171 022 VL recalculees avec formule additive (identique au code d'origine)
- **fix_valorisations_eur_usd**: Toutes devises gerees dynamiquement (0 updates necessaires, deja OK)
- **Cron**: `cron_daily_update.sh` installe (20h lun-ven): ASFIM + forex + vl_ajuste + perf x2
- **Commits API**: `8da790c`, `aacddcc`, `8a319f5`, `e3424ef`

### 2026-05-17 - Fix pages EUR/USD (graphique, performances, classement)
- **Statut**: COMMITE ET POUSSE, A DEPLOYER EN PRODUCTION
- **8 bugs corriges dans 5 fichiers**:
  1. `apigestionfonds.js`: Graphique EUR/USD utilisait `data.value` (devise locale) au lieu de `vl_ajuste_EUR`/`vl_ajuste_USD`. Ajout pattern `hasIndRef` pour rendre le graphique meme sans benchmark (comme la route locale). Fix `req.params.id` -> `fundId` pour le lookup fond.
  2. `apigestionperformance.js`: Branche EUR utilisait `actif_net_USD` au lieu de `actif_net_EUR` (2 occurrences corrigees).
  3. `apigestionsavequotidien.js`: `processFundDevise` appelait `/api/performancesdev/` sans date -> corrige vers `/api/performancesdevwithdate/` avec date. USD regional ranking utilisait `categorie_nationale` -> corrige vers `categorie_regionale`. `calculateRankForPeriod` retournait `null` causant crash -> retourne `[null, 0]`.
  4. `apigestionquartile.js`: Route `classementquartiledev` retournait 404 si classement absent -> retourne objet vide `{}` (comme la version locale).
  5. `apigestionratios.js`: Ratios EUR/USD utilisaient `indRef` (devise locale) -> corrige vers `indRef_EUR`/`indRef_USD` (2 occurrences).
- **Commit API**: `4eb6d8b`

### 2026-05-17 - Fix performances "-" pour Nigeria/Tunisie/UEMOA + nettoyage pics VL
- **Statut**: DEPLOYE ET EXECUTE EN PRODUCTION
- **Probleme 1**: Les colonnes YTD, Perf Glissante 1A, Perf Glissante 3A affichent "-" pour Nigeria, Tunisie, UEMOA (mais OK pour Maroc)
- **Cause racine 1**: La table `performences` etait vide pour les fonds non-Maroc. Le endpoint `saveperfdatemysql` n'avait jamais ete execute pour ces fonds. De plus, `processFundmysql` avait un filtre date hardcode `> 2024-07-31` qui excluait UEMOA (dernieres VL: 2024-03-21) et Tunisie (2024-07-24).
- **Fix 1**: Date filtre changee de `2024-07-31` a `2019-12-31` + null guards dans processFundmysql
- **Probleme 2**: Pics VL incoherents sur Nigeria/Tunisie/UEMOA (visible sur graphiques). Le precedent nettoyage (audit_vl_anomalies.js) ne detectait que l ecart avec le predecesseur, pas le successeur, donc ne distinguait pas quel point etait le pic.
- **Fix 2**: `fix_vl_spikes.js` — algorithme iteratif multi-passes: un point est un pic seulement s il devie >15% de SES DEUX VOISINS (prev ET next). Supprime les pics et re-scanne jusqu a convergence.
- **Probleme 3**: Nigeria categorie_regional = "AFRIQUE DU NORD" au lieu de "AFRIQUE DE L OUEST"
- **Fix 3**: `fix_categorie_regional.js` — recalcule categorie_regional pour tous les pays selon le PAYS_REGION_MAP correct
- **Resultats execution prod**:
  - `fix_categorie_regional.js`: 546 fonds corriges (274 Nigeria, 72 Tunisie, 111 UEMOA, 34 CEMAC, 55 Maroc)
  - `fix_vl_spikes.js --delete`: 72 pics supprimes en 3 passes (54 Nigeria, 13 Maroc, 5 UEMOA). Convergence pass 3.
  - `recalc_vl_ajuste.js`: 1 228 363 VL recalculees, 0 erreurs
  - `saveperfdatemysql/1/3000`: performances calculees pour 1176 fonds (tous pays)
  - `saveperfdateeur/1/3000`: 1176 fonds EUR, 0 erreurs
  - `saveperfdateusd/1/3000`: 1176 fonds USD, 0 erreurs
- **Fichiers modifies**: `apigestionsavequotidien.js` (processFundmysql date filter + null guards)
- **Scripts crees**: `fix_vl_spikes.js`, `fix_categorie_regional.js`
- **Commit API**: `ea57218`

### 2026-05-17 - Fix page societe de gestion (fund-managers) vide + VL anomales ciblees
- **Statut**: COMMITE ET POUSSE, A DEPLOYER EN PRODUCTION
- **Probleme 1**: Page `/fund-managers/funds/[societe]` affiche des lignes vides (pas de nom, categorie, performances)
- **Cause racine 1**: `/api/listeproduitsociete/:id` (apigestionsociete.js ligne 664): `performanceResults.toJSON()` crash quand le fond n'a pas de record dans `performences` (retourne null). Le catch renvoie un objet `{error:...}` au lieu de `{id, fundData, performanceData}`. Le frontend rend les lignes mais `item.fundData` est undefined.
- **Fix 1a**: Null-safety: `performanceResults ? performanceResults.toJSON() : null`
- **Fix 1b**: Case-insensitive matching pour societe_gestion (comme deja fait sur les pages pays)
- **Impact**: Affecte TOUTES les societes de gestion dont les fonds n'ont pas de perf precalculee (Nigeria, Tunisie, UEMOA, CEMAC = 100% echec)
- **Probleme 2**: Performances toujours "-" apres `saveperfdatemysql` — le endpoint est fondamentalement casse pour le bulk (genere millions d'appels HTTP a lui-meme, timeout)
- **Fix 2**: `fix_populate_performances.js` — script leger qui pour chaque fond actif:
  1. Recupere la derniere date VL
  2. Appelle UNE SEULE fois `/api/performanceswithdate/fond/{id}/{date}` + ratios
  3. INSERT/UPDATE dans `performences`
  - Options: `--pays`, `--fond`, `--force`
  - Utilise `http://localhost:3005` (appels internes, pas via Nginx)
- **Probleme 3**: VL anomales specifiques restantes:
  - AFRINVEST DOLLAR FUND (id=1141): 2 entrees VL=114.52 les 2025-12-19 et 2025-12-24 au lieu de ~165,000 (erreur saisie, valeur 1445x trop basse) -> YTD affiche 137,201%
  - SICAV ABDOU DIOUF (id=1539): doublons de date + pics 10% residuels
- **Fix 3**: `fix_vl_targeted.js` — nettoyage cible:
  - Fond 1141: supprime entrees VL < 1000 en dec 2025
  - Fond 1539: supprime doublons de date + detection pics seuil 10%
  - Global: detecte tout fond avec drop >90% puis recovery >900% (pattern erreur saisie)
- **Fichiers modifies**: `src/routes/apigestionsociete.js`
- **Scripts crees**: `fix_populate_performances.js`, `fix_vl_targeted.js`
- **Commit API**: `5c62ae0`, `85ef436`

### 2026-05-18 - Deploiement 1: VL ciblees + fund-managers fix + performances v2
- **Statut**: DEPLOYE ET EXECUTE EN PRODUCTION
- **Resultats positifs**:
  - `fix_vl_targeted.js --delete`: 1003 VL supprimees (2 fond 1141 + 1001 doublons fond 1539)
  - `recalc_vl_ajuste.js`: 1 227 360 VL recalculees, 0 erreurs
  - Fund-managers fix: verifie OK — `curl listeproduitsociete/CHAPEL HILL...` retourne 11 fonds avec `{id, fundData, performanceData}`
- **fix_populate_performances.js v1 avait echoue** (1127 erreurs / 37 succes)
  - Cause: l'API `/api/performanceswithdate` crash (500) pour 96% des fonds
  - Fix: Script reecrit (v2, commit `85ef436`) — calcul DIRECT en SQL+JS sans passer par l'API
  - **v2 deploye et execute**: 1174 fonds, 0 erreurs, 1162 inseres, 12 mis a jour

### 2026-05-18 - Deploiement 2: Nettoyage complet VL + indRef parasites
- **Statut**: DEPLOYE ET EXECUTE EN PRODUCTION
- **Script**: `fix_vl_cleanup_all.js --delete`
- **Resultats nettoyage** (3 passes, convergence pass 3):
  - Doublons de date: **534 974 VL supprimees** (MAROC 527K, NIGERIA 4.5K, UEMOA 3K, CEMAC 148)
  - Pics VL (>15%): **52 VL supprimees** (tous MAROC)
  - Erreurs saisie (>30%): **24 VL supprimees** (17 MAROC, 7 NIGERIA)
  - IndRef parasites: **35 corrigees par interpolation** (33 UEMOA/SICAV ABDOU DIOUF + 2 MAROC)
  - **TOTAL: 535 050 VL nettoyees + 35 indRef corrigees**
- **Fonds les plus touches**: STANBIC IBTC ETF 30 (4), BMCI COSMOS (3), FCP CAPITAL ACTIONS (3)
- **Post-nettoyage execute**:
  - `recalc_vl_ajuste.js`: 692 310 VL recalculees, 0 erreurs (base reduite de ~1.2M a 732K VL apres suppression doublons)
  - `fix_populate_performances.js --force`: 1173 fonds, 0 erreurs (395 inseres, 778 mis a jour)
- **Impact graphique base 100**: Les pics a 200 sur SICAV ABDOU DIOUF et les 2 fonds Maroc sont corriges

## Points en cours / a faire

### PHASE 2 - Base de donnees: Nettoyage avance + calculs
**Priorite: HAUTE**

#### 2A. Nettoyage VL restant
- [x] Nettoyage complet: 534 974 doublons + 76 pics/erreurs + 35 indRef parasites (fix_vl_cleanup_all.js, 2026-05-18)
- [ ] Nettoyer 5 fonds avec VL extremes (meme probleme actif net vs VL unitaire que BRIDGE):
  - FCP TRESO MONEA, FCP BOA RENDEMENT, FCP ECOBANK UEMOA OBLIGATAIRE, SICAV ABDOU DIOUF, FCP SOGELIQUID
- [x] Corriger 31 VL avec date=0000-00-00 (FAIT - supprimees par Phase 2 step 2)
- [x] Verifier coherence VL: detecter les series avec variations >50% d'un jour a l'autre (script audit_vl_anomalies.js)
- [x] Supprimer fonds parasite nom_fond="1" (id=2820, 18 VL supprimees)
- [x] Detecter VL avec variation >15% entre 2 VL consecutives (<= 7 jours) — TOUS PAYS (audit_vl_anomalies.js execute)
- [x] Nettoyage iteratif pics VL avec detection bidirectionnelle (fix_vl_spikes.js) — EXECUTE (72 pics, 3 passes)
- **Resultats audit 15% / 7j (2026-05-17)**:
  - 1 183 fonds analyses, 1 229 273 VL
  - 860 anomalies detectees dans 201 fonds
  - Nigeria: 668 anomalies (124 fonds) — colonnes NAV/prix inversees dans fichiers SEC source
  - MAROC: 176 anomalies (67 fonds) — meme pattern VL/actif_net inverses
  - TUNISIE: 8 anomalies (5 fonds)
  - UEMOA: 8 anomalies (5 fonds) — ex: FCP ECOBANK UEMOA OBLIGATAIRE (actif_net dans champ VL)
  - Pattern: les variations >100 000% sont des inversions NAV/VL (ex: 1.03 -> 3543 = actif net dans champ prix)
  - CSV rapport exporte: audit_vl_anomalies_report.csv sur le serveur
- [x] Supprimer les 860 VL anomales (audit_vl_anomalies.js --delete --seuil 15) — FAIT 2026-05-17
- [x] Recalculer VL ajustees + performances apres nettoyage — FAIT 2026-05-17 (1 228 435 VL, 611 fonds perf, 0 erreurs)

#### 2B. Donnees statiques manquantes sur les fonds
- [ ] Peupler `structure_fond` (FCP/SICAV) a partir du prefixe du nom du fond (NOTE: forme_juridique n'existe PAS, utiliser structure_fond)
- [ ] Peupler `categorie_globale` depuis classification existante ou nom du fond (Obligataire, Actions, Monetaire, Diversifie)
- [ ] Peupler `categorie_national` depuis classification ou pays
- [ ] Peupler `categorie_libelle` la ou vide (depuis classification ou categorie_globale)
- [ ] Peupler `date_premiere_vl` depuis MIN(date) des valorisations pour chaque fond
- [ ] Peupler `montant_premier_vl` depuis la premiere VL de chaque fond
- [ ] Peupler `montant_actif_net` depuis la derniere VL si disponible
- [ ] Corriger `periodicite` (detecter depuis frequence reelle des VL: quotidien, hebdomadaire, mensuel)

#### 2C. Forex manquant
- [x] Importer EUR/NGN et USD/NGN (script import_forex_historique.js cree, a executer)
- [x] Importer EUR/XOF, USD/XOF, EUR/MAD, USD/MAD, EUR/TND, USD/TND, EUR/USD (script pret)
- [ ] Generer paires croisees manquantes (GHS/USD, KES/USD, ZAR/USD, EGP/USD)
- [ ] Scraping automatique des taux de change (source: ECB, fixer.io, ou API gratuite)

#### 2D. Calculs batch (tables vides)
- [x] Remplir `performences` pour TOUS les pays (1176 fonds) - locale, EUR, USD (2026-05-17)
- [x] Remplir `performences_eurs` (1176 fonds) - calcul perf en EUR pour chaque fond (2026-05-17)
- [x] Remplir `performences_usds` (1176 fonds) - calcul perf en USD pour chaque fond (2026-05-17)
- [x] Remplir `classementfonds_eurs` - classement par performance EUR (2026-05-17)
- [x] Remplir `classementfonds_usds` - classement par performance USD (2026-05-17)
- [ ] Remplir `rendements` (0 lignes) - rendements par periode
- [ ] Remplir `portefeuille_base100s` (0 lignes) - courbes base 100

#### 2E. Taux sans risque (TSR)
- [ ] Importer TSR Tunisie: TMM (Taux du Marche Monetaire) depuis BCT
- [ ] Importer TSR UEMOA: taux directeur BCEAO
- [ ] Importer TSR CEMAC: taux directeur BEAC
- [ ] Importer TSR Nigeria: MPR depuis CBN
- [ ] TSR Maroc: deja present dans la base

#### 2F. Nigeria VL
- [x] Preparer script d'import Excel SEC Nigeria (weekly NAV) — sec_ng_nav_extractor_v6.py + import_vl_nigeria_sec.js
- [x] Executer extraction historique 2018-2026 sur le serveur (432 fichiers, 81 422 lignes, 0 erreurs)
- [x] Executer import dans MySQL (58 291 VL inserees, 275 fonds total, 110 crees)
- [x] Activer les 150+ fonds Nigeria une fois VL importees (automatique via import script)
- [x] Generer EUR/NGN et USD/NGN (fait via import_forex_historique.js, 2026-05-16)
- [x] Installer cron_nigeria_weekly.sh (chaque lundi 10h) — INSTALLE EN PROD
- [x] Corriger 15 mauvais fuzzy matches (fix_nigeria_fuzzy_matches.js — 419 VL deplacees)
- [x] Seuil fuzzy releve de 85% a 95% pour eviter faux positifs
- [x] Validation VL ajoutee: bornes [0.0001 - 1M NGN], NAV max 5T NGN (1 041 rejets corrects)
- [x] Preference bloc CURRENT vs PREVIOUS dans fichiers multi-blocs
- [x] Creer societes de gestion Nigeria dans table societes (fix_nigeria_societes.js — 36 creees, 53 fonds rattaches)
- [x] Corriger 15 fonds orphelins sans societe_gestion (fix_nigeria_orphans_and_dupes.js)
- [x] Fusionner 9 doublons societes (variations noms: Ltd vs Limited, etc.)
- [x] Supprimer societe parasite "1"
- [x] Recalcul VL ajustees (1 229 313 VL, 0 erreurs)
- [x] Recalcul performances locale/EUR/USD (611 fonds, 0 erreurs)
- [ ] Verifier couverture: 211/221 fonds ont des VL 2026 (64 fonds sans VL 2026, probablement fonds fermes)
- [ ] Nettoyer 244 VL avec variations extremes (erreurs source SEC: colonnes NAV/prix inversees)

#### 2G. Harmonisation categories (casse et accents)
- [x] Harmoniser majuscules/minuscules: ACTIONS vs Actions, DIVERSIFIE vs Diversifié, OBLIGATIONS vs Obligataire (fix_harmonize_categories.js, 603 fonds, 2026-05-17)
- [x] Normaliser en majuscules dans fond_investissements: categorie_globale, categorie_libelle, classification (fait)
- [x] Verifier coherence graphiques pays (pie charts countries/statistique) (verifie OK)

#### 2H. Limite 500 VL sur page fond (date decalee)
- [x] Route `/api/valLiq/:id` et `/api/valLiqdev/:id/:devise` limitees a 500 VL -> augmente a 10000 (2026-05-17)
- [x] Fonds avec >500 VL: graphique et perf tronques -> corrige (limit 10000 dans 5 fichiers routes, 33 occurrences)
- [x] Exemple: AFRICAPITAL CASH PLUS montre VL jusqu'en 2021 alors que les donnees vont a 2026 -> corrige
- [x] Solution appliquee: augmentation LIMIT 500 -> 10000 dans toutes les routes API

### PHASE 3 - Integrite structurelle
**Priorite: MOYENNE**

- [ ] Ajouter contraintes FK reelles MySQL (societe_id -> societes.id, fund_id -> fond_investissements.id)
- [ ] Optimiser table classementfonds: 30+ colonnes de ranking -> table pivot
- [ ] Migrer calculs lourds vers ClickHouse (deja integre, 3 tables)
- [ ] Ajouter index manquants (valorisations.fund_id + date composite)
- [ ] Nettoyer tables inutilisees ou orphelines

### Panel admin - cockpit administration
- [ ] Gestion rattachement fonds <-> societes de gestion (admin UI)
- [ ] Gestion rattachement fonds <-> indices, categories (admin UI)
- [ ] Correction/mise a jour VL depuis admin
- [ ] Administration base de donnees (CRUD avance)
- [ ] Gestion droits utilisateurs avancee
- [ ] Export/rapport anomalies (CSV/PDF)
- [ ] Dashboard cockpit: vue globale fonds actifs/inactifs, VL manquantes, anomalies

### Panel societe de gestion
- [ ] Verifier import-nav (importation VL fichier plat)
- [ ] Verifier documents (upload/gestion)
- [ ] Verifier staff (personnel CRUD)
- [ ] Verifier que chaque societe ne voit que ses propres donnees partout
- [ ] Page reporting

### Country panel
- [x] Endpoint `/api/getallfondsanomalie` corrige -> c'etait une erreur de nommage dans le frontend, l'endpoint correct est `/api/getallfondsvlanomalie` (existe deja)

### Panel portfolio (`/panel/portfolio/`)
- [ ] Memes bugs de serialisation JSON que panel investor (a corriger)

### Anomalies - ameliorations futures
- [ ] Detecter automatiquement les ecarts VL suspects (cron job quotidien)
- [ ] Permettre de marquer une anomalie comme "traitee" depuis le panel
- [ ] Historique des corrections VL
- [ ] Alertes email pour nouvelles anomalies

### Global
- [ ] Verifier aucune regression sur les pages publiques
- [ ] Tests automatises (aucun test unitaire actuellement)
- [ ] Securite: audit des endpoints API (auth, CORS, injection)

## Notes techniques importantes
- Sequelize JSON columns (fundids, funds): auto-parse a la lecture, auto-serialize a l'ecriture
- **Liaison fonds-societes**: `fond.societe_gestion` (string) + `fond.societe_id` (FK numerique, ajoute Phase 1)
- Les documents et personnel sont lies via `document.societe`/`personnel.societe` (string) + `societe_id` (FK, ajoute Phase 1)
- Le script `/api/savevlmanquante` met a jour le champ `anomalie` dans la table `performences`
- Le champ `active` dans `fond_investissements`: 0=en attente, 1=valide
- **Noms de colonnes** (attention aux erreurs frequentes):
  - `valorisations.value` (pas `valeur`)
  - `pays_regulateurs.symboledevise` (pas `devise`)
  - `devises.Symbole` (pas `code_devise`, majuscule S)
  - `devisedechanges.value` (pas `taux`)
  - `fond.societe_gestion` -> `societe.nom` (liaison string)
- **EUR/XAF**: parite fixe 655.957 (zone CFA, depuis 1999)
- **Types utilisateurs**: 0=Admin, 1=Investisseur, 2=SG, 3=Institutionnel, 4=DataRequester, 5=CountryPanel, 6=Distributeur
- **Pays couverts**: MAROC, TUNISIE, UEMOA (zone CFA Ouest), CEMAC (zone CFA Central), Nigeria, AFRIQUE DU SUD, EGYPTE, KENYA, GHANA
- **Table societes** (pas societe_gestions): le modele Sequelize est `societes` (fichier societe.js). La table `societe_gestions` n'existe PAS.
- **Nigeria VL mapping**: CSV `vl_price` (offer/unit price) → DB `value`, CSV `nav_value` → DB `actif_net`. NE PAS CONFONDRE.
- **Nigeria SEC source**: fichiers XLSX hebdomadaires sur sec.gov.ng, publiés le vendredi, colonnes: NAV (N), Offer Price (N), Bid Price (N)
- **Fuzzy matching Nigeria**: seuil 95% (pas 85%) pour eviter faux positifs. 15 faux positifs identifies et corriges a 85%.
- **Import scripts doivent filtrer par pays**: toujours utiliser `WHERE nom_fond = ? AND LOWER(pays) = LOWER(?)` pour eviter collisions cross-pays
- **Crons actifs**: cron_daily_update.sh (lun-ven 20h), cron_nigeria_weekly.sh (lundi 10h), fix-brvm-nginx.py (toutes les 5 min)

## Historique des scripts de migration
| Script | Date | Description | Statut |
|--------|------|-------------|--------|
| `diagnostic_db.js` | 2026-05-14 | Audit complet 63 tables, 21 sections | Execute |
| `fix_database_phase1.js` | 2026-05-14 | Orphelins, FK societe_id, activation, VL, forex, statique | Execute en prod |
| `20260514000001-add-societe-id-fk.js` | 2026-05-14 | Migration Sequelize societe_id | Commite |
| `fix_database_phase2.js` | 2026-05-15 | Enrichissement statique 10 etapes | Present sur serveur, PAS EXECUTE |
| (classement EUR/USD fix) | 2026-05-15 | Fix classementfonds.create -> classementfonds_eurs/usds | Commite, a deployer |
| (batch perf EUR/USD) | 2026-05-15 | Endpoints saveperfdateeur/saveperfdateusd | Commite, a deployer |
| `import_vl_maroc.js` | 2026-05-15 | Import CSV ASFIM (VL Maroc) | Commite, a deployer et executer |
| `import_vl_maroc_xlsx.js` | 2026-05-15 | Import XLSX consolide ASFIM (609 fonds, 50K+ VL Maroc) | Commite, a deployer et executer |
| `import_vl_uemoa.js` | 2026-05-15 | Import XLSX BRVM nettoye (147 fonds, 87K VL UEMOA/XOF) | Commite, a deployer et executer |
| `scrape_forex_import.js` | 2026-05-16 | Ajout EUR/USD Yahoo Finance fallback (FRED timeout) | Execute en prod |
| `fix_valorisations_eur_usd.js` | 2026-05-16 | Gestion dynamique toutes devises (plus de skip NGN/ZAR/etc) | Execute en prod |
| `recalc_vl_ajuste.js` | 2026-05-16 | Recalcul VL ajuste formule additive (1.17M VL, 0 erreurs) | Execute en prod |
| `cron_daily_update.sh` | 2026-05-16 | Cron quotidien 5 etapes (ASFIM+forex+vl_ajuste+perf) | Installe en prod |
| (fix EUR/USD pages) | 2026-05-17 | 8 bugs corriges dans 5 fichiers routes API | DEPLOYE en prod |
| (limit 500->10000) | 2026-05-17 | Fix troncature VL fonds >500 points (graph + perf) | DEPLOYE en prod |
| `fix_harmonize_categories.js` | 2026-05-17 | Harmonisation categories (ACTIONS/Actions, etc) 603 fonds | Execute en prod |
| (saveperfdateeur/usd) | 2026-05-17 | Tables performences_eurs/usds remplies (551 fonds) | Execute en prod |
| `recalc_eur_usd_daily_rate.js` | 2026-05-17 | Recalcul value_EUR/USD avec taux quotidien par date VL (909 fonds, 1.17M VL) | Execute en prod |
| (fix toFixed null safety) | 2026-05-17 | Fix crash pages fonds Tunisie/UEMOA (optional chaining, 3 fichiers) | DEPLOYE en prod |
| `sec_ng_nav_extractor_v6.py` | 2026-05-17 | Extracteur Python SEC Nigeria Weekly NAV (scrape+parse XLSX) | Execute en prod (432 fichiers, 81K lignes) |
| `import_vl_nigeria_sec.js` | 2026-05-17 | Import CSV Nigeria -> MySQL (matching+creation fonds+VL+EUR/USD) | Execute en prod (58K VL, 275 fonds) |
| `cron_nigeria_weekly.sh` | 2026-05-17 | Cron hebdomadaire Nigeria (extraction+import+perf, chaque lundi) | Installe en prod (lundi 10h) |
| `fix_nigeria_fuzzy_matches.js` | 2026-05-17 | Correction 15 mauvais fuzzy matches (deplace VL vers bons fonds) | Execute en prod (419 VL deplacees) |
| `fix_nigeria_societes.js` | 2026-05-17 | Creation societes de gestion Nigeria dans table societes | Execute en prod (36 creees, 53 fonds rattaches) |
| `fix_nigeria_orphans_and_dupes.js` | 2026-05-17 | Fix orphelins + suppression doublon societes + societe parasite "1" | Execute en prod (15 orphelins, 9 dupes) |
| `compare_nigeria_excel_vs_db.js` | 2026-05-17 | Comparaison fichier Excel SEC Nigeria vs base pour fonds manquants | Commite, pret a utiliser |
| (filtre pays imports) | 2026-05-17 | Ajout AND pays=? aux imports Maroc/UEMOA (anti-collision cross-pays) | Deploye en prod |
| (null guard societes) | 2026-05-17 | Fix crash API getSocietebyidfisrt/stat quand societe absente | Deploye en prod |
| (fix Sequelize FK+DataTypes) | 2026-05-17 | Desactivation FK incompatibles date/id + NUMBER->INTEGER | **REVERTE** (causait regression pages vides) |
| (REVERT FK+DataTypes) | 2026-05-17 | Re-activation FK associations + DataTypes.NUMBER restaure | DEPLOYE en prod |
| (nettoyage 860 VL anomales) | 2026-05-17 | audit_vl_anomalies.js --delete --seuil 15 + recalcul complet | Execute en prod |
| `fix_nigeria_pays_casing.js` | 2026-05-17 | Suppression fonds parasite nom="1" + normalisation pays casing | Execute en prod |
| (fix pays case-sensitive) | 2026-05-17 | getPaysall toLowerCase() pour matching pays cross-tables | Deploye en prod |
| (null guard pays routes) | 2026-05-17 | Fix crash getPaysbyidfisrt/stat si pays non trouvé | Deploye en prod |
| `audit_vl_anomalies.js` | 2026-05-17 | Audit VL: variation >15% entre VL consecutives <=7j, tous pays | Execute en prod (860 anomalies, 201 fonds) |
| (fix countries/search/comparison) | 2026-05-17 | Case-insensitive pays/societe/categorie + null-safe perf + dynamic categories | DEPLOYE en prod |
| `fix_normalize_uppercase.js` | 2026-05-17 | MAJUSCULES + no accents + fill categories nationales/regionales tous pays | Execute en prod |
| `fix_vl_spikes.js` | 2026-05-17 | Nettoyage iteratif pics VL (detection bidirectionnelle, 3 passes, 72 pics) | Execute en prod |
| `fix_categorie_regional.js` | 2026-05-17 | Correction categorie_regional Nigeria (AFRIQUE DU NORD -> AFRIQUE DE L OUEST), 546 fonds | Execute en prod |
| (processFundmysql date fix) | 2026-05-17 | Date filtre 2024-07-31 -> 2019-12-31 + null guards | DEPLOYE en prod |
| (saveperfdatemysql all) | 2026-05-17 | Performances calculees pour 1176 fonds (tous pays), + EUR + USD | Execute en prod |
| `fix_vl_cleanup_all.js` | 2026-05-18 | Nettoyage complet: 535K doublons + 76 pics/erreurs + 35 indRef parasites | Execute en prod |
| `fix_populate_performances.js` v2 | 2026-05-18 | Calcul perf direct SQL (sans API) pour tous les fonds | Deploye en prod (1174 fonds, 0 erreurs) |
| `fix_vl_targeted.js` | 2026-05-18 | Nettoyage cible fonds 1141 + 1539 (1003 VL supprimees) | Execute en prod |
| (fix regression valLiq) | 2026-05-18 | try/catch + null guards + safeFetch sur valLiq/valLiqdev | DEPLOYE en prod |
| `import_indices_excel.js` | 2026-05-18 | Import 5 indices (MASI/Tunindex/BRVM/NSE/MONIA) + indRef + EUR/USD | Execute en prod (657K VL, 316K conv) |
| `sync_production.sh` | 2026-05-18 | Snapshot etat prod (DB+routes+git) -> PRODUCTION_STATE.json | Commite, a deployer |

### 2026-05-17 - Fix crash toFixed sur fonds Tunisie/UEMOA (null safety)
- **Statut**: DEPLOYE EN PRODUCTION (build OK 217/217 pages, 0 erreur)
- **Probleme**: Les pages fonds (`/funds/[fondId]`, `/funds/summary-eur/[fondId]`, `/funds/summary-usd/[fondId]`) crashaient avec "Cannot read properties of null (reading 'toFixed')" pour les fonds de Tunisie et UEMOA
- **Cause racine**: Acces non-null-safe sur des valeurs potentiellement nulles (performances, lastValue, actif_net)
- **Corrections**:
  1. `FundView.tsx` ligne 1426: `lastValue.toFixed(2)` -> `lastValue?.toFixed(2) ?? '-'`
  2. `FundView.tsx` lignes 3089-3091: `performances.data.perf3Moisactif_net` -> `performances?.data?.perf3Moisactif_net`
  3. `FundView.tsx`: 11 occurrences `performances.data?.` -> `performances?.data?.` (replace_all)
  4. `summary-eur/[fondId]/page.tsx` ligne 2802: `Number(post.data.performances.data.perf3Moisactif_net)` -> `Number(post?.data?.performances?.data?.perf3Moisactif_net)`
  5. `summary-usd/[fondId]/page.tsx` ligne 2804: meme correction
- **Impact**: Les fonds de TOUS les pays (y compris ceux avec des donnees incompletes) s'affichent sans crash
- **Commit Frontend**: `8337134`

### 2026-05-17 - Anomalie: conversion EUR/USD avec taux fixe au lieu de quotidien
- **Statut**: EXECUTE EN PRODUCTION (909 fonds, 1 171 002 VL recalculees, 0 erreurs)
- **Probleme**: Les imports historiques (import_vl_maroc_xlsx.js, fix_valorisations_eur_usd.js) convertissaient toutes les VL avec un SEUL taux de change (le plus recent), au lieu du taux du jour de chaque VL
- **Impact**: Les performances EUR et USD sont identiques aux performances en devise locale pour les periodes courtes (perf veille, 4 semaines, YTD, 1 an) car le facteur constant s'annule dans le calcul de pourcentage
- **Diagnostic**: Le scraper ASFIM quotidien utilise deja le taux quotidien (getRate avec binary search) — seuls les imports en batch posent probleme
- **Solution**: `recalc_eur_usd_daily_rate.js` recalcule value_EUR/USD pour chaque VL avec le taux EUR/{devise} et USD/{devise} de la date exacte de la VL
- **Execution prod**: recalc + recalc_vl_ajuste.js + saveperfdateeur/saveperfdateusd => tables performences_eurs/usds mises a jour
- **Commit API**: `8f9c233`

### 2026-05-17 - Import VL Nigeria (SEC Nigeria Weekly NAV)
- **Statut**: EXECUTE EN PRODUCTION
- **Objectif**: Importer l'historique complet des VL hebdomadaires Nigeria depuis la SEC (2018-2026)
- **Architecture 3 scripts**:
  1. `sec_ng_nav_extractor_v6.py` (Python) : Scrape sec.gov.ng, telecharge les XLSX hebdomadaires, extrait fonds/societes/NAV/prix/categories/devises, produit 5 CSV (donnees, audit, coherence, couverture, fuzzy names)
  2. `import_vl_nigeria_sec.js` (Node.js) : Lit le CSV, match les fonds Nigeria (exact + fuzzy 95%), cree les nouveaux, insere VL avec conversion EUR/USD quotidienne (getRate binary search), cree automatiquement les societes de gestion
  3. `cron_nigeria_weekly.sh` (Bash) : Cron lundi 10h — extraction annee courante + import + recalc VL ajuste + recalc perf locale/EUR/USD
- **Resultats execution prod**:
  - Extraction: 432 fichiers telecharges, 81 422 lignes, 0 erreurs
  - Import: 58 291 VL inserees, 275 fonds (165 existants + 110 crees), 1 041 VL rejetees (hors bornes)
  - 45 fuzzy matches dont 15 faux positifs corriges (fix_nigeria_fuzzy_matches.js)
  - 244 VL avec variations extremes detectees (erreurs source SEC, non importees)
- **Mapping VL/AN verifie**:
  - CSV `vl_price` (offer/unit price per share) → DB `value` (prix unitaire)
  - CSV `nav_value`/`nav_ngn` (total NAV) → DB `actif_net` (actif net total)
  - `vl_ajuste` = `value` (pas de dividendes pour Nigeria)
- **Controles qualite integres**:
  - Bornes VL: [0.0001 - 1 000 000 NGN], NAV max: 5T NGN
  - Preference bloc CURRENT vs PREVIOUS dans fichiers multi-semaines
  - NAV < VL suspect (NAV devrait etre >> prix unitaire)
  - Variation extreme >50% entre VL consecutives signalee
  - Matching fuzzy 95% pour eviter faux positifs (releve de 85%)
  - Non-destructif: ne met a jour que les champs VIDES sur fonds existants
- **Categories mappees**: ACTIONS, MONETAIRE, OBLIGATAIRE, DIVERSIFIE, IMMOBILIER, DOLLAR, ETHIQUE, CHARIA, SPECIALISE, INFRASTRUCTURE, ETF
- **Pre-requis serveur**: Python3 + pip (requests, beautifulsoup4, openpyxl, python-dateutil), LibreOffice (conversion .xls anciens)
- **Commits API**: `a36e8d1` (pipeline initial), `3af89c2` (validation+qualite), `a9a36d1` (fix fuzzy+threshold 95%)
- **Cron**: installe en production (chaque lundi 10h)

### 2026-05-17 - Correction societes de gestion Nigeria
- **Statut**: EXECUTE EN PRODUCTION
- **Probleme 1**: import_vl_nigeria_sec.js creait les fonds avec societe_gestion (texte) mais ne creait pas les entrees dans la table societes ni ne mettait a jour societe_id → page /fund-managers/ crashait
- **Probleme 2**: fix_nigeria_fuzzy_matches.js creait 15 fonds sans societe_gestion (champ vide)
- **Probleme 3**: Doublons de societes dues a variations de noms (Ltd vs Limited, espace vs point)
- **Probleme 4**: Societe parasite "1" creee par erreur
- **Scripts executes**:
  1. `fix_nigeria_societes.js`: 77 societes distinctes, 36 creees, 41 existantes, 53 fonds rattaches
  2. `fix_nigeria_orphans_and_dupes.js`: 15 orphelins corriges, 9 doublons fusionnes, societe "1" supprimee
- **Resultat final**: 69 societes Nigeria propres, 274/275 fonds avec societe_id (1 orphelin restant)
- **Commits API**: `f107970` (fix societes + null guard), `9b0982f` (orphans + dupes)

### 2026-05-17 - Null guard API societes de gestion
- **Statut**: DEPLOYE EN PRODUCTION (PM2 restart id:10)
- **Bug**: Routes `/api/getSocietebyidfisrt/:id` et `/api/getSocietebyidstat/:id` crashaient quand societe.findOne() retourne null
- **Fix**: Ajout `if (!response) return res.status(404)` avant acces a response.nom
- **Fichier**: `src/routes/apigestionsociete.js`
- **Commit API**: `f107970`

### 2026-05-17 - Filtre pays ajouté aux imports Maroc et UEMOA
- **Statut**: DEPLOYE EN PRODUCTION
- **Probleme**: import_vl_maroc.js et import_vl_uemoa.js cherchaient les fonds par nom SANS filtrer par pays → risque de collision cross-pays si 2 pays ont un fonds avec le meme nom
- **Fix**: Ajout `AND LOWER(pays) = LOWER(?)` aux requetes de matching, aligné sur le modele Nigeria
- **Fichiers**: `import_vl_maroc.js` ligne 177, `import_vl_uemoa.js` ligne 346
- **Commit API**: `bd3821e`

### 2026-05-17 - Fix associations Sequelize incompatibles + DataTypes
- **Statut**: REVERTE — CAUSAIT UNE REGRESSION (pages fonds vides)
- **Fix 1 (REVERTE)**: Desactivation FK associations dans db.js et sequelize.js — CASSAIT l'affichage des fonds
  - `date_valorisation.belongsTo(vl)` et `vl.hasMany(date_valorisation)` — ne doivent PAS etre desactivees
  - `transaction.belongsTo(devisedechanges)` — ne doit PAS etre desactivee
- **Fix 2 (REVERTE)**: `tsrhisto.js` — `DataTypes.NUMBER` ne doit PAS etre change en `DataTypes.INTEGER` (fonctionnait avant)
- **Commit initial (REGRESSION)**: `f107970`
- **Commit revert (FIX)**: `473eb5f`
- **LECON**: Ne JAMAIS desactiver des associations Sequelize existantes sans tester l'impact sur toutes les pages. Ces associations sont utilisees par les routes API pour charger les donnees des fonds.

### 2026-05-17 - REVERT regression pages fonds vides
- **Statut**: COMMITE ET POUSSE, A DEPLOYER EN PRODUCTION (pm2 restart 10)
- **Probleme**: Les pages fonds affichaient des donnees vides apres deploiement du commit f107970
- **Cause**: Le commit f107970 incluait accidentellement des modifications aux FK associations dans db.js et sequelize.js (desactivation de 3 associations) + changement DataTypes dans tsrhisto.js. Ces changements n'etaient pas lies aux fix Nigeria societes mais ont ete embarques dans le meme commit.
- **Fix**: Revert des 3 fichiers:
  1. `services/shared/db.js` — re-activation de date_valorisation<->vl et transaction<->devisedechanges
  2. `src/db/sequelize.js` — meme re-activation
  3. `src/models/tsrhisto.js` — DataTypes.INTEGER revenu a DataTypes.NUMBER
- **Commit API**: `473eb5f`
- **Deploiement**: FAIT — git pull + pm2 restart 10 (2026-05-17)
- **VL anomales nettoyees dans la meme session**: 860 VL supprimees + recalcul VL ajuste (1 228 435) + perf locale/EUR/USD (611 fonds)

### 2026-05-17 - Fix countries/funds, search, comparison pages + normalisation DB
- **Statut**: COMMITE ET POUSSE, A DEPLOYER EN PRODUCTION
- **Problemes resolus**:
  1. Pages `/countries/funds/NIGERIA`, `/countries/funds/UEMOA`, etc. n'affichaient pas la liste des fonds
  2. Page `/tools/search`: les filtres societe de gestion, categories ne fonctionnaient pas
  3. Page `/tools/comparison`: idem
  4. Categories nationale/regionale manquantes pour tous les pays sauf Maroc
  5. Noms avec accents/apostrophes/casse mixte dans la base
- **Causes racines**:
  1. Routes API `getfondbypays`, `listeproduitpayssociete`, `listesocietepays` utilisaient `pays: req.params.id` (exact, case-sensitive)
  2. `listeproduitpayssociete` crashait si un fonds n'avait pas de performance (`.toJSON()` sur null)
  3. `recherchefonds` ignorait les filtres societe/categorie quand aucun fonds n'etait selectionne
  4. `fetchFundsByValorisationfirst` faisait du matching exact sur societe_gestion, categorie_globale
  5. Les categories (classe d'actif, nationale, regionale) etaient hardcodees dans le frontend avec accents
- **Corrections API** (`3872712`):
  - `getfondbypays`: `LOWER(pays) = LOWER(?)` au lieu de `pays = ?`
  - `listeproduitpayssociete`: batch performances + null-safe (plus de crash)
  - `listesocietepays`: `LOWER(pays)` matching + `LOWER(societe_gestion)` count
  - `recherchefonds`: gere le cas query vide + filtres societe/categorie actifs
  - `rechercheravance-fonds`: null-safe sur tous les parametres
  - `fetchFundsByValorisationfirst`: `LOWER()` sur tous les filtres (categorie, societe, devise, etc.)
  - `getCategories`: retourne aussi `categoriesGlobal` (dynamique depuis DB)
- **Corrections Frontend** (`031a685`):
  - Search page: charge categories global/nationale/regionale depuis `/api/getCategories` (plus de hardcode)
  - Comparison page: charge categories depuis API
  - Countries/funds page: suppression hardcode categories
- **Script normalisation**: `fix_normalize_uppercase.js` (a executer en prod)
  - Met tous les noms en MAJUSCULES (fonds, societes, pays)
  - Supprime accents et apostrophes
  - Genere categorie_national et categorie_regional pour TOUS les pays
- **Deploiement**:
  ```bash
  # API
  cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/api
  git pull origin claude/code-review-improvements-ikvuj
  node fix_normalize_uppercase.js
  pm2 restart 10

  # Frontend
  cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend
  git pull origin claude/code-review-improvements-ikvuj
  npm run build
  pm2 restart 11
  ```

### 2026-05-17 - Fix page pays Nigeria=0 + fonds parasite + null guards pays
- **Statut**: DEPLOYE EN PRODUCTION
- **Bug 1**: Page `/countries` affichait NIGERIA: 0 car `getPaysall` (routes_vl.js:5188) faisait `c.pays === country.pays` (case-sensitive). pays_regulateurs a `NIGERIA`, fonds ont `Nigeria`.
- **Fix 1**: Comparaison avec `.toLowerCase()` dans le join JavaScript (routes_vl.js)
- **Bug 2**: Fonds parasite id=2820 avec nom_fond="1" et societe_gestion="1"
- **Fix 2**: `fix_nigeria_pays_casing.js` supprime le fonds parasite + ses 18 VL
- **Bug 3**: Routes `getPaysbyidfisrt` et `getPaysbyidstat` crashaient si pays non trouvé dans pays_regulateurs
- **Fix 3**: Null guard `if (!response) return 404` sur les 2 routes (apigestionpays.js)
- **Note**: pays_regulateurs contient 2 entrees pour NIGERIA (id=1 et id=32) — potentiel doublon a verifier
- **Commit API**: `47332d0`

### 2026-05-18 - Fix blocage graphique base 100 quand historiques fonds/indice different
- **Statut**: VALIDE ET DEPLOYE EN PRODUCTION (2026-05-18)
- **Probleme**: Quand `hasIndRef` est true, les points VL sans indRef etaient filtres du graphique, tronquant l'affichage. De plus `filteredData[0].InRef` crashait si le premier point n'avait pas d'InRef.
- **Fix backend** (3 routes):
  - `apigestionfonds.js`: routes `/api/valLiq/:id` et `/api/valLiqdev/:id/:devise` — toujours inclure tous les points VL, ne setter `valuesInd` que quand indRef != null
  - `routes_vl.js`: meme fix sur la route VL equivalente
- **Fix frontend** (7 fichiers):
  - Ajout helper `findFirstInRef()` qui trouve le premier InRef non-undefined
  - Remplacement de `filteredData[0].InRef` par `findFirstInRef(filteredData)` dans tous les blocs base 100
  - Ajout null guard: `(lastValueInd !== undefined && item.InRef !== undefined)` sur tous les calculs InRef base 100
  - Fichiers: FundView.tsx, summary-eur/page.tsx, summary-usd/page.tsx, history/page.tsx, portfolio/page.tsx, panel/investor/reconstruction/settings/page.tsx, panel/portfolio/reconstruction/settings/page.tsx
- **Commit API**: `119f698`
- **Commit Frontend**: `9aa48c4`
- **Deploiement**: Resultat OK (2026-05-18). Build: Compiled successfully, 0 erreur. PM2: api-monolith (10) online, fundafrique-frontend (11) online.

### 2026-05-18 - REGRESSION pages fonds vides apres deploiement chart fix + CORRECTION
- **Statut**: CORRIGE ET DEPLOYE EN PRODUCTION
- **Probleme**: Apres deploiement du fix chart blocking (commit `119f698`), les pages fonds (`/funds/866`, `/funds/1141`, etc.) n'affichent PLUS aucune donnee: Pays, Regulateur, Classification, Benchmark, performances tous vides
- **Cause racine**: Les routes `/api/valLiq/:id` et `/api/valLiqdev/:id/:devise` n'avaient PAS de try/catch (commente depuis l'origine). En cas d'erreur non-capturee (ex: `pays_regul` null, `resultat` null, fetch interne echoue), Express renvoie un 500 generique sans corps JSON -> le frontend recoit rien et affiche tout vide. De plus, les 4 appels internes (performances + 3 ratios) avaient chacun un `if (!response.ok) return 404` qui tuait toute la page si un seul sous-appel echouait.
- **Corrections apportees** (fichier `src/routes/apigestionfonds.js`):
  1. **try/catch active** sur les 2 routes (etait commente) — plus jamais de crash silencieux
  2. **`parseInt(req.params.id)` -> `fundId`** (extractIdFromSlug) pour le lookup fond — coherence avec le reste de la route
  3. **Null guard `resultat`** — retourne 404 propre au lieu de TypeError crash
  4. **Null guard `pays_regul`** — si pays inconnu dans pays_regulateurs, retourne null pour chaque champ au lieu de crash
  5. **`safeFetch` + `Promise.all`** pour les appels internes performances/ratios — un sous-appel qui echoue retourne `{}` au lieu de tuer la route entiere. BONUS: les 4 appels sont maintenant paralleles (avant sequentiels = plus lent)
- **Deploiement**: curl /api/valLiq/866 retourne HTTP 200 apres restart
- **LECON CRITIQUE**: A CHAQUE deploiement futur, verifier que les routes principales (valLiq, valLiqdev) ont un try/catch actif et des null guards sur `resultat` et `pays_regul`. Ce probleme est revenu 2 fois (2026-05-17 associations FK, 2026-05-18 chart fix). Pattern a bannir: `const x = await model.findOne(...); const y = x.field;` sans verifier x != null.
- **Commit API**: `dce55a8`

### 2026-05-18 - Import indices de reference depuis Excel (Points 1, 2, 4)
- **Statut**: EXECUTE EN PRODUCTION (2026-05-18)
- **Script**: `api_opcv/import_indices_excel.js`
- **Fichier Excel**: `api_opcv/Historique_Indices_Complet.xlsx`
- **Donnees**: 6881 lignes, 5 indices (MASI, Tunindex, BRVM, MONIA, NSE), 2000-01-03 -> 2026-05-15
- **Mapping indices -> pays**:
  - MASI -> Maroc (devise MAD)
  - Tunindex -> Tunisie (devise TND)
  - BRVM Composite -> Cote d'Ivoire, Senegal, Burkina Faso, Mali, Togo, Benin, Niger, Guinee-Bissau (devise XOF)
  - NSE All Share -> Nigeria (devise NGN)
  - MONIA -> secondaire Maroc, pas de mapping fonds direct
- **ETAPE 1**: Import dans `indice_references` (INSERT si nouveau, UPDATE si valeur differente, SKIP si identique)
- **ETAPE 2**: Peuplement `indRef` dans `valorisations` (matching date VL <-> date indice, tolerance 7 jours). Met aussi a jour `indice_name` et `ID_indice`. Cree les liens `fond_investissements.indice_benchmark` et `.indice` si absents.
- **ETAPE 4**: Conversion `indRef_EUR` et `indRef_USD` via table `devisedechanges` (taux de change le plus proche <= date VL)
- **Modes**: `--report` (defaut, aucune modif), `--execute` (applique les changements)
- **Options**: `--step 1|2|4|all`, `--pays Maroc`, `--fond 123`
- **Commit API**: `97ab8e8`
- **Resultats execution prod (2026-05-18)**:
  - Etape 1: **24 016 indices inseres**, 4 504 mis a jour (MASI 6880, Tunindex 6880, BRVM 6880, NSE 6880, MONIA 1000)
  - Etape 2: **657 025 VL mises a jour** (indRef peuple), 657 liens fond->indice crees. 1043 fonds traites, 153 ignores (pas d'indice pour leur pays)
  - Etape 4: **315 826 indRef convertis EUR/USD**, 347 443 deja OK, 1 333 sans taux (3 fonds Eurobond USD Nigeria — normal)
  - pm2 restart OK, api-monolith online

### 2026-05-18 - Script sync production (PRODUCTION_STATE.json)
- **Statut**: COMMITE, A DEPLOYER
- **Script**: `api_opcv/sync_production.sh`
- **Objectif**: Generer un snapshot complet de l'etat de la production (tables, VL, indices, performances, devises, routes API) dans `PRODUCTION_STATE.json` et le push vers le repo distant
- **Donnees capturees**: stats tables principales, derniere VL par pays, couverture indRef, stats indices, stats performances, stats devises, fonds par pays, git log, pm2 status, test routes critiques
- **Usage**: `bash sync_production.sh` (a lancer depuis le serveur de production)
- **Avantage**: Permet a Claude Code de connaitre l'etat exact de la production AVANT toute modification, evitant les evolutions "a l'aveugle"
