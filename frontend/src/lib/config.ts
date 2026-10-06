/** Single configurable production origin used for canonicals, sitemap,
 * Open Graph and structured data. */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://materials.karivexsolutionsltd.com"
).replace(/\/+$/, "");

export const PARENT_SITE = "https://karivexsolutionsltd.com";
export const PARENT_ORG_ID = `${PARENT_SITE}/#organization`;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Set NEXT_PUBLIC_NOINDEX=true on staging only. Never set it in production. */
export const NOINDEX_ALL = process.env.NEXT_PUBLIC_NOINDEX === "true";

export const AVAILABILITY_LABELS: Record<string, string> = {
  in_stock: "In stock",
  on_order: "Available on order",
  unknown: "Availability on enquiry",
};
