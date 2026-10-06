import type { Metadata } from "next";

import { NOINDEX_ALL, PARENT_ORG_ID, PARENT_SITE, SITE_ORIGIN, absoluteUrl } from "./config";
import type { SiteSettings } from "./types";

const OG_IMAGE = { url: "/brand/og-default.png", width: 1200, height: 630, alt: "KariVex Industrial Materials" };

export function clip(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/[\s,.;:—-]+\S*$/, "")}…`;
}

/** Page metadata with an absolute self-referencing canonical. Pages that
 * should not be indexed (filtered/search views, quote basket) pass
 * `index: false` and a canonical pointing at their clean equivalent. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  canonicalPath?: string;
  index?: boolean;
  image?: string | null;
  absoluteTitle?: boolean;
}): Metadata {
  const canonical = absoluteUrl(opts.canonicalPath ?? opts.path);
  const index = opts.index !== false && !NOINDEX_ALL;
  const images = opts.image ? [{ url: opts.image }] : [OG_IMAGE];
  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: clip(opts.description),
    alternates: { canonical },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: "KariVex Industrial Materials",
      locale: "en_KE",
      url: canonical,
      title: opts.title,
      description: clip(opts.description, 200),
      images,
    },
    twitter: { card: "summary_large_image", title: opts.title, description: clip(opts.description, 200) },
  };
}

/** Division identity: an Organization that is part of (not separate from)
 * KariVex Solutions Ltd, linked to the parent's existing @id. */
export function organizationJsonLd(settings: SiteSettings) {
  const telephones = [settings.primary_phone_href, settings.secondary_phone_href]
    .filter(Boolean)
    .map((href) => (href as string).replace(/^tel:/, ""));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#division`,
    name: settings.site_name,
    description: `${settings.division_descriptor} of ${settings.parent_company_name}.`,
    url: `${SITE_ORIGIN}/`,
    logo: absoluteUrl("/brand/karivex-logo.png"),
    email: settings.email,
    telephone: telephones,
    address: {
      "@type": "PostalAddress",
      // Stored as one editable line in Site settings.
      streetAddress: settings.address_line,
      addressCountry: "KE",
    },
    areaServed: settings.regions_served.split(",").map((name) => ({ "@type": "Country", name: name.trim() })),
    contactPoint: telephones.map((telephone) => ({
      "@type": "ContactPoint",
      contactType: "sales",
      telephone,
      email: settings.email,
    })),
    parentOrganization: {
      "@type": "Organization",
      "@id": PARENT_ORG_ID,
      name: settings.parent_company_name,
      url: PARENT_SITE,
    },
  };
}

export function websiteJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: settings.site_name,
    url: `${SITE_ORIGIN}/`,
    inLanguage: "en",
    publisher: { "@id": `${SITE_ORIGIN}/#division` },
  };
}
