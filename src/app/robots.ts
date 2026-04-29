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
          "/panel/portefeuille",
          "/panel/panel/management",
          "/api",
          "/auth",
          "/callback",
          "/testpanel",
        ],
      },
    ],
    sitemap: `${urlsite}/sitemap.xml`,
  };
}
