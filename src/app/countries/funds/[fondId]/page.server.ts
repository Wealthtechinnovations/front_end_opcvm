import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    const paysName = params.fondId.replace(/-/g, ' ');
    const response = await fetch(`${urlconstant}/api/getpaysidmeta/${paysName}`);
    const fund = await response.json();

    const { pays, nomdelabourse } = fund.data.pays;

    return {
        title: `OPCVM du ${pays} | Fundafrique`,
        description: `Liste complète des fonds OPCVM au ${pays}. Place financière ${nomdelabourse} : performances, VL et classements.`,
        alternates: {
            canonical: `${urlsite}/pays/funds/${params.fondId}`,
        },
        openGraph: {
            title: `OPCVM ${pays} | Fundafrique`,
            description: `Tous les fonds OPCVM du ${pays}.`,
            url: `${urlsite}/pays/funds/${params.fondId}`,
            type: 'website',
        },
    };
}
