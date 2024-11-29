import { MetadataRoute } from "next";
import { urlconstant, urlsite } from "@/app/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/privacy"],
      },
    ],
    sitemap: `${urlsite}/sitemap.xml`,
  };
}
