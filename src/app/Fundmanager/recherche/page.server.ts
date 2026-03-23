import { urlsite } from "@/app/constants";

export async function generateMetadata() {
    return {
        title: 'Sociétés de gestion OPCVM en Afrique | Fundafrique',
        description: 'Recherchez les sociétés de gestion de fonds OPCVM en Afrique : répartition par classe d\'actifs, encours sous gestion et classements des fonds.',
        alternates: {
            canonical: `${urlsite}/Fundmanager/recherche`,
        },
        openGraph: {
            title: 'Sociétés de gestion OPCVM en Afrique | Fundafrique',
            description: 'Recherchez les sociétés de gestion de fonds OPCVM en Afrique.',
            url: `${urlsite}/Fundmanager/recherche`,
            type: 'website',
        },
    };
}
