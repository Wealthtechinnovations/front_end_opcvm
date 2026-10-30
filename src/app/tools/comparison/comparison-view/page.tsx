import type { Metadata } from 'next';
import ComparaisonvueView from './ComparaisonvueView';

/**
 * Vue de RESULTAT du comparateur : son contenu depend entierement de la
 * selection de fonds faite a l'etape precedente. Elle n'est **pas** au sitemap,
 * et c'est coherent.
 *
 * `index: false, follow: true`, deliberement et pour la meme raison que les
 * etapes du questionnaire (cf. `src/app/robots.ts`) : sans selection, cette
 * page n'affiche aucune comparaison. L'indexer ferait capter des requetes de
 * comparaison par une page vide, au detriment du comparateur lui-meme. Les
 * liens continuent d'etre suivis.
 *
 * Le titre reste utile — il s'affiche dans l'onglet et au partage.
 */
export const metadata: Metadata = {
    title: 'Comparaison détaillée d’OPCVM',
    description:
        "Comparaison détaillée des OPCVM sélectionnés : valeur liquidative, performances par période, ratios de risque et benchmark.",
    robots: { index: false, follow: true },
};

export const dynamic = 'force-dynamic';

export default ComparaisonvueView;
