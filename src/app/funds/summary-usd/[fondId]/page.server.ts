import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    try {
        const response = await fetch(`${urlconstant}/api/getfondbyidmeta/${params.fondId}`);
        const fund = await response.json();

        const { nom_fond, devise, code_ISIN, pays, societe_gestion, slug } = fund.funds;
        const fundSlug = slug || params.fondId;

        return {
            title: `${nom_fond} ${devise} ${code_ISIN} ${pays} - Synthèse USD OPCVM Afrique | Fundafrique`,
            description: `Synthèse en USD du fonds OPCVM ${nom_fond} (${code_ISIN}) du ${pays}, géré par ${societe_gestion} : VL, performances et ratios de risque convertis en dollars sur Fundafrique.`,
            alternates: {
                canonical: `${urlsite}/funds/summary-usd/${fundSlug}`,
            },
            openGraph: {
                title: `${nom_fond} - Synthèse USD OPCVM ${pays} | Fundafrique`,
                description: `Synthèse en USD du fonds ${nom_fond} (${code_ISIN}) : valeur liquidative, performances et ratios de risque.`,
                url: `${urlsite}/funds/summary-usd/${fundSlug}`,
                type: 'website',
            },
        };
    } catch {
        return { title: 'Synthèse USD - Fundafrique - OPCVM Afrique' };
    }
}
