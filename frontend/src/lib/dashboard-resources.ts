import type { SectionDef } from "@/components/dashboard/fields";

/** Form layouts for each kind of content in the dashboard. Field names
 * match the Django models; Django validates everything again on save. */

export const STATUS_OPTIONS: [string, string][] = [
  ["draft", "Draft — not on the site"],
  ["published", "Published — live on the site"],
  ["archived", "Hidden — kept but not shown"],
];

const AVAILABILITY_OPTIONS: [string, string][] = [
  ["unknown", "On enquiry (not confirmed)"],
  ["in_stock", "In stock"],
  ["on_order", "Available on order"],
];

const seo = (path: string): SectionDef => ({
  title: "Search engines (optional)",
  description: `How this page appears in Google. Leave blank to use the name and summary. Page: ${path}`,
  fields: [
    { name: "seo_title", label: "Search title", type: "text", maxLength: 160, hint: "About 50–60 characters works best.", wide: true },
    { name: "seo_description", label: "Search description", type: "textarea", rows: 3, hint: "About 140–160 characters: what the page offers and where." },
  ],
});

export const productSections = (canPublish: boolean): SectionDef[] => [
  {
    title: "Basics",
    fields: [
      { name: "name", label: "Product name", type: "text", required: true, maxLength: 180, wide: true },
      { name: "primary_category", label: "Main category", type: "relation", endpoint: "categories", multiple: false, required: true },
      ...(canPublish
        ? [{ name: "status", label: "Visibility", type: "select", options: STATUS_OPTIONS } as const]
        : []),
      { name: "availability_status", label: "Availability", type: "select", options: AVAILABILITY_OPTIONS },
      { name: "order", label: "Sort order", type: "number", hint: "Lower numbers are listed first." },
      { name: "sku", label: "SKU / code", type: "text", maxLength: 60 },
      { name: "brand", label: "Brand", type: "text", maxLength: 120, hint: "Only a verified brand." },
      { name: "slug", label: "Web address", type: "text", maxLength: 160, hint: "Leave blank to build it from the name. Changing it later keeps old links working." },
    ],
  },
  {
    title: "Description",
    description: "What the product is, what it's used for and what buyers should tell you.",
    fields: [
      { name: "short_summary", label: "Short summary", type: "text", maxLength: 240, wide: true, hint: "One sentence shown on product cards." },
      { name: "description", label: "Full description", type: "textarea", rows: 8, hint: "Leave a blank line between paragraphs." },
      { name: "selection_notes", label: "What to tell us when ordering", type: "lines" },
      { name: "synonyms", label: "Other names people search for", type: "text", wide: true, hint: "Comma-separated, e.g. fire brick, firebrick, refractory brick." },
    ],
  },
  {
    title: "Price & ordering",
    description: "Leave the price blank unless it is confirmed — the site then asks buyers for a quote.",
    fields: [
      { name: "price", label: "Confirmed price", type: "price" },
      { name: "price_currency", label: "Currency", type: "text", maxLength: 3 },
      { name: "price_unit", label: "Price per", type: "text", maxLength: 60, placeholder: "per brick" },
      { name: "price_valid_until", label: "Price valid until", type: "date" },
      { name: "sales_unit", label: "Sold by", type: "text", maxLength: 60, placeholder: "piece, bag, roll…" },
      { name: "minimum_order_quantity", label: "Minimum order", type: "price" },
      { name: "moq_unit", label: "Minimum order unit", type: "text", maxLength: 60 },
    ],
  },
  {
    title: "Where it appears",
    fields: [
      { name: "additional_categories", label: "Also list in categories", type: "relation", endpoint: "categories", multiple: true },
      { name: "applications", label: "Uses / applications", type: "relation", endpoint: "applications", multiple: true },
      { name: "related_products", label: "Related products", type: "relation", endpoint: "products", multiple: true },
    ],
  },
  { title: "Questions & answers", fields: [{ name: "faqs", label: "FAQs", type: "faqs" }] },
  seo("/products/…"),
  {
    title: "Internal notes",
    description: "Never shown on the website.",
    fields: [
      { name: "review_notes", label: "Notes", type: "textarea", rows: 3 },
      { name: "source_url", label: "Source / reference link", type: "url", wide: true },
    ],
  },
];

export const categorySections: SectionDef[] = [
  {
    title: "Category",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, maxLength: 120 },
      { name: "short_code", label: "Short code", type: "text", required: true, maxLength: 4, hint: "A unique code of up to 4 letters, e.g. OF." },
      { name: "status", label: "Visibility", type: "select", options: STATUS_OPTIONS },
      { name: "order", label: "Sort order", type: "number" },
      { name: "slug", label: "Web address", type: "text", maxLength: 140, hint: "Leave blank to build it from the name." },
      { name: "intro", label: "Introduction", type: "textarea", rows: 5 },
      { name: "quote_checklist", label: "What buyers should include in a quote request", type: "lines" },
    ],
  },
  {
    title: "Photo",
    fields: [
      { name: "image", label: "Category photo", type: "image" },
      { name: "image_alt", label: "Describe the photo", type: "text", maxLength: 200, wide: true, hint: "For screen readers and Google Images." },
    ],
  },
  seo("/categories/…"),
];

export const applicationSections: SectionDef[] = [
  {
    title: "Application",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, maxLength: 120 },
      { name: "status", label: "Visibility", type: "select", options: STATUS_OPTIONS },
      { name: "summary", label: "Summary", type: "text", maxLength: 240, wide: true },
      { name: "order", label: "Sort order", type: "number" },
      { name: "slug", label: "Web address", type: "text", maxLength: 140 },
      { name: "intro", label: "Introduction", type: "textarea", rows: 5 },
      { name: "considerations", label: "Selection considerations", type: "lines" },
    ],
  },
  {
    title: "Photo",
    fields: [
      { name: "image", label: "Photo", type: "image" },
      { name: "image_alt", label: "Describe the photo", type: "text", maxLength: 200, wide: true },
    ],
  },
  seo("/applications/…"),
];

