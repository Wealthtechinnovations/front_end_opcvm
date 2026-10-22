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
        ],
      },
    ],
    sitemap: `${urlsite}/sitemap.xml`,
  };
}
