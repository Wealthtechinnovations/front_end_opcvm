import { urlconstant } from "@/app/constants";
import { Fund, FundsResponse } from "@/models/Fund";

// Fonction pour générer des paramètres statiques pour les routes dynamiques
export async function generateStaticParams() {
    const response = await fetch(`${urlconstant}/api/getSocietes`);
    const { data }: FundsResponse = await response.json();
    return data.societes.map((fund: Fund) => ({
        fondId: fund.name.toString(), // Assurez-vous que le paramètre correspond à votre route dynamique
    }));
}

// Fonction pour générer les métadonnées pour le SEO
export async function generateMetadata({ params }: { params: { fondId: any } }) {
    const response = await fetch(`${urlconstant}/api/getsocieteidmeta/${params.fondId.replace(/-/g, ' ')}`);
    const fund = await response.json();
    console.log(params.fondId)
    console.log("fundaaa",params.fondId);

    console.log("fundssss")

    return {
        title: `Tous les OPCVM gérés par la société  ${fund.data.societe.nom} ${fund.data.societe.pays} `,
        description: `Retrouvez toutes les informations concernant les OPCVM gérés par la société de gestion ${fund.data.societe.nom} ${fund.data.societe.pays}  Vous pouvez consulter pour chaque société de gestion, les Graphiques  de répartition du nombre de fonds gérés par classe d'actifs,les Graphique de  répartition des encours sous gestion  et les classements des fonds`,
        keywords: `OPCVM AFRIQUE, OPCVM  ${fund.data.societe.pays},  ${fund.data.societe.nom}, OPCVM ${fund.data.societe.nom}, collective investment scheme ${fund.data.societe.nom}, collective investment scheme ${fund.data.societe.pays},Funds managers ${fund.data.societe.pays},Asset management company  ${fund.data.societe.pays},Asset management company  ${fund.data.societe.nom} `,
        canonical: `https://funds.chainsolutions.fr/Fundmanager/Opcvm/${params.fondId}`,
    };
}
