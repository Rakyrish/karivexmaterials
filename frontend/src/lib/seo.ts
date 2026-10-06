import type { Metadata } from "next";

import { NOINDEX_ALL, PARENT_ORG_ID, PARENT_SITE, SITE_ORIGIN, absoluteUrl } from "./config";
import { IMAGES } from "./images";
import type { ServiceRef, SiteSettings } from "./types";

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

// Structured hours are only published while the displayed hours match the
// verified schedule; if an admin changes the text, the structured version is
// dropped rather than going stale.
const VERIFIED_HOURS_TEXT = "Monday–Friday 08:00–17:00; Saturday 08:00–13:00";
const VERIFIED_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "17:00",
  },
  { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "13:00" },
];

// Structured address, used only while Site settings still hold the
// verified address (otherwise the single editable line is published).
const VERIFIED_ADDRESS_LINE = "Enterprise Road, Industrial Area, Nairobi, Nairobi County 00400, Kenya";
const VERIFIED_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Enterprise Road, Industrial Area",
  addressLocality: "Nairobi",
  addressRegion: "Nairobi County",
  postalCode: "00400",
  addressCountry: "KE",
};

/** Division identity: a local business (pizza-oven building and roof-cyclone
 * installation are home & construction services) that is part of — not
 * separate from — KariVex Solutions Ltd, linked to the parent's @id. */
export function organizationJsonLd(settings: SiteSettings, services: ServiceRef[] = []) {
  const telephones = [settings.primary_phone_href, settings.secondary_phone_href]
    .filter(Boolean)
    .map((href) => (href as string).replace(/^tel:/, ""));
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "HomeAndConstructionBusiness"],
    "@id": `${SITE_ORIGIN}/#division`,
    name: settings.site_name,
    description: `${settings.division_descriptor} of ${settings.parent_company_name}.`,
    url: `${SITE_ORIGIN}/`,
    logo: absoluteUrl("/brand/karivex-logo.png"),
    image: [
      absoluteUrl("/brand/karivex-logo.png"),
      absoluteUrl(IMAGES["wood-fired-oven-pizzas"].src.src),
      absoluteUrl(IMAGES["cyclone-on-corrugated-roof"].src.src),
    ],
    email: settings.email,
    telephone: telephones,
    address:
      settings.address_line === VERIFIED_ADDRESS_LINE
        ? VERIFIED_ADDRESS
        : { "@type": "PostalAddress", streetAddress: settings.address_line, addressCountry: "KE" },
    ...(settings.hours_text === VERIFIED_HOURS_TEXT ? { openingHoursSpecification: VERIFIED_HOURS } : {}),
    areaServed: settings.regions_served.split(",").map((name) => ({ "@type": "Country", name: name.trim() })),
    contactPoint: telephones.map((telephone) => ({
      "@type": "ContactPoint",
      contactType: "sales",
      telephone,
      email: settings.email,
      ...(settings.hours_text === VERIFIED_HOURS_TEXT ? { hoursAvailable: VERIFIED_HOURS } : {}),
    })),
    knowsAbout: [
      "Pizza ovens",
      "Refractory materials",
      "Fire bricks",
      "Oven insulation",
      "Roof cyclones",
      "Turbine roof ventilators",
      "Roof cyclone installation",
      "Pizza oven building",
    ],
    slogan: settings.tagline,
    ...(services.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Pizza oven and roof cyclone services",
            itemListElement: services.map((service) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: service.name,
                description: service.summary,
                url: absoluteUrl(`/services/${service.slug}`),
              },
            })),
          },
        }
      : {}),
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
