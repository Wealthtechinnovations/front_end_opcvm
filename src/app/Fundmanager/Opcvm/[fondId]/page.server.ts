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
        title: `OPCVM gérés par ${nom} ${pays} | Fundafrique`,
        description: `Liste complète des OPCVM gérés par ${nom} (${pays}) : performances, VL et classements.`,
        alternates: {
            canonical: `${urlsite}/Fundmanager/Opcvm/${params.fondId}`,
        },
        openGraph: {
            title: `OPCVM de ${nom} | Fundafrique`,
            description: `Tous les fonds OPCVM de la société ${nom}.`,
            url: `${urlsite}/Fundmanager/Opcvm/${params.fondId}`,
            type: 'website',
        },
    };
}
