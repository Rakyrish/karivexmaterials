import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { IMAGES } from "@/lib/images";
import type { SiteSettings } from "@/lib/types";

import { ContactLink } from "./ContactLink";
import { CountUp } from "./CountUp";
import { ArrowRightIcon, FlameIcon, PhoneIcon, SearchIcon, WhatsAppIcon } from "./Icons";

/* Fixed (not random) values so server and client render identically. */
const EMBERS = [
  { left: "6%", s: 5, x: 30, t: 9, d: 0 },
  { left: "12%", s: 3, x: -20, t: 11, d: 2.5 },
  { left: "19%", s: 6, x: 40, t: 8, d: 5 },
  { left: "27%", s: 4, x: -35, t: 12, d: 1 },
  { left: "34%", s: 3, x: 25, t: 10, d: 6.5 },
  { left: "42%", s: 5, x: -15, t: 9.5, d: 3.5 },
  { left: "49%", s: 4, x: 30, t: 11.5, d: 8 },
  { left: "56%", s: 7, x: -40, t: 8.5, d: 0.8 },
  { left: "62%", s: 3, x: 20, t: 13, d: 4.2 },
  { left: "68%", s: 5, x: -25, t: 9, d: 7 },
  { left: "74%", s: 6, x: 35, t: 10.5, d: 2 },
  { left: "80%", s: 4, x: -30, t: 12.5, d: 5.8 },
  { left: "86%", s: 5, x: 15, t: 8, d: 9 },
  { left: "92%", s: 3, x: -10, t: 11, d: 3 },
  { left: "97%", s: 4, x: -45, t: 9.8, d: 6 },
];

// Whole sentences rotate (no gaps); the verb is highlighted.
const ROTATING: [string, string][] = [
  ["build", "pizza ovens."],
  ["repair & reline", "pizza ovens."],
  ["supply & install", "roof cyclones."],
  ["repair", "roof cyclones."],
  ["deliver", "to your site."],
];

const CHIPS = [
  { label: "Fire bricks", href: "/products/fire-bricks-refractory-bricks", pos: "left-[-6%] top-[14%]", t: 6, delay: 0 },
  { label: "Refractory mortar", href: "/products/refractory-mortar", pos: "right-[-8%] top-[30%]", t: 7, delay: 1.2 },
  { label: "Ceramic fibre", href: "/products/ceramic-fibre-blanket", pos: "left-[-10%] bottom-[24%]", t: 6.5, delay: 0.6 },
  { label: "Roof cyclones", href: "/categories/roof-cyclones", pos: "right-[-2%] bottom-[10%]", t: 5.5, delay: 1.8 },
];

const TICKER = [
  "Fire bricks",
  "Refractory mortar",
  "Refractory cement",
  "Castable",
  "Ceramic fibre blanket",
  "Vermiculite",
  "Perlite",
  "Door seal rope",
  "High-temperature sealants",
  "600 mm stainless steel roof cyclones",
  "Cyclone installation",
  "Cyclone repair",
  "Oven building",
  "Repair & relining",
  "Material advice",
  "Delivery to site",
];

const style = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Animated landing hero. All motion is decorative CSS and is switched off
 * for visitors who prefer reduced motion (see globals.css). */
