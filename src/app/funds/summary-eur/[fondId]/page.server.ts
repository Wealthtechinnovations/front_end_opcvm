import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    try {
        const response = await fetch(`${urlconstant}/api/getfondbyidmeta/${params.fondId}`);
        if (!response.ok) return { title: 'Synthèse EUR - Fundafrique - OPCVM Afrique' };
        const fund = await response.json();
        if (!fund?.funds) return { title: 'Synthèse EUR - Fundafrique - OPCVM Afrique' };

        const { nom_fond, devise, code_ISIN, pays, societe_gestion, slug } = fund.funds;
        const fundSlug = slug || params.fondId;

        return {
            title: `${nom_fond} ${devise} ${code_ISIN} ${pays} - Synthèse EUR OPCVM Afrique | Fundafrique`,
            description: `Synthèse en EUR du fonds OPCVM ${nom_fond} (${code_ISIN}) du ${pays}, géré par ${societe_gestion} : VL, performances et ratios de risque convertis en euros sur Fundafrique.`,
            alternates: {
                canonical: `${urlsite}/funds/summary-eur/${fundSlug}`,
            },
            openGraph: {
                title: `${nom_fond} - Synthèse EUR OPCVM ${pays} | Fundafrique`,
                description: `Synthèse en EUR du fonds ${nom_fond} (${code_ISIN}) : valeur liquidative, performances et ratios de risque.`,
                url: `${urlsite}/funds/summary-eur/${fundSlug}`,
                type: 'website',
            },
        };
    } catch {
        return { title: 'Synthèse EUR - Fundafrique - OPCVM Afrique' };
    }
}
