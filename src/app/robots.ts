import { MetadataRoute } from "next";
import { urlsite } from "@/app/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/panel/admin",
          "/panel/portefeuille",
          "/panel/societegestionpanel",
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
