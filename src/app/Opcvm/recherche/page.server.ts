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
 

    return {
        title: ` Rechercher des OPCVM gérés par une société  `,
        description: `Toutes les informations sur des fonds , gérer par des sociétés: VL, performances, analyses, classement, graphique historique, et ratios de risque sur Fundafrique`,
        canonical: `https://funds.chainsolutions.fr/Opcvm/recherche`,
    };
}
