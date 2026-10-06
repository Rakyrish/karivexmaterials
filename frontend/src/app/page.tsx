import Link from "next/link";

import { ContactLink } from "@/components/ContactLink";
import { ArrowRightIcon, ExternalIcon, PhoneIcon, SearchIcon, WhatsAppIcon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { CategoryBadge, Container, SectionHeading } from "@/components/Section";
import { getApplications, getProducts } from "@/lib/api";
import { SITE_ORIGIN } from "@/lib/config";
import { generalWhatsAppMessage, whatsappHref } from "@/lib/contact";
import { loadCategories, loadSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

const DEFAULT_INTRO =
  "Building and acoustic insulation, refractory cements, fire bricks and ceramic fibre, roof ventilators, EPS boxes for cold-chain packing, refrigeration insulation and copper pipe, and industrial tapes and sealants — supplied from Nairobi. Send us your specifications and quantities and we will prepare a quotation.";

export async function generateMetadata() {
  const settings = await loadSettings();
  return pageMetadata({
    title: "KariVex Industrial Materials | Insulation, Refractory & Packaging Supplies in Kenya",
    absoluteTitle: true,
    description:
      settings.homepage_intro ||
      "Industrial Materials Division of KariVex Solutions Ltd: insulation, refractory and high-temperature materials, roof ventilators, EPS cold-chain boxes, refrigeration materials and industrial tapes. Request a quotation.",
    path: "/",
  });
}

export default async function HomePage() {
  const [settings, categories, applications, featured] = await Promise.all([
    loadSettings(),
    loadCategories(),
    getApplications(),
    getProducts({ page_size: 8 }),
  ]);
  const wa = whatsappHref(settings, generalWhatsAppMessage(SITE_ORIGIN));

  return (
    <>
      <section className="hex-texture relative overflow-hidden bg-navy text-white" aria-labelledby="home-title">
        <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-orange" aria-hidden="true" />
              {settings.division_descriptor} · {settings.relationship_wording}
            </p>
            <h1 id="home-title" className="mt-5 font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
              {settings.homepage_headline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">{settings.homepage_intro || DEFAULT_INTRO}</p>

            <form action="/products" role="search" className="mt-8 max-w-xl">
              <label htmlFor="home-search" className="text-sm font-semibold text-white/90">
                Search the catalogue
              </label>
              <div className="mt-2 flex overflow-hidden rounded-lg bg-white shadow-lg">
                <input
                  id="home-search"
                  name="q"
                  type="search"
                  placeholder="e.g. ceramic fibre blanket, rock wool, EPS fish box"
                  className="min-h-13 w-full px-4 text-ink outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-orange px-5 font-bold text-navy hover:bg-orange-600"
                >
                  <SearchIcon /> <span className="hidden sm:inline">Search</span>
                  <span className="sr-only sm:hidden">Search</span>
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center gap-2 rounded-md bg-orange px-5 font-bold text-navy hover:bg-orange-600"
              >
                Browse all products <ArrowRightIcon />
              </Link>
              <Link
                href="/quote"
                className="inline-flex min-h-12 items-center rounded-md border-2 border-white px-5 font-bold text-white hover:bg-white hover:text-navy"
              >
                Request a quote
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 text-ink shadow-2xl sm:p-8">
            <h2 className="font-display text-xl font-bold text-navy">How to get a quotation</h2>
            <ol className="mt-4 space-y-4">
              {[
                ["Find your materials", "Browse by category or application, or search by name."],
                ["Add them to your quote basket", "Choose the option, quantity and unit for each item."],
                ["Send one request", "Include your specifications, quantities and delivery location."],
              ].map(([title, text], index) => (
                <li key={title} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-bold text-white">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block font-semibold text-navy">{title}</span>
                    <span className="text-sm text-slate">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-6 grid gap-2 border-t border-line pt-5 sm:grid-cols-2">
              {settings.primary_phone_href && (
                <ContactLink
                  kind="phone"
                  href={settings.primary_phone_href}
                  placement="home_hero"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-navy px-3 font-semibold text-navy hover:bg-mist"
                >
                  <PhoneIcon /> {settings.primary_phone}
                </ContactLink>
              )}
              {wa && (
                <ContactLink
                  kind="whatsapp"
                  href={wa}
                  placement="home_hero"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#1f7a43] px-3 font-semibold text-white hover:bg-[#17633a]"
                >
                  <WhatsAppIcon /> WhatsApp us
                </ContactLink>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="categories-title" className="py-16">
        <Container>
          <SectionHeading
            id="categories-title"
            title="Product categories"
            intro="Six product families covering construction, insulation, high-temperature, packaging, refrigeration and industrial sealing work."
            href="/categories"
            linkLabel="All categories"
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-line bg-white p-6 transition-shadow hover:border-navy/30 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <CategoryBadge code={category.short_code} />
                    <div>
                      <h3 className="font-display text-xl font-bold leading-tight text-navy group-hover:underline">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate">
                        {category.product_count} product{category.product_count === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm text-slate">{category.intro}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-navy">
                    Explore <ArrowRightIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {featured.results.length > 0 && (
        <section aria-labelledby="featured-title" className="bg-mist py-16">
          <Container>
            <SectionHeading
              id="featured-title"
              title="Materials in the catalogue"
              intro="A selection from the full range. Every product page lists its options and lets you add it to a quotation request."
              href="/products"
              linkLabel={`View all ${featured.count} products`}
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {applications.length > 0 && (
        <section aria-labelledby="applications-title" className="py-16">
          <Container>
            <SectionHeading
              id="applications-title"
              title="Shop by application"
              intro="Selection guidance and the relevant products for common jobs."
              href="/applications"
              linkLabel="All applications"
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((application) => (
                <li key={application.slug}>
                  <Link
                    href={`/applications/${application.slug}`}
                    className="group flex h-full items-start justify-between gap-4 rounded-xl border-l-4 border-orange bg-white p-5 shadow-sm ring-1 ring-line hover:shadow-md"
                  >
                    <span>
                      <span className="block font-display text-lg font-bold text-navy group-hover:underline">
                        {application.name}
                      </span>
                      <span className="mt-1 block text-sm text-slate">{application.summary}</span>
                    </span>
                    <ArrowRightIcon className="mt-1 shrink-0 text-navy" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section aria-labelledby="quote-cta" className="pb-4">
        <Container>
          <div className="grid gap-6 rounded-2xl bg-orange p-8 text-navy sm:p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <h2 id="quote-cta" className="font-display text-3xl font-extrabold">
                Have a materials list or drawing?
              </h2>
              <p className="mt-2 text-lg font-medium">
                Add the products to your quote basket, or send us your specification and quantities directly. We serve{" "}
                {settings.regions_served}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/quote" className="inline-flex min-h-12 items-center rounded-md bg-navy px-6 font-bold text-white hover:bg-navy-700">
                Open quote basket
              </Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center rounded-md border-2 border-navy px-6 font-bold text-navy hover:bg-navy hover:text-white">
                Contact sales
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 rounded-xl border border-line p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate">
              <strong className="text-navy">Looking for industrial chemicals?</strong> They are supplied by the{" "}
              {settings.chemical_division_name}.
            </p>
            <a
              href={settings.chemical_division_url}
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-navy underline"
            >
              Visit the Chemical Division <ExternalIcon />
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
