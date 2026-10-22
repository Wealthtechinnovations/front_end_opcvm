import { Metadata } from "next";
import { urlsite } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Actualités OPCVM Afrique | Fundafrique",
    description: "Restez informé avec les dernières actualités sur les OPCVM en Afrique. Analyses, tendances et nouvelles des fonds d'investissement africains.",
    alternates: {
        canonical: `${urlsite}/news`,
    },
    openGraph: {
        title: "Actualités OPCVM Afrique | Fundafrique",
        description: "Les dernières actualités et analyses sur les fonds d'investissement africains.",
        url: `${urlsite}/news`,
        type: "website",
    },
};