export function HomeHero({
  settings,
  intro,
  whatsapp,
  productCount,
  serviceCount,
}: {
  settings: SiteSettings;
  intro: string;
  whatsapp: string | null;
  productCount: number;
  serviceCount: number;
}) {
  const slides = [
    IMAGES["wood-fired-oven-pizzas"],
    IMAGES["cyclone-on-corrugated-roof"],
    IMAGES["pizza-oven-design-amber-tiles"],
    IMAGES["steel-roof-cyclone"],
  ];
  const cyclone = IMAGES["cyclone-on-corrugated-roof"];
  const pizza = IMAGES["margherita-round"];
  const regions = settings.regions_served.split(",").length;

  // "Pizza Oven Materials, Building & Repair" -> accent the part before the comma.
  const [accent, ...restParts] = settings.homepage_headline.split(",");
  const rest = restParts.join(",").trim();
  const accentWords = accent.trim().split(/\s+/);
  const restWords = rest ? rest.split(/\s+/) : [];
  let wordIndex = 0;
  const word = (text: string, extra = "") => {
    const delay = 0.15 + wordIndex++ * 0.09;
    return (
      <span key={`${text}-${delay}`} className={`rise inline-block ${extra}`} style={style({ "--delay": `${delay}s` })}>
        {text}
      </span>
    );
  };

  return (
    <section aria-labelledby="home-title" className="relative isolate overflow-hidden bg-[#07090f] text-white">
      {/* Background slideshow */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        {slides.map((slide, index) => (
          <div key={slide.key} className="hero-slide absolute inset-0" style={{ animationDelay: `${index * 7 - 1.7}s` }}>
            <Image
              src={slide.src}
              alt=""
              fill
              preload={index === 0}
              placeholder="blur"
              sizes="100vw"
              quality={75}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {/* Legibility overlays + oven glow + texture */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07090f] via-[#07090f]/85 to-[#07090f]/35" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#07090f] via-transparent to-[#07090f]/40" />
      <div
        aria-hidden="true"
        className="hero-glow absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(55%_60%_at_70%_100%,rgba(252,119,1,0.45),transparent_70%)]"
      />
      <div aria-hidden="true" className="hex-texture absolute inset-0 -z-10 opacity-40" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {EMBERS.map((e) => (
          <span
            key={e.left}
            className="ember"
            style={style({ left: e.left, "--s": `${e.s}px`, "--x": `${e.x}px`, "--t": `${e.t}s`, "--d": `${e.d}s` })}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:min-h-[42rem] lg:grid-cols-[1.1fr_1fr] lg:pb-20 lg:pt-20">
        {/* Copy */}
        <div>
          <p
            className="rise inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur"
            style={style({ "--delay": "0s" })}
          >
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-orange" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange" />
            </span>
            <FlameIcon className="text-orange" /> Pizza ovens · Roof cyclones · Nairobi
          </p>

          <h1
            id="home-title"
            className="mt-6 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-tight sm:text-[3.4rem] lg:text-[3.9rem]"
          >
            <span className="block">
              {accentWords.map((w, i) => (
                <span key={i}>
                  {word(w, "fire-text")}
                  {i < accentWords.length - 1 || rest ? " " : ""}
                </span>
              ))}
              {rest && <span className="sr-only">,</span>}
            </span>
            {rest && (
              <span className="block">
                {restWords.map((w, i) => (
                  <span key={i}>
                    {word(w)}
                    {i < restWords.length - 1 ? " " : ""}
                  </span>
                ))}
              </span>
            )}
          </h1>

          <p className="rise mt-5 text-lg font-semibold text-white/90 sm:text-2xl" style={style({ "--delay": "0.75s" })}>
            <span className="sr-only">
              We build, repair and reline pizza ovens, supply and repair roof cyclones, and deliver to your site.
            </span>
            <span aria-hidden="true" className="rotator">
              <span>
                {[...ROTATING, ROTATING[0]].map(([verb, rest], i) => (
                  <span key={i}>
                    We <span className="text-orange">{verb}</span> {rest}
                  </span>
                ))}
              </span>
            </span>
          </p>

          <p className="rise mt-5 max-w-xl text-lg leading-relaxed text-white/75" style={style({ "--delay": "0.9s" })}>
            {intro}
          </p>

          <div className="rise mt-8 flex flex-wrap gap-3" style={style({ "--delay": "1.05s" })}>
            <Link
              href="/products"
              className="shine inline-flex min-h-13 items-center gap-2 rounded-full bg-orange px-7 text-lg font-bold text-navy shadow-[0_12px_40px_-10px_rgba(252,119,1,0.9)] transition-transform hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Pizza oven materials <ArrowRightIcon />
            </Link>
            <Link
              href="/categories/roof-cyclones"
              className="inline-flex min-h-13 items-center gap-2 rounded-full bg-white px-7 text-lg font-bold text-navy transition-transform hover:-translate-y-0.5 hover:bg-mist"
            >
              Roof cyclones <ArrowRightIcon />
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-13 items-center rounded-full px-4 text-lg font-bold text-white underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
            >
              Our services
            </Link>
          </div>

          <form action="/products" role="search" className="rise mt-7 max-w-xl" style={style({ "--delay": "1.2s" })}>
            <label htmlFor="home-search" className="sr-only">
              Search oven materials
            </label>
            <div className="flex items-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur transition-shadow focus-within:ring-2 focus-within:ring-orange">
              <SearchIcon className="ml-5 shrink-0 text-white/70" />
              <input
                id="home-search"
                name="q"
                type="search"
                placeholder="Search fire bricks, roof cyclones, mortar…"
                className="min-h-12 w-full bg-transparent px-3 text-white placeholder:text-white/60 outline-none"
              />
              <button type="submit" className="mr-1.5 min-h-10 rounded-full bg-white px-5 text-sm font-bold text-navy hover:bg-orange">
                Search
              </button>
            </div>
          </form>

          <dl className="rise mt-10 grid max-w-xl grid-cols-3 gap-4" style={style({ "--delay": "1.35s" })}>
            {[
              { label: "Products", value: productCount },
              { label: "Services", value: serviceCount },
              { label: "Countries served", value: regions },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/60">{stat.label}</dt>
                <dd className="mt-1 font-display text-4xl font-extrabold text-orange">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Turntable pizza with floating chips and contact card */}
        <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-md lg:max-w-[34rem]">
          <div aria-hidden="true" className="absolute inset-[6%] rounded-full bg-orange/30 blur-3xl" />
          <div aria-hidden="true" className="pulse-ring absolute inset-[8%] rounded-full ring-2 ring-orange/60" />
          <div className="rise absolute inset-[8%]" style={style({ "--delay": "0.4s" })}>
            {/* Wooden-peel style plate under the turning pizza */}
            <div className="relative h-full w-full rounded-full bg-[radial-gradient(circle_at_35%_30%,#3a2a1c,#1b130c_70%)] p-[4%] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.95)] ring-1 ring-white/10">
              <div className="spin-slow relative h-full w-full">
                <Image src={pizza.src} alt={pizza.alt} fill sizes="(min-width:1024px) 30rem, 80vw" className="object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.6)]" />
              </div>
            </div>
          </div>

          <Link
            href="/categories/roof-cyclones"
            className="float group absolute -right-2 -top-4 z-10 hidden w-36 flex-col items-center sm:flex lg:-right-8 lg:w-40"
            style={style({ "--t": "6.5s", "--delay": "0.3s" })}
          >
            <span className="relative block aspect-square w-full overflow-hidden rounded-full border-[6px] border-[#07090f] shadow-2xl ring-2 ring-orange/70">
              <Image src={cyclone.src} alt={cyclone.alt} fill placeholder="blur" sizes="320px" className="origin-[74%_22%] scale-[2.4] object-cover object-[74%_22%]" />
            </span>
            <span className="relative z-10 -mt-4 rounded-full bg-orange px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-navy shadow-lg group-hover:bg-white">
              Roof cyclones
            </span>
          </Link>

          {CHIPS.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className={`float absolute hidden ${chip.pos} items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-navy shadow-xl ring-1 ring-black/5 transition-colors hover:bg-orange sm:inline-flex`}
              style={style({ "--t": `${chip.t}s`, "--delay": `${chip.delay}s` })}
            >
              <span className="h-2 w-2 rounded-full bg-orange" aria-hidden="true" />
              {chip.label}
            </Link>
          ))}

          <div
            className="float absolute bottom-[-2%] left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-navy/95 px-4 py-3 shadow-2xl ring-1 ring-white/15 backdrop-blur lg:left-[2%] lg:translate-x-0"
            style={style({ "--t": "7s", "--delay": "0.9s" })}
          >
            {settings.primary_phone_href && (
              <ContactLink
                kind="phone"
                href={settings.primary_phone_href}
                placement="home_hero"
                ariaLabel={`Call ${settings.primary_phone}`}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-orange text-lg text-navy hover:bg-white"
              >
                <PhoneIcon />
              </ContactLink>
            )}
            {whatsapp && (
              <ContactLink
                kind="whatsapp"
                href={whatsapp}
                placement="home_hero"
                ariaLabel="Chat on WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-xl text-white hover:bg-white hover:text-[#1f7a43]"
              >
                <WhatsAppIcon />
              </ContactLink>
            )}
            <span className="whitespace-nowrap text-sm leading-tight">
              <span className="block font-semibold">Ovens &amp; cyclones: call us</span>
              <span className="text-white/70">{settings.primary_phone}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="marquee relative border-y border-white/10 bg-black/40 py-3 backdrop-blur" aria-hidden="true">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              {item}
              <FlameIcon className="text-orange" />
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-16 left-1/2 hidden -translate-x-1/2 lg:block" aria-hidden="true">
        <span className="scroll-cue block h-9 w-5 rounded-full border-2 border-white/40">
          <span className="mx-auto mt-1.5 block h-2 w-1 rounded-full bg-white/70" />
        </span>
      </div>

      <p className="absolute bottom-14 right-3 text-[0.65rem] text-white/45">
        Illustrative photos ·{" "}
        <Link href="/image-credits" className="underline">
          credits
        </Link>
      </p>
    </section>
  );
}
