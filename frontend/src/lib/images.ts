import type { StaticImageData } from "next/image";

import cycloneCloseup from "@/assets/cyclones/roof-cyclone-closeup.jpg";
import cycloneVanes from "@/assets/cyclones/roof-cyclone-vanes.jpg";
import cycloneRoof from "@/assets/cyclones/industrial-roof-cyclones.jpg";
import cycloneOnRoof from "@/assets/cyclones/cyclone-on-corrugated-roof.jpg";
import steelCyclone from "@/assets/cyclones/steel-roof-cyclone.jpg";
import firebrick from "@/assets/pizza/fire-brick.jpg";
import firebricksProduct from "@/assets/pizza/fire-bricks-product.jpg";
import margherita from "@/assets/pizza/margherita-pizza.jpg";
import margheritaRound from "@/assets/pizza/margherita-round.webp";
import neapolitan from "@/assets/pizza/neapolitan-pizza.jpg";
import ovenFireFloor from "@/assets/pizza/oven-fire-floor.jpg";
import peelOven from "@/assets/pizza/pizza-peel-oven.jpg";
import ovenAmber from "@/assets/pizza/pizza-oven-design-amber-tiles.jpg";
import ovenBlue from "@/assets/pizza/pizza-oven-design-blue-tiles.jpg";
import ovenMosaic from "@/assets/pizza/pizza-oven-design-mosaic.jpg";
import pizzaiolo from "@/assets/pizza/pizzaiolo-oven.jpg";
import pizzeriaOven from "@/assets/pizza/pizzeria-brick-oven.jpg";
import tiledOven from "@/assets/pizza/tiled-oven-mouth.jpg";
import vermiculite from "@/assets/pizza/vermiculite.jpg";
import woodFired from "@/assets/pizza/wood-fired-oven-pizzas.jpg";
import credits from "@/data/image-credits.json";

/** Two kinds of bundled image:
 * - Licensed stock photographs (Wikimedia Commons / Openverse, see
 *   /image-credits). They illustrate products in general and are labelled
 *   "Illustrative photo"; never presented as KariVex stock or projects.
 * - Images supplied by KariVex (no third-party credit). Oven renderings
 *   are labelled "Example design" rather than shown as completed projects. */

export interface IllustrativeImage {
  key: string;
  src: StaticImageData;
  alt: string;
  /** Caption/badge shown with the image; null = no badge (own product photo). */
  badge: string | null;
}

const SOURCES: Record<string, StaticImageData> = {
  "wood-fired-oven-pizzas": woodFired,
  "pizza-peel-oven": peelOven,
  "oven-fire-floor": ovenFireFloor,
  "fire-brick": firebrick,
  "pizzaiolo-oven": pizzaiolo,
  "tiled-oven-mouth": tiledOven,
  vermiculite,
  "margherita-pizza": margherita,
  "margherita-round": margheritaRound,
  "neapolitan-pizza": neapolitan,
  "pizzeria-brick-oven": pizzeriaOven,
  "roof-cyclone-closeup": cycloneCloseup,
  "roof-cyclone-vanes": cycloneVanes,
  "industrial-roof-cyclones": cycloneRoof,
  "cyclone-on-corrugated-roof": cycloneOnRoof,
  "steel-roof-cyclone": steelCyclone,
};

const OWNER_IMAGES: IllustrativeImage[] = [
  {
    key: "fire-bricks-product",
    src: firebricksProduct,
    alt: "Fire bricks: high-temperature refractory bricks for pizza ovens",
    badge: null,
  },
  {
    key: "pizza-oven-design-amber-tiles",
    src: ovenAmber,
    alt: "Wood-fired pizza oven design with an amber-tiled dome, chimney and log store on a tiled stand",
    badge: "Example design",
  },
  {
    key: "pizza-oven-design-mosaic",
    src: ovenMosaic,
    alt: "Wood-fired pizza oven design with a mosaic-tiled dome, chimney and log store",
    badge: "Example design",
  },
  {
    key: "pizza-oven-design-blue-tiles",
    src: ovenBlue,
    alt: "Outdoor wood-fired pizza oven design with a blue mosaic dome and built-in log store",
    badge: "Example design",
  },
];

export const IMAGES: Record<string, IllustrativeImage> = {
  ...Object.fromEntries(
    credits.map((c) => [c.key, { key: c.key, src: SOURCES[c.key], alt: c.alt, badge: "Illustrative photo" }]),
  ),
  ...Object.fromEntries(OWNER_IMAGES.map((img) => [img.key, img])),
};

export const IMAGE_CREDITS = credits;

export const HERO_IMAGE = IMAGES["wood-fired-oven-pizzas"];

const CATEGORY_IMAGES: Record<string, string> = {
  "oven-floor-hearth": "oven-fire-floor",
  "dome-walls-bonding": "pizza-oven-design-amber-tiles",
  "pizza-oven-insulation": "vermiculite",
  "door-seals-finishing": "tiled-oven-mouth",
  "roof-cyclones": "steel-roof-cyclone",
};

const SERVICE_IMAGES: Record<string, string> = {
  "pizza-oven-building": "pizza-oven-design-blue-tiles",
  "pizza-oven-repair-relining": "pizzeria-brick-oven",
  "pizza-oven-material-advice": "fire-bricks-product",
  "roof-cyclone-repair": "roof-cyclone-vanes",
  "roof-cyclone-installation": "cyclone-on-corrugated-roof",
};

const APPLICATION_IMAGES: Record<string, string> = {
  "new-pizza-oven-builds": "pizza-oven-design-mosaic",
  "pizza-oven-repair": "pizzeria-brick-oven",
  "pizzerias-restaurants": "pizzaiolo-oven",
  "home-garden-pizza-ovens": "pizza-oven-design-blue-tiles",
  "roof-ventilation": "industrial-roof-cyclones",
};

// Products with a matching product photo (own) or stock photo.
const PRODUCT_IMAGES: Record<string, string> = {
  "fire-bricks-refractory-bricks": "fire-bricks-product",
  "hearth-materials": "pizza-oven-design-mosaic",
  "refractory-cement": "pizza-oven-design-blue-tiles",
  "refractory-mortar": "pizza-oven-design-mosaic",
  "refractory-castables": "pizza-oven-design-amber-tiles",
  vermiculite: "vermiculite",
  "roof-ventilators-roof-cyclones": "cyclone-on-corrugated-roof",
};

const pick = (key: string | undefined) => (key ? IMAGES[key] : undefined);

export const categoryImage = (slug: string) => pick(CATEGORY_IMAGES[slug]);
export const serviceImage = (slug: string) => pick(SERVICE_IMAGES[slug]);
export const applicationImage = (slug: string) => pick(APPLICATION_IMAGES[slug]);

/** Illustrative fallback for a product without an uploaded photo. */
export const productFallbackImage = (slug: string, categorySlug: string) =>
  pick(PRODUCT_IMAGES[slug]) ?? categoryImage(categorySlug);
