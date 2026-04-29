import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    const response = await fetch(`${urlconstant}/api/getfondbyidmeta/${params.fondId}`);
    const fund = await response.json();

    const { nom_fond, devise, code_ISIN, pays, societe_gestion, slug } = fund.funds;
    const fundSlug = slug || params.fondId;

    return {
        title: `${nom_fond} ${devise} ${code_ISIN} ${pays} - Synthèse OPCVM Afrique | Fundafrique`,
        description: `Toutes les informations sur le fonds OPCVM ${nom_fond} (${code_ISIN}) du ${pays}, géré par ${societe_gestion} : VL, performances, analyses, classement, graphique historique et ratios de risque sur Fundafrique.`,
        alternates: {
            canonical: `${urlsite}/funds/${fundSlug}`,
        },
        openGraph: {
            title: `${nom_fond} - OPCVM ${pays} | Fundafrique`,
            description: `Analyse complète du fonds ${nom_fond} (${code_ISIN}) : valeur liquidative, performances et ratios de risque.`,
            url: `${urlsite}/funds/${fundSlug}`,
            type: 'website',
        },
    };
}
