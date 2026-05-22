# CODE_REVIEW — Audit technique et dette technique

## Risques critiques

### 1. Injection SQL dans analytics.js
- Fichier: src/routes/analytics.js
- Probleme: Interpolation directe de parametres dans les requetes ClickHouse
- Impact: Injection SQL potentielle
- Priorite: HAUTE
- Recommandation: Utiliser des requetes parametrees

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

### 7. 11 fonds sans classification
- Probleme: 11 fonds avec categorie_national = NULL
- Recommandation: Identifier et corriger manuellement

### 8. NaN dans affichage performances
- Probleme: Certaines performances affichent NaN% sur le frontend
- Recommandation: Ajouter validation cote API et optional chaining cote frontend

### 9. Gateway microservices non active
- Fichier: services/gateway/index.js + serviceRegistry.js
- Probleme: Architecture microservices preparee mais non utilisee en production (monolithe actif)
- Recommandation: Documenter comme roadmap, ne pas activer sans migration complete
