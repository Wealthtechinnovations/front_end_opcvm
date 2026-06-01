# CODE_REVIEW — Audit technique et dette technique

## Risques critiques

### 1. ~~Injection SQL dans analytics.js~~ — CORRIGE (2026-06-01)
- Fichier: src/routes/analytics.js
- Probleme: Interpolation directe de parametres dans les requetes ClickHouse (classement-historique routes)
- Correction: Whitelist validation pour devise/date + requetes parametrees ClickHouse ({paramName:Type} + query_params)
- Commit: `acb09b8` (api_opcv)

### 2. Pas d'index UNIQUE sur valorisations(fund_id, date)
- Table: valorisations
- Probleme: Seul un index non-unique idx_valorisations_fund_id_date existe
- Impact: Doublons possibles, INSERT IGNORE inefficace
- Priorite: MOYENNE
- Recommandation: Ajouter un index UNIQUE apres nettoyage des doublons existants

### 3. Route classementmysql TRUNCATE destructif
- Fichier: src/routes/apigestionsavequotidien.js
- Probleme: /api/classementmysql fait TRUNCATE avant recalcul. Si interrompu, donnees perdues.
- Priorite: MOYENNE
- Recommandation: Utiliser une table temporaire ou un flag de version

## Dette technique

### 4. Aucun test automatise
- Impact: Regressions non detectees
- Recommandation: Ajouter tests unitaires sur les calculs financiers critiques

### 5. apigestionsavequotidien.js — fichier monolithique
- Taille: ~1800 lignes
- Recommandation: Deja partiellement refactorise (ranking.service.js). Continuer extraction.

### 6. performance_historique ClickHouse vide
- Table: performance_historique dans ClickHouse
- Probleme: Table creee mais jamais peuplee
- Recommandation: Implementer le backfill depuis MySQL

### 7. ~~11 fonds sans classification~~ — CORRIGE (2026-05-21)
- Correction: Tous les 1196 fonds classes (100% coverage)
- Voir tache A1 dans SUIVI.md

### 8. ~~NaN dans affichage performances~~ — CORRIGE (2026-06-01)
- Fichier: src/app/funds/performance/[fondId]/page.tsx
- Probleme: parseFloat(undefined) < 0 retourne false → cellules vides affichees en vert (text-success)
- Correction: Helpers `perfColorClass`/`diffColorClass` qui retournent '' pour NaN
- Commit: `f8ae92e` (front_end_opcvm)

### 10. Credentials hardcodes dans sync_production.sh — CORRIGE (2026-06-01)
- Fichier: scripts/deploy/sync_production.sh
- Probleme: Mot de passe DB en clair dans le script
- Correction: Remplacement par `source .env` + variables avec fallback
- Commit: `acb09b8` (api_opcv)

### 11. Manque d'automatisation data pour Tunisie, UEMOA, CEMAC
- TUNISIE: Script import existe (import_vl_tunisie_cmf.js) mais pas de scraper CMF automatise
- UEMOA: Script import existe (import_vl_uemoa.js) mais pas de scraper BRVM automatise
- CEMAC: Aucun script, aucune source identifiee (COSUMAF)
- Priorite: HAUTE
- Impact: Donnees UEMOA stales 229 jours, CEMAC 537 jours
- Recommandation: Investiguer APIs/sites regulateurs pour automatisation

### 9. Gateway microservices non active
- Fichier: services/gateway/index.js + serviceRegistry.js
- Probleme: Architecture microservices preparee mais non utilisee en production (monolithe actif)
- Recommandation: Documenter comme roadmap, ne pas activer sans migration complete

### 12. ~~eval() RCE dans routes_vl.js~~ — CORRIGE (2026-06-01)
- 144 appels eval() avec donnees utilisateur (req.body.formData.value)
- Remplacement par parseFloat() comparisons et objet fieldValues
- Commit: `1187ccb` (api_opcv)

### 13. ~~Multer sans limite de taille~~ — CORRIGE (2026-06-01)
- 13 fichiers routes avec `multer({ dest: 'uploads/' })` sans fileSize limit
- Ajout `limits: { fileSize: 5 * 1024 * 1024 }` (5MB)
- Commit: `8834c14` (api_opcv)

### 14. ~~Rate limiting insuffisant sur auth~~ — CORRIGE (2026-06-01)
- Routes login/password avaient seulement le rate limit global (200/15min)
- Ajout rate limit strict 10 req/15min sur /api/login, /api/userlogin, /api/forgot-password, /api/reset-password
- Commit: `8834c14` (api_opcv)

### 15. ClickHouse queries non parametrees dans apigestionsavequotidien.js (batch routes)
- INSERT INTO et ALTER TABLE UPDATE avec interpolation directe
- Risque: FAIBLE (donnees viennent de MySQL, pas d'input utilisateur)
- Recommandation: Refactorer vers client.insert() pour les INSERT (effort moyen)
- Les SELECT ont ete parametres (commit `2f320b5`)
