import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { paysId: string } }) {
    const paysName = params.paysId.replace(/-/g, ' ');

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
        title: `${pays} - OPCVM et sociétés de gestion | Fundafrique`,
        description: `Retrouvez tous les OPCVM et sociétés de gestion du ${pays}, place financière ${nomdelabourse}. Graphiques de répartition, encours sous gestion et classements.`,
        alternates: {
            canonical: `${urlsite}/pays/${params.paysId}`,
        },
        openGraph: {
            title: `OPCVM ${pays} | Fundafrique`,
            description: `OPCVM et sociétés de gestion enregistrés au ${pays}.`,
            url: `${urlsite}/pays/${params.paysId}`,
            type: 'website',
        },
    };
}
