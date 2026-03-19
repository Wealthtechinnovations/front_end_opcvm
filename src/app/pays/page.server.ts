import { urlsite } from "@/app/constants";

export async function generateMetadata() {
    return {
        title: 'OPCVM par pays en Afrique | Fundafrique',
        description: 'Retrouvez les OPCVM et sociétés de gestion enregistrés dans chaque pays africain : répartition par classe d\'actifs, encours et classements.',
        alternates: {
            canonical: `${urlsite}/pays`,
        },
        openGraph: {
            title: 'OPCVM par pays en Afrique | Fundafrique',
            description: 'Explorez les fonds OPCVM par pays africain.',
            url: `${urlsite}/pays`,
            type: 'website',
        },
    };
}
