import { urlconstant, urlsite } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    try {
        const response = await fetch(`${urlconstant}/api/getfondbyidmeta/${params.fondId}`);
        if (!response.ok) return { title: 'Télécharger les VL - Fundafrique - OPCVM Afrique' };
        const fund = await response.json();
        if (!fund?.funds) return { title: 'Télécharger les VL - Fundafrique - OPCVM Afrique' };

        const { nom_fond, devise, code_ISIN, pays, societe_gestion, slug } = fund.funds;
        const fundSlug = slug || params.fondId;

        return {
            title: `${nom_fond} ${devise} ${code_ISIN} ${pays} - Télécharger les VL OPCVM Afrique | Fundafrique`,
            description: `Télécharger les valeurs liquidatives du fonds OPCVM ${nom_fond} (${code_ISIN}) du ${pays}, géré par ${societe_gestion} : export des VL historiques sur Fundafrique.`,
            alternates: {
                canonical: `${urlsite}/funds/download-nav/${fundSlug}`,
            },
            openGraph: {
                title: `${nom_fond} - Télécharger les VL OPCVM ${pays} | Fundafrique`,
                description: `Télécharger les valeurs liquidatives du fonds ${nom_fond} (${code_ISIN}) : export des VL historiques.`,
                url: `${urlsite}/funds/download-nav/${fundSlug}`,
                type: 'website',
            },
        };
    } catch {
        return { title: 'Télécharger les VL - Fundafrique - OPCVM Afrique' };
    }
}
