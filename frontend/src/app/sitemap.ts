import type { MetadataRoute } from "next";

import { getSitemapData } from "@/lib/api";
import { absoluteUrl } from "@/lib/config";

/** Published, indexable canonical URLs only. Filtered/search views, the
 * quote basket and admin are excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSitemapData();
  const catalogUpdated = data.latest_product_update ? new Date(data.latest_product_update) : undefined;
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: catalogUpdated },
    { url: absoluteUrl("/products"), lastModified: catalogUpdated },
    { url: absoluteUrl("/categories") },
    { url: absoluteUrl("/applications") },
    { url: absoluteUrl("/about") },
    { url: absoluteUrl("/contact") },
    { url: absoluteUrl("/privacy") },
  ];
  return [
    ...staticPages,
    ...data.categories.map((c) => ({
      url: absoluteUrl(`/categories/${c.slug}`),
      lastModified: new Date(c.updated_at),
    })),
    ...data.applications.map((a) => ({
      url: absoluteUrl(`/applications/${a.slug}`),
      lastModified: new Date(a.updated_at),
    })),
    ...data.products.map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      lastModified: new Date(p.updated_at),
    })),
  ];
}