export const serviceSections: SectionDef[] = [
  {
    title: "Service",
    fields: [
      { name: "name", label: "Service name", type: "text", required: true, maxLength: 120 },
      { name: "status", label: "Visibility", type: "select", options: STATUS_OPTIONS },
      { name: "summary", label: "Summary", type: "text", maxLength: 240, wide: true },
      { name: "order", label: "Sort order", type: "number" },
      { name: "slug", label: "Web address", type: "text", maxLength: 140 },
      { name: "description", label: "Description", type: "textarea", rows: 8, hint: "Leave a blank line between paragraphs." },
      { name: "includes", label: "What the service includes", type: "lines" },
      { name: "request_checklist", label: "What customers should tell us", type: "lines" },
      { name: "related_products", label: "Products used in this service", type: "relation", endpoint: "products", multiple: true },
    ],
  },
  {
    title: "Photo",
    fields: [
      { name: "image", label: "Banner photo", type: "image" },
      { name: "image_alt", label: "Describe the photo", type: "text", maxLength: 200, wide: true },
    ],
  },
  { title: "Questions & answers", fields: [{ name: "faqs", label: "FAQs", type: "faqs" }] },
  seo("/services/…"),
  { title: "Internal notes", description: "Never shown on the website.", fields: [{ name: "review_notes", label: "Notes", type: "textarea", rows: 3 }] },
];

export const testimonialSections: SectionDef[] = [
  {
    title: "Testimonial",
    description: "Only real customer feedback, published with the customer's permission.",
    fields: [
      { name: "customer_name", label: "Customer name (as they agreed)", type: "text", required: true, maxLength: 120, placeholder: "Jane W." },
      { name: "customer_role", label: "Role / business", type: "text", maxLength: 160 },
      { name: "location", label: "Town", type: "text", maxLength: 120 },
      { name: "received_on", label: "Date received", type: "date" },
      { name: "quote", label: "Their words", type: "textarea", rows: 5, required: true, hint: "Don't change the meaning of what they said." },
      {
        name: "rating", label: "Rating", type: "select", nullable: true,
        options: [["5", "5 / 5"], ["4", "4 / 5"], ["3", "3 / 5"], ["2", "2 / 5"], ["1", "1 / 5"]],
        hint: "Only if the customer gave one.",
      },
      { name: "topic", label: "Topic", type: "select", options: [["pizza", "Pizza ovens"], ["cyclones", "Roof cyclones"], ["general", "General"]] },
      { name: "service", label: "Service (optional)", type: "relation", endpoint: "services", multiple: false, nullable: true },
      { name: "order", label: "Sort order", type: "number" },
      { name: "consent_confirmed", label: "The customer agreed to this being published on the website", type: "checkbox" },
      { name: "status", label: "Visibility", type: "select", options: STATUS_OPTIONS },
    ],
  },
];

export const settingsSections: SectionDef[] = [
  {
    title: "Contact details",
    description: "Shown in the header, footer, contact page, call/WhatsApp buttons and Google's business details.",
    fields: [
      { name: "primary_phone", label: "Main phone", type: "text", required: true, maxLength: 30 },
      { name: "secondary_phone", label: "Second phone", type: "text", maxLength: 30 },
      { name: "whatsapp_number_intl", label: "WhatsApp number", type: "text", maxLength: 20, hint: "International format, e.g. 254710851911." },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "address_line", label: "Address", type: "text", wide: true, maxLength: 200 },
      { name: "hours_text", label: "Opening hours", type: "text", wide: true, maxLength: 160 },
      { name: "regions_served", label: "Areas served", type: "text", wide: true, maxLength: 200, hint: "Comma-separated." },
      { name: "contact_form_enabled", label: "Show the enquiry forms on the website", type: "checkbox", hint: "Untick to show only phone, email and WhatsApp." },
    ],
  },
  {
    title: "Homepage",
    fields: [
      { name: "homepage_headline", label: "Main headline", type: "text", wide: true, maxLength: 160, hint: "The part before the first comma is highlighted in orange." },
      { name: "homepage_intro", label: "Introduction", type: "textarea", rows: 4, hint: "Leave blank to use the built-in introduction." },
    ],
  },
  {
    title: "Branding",
    fields: [
      { name: "site_name", label: "Site name", type: "text", maxLength: 120 },
      { name: "tagline", label: "Tagline", type: "text", maxLength: 120 },
      { name: "division_descriptor", label: "Division", type: "text", maxLength: 120 },
      { name: "relationship_wording", label: "Relationship to parent company", type: "text", maxLength: 160 },
      { name: "logo_header_override", label: "Header logo (optional)", type: "image", fit: "object-contain" },
    ],
  },
  {
    title: "Google & analytics",
    fields: [
      { name: "google_review_url", label: "Google review link", type: "url", wide: true, hint: "From your Google Business Profile → “Ask for reviews”. Shows a “Review us on Google” button." },
      { name: "ga_measurement_id", label: "Google Analytics ID", type: "text", maxLength: 32, placeholder: "G-XXXXXXXXXX" },
    ],
  },
  {
    title: "Record keeping",
    fields: [
      { name: "contact_verified_on", label: "Contacts last checked on", type: "date" },
      { name: "contact_source_url", label: "Where they were checked", type: "url" },
    ],
  },
];
