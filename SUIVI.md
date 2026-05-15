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

## Points en cours / a faire

### PHASE 2 - Base de donnees: Nettoyage avance + calculs
**Priorite: HAUTE**

#### 2A. Nettoyage VL restant
- [ ] Nettoyer 5 fonds avec VL extremes (meme probleme actif net vs VL unitaire que BRIDGE):
  - FCP TRESO MONEA, FCP BOA RENDEMENT, FCP ECOBANK UEMOA OBLIGATAIRE, SICAV ABDOU DIOUF, FCP SOGELIQUID
- [ ] Corriger 31 VL avec date=0000-00-00 (supprimer ou corriger la date)
- [ ] Verifier coherence VL: detecter les series avec variations >50% d'un jour a l'autre

#### 2B. Donnees statiques manquantes sur les fonds
- [ ] Peupler `forme_juridique` (FCP/SICAV) a partir du prefixe du nom du fond
- [ ] Peupler `categorie_globale` depuis classification existante ou nom du fond (Obligataire, Actions, Monetaire, Diversifie)
- [ ] Peupler `categorie_national` depuis classification ou pays
- [ ] Peupler `categorie_libelle` la ou vide (depuis classification ou categorie_globale)
- [ ] Peupler `date_premiere_vl` depuis MIN(date) des valorisations pour chaque fond
- [ ] Peupler `montant_premier_vl` depuis la premiere VL de chaque fond
- [ ] Peupler `montant_actif_net` depuis la derniere VL si disponible
- [ ] Corriger `periodicite` (detecter depuis frequence reelle des VL: quotidien, hebdomadaire, mensuel)

#### 2C. Forex manquant
- [ ] Importer EUR/NGN et USD/NGN (necessaire quand VL Nigeria arrivent)
- [ ] Generer toutes les paires croisees manquantes (MAD/EUR, TND/EUR, GHS/USD, KES/USD, ZAR/USD, EGP/USD)
- [ ] Scraping automatique des taux de change (source: ECB, fixer.io, ou API gratuite)

#### 2D. Calculs batch (tables vides)
- [ ] Remplir `performences_eurs` (0 lignes) - calcul perf en EUR pour chaque fond
- [ ] Remplir `performences_usds` (0 lignes) - calcul perf en USD pour chaque fond
- [ ] Remplir `classementfonds_eurs` - classement par performance EUR
- [ ] Remplir `classementfonds_usds` - classement par performance USD
- [ ] Remplir `rendements` (0 lignes) - rendements par periode
- [ ] Remplir `portefeuille_base100s` (0 lignes) - courbes base 100

#### 2E. Taux sans risque (TSR)
- [ ] Importer TSR Tunisie: TMM (Taux du Marche Monetaire) depuis BCT
- [ ] Importer TSR UEMOA: taux directeur BCEAO
- [ ] Importer TSR CEMAC: taux directeur BEAC
- [ ] Importer TSR Nigeria: MPR depuis CBN
- [ ] TSR Maroc: deja present dans la base

#### 2F. Nigeria VL
- [ ] Preparer script d'import Excel SEC Nigeria (weekly NAV)
- [ ] Activer les 150 fonds Nigeria une fois VL importees
- [ ] Generer EUR/NGN et USD/NGN

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
- [ ] Endpoint manquant `/api/getallfondsanomalie` (appele par country-panel/anomalies mais n'existe pas)

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

## Historique des scripts de migration
| Script | Date | Description | Statut |
|--------|------|-------------|--------|
| `diagnostic_db.js` | 2026-05-14 | Audit complet 63 tables, 21 sections | Execute |
| `fix_database_phase1.js` | 2026-05-14 | Orphelins, FK societe_id, activation, VL, forex, statique | Execute en prod |
| `20260514000001-add-societe-id-fk.js` | 2026-05-14 | Migration Sequelize societe_id | Commite |
