import type { MetadataRoute } from "next";

import { getSitemapData } from "@/lib/api";
import { absoluteUrl } from "@/lib/config";
import { HERO_IMAGE, IMAGES, categoryImage, serviceImage } from "@/lib/images";

/** Published, indexable canonical URLs only. Filtered/search views, the
 * quote basket and admin are excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSitemapData();
  const catalogUpdated = data.latest_product_update ? new Date(data.latest_product_update) : undefined;
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: catalogUpdated, images: [absoluteUrl(HERO_IMAGE.src.src)] },
    { url: absoluteUrl("/products"), lastModified: catalogUpdated },
    { url: absoluteUrl("/services") },
    { url: absoluteUrl("/pizza-oven-guide"), images: [absoluteUrl(IMAGES["oven-fire-floor"].src.src)] },
    { url: absoluteUrl("/categories") },
    { url: absoluteUrl("/applications") },
    { url: absoluteUrl("/about") },
    { url: absoluteUrl("/contact") },
    { url: absoluteUrl("/privacy") },
    { url: absoluteUrl("/image-credits") },
  ];
  return [
    ...staticPages,
    ...(data.services ?? []).map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: new Date(s.updated_at),
      images: serviceImage(s.slug) ? [absoluteUrl(serviceImage(s.slug)!.src.src)] : undefined,
    })),
    ...data.categories.map((c) => ({
      url: absoluteUrl(`/categories/${c.slug}`),
      lastModified: new Date(c.updated_at),
      images: categoryImage(c.slug) ? [absoluteUrl(categoryImage(c.slug)!.src.src)] : undefined,
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
