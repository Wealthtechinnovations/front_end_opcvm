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
        title: `Statistiques ${nom} ${pays} - Société de gestion | Fundafrique`,
        description: `Statistiques détaillées de la société de gestion ${nom} (${pays}) : répartition des fonds, encours et classements.`,
        alternates: {
            canonical: `${urlsite}/Fundmanager/statistique/${params.fondId}`,
        },
        openGraph: {
            title: `Statistiques ${nom} | Fundafrique`,
            description: `Analyses et statistiques de ${nom}.`,
            url: `${urlsite}/Fundmanager/statistique/${params.fondId}`,
            type: 'website',
        },
    };
}
