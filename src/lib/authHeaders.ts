/**
 * En-tetes d'authentification pour les appels a l'API.
 *
 * POURQUOI CE MODULE EXISTE. Mesure du 2026-10-28 : l'API porte **39 routes qui
 * mutent** reellement la base (INSERT / UPDATE / DELETE), dont **35 sans aucune
 * authentification**. Les deux plus graves prennent un identifiant dans la
 * requete et agissent sans rien verifier :
 *
 *   POST /api/activate-user/:id   → `user.update({ active: 1 })` : active
 *                                   n'importe quel compte
 *   POST /api/generate-api-key    → cree une cle d'API pour n'importe quel
 *                                   `user_id` passe dans le corps
 *
 * Aucune attenuation n'existe : pas de `router.use()`, pas de garde global dans
 * `app.js` — seulement un plafond de debit, qui n'est pas de l'authentification
 * — et aucun controle dans le corps des gestionnaires.
 *
 * L'ORDRE DU CORRECTIF EST L'INVERSE DE L'INTUITION, et c'est une mesure qui
 * l'impose. Le frontend DETIENT un jeton (`tokenEnCours`, 131 usages) et 74
 * fichiers envoient deja un en-tete `Authorization`. Mais sur un echantillon de
 * 20 des routes concernees, **2 seulement** le portaient. Proteger le serveur
 * d'abord aurait casse 18 parcours sur 20.
 *
 * On ajoute donc l'en-tete cote client D'ABORD — ce qui est **purement additif
 * et sans effet** tant que le serveur l'ignore, donc deployable seul et sans
 * risque — puis on protege les routes serveur une par une.
 *
 * CHAINE D'AUTHENTIFICATION VERIFIEE, et non supposee :
 *   `panel/{admin,investor,management,distributor}/login` et
 *   `country-panel/login` appellent `POST /api/userlogin`, qui emet un JWT via
 *   `generateToken` (`src/middleware/auth.js`). Ce jeton est stocke sous
 *   `tokenEnCours`, et `authenticate` le verifie avec `verifyJwt` en exigeant
 *   exactement `Authorization: Bearer <jeton>`.
 *
 * REGLE TENUE : la lecture de `localStorage` est toujours gardee. Elle n'existe
 * pas au rendu serveur, et elle peut lever en navigation privee ou avec les
 * donnees de site bloquees. Une page ne doit jamais tomber parce qu'un jeton
 * est illisible — l'appel partira sans en-tete, et le serveur repondra 401,
 * ce qui est un echec explicite et non une page blanche.
 */

/** Le jeton courant, ou `null` si indisponible — jamais une exception. */
export const jetonCourant = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        const t = window.localStorage.getItem('tokenEnCours');
        return t && t.trim() !== '' ? t : null;
    } catch {
        return null;
    }
};

/**
 * En-tetes a fusionner dans un `fetch`.
 *
 * @param json ajoute `Content-Type: application/json` (defaut : true, car la
 *             quasi-totalite des appels mutants envoient un corps JSON). Passer
 *             `false` pour un envoi `FormData`, dont le navigateur doit fixer
 *             lui-meme le `Content-Type` avec sa frontiere multipart.
 *
 * L'en-tete `Authorization` n'est ajoute que si un jeton existe : envoyer
 * « Bearer null » serait pire que de ne rien envoyer, car le serveur
 * repondrait « token invalide » au lieu de « token requis ».
 */
export const enTetesAuth = (json = true): Record<string, string> => {
    const h: Record<string, string> = {};
    if (json) h['Content-Type'] = 'application/json';
    const t = jetonCourant();
    if (t) h.Authorization = `Bearer ${t}`;
    return h;
};
