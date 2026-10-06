/** Learning-centre articles. Content lives in each article's page file;
 * this registry drives the guides index, related links and the sitemap. */

export type Topic = "Pizza ovens" | "Roof cyclones" | "Pizza ovens & roof cyclones";

export interface ArticleMeta {
  href: string;
  title: string;
  description: string;
  topic: Topic;
  imageKey: string;
  published: string;
  updated: string;
}

export const ARTICLES: ArticleMeta[] = [
  {
    href: "/pizza-oven-guide",
    title: "How a pizza oven is built",
    description: "The layers of a pizza oven, the materials used in each, curing a new oven, and how hot ovens run.",
    topic: "Pizza ovens",
    imageKey: "oven-fire-floor",
    published: "2026-10-06",
    updated: "2026-10-06",
  },
  {
    href: "/guides/choosing-fire-bricks",
    title: "Choosing fire bricks for a pizza oven",
    description: "Dense vs insulating fire bricks, where each goes, laying the floor, cutting bricks safely and estimating quantities.",
    topic: "Pizza ovens",
    imageKey: "fire-brick",
    published: "2026-10-06",
    updated: "2026-10-06",
  },
  {
    href: "/guides/wood-fired-vs-gas-pizza-ovens",
    title: "Wood-fired vs gas pizza ovens",
    description: "Heat-up time, flavour, running and cleaning compared, and what each means for the oven's construction.",
    topic: "Pizza ovens",
    imageKey: "pizza-peel-oven",
    published: "2026-10-06",
    updated: "2026-10-06",
  },
  {
    href: "/guides/pizza-oven-care-and-maintenance",
    title: "Pizza oven care and maintenance",
    description: "Cleaning the floor, avoiding thermal shock, protecting the oven from rain, drying it out after downtime and when to repair.",
    topic: "Pizza ovens",
    imageKey: "pizzaiolo-oven",
    published: "2026-10-06",
    updated: "2026-10-06",
  },
  {
    href: "/roof-cyclone-guide",
    title: "Roof cyclones: how they work and how to keep them turning",
    description: "How turbine ventilators work, how many you need, materials, installation, maintenance and common faults.",
    topic: "Roof cyclones",
    imageKey: "steel-roof-cyclone",
    published: "2026-10-06",
    updated: "2026-10-06",
  },
  {
    href: "/guides/roof-cyclones-vs-electric-extractor-fans",
    title: "Roof cyclones vs electric extractor fans",
    description: "Wind-driven and powered roof ventilation compared: running cost, reliability, noise, power cuts and when to combine them.",
    topic: "Roof cyclones",
    imageKey: "cyclone-on-corrugated-roof",
    published: "2026-10-06",
    updated: "2026-10-06",
  },
  {
    href: "/guides/ventilating-hot-metal-roofs",
    title: "Ventilating hot metal roofs: factories, warehouses and poultry houses",
    description: "Why buildings under metal roofs overheat and sweat, what roof ventilation does about it, and where cyclones fit in.",
    topic: "Roof cyclones",
    imageKey: "industrial-roof-cyclones",
    published: "2026-10-06",
    updated: "2026-10-06",
  },
  {
    href: "/glossary",
    title: "Glossary: pizza oven and roof cyclone terms",
    description: "Plain-English definitions of refractory, castable, hearth, curing, throat, flashing, bearing and more.",
    topic: "Pizza ovens & roof cyclones",
    imageKey: "margherita-pizza",
    published: "2026-10-06",
    updated: "2026-10-06",
  },
  {
    href: "/faq",
    title: "Frequently asked questions",
    description: "Ordering, quotations, delivery, our services, pizza ovens and roof cyclones: common questions answered.",
    topic: "Pizza ovens & roof cyclones",
    imageKey: "pizzeria-brick-oven",
    published: "2026-10-06",
    updated: "2026-10-06",
  },
];

export const articleByHref = (href: string) => ARTICLES.find((a) => a.href === href)!;
