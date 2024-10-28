import { Fund, FundsResponse, Pays, PaysResponse, Societe, SocieteResponse } from "@/models/Fund";
import { MetadataRoute } from "next";
import { urlconstant, urlsite } from "@/app/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(`${urlconstant}/api/searchFunds`);
  const { data }: FundsResponse = await response.json();

  const postEntries: MetadataRoute.Sitemap = data.funds.map((fund: Fund) => ({
    url: `${urlsite}/Opcvm/${fund.value}`,
    lastModified: new Date(),
  }));

  const response1 = await fetch(`${urlconstant}/api/getPays`);
  const paysData: PaysResponse = await response1.json();
  const paysEntries: MetadataRoute.Sitemap = paysData.data.paysOptions.map((pays: Pays) => ({
    url: `${urlsite}/pays/${pays.value}`,
    lastModified: new Date(),
  }));

  const response2 = await fetch(`${urlconstant}/api/getSocietes`);
  const societeResponse: SocieteResponse = await response2.json();
  const societeEntries: MetadataRoute.Sitemap = societeResponse.data.societes.map((societe: Societe) => ({
    url: `${urlsite}/Fundmanager/${societe.name}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: `${urlsite}/accueil`,
      lastModified: new Date(),
    },
    {
      url: `${urlsite}/Outils/comparaison`,
      lastModified: new Date(),
    },
    {
      url: `${urlsite}/Outils/recherche`,
      lastModified: new Date(),
    },
    {
      url: `${urlsite}/actualite`,
      lastModified: new Date(),
    },
    ...postEntries,
    ...paysEntries,
    ...societeEntries
  ];
}

