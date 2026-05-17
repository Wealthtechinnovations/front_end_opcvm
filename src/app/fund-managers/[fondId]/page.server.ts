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
        title: `${nom} - OPCVM gérés par cette société de gestion | Fundafrique`,
        description: `Retrouvez tous les fonds OPCVM gérés par ${nom}${pays ? ` (${pays})` : ''} : répartition par classe d'actifs, encours sous gestion et classements des fonds.`,
        alternates: {
            canonical: `${urlsite}/fund-managers/${params.fondId}`,
        },
        openGraph: {
            title: `${nom}${pays ? ` - Société de gestion ${pays}` : ''} | Fundafrique`,
            description: `Tous les OPCVM gérés par ${nom} : performances, classements et analyses.`,
            url: `${urlsite}/fund-managers/${params.fondId}`,
            type: 'website',
        },
    };
}
