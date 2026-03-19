import { Metadata } from "next";
import { urlsite } from "@/app/constants";

export const metadata: Metadata = {
    title: "Fundafrique - OPCVM Afrique : Guide Complet des Fonds d'Investissement",
    description: "Découvrez notre sélection d'OPCVM en Afrique pour optimiser votre portefeuille d'investissement. Analyses, performances et classements des fonds africains.",
    alternates: {
        canonical: `${urlsite}/accueil`,
        languages: {
            'fr': '/fr',
        },
    },
    openGraph: {
        title: "Fundafrique - OPCVM Afrique : Guide Complet",
        description: "Découvrez notre sélection d'OPCVM en Afrique pour optimiser votre portefeuille d'investissement.",
        url: `${urlsite}/accueil`,
        type: "website",
        siteName: "Fundafrique",
    },
    twitter: {
        card: "summary_large_image",
    },
};
