import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    const societeNom = params.fondId.replace(/-/g, ' ');

    let nom = societeNom;
    let pays = '';

    try {
        const response = await fetch(`${urlconstant}/api/getsocieteidmeta/${societeNom}`);
        if (response.ok) {
            const fund = await response.json();
            if (fund?.data?.societe) {
                nom = fund.data.societe.nom || societeNom;
                pays = fund.data.societe.pays || '';
            }
        }
    } catch {
        // Fall back to slug-derived name
    }

    return {
        title: `Statistiques ${nom} ${pays} - Société de gestion | Fundafrique`,
        description: `Statistiques détaillées de la société de gestion ${nom} (${pays}) : répartition des fonds, encours et classements.`,
        alternates: {
            canonical: `${urlsite}/fund-managers/statistique/${params.fondId}`,
        },
        openGraph: {
            title: `Statistiques ${nom} | Fundafrique`,
            description: `Analyses et statistiques de ${nom}.`,
            url: `${urlsite}/fund-managers/statistique/${params.fondId}`,
            type: 'website',
        },
    };
}
