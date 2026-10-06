import type { SiteSettings } from "./types";

/** Used ONLY if the backend is unreachable, so visitors can still call,
 * email or WhatsApp. The editable source of truth is Site settings in the
 * Django admin. Values verified against https://karivexsolutionsltd.com/contact
 * on 2026-10-06. */
export const FALLBACK_SETTINGS: SiteSettings = {
  site_name: "KariVex Industrial Materials",
  division_descriptor: "Industrial Materials Division",
  parent_company_name: "KariVex Solutions Ltd",
  relationship_wording: "A division of KariVex Solutions Ltd",
  tagline: "Strength Behind Every Project",
  chemical_division_name: "KariVex Solutions Ltd — Chemical Division",
  chemical_division_url: "https://karivexsolutionsltd.com/",
  primary_phone: "+254 742 355548",
  primary_phone_href: "tel:+254742355548",
  secondary_phone: "+254 710 851911",
  secondary_phone_href: "tel:+254710851911",
  whatsapp_number_intl: "254710851911",
  whatsapp_base_url: "https://wa.me/254710851911",
  email: "info@karivexsolutionsltd.com",
  address_line: "Enterprise Road, Industrial Area, Nairobi, Nairobi County 00400, Kenya",
  hours_text: "Monday–Friday 08:00–17:00; Saturday 08:00–13:00",
  regions_served: "Kenya, Uganda, Tanzania, Rwanda",
  contact_source_url: "https://karivexsolutionsltd.com/contact",
  contact_verified_on: "2026-10-06",
  contact_form_enabled: true,
  ga_measurement_id: "",
  homepage_headline: "Pizza Oven Materials, Building & Repair",
  homepage_intro: "",
  logo_header_override: null,
};
