import { urlconstant, urlsite } from "@/app/constants";
import { FundsResponse, Pays } from "@/models/Fund";
import { generateSlug } from "@/lib/utils";

export async function generateStaticParams() {
    const response = await fetch(`${urlconstant}/api/getPays`);
    const { data }: FundsResponse = await response.json();
    return data.paysOptions.map((pays: Pays) => ({
        paysId: generateSlug(pays.value),
    }));
}

export async function generateMetadata({ params }: { params: { paysId: string } }) {
    const paysName = params.paysId.replace(/-/g, ' ');
    const response = await fetch(`${urlconstant}/api/getpaysidmeta/${paysName}`);
    const fund = await response.json();

    const { pays, nomdelabourse } = fund.data.pays;

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
