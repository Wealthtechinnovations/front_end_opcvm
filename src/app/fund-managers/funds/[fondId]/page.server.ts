import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    const societeNom = params.fondId.replace(/-/g, ' ');
    const response = await fetch(`${urlconstant}/api/getsocieteidmeta/${societeNom}`);
    const fund = await response.json();

    const { nom, pays } = fund.data.societe;

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
