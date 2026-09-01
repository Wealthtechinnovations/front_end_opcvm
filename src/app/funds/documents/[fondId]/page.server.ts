import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    try {
        const response = await fetch(`${urlconstant}/api/getfondbyidmeta/${params.fondId}`);
        if (!response.ok) return { title: 'Documents - Fundafrique - OPCVM Afrique' };
        const fund = await response.json();
        if (!fund?.funds) return { title: 'Documents - Fundafrique - OPCVM Afrique' };

        const { nom_fond, devise, code_ISIN, pays, societe_gestion, slug } = fund.funds;
        const fundSlug = slug || params.fondId;

        return {
            title: `${nom_fond} ${devise} ${code_ISIN} ${pays} - Documents OPCVM Afrique | Fundafrique`,
            description: `Documents du fonds OPCVM ${nom_fond} (${code_ISIN}) du ${pays}, géré par ${societe_gestion} : reporting mensuel, prospectus, rapports annuels et semestriels sur Fundafrique.`,
            alternates: {
                canonical: `${urlsite}/funds/documents/${fundSlug}`,
            },
            openGraph: {
                title: `${nom_fond} - Documents OPCVM ${pays} | Fundafrique`,
                description: `Documents du fonds ${nom_fond} (${code_ISIN}) : reporting mensuel, prospectus, rapports annuels et semestriels.`,
                url: `${urlsite}/funds/documents/${fundSlug}`,
                type: 'website',
            },
        };
    } catch {
        return { title: 'Documents - Fundafrique - OPCVM Afrique' };
    }
}
