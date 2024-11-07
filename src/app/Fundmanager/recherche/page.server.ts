import { urlconstant } from "@/app/constants";
import { Fund, FundsResponse } from "@/models/Fund";

// Fonction pour générer des paramètres statiques pour les routes dynamiques
export async function generateStaticParams() {
    const response = await fetch(`${urlconstant}/api/getsocieterecherche`);
    const { data }: FundsResponse = await response.json();
    return data.societes.map((fund: Fund) => ({
        nom: fund.nom.toString(), // Assurez-vous que le paramètre correspond à votre route dynamique
    }));
}

// Fonction pour générer les métadonnées pour le SEO
export async function generateMetadata({ params }: { params: { nom: any } }) {

    return {
        title: ` Rechercher des OPCVM gérés par une société  `,
        description: `Retrouvez toutes les informations concernant les OPCVM gérés par la société de gestion,  Vous pouvez consulter pour chaque société de gestion, les Graphiques  de répartition du nombre de fonds gérés par classe d'actifs,les Graphique de  répartition des encours sous gestion  et les classements des fonds`,
        keywords: `OPCVM AFRIQUE, OPCVM  , collective investment scheme ,Funds managers ,Asset management company  `,
        canonical: `https://funds.chainsolutions.fr/Fundmanager/recherche`,
    };
}
