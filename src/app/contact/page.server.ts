import { Metadata } from "next";
import { urlsite } from "@/app/constants";

export const metadata: Metadata = {
    title: "Contact - Fundafrique | OPCVM Afrique",
    description: "Contactez l'équipe Fundafrique pour toute question sur les OPCVM en Afrique et l'investissement dans les fonds africains.",
    alternates: {
        canonical: `${urlsite}/contact`,
        languages: {
            'fr': '/fr',
        },
    },
    openGraph: {
        title: "Contact - Fundafrique",
        description: "Contactez-nous pour en savoir plus sur les OPCVM en Afrique.",
        url: `${urlsite}/contact`,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};
