import { urlconstant } from "@/app/constants";
import { Fund, FundsResponse } from "@/models/Fund";

// Fonction pour générer des paramètres statiques pour les routes dynamiques
export async function generateStaticParams() {
    const response = await fetch(`${urlconstant}/api/getpays`);
    const { data }: FundsResponse = await response.json();
    return data.paysOptions.map((fund: Fund) => ({
        fondId: fund.value.toString(), // Assurez-vous que le paramètre correspond à votre route dynamique
    }));
}

// Fonction pour générer les métadonnées pour le SEO
export async function generateMetadata({ params }: { params: { fondId: any } }) {
    const response = await fetch(`${urlconstant}/api/getpaysidmeta/${params.fondId.replace(/-/g, ' ')}`);
    const fund = await response.json();
    console.log(fund)
    console.log("fundaaa",params.fondId);

    console.log("fundssss")

    return {
        title: ` ${fund.data.pays.pays} Liste des OPCVM et des sociétés de gestion enregistrés `,
        description: `Retrouvez toutes les informations, les données et les descriptions concernant les sociétés de gestion et  les OPCVM investis dans des titres negociables sur la Place financiere ${fund.data.pays.nomdelabourse} du pays: ${fund.data.pays.pays} Vous pouvez consulter pour chaque société de gestion, les Graphiques  de répartition du nombre de fonds gérés par classe d'actifs,les Graphiques de  répartition des encours sous gestion  et les classements des fonds`,
        keywords: `OPCVM AFRIQUE, OPCVM  ${fund.data.pays.pays},  ${fund.data.pays.pays}, OPCVM ${fund.data.pays.pays}, collective investment scheme ${fund.data.pays.pays}, collective investment scheme ${fund.data.pays.pays},Funds managers ${fund.data.pays.pays},Asset management company  ${fund.data.pays.pays},Asset management company  ${fund.data.pays.pays} `,
        canonical: `https://funds.chainsolutions.fr/pays/Opcvm/${params.fondId}`,
    };
}
