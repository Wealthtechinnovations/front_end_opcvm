import { urlconstant, urlsite } from "@/app/constants";
import { FundsResponse, Pays } from "@/models/Fund";
import { generateSlug } from "@/lib/utils";

export async function generateStaticParams() {
    const response = await fetch(`${urlconstant}/api/getPays`);
    const { data }: FundsResponse = await response.json();
    return data.paysOptions.map((pays: Pays) => ({
        fondId: generateSlug(pays.value),
    }));
}

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    const paysName = params.fondId.replace(/-/g, ' ');
    const response = await fetch(`${urlconstant}/api/getpaysidmeta/${paysName}`);
    const fund = await response.json();

    const { pays, nomdelabourse } = fund.data.pays;

    return {
        title: `OPCVM du ${pays} | Fundafrique`,
        description: `Liste complète des fonds OPCVM au ${pays}. Place financière ${nomdelabourse} : performances, VL et classements.`,
        alternates: {
            canonical: `${urlsite}/pays/Opcvm/${params.fondId}`,
        },
        openGraph: {
            title: `OPCVM ${pays} | Fundafrique`,
            description: `Tous les fonds OPCVM du ${pays}.`,
            url: `${urlsite}/pays/Opcvm/${params.fondId}`,
            type: 'website',
        },
    };
}
