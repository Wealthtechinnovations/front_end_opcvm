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
          "/panel/portfolio",
          "/panel/management",
          "/country-panel",
          "/api",
          "/auth",
          "/callback",
        ],
      },
    ],
    sitemap: `${urlsite}/sitemap.xml`,
  };
}
