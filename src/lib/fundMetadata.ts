import { urlconstant, urlsite } from "@/lib/constants";

/**
 * Metadonnees des fiches fonds — une seule implementation pour les sept pages.
 *
 * POURQUOI CE MODULE EXISTE. `generateMetadata` etait recopie a l'identique dans
 * sept `page.server.ts` (fiche locale, EUR, USD, historique, portefeuille,
 * documents, export VL). Deux defauts s'y trouvaient donc en sept exemplaires,
 * tous deux visibles en production et indexes par les moteurs — mesure du
 * 2026-10-28 sur `africafunds.chainsolutions.fr` :
 *
 *   1. `${code_ISIN}` interpole directement. Quand le champ est vide,
 *      JavaScript ecrit la chaine « null » :
 *        « AFRINVEST DOLLAR FUND NGN null NIGERIA - Synthese OPCVM Afrique »
 *      Portee mesuree : 451 fonds sur 1 260 n'ont pas d'ISIN, soit 35,8 %
 *      (321 Nigeria, 107 UEMOA, 7 Tunisie). Le « null » apparaissait aussi
 *      deux fois dans la meta description.
 *
 *   2. Le titre portait « | Fundafrique » alors que `layout.tsx` applique deja
 *      le gabarit `template: "%s | Fundafrique"`. Resultat sur 100 % des
 *      fiches : « … | Fundafrique | Fundafrique ». Les titres de repli
 *      souffraient du meme doublon.
 *
 * Corriger sept fichiers aurait reproduit la faute qu'ils portent. La
 * duplication du frontend est mesuree a 9 955 lignes (8,5 % du TSX) : chaque
 * correction est donc l'occasion de la reduire, pas de l'entretenir.
 *
 * REGLE TENUE ICI : un champ absent ne s'ecrit jamais dans une page. `presents`
 * ecarte `null`, `undefined`, la chaine vide, et aussi les chaines littarales
 * « null » et « undefined » — car une interpolation fautive en amont a pu les
 * deja figer en base.
 */

const presents = (...parts: Array<string | null | undefined>) =>
    parts
        .map(p => (p == null ? '' : String(p).trim()))
        .filter(p => p !== '' && p !== 'null' && p !== 'undefined')
        .join(' ');

/** Les champs du fonds, deja nettoyes, tels que les gabarits les attendent. */
export type ChampsFonds = {
    nom_fond: string;
    devise: string;
    pays: string;
    societe_gestion: string;
    /** ISIN seul, chaine vide s'il est absent. */
    isin: string;
    /** « (ISIN) » precede d'une espace, ou chaine vide. A coller apres le nom. */
    avecIsin: string;
    /** « , gere par X », ou chaine vide. */
    parGestion: string;
};

export type GabaritFiche = {
    /** Segment d'URL sous `/funds`, vide pour la fiche en devise locale. */
    chemin: string;
    /** Fin du titre, sans « | Fundafrique » : le layout l'ajoute. */
    suffixeTitre: string;
    /** Titre affiche quand le fonds est introuvable, sans « Fundafrique ». */
    repli: string;
    description: (f: ChampsFonds) => string;
    ogTitre: (f: ChampsFonds) => string;
    ogDescription: (f: ChampsFonds) => string;
};

export async function metadonneesFiche(fondId: string, g: GabaritFiche) {
    try {
        const response = await fetch(`${urlconstant}/api/getfondbyidmeta/${fondId}`);
        if (!response.ok) return { title: g.repli };
        const fund = await response.json();
        if (!fund?.funds) return { title: g.repli };

        const { nom_fond, devise, code_ISIN, pays, societe_gestion, slug } = fund.funds;
        const fundSlug = slug || fondId;
        const isin = presents(code_ISIN);
        const f: ChampsFonds = {
            nom_fond: presents(nom_fond),
            devise: presents(devise),
            pays: presents(pays),
            societe_gestion: presents(societe_gestion),
            isin,
            avecIsin: isin ? ` (${isin})` : '',
            parGestion: presents(societe_gestion) ? `, géré par ${presents(societe_gestion)}` : '',
        };
        const url = `${urlsite}/funds/${g.chemin ? `${g.chemin}/` : ''}${fundSlug}`;

        return {
            title: `${presents(f.nom_fond, f.devise, f.isin, f.pays)} - ${g.suffixeTitre}`,
            description: g.description(f),
            alternates: { canonical: url },
            openGraph: {
                // openGraph.title echappe au gabarit du layout : le suffixe
                // « | Fundafrique » y reste volontaire.
                title: g.ogTitre(f),
                description: g.ogDescription(f),
                url,
                type: 'website' as const,
            },
        };
    } catch {
        return { title: g.repli };
    }
}
