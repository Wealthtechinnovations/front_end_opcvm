import type { Metadata } from 'next';
import { urlsite } from '@/lib/constants';
import ComparaisonView from './ComparaisonView';

/**
 * Le comparateur etait **soumis au sitemap** (mesure du 2026-10-30) tout en
 * rendant le titre generique « Fundafrique - Plateforme OPCVM Africains » : une
 * URL proposee a l'indexation sans rien qui la decrive.
 *
 * Il etait lui-meme `"use client"`, et un composant client ne peut pas porter
 * de metadonnees — meme cause que la page Performances. Le composant est
 * deplace par `git mv` dans `ComparaisonView.tsx` (renommage, donc identique a
 * l'octet, sans aucun import relatif) et cet obus serveur porte les
 * metadonnees. Le suffixe « | Fundafrique » est ajoute par le gabarit du
 * layout : il ne doit PAS etre repete ici.
 */
export const metadata: Metadata = {
    title: "Comparateur d'OPCVM Africains",
    description:
        "Comparez les OPCVM africains côte à côte : valeur liquidative, performances YTD, 1 an, 3 ans et 5 ans, ratios de risque, catégorie et benchmark, en devise locale, en EUR ou en USD.",
    alternates: { canonical: `${urlsite}/tools/comparison` },
    openGraph: {
        title: "Comparateur d'OPCVM Africains | Fundafrique",
        description:
            "Comparez les OPCVM africains côte à côte : performances, ratios de risque et benchmarks, en devise locale, en EUR ou en USD.",
        url: `${urlsite}/tools/comparison`,
        type: 'website',
    },
};

export const dynamic = 'force-dynamic';

export default ComparaisonView;
