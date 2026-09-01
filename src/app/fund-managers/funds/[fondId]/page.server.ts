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
        title: `OPCVM gérés par ${nom} ${pays} | Fundafrique`,
        description: `Liste complète des OPCVM gérés par ${nom} (${pays}) : performances, VL et classements.`,
        alternates: {
            canonical: `${urlsite}/fund-managers/funds/${params.fondId}`,
        },
        openGraph: {
            title: `OPCVM de ${nom} | Fundafrique`,
            description: `Tous les fonds OPCVM de la société ${nom}.`,
            url: `${urlsite}/fund-managers/funds/${params.fondId}`,
            type: 'website',
        },
    };
}
