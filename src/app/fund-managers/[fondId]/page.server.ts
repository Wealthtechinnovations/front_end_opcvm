import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    const societeNom = params.fondId.replace(/-/g, ' ');
    const response = await fetch(`${urlconstant}/api/getsocieteidmeta/${societeNom}`);
    const fund = await response.json();

    const { nom, pays } = fund.data.societe;

    return {
        title: `${nom} - OPCVM gérés par cette société de gestion | Fundafrique`,
        description: `Retrouvez tous les fonds OPCVM gérés par ${nom} (${pays}) : répartition par classe d'actifs, encours sous gestion et classements des fonds.`,
        alternates: {
            canonical: `${urlsite}/fund-managers/${params.fondId}`,
        },
        openGraph: {
            title: `${nom} - Société de gestion ${pays} | Fundafrique`,
            description: `Tous les OPCVM gérés par ${nom} : performances, classements et analyses.`,
            url: `${urlsite}/fund-managers/${params.fondId}`,
            type: 'website',
        },
    };
}
