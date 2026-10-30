import { MetadataRoute } from "next";
import { urlsite } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/panel/admin",
          "/panel/investor",
          "/panel/management",
          "/panel/distributor",
          "/panel/data-requester",
          "/panel/institutional",
          "/panel/portfolio",
          "/panel/portefeuille",
          "/country-panel",
          "/api",
          "/api/",
          "/auth",
          "/callback",
          // Les ETAPES du questionnaire de profil, pas son entree. Mesure du
          // 2026-10-30 : `/questionnaire/questionnaire/**` compte 22 pages
          // (`question1` a `question8`, `pre/question1` a `pre/question9`,
          // `first`), aucune n'est au sitemap et aucune n'etait interdite.
          // Les faire indexer serait NUISIBLE : une etape intermediaire de
          // tunnel n'a pas de sens hors de son parcours, elle capte des
          // requetes sans y repondre et dilue les pages qui comptent.
          //
          // `/questionnaire` et `/questionnaire/profile` restent explorables :
          // l'entree du questionnaire est une page d'atterrissage legitime.
          //
          // Un `Disallow` plutot que 22 balises `noindex` : ces pages sont
          // toutes `"use client"`, et y poser une metadonnee exigerait de
          // scinder 22 fichiers en obus serveur plus composant. Pour un
          // resultat identique cote exploration, c'est une churn sans contre-
          // partie — et chaque scission est une occasion de regression.
          "/questionnaire/questionnaire",
        ],
      },
    ],
    sitemap: `${urlsite}/sitemap.xml`,
  };
}
