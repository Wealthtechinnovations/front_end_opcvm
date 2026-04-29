import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    const paysName = params.fondId.replace(/-/g, ' ');
    const response = await fetch(`${urlconstant}/api/getpaysidmeta/${paysName}`);
    const fund = await response.json();

    const { pays, nomdelabourse } = fund.data.pays;

    return {
        title: `Statistiques OPCVM ${pays} | Fundafrique`,
        description: `Statistiques détaillées des OPCVM au ${pays} : répartition par classe d'actifs, encours et performances sur la place financière ${nomdelabourse}.`,
        alternates: {
            canonical: `${urlsite}/pays/statistique/${params.fondId}`,
        },
        openGraph: {
            title: `Statistiques OPCVM ${pays} | Fundafrique`,
            description: `Analyses statistiques des OPCVM du ${pays}.`,
            url: `${urlsite}/pays/statistique/${params.fondId}`,
            type: 'website',
        },
    };
}
