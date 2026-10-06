import Image from "next/image";
import Link from "next/link";

import { IMAGES } from "@/lib/images";
import type { SiteSettings } from "@/lib/types";

import { ContactLink } from "./ContactLink";
import { ArrowRightIcon, CheckIcon, FlameIcon, PhoneIcon, SearchIcon, WhatsAppIcon } from "./Icons";

/** Landing hero: copy and actions on the left, a photo collage of a real
 * wood-fired oven and pizza on the right. Counts come from live records. */
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
  const oven = IMAGES["pizza-peel-oven"];
  const pizza = IMAGES["neapolitan-pizza"];
  const regions = settings.regions_served.split(",").length;

  return (
    <section
      aria-labelledby="home-title"
      className="relative isolate overflow-hidden bg-[#0b0f1a] text-white"
    >
      {/* Ember glow + texture — decorative. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_75%_55%,rgba(252,119,1,0.35),transparent_65%),radial-gradient(45%_60%_at_10%_0%,rgba(2,21,51,0.9),transparent_70%)]"
      />
      <div aria-hidden="true" className="hex-texture absolute inset-0 -z-10 opacity-60" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-orange/15 px-3 py-1 text-sm font-semibold text-orange ring-1 ring-orange/40">
            <FlameIcon /> Pizza oven specialists · {settings.relationship_wording}
          </p>
          <h1
            id="home-title"
            className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {settings.homepage_headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex min-h-13 items-center gap-2 rounded-full bg-orange px-7 text-lg font-bold text-navy shadow-[0_10px_30px_-10px_rgba(252,119,1,0.8)] hover:bg-orange-600"
            >
              Shop oven materials <ArrowRightIcon />
            </Link>
            <Link
              href="/services/pizza-oven-building"
              className="inline-flex min-h-13 items-center rounded-full border-2 border-white/80 px-7 text-lg font-bold text-white hover:bg-white hover:text-navy"
            >
              Get an oven built
            </Link>
          </div>

          <form action="/products" role="search" className="mt-8 max-w-xl">
            <label htmlFor="home-search" className="sr-only">
              Search oven materials
            </label>
            <div className="flex items-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/20 focus-within:ring-orange">
              <SearchIcon className="ml-5 shrink-0 text-white/70" />
              <input
                id="home-search"
                name="q"
                type="search"
                placeholder="Search fire bricks, mortar, door rope…"
                className="min-h-12 w-full bg-transparent px-3 text-white placeholder:text-white/60 outline-none"
              />
              <button type="submit" className="mr-1.5 min-h-10 rounded-full bg-white px-5 text-sm font-bold text-navy hover:bg-orange">
                Search
              </button>
            </div>
          </form>

          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/15 pt-6">
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">Oven materials</dt>
              <dd className="font-display text-3xl font-extrabold text-orange">{productCount}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">Oven services</dt>
              <dd className="font-display text-3xl font-extrabold text-orange">{serviceCount}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">Countries served</dt>
              <dd className="font-display text-3xl font-extrabold text-orange">{regions}</dd>
            </div>
          </dl>
        </div>

        {/* Photo collage */}
        <div className="relative mx-auto w-full max-w-xl pb-10 lg:pb-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/10 sm:aspect-[5/6]">
            <Image
              src={oven.src}
              alt={oven.alt}
              fill
              preload
              placeholder="blur"
              sizes="(min-width:1024px) 40vw, 90vw"
              className="object-cover object-[62%_50%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/95 p-4 text-ink shadow-xl backdrop-blur sm:inset-x-auto sm:left-5 sm:w-60">
              <p className="font-display text-lg font-bold text-navy">We build & repair ovens</p>
              <ul className="mt-2 space-y-1 text-sm">
                {["New pizza ovens", "Relining & repairs", "Delivery to site"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckIcon className="text-orange-600" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/services" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-navy underline">
                See services <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <div className="absolute -left-4 -top-6 hidden aspect-square w-44 overflow-hidden rounded-full border-[6px] border-[#0b0f1a] shadow-2xl sm:block lg:-left-12 lg:w-52">
            <Image src={pizza.src} alt={pizza.alt} fill placeholder="blur" sizes="208px" className="object-cover object-[35%_50%]" />
          </div>

          <div className="absolute -bottom-2 right-4 flex items-center gap-3 rounded-2xl bg-navy px-4 py-3 shadow-xl ring-1 ring-white/10 sm:-right-4 sm:bottom-auto sm:top-8">
            {settings.primary_phone_href && (
              <ContactLink
                kind="phone"
                href={settings.primary_phone_href}
                placement="home_hero"
                ariaLabel={`Call ${settings.primary_phone}`}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg text-navy hover:bg-orange"
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
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1f7a43] text-xl text-white hover:bg-[#17633a]"
              >
                <WhatsAppIcon />
              </ContactLink>
            )}
            <span className="text-sm leading-tight">
              <span className="block font-semibold">Talk to us</span>
              <span className="text-white/70">{settings.primary_phone}</span>
            </span>
          </div>

          <p className="absolute -bottom-8 right-2 text-[0.65rem] text-white/45 lg:-bottom-6">
            Illustrative photos ·{" "}
            <Link href="/image-credits" className="underline">
              credits
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
