export type Availability = "in_stock" | "on_order" | "unknown";

export interface SiteSettings {
  site_name: string;
  division_descriptor: string;
  parent_company_name: string;
  relationship_wording: string;
  tagline: string;
  chemical_division_name: string;
  chemical_division_url: string;
  primary_phone: string;
  primary_phone_href: string | null;
  secondary_phone: string;
  secondary_phone_href: string | null;
  whatsapp_number_intl: string;
  whatsapp_base_url: string | null;
  email: string;
  address_line: string;
  hours_text: string;
  regions_served: string;
  contact_source_url: string;
  contact_verified_on: string | null;
  contact_form_enabled: boolean;
  ga_measurement_id: string;
  homepage_headline: string;
  homepage_intro: string;
  logo_header_override: string | null;
}

export interface CategoryRef {
  name: string;
  slug: string;
  short_code: string;
}

export interface ApplicationRef {
  name: string;
  slug: string;
}

export interface Category extends CategoryRef {
  id: number;
  intro: string;
  quote_checklist: string[];
  seo_title: string;
  seo_description: string;
  image: string | null;
  image_alt: string;
  product_count: number;
  updated_at: string;
}

export interface Application extends ApplicationRef {
  id: number;
  summary: string;
  intro: string;
  considerations: string[];
  seo_title: string;
  seo_description: string;
  image: string | null;
  image_alt: string;
  product_count: number;
  updated_at: string;
}

export interface ProductImage {
  image: string;
  alt_text: string;
  width: number | null;
  height: number | null;
  is_primary: boolean;
}

export interface ProductCard {
  id: number;
  slug: string;
  name: string;
  brand: string;
  short_summary: string;
  primary_category: CategoryRef;
  availability_status: Availability;
  primary_image: ProductImage | null;
  variant_count: number;
  updated_at: string;
}

export interface Variant {
  id: number;
  label: string;
  sku: string;
  thickness: string;
  dimensions: string;
  density: string;
  diameter: string;
  box_capacity: string;
  pack_size: string;
  sales_unit_override: string;
  availability_status: Availability;
}

export interface Specification {
  label: string;
  value: string;
  unit: string;
}

export interface ProductDocument {
  title: string;
  doc_type: "datasheet" | "msds" | "other";
  file: string;
}

export interface ProductDetail {
  id: number;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  synonyms: string[];
  short_summary: string;
  description: string;
  selection_notes: string[];
  primary_category: CategoryRef;
  additional_categories: CategoryRef[];
  applications: ApplicationRef[];
  sales_unit: string;
  minimum_order_quantity: string | null;
  moq_unit: string;
  availability_status: Availability;
  specifications: Specification[];
  variants: Variant[];
  images: ProductImage[];
  documents: ProductDocument[];
  related_products: ProductCard[];
  services: ServiceRef[];
  faqs: Faq[];
  offer: Offer | null;
  seo_title: string;
  seo_description: string;
  updated_at: string;
}

export interface Paginated<T> {
  count: number;
  page: number;
  num_pages: number;
  page_size: number;
  results: T[];
}

export interface FacetValue {
  value: string;
  display: string;
  count: number;
}

export interface Facets {
  product_count: number;
  applications: FacetValue[];
  availability: FacetValue[];
  facets: { key: string; label: string; values: FacetValue[] }[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Offer {
  price: string;
  currency: string;
  unit: string;
  valid_until: string | null;
}

export interface ServiceRef {
  name: string;
  slug: string;
  summary: string;
}

export interface Service extends ServiceRef {
  id: number;
  description: string;
  includes: string[];
  request_checklist: string[];
  faqs: Faq[];
  related_products: ProductCard[];
  image: string | null;
  image_alt: string;
  seo_title: string;
  seo_description: string;
  updated_at: string;
}

export interface SitemapData {
  latest_product_update: string | null;
  services: { slug: string; updated_at: string }[];
  products: { slug: string; updated_at: string }[];
  categories: { slug: string; updated_at: string }[];
  applications: { slug: string; updated_at: string }[];
}

export interface ProductFilters {
  q?: string;
  category?: string;
  application?: string;
  availability?: string;
  spec?: string;
  page?: number;
  page_size?: number;
}
