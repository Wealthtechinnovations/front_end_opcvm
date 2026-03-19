import { Fund, FundsResponse, Pays, PaysResponse, Societe, SocieteResponse } from "@/models/Fund";
import { MetadataRoute } from "next";
import { urlconstant, urlsite } from "@/app/constants";
import { generateFundSlug, generateSlug } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch funds
  const response = await fetch(`${urlconstant}/api/searchFunds`);
  const { data }: FundsResponse = await response.json();

  const fundEntries: MetadataRoute.Sitemap = data.funds.map((fund: Fund) => ({
    url: `${urlsite}/Opcvm/${fund.slug || generateFundSlug(fund.nom_fond || '', fund.code_ISIN || '', fund.value)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Fetch countries
  const response1 = await fetch(`${urlconstant}/api/getPays`);
  const paysData: PaysResponse = await response1.json();
  const paysEntries: MetadataRoute.Sitemap = paysData.data.paysOptions.map((pays: Pays) => ({
    url: `${urlsite}/pays/${generateSlug(pays.value)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Fetch management companies
  const response2 = await fetch(`${urlconstant}/api/getSocietes`);
  const societeResponse: SocieteResponse = await response2.json();
  const societeEntries: MetadataRoute.Sitemap = societeResponse.data.societes.map((societe: Societe) => ({
    url: `${urlsite}/Fundmanager/${societe.slug || generateSlug(societe.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: `${urlsite}/accueil`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${urlsite}/Opcvm/recherche`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${urlsite}/Fundmanager/recherche`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${urlsite}/pays`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${urlsite}/Outils/comparaison`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${urlsite}/Outils/recherche`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${urlsite}/actualite`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${urlsite}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    ...fundEntries,
    ...paysEntries,
    ...societeEntries,
  ];
}
