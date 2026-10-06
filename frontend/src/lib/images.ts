import type { StaticImageData } from "next/image";

import firebrick from "@/assets/pizza/fire-brick.jpg";
import margherita from "@/assets/pizza/margherita-pizza.jpg";
import neapolitan from "@/assets/pizza/neapolitan-pizza.jpg";
import ovenFireFloor from "@/assets/pizza/oven-fire-floor.jpg";
import peelOven from "@/assets/pizza/pizza-peel-oven.jpg";
import pizzaiolo from "@/assets/pizza/pizzaiolo-oven.jpg";
import pizzeriaOven from "@/assets/pizza/pizzeria-brick-oven.jpg";
import tiledOven from "@/assets/pizza/tiled-oven-mouth.jpg";
import vermiculite from "@/assets/pizza/vermiculite.jpg";
import woodFired from "@/assets/pizza/wood-fired-oven-pizzas.jpg";
import credits from "@/data/image-credits.json";

/** Licensed stock photographs (Wikimedia Commons, see /image-credits).
 * They illustrate pizza ovens and materials in general; they are never
 * presented as photographs of KariVex's own stock or projects. */

export interface IllustrativeImage {
  key: string;
  src: StaticImageData;
  alt: string;
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
  "neapolitan-pizza": neapolitan,
  "pizzeria-brick-oven": pizzeriaOven,
};

export const IMAGES: Record<string, IllustrativeImage> = Object.fromEntries(
  credits.map((c) => [c.key, { key: c.key, src: SOURCES[c.key], alt: c.alt }]),
);

export const IMAGE_CREDITS = credits;

export const HERO_IMAGE = IMAGES["wood-fired-oven-pizzas"];

const CATEGORY_IMAGES: Record<string, string> = {
  "oven-floor-hearth": "oven-fire-floor",
  "dome-walls-bonding": "pizzeria-brick-oven",
  "pizza-oven-insulation": "vermiculite",
  "door-seals-finishing": "tiled-oven-mouth",
};

const SERVICE_IMAGES: Record<string, string> = {
  "pizza-oven-building": "pizza-peel-oven",
  "pizza-oven-repair-relining": "pizzeria-brick-oven",
  "pizza-oven-material-advice": "fire-brick",
};

const APPLICATION_IMAGES: Record<string, string> = {
  "new-pizza-oven-builds": "oven-fire-floor",
  "pizza-oven-repair": "pizzeria-brick-oven",
  "pizzerias-restaurants": "pizzaiolo-oven",
  "home-garden-pizza-ovens": "pizza-peel-oven",
};

// Products whose material type is itself shown in a stock photo.
const PRODUCT_IMAGES: Record<string, string> = {
  "fire-bricks-refractory-bricks": "fire-brick",
  vermiculite: "vermiculite",
};

const pick = (key: string | undefined) => (key ? IMAGES[key] : undefined);

export const categoryImage = (slug: string) => pick(CATEGORY_IMAGES[slug]);
export const serviceImage = (slug: string) => pick(SERVICE_IMAGES[slug]);
export const applicationImage = (slug: string) => pick(APPLICATION_IMAGES[slug]);

/** Illustrative fallback for a product without an uploaded photo. */
export const productFallbackImage = (slug: string, categorySlug: string) =>
  pick(PRODUCT_IMAGES[slug]) ?? categoryImage(categorySlug);
