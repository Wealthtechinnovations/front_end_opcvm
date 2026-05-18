import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    try {
        const response = await fetch(`${urlconstant}/api/getfondbyidmeta/${params.fondId}`);
        const fund = await response.json();

        const { nom_fond, devise, code_ISIN, pays, societe_gestion, slug } = fund.funds;
        const fundSlug = slug || params.fondId;

        return {
            title: `${nom_fond} ${devise} ${code_ISIN} ${pays} - Historique VL OPCVM Afrique | Fundafrique`,
            description: `Historique des valeurs liquidatives du fonds OPCVM ${nom_fond} (${code_ISIN}) du ${pays}, géré par ${societe_gestion} : courbe base 100, performances mensuelles et annuelles sur Fundafrique.`,
            alternates: {
                canonical: `${urlsite}/funds/history/${fundSlug}`,
            },
            openGraph: {
                title: `${nom_fond} - Historique VL OPCVM ${pays} | Fundafrique`,
                description: `Historique complet du fonds ${nom_fond} (${code_ISIN}) : courbe base 100, performances mensuelles et annuelles.`,
                url: `${urlsite}/funds/history/${fundSlug}`,
                type: 'website',
            },
        };
    } catch {
        return { title: 'Historique VL - Fundafrique - OPCVM Afrique' };
    }
}
