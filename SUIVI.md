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

### 2026-05-18 - Audit complet plateforme + corrections P0
- **Statut**: DEPLOYE EN PRODUCTION (via deploy_all_fixes.sh, 2026-05-19 00:53)
- **Audit 4 axes**: API routes, frontend SEO, calculs financiers, taches en suspens
- **Corrections API** (commit `c026f0a`):
  1. **18 routes sans try/catch** (14 performance + 4 ratios) — ajout try/catch + 8 null guards fond.findOne()
  2. **Sortino ratio**: taux hardcode -0.00473 remplace par `tauxsr` dynamique (65 occurrences)
  3. **Calmar ratio ranking**: etait trie ascendant (lower=better) -> corrige en descendant (higher=better, 2 occurrences)
  4. **VAR95jour/trackingErrorjour**: etaient ecrases par valeurs mensuelles dans la reponse JSON (16 occurrences corrigees)
- **Corrections Frontend** (commit `15d3f08`):
  1. **Page racine `/`**: etait vide ("Bienvenu") -> redirige vers /home
  2. **robots.ts**: ajout disallow pour 5 panels sensibles (distributor, data-requester, institutional, portfolio, portefeuille) + /api/
  3. **layout.tsx**: ajout og:image (/og-image.png) et twitter card (summary_large_image)
- **Problemes P0 restants** (a traiter cote production):
  - performences_eurs: 6 fonds au lieu de 1174 (table quasi-vide)
  - performences_usds: 5 fonds au lieu de 1174
  - classementfonds_eurs + classementfonds_usds: 0 lignes
  - TSR hardcode 1.42% pour non-Maroc (Sharpe incorrect pour Nigeria/Tunisie/UEMOA)

### 2026-05-18 - Corrections P1: SEO complet + trackingError mensuel + deploiement
- **Statut**: DEPLOYE EN PRODUCTION (via deploy_all_fixes.sh, 2026-05-19 00:53)
- **Corrections API**:
  1. **trackingError mensuel**: nouvelle fonction `calculateTrackingErrormois` avec `calculerVolatilitemois` (sqrt(12)). 13 occurrences corrigees dans apigestionratios.js (utilisaient sqrt(52) au lieu de sqrt(12))
  2. **fix_database_phase2.js**: credentials production corriges (root/vide -> fund_opcvm/66G41zes~)
  3. **sync_production.sh**: route inexistante `/api/lastVl1` remplacee par `/api/getactualite`
  4. **deploy_all_fixes.sh** enrichi: ajout index composite, phase2, performances locales, classement local, sync
  5. **fix_populate_performances_eur_usd.js**: script direct SQL calcul perf EUR+USD (tous fonds)
  6. **cron_daily_eur_usd.sh**: cron quotidien maintenance EUR/USD
- **Corrections Frontend**:
  1. **HelmetProvider supprime** de providers.tsx (non fonctionnel en App Router)
  2. **`<SEO/>` supprime** de 4 pages (home, search, news, contact) + imports structuredData inutilises
  3. **`import Head from next/head` supprime** de 14 fichiers (FundView.tsx + page.tsx)
  4. **6 sous-pages fonds restructurees**: page.tsx split en FundSubView.tsx (client) + page.tsx (server wrapper) + page.server.ts (generateMetadata)
  5. **page.server.ts cree** pour `/news` (metadata statique)
  6. **Build verifie OK** (0 erreur)
- **Commits API**: `db656e3`, `3cd1f79` + `ab74b7f` (scripts deploiement)
- **Commit Frontend**: `db5dddd`

### 2026-05-19 - Deploiement API reussi (rebase divergent branches)
- **Statut**: DEPLOYE EN PRODUCTION (2026-05-19)
- **Probleme**: `git pull` echouait sur le serveur avec "fatal: Need to specify how to reconcile divergent branches" car `sync_production.sh` (cron horaire) avait pousse des commits PRODUCTION_STATE.json depuis le serveur, creant une divergence
- **Fix**: `git pull --rebase origin claude/code-review-improvements-ikvuj`
- **Resultat**: Successfully rebased. PM2 restart api-monolith OK (online)
- **Commits deployes**: `3b44a09` (graph fallback) + `47e2c4c` (limit vl_ajuste)

### 2026-05-19 - Fix regression graphique: points mensuels au lieu de journaliers
- **Statut**: DEPLOYE EN PRODUCTION (2026-05-19)
- **Probleme**: Le graphique "Courbe de tous les fonds" n'affichait que quelques points mensuels au lieu de tous les points journaliers
- **Cause racine 1 (API)**: La route `/api/valLiq/:id` utilisait `data.vl_ajuste` quand le fonds avait un indRef, mais `vl_ajuste` etait NULL pour de nombreux enregistrements (fonds pas recalcules apres import). Highcharts sautait les valeurs NULL, ne laissant que quelques points.
- **Fix API**: Ajout fallback `data.vl_ajuste ?? data.value` dans `valLiq` et `valLiqdev` (apigestionfonds.js lignes 387 et 617)
- **Cause racine 2 (Frontend)**: Highcharts utilisait `type: 'category'` avec des labels formaties en `{ month: 'long', year: 'numeric' }`, compressant visuellement les dates journalieres en labels mensuels
- **Fix Frontend**: Passage en `type: 'datetime'` avec donnees `[timestamp, value]` au lieu de `[index, value]` + categories
- **Fichiers modifies**: 5 fichiers frontend (FundView.tsx + 4 FundSubView.tsx) + 1 fichier API (apigestionfonds.js)
- **Build**: OK (0 erreur)
- **Commit API**: `3b44a09`
- **Commit Frontend**: `e468376`

### 2026-05-20 - Creation CLAUDE.md — regles permanentes du projet
- **Statut**: COMMITE ET POUSSE (2026-05-20)
- **Objectif**: Garantir la continuite, la coherence et la qualite de toutes les interventions, meme en cas de reprise de session
- **Fichiers crees**:
  - `api_opcv/CLAUDE.md` — regles permanentes pour le depot API
  - `front_end_opcvm/CLAUDE.md` — regles permanentes pour le depot Frontend
- **Contenu**:
  - Role permanent : expert financier OPCVM + expert developpeur full-stack
  - Regle absolue zero regression
  - SUIVI.md comme fichier de suivi unique (pas de SUIVI_PROJET.md)
  - Checklist avant toute modification (14 points dont verification en production)
  - Regles metier OPCVM (categories, devises, conversions, benchmarks)
  - Conversion devise : DIVISION par le taux (jamais multiplication)
  - Architecture technique (fichiers cles, scripts, crons, panels)
  - Securite (pas de secrets dans les commits)
  - Documentation obligatoire apres chaque intervention
- **CLAUDE.md est lu automatiquement par Claude Code a chaque reprise de session**
- **Regle ajoutee (2026-05-20)** : les deux CLAUDE.md imposent desormais comme premiere action obligatoire de relire CLAUDE.md (api_opcv + front_end_opcvm) et SUIVI.md avant toute intervention, a chaque reprise de session ou nouvelle tache
- **Regle ajoutee (2026-05-20)** : gouvernance documentaire — SUIVI.md seul fichier a mettre a jour systematiquement ; CLAUDE.md/README_DEV.md/ROADMAP.md/CODE_REVIEW.md/CHANGELOG.md uniquement quand leur perimetre specifique change ; pas de dispersion d'information entre fichiers
- **Impact**: aucun code applicatif, aucune route API, aucune table modifies

### 2026-05-20 - Deploiement frontend Series 2 fix + verification complete
- **Statut**: DEPLOYE EN PRODUCTION (2026-05-20)
- **Frontend deploye**: commit `7475e5f` (gouvernance + fix Series 2 label)
- **Build**: 0 erreur, 217/217 pages, PM2 fundafrique-frontend online
- **Conflit stash resolu**: ancien stash en conflit -> `git reset --hard HEAD && git stash drop`
- **Verification production API**:
  - Fonds 1131 EUR: libelle_indice="MASI", indice_benchmark="MASI" (OK)
  - Fonds 1131 USD: idem (OK)
  - Fonds 1141 Nigeria: libelle_indice="NSE All Share" (OK)
  - Fonds 2682 CEMAC: libelle_indice=null (normal, pas de benchmark CEMAC)
- **Forex 21 paires**: toutes presentes et a jour (GHS/KES/ZAR/EGP/NAD incluses), cron quotidien actif
- **Scripts crees**: `fix_categories_remaining.js` (combler categorie_national/libelle), `fix_populate_rendements.js` (peupler table rendements)
- **Impact**: aucune regression, tous les graphiques EUR/USD affichent le nom du benchmark

### 2026-06-05 - T21: Fix ratiosnewdev + null-safety frontend
- **Statut**: COMMITE ET POUSSE, A DEPLOYER
- **Probleme API**: `/api/ratiosnewdev` et `/api/ratiosnewdevwithdate` avaient 5 bugs:
  1. TSR hardcode `-0.0234` au lieu de TSR dynamique par pays (Nigeria 27.5%, Tunisie 8%, etc.)
  2. Requete TSR hardcodee `pays: "Nigeria"` au lieu du pays reel du fonds
  3. Sort `DESC` au lieu de `ASC` (incoherent avec ratiosnew qui fonctionne)
  4. Pas de early return si aucune VL trouvee (request hang indefiniment)
  5. Pas de weekday gap filling (donnees incompletes pour calculs volatilite)
- **Fix API**: Les deux routes corrigees identiquement a ratiosnew:
  - Ajout `fond.findOne()` pour recuperer `paysFond`
  - TSR via `tsrhistos(date, year, paysFond)` + `TSR_DEFAULTS` fallback
  - Sort ASC + early return 404 + weekday gap filling + indRef gap filling
- **Probleme Frontend**: null-safety manquante sur pages countries et fund-managers
- **Fix Frontend**: `?.` sur societeData, guard sumActifNet pour numberFormat, safe `.map()` avec `|| []`
- **Fichiers API**: `src/routes/apigestionratios.js` (152 insertions, 87 deletions)
- **Fichiers Frontend**: 4 fichiers (countries/[paysId]/FundView.tsx, countries/funds/[fondId]/FundView.tsx, fund-managers/[fondId]/FundView.tsx, fund-managers/funds/[fondId]/FundView.tsx)
- **Build**: OK (217/217 pages, 0 erreur), syntax API OK
- **Commit API**: `b63e355`
- **Commit Frontend**: `5f5c63a`

### 2026-06-05 - T22: Try/catch error handling sur 20 routes API + 2 helpers
- **Statut**: COMMITE ET POUSSE, A DEPLOYER
- **Probleme**: 20 routes API + 2 fonctions helper sans try/catch pouvaient crash ou hang en production
- **Fix**: Wrapping try/catch avec console.error + res.status(500).json()
- **apigestionpays.js**: 3 routes + helper `findCategoryByFundId`
- **apigestionsociete.js**: 1 route + helper `findCategoryByFundId`
- **apigestionfonds.js**: 1 route (`POST /api/listeopcvm`)
- **apigestionsavequotidien.js**: 1 route (`GET /api/savevlmanquante`)
- **routes_vl.js**: 12 routes (tsr, doc, getportefeuille, assignportefeuille, valLiqportefeuillewithindice, performancesportefeuillewithindice, calculatePerformance, searchFundsreconstitution, ratiosportefeuille, ratiosportefeuilledev)
- **Fix special**: `/api/tsr/:year` n'envoyait aucune reponse et faisait `throw` → corrige avec `res.json()` et `res.status(404)`
- **Syntax check**: OK sur tous les fichiers modifies
- **Commits API**: `d386ec6`, `5c3b26b`, `6966852`
- **Risque regression**: NUL (ajout de catch uniquement, aucune logique modifiee)

### 2026-06-05 - T23: Null-safety frontend + response.ok guards
- **Statut**: COMMITE ET POUSSE, A DEPLOYER
- **Probleme**: Crash potentiels sur .map(), .length, excelData[0], et fetch sans response.ok
- **Fix 1 — Null-safety** (10 fichiers):
  - `funds/[fondId]/FundView.tsx`: guard .map() sur funds, graphs, adaptValues1, meilleursFonds + guard excelData[0]
  - `funds/summary-eur/summary-usd/portfolio/download-nav FundSubView.tsx`: guard excelData[0]
  - `country-panel + panel detail pages`: guard dates.length
- **Fix 2 — Response.ok** (3 fichiers):
  - `tools/comparison/page.tsx`: 3 fetch guards
  - `tools/search/page.tsx`: 4 fetch guards
  - `funds/search/FundView.tsx`: fetch guard + safe .map()
- **Build**: OK (217 pages, 0 erreurs)
- **Commits Frontend**: `55b1442`, `bf5a8b9`
- **Risque regression**: NUL (ajout de guards, aucune logique modifiee)

### 2026-06-05 - T24: Tests unitaires additifs API (6 fichiers, 71 nouveaux tests)
- **Statut**: COMMITE ET POUSSE
- **Objectif**: Augmenter la couverture de tests des fonctions utilitaires pures
- **Fichiers crees**:
  - `tests/slug.test.js`: 12 tests (generateSlug, generateFundSlug, extractIdFromSlug)
  - `tests/dates.test.js`: 12 tests (date finding + grouping functions)
  - `tests/performances.test.js`: 17 tests (calculatePerformance, annualized variants)
  - `tests/newratios2.test.js`: 11 tests (calculateMaxDrawdown, calculateCovariance, calculateVariance)
  - `tests/utils.test.js`: 12 tests (rendements, groupers, grouperTauxParSemaine)
  - `tests/delai_Beta.test.js`: 7 tests (recouvrement, beta, betaHaussier, betaBaissier)
- **Suite complete**: 125 tests, 9 suites, 100% pass (etait 54 tests / 3 suites avant T24)
- **Commits API**: `ff81ae6`, `f91d53d`, `771434e`, `a516ee2`
- **Risque regression**: NUL (ajout de tests uniquement)

### 2026-06-05 - CODE_REVIEW.md mise a jour complete
- **Statut**: COMMITE ET POUSSE
- **Entree #35**: Routes API sans try/catch — CORRIGE (T22)
- **Entree #36**: Null-safety frontend + response.ok — CORRIGE (T23)
- **Entree #4 MAJ**: Tests automatises partiellement corrige (125 tests API)
- **Entree #28 MAJ**: Audit duplication panels (10,000-14,000 lignes, admin/management/country-panel)
- **Entree #37**: newratios2.js inconsistance format input portfolio vs benchmark
- **Entree #38**: ratioInfo.js code incomplet non fonctionnel
- **Entree #39**: Cron monitoring sans alerting (email/Slack)
- **Entree #40**: fix-brvm-nginx.py script fantome dans crontab
- **Commits Frontend**: `5fdcf39`, `063b2d6`

