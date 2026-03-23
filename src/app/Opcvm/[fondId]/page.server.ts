import { urlconstant, urlsite } from "@/app/constants";
import { Fund, FundsResponse } from "@/models/Fund";
import { generateFundSlug } from "@/lib/utils";

export async function generateStaticParams() {
    const response = await fetch(`${urlconstant}/api/searchFunds`);
    const { data }: FundsResponse = await response.json();

    return data.funds.map((fund: Fund) => ({
        fondId: fund.slug || generateFundSlug(fund.nom_fond || '', fund.code_ISIN || '', fund.value),
    }));
}

export async function generateMetadata({ params }: { params: { fondId: string } }) {
    const response = await fetch(`${urlconstant}/api/getfondbyidmeta/${params.fondId}`);
    const fund = await response.json();

    const { nom_fond, devise, code_ISIN, pays, societe_gestion, slug } = fund.funds;
    const fundSlug = slug || params.fondId;

    return {
        title: `${nom_fond} ${devise} ${code_ISIN} ${pays} - Synthèse OPCVM Afrique | Fundafrique`,
        description: `Toutes les informations sur le fonds OPCVM ${nom_fond} (${code_ISIN}) du ${pays}, géré par ${societe_gestion} : VL, performances, analyses, classement, graphique historique et ratios de risque sur Fundafrique.`,
        alternates: {
            canonical: `${urlsite}/Opcvm/${fundSlug}`,
        },
        openGraph: {
            title: `${nom_fond} - OPCVM ${pays} | Fundafrique`,
            description: `Analyse complète du fonds ${nom_fond} (${code_ISIN}) : valeur liquidative, performances et ratios de risque.`,
            url: `${urlsite}/Opcvm/${fundSlug}`,
            type: 'website',
        },
    };
}
