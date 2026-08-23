import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), priority: 1 },
    ...getArticles().map((a) => ({
      url: `${SITE_URL}/writing/${a.slug}`,
      lastModified: new Date(a.date),
      priority: 0.8,
    })),
  ];
}
