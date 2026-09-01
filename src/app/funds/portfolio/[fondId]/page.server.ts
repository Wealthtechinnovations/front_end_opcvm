import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    try {
        const response = await fetch(`${urlconstant}/api/getfondbyidmeta/${params.fondId}`);
        if (!response.ok) return { title: 'Composition du portefeuille - Fundafrique - OPCVM Afrique' };
        const fund = await response.json();
        if (!fund?.funds) return { title: 'Composition du portefeuille - Fundafrique - OPCVM Afrique' };

        const { nom_fond, devise, code_ISIN, pays, societe_gestion, slug } = fund.funds;
        const fundSlug = slug || params.fondId;

        return {
            title: `${nom_fond} ${devise} ${code_ISIN} ${pays} - Composition du portefeuille OPCVM Afrique | Fundafrique`,
            description: `Composition du portefeuille du fonds OPCVM ${nom_fond} (${code_ISIN}) du ${pays}, géré par ${societe_gestion} : répartition des actifs et détails du portefeuille sur Fundafrique.`,
            alternates: {
                canonical: `${urlsite}/funds/portfolio/${fundSlug}`,
            },
            openGraph: {
                title: `${nom_fond} - Composition du portefeuille OPCVM ${pays} | Fundafrique`,
                description: `Composition du portefeuille du fonds ${nom_fond} (${code_ISIN}) : répartition des actifs et détails du portefeuille.`,
                url: `${urlsite}/funds/portfolio/${fundSlug}`,
                type: 'website',
            },
        };
    } catch {
        return { title: 'Composition du portefeuille - Fundafrique - OPCVM Afrique' };
    }
}
