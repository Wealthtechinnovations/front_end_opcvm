import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    const paysName = params.fondId.replace(/-/g, ' ');

    let pays = paysName;
    let nomdelabourse = '';

    try {
        const response = await fetch(`${urlconstant}/api/getpaysidmeta/${paysName}`);
        if (response.ok) {
            const fund = await response.json();
            if (fund?.data?.pays) {
                pays = fund.data.pays.pays || paysName;
                nomdelabourse = fund.data.pays.nomdelabourse || '';
            }
        }
    } catch {
        // Fall back to slug-derived name
    }

    return {
        title: `Sociétés de gestion au ${pays} | Fundafrique`,
        description: `Liste des sociétés de gestion de fonds au ${pays}. Place financière ${nomdelabourse}.`,
        alternates: {
            canonical: `${urlsite}/pays/fund-managers/${params.fondId}`,
        },
        openGraph: {
            title: `Sociétés de gestion ${pays} | Fundafrique`,
            description: `Sociétés de gestion de fonds OPCVM au ${pays}.`,
            url: `${urlsite}/pays/fund-managers/${params.fondId}`,
            type: 'website',
        },
    };
}
