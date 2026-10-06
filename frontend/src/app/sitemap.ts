import type { MetadataRoute } from "next";

import { getSitemapData } from "@/lib/api";
import { absoluteUrl } from "@/lib/config";
import { HERO_IMAGE, IMAGES, categoryImage, serviceImage } from "@/lib/images";

/** Published, indexable canonical URLs only. Filtered/search views, the
 * quote basket and admin are excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSitemapData();
  const catalogUpdated = data.latest_product_update ? new Date(data.latest_product_update) : undefined;
  // Date the editorial pages were last revised (update when their copy changes).
  const contentUpdated = new Date("2026-10-06");
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: catalogUpdated ?? contentUpdated, changeFrequency: "weekly", priority: 1, images: [absoluteUrl(HERO_IMAGE.src.src)] },
    { url: absoluteUrl("/products"), lastModified: catalogUpdated ?? contentUpdated, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/services"), lastModified: contentUpdated, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/guides"), lastModified: contentUpdated, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/pizza-oven-guide"), lastModified: contentUpdated, changeFrequency: "monthly", priority: 0.7, images: [absoluteUrl(IMAGES["oven-fire-floor"].src.src)] },
    {
      url: absoluteUrl("/roof-cyclone-guide"),
      lastModified: contentUpdated,
      changeFrequency: "monthly",
      priority: 0.7,
      images: [absoluteUrl(IMAGES["roof-cyclone-closeup"].src.src), absoluteUrl(IMAGES["industrial-roof-cyclones"].src.src)],
    },
    { url: absoluteUrl("/categories"), lastModified: contentUpdated, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/applications"), lastModified: contentUpdated, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/about"), lastModified: contentUpdated, changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/contact"), lastModified: contentUpdated, changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/privacy"), lastModified: contentUpdated, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/image-credits"), lastModified: contentUpdated, changeFrequency: "yearly", priority: 0.1 },
  ];
  return [
    ...staticPages,
    ...(data.services ?? []).map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: new Date(s.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: serviceImage(s.slug) ? [absoluteUrl(serviceImage(s.slug)!.src.src)] : undefined,
    })),
    ...data.categories.map((c) => ({
      url: absoluteUrl(`/categories/${c.slug}`),
      lastModified: new Date(c.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: categoryImage(c.slug) ? [absoluteUrl(categoryImage(c.slug)!.src.src)] : undefined,
    })),
    ...data.applications.map((a) => ({
      url: absoluteUrl(`/applications/${a.slug}`),
      lastModified: new Date(a.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...data.products.map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
