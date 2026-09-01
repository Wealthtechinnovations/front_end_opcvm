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
        title: `Statistiques OPCVM ${pays} | Fundafrique`,
        description: `Statistiques détaillées des OPCVM au ${pays} : répartition par classe d'actifs, encours et performances sur la place financière ${nomdelabourse}.`,
        alternates: {
            canonical: `${urlsite}/countries/statistique/${params.fondId}`,
        },
        openGraph: {
            title: `Statistiques OPCVM ${pays} | Fundafrique`,
            description: `Analyses statistiques des OPCVM du ${pays}.`,
            url: `${urlsite}/countries/statistique/${params.fondId}`,
            type: 'website',
        },
    };
}
