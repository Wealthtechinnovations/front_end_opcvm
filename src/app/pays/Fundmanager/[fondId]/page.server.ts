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
        title: `Sociétés de gestion au ${pays} | Fundafrique`,
        description: `Liste des sociétés de gestion de fonds au ${pays}. Place financière ${nomdelabourse}.`,
        alternates: {
            canonical: `${urlsite}/pays/Fundmanager/${params.fondId}`,
        },
        openGraph: {
            title: `Sociétés de gestion ${pays} | Fundafrique`,
            description: `Sociétés de gestion de fonds OPCVM au ${pays}.`,
            url: `${urlsite}/pays/Fundmanager/${params.fondId}`,
            type: 'website',
        },
    };
}