### 2026-06-05 - T25: Fix securite middleware — panels portfolio/portefeuille non proteges
- **Statut**: COMMITE ET POUSSE, A DEPLOYER
- **Probleme**: `/panel/portfolio/*` et `/panel/portefeuille/*` n'etaient pas dans le panelConfig du middleware Next.js → acces sans authentification aux pages dashboard, favorites, selected-funds, reconstruction
- **Fix**: Ajout des 2 paths dans panelConfig avec allowedTypes: [1] (investor)
- **Fichier**: `src/middleware.ts`
- **Build**: OK
- **Commit Frontend**: `71b791b`
- **Risque regression**: FAIBLE (additive, n'affecte pas les autres panels)

### 2026-06-05 - T26: Security headers frontend
- **Statut**: COMMITE ET POUSSE, A DEPLOYER
- **Ajout**: Headers securite dans next.config.js (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- **Fichier**: `next.config.js`
- **Build**: OK
- **Commit Frontend**: `9e0d4b8`
- **Risque regression**: NUL (headers HTTP additifs uniquement)

### 2026-06-11 - T30: Fix newratios2.js + response.ok guards (15 pages publiques)
- **Statut**: COMMITE ET POUSSE, A DEPLOYER
- **T30 API**: Fix asymmetrie format input dans newratios2.js (CODE_REVIEW #37)
  - 6 fonctions (Beta, TrackingError, IR, UpCapture, DownCapture, DownsideBeta) utilisaient `selectDataForPeriod()` pour benchmark au lieu de `calculateRendementsForPeriod()`
  - Note: newratios2.js est du code mort (pas importe en production, newratios.js est utilise)
  - Commit API: `eed7d88`
- **T30b Frontend**: Ajout response.ok guards sur 15 pages publiques (CODE_REVIEW #26 partiel)
  - searchFunds(): 12 fichiers (countries, fund-managers, funds/*)
  - Fetch POST listeproduitpayssociete/listeproduitsociete: 3 fichiers
  - Fetch GET comparaison: 1 fichier
  - Commit Frontend: `7616fce`
- **Tests**: 199/199 pass (API), Build frontend OK (0 erreurs)
- **Risque regression**: NUL (ajout de guards uniquement, aucune logique modifiee)

### 2026-06-12 - T30c: Fix dates hardcodees dans 3 fichiers API
- **Statut**: COMMITE ET POUSSE, A DEPLOYER
- **Fichiers**: apigestionrendement.js, routes_vl.js, apigestionsavequotidien.js
- apigestionrendement.js: `calculatejourReturns` utilisait plage fixe ['2023-01-01','2023-12-31'] → fenetre dynamique 2 ans + suppression limit:500
- routes_vl.js:4811: route `/api/performancesportefeuillewithindice/fond/:id/:categorie/:date` ignorait param `:date`, utilisait "2024-03-22" → `req.params.date`
- apigestionsavequotidien.js:1452: `processFund` utilisait `[Op.gt]: '2023-12-31'` → fenetre dynamique 2 ans
- Commit API: `3f408bc`
- **Tests**: 199/199 pass, syntaxe OK
- **Risque regression**: FAIBLE (les routes produisent maintenant des resultats corrects au lieu de donnees obsoletes/ignorees)

### 2026-06-12 - T30d: Ajout response.ok guards sur 26 pages panel
- **Statut**: COMMITE ET POUSSE, A DEPLOYER
- **Fichiers**: 26 fichiers panel (investor/reconstruction/*, investor/robot-advisor/*, investor/kyc/*, investor/login/*, investor/create, investor/selected-funds, management/chat, management/news, management/pending-funds/details, management/validated-funds/details, admin/pending-funds/details, data-requester/login/*)
- Pattern: toutes les appels `fetch().json()` verifient maintenant `response.ok` avant parsing
- Commit Frontend: `87977a9`
- **Build**: 0 erreurs
- **Risque regression**: NUL (ajout de guards uniquement, aucune logique modifiee)
- **CODE_REVIEW #26**: progression significative (15 pages publiques T30b + 26 pages panel T30d = 41 pages total)

### 2026-06-12 - T35: Module BRVM BOC — VL OPCVM UEMOA (nouveau, additif)
- **Statut**: COMMITE ET POUSSE, A DEPLOYER + INITIALISER EN PRODUCTION
- **Contexte**: UEMOA stale depuis 2025-10-15 (111 fonds actifs, 33 830 VL). Le BOC BRVM quotidien publie les VL officielles (sections QUOTIDIENNES/HEBDOMADAIRES/MENSUELLES).
- **Sources testees**: `bfin.brvm.org/boc/boc_jour.aspx` 200 OK (18 BOC listes), PDF `BOC_YYYYMMDD.pdf` 200 OK. `brvm.org` page VL = 503 anti-bot (source secondaire, non bloquante).
- **Fichiers crees (API)**:
  - `scripts/scraper/brvm_boc_daily.py` — scraper/parseur/importeur (~900 lignes, pdfplumber)
  - `scripts/scraper/requirements_brvm.txt` — requests, pdfplumber, pymysql, rapidfuzz
  - `scripts/cron/cron_brvm_daily.sh` — wrapper cron (meme pattern que Tunisie), NON installe dans crontab
  - `src/routes/apibrvmboc.js` — 4 routes GET lecture seule (/api/brvm/boc/status|imports|unmatched|missing)
- **Fichiers modifies (API)**: `app.js` (+1 ligne enregistrement route), `.gitignore` (+3 lignes data/brvm_boc), `README_DEV.md` (doc module + cron)
- **Tables additives** (CREATE TABLE IF NOT EXISTS par le script, rien d'existant touche): brvm_boc_sources, brvm_boc_navs_raw, brvm_fund_aliases, brvm_import_logs, brvm_missing_navs
- **Garanties zero regression**:
  - Promotion vers `valorisations` UNIQUEMENT si aucune VL existante (fund_id, date) — jamais d'overwrite
  - Conflit VL existante differente → statut CONFLICT en staging, base intacte
  - ND officiels jamais inseres comme valeur (is_nd=1, quality ND_OFFICIAL)
  - Fonds non rapproches → UNMATCHED/AMBIGUOUS, jamais de creation/fusion auto
  - Rapprochement: alias → exact normalise → fuzzy rapidfuzz (>=93 auto, 85-93 ambigu)
  - VL date future, negative, variation >50% → rejetees/signalees, pas promues
  - Date VL reelle conservee (nav_date ≠ boc_date), traçabilite PDF→ligne brute→base
- **Tests**: selftest OK; dry-run sur BOC 2026-06-10 et 2026-06-04: 115 lignes extraites chacun, 2 echecs residuels (artefacts PDF auditables), 98,3% exploitees; jest 199/199; node -c OK
- **Modes**: --latest, --date, --start-date/--end-date (backfill avec reprise+throttle+limit), --repair-missing [--apply], --dry-run (defaut)/--production, --no-promote, --force, --selftest
- **A faire en production**: installer deps Python, dry-run latest, production latest, backfill 2025-10→2026-06, puis installer cron 19h30 (commandes dans POINT DE REPRISE)

### 2026-06-05 - Diagnostics et audits
- **B6 (244 VL Nigeria extremes)**: NON ACTIF — ces VL ont ete rejetees a l'import, jamais inserees en base
- **TUNISIE EUR/USD gap 24%**: BLOQUE — en attente fichier VL corrigees avec dividendes (utilisateur)
- **UEMOA donnees stales 233j**: BLOQUE — pas de scraper BRVM automatise, import manual uniquement (import_vl_uemoa.js). En attente fichiers Excel et script Python d'Eric
- **fix-brvm-nginx.py**: FANTOME — script documente dans crontab mais fichier inexistant
- **Cron health check audit**: Script check_cron_health.js fonctionne (data freshness, classements, forex, performances, logs) mais MANQUE: email/Slack alerting, API health checks HTTP, PM2 monitoring, disk space, log rotation

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
- [x] Script: `fix_static_data.js` cree et execute en prod (2026-05-20)
- [x] Peupler `structure_fond` — 7 FCPE mis a jour, 95.1% couverture (59 restants = fonds sans prefixe clair)
- [x] Peupler `categorie_globale` — **100%** deja rempli
- [x] Peupler `date_premiere_vl` + `montant_premier_vl` — 99.7%/99.9% deja rempli
- [x] Peupler `periodicite` — 99.9% deja rempli
- [x] Peupler `datejour` — 5 fonds rafraichis
- [x] Peupler `montant_actif_net` — **919 fonds mis a jour** (77.5% couverture, 269 sans actif_net en base)
- [x] Peupler `categorie_national` — DEJA 100% (diagnostic fix_categories_remaining.js: 0 lacune sur 1196 fonds)
- [x] Peupler `categorie_libelle` — DEJA 100% (idem, scripts anterieurs avaient deja tout comble)
- [ ] Corriger `periodicite` (detecter depuis frequence reelle des VL: quotidien, hebdomadaire, mensuel)

#### 2C. Forex manquant
- [x] Importer EUR/NGN et USD/NGN (script import_forex_historique.js cree, a executer)
- [x] Importer EUR/XOF, USD/XOF, EUR/MAD, USD/MAD, EUR/TND, USD/TND, EUR/USD (script pret)
- [x] Generer paires croisees manquantes (GHS/USD, KES/USD, ZAR/USD, EGP/USD) — FAIT (scrape_forex_import.js execute, 21 paires en base, cron quotidien actif)
- [x] Scraping automatique des taux de change — FAIT (scrape_forex_import.js dans cron_daily_update.sh, Yahoo Finance + FRED)

#### 2D. Calculs batch (tables vides)
- [x] Remplir `performences` pour TOUS les pays — 57 932 lignes / 1 186 fonds (deploiement 2026-05-19, avec corrections Sortino/Calmar/VAR)
- [x] Remplir `performences_eurs` — 1 951 lignes / 1 185 fonds (2026-05-19)
- [x] Remplir `performences_usds` — 2 184 lignes / 1 185 fonds (2026-05-19)
- [x] Remplir `classementfonds` — 2 358 lignes / 1 179 fonds (classement local par categorie_nationale, 2026-05-19)
- [x] Remplir `classementfonds_eurs` — 2 370 lignes / 1 185 fonds (2026-05-19)
- [x] Remplir `classementfonds_usds` — 2 370 lignes / 1 185 fonds (2026-05-19)
- [x] Remplir `rendements` — **1 092 534 rendements / 1 185 fonds** (2026-05-20). 3 devises (locale, EUR, USD). 692 969 rendements journaliers par devise. Calcul sur vl_ajuste (Total Return NAV). 0 erreurs.
- [ ] Remplir `portefeuille_base100s` — peuple a la demande via cumulvl() quand un investisseur cree un portefeuille (pas de batch necessaire)

#### 2E. Taux sans risque (TSR)
- [x] Code: tsrhistos() supporte maintenant un parametre pays (filtre DB par pays) — plus de hardcode "Maroc"
- [x] Code: TSR_DEFAULTS fallback per-country si tsrhisto vide (Nigeria 27.5%, Tunisie 8%, UEMOA 3.5%, CEMAC 5%, Maroc 2.75%)
- [x] Script: fix_tsr_per_country.js execute en prod — 548 entrees inserees (2026-05-19)
- [x] Recalcul performances avec TSR reels: 1185 fonds, 0 erreurs (2026-05-19)
- [x] TSR Maroc: deja present (MONIA, 1111 entrees + 6080 sans indice)

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

#### 2I. Graphique EUR/USD — spike base 100 (fix valLiqdev)
- [x] Code v1: filtrer VL avec value_EUR/USD=0 dans valLiqdev — DEPLOYE
- [x] Code v2: calcul base 100 cote API — DEPLOYE (commit `c4217e1`)
- [x] Code v3: aligner base 100 indRef sur la date du premier VL valide — COMMITE (commit `9d8e839`)
- [x] Code v4: utiliser indRef local (workaround temporaire) — DEPLOYE (commit `d182c1a`)
- [x] **DIAGNOSTIC ROOT CAUSE**: `routes_vl.js` MULTIPLIAIT par le taux de change au lieu de DIVISER
  - `routes_vl.js` ligne 6517: `indRef_EUR = indRef * EUR/MAD` (10.7) -> resultat x10 trop grand
  - `recalc_eur_usd_daily_rate.js`: corrigeait `value/vl_ajuste/actif_net/dividende` (division) mais PAS `indRef`
  - Coherence verifiee: value_MAD=2207, lastValue_EUR=206.33, ratio=10.70 (correct car recalc ecrase)
- [x] Code v5 (FIX DEFINITIF) — commit `c76075d`, DEPLOYE ET VERIFIE EN PRODUCTION (2026-05-20):
  - `routes_vl.js`: 10 occurrences `*` -> `/` (value, dividende, actif_net, indRef) x EUR/USD
  - `recalc_eur_usd_daily_rate.js`: ajout recalcul `indRef_EUR = indRef / eurRate`, `indRef_USD = indRef / usdRate`
  - `apigestionfonds.js`: retour a `indRef_EUR`/`indRef_USD` (corrects apres recalcul)
  - **Approche financierement correcte**: comparaison fonds EUR vs benchmark EUR dans la meme devise
- [x] **RECALCUL EXECUTE**: `node recalc_eur_usd_daily_rate.js` — 1188 fonds, 694157 VL, 0 erreurs
- [x] **VERIFIE EN PRODUCTION**: fonds 1131 EUR indRef passe de 793643 (corrompu) a 202.7 (correct)
  - EUR: fonds=233.0, indRef=202.7 (fonds surperforme, effet devise MAD/EUR capture)
  - USD: fonds=220.6, indRef=191.8 (idem en USD)
  - Local: fonds=222.7, indRef=193.8 (coherent, ecarts expliques par evolution taux de change)
- [x] Label "Series 2" corrige — commit API `58b52ba`, commit Frontend `7d33f64`, DEPLOYE EN PRODUCTION (2026-05-20)
  - **Cause racine API**: `valLiqdev` prenait `libelle_indice = indice_name` de la derniere VL (null) et ne chargeait ni `indice_benchmark` ni `indice` dans `fond.findOne()`
  - **Fix API**: `.find(v => v)` pour prendre la premiere VL avec indice_name renseigne + ajout `indice_benchmark`/`indice` dans attributs et reponse
  - **Fix Frontend**: fallback `libelle_indice || indice_benchmark || ID_indice || 'Indice de reference'` sur les 3 pages (locale, EUR, USD)
  - **Build**: OK (0 erreur)
  - Meme fix applique a la route locale `valLiq` (meme probleme potentiel)

#### 2J. Crons — corrections ordonnancement et completude
- [x] `cron_daily_update.sh`: enrichi 5->9 etapes — DEPLOYE sur serveur
- [x] `cron_daily_eur_usd.sh`: schedule corrige 6h30->21h30 — APPLIQUE dans crontab
- [x] Crontab verifie sur serveur: 5 crons actifs, tous corrects
- [ ] Ajouter monitoring: alerte si un cron echoue (email ou fichier sentinel)
- **Crons actifs sur serveur (verifie 2026-05-20)**:
  - `0 20 * * 1-5` — cron_daily_update.sh (9 etapes: ASFIM+forex+EUR/USD rates+vl_ajuste+perf local+EUR/USD+classements)
  - `30 21 * * *` — cron_daily_eur_usd.sh (perf EUR/USD + classements EUR/USD)
  - `0 10 * * 1` — cron_nigeria_weekly.sh (SEC Nigeria + import + recalc)
  - `0 * * * *` — sync_production.sh (snapshot horaire)
  - `*/5 * * * *` — fix-brvm-nginx.py (fix Nginx BRVM)

#### 2H. Limite 500 VL sur page fond (date decalee)
- [x] Route `/api/valLiq/:id` et `/api/valLiqdev/:id/:devise` limitees a 500 VL -> augmente a 10000 (2026-05-17)
- [x] Fonds avec >500 VL: graphique et perf tronques -> corrige (limit 10000 dans 5 fichiers routes, 33 occurrences)
- [x] Exemple: AFRICAPITAL CASH PLUS montre VL jusqu'en 2021 alors que les donnees vont a 2026 -> corrige
- [x] Solution appliquee: augmentation LIMIT 500 -> 10000 dans toutes les routes API

### PHASE 3 - Integrite structurelle
**Priorite: MOYENNE**

- [ ] Ajouter contraintes FK reelles MySQL (societe_id -> societes.id, fund_id -> fond_investissements.id)
- [ ] Optimiser table classementfonds: 30+ colonnes de ranking -> table pivot
- [x] Ajouter index composite valorisations(fund_id, date) — inclus dans deploy_all_fixes.sh
- [ ] Nettoyer tables inutilisees ou orphelines

### Tunisie: reimport VL CMF V1.8.3 avec dividendes
**Priorite: EN COURS**
- [x] Telecharger fichiers VL Tunisie CMF V1.8.3 depuis Google Drive (gdown, 543 Mo)
- [x] Analyser structure: 203 fonds, 347 090 VL (2011-05-25 → 2026-05-18), 1 055 dividendes
- [x] Analyser referentiel: 127 fonds actifs (derniere VL >= 2026), 76 fonds historiques fermes
- [x] Matching fonds CMF → production: 122 matches (exact/partial), 81 non-matches
- [x] Creer script import: `scripts/import/import_vl_tunisie_cmf.js` — commit `c024913`
- [ ] Deployer et executer sur production (pull + copie CSV + dry-run + execute)
- [ ] Recalculer vl_ajuste pour Tunisie apres reimport
- [ ] Recalculer EUR/USD pour Tunisie
- [ ] Re-peupler performances + classements Tunisie
- [ ] Re-peupler rendements Tunisie
- **Donnees source**: CMF Tunisie export final V1.8.3 (2026-05-19)
  - VL_MASTER: 347 090 VL, 203 fonds, CSV UTF-8-SIG separateur point-virgule
  - DIVIDENDES: 1 055 dividendes (1 025 avec dates valides, 30 sans date), 122 fonds
  - REFERENTIEL: 203 fonds avec metadata (SGP, categorie, periodicite, ISIN, affectation)
  - 29 VL extremes exclues (conservees en audit)
  - Categories: ACTIONS 111, OBLIGATIONS 66, DIVERSIFIE 26
  - Periodicite: QUOTIDIENNE 126, HEBDOMADAIRE 77
  - 127 fonds actifs (derniere VL >= 2026), 76 fonds historiques fermes
- **Production actuelle**: 124 fonds Tunisie, VL 2022-01-03 → 2024-07-24 (~648 VL/fonds)
- **Apres import**: 127+ fonds actifs, VL 2011 → 2026-05-18 (~2960 VL/fonds actifs)
- **Script**: `import_vl_tunisie_cmf.js` (TUNISIE_DATA_DIR configurable, dry-run/execute/force)

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
- [x] Fix serialisation JSON (memes bugs que panel investor) — commit `ff4087e`
  - Dashboard: toJsonArrayString + encodeURIComponent pour fundids/funds
  - Selected-funds: safeParseToCSV double-decode
  - 8 sous-pages reconstruction: IIFE double-decode pour selectedfund/selectedValuename

### Anomalies - ameliorations futures
- [ ] Detecter automatiquement les ecarts VL suspects (cron job quotidien)
- [ ] Permettre de marquer une anomalie comme "traitee" depuis le panel
- [ ] Historique des corrections VL
- [ ] Alertes email pour nouvelles anomalies

### Global
- [ ] Verifier aucune regression sur les pages publiques
- [ ] Tests automatises (aucun test unitaire actuellement)
- [ ] Securite: audit des endpoints API (auth, CORS, injection)

---

## PLAN ARCHITECTURE HYBRIDE — Classements dates, workers, ClickHouse, moteur de recalcul

> Decisions techniques validees le 2026-05-21.
> Voir `api_opcv/ARCHITECTURE_DIAGNOSTIC.md` pour le diagnostic complet.
> Regle absolue : zero regression, approche additive, progressive, non destructive.

### PHASE 1 — Stabilisation (priorite HAUTE, prerequis a toutes les phases suivantes)

- [x] **1.1** Endpoint `/health/detailed` — etat DB, tables (counts), derniere VL, dernier classement, ClickHouse status, PM2 — commit `72e8b8d`
- [ ] **1.2** Clarifier wealthtech-api (process PM2 : actif ? utilise ? doublon ?)
- [x] **1.3** Nettoyer imports morts : `require('node-cron')` supprime de package.json + agenda.js supprime — commit `e4d48e0`
- [x] **1.4** Nettoyer agenda.js (configure avec MongoDB au lieu de MySQL, jamais utilise) — supprime dans Phase 2.2
- [ ] **1.5** Completer 11 fonds sans classification (NULL categorie_fundafrica) — script pret, a executer en prod
- [x] **1.6** Monitoring crons : `check_cron_health.js` cree — verifie VL par pays, classement, forex, performances, logs cron
- [ ] **1.7** Securisation ttyd : auth Basic + IP whitelist via Nginx (plan ttyd-agent)

### PHASE 2 — Modularisation du monolithe (priorite HAUTE)

- [x] **2.1** Creer couche service `src/services/` :
  - [x] `ranking.service.js` — logique classement extraite (570 lignes, 6 fonctions calculateRank*) — commit `f692ef9`
  - [x] `performance.service.js` — logique calcul perf (perf, findValueAtDate, calculateAllPerformances) — commit `7c8c330`
  - [x] `forex.service.js` — logique conversion devise (buildRateIndex, getRate, convertToEUR/USD, CFA) — commit `7c8c330`
  - [x] `recalc-event.service.js` — emission et propagation evenements recalc — commit `1ae9ea8`
  - [ ] `vl.service.js` — logique VL/recalcul extraite de routes_vl.js (optionnel)
- [x] **2.2** Reorganiser scripts : 42 scripts deplaces dans `scripts/` (9 sous-dossiers: import/, fix/, recalc/, diag/, cron/, deploy/, seed/, migrations/, monitoring/) — commit `e4d48e0`
- [x] **2.3** Premiers tests unitaires : 22 tests sur ranking.service.js (Jest) — commit `2475852`
- [x] **2.4** Decouper routes_vl.js (11325→10270 lignes) : routes_vl_admin.js (383 lignes) + routes_vl_robotadvisor.js (322 lignes) — commit `d999403`

### PHASE 3 — Workers PM2 (priorite HAUTE)

- [x] **3.1** Creer `worker-recalculation` : process PM2 dedie, consume recalc_jobs (FOR UPDATE SKIP LOCKED), propage dependances — commit `d0ce389`
- [x] **3.2** Creer `worker-data-import` : process PM2 pour imports ASFIM, Nigeria, forex — commit `e3bbb79`
- [x] **3.3** Creer `worker-scheduler` : remplace crontab Linux, 4 taches, desactivees par defaut pour migration parallele — commit `4b68302`
- [x] **3.4** Creer `ttyd-agent` securise — commit `2016e67` :
  - Script menu controle (pas de shell libre) — 15 commandes whitelisted
  - BLOCKED_PATTERNS: rm -rf, DROP, TRUNCATE, DELETE, git push, .env, password
  - Journalisation toutes les actions dans /var/log/ttyd-agent.log
  - Confirmation requise pour operations restart
  - Reste a faire: utilisateur Linux dedie + Nginx auth Basic + IP whitelist (Phase 1.7)
- [x] **3.5** Migrer les 3 crons bash vers worker-scheduler — commit `e7c5407` :
  - scheduler-state.json runtime override (enable/disable sans restart)
  - API admin: GET /api/admin/scheduler/status + POST /api/admin/scheduler/toggle
  - Taches desactivees par defaut pour migration parallele avec crontab

### PHASE 4 — Moteur de recalcul historique (priorite HAUTE)

- [ ] **4.1** Creer tables MySQL (script pret `create_recalc_tables.js --execute`, a deployer en prod) :
  - `recalc_events` (event log metier : VL_INSERT, VL_UPDATE, DIVIDEND, FX_UPDATE, CATEGORY_CHANGE, etc.)
  - `recalc_jobs` (file d'attente : PENDING/RUNNING/COMPLETED/FAILED, priority, fond_id, date_from)
  - `recalc_dependencies` (graphe : VL_AJUSTE→RENDEMENTS→PERF→CLASSEMENTS)
  - `recalc_audit` (audit complet : before/after, triggered_by)
- [x] **4.2** Implementer le graphe de dependances + propagation — commit `1ae9ea8`
- [x] **4.3** Emettre evenements recalc dans 5 routes VL/index API — commit `1ae9ea8`
- [x] **4.4** Deduplication jobs/events + dead-letter handling — commit `fe622e1`
- [x] **4.5** Recalcul incremental (depuis date_from) + FULL_REBUILD + handlers reels — commit `669a18f`
- [x] **4.6-4.8** API admin monitoring (dashboard, retry, trigger, audit, cancel) — commit `b092600`

### PHASE 5 — ClickHouse + Classements historiques date par date (priorite HAUTE)

- [ ] **5.1** Installer ClickHouse sur le serveur de production
- [ ] **5.2** Activer la sync MySQL→ClickHouse existante (clickhouse-sync.js)
- [x] **5.3** Script migration ClickHouse tables (classement_historique + performance_historique) — commit `3fef414`
- [x] **5.4** Table `performance_historique` definie dans le meme script — commit `3fef414`
- [x] **5.5** Script calcul classement date par date (recalc_classement_historique.js) — commit `3fef414`
  - 7 horizons (YTD, 1M, 3M, 6M, 1A, 3A, 5A), 3 types (national, regional, global)
  - Supports LOCAL/EUR/USD, incremental ou full backfill
- [ ] **5.6** Backfill historique : executer `recalc_classement_historique.js --full` (requiert ClickHouse installe)
- [x] **5.7** API routes classement historique — commit `3fef414` :
  - GET /api/analytics/classement-historique/:fondId (classement a une date)
  - GET /api/analytics/classement-historique/:fondId/evolution (evolution dans le temps)
- [x] **5.8** Modifier frontend : afficher la date du classement ("Classement au 20/05/2026")
  - Helper `formatDateFR()` dans `src/lib/utils.ts` (YYYY-MM-DD → DD/MM/YYYY)
  - Applique dans 3 vues: FundView.tsx (local), FundSubView.tsx (EUR), FundSubView.tsx (USD)
  - Fix bug: FundView.tsx type1 national utilisait `lastDate` au lieu de `lastdatepreviousmonth`
  - Fix cosmetic: double espace "Classement  au" → "Classement au"
  - 21 occurrences formatees: Classement, Indicateurs de risque, L'oeil de l'expert, Donnees 3 ans
- [ ] **5.9** Activer les 4 routes analytics ClickHouse existantes (performance, market overview, top rankings, risk)

### PHASE 6 — Services separes (priorite BASSE, seulement si justifie)

- [ ] **6.1** Evaluer si le volume, la performance ou l'equipe justifient des microservices
- [ ] **6.2** Si justifie : auth-service, payment-service, kyc-service, market-data-service, portfolio-service
- [ ] **6.3** Ne PAS creer de microservices tant que le monolithe n'est pas propre et modulaire (Phase 2 terminee)

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
- **Crons actifs**: cron_daily_update.sh (lun-ven 20h), cron_nigeria_weekly.sh (lundi 10h), fix-brvm-nginx.py (toutes les 5 min), sync_production.sh (horaire), cron_daily_eur_usd.sh (6h30 quotidien)
- **Mecanisme vl_ajuste** (NE DOIT JAMAIS ETRE NULL si VL existe):
  - A chaque insertion/modification de VL ou dividende, on recalcule TOUT l'historique du fonds depuis la date modifiee
  - `vl_ajuste = value + cumul_dividendes` (formule cumulative additive sur tout l'historique)
  - Idem pour `vl_ajuste_EUR` et `vl_ajuste_USD`
  - Le recalcul est integre dans les routes `savevl/:id` et `uploadsfilevl/:id` (routes_vl.js)
  - La route `updatewithdividende` recalcule pour tous les fonds "Distribuant"
  - **ATTENTION**: les scripts batch d'import (SQL direct) NE DECLENCHENT PAS ce mecanisme → lancer `recalc_vl_ajuste.js` apres import batch
- **Classement local** = classement dans la meme `categorie_nationale` (ex: "ACTIONS MAROC", "MONETAIRE UEMOA")
- **Classement regional** = classement dans la meme `categorie_regionale` (ex: "OBLIGATIONS AFRIQUE DU NORD", "ACTIONS AFRIQUE DE L'OUEST")
- **Routes classement**: `/api/classementmysql` (local), `/api/classementeur`, `/api/classementusd` — PAS `/api/classement` (n'existe pas)

## Historique des scripts de migration
| Script | Date | Description | Statut |
|--------|------|-------------|--------|
| `diagnostic_db.js` | 2026-05-14 | Audit complet 63 tables, 21 sections | Execute |
| `fix_database_phase1.js` | 2026-05-14 | Orphelins, FK societe_id, activation, VL, forex, statique | Execute en prod |
| `20260514000001-add-societe-id-fk.js` | 2026-05-14 | Migration Sequelize societe_id | Commite |
| `fix_database_phase2.js` | 2026-05-15 | Enrichissement statique 10 etapes | EXECUTE en prod (2026-05-19 via deploy_all_fixes) |
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
| `sync_production.sh` | 2026-05-18 | Snapshot etat prod (DB+routes+git) -> PRODUCTION_STATE.json | Installe en prod (cron horaire) |
| (audit complet + P0 fixes) | 2026-05-18 | try/catch 18 routes, Sortino/Calmar/VAR, SEO racine/robots/og | DEPLOYE en prod (2026-05-19) |
| `fix_populate_performances_eur_usd.js` | 2026-05-18 | Calcul perf EUR+USD direct SQL pour tous les fonds actifs | EXECUTE en prod (2026-05-19, 1185 fonds) |
| `deploy_all_fixes.sh` | 2026-05-18 | Script deploiement complet 9 etapes (pull+build+restart+repopulation) | EXECUTE en prod (2026-05-19 00:53) |
| `cron_daily_eur_usd.sh` | 2026-05-18 | Cron quotidien recalcul performances+classements EUR/USD | INSTALLE en prod (6h30 quotidien) |
| (trackingError mois fix) | 2026-05-18 | calculateTrackingErrormois sqrt(12) au lieu de sqrt(52), 13 occurrences | DEPLOYE en prod (2026-05-19) |
| (SEO complet frontend) | 2026-05-18 | Suppression react-helmet-async/next-head, generateMetadata partout, 33 fichiers | DEPLOYE en prod (2026-05-19) |
| (fix try/catch syntax) | 2026-05-18 | Fix 14 routes apigestionperformance.js .then() closers manquants | DEPLOYE en prod (commit 9751816) |
| (fix MySQL IPv6) | 2026-05-19 | DB_HOST localhost->127.0.0.1 (.env + sequelize.js + config.js + agenda.js) | DEPLOYE en prod (commit f679613) |
| (deploy_all_fixes.sh) | 2026-05-19 | Deploiement complet: perf 1185 fonds + classements + index + phase2 | EXECUTE en prod (00:53-00:55) |
| (classementmysql) | 2026-05-19 | Relance classement local (route corrigee classement->classementmysql) | EXECUTE en prod (2358 lignes, 1179 fonds) |
| (fix graphique datetime) | 2026-05-19 | Highcharts category->datetime + fallback vl_ajuste??value | DEPLOYE en prod (rebase+restart) |
| (fix limit vl_ajuste) | 2026-05-19 | Suppression limit 500/10000 sur recalcul vl_ajuste (3 routes) | DEPLOYE en prod (rebase+restart) |
| (rebase divergent branches) | 2026-05-19 | git pull --rebase pour resoudre divergence sync_production.sh | EXECUTE en prod |
| (TSR par pays) | 2026-05-19 | tsrhistos() filtre par pays + TSR_DEFAULTS fallback + suppression hardcode 1.42% | DEPLOYE en prod |
| `fix_tsr_per_country.js` | 2026-05-19 | Peuple tsrhistos 2015-2026 pour Nigeria/Tunisie/UEMOA/CEMAC (548 entrees) | EXECUTE en prod |
| (recalcul perf TSR) | 2026-05-19 | fix_populate_performances.js --force (1185 fonds, Sharpe/Sortino avec TSR reels) | EXECUTE en prod |
| (fix graph EUR/USD v1) | 2026-05-20 | valLiqdev: filtrer VL value_EUR/USD=0 (spike base100) | DEPLOYE en prod |
| (fix graph EUR/USD v2) | 2026-05-20 | valLiqdev: calcul base 100 cote API (val/firstVal*100) | DEPLOYE en prod |
| (fix cron ordering) | 2026-05-20 | cron_daily_update.sh 9 etapes + cron_eur_usd 6h30->21h30 | DEPLOYE + crontab MAJ |
| `fix_static_data.js` | 2026-05-20 | 7 FCPE + 919 actif_net + 5 datejour (structure/categorie/date/perio/actif) | EXECUTE en prod |
| (Nigeria BINARY casing) | 2026-05-20 | UPDATE WHERE BINARY pays='Nigeria' → 280 tous NIGERIA | EXECUTE en prod |

### 2026-05-19 - Fix MySQL IPv6 connexion refusee (ECONNREFUSED ::1:3306)
- **Statut**: DEPLOYE EN PRODUCTION (2026-05-19 00:53)
- **Probleme**: Apres deploiement du 2026-05-18, `api-monolith` ne demarre plus: `connect ECONNREFUSED ::1:3306`
- **Cause racine**: `.env` avait `DB_HOST=localhost` qui sur le serveur prod resout vers `::1` (IPv6), mais MySQL n'ecoute que sur IPv4 (127.0.0.1). Le probleme existait deja mais etait masque par la connexion Sequelize en cache.
- **Fix**: `DB_HOST=localhost` -> `DB_HOST=127.0.0.1` dans:
  - `.env` (variable d'environnement principale)
  - `src/db/sequelize.js` ligne 54 (fallback default)
  - `src/db/config.js` ligne 8 (dev config fallback)
  - `src/config/agenda.js` ligne 10 (agenda config fallback)
  - `.env.example` (template)
- **Commit API**: `f679613`

### 2026-05-19 - Deploiement complet reussi (deploy_all_fixes.sh)
- **Statut**: DEPLOYE ET EXECUTE EN PRODUCTION (2026-05-19 00:53-00:55)
- **Resultats par etape**:
  1. Pull API + Frontend: OK (fast-forward)
  2. Build Frontend: OK
  3. PM2 restart: OK (api-monolith online, 200MB, routes 200)
  4. Test routes: valLiq/866=200, valLiq/1141=200, getPaysall=200
  5. Index composite valorisations(fund_id,date): cree OK
  5c. fix_database_phase2: execute OK
  6. Perf locale: **1185 fonds** (643 inseres, 542 maj, 0 erreurs) — avec corrections Sortino/Calmar/VAR
  7. Perf EUR: **1185 fonds** (0 erreurs) — Perf USD: **1185 fonds** (0 erreurs)
  8. Classement local: **echoue** initialement (route `/api/classement` n'existe pas, c'est `/api/classementmysql`) — **corrige et relance manuellement: OK**
  8b. Classement EUR: "finishrank" OK — Classement USD: "finishrank" OK
  9. Sync production snapshot: push OK
- **Etat final tables production**:
  - performences: 57 932 lignes / 1 186 fonds
  - performences_eurs: 1 951 lignes / 1 185 fonds
  - performences_usds: 2 184 lignes / 1 185 fonds
  - classementfonds: **2 358 lignes / 1 179 fonds** (apres relance classementmysql)
  - classementfonds_eurs: 2 370 lignes / 1 185 fonds
  - classementfonds_usds: 2 370 lignes / 1 185 fonds
- **Bug deploy script corrige**: `/api/classement` -> `/api/classementmysql` dans deploy_all_fixes.sh
- **6 fonds pays "Nigeria" minuscule**: residuel casing mineur (273 fonds "NIGERIA" OK)

### 2026-05-19 - Deploiement API reussi (rebase divergent branches)
- **Statut**: DEPLOYE EN PRODUCTION (2026-05-19)
- **Probleme**: `git pull` echouait avec "fatal: Need to specify how to reconcile divergent branches" — `sync_production.sh` (cron horaire) avait pousse des commits PRODUCTION_STATE.json depuis le serveur, creant une divergence avec nos commits
- **Fix**: `git pull --rebase origin claude/code-review-improvements-ikvuj`
- **Resultat**: Successfully rebased and updated. PM2 restart api-monolith OK (online, 18.2MB)
- **Commits deployes**: `3b44a09` (graph fallback vl_ajuste??value) + `47e2c4c` (suppression limit 500/10000 vl_ajuste)

### 2026-05-19 - Fix regression graphique: points mensuels au lieu de journaliers
- **Statut**: DEPLOYE EN PRODUCTION (2026-05-19)
- **Probleme**: Le graphique "Courbe de tous les fonds" n'affichait que quelques points mensuels au lieu de tous les points journaliers
- **Cause racine 1 (API)**: La route `/api/valLiq/:id` utilisait `data.vl_ajuste` quand le fonds avait un indRef, mais `vl_ajuste` etait NULL pour de nombreux enregistrements (fonds pas recalcules apres import). Highcharts sautait les valeurs NULL, ne laissant que quelques points.
- **Fix API**: Ajout fallback `data.vl_ajuste ?? data.value` dans `valLiq` et `valLiqdev` (apigestionfonds.js lignes 387 et 617) — garde-fou defensif, car vl_ajuste ne DEVRAIT jamais etre null si le mecanisme de recalcul fonctionne
- **Cause racine 2 (Frontend)**: Highcharts utilisait `type: 'category'` avec des labels formaties en `{ month: 'long', year: 'numeric' }`, compressant visuellement les dates journalieres en labels mensuels
- **Fix Frontend**: Passage en `type: 'datetime'` avec donnees `[timestamp, value]` au lieu de `[index, value]` + categories
- **Fichiers modifies**: 5 fichiers frontend (FundView.tsx + 4 FundSubView.tsx) + 1 fichier API (apigestionfonds.js)
- **Build**: OK (0 erreur)
- **Commit API**: `3b44a09`
- **Commit Frontend**: `e468376`

### 2026-05-19 - Fix mecanisme vl_ajuste: suppression limit 500/10000
- **Statut**: DEPLOYE EN PRODUCTION (2026-05-19)
- **Probleme**: Le recalcul vl_ajuste apres insertion de VL etait bride par des LIMIT:
  - `routes_vl.js` route savevl: `limit: 500` sur le fond.findAll (ne recalculait que 500 VL)
  - `routes_vl.js` route uploadsfilevl: `limit: 500` idem
  - `apigestionsavequotidien.js` route updatewithdividende: `limit: 10000` sur les fonds Distribuant
- **Design attendu (rappel)**: Quand une VL ou un dividende est insere/modifie a n'importe quelle date (meme 2010), le mecanisme doit recalculer TOUT l'historique du fonds depuis cette date:
  - `vl_ajuste` = value + cumul_dividendes (devise locale)
  - `vl_ajuste_EUR` = value_EUR + cumul_dividendes_EUR
  - `vl_ajuste_USD` = value_USD + cumul_dividendes_USD
  - Ceci car chaque vl_ajuste depend de la precedente (formule cumulative additive)
- **Fix**: Suppression des 3 limites (LIMIT 500 et LIMIT 10000)
- **Note**: Les scripts batch d'import (import_vl_maroc.js, cron ASFIM, import_vl_nigeria_sec.js) inserent en SQL direct et ne passent PAS par ces routes API → le recalcul vl_ajuste n'est pas declenche. Il faut lancer recalc_vl_ajuste.js apres ces imports, ou integrer le recalcul dans le cron.
- **Commit API**: `47e2c4c`

### 2026-05-19 - TSR par pays: Sharpe/Sortino avec taux reels au lieu de 1.42% hardcode
- **Statut**: DEPLOYE ET EXECUTE EN PRODUCTION (2026-05-19)
- **Probleme**: Le ratio Sharpe et Sortino utilisaient un TSR hardcode: 1.42% pour tous les pays sauf Maroc. Les vrais taux sont tres differents: Nigeria ~27.5%, Tunisie ~8%, UEMOA ~3.5%, CEMAC ~5%
- **Impact**: Les fonds Nigeria affichaient des Sharpe ratios tres surestime car le taux sans risque reel est ~27.5% (MPR CBN) vs le 1.42% utilise
- **Corrections code** (`apigestionratios.js`):
  1. `tsrhistos(datee, year)` -> `tsrhistos(datee, year, pays)` — ajoute filtre `pays` sur toutes les requetes tsrhisto
  2. Suppression `if (paysFond == "Maroc")` — logique unifiee pour tous les pays
  3. Ajout `TSR_DEFAULTS` avec taux reels par pays en fallback si tsrhisto vide
  4. Ajout try/catch autour de l'appel tsrhistos (plus de crash si donnees absentes)
  5. Suppression du filtre `indice: "MONIA"` hardcode — filtre par `pays` a la place (plus generique)
  6. Ajout fallback pour annee 5/10: si pas de donnees avec `annee: X`, requete sans filtre annee
- **Script**: `fix_tsr_per_country.js` — execute en production:
  - 548 entrees tsrhisto inserees (137 par pays × 4 pays)
  - NIGERIA / MPR: 137 entries [2015-2026], range=[11.5% - 27.5%], avg=16.37%
  - TUNISIE / TMM: 137 entries [2015-2026], range=[4.75% - 8%], avg=6.59%
  - UEMOA / BCEAO: 137 entries [2015-2026], range=[2.5% - 3.5%], avg=2.9%
  - CEMAC / BEAC: 137 entries [2015-2026], range=[2.95% - 5%], avg=3.85%
  - Donnees Maroc existantes: 6080 entries (sans indice) + 1111 MONIA
- **Recalcul performances**: 1185 fonds mis a jour, 0 erreurs (Sharpe/Sortino recalcules avec TSR reels)
- **Commit API**: `36c37dd`
- **Bug residuel**: 6 fonds ont encore pays="Nigeria" (casse mixte) au lieu de "NIGERIA" — la collation MySQL case-insensitive empechait la detection. Fix: `UPDATE ... WHERE BINARY pays = 'Nigeria'`

### 2026-05-20 - Fix graphique EUR/USD base100 spike + crons + donnees statiques
- **Statut**: DEPLOYE ET EXECUTE EN PRODUCTION (2026-05-20)
- **Probleme 1 (graphique)**: Pages `/funds/summary-eur/[fondId]` et `/funds/summary-usd/[fondId]` affichent un graphique avec spike vertical (Y=1,250k au lieu de base 100). Cause: VL avec `value_EUR/USD = 0` (pas de taux forex pour dates anciennes) passaient dans le graphique. Le frontend divise par cette premiere valeur ~0 pour base 100 → explosion a 1,250,000.
- **Fix graphique**: `valLiqdev` route — `if (val === null)` → `if (!val)` (filtre aussi 0, undefined, NaN)
- **Probleme 2 (crons)**: `cron_daily_eur_usd.sh` tournait a 6h30 (AVANT le cron principal 20h). `cron_daily_update.sh` ne faisait pas le recalcul EUR/USD daily rates apres import ASFIM.
- **Fix crons**:
  - `cron_daily_update.sh`: enrichi de 5 a 9 etapes — ajout recalc_eur_usd_daily_rate.js (step 3), perf fonds 1201-3000 (step 7), perf EUR/USD (step 8), classements local+EUR+USD (step 9)
  - `cron_daily_eur_usd.sh`: schedule 6h30 → 21h30 (apres le cron principal)
  - **Crontab mis a jour sur serveur**: verifie `30 21 * * *`
- **Script donnees statiques**: `fix_static_data.js` execute en production:
  - structure_fond: 7 FCPE mis a jour (95.1% couverture)
  - categorie_globale: 100% deja rempli
  - date_premiere_vl: 99.7% deja rempli
  - montant_actif_net: **919 fonds mis a jour** (77.5% couverture)
  - datejour: 5 fonds rafraichis
- **Commit API**: `b43c293`

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

### 2026-05-20 - Deploiement frontend Series 2 fix + verification complete
- **Statut**: DEPLOYE EN PRODUCTION (2026-05-20)
- **Fix**: Label "Series 2" sur graphiques EUR/USD remplace par nom benchmark reel
- **Build**: 0 erreur, 217/217 pages compilees
- **Deploiement**: PM2 restart OK, pages de production verifiees

### 2026-05-20 - Fix fix_populate_rendements.js (bug colonne lastvl)
- **Statut**: CORRIGE, A RE-DEPLOYER ET RE-EXECUTER
- **Probleme**: Le script utilisait la colonne `lastvl` dans l'INSERT, mais cette colonne n'existe PAS dans la table MySQL `rendements` (le modele Sequelize la declare mais la migration n'a jamais ete faite). Resultat: 2714 erreurs, 0 rendements inseres.
- **Cause racine**: Desynchronisation entre le modele Sequelize (`src/models/rendement.js` declare `lastvl: DOUBLE`) et le schema reel de la table MySQL (pas de colonne `lastvl`).
- **Corrections apportees** (fichier `fix_populate_rendements.js`):
  1. Suppression de `lastvl` de la clause INSERT INTO
  2. Suppression de `curr.value` des tuples batch (journalier, hebdomadaire, mensuel)
  3. Placeholders passes de `(?, ?, ?, ?, ?, ?)` a `(?, ?, ?, ?, ?)`
- **Fichiers modifies**: `api_opcv/fix_populate_rendements.js`
- **Commande de deploiement**:
  ```bash
  cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/api && git pull --rebase origin claude/code-review-improvements-ikvuj && node fix_populate_rendements.js --truncate
  ```
- **Verification categories**: fix_categories_remaining.js diagnostic = 0 lacune, categories 100% completes (aucune action necessaire)

### 2026-05-20 - Gouvernance documentaire
- **Statut**: COMMITE ET POUSSE (2 repos)
- **Modification**: Ajout section "Gouvernance documentaire" (9 regles) dans CLAUDE.md des deux depots
- **Objectif**: Eviter mise a jour mecanique de fichiers doc secondaires, centraliser suivi dans SUIVI.md

### 2026-05-20 - Protocole anti-compactage, anti-limite et anti-taches inachevees
- **Statut**: COMMITE ET POUSSE (2 repos)
- **Fichiers modifies**: `api_opcv/CLAUDE.md`, `front_end_opcvm/CLAUDE.md`, `front_end_opcvm/SUIVI.md`
- **Sections ajoutees dans les deux CLAUDE.md**:
  - Protocole anti-compactage, anti-limite et anti-taches inachevees (10 regles)
    1. Principe general (memoire = fichiers, pas conversation)
    2. Travail obligatoire en lots courts
    3. Point de reprise obligatoire (POINT DE REPRISE COURANT dans SUIVI.md)
    4. Regle avant interruption, compactage ou limite
    5. Reduction de la consommation de tokens
    6. Regle de non-dispersion documentaire
    7. Regle Git et etat stable
    8. Regle de securite pour les taches sensibles (diagnostic avant modification)
    9. Regle de fin de lot (bilan court obligatoire)
    10. Regle de reprise (relire CLAUDE.md + SUIVI.md + POINT DE REPRISE)
- **Section ajoutee dans SUIVI.md**: POINT DE REPRISE COURANT (section permanente)
- **Aucun code applicatif modifie**
- **Aucune route API modifiee**
- **Aucune table modifiee**
- **Aucun script modifie**
- **Zero regression**

### 2026-05-20 - DIAGNOSTIC Referentiel FundAfrica Categories / Indices (LOT 1)
- **Statut**: DIAGNOSTIC TERMINE — AUCUN CODE MODIFIE
- **Source**: Fichier Excel `Referentiel_FundAfrica_Categories_Indices_CLEAN_V2_FIX_ASCII.xlsx`
- **Feuilles analysees**: 11 feuilles (CATEGORIE INDICE, TOTAL INDICE, 00-10)

#### A. ETAT ACTUEL DE LA BASE DE DONNEES

**Tables existantes et champs categories/indices:**

| Table | Champs pertinents | Statut |
|-------|-------------------|--------|
| `fond_investissements` | `classification`, `categorie_globale`, `categorie_national`, `categorie_regional`, `categorie_libelle`, `indice_benchmark`, `indice` | Texte libre, 100% peuple |
| `indice_references` | `id_indice`, `nom_indice`, `valeur`, `date`, `type_indice_id` | 5 indices: MASI, TUNINDEX, BRVM, NSE, MONIA |
| `valorisations` | `indRef`, `indRef_EUR`, `indRef_USD`, `indice_name`, `ID_indice` | Peuple pour MAROC/TUNISIE/UEMOA/NIGERIA |
| `pays_regulateurs` | `pays`, `regulateur`, `nomdevise`, `symboledevise` | Referentiel pays actuel |
| `devisedechanges` | 21 paires forex | Complet |

**Tables de referentiel dediees**: AUCUNE (pas de ref_asset_classes, ref_geo_zones, ref_categories, ref_indices)
**Categories**: stockees en texte libre dans fond_investissements, normalisees en MAJUSCULES
**Indices en production**: 5 (MASI, TUNINDEX, BRVM COMPOSITE, NSE ALL SHARE, MONIA)
**Crons indices**: import_indices_excel.js (historique Excel) — pas de scraping automatique des indices

#### B. VERIFICATION PRODUCTION (API live)

| Fond | Pays | categorie_globale | categorie_national | categorie_regional | indice_benchmark | ID_indice |
|------|------|-------------------|--------------------|--------------------|------------------|-----------|
| 1131 (Actions Maroc) | MAROC | ACTIONS | ACTIONS MAROC | ACTIONS AFRIQUE DU NORD | MASI | MASI |
| 569 (Diversifie Maroc) | MAROC | DIVERSIFIE | DIVERSIFIE MAROC | DIVERSIFIE AFRIQUE DU NORD | MASI | MASI |
| 2700 (Oblig Maroc) | MAROC | OBLIGATIONS | OBLIGATIONS MAROC | OBLIGATIONS AFRIQUE DU NORD | MASI | MASI |
| 2500 (Diversifie Tunisie) | TUNISIE | DIVERSIFIE | DIVERSIFIE TUNISIE | DIVERSIFIE AFRIQUE DU NORD | Tunindex | TUNINDEX |
| 2800 (Diversifie Nigeria) | NIGERIA | DIVERSIFIE | DIVERSIFIE NIGERIA | DIVERSIFIE AFRIQUE DE L OUEST | NSE All Share | NSE |

**Constat**: Categories correctement peuplees. Indices = indice actions du pays pour TOUS les fonds (meme obligations et monetaires). Le referentiel Excel corrige cela.

#### C. CONTENU DU FICHIER EXCEL (referentiel cible)

**01_REF_PAYS_ZONES**: 29 pays africains avec region, devise, zone globale, zone monetaire
**02_REF_ASSET_CLASSES**: 4 classes (ACTIONS, OBLIGATIONS, DIVERSIFIE, MONETAIRE)
**03_REF_CATEGORIES_LONG**: 141 categories (LOCAL + REGIONAL + GLOBAL, 4 classes x pays/regions)
**04_REF_INDICES_FUNDAFRICA**: 137 indices avec statuts:
  - 30 VALIDATED_OR_TO_VERIFY (avec nom d'indice)
  - 15 MISSING_BENCHMARK (indice manquant, a ne pas peupler)
  - 24 MISSING_OR_TO_VERIFY (a verifier)
  - 34 COMPOSITE_TO_BUILD (indice composite a construire plus tard)
  - 34 RATE_TO_DEFINE (taux monetaires a definir plus tard)
**05_REF_SOURCES_INDICES**: 10 sources (S&P Global, BRVM, BVMAC, NSE Kenya, etc.)
**06_MAPPING_CHAMPS_SITE**: 9 regles de mapping champs existants -> referentiel
**07_CONTROLES_QUALITE**: 7 controles (CEMAC != BRVM, benchmark != indice FundAfrica, etc.)

#### D. COMPARAISON EXISTANT vs REFERENTIEL

| Element | Existant | Referentiel Excel | Action |
|---------|----------|-------------------|--------|
| Classes d'actifs | Texte libre (ACTIONS, OBLIGATIONS, DIVERSIFIE, MONETAIRE) | Table ref_asset_classes (4 lignes) | Creer table referentiel |
| Zones geographiques | Hardcode dans scripts (PAYS_REGION_MAP) | Table ref_geo_zones (29 pays) | Creer table referentiel |
| Categories | Texte dans fond_investissements | Table ref_categories (141 lignes) | Creer table, mapper fonds |
| Indices FundAfrica | 5 indices (MASI, TUNINDEX, BRVM, NSE, MONIA) dans indice_references | 30 indices valides (dont S&P Sovereign Bonds, BVMAC) | ENRICHIR indice_references, NE PAS supprimer les 5 existants |
| Sources indices | Pas de table | Table ref_index_sources (10 sources) | Creer table |
| Benchmark declare | indice_benchmark dans fond_investissements | Separer benchmark declare vs indice FundAfrica | Ajouter colonne `indice_fundafrica` |
| CEMAC | BRVM COMPOSITE utilise (incorrect) | BVMAC ALL SHARE INDEX | Corriger mapping CEMAC |
| Obligations | Indice MASI/TUNINDEX/NSE (Actions!) | S&P Sovereign Bond par pays | Ajouter indices obligations |

#### E. RISQUES DE REGRESSION IDENTIFIES

1. **Renommer des colonnes** -> casse le frontend (categorie_libelle, indice_benchmark, etc.)
2. **Supprimer indice_references existantes** -> perte historique MASI/TUNINDEX/BRVM/NSE/MONIA
3. **Modifier indice_benchmark** des fonds -> le benchmark DECLARE ne doit JAMAIS etre ecrase par l'indice FundAfrica
4. **Crons existants** (cron_daily_update.sh, cron_daily_eur_usd.sh, cron_nigeria_weekly.sh) -> ne pas casser
5. **import_indices_excel.js** -> conserve, enrichir avec nouvelles sources
6. **Pages fonds, graphiques, classements** -> toutes les colonnes existantes doivent rester fonctionnelles

#### F. PLAN DE MIGRATION ADDITIF (par lots courts)

**LOT 2** — Tables referentielles (ADDITIF, zero impact sur l'existant): **FAIT 2026-05-20**
- [x] Creer `ref_asset_classes` (4 lignes) — FAIT
- [x] Creer `ref_geo_zones` (29 pays + regions) — FAIT
- [x] Creer `ref_categories_fundafrica` (140 categories) — FAIT
- [x] Creer `ref_indices_fundafrica` (137 indices avec statuts) — FAIT
- [x] Creer `ref_index_sources` (10 sources) — FAIT
- [x] Script: seed_referentiel_fundafrica.js (idempotent, depuis le fichier Excel) — EXECUTE EN PRODUCTION

**LOT 3** — Colonne `indice_fundafrica` sur fond_investissements: **EXECUTE 2026-05-20**
- [x] Script: lot3_indice_fundafrica.js (migration + backfill) — CREE ET EXECUTE
- [x] ALTER TABLE ADD COLUMN (5 colonnes) — FAIT EN PRODUCTION
- [x] NE PAS toucher `indice_benchmark` — CONFIRME (1043 fonds non modifies)
- [x] Backfill initial: 212/1189 fonds mappes (0 erreurs)
- [x] Modele Sequelize fond.js + routes API mis a jour
- [x] PM2 restart api-monolith — OK

**LOT 3bis** — Completer classifications + re-mapper: **EXECUTE 2026-05-20**
- [x] Etape 1: 859/870 classifications NULL remplies depuis categorie_globale
- [x] Etape 2: 111 classifications non-standard normalisees (OMLT->OBLIGATIONS, OCT->MONETAIRE, DOLLAR->MONETAIRE, ETF->ACTIONS, ETHIQUE/AUTRE/IMMOBILIER/INFRA/CHARIA/OPCVM->DIVERSIFIE, CONTRACTUEL->DIVERSIFIE)
- [x] Etape 3: 966 fonds supplementaires mappes vers indice FundAfrica
- [x] RESULTAT FINAL: **1178/1189 fonds mappes (99.1%)**, 0 erreurs
- [x] 11 fonds restants sans classification (NULL) — a investiguer manuellement
- [x] Benchmark NON modifie (1043 fonds confirmes)
- [x] CEMAC: BVMAC ALL SHARE INDEX (corrige, plus BRVM COMPOSITE)
- [x] Couverture par pays: MAROC 633/640, NIGERIA 276/280, TUNISIE 124/124, UEMOA 111/111, CEMAC 34/34

**LOT 4** — Correction indices par categorie:
- Fonds OBLIGATIONS: indice FundAfrica = S&P Sovereign Bond du pays (pas MASI/NSE)
- Fonds MONETAIRE: indice FundAfrica = RATE_TO_DEFINE (statut)
- Fonds DIVERSIFIE: indice FundAfrica = COMPOSITE_TO_BUILD (statut)
- Fonds ACTIONS: indice FundAfrica = indice actions national (MASI, NSE, TUNINDEX, BRVM, BVMAC)
- CEMAC: BVMAC ALL SHARE INDEX (pas BRVM COMPOSITE)

**LOT 5** — Import historiques nouveaux indices:
- S&P Sovereign Bond indices (scraping ou import manuel)
- BVMAC ALL SHARE INDEX
- EAE 20 SHARE INDEX
- GSE COMPOSITE INDEX
- Sources depuis 05_REF_SOURCES_INDICES

**LOT 6** — API et frontend:
- Nouvelles routes API: /api/ref/categories, /api/ref/indices, /api/ref/pays
- Modifier fiche fonds pour afficher indice FundAfrica distinct du benchmark declare
- Pages classement: utiliser ref_categories pour grouper
- Compatibilite ascendante: les anciennes colonnes restent fonctionnelles

**LOT 7** — Controles qualite:
- Coherence indice / categorie / devise
- Fonds sans categorie, sans benchmark, sans indice
- Indices sans historique
- Taux FX manquants

### 2026-05-21 - Classement regional/Afrique: deploiement + fix MariaDB + fix date filter
- **Statut**: DEPLOYE EN PRODUCTION (2026-05-21)
- **Objectif**: Classements regionaux FundAfrica (cross-pays en EUR/USD) + classement Afrique (type 3)
- **Bugs corriges**:
  1. Bug ligne 1199: `type_classement = 1` -> `2` pour classement regional local
  2. Regional ranking utilisait `categorie_regionale` (locale) -> maintenant `categorie_fundafrica_regionale` (referentiel)
  3. **FIX MariaDB**: `lot_classement_regional_africa.js` utilisait `conn.execute()` pour `SHOW COLUMNS ... LIKE ?` (prepared statement non supporte par MariaDB) -> change en `conn.query()` (commit `f09ff95`)
  4. **FIX date filter regional local**: `calculateRankregionalmysql` filtrait par `WHERE date = :datedebut` — chaque pays a une date differente, donc seul un pays etait inclus. Fix: subquery `INNER JOIN (SELECT fond_id, MAX(date)) GROUP BY fond_id` pour prendre la derniere perf de chaque fonds (commit `518bc78`)
- **Changements schema (ADDITIFS)**: 2 colonnes ajoutees a 6 tables:
  - `categorie_fundafrica_regionale` VARCHAR(200) — performences, performences_eurs, performences_usds, classementfonds, classementfonds_eurs, classementfonds_usds
  - `categorie_fundafrica_globale` VARCHAR(200) — idem 6 tables
  - **12/12 colonnes creees en production** (verified)
  - **Backfill**: 57134 perf locale + 1941 EUR + 1974 USD
- **Nouvelle fonction**: `calculateRankGlobaldev(category, fundId, devise)` — classement Afrique par `categorie_fundafrica_globale` dans performences_eurs/usds
- **Resultats deploiement production**:
  - Migration: 12/12 colonnes creees, 0 erreurs
  - Performances: 1185 fonds locale + 1185 EUR + 1185 USD, 0 erreurs
  - Classement EUR: type1 (national), type2 (regional), type3 (Afrique) — VERIFIE OK
  - Classement USD: idem — VERIFIE OK
  - Classement local: type1 et type2 avaient meme total (bug date filter) — EN COURS DE FIX
- **Commits API**: `40b1e28`, `f09ff95`, `518bc78`
- **Deploiement**:
  ```bash
  cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/api
  git stash && git pull --rebase origin claude/code-review-improvements-ikvuj && git stash pop
  pm2 restart api-monolith
  curl -s http://localhost:3005/api/classementmysql
  ```

### 2026-05-21 — Diagnostic architecture hybride, workers, ClickHouse, moteur de recalcul
- **Statut**: DIAGNOSTIC TERMINE — AUCUN CODE MODIFIE
- **Fichier cree**: `api_opcv/ARCHITECTURE_DIAGNOSTIC.md` (diagnostic complet)
- **Sections**: A-M (13 sections, ~500 lignes)
- **Constats principaux**:
  - Monolithe semi-organise avec dette technique significative (routes_vl.js = 11K lignes)
  - Architecture microservices preparee (services/) mais NON UTILISEE en production
  - ClickHouse integre dans le code mais NON INSTALLE sur le serveur (analytics routes retournent 503)
  - Agenda.js configure avec MongoDB (erreur) — code mort, jamais appele
  - Bull/ioredis declares dans package.json mais jamais importes — code mort
  - node-cron importe dans 13 fichiers routes mais jamais utilise (cron.schedule() jamais appele)
  - Classement actuel = snapshot unique (MAX(date) par fonds, compare des dates differentes)
  - Aucun moteur de recalcul structure (pas d'event log, pas de jobs, pas de dependances)
  - 40+ scripts one-shot a la racine du projet (pas de repertoire scripts/)
  - 3 crons bash actifs via crontab Linux (seul mecanisme de scheduling)
- **Propositions** (plan 6 phases, sans regression):
  - Phase 1: Stabilisation (health check, monitoring crons, securisation ttyd, nettoyage imports morts)
  - Phase 2: Modularisation (couche service, reorganiser scripts, premiers tests)
  - Phase 3: Workers (worker-recalculation, worker-data-import, worker-scheduler, ttyd-agent)
  - Phase 4: Moteur de recalcul (tables recalc_events/jobs/dependencies/audit, graphe dependances)
  - Phase 5: ClickHouse + classements historiques (install CH, classement date/date, backfill)
  - Phase 6: Services separes (seulement si justifie)
- **Aucun code modifie, aucune table modifiee, aucune route modifiee**
- **API production verifiee**: health OK, classement 3 types OK (Type1=107/120, Type2=113/126, Type3=170/183)

## Session 2026-06-02 — CMF Tunisie Automated Daily Scraper

### Pipeline CMF Tunisie automatise (LOT T1)

**Objectif**: Automatiser l'import quotidien des VL Tunisie depuis le site CMF (https://www.cmf.tn/valeurs-liquidatives-des-titres-opcvm)

**Fichiers crees**:
- `scripts/scraper/cmf_tunisie_daily.py` — Script Python principal (scraper + parser + import)
- `scripts/scraper/requirements_cmf.txt` — Dependances Python
- `scripts/cron/cron_tunisie_daily.sh` — Wrapper cron (Mon-Fri 19h)

**Fonctionnalites implementees**:
1. Scraping CMF website multi-pages (9 pages de pagination)
2. Detection automatique du format de fichier (XLSX/XLS/HTML-table)
3. Parsing Excel bi-section (Capitalisation + Distribution avec dividendes)
4. Extraction de la date depuis le nom de fichier (format YYMMDD)
5. Normalisation des noms de fonds et matching multi-niveaux (exact, partial, fuzzy avec rapidfuzz)
6. Detection des variations extremes >20% → quarantaine (table `cmf_extreme_variations`)
7. File de validation pour nouveaux fonds inconnus (table `cmf_new_funds_queue`)
8. Conversion EUR/USD via table `devisedechanges` existante
9. Import idempotent (deduplication par fund_id+date)
10. Mode dry-run / production avec lockfile
11. Audit trail (table `cmf_import_audit`)
12. Rapports JSON dans `data/tunisie_cmf/staging/`
13. Logs horodates dans `data/tunisie_cmf/logs/`

**Test dry-run (sans DB)**: OK
- 235 fichiers CMF decouverts (9 pages)
- 28 fichiers telecharges (lookback 45 jours)
- 3,550 NAV rows parsees, 1,854 dividendes, 0 erreurs
- 127 fonds par fichier, structure correcte

**Tables audit creees automatiquement par le script**:
- `cmf_import_audit` — Journal d'import
- `cmf_extreme_variations` — VL quarantinees (variation >20%)
- `cmf_new_funds_queue` — Fonds inconnus en attente de validation

**Adaptation du referentiel Python**:
- PostgreSQL → MySQL (pymysql)
- `fund_nav_history` → `valorisations` (schema 28 colonnes)
- `funds` → `fond_investissements`
- EUR/USD conversion via `devisedechanges`
- Compatible avec import_vl_tunisie_cmf.js existant (meme schema valorisations)

**Cron recommande**: `0 19 * * 1-5 /path/to/scripts/cron/cron_tunisie_daily.sh`
(avant cron_daily_update.sh a 20h pour que les recalculs incluent les nouvelles VL)

**Statut**: DEPLOYE EN PRODUCTION (2026-06-02). 1,259 VL importees pour 10 dates (2026-05-13 a 2026-06-02).

### Securite session 2026-06-01 (rappel)

Corrections deployees (commits pushes, a deployer sur production):
- eval() RCE elimine (routes_vl.js) — commit `1187ccb`
- ClickHouse queries parameterisees (apigestionsavequotidien.js) — commit `2f320b5`
- Auth rate limiting 10/15min — commit `8834c14`
- Multer 5MB file size limit sur 13 routes — commit `8834c14`
- NaN className frontend corrige (5 pages, 147 patterns) — commits `f8ae92e`, `8ab9da3`
- Health check cron cree — commit `2f320b5`

**Statut**: DEPLOYE EN PRODUCTION (2026-06-02).

### LOT T4 — Fix forex EUR/TND data quality (2026-06-02)

**Probleme identifie**: Table `devisedechanges` contient 5,959 entries EUR/TND mais seule 1 avec value>0. Yahoo Finance ne retourne pas de donnees TND valides. Impact: toutes les conversions EUR pour fonds tunisiens utilisent un seul point de donnee.

**Fix applique** (commit `97a5f22`):
1. ECB Data API comme fallback pour EUR/* quand Yahoo retourne <100 entries valides
2. Cross-rate derivation: USD/X = EUR/X / EUR/USD pour paires avec donnees insuffisantes
3. UPDATE retroactif des entrees value=0 existantes
4. Script diagnostic read-only: `scripts/diag/check_forex_tnd.js`

**Note**: ECB n'a pas TND/MAD/NGN — la derivation cross-rate est la solution principale.

**Fichiers modifies**: `scripts/import/scrape_forex_import.js`, `scripts/diag/check_forex_tnd.js` (nouveau)
**Statut**: Code pousse, a deployer et executer sur production.
**Documentation mise a jour**: CHANGELOG.md, CODE_REVIEW.md (#16), ROADMAP.md, README_DEV.md

### LOT T5 — Deep audit + bug fixes API + frontend (2026-06-02)

**Audit automatise** (2 agents paralleles: API routes + Frontend):

**Bugs critiques corriges API** (commit `f3ddd6a`):
1. `apigestionpays.js`: `totalfondscompose += totalfondscompose` doublait au lieu d'incrementer (3 occurrences, impact: comptage fonds errone sur pages pays)
2. `apigestionpays.js`: `findCategoryByFundId()` crash si fond inexistant (null dereference)
3. `apigestionpays.js`: `result5.latestDate` crash si pas de VL (3 occurrences)
4. `apigestionsociete.js`: `.find().toJSON()` crash si societe non trouvee
5. `apigestionfonds.js`: `searchFunds` — selectedPays/selectedRegion dans la requete mais pas dans replacements (crash Sequelize), conditions mutuellement exclusives au lieu de cumulatives
6. `apigestionfonds.js`: `getfondbyidmeta` — null dereference si fond inexistant + nom_fond null
7. `apigestionfonds.js`: `getfondbyid` — crash si req.query.funds absent + code_ISIN duplique
8. `routes_vl_admin.js`: 6 routes sans `.catch()` (requetes qui hangent en cas d'erreur DB)
9. `sequelize.js`: ajout retry 5 tentatives + pool eviction + match patterns pour erreurs connexion transitoires

**Bugs critiques corriges Frontend** (commit `4af1b35`):
1. `[fondId]/page.server.ts`: aucun try/catch (crash entier si API indisponible)
2. 6 autres `page.server.ts`: pas de response.ok check ni fund?.funds null guard avant destructuring
3. `sitemap.ts`: pas de response.ok check sur 3 fetch API (crash generation sitemap)
4. `performance/page.tsx`: `difference.toFixed(2)` sans NaN guard (crash si donnees manquantes)

**Production API down**: Detecte durant cette session — tous les endpoints DB retournent 500, endpoints sans DB (health, login) OK. Probablement MySQL connection lost. Necessite restart PM2/MySQL sur serveur.

**Fichiers modifies API**: sequelize.js, apigestionfonds.js, apigestionpays.js, apigestionsociete.js, routes_vl_admin.js
**Fichiers modifies Frontend**: 7 page.server.ts, sitemap.ts, performance/page.tsx
**Build frontend**: OK (0 erreur)
**Statut**: Pushes, a deployer

### 2026-06-05 - LOT T20: Nigeria donnees mises a jour
- **Statut**: DEPLOYE EN PRODUCTION (2026-06-04 22:02 UTC)
- **Diagnostic**: Nigeria derniere VL = 2026-05-08 (~27 jours de retard). Cron `cron_nigeria_weekly.sh` ne s'executait pas automatiquement.
- **SEC Nigeria site web**: 21 fichiers 2026 disponibles, donnees jusqu'au 22 mai 2026
- **Constat important**: fichiers SEC Nigeria depuis ~30 avril ne contiennent que 38-41 lignes (au lieu de 214-222 en jan-mars). ~195 fonds ne sont plus inclus dans les fichiers recents. Changement cote SEC Nigeria, pas un bug de notre scraper.
- **Execution manuelle sur VPS**: `bash scripts/cron/cron_nigeria_weekly.sh`
  - Extraction: 21 fichiers Excel, 3852 lignes, 235 fonds
  - Import: 82 VL inserees, 1 fonds cree, 3718 deja existantes, 52 rejetees (hors bornes)
  - Recalc EUR/USD: 926 897 VL, 0 erreur
  - Recalc VL ajuste: 926 917 VL, 0 erreur
  - Perf locale: 611 fonds, 0 erreur
  - Perf EUR/USD: 611 fonds, 0 erreur
- **A verifier**: `crontab -l | grep nigeria` — le cron pourrait ne plus etre dans le crontab

### 2026-06-04 - LOT T19: Fix crash pages fonds EUR/USD "reading '1'"
- **Statut**: DEPLOYE EN PRODUCTION (2026-06-04 ~22:40 UTC)
- **Symptome**: `/funds/summary-eur/1130` et `/funds/summary-usd/1130` (et tous les fonds) affichaient "Une erreur est survenue — Cannot read properties of undefined (reading '1')"
- **Diagnostic live** (API testee en production):
  - valLiqdev/1130/EUR → 200 OK, performancesdev → 200 OK, classementquartiledev/1130/EUR → 200 OK
  - Donnees backend SAINES — bug 100% frontend (rendu)
- **Cause racine**: dans FundSubView.tsx (EUR + USD), le className des cellules perf annuelles avait une branche else NON protegee:
  - `${slicedPostc && slicedPostc[1] && isNaN(...) ? '' : parseFloat(slicedPostc[1][2]) < 0 ? ...}`
  - Au premier rendu `postc` (state) = null → `slicedPostc` = undefined → la condition court-circuite vers le else → `slicedPostc[1]` leve "reading '1'"
  - Les cellules valeur etaient protegees, mais PAS le className
  - La page locale `/funds/[fondId]` utilisait deja le bon pattern (`!slicedPostc?.[1] || ...`) → elle ne crashait pas
- **Fix**: className reecrit en `${slicedPostc?.[n] && !isNaN(parseFloat(slicedPostc[n][2])) ? (parseFloat(...) < 0 ? 'text-danger' : 'text-success') : ''}` (lignes ~1301/1310/1319 EUR, ~1303/1312/1321 USD)
  - Aussi protege `quartile` = `classementType1?.rank5Ans` (etait `classementType1.rank5Ans`)
- **Fichiers**: summary-eur/[fondId]/FundSubView.tsx, summary-usd/[fondId]/FundSubView.tsx (8 corrections)
- **Build**: OK (0 erreur). Page locale inchangee. Commit frontend: `0dc046b`
- **Note doc**: la route appelee par le front est `/api/classementquartiledev/:id/:devise` (SANS `/fond/`), alors que CLAUDE.md documente `/api/classementquartiledev/fond/:id/:devise`. La variante `/fond/` renvoie 404. Le front utilise la bonne (200). A corriger dans CLAUDE.md ulterieurement (doc only).

### 2026-06-04 - LOT T17 (#32): Fix routes_vl.js multiplication→division (10 lignes)
- **Statut**: COMMITE, A DEPLOYER
- **Probleme**: 10 lignes dans routes_vl.js utilisaient multiplication au lieu de division pour conversion local→EUR/USD
- **Impact CRITIQUE**: ces routes ecrivent DIRECTEMENT en base de donnees (valorisations)
  - `POST /api/updateValues/:id`: value_EUR, value_USD (saisie manuelle VL)
  - `POST /api/uploadsfilevl/:id`: value_EUR/USD, actif_net_EUR/USD, dividende_EUR/USD (upload CSV)
- **Preuve interne**: indRef dans le meme fichier (lignes 6352-6353) utilisait deja la division correcte
- **Fix**: `* exchangeRatesEUR.value` → `/ exchangeRatesEUR.value` (idem USD) sur les 10 lignes
- **Non modifie**: conversions EUR↔USD portefeuille (lignes 2383-2392, 2518-2527) = cross rate different
- **Fichier API modifie**: src/routes/routes_vl.js
- **Zero regression** (le recalc quotidien utilise deja la division et ecrase les valeurs)

### 2026-06-04 - LOT T15/T15b/T15c: UEMOA indRef 22% → 100% (local + EUR + USD)
- **Statut**: DEPLOYE ET VERIFIE EN PRODUCTION
- **Probleme**: UEMOA indRef coverage a 22% (8/111 fonds, 7577/33830 VL)
- **Causes racines identifiees (T13 diagnostic)**:
  1. import_indices_excel.js mapping BRVM n'incluait pas 'UEMOA' (fonds ont pays='UEMOA')
  2. step 4 utilisait multiplication au lieu de division pour conversion EUR/USD
  3. Fichier Excel absent du VPS → script crashait meme pour step 4 qui n'en a pas besoin
- **Corrections code (T15/T15b, commits API `f6d7cb2`, `ac1cf98`, `2990351`)**:
  - Ajout 'UEMOA' dans INDEX_CONFIG BRVM_UEMOA.pays[]
  - Step 4: `indRef * rate` → `indRef / rate` (regle OPCVM: DIVISION)
  - Fallback DB si Excel absent (`loadIndexDataFromDB()`)
  - Case-insensitive id_indice matching (Tunindex vs TUNINDEX)
  - Nouveau script read-only `scripts/diag/check_indref_coverage.js`
- **Execution production (T15c, sur VPS)**:
  - Step 2 UEMOA: 33 829 VL indRef local peuples, 111 liens fonds-indice
  - Step 4 UEMOA: 26 253 VL convertis EUR/USD par DIVISION
  - Performances EUR/USD: 108 fonds UEMOA recalcules
  - Classements EUR/USD: recalcules
- **Resultat final**: **111/111 fonds (100%), 33 830/33 830 VL (100%)** local + EUR + USD
- **Sanity check**: UEMOA XOF local=198.58 eur=0.29 → DIVISION (OK)
- **Fichiers API modifies**: scripts/import/import_indices_excel.js, scripts/diag/check_indref_coverage.js (nouveau)
- **Zero regression**

### 2026-06-03 - LOT T10/T11/T12: Classements (local + EUR/USD) + page USD
- **Statut**: COMMITE ET POUSSE, A DEPLOYER + RECALCUL REQUIS
- **Diagnostic production** (connexion API reelle, pas a l'aveugle):
  - classementquartilemysql/866 = 200 mais `classementType1` (national) VIDE ; type2/type3 OK
  - Echantillon 8 fonds: type1 quasi-systematiquement vide (sauf fond 1200)
  - classementquartiledev/866/USD: totaux GONFLES (national=1883 vs 344 attendu local)
  - valLiqdev/866/USD = 200 (API USD OK) ; pages USD/EUR/local toutes HTTP 200
- **LOT T10 — Classement national local vide (root cause)**:
  - `calculateRankNational` utilisait `WHERE date = :date` (date fixe = datejour du fond)
  - Les pairs ayant des dernieres VL a des dates differentes etaient exclus → national vide
  - Fix: `MAX(date)` par fond (INNER JOIN), pattern identique au regional/global valide
  - Fichier: `api_opcv/src/services/ranking.service.js`
- **LOT T11 — Totaux EUR/USD gonfles**:
  - `calculateRankNationalDev/RegionalDev/GlobalDev` prenaient TOUTES les dates par fond (~4/fond)
  - → totaux de classement multiplies, rangs fausses
  - Fix: helper `keepLatestPerFund()` (derniere date par fond) avant le ranking
  - Fichier: `api_opcv/src/services/ranking.service.js`
  - **Commit API**: `6644682`
- **LOT T12 — Page USD benchmark annuel en EUR**:
  - `getperfcategorieannuel` (summary-usd) hardcodait `dev="EUR"` → benchmark EUR sur page USD
  - Fix: `dev="USD"`. Build 217/217 OK
  - **Commit Frontend**: `be1b45e`
- **IMPORTANT**: les fonctions calculateRank* ALIMENTENT les tables classement lors du batch.
  Les corrections prennent effet APRES recalcul (voir Prochaine action recommandee).
- **Risque regression**: NUL (national etait casse, dev gonfle ; on ne fait qu'ameliorer)

### 2026-06-03 - LOT T9: routes_vl.js - 10 .catch() ajoutes
- **Statut**: COMMITE ET POUSSE, A DEPLOYER
- **Probleme**: 11 .then() sans .catch() dans routes_vl.js → erreurs Sequelize silencieuses, requests qui hang jusqu'a timeout client
- **Solution**: Ajout .catch(err => res.status(500).json({...})) sur chaque route
- **Routes corrigees**:
  - /api/getportefeuillebyuser/:id, /api/getportefeuille/:id
  - /api/getDevises, /api/getSocietes, /api/getSocietesbypays/:pays, /api/getPays
  - /api/getData, /api/performancesportefeuillewithindice/...
  - /api/ratiosportefeuille/:year/:id, /api/ratiosportefeuilledev/:year/:id/:devise
- **Note**: /api/comparaison etait deja correctement gere (false positive lors du scan)
- **Verification**: node -c routes_vl.js → SYNTAX OK
- **Risque regression**: NUL (additif uniquement)
- **Commit API**: `5b70838`

### 2026-06-03 - LOT T8: Analyse bout en bout + corrections critiques
- **Statut**: COMMITE ET POUSSE, A DEPLOYER
- **Analyse complete**: 4 agents paralleles — crons, ClickHouse, frontend, securite API
- **Corrections**:
  1. Math.random() fake data dans portfolio/FundSubView.tsx (3 cellules aleatoires → '-'). Code mort supprime de 4 autres fichiers fund view. Commit frontend: `b7c962b`
  2. 8 routes admin recalc sans auth JWT → ajout authenticate+authorize('admin'). authorize() supporte typeusers_id=0. Commit API: `5540d95`
  3. valLiq/valLiqdev retournaient 500 pour fonds inexistants → 404 + validation fundId. Commit API: `bb03081`
  4. cron_daily_eur_usd.sh sans chmod +x. Commit API: `5540d95`
- **Resultats analyse**:
  - Crons: 5 scripts OK, pas de crontab dev (normal). Tunisie+health_check a ajouter en production
  - ClickHouse: non installe, performance_historique jamais peuple, analytics→503
  - Frontend: 238 pages, build OK. 87% fetch sans response.ok (dette technique)
  - Securite API: eval() clean, SQL injection clean, multer OK, rate limiting OK
  - Donnees: MAROC frais (06-01), TUNISIE frais (06-02), NIGERIA 26j retard, UEMOA 229j, CEMAC 537j
- **CODE_REVIEW.md mis a jour**: items #21-28 ajoutes
- **Build**: 233 pages OK 0 erreur

## POINT DE REPRISE COURANT

### Dernier etat stable
Session 2026-06-12 : T30-T30d deployes et verifies en production (health OK). T35 module BRVM BOC commite et pousse, a deployer + initialiser.

### Dernier lot termine
**LOT T35 (2026-06-12) — Module BRVM BOC VL OPCVM UEMOA**
- Diagnostic complet (Lot 1) : sources BRVM testees, base inspectee via PRODUCTION_STATE.json, UEMOA stale 2025-10-15
- Scraper/parseur/importeur `brvm_boc_daily.py` : extraction 98,3% sur 2 BOC reels, selftest OK
- Tables additives staging + tracabilite PDF→ligne→base, promotion sans overwrite vers valorisations
- 4 routes GET supervision lecture seule, jest 199/199
- Lots precedents : T30d Frontend (87977a9), T30c API (3f408bc)

### Fichiers modifies dans le dernier lot
**API**: scripts/scraper/brvm_boc_daily.py (nouveau), scripts/scraper/requirements_brvm.txt (nouveau), scripts/cron/cron_brvm_daily.sh (nouveau), src/routes/apibrvmboc.js (nouveau), app.js (+2 lignes), .gitignore (+4 lignes), README_DEV.md (doc module)

### Commandes executees
- Tests sources : curl boc_jour.aspx (200), 2 PDF BOC (200, valides)
- `python3 scripts/scraper/brvm_boc_daily.py --selftest` : OK
- Dry-run BOC 2026-06-10 + 2026-06-04 : 115 lignes chacun, 2 echecs residuels
- `npx jest --forceExit` : 199/199
- `node -c` app.js + apibrvmboc.js : OK

### Prochaine action recommandee
1. **Deployer l'API** :
   ```bash
   cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/api && git stash && git pull --rebase origin claude/code-review-improvements-ikvuj && git stash pop && pm2 restart api-monolith
   ```
2. **Installer les dependances Python du module BRVM** :
   ```bash
   cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/api && pip3 install -r scripts/scraper/requirements_brvm.txt
   ```
3. **Valider en dry-run (aucune ecriture)** :
   ```bash
   python3 scripts/scraper/brvm_boc_daily.py --selftest
   python3 scripts/scraper/brvm_boc_daily.py --latest --dry-run
   ```
4. **Premier import reel (cree les tables brvm_*)** :
   ```bash
   python3 scripts/scraper/brvm_boc_daily.py --latest --production
   curl -s https://africafunds.chainsolutions.fr/api/brvm/boc/status | python3 -m json.tool
   ```
5. **Backfill du trou UEMOA (2025-10-15 → aujourd'hui), par tranches** :
   ```bash
   python3 scripts/scraper/brvm_boc_daily.py --start-date 2025-10-15 --end-date 2026-06-12 --production --throttle 3 --limit 60
   # relancer la meme commande : reprise automatique (BOC deja parses ignores)
   ```
6. **Diagnostic + comblement des manquants** :
   ```bash
   python3 scripts/scraper/brvm_boc_daily.py --repair-missing --production            # rapport seul
   python3 scripts/scraper/brvm_boc_daily.py --repair-missing --apply --production    # insertion VL officielles
   ```
7. **Installer le cron (apres validation des etapes 3-4)** :
   ```bash
   (crontab -l; echo "30 19 * * 1-5 /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/api/scripts/cron/cron_brvm_daily.sh >> /var/log/cron_brvm.log 2>&1") | crontab -
   crontab -l
   ```
8. **Controles SQL** :
   ```bash
   mysql -u fund_opcvm -p fund_opcvm -e "SELECT COUNT(*) FROM brvm_boc_sources; SELECT match_status, COUNT(*) FROM brvm_boc_navs_raw GROUP BY match_status; SELECT promote_status, COUNT(*) FROM brvm_boc_navs_raw GROUP BY promote_status;"
   mysql -u fund_opcvm -p fund_opcvm -e "SELECT f.nom_fond, MAX(v.date) derniere_vl FROM valorisations v JOIN fond_investissements f ON f.id=v.fund_id WHERE f.pays='UEMOA' GROUP BY f.id ORDER BY derniere_vl DESC LIMIT 20;"
   ```
9. Taches restantes executables sans risque :
   - T31: Refactoring panels dupliques (CODE_REVIEW #28) — large effort
   - T32: Backfill ClickHouse performance_historique
   - T33: Extraction apigestionsavequotidien.js — large effort
   - T34: Frontend tests
   - T35-suite: page admin BRVM BOC frontend (supervision visuelle), validation des UNMATCHED

### Rollback T35 (si besoin)
- Le module est entierement additif : `git revert` du commit T35 + `pm2 restart api-monolith` suffit
- Les tables brvm_* peuvent rester (aucun impact sur l'existant) ou etre supprimees : `DROP TABLE brvm_boc_sources, brvm_boc_navs_raw, brvm_fund_aliases, brvm_import_logs, brvm_missing_navs;`
- Les VL promues sont identifiables : `SELECT * FROM brvm_boc_navs_raw WHERE promote_status='PROMOTED'` (couples fund_id+nav_date supprimables cibles si necessaire)

**En attente (donnees utilisateur) :**
- TUNISIE EUR/USD gap 24% : attente fichier VL avec dividendes
- UEMOA donnees stales 233+ jours : attente fichiers Excel + script Python d'Eric
- CEMAC 0% indRef : decision metier (sourcer indice BVMAC)

**En attente (validation Eric) :**
- Index UNIQUE valorisations(fund_id, date) — SQL production
- B5: Securisation ttyd — Nginx changes
- B6: Nettoyage 244 VL Nigeria extremes
- Cron modifications (fix-brvm-nginx.py fantome, alerting email/Slack)

### Risques connus
- SEC Nigeria changement format : ~195 fonds disparus des fichiers recents
- UEMOA donnees stales 233+ jours
- CEMAC donnees stales 539+ jours
- 7 fonds TUNISIE (2869-2875) sans indRef
- fix-brvm-nginx.py : script fantome dans crontab (CODE_REVIEW #40)
- Cron health check : pas d'alerting email/Slack (CODE_REVIEW #39)

### A ne pas faire a la reprise
- Ne PAS modifier les donnees TUNISIE — attendre le fichier utilisateur
- Ne PAS supposer que tous les fonds Nigeria ont des donnees mai 2026
- Ne PAS modifier les calculs financiers sans diagnostic prealable
- Ne PAS modifier la base de donnees sans validation Eric

### Etat Git (2026-06-12, T35)
- **api_opcv**: branche `claude/code-review-improvements-ikvuj`, T35 module BRVM BOC commite/pousse
- **front_end_opcvm**: branche `claude/code-review-improvements-ikvuj`, SUIVI.md T35 commite/pousse

### Etat Git (2026-06-11)
- **api_opcv**: branche `claude/code-review-improvements-ikvuj`, commit `eed7d88`, sync origin, clean
- **front_end_opcvm**: branche `claude/code-review-improvements-ikvuj`, commit `7616fce` + SUIVI/CODE_REVIEW dirty

### Etat Git (2026-06-05)
- **api_opcv**: branche `claude/code-review-improvements-ikvuj`, commit `c6812ed`, sync origin, clean
- **front_end_opcvm**: branche `claude/code-review-improvements-ikvuj`, commit `6ba2f0b`, SUIVI.md+CODE_REVIEW dirty

### Deploiement production 2026-05-21 (21:20 UTC)

**LOT 0 — Diagnostic production** : FAIT
- PM2 daemon avait ete respawne (processes vides) → restauration urgente effectuee
- Services remontes : api-monolith (id:0) + fundafrique-frontend (id:1)
- MySQL connecte, ~40 tables existantes, pas de tables recalc, pas de ClickHouse

**LOT 1 — Deploiement code** : FAIT
- API : `git reset --hard origin/claude/code-review-improvements-ikvuj` → commit `ca90bd9`
  - 20 commits de code deployes (Phases 1-5, securite credentials, workers, recalc)
  - 14 commits de snapshot horaires non-pushes ignores (PRODUCTION_STATE.json regenere)
- Frontend : `git pull` fast-forward → commit `1312d7d`
  - 16 fichiers modifies (Phase 5.8 dates, portfolio fix, SUIVI.md)
- npm install + npm run build (exit code 0) + pm2 restart
- Cron sync_production desactive pendant deploiement, reactve apres
- Validation : API health OK, frontend HTTP 200, trafic reel observe

**LOT 2 — Tables recalc** : FAIT
- Script `create_recalc_tables.js --execute` : 4 tables creees
  - recalc_events, recalc_jobs, recalc_dependencies, recalc_audit
  - 20 dependances inserees
- Validation MySQL : 4 tables presentes, structure conforme

**LOT 3 — Workers** : FAIT
- `pm2 start ecosystem.config.js --only worker-recalculation` → online (id:2)
- `pm2 start ecosystem.config.js --only worker-data-import` → online (id:3)
- Logs OK : "Worker recalculation demarre — poll 10000ms", "Taches disponibles: asfim-daily, forex-daily, nigeria-weekly"
- `pm2 save` effectue

**LOT 4 — Fix fonds sans classification** : FAIT
- Fix colonne script : `categorie_regionale` → `categorie_regional`, `categorie_fundafrica_nationale` → `categorie_fundafrica_locale` — commit api `ca90bd9`
- 11/18 fonds corriges automatiquement (MONETAIRE +3, OBLIGATIONS +3, ACTIONS +2, DIVERSIFIE +3)
- 7 fonds restants avec categorie AUTRES/INFRASTRUCTURE (classification manuelle requise)
- Erreur secondaire sur `ref_indices_fundafrica` (table inexistante) — non bloquante

**LOT 5 — Migration crontab** : FAIT
- 4 chemins corriges vers `scripts/cron/` et `scripts/deploy/`
- Permissions +x ajoutees sur `cron_daily_eur_usd.sh` et `sync_production.sh`
- Cron `fix-brvm-nginx.py` inchange (chemin systeme)
- Sauvegarde crontab avant modification dans `/tmp/crontab_before_lot5.txt`

**LOT 6 — ClickHouse** : FAIT
- ClickHouse 26.4.3.37 installe (apt, Ubuntu 22.04)
- Service systemd enabled (auto-start au boot)
- Database `fund_analytics` creee
- Variables CLICKHOUSE_* ajoutees au .env production
- Migration script : 2 tables creees (`classement_historique`, `performance_historique`)
- API restart : ClickHouse detecte, 3 tables auto-creees (`fund_performance`, `fund_rankings`, `market_analytics`)
- Sync initiale completee : 734,582 VL + 19,362 rankings + 5 pays
- Fix `safeFloat()` pour donnees `#N/A` dans actif_net — commit api `85f7726`
- Endpoints analytics operationnels (retournent 200 avec donnees)
- Sync periodique configuree : toutes les 60 minutes

### Etat production actuel (2026-05-21 21:18 UTC)
| Process | PM2 id | Status | Memoire |
|---------|--------|--------|---------|
| api-monolith | 0 | online | 159.9mb |
| fundafrique-frontend | 1 | online | 56.4mb |
| worker-recalculation | 2 | online | 58.0mb |
| worker-data-import | 3 | online | 56.9mb |

- API Health : `{"status":"ok"}`
- Frontend : HTTP 200
- RAM disponible : 15Gi / 17Gi
- Disque : 34G libre (78% utilise)
- Trafic reel : utilisateurs actifs observes pendant le deploiement

### Etat Git production
- **api**: branche `claude/code-review-improvements-ikvuj`, commit `ca90bd9`, 2 fichiers M (chmod permissions)
- **frontend**: branche `claude/code-review-improvements-ikvuj`, commit `1312d7d`, clean

### Etat Git local
- **api_opcv**: branche `claude/code-review-improvements-ikvuj`, commit `ca90bd9`, sync origin
- **front_end_opcvm**: branche `claude/code-review-improvements-ikvuj`, commit `1312d7d`, sync origin

### Taches prioritaires A (completees 2026-05-21)

**A1 — Classification 7 fonds restants** : FAIT
- 5 fonds MAROC GARANTI → DIVERSIFIE (RMA CAPITAL GARANTI, EMERGENCE PERFORMANCE, CDG GARANTI, etc.)
- 2 fonds NIGERIA DEBT/INCOME → OBLIGATIONS (FBN MONEY MARKET, STANBIC IBTC NIGERIAN DEBT & INCOME)
- Total : 1196/1196 fonds classes (100% coverage, 0 NULL restant)

**A2 — Pull API production** : FAIT
- API mise a jour vers commit `10be188` (fix NaN fund_id + fix column names)
- PM2 restart OK, API health OK

**A3 — Backfill classement_historique** : FAIT
- Test 30 jours : 14,617 rows OK
- Full 10 ans : 1,428,484 rows inserees (2016-01 a 2026-05)
- Fix `categorie_fundafrica` → `categorie_fundafrica_globale` — commit `5f94c2e`
- Fix NaN fund_id filtering — commit `10be188`

**A4 — Nettoyage donnees corrompues MySQL** : FAIT
- 631 `#N/A` dans actif_net → NULL
- 12 nombres avec espaces dans actif_net → nettoyage
- 1 `NC` dans actif_net → NULL
- 88 placeholder `9999999999` dans actif_net → NULL
- 13 restants verifie (nombres avec espaces dans value/vl_ajuste)

### Etat Git production (post taches A)
- **api**: branche `claude/code-review-improvements-ikvuj`, commit `10be188`
- **frontend**: branche `claude/code-review-improvements-ikvuj`, commit `1312d7d` (SUIVI.md updates pas encore deploys)

### Etat Git local (post taches A)
- **api_opcv**: branche `claude/code-review-improvements-ikvuj`, commit `10be188`, sync origin
- **front_end_opcvm**: branche `claude/code-review-improvements-ikvuj`, commit `02060b8`, sync origin

### B1 — Referentiel FundAfrica (execute 2026-05-22)

**Bug fix require** : 34 scripts avaient `const mysql = require('dotenv')` — tous crashaient a l'execution. Corrige commit `abc9482`.
**Fix path seed** : `referentiel_fundafrica.json` chemin corrige (`__dirname` → `../../`) — commit `c7761d4`.

**Mapping indices execute sur production** (lot3 --execute --force) :
- 1189/1189 fonds actifs mappes avec indice_fundafrica (100%)
- OBLIGATIONS 480 → S&P Sovereign Bond Index par pays
- ACTIONS 183 → indices locaux (MASI, NSE All Share, BRVM Composite, BVMAC, etc.)
- DIVERSIFIE 363 → COMPOSITE_TO_BUILD (benchmark composite a definir)
- MONETAIRE 163 → RATE_TO_DEFINE (taux reference a definir)
- 5 pays : MAROC 640, NIGERIA 280, TUNISIE 124, UEMOA 111, CEMAC 34
- indice_benchmark (declare par le fonds) : NON MODIFIE (1043 fonds preserves)
- Tables ref deja existantes en production (seed execute precedemment)
- Note : seed script echoue car referentiel_fundafrica.json introuvable (chemin corrige mais non re-deploye)

### Erreurs restantes
- `total_aum` UEMOA affiche 8.1e+124 (donnee `montant_actif_net` corrompue) — rafraichi au prochain sync ClickHouse
- Table `performance_historique` vide (backfill separe a executer)
- seed_referentiel_fundafrica.js : fix chemin commite mais pas encore deploye (commit `c7761d4`)

### Etat Git production (post B1)
- **api**: branche `claude/code-review-improvements-ikvuj`, commit `abc9482` + 9 snapshots ahead
- **frontend**: branche `claude/code-review-improvements-ikvuj`, commit `1312d7d`

### Etat Git local (post B1)
- **api_opcv**: branche `claude/code-review-improvements-ikvuj`, commit `c7761d4`, sync origin
- **front_end_opcvm**: branche `claude/code-review-improvements-ikvuj`, commit `c7000b9`, sync origin

### B2 — Routes API referentiel (complete 2026-05-22)

8 endpoints crees dans `src/routes/apigestionreferentiel.js` — commit `e2b8784` :
- GET /api/ref/categories (filtres: niveau, classification, pays)
- GET /api/ref/indices (filtres: statut, classification, niveau)
- GET /api/ref/indices/stats (agregation par statut et classification)
- GET /api/ref/pays (zones geographiques referentiel)
- GET /api/ref/asset-classes (4 classes d'actifs)
- GET /api/ref/sources (sources donnees indices)
- GET /api/ref/mapping (vue fonds→indices avec filtres)
- GET /api/ref/mapping/summary (couverture mapping par pays/classification)
Enregistre dans app.js ligne 131. Degradation gracieuse si tables ref absentes.

### Points de vigilance — Audit metriques risque (2026-05-22)

**Etat des metriques calculees (via /api/ratiosnew/:year/:id) :**
| Metrique | Calcule | Stocke MySQL | Sync ClickHouse |
|----------|---------|--------------|-----------------|
| Volatilite (1an/3an/5an) | OUI | OUI | OUI |
| Sharpe | OUI | OUI | OUI |
| Sortino | OUI | OUI | OUI |
| Tracking Error | OUI | OUI (indRef requis) | OUI |
| Information Ratio | OUI | OUI | OUI |
| Beta / Beta haussier / Beta baissier | OUI | OUI | OUI |
| Up/Down Capture | OUI | OUI | OUI |
| Omega | OUI | OUI | OUI |
| Skewness / Kurtosis | OUI | OUI | OUI |
| Max Drawdown | OUI | OUI | OUI |
| Calmar | OUI | OUI | OUI |
| DSR | OUI | OUI | OUI |
| VAR 95% / 99% | OUI | OUI | OUI |
| **R2 (correlation)** | OUI (calculerR2) | **NON** | **NON** |
| **Alpha** | **NON** | **NON** | **NON** |

**Performances stockees en MySQL et ClickHouse :**
- Perf glissante (YTD, 1M, 3M, 6M, 1A, 3A, 5A, 8A, 10A) : OUI MySQL + ClickHouse
- Perf annualisee (Fonds) : OUI
- Perf annualisee (Categorie) : calculee a la volee, PAS stockee
- Perf annualisee (Indice) : calculee depuis indice_references, PAS stockee
- Volatilite Cat / Perte Max Cat : calculees a la volee, PAS stockees

**Indices et donnees benchmark :**
- Table `indice_references` contient les VL historiques des benchmarks
- Colonne `indRef` / `indRef_EUR` / `indRef_USD` dans valorisations = valeur indice a chaque date VL
- Metriques dependant de l'indice : Beta, Tracking Error, IR, R2, Up/Down Capture
- Mapping B1 execute : 1189 fonds ont `indice_fundafrica` mais les calculs utilisent `indice_benchmark` (declare)

**GAPS a corriger (TODO) :**
1. R2 : calcule dans newratios.js mais jamais persiste → ajouter colonnes r2_1an/3an/5an dans performences + sync ClickHouse
2. Alpha : pas implemente → a ajouter (Alpha = Rp - [Rf + Beta * (Rm - Rf)])
3. Perf Cat / Vol Cat / Perte Max Cat : calculees on-demand → envisager pre-calcul pour perf
4. NaN % visible sur screenshot (Difference Cat) : categorie_national null pour certains fonds → verifier data
5. Perf Indice FundAfrica vs Indice declare : le frontend affiche `indice_benchmark` (declare), pas `indice_fundafrica`
6. Table `performance_historique` ClickHouse : toujours vide, pas de script de backfill
7. SQL injection potentielle dans analytics.js (string interpolation dans queries ClickHouse) → a parametriser

### B4 — R2 et Alpha Jensen (complete 2026-05-22)

**Calcul Alpha Jensen** ajoute dans `apigestionratios.js` pour toutes periodes (1A/3A/5A/8A/10A) :
- Formule : Alpha = Rp - [Rf + Beta * (Rm - Rf)]
- Variables deja disponibles : perfAnnualisee, tauxsr, beta, perfAnnualiseeInd
- Ajoute dans la reponse JSON API (`alphaJensen`)
- Ajoute dans les fallbacks (valeur '-' quand pas de donnees)

**Persistance R2** : deja calcule par `calculerR2()` mais jamais stocke
- Ajoute r2 + alphaJensen dans `getRatioDataFields` → MySQL
- Ajoute r2 + alpha dans ClickHouse insert (`insertIntoClickHouse`)
- 6 nouvelles colonnes dans modele performence.js : r2_1an/3an/5an, alpha1an/3an/5an
- Script migration : `scripts/migrations/add_r2_alpha_columns.js` (3 tables)
- Commits : `a0d6acb`

### Etat Git local (post B4)
- **api_opcv**: commit `a0d6acb`, sync origin
- **front_end_opcvm**: commit `bf09e4b`, sync origin

### Tunisie CMF V1.8.3 — Import VL + Dividendes (en cours 2026-05-22)

**Analyse complete** : FAIT (les 3 fichiers CSV + base SQLite + README + schema telecharges et analyses)
**Script import** : `scripts/import/import_vl_tunisie_cmf.js` — commit `c024913`
**A executer sur production** :
1. Pull code : `cd /var/www/...api && git pull --rebase origin claude/code-review-improvements-ikvuj`
2. Installer gdown : `pip3 install gdown`
3. Telecharger CSV : `gdown --folder "https://drive.google.com/drive/folders/15UvFbjr8VbVJqQ5XWkRuWVHwsh8qkHlx" -O /tmp/tunisie_data/`
4. Dry-run : `TUNISIE_DATA_DIR="/tmp/tunisie_data/TUNISIE VL/final_v183" node scripts/import/import_vl_tunisie_cmf.js --dry-run`
5. Execute : `TUNISIE_DATA_DIR="/tmp/tunisie_data/TUNISIE VL/final_v183" node scripts/import/import_vl_tunisie_cmf.js --execute --force`
6. Post-import : `node scripts/recalc/recalc_vl_ajuste.js && node scripts/fix/fix_populate_performances.js --force --pays Tunisie`

### Import Tunisie CMF V1.8.3 — EXECUTE (2026-05-22)
- 227,998 VL inserees + 61,650 mises a jour
- 7 nouveaux fonds crees (131 total Tunisie)
- 1,055 dividendes integres (122 fonds)
- Recalcul VL ajustees + EUR/USD + performances
- Correction casse "Tunisie" -> "TUNISIE"

### Fix routes classement — DEPLOYE (2026-05-22 ~20:00)
- 7 lignes `limit: 500,` parasites dans apigestionsavequotidien.js (commit b6919c0) retirees
- Fix deploye, PM2 restart OK (4 processes online)
- curl /api/classementmysql retourne vide (batch en cours, normal pour 1200+ fonds)
- Verification en attente

### Documentation gouvernance — CREEE (2026-05-22)
Fichiers crees dans front_end_opcvm :
- CHANGELOG.md, CODE_REVIEW.md, ROADMAP.md, README_DEV.md (4 nouveaux fichiers)
- CLAUDE.md et SUIVI.md deja existants et a jour

### B3 — Affichage indice FundAfrica distinct du benchmark (complete 2026-05-22)

**API** (`apigestionfonds.js`) : ajout de `indice_fundafrica`, `indice_fundafrica_id`, `categorie_fundafrica_locale`, `categorie_fundafrica_regionale`, `categorie_fundafrica_globale` dans les reponses JSON de `/api/valLiq/:id` et `/api/valLiqdev/:id/:devise`.

**Frontend** (3 pages summary) :
- `funds/[fondId]/FundView.tsx` : remplacement des placeholders vides par Benchmark declare / Indice FundAfrica / Cat. FundAfrica locale/regionale/globale
- `funds/summary-eur/[fondId]/FundSubView.tsx` : idem + types TypeScript mis a jour
- `funds/summary-usd/[fondId]/FundSubView.tsx` : idem
- Commits : API `38c716a`, frontend `e13eded`

### Classements relances (2026-05-22 ~21:10)

- classementmysql : OK ("finishrank"), 504 Nginx timeout mais batch complete
- classementeur : OK ("finishrank")
- classementusd : en cours

### Session 2026-06-01 — Audit complet + corrections securite + NaN fix

**LOT A (diagnostic complet)** : FAIT
- Audit complet de l'application (crons, data collection, API routes, frontend)
- Identification de tous les problemes classes par severite

**LOT B (corrections securite API)** : FAIT — commit `acb09b8` (pousse)
- `analytics.js` : parametrisation ClickHouse queries pour routes classement-historique (SQL injection fixee)
- `apigestionquartile.js` : suppression .toJSON() sur objets ClickHouse plain
- `sync_production.sh` : suppression credentials DB hardcodes, remplaces par sourcing .env
- `cron_daily_update.sh` + `cron_nigeria_weekly.sh` : ajout `set -e`

**LOT C (fix NaN className frontend)** : FAIT — commits `f8ae92e` + `8ab9da3` (pousses)
- `performance/[fondId]/page.tsx` : ajout helpers `perfColorClass`/`diffColorClass` (~40 cellules)
- `[fondId]/FundView.tsx` : 29 patterns fixes
- `summary-eur/FundSubView.tsx` : 29 patterns fixes
- `summary-usd/FundSubView.tsx` : 29 patterns fixes
- `portfolio/FundSubView.tsx` : 20 patterns fixes
- Total : 147 patterns coriges dans 5 fichiers
- Build OK (0 erreurs)

**LOT D (elimination eval() RCE)** : FAIT — commit `1187ccb` (pousse)
- `routes_vl.js` : 144 appels eval() elimines → remplaces par parseFloat() comparisons
- Vulnerabilite RCE critique : req.body.formData.value injecte directement dans eval()
- eval(key) variable lookup → remplacement par objet fieldValues

**LOT E (securite supplementaire API)** : FAIT — commits `2f320b5` + `8834c14` (pousses)
- `apigestionsavequotidien.js` : parametrisation ClickHouse SELECT dans calculateRank/calculateRankregional
- `cron_health_check.sh` : nouveau script cron monitoring quotidien (22h)
- `app.js` : rate limiting strict auth routes (10 req/15min) sur login/password
- 13 fichiers routes : ajout multer fileSize limit 5MB (etait illimite)

**Diagnostic data staleness (au 2026-06-01)** :
| Pays | Derniere VL | Retard | Automatisation |
|------|-------------|--------|----------------|
| MAROC | 2026-05-25 | 7j | Cron quotidien (ASFIM scraper) |
| TUNISIE | 2026-05-18 | 14j | Script import existe, PAS de cron (CMF CSV manuel) |
| NIGERIA | 2026-05-08 | 24j | Cron hebdo (SEC Python extractor) |
| UEMOA | 2025-10-15 | 229j | Script import existe, PAS de cron (BRVM XLSX manuel) |
| CEMAC | 2024-12-12 | 537j | AUCUN script, AUCUNE source identifiee |

**Diagnostic automatisation crons** :
- MAROC : OK (cron_daily_update.sh, quotidien 20h, ASFIM API)
- NIGERIA : OK (cron_nigeria_weekly.sh, lundi 10h, SEC Excel)
- Forex : OK (scrape_forex_import.js, quotidien dans cron_daily_update.sh)
- EUR/USD recalc : OK (cron_daily_eur_usd.sh, quotidien 21h30)
- TUNISIE : MANQUE — import_vl_tunisie_cmf.js existe mais necessite CSV telecharges manuellement (CMF n'a pas d'API publique)
- UEMOA : MANQUE — import_vl_uemoa.js existe mais necessite XLSX telecharge manuellement (BRVM)
- CEMAC : MANQUE — aucun script d'import, aucune source de donnees identifiee

### Etat Git local (post session 2026-06-01)
- **api_opcv**: commit `8834c14`, branche `claude/code-review-improvements-ikvuj`, sync origin
- **front_end_opcvm**: commit `8ab9da3` + docs update en cours, branche `claude/code-review-improvements-ikvuj`

### Prochaine action recommandee
1. **PRIORITE 1 — Deployer API en production** :
   ```bash
   cd /var/www/.../api && git pull --rebase origin claude/code-review-improvements-ikvuj && pm2 restart api-monolith
   ```
   Corrections deployes : eval() RCE, SQL injection, rate limiting, multer limits
2. **PRIORITE 2 — Deployer frontend en production** :
   ```bash
   cd /var/www/.../frontend && git pull --rebase origin claude/code-review-improvements-ikvuj && npm run build && pm2 restart fundafrique-frontend
   ```
   Corrections deployes : NaN className (147 cellules), TypeScript types
3. **PRIORITE 3 — Ajouter cron_health_check.sh** dans crontab production :
   ```
   0 22 * * * /var/www/.../api/scripts/cron/cron_health_check.sh >> /var/log/africafunds_health.log 2>&1
   ```
4. B5: Securisation ttyd Nginx (auth Basic + IP whitelist)
5. B6: Nettoyer 244 VL Nigeria extremes
6. Backfill performance_historique ClickHouse
7. Investiguer sources CMF Tunisie (scraper web possible?) et BRVM UEMOA pour automatisation
8. Identifier source COSUMAF pour CEMAC

### A ne pas faire
- Ne pas demarrer les microservices de Phase 6 (gateway, auth-service, etc.)
- Ne pas activer worker-scheduler sans desactiver les crons correspondants dans crontab
- Ne pas faire `pm2 start ecosystem.config.js` sans `--only`
- Ne pas modifier le .env de production

---

## PLAN DE REPRISE PRODUCTION — A EXECUTER APRES VALIDATION

> Ce plan est un guide. Aucune etape ne doit etre executee sans validation explicite de l'utilisateur.
> Chaque etape doit etre validee avant de passer a la suivante.

### Prerequis d'acces production
- Acces SSH au serveur `africafunds.chainsolutions.fr`
- Chemin API : `/var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/api`
- Chemin Frontend : `/var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend`
- Utilisateur MySQL : `fund_opcvm` (credentials dans `.env` sur le serveur)
- PM2 processes : `api-monolith` (id:10), `fundafrique-frontend` (id:11)

### Variables d'environnement necessaires (deja dans .env sur le serveur)
- `DB_HOST=127.0.0.1` / `DB_USER=fund_opcvm` / `DB_PASSWORD` / `DB_NAME=fund_opcvm`
- `API_URL=http://localhost:3005`
- `SCHEDULER_LOG_DIR=/var/log`
- `WORKER_POLL_INTERVAL=10000` / `WORKER_LOCK_TIMEOUT=300000` / `WORKER_ID=recalc-1`
- `IMPORT_POLL_INTERVAL=30000`

### Sauvegardes a faire AVANT toute action
1. **Backup base de donnees** : `mysqldump -u fund_opcvm -p fund_opcvm > backup_fund_opcvm_$(date +%Y%m%d_%H%M%S).sql`
2. **Snapshot Git serveur** : `cd api && git stash && git log --oneline -5` (noter le commit actuel)
3. **Snapshot Git frontend** : `cd frontend && git stash && git log --oneline -5`
4. **Copie crontab** : `crontab -l > crontab_backup_$(date +%Y%m%d).txt`
5. **PRODUCTION_STATE.json** : copier le fichier actuel comme reference

### Ordre recommande des actions (par groupes independants)

#### GROUPE A — Deploiement code (prerequis : sauvegardes faites)

**A1. Deployer api_opcv**
```bash
cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/api
git stash
git pull --rebase origin claude/code-review-improvements-ikvuj
git stash pop
pm2 restart api-monolith
```
**Validation A1** : `curl -s http://localhost:3005/health | python3 -m json.tool` → doit retourner `status: ok`
**Validation A1 bis** : `curl -s http://localhost:3005/health/detailed | python3 -m json.tool` → verifier tables, counts
**Rollback A1** : `git checkout <commit_avant>` puis `pm2 restart api-monolith`

**A2. Deployer front_end_opcvm**
```bash
cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/frontend
git stash
git pull --rebase origin claude/code-review-improvements-ikvuj
git stash pop
npm run build
pm2 restart fundafrique-frontend
```
**Validation A2** : naviguer sur `https://africafunds.chainsolutions.fr/home`, verifier page d'accueil
**Validation A2 bis** : ouvrir une fiche fonds → verifier "Classement au DD/MM/YYYY" (format francais)
**Validation A2 ter** : ouvrir un fonds en EUR et USD → verifier les dates formatees
**Rollback A2** : `git checkout <commit_avant>` puis `npm run build && pm2 restart fundafrique-frontend`

#### GROUPE B — Tables et workers (prerequis : GROUPE A deploye et valide)

**B1. Creer les tables recalc**
```bash
cd /var/www/vhosts/chainsolutions.fr/africafunds.chainsolutions.fr/api
node scripts/migrations/create_recalc_tables.js --execute
```
**Validation B1** : `mysql -u fund_opcvm -p fund_opcvm -e "SHOW TABLES LIKE 'recalc%';"` → 4 tables
**Rollback B1** : `DROP TABLE IF EXISTS recalc_audit, recalc_jobs, recalc_dependencies, recalc_events;`

**B2. Demarrer les workers (PAS les microservices)**
```bash
pm2 start ecosystem.config.js --only worker-recalculation
pm2 start ecosystem.config.js --only worker-data-import
```
**Validation B2** : `pm2 status` → les deux workers en status `online`
**Validation B2 bis** : `pm2 logs worker-recalculation --nostream --lines 5` → pas d'erreur fatale
**Rollback B2** : `pm2 stop worker-recalculation worker-data-import`

**B3. Executer fix 11 fonds sans classification**
```bash
node scripts/fix/fix_11_fonds_sans_classification.js
```
**Validation B3** : le script affiche le nombre de fonds corriges
**Rollback B3** : aucun (le script ne fait que remplir des champs NULL)

#### GROUPE C — ClickHouse (prerequis : GROUPE B valide, priorite BASSE)

**C1. Verifier les ressources serveur**
```bash
free -h        # Au moins 2 Go RAM disponible
df -h /        # Au moins 10 Go disque disponible
```

**C2. Installer ClickHouse** (si ressources suffisantes)
```bash
# Voir https://clickhouse.com/docs/en/install pour Ubuntu/Debian
# Apres installation : systemctl start clickhouse-server
```
**Validation C2** : `clickhouse-client -q "SELECT 1"` → retourne 1

**C3. Creer les tables ClickHouse**
```bash
node scripts/migrations/create_clickhouse_tables.js --execute
```

**C4. Backfill classements historiques**
```bash
node scripts/recalc/recalc_classement_historique.js --full
```
**Validation C4** : le script affiche le nombre de classements inseres

#### GROUPE D — Migration crontab (prerequis : GROUPES A+B valides, PAS avant)

**D1. Verifier crontab actuelle**
```bash
crontab -l
```
**Comparer les chemins des scripts avec les nouveaux chemins dans `scripts/`**

**D2. Mettre a jour les chemins crontab** (si les scripts ont ete deplaces)
- Anciens chemins directs → nouveaux chemins dans `scripts/cron/`, `scripts/monitoring/`
- NE PAS supprimer de crons tant que worker-scheduler n'est pas valide en production

**D3. Activer progressivement worker-scheduler** (optionnel, migration graduelle)
```bash
# Via API :
curl -X POST http://localhost:3005/api/admin/scheduler/toggle -H 'Content-Type: application/json' -d '{"taskName":"cron-health-check","enabled":true}'
# Puis verifier dans les logs que le scheduler execute correctement
# Seulement apres validation : activer les autres taches et desactiver les crons correspondants
```

### Points a ne pas faire sans validation explicite
- Ne PAS demarrer les microservices Phase 6 (gateway, auth-service, fund-service, etc.)
- Ne PAS faire `pm2 start ecosystem.config.js` sans `--only` (demarrerait tout y compris les microservices)
- Ne PAS supprimer les crons avant validation du worker-scheduler
- Ne PAS installer ClickHouse si les ressources serveur sont insuffisantes
- Ne PAS modifier le .env de production
- Ne PAS executer de scripts de fix/import sans backup DB prealable
