import { Fund, FundsResponse, Pays, PaysResponse, Societe, SocieteResponse } from "@/models/Fund";
import { MetadataRoute } from "next";
import { urlconstant, urlsite } from "@/lib/constants";
import { generateFundSlug, generateSlug } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${urlsite}/home`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${urlsite}/funds/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${urlsite}/fund-managers/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${urlsite}/countries`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${urlsite}/tools/comparison`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${urlsite}/tools/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${urlsite}/news`,
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
  ];

  try {
    const [fundsRes, paysRes, societesRes] = await Promise.all([
      fetch(`${urlconstant}/api/searchFunds`),
      fetch(`${urlconstant}/api/getPays`),
      fetch(`${urlconstant}/api/getSocietes`),
    ]);

    const { data }: FundsResponse = await fundsRes.json();
    const fundEntries: MetadataRoute.Sitemap = data.funds.map((fund: Fund) => ({
      url: `${urlsite}/funds/${fund.slug || generateFundSlug(fund.nom_fond || '', fund.code_ISIN || '', fund.value)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    const paysData: PaysResponse = await paysRes.json();
    const paysEntries: MetadataRoute.Sitemap = paysData.data.paysOptions.map((pays: Pays) => ({
      url: `${urlsite}/countries/${generateSlug(pays.value)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const societeResponse: SocieteResponse = await societesRes.json();
    const societeEntries: MetadataRoute.Sitemap = societeResponse.data.societes.map((societe: Societe) => ({
      url: `${urlsite}/fund-managers/${societe.slug || generateSlug(societe.name)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticEntries, ...fundEntries, ...paysEntries, ...societeEntries];
  } catch {
    return staticEntries;
  }
}
