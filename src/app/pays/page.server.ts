import { urlconstant } from "@/app/constants";
import { Fund, FundsResponse } from "@/models/Fund";

// Fonction pour générer des paramètres statiques pour les routes dynamiques
export async function generateStaticParams() {
    const response = await fetch(`${urlconstant}/api/getpays`);
    const { data }: FundsResponse = await response.json();
    return data.paysOptions.map((fund: Fund) => ({
        nom: fund.value.toString(), // Assurez-vous que le paramètre correspond à votre route dynamique
    }));
}

// Fonction pour générer les métadonnées pour le SEO
export async function generateMetadata({ params }: { params: { fondId: any } }) {
 
    return {
        title: `Rechercher  des OPCVM et des sociétés de gestion enregistrés par pays`,
        description: `Retrouvez toutes les informations, les données et les descriptions concernant les sociétés de gestion et  les OPCVM investis dans des titres negociables sur la Place financiere  Vous pouvez consulter pour chaque société de gestion, les Graphiques  de répartition du nombre de fonds gérés par classe d'actifs,les Graphiques de  répartition des encours sous gestion  et les classements des fonds`,
        keywords: `OPCVM AFRIQUE, OPCVM  , collective investment scheme , collective investment scheme ,Funds managers ,Asset management company  ,Asset management company  `,
        canonical: `https://funds.chainsolutions.fr/pays/`,
    };
}
