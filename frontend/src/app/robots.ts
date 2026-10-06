import type { MetadataRoute } from "next";

import { NOINDEX_ALL, absoluteUrl } from "@/lib/config";

/** Admin and API are blocked from crawling. Pages that use a noindex meta
 * tag (search/filter results, quote basket) are deliberately NOT blocked
 * here, so crawlers can see the noindex. */
export default function robots(): MetadataRoute.Robots {
  if (NOINDEX_ALL) {
    // Staging: rely on noindex headers/meta and access control, not on robots alone.
    return { rules: [{ userAgent: "*", allow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/dashboard"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
