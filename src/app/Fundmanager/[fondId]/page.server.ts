import { urlconstant, urlsite } from "@/app/constants";
import { FundsResponse, Societe } from "@/models/Fund";
import { generateSlug } from "@/lib/utils";

export async function generateStaticParams() {
    const response = await fetch(`${urlconstant}/api/getSocietes`);
    const { data }: FundsResponse = await response.json();
    return data.societes.map((societe: Societe) => ({
        fondId: societe.slug || generateSlug(societe.name),
    }));
}

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    const societeNom = params.fondId.replace(/-/g, ' ');
    const response = await fetch(`${urlconstant}/api/getsocieteidmeta/${societeNom}`);
    const fund = await response.json();

    const { nom, pays } = fund.data.societe;

    return {
        title: `${nom} - OPCVM gérés par cette société de gestion | Fundafrique`,
        description: `Retrouvez tous les fonds OPCVM gérés par ${nom} (${pays}) : répartition par classe d'actifs, encours sous gestion et classements des fonds.`,
        alternates: {
            canonical: `${urlsite}/Fundmanager/${params.fondId}`,
        },
        openGraph: {
            title: `${nom} - Société de gestion ${pays} | Fundafrique`,
            description: `Tous les OPCVM gérés par ${nom} : performances, classements et analyses.`,
            url: `${urlsite}/Fundmanager/${params.fondId}`,
            type: 'website',
        },
    };
}
