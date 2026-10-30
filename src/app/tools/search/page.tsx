import type { Metadata } from 'next';
import { urlsite } from '@/lib/constants';
import RechercheView from './RechercheView';

/**
 * Meme situation que le comparateur : page **soumise au sitemap** et rendant le
 * titre generique, parce qu'elle etait elle-meme `"use client"`. Composant
 * deplace par `git mv` (renommage, identique a l'octet, aucun import relatif).
 * Le suffixe « | Fundafrique » vient du gabarit du layout.
 */
export const metadata: Metadata = {
    title: "Recherche d'OPCVM Africains",
    description:
        "Recherchez parmi les OPCVM africains par pays, société de gestion, catégorie, devise ou régulateur (AMMC, CMF Tunisie, SEC Nigeria, CREPMF UEMOA, COSUMAF CEMAC), avec performances et ratios de risque.",
    alternates: { canonical: `${urlsite}/tools/search` },
    openGraph: {
        title: "Recherche d'OPCVM Africains | Fundafrique",
        description:
            "Recherchez parmi les OPCVM africains par pays, société de gestion, catégorie, devise ou régulateur.",
        url: `${urlsite}/tools/search`,
        type: 'website',
    },
};

export const dynamic = 'force-dynamic';

export default RechercheView;
