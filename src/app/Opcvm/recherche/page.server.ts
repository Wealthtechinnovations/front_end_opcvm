import { urlsite } from "@/app/constants";

export async function generateMetadata() {
    return {
        title: 'Rechercher des OPCVM en Afrique | Fundafrique',
        description: 'Recherchez et comparez les fonds OPCVM africains : VL, performances, analyses, classement, graphique historique et ratios de risque sur Fundafrique.',
        alternates: {
            canonical: `${urlsite}/Opcvm/recherche`,
        },
        openGraph: {
            title: 'Rechercher des OPCVM en Afrique | Fundafrique',
            description: 'Recherchez et comparez les fonds OPCVM africains par société de gestion, pays et catégorie.',
            url: `${urlsite}/Opcvm/recherche`,
            type: 'website',
        },
    };
}
