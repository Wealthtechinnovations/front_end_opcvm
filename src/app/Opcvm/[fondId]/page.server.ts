import { urlconstant } from "@/app/constants";
import { Fund, FundsResponse } from "@/models/Fund";

// Fonction pour générer des paramètres statiques pour les routes dynamiques
export async function generateStaticParams() {
    const response = await fetch(`${urlconstant}/api/searchFunds`);
    const { data }: FundsResponse = await response.json();

    return data.funds.map((fund: Fund) => ({
        fondId: fund.value.toString(), // Assurez-vous que le paramètre correspond à votre route dynamique
    }));
}

// Fonction pour générer les métadonnées pour le SEO
export async function generateMetadata({ params }: { params: { fondId: any } }) {
    const response = await fetch(`${urlconstant}/api/getfondbyidmeta/${params.fondId}`);
    const fund = await response.json();
    console.log(fund)
    console.log("fundssss")

    return {
        title: `${fund.funds.nom_fond} ${fund.funds.devise} ${fund.funds.code_ISIN} ${fund.funds.pays} - synthèse OPCVM Afrique - Fundafrique`,
        description: `Toutes les informations sur le fonds  du ${fund.funds.pays} OPCVM ${fund.funds.nom_fond} ${fund.funds.code_ISIN} ${fund.funds.devise}, gérer par ${fund.funds.societe_gestion} : VL, performances, analyses, classement, graphique historique, et ratios de risque sur Fundafrique`,
        canonical: `https://funds.chainsolutions.fr/Opcvm/${params.fondId}`,
    };
}
