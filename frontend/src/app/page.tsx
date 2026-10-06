import Image from "next/image";
import Link from "next/link";

import { HomeHero } from "@/components/HomeHero";
import { Testimonials } from "@/components/Testimonials";
import { ArrowRightIcon, CheckIcon, ExternalIcon, TruckIcon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { Container, SectionHeading } from "@/components/Section";
import { getApplications, getProducts, getTestimonials } from "@/lib/api";
import { SITE_ORIGIN } from "@/lib/config";
import { generalWhatsAppMessage, whatsappHref } from "@/lib/contact";
import { loadCategories, loadServices, loadSettings } from "@/lib/data";
import { IMAGES, applicationImage, categoryImage, serviceImage } from "@/lib/images";
import { ARTICLES } from "@/lib/articles";
import { pageMetadata } from "@/lib/seo";

const FEATURED_GUIDES = ["/pizza-oven-guide", "/roof-cyclone-guide", "/guides/choosing-fire-bricks", "/guides/ventilating-hot-metal-roofs"].map(
  (href) => ARTICLES.find((a) => a.href === href)!,
);

const DEFAULT_INTRO =
  "Fire bricks, refractory cement and mortar, castable, ceramic fibre insulation, vermiculite, perlite and door seals for pizza ovens, plus oven building, repair and relining — and stainless steel roof cyclones, supplied, installed and repaired. Delivered from Nairobi.";

export async function generateMetadata() {
  const settings = await loadSettings();
  return pageMetadata({
    title: "Pizza Oven Materials & Roof Cyclones in Kenya | KariVex",
    absoluteTitle: true,
    description:
      settings.homepage_intro ||
      "Pizza oven materials and services from KariVex Industrial Materials, Nairobi: fire bricks, refractory cement and mortar, insulation and door seals, oven building and repair — plus roof cyclones (turbine ventilators) for sale and repair.",
    path: "/",
  });
}

export default async function HomePage() {
  const [settings, categories, services, applications, featured, testimonials] = await Promise.all([
    loadSettings(),
    loadCategories(),
    loadServices(),
    getApplications(),
    getProducts({ page_size: 8 }),
    getTestimonials(),
  ]);
  const wa = whatsappHref(settings, generalWhatsAppMessage(SITE_ORIGIN));

  return (
    <>
      <HomeHero
        settings={settings}
        intro={settings.homepage_intro || DEFAULT_INTRO}
        whatsapp={wa}
        productCount={featured.count}
        serviceCount={services.length}
      />

      <section aria-labelledby="categories-title" className="py-16">
        <Container>
          <SectionHeading
            id="categories-title"
            title="Shop by category"
            intro="Everything for the floor, dome, insulation and door of a pizza oven — and roof cyclones."
            href="/products"
            linkLabel="All materials"
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const img = categoryImage(category.slug);
              return (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-navy text-white shadow-sm"
                  >
                    {(category.image || img) && (
                      <Image
                        src={category.image || img!.src}
                        alt={category.image ? category.image_alt : img!.alt}
                        fill
                        placeholder={category.image ? "empty" : "blur"}
                        sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" aria-hidden="true" />
                    <span className="relative p-5">
                      <span className="block font-display text-2xl font-bold leading-tight group-hover:underline">{category.name}</span>
                      <span className="mt-1 block text-sm text-white/85">
                        {category.product_count} product{category.product_count === 1 ? "" : "s"}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="cyclones-title" className="relative overflow-hidden py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={IMAGES["cyclone-on-corrugated-roof"].src}
                alt={IMAGES["cyclone-on-corrugated-roof"].alt}
                fill
                placeholder="blur"
                sizes="(min-width:1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 hidden w-2/3 overflow-hidden rounded-2xl border-4 border-white shadow-2xl sm:block">
              <div className="relative aspect-[3/1]">
                <Image
                  src={IMAGES["industrial-roof-cyclones"].src}
                  alt={IMAGES["industrial-roof-cyclones"].alt}
                  fill
                  placeholder="blur"
                  sizes="30vw"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate">Illustrative photos</p>
          </div>
          <div>
            <span aria-hidden="true" className="block h-1 w-12 rounded bg-orange" />
            <p className="mt-3 text-sm font-bold uppercase tracking-wider text-orange-600">Roof cyclones</p>
            <h2 id="cyclones-title" className="mt-1 font-display text-3xl font-extrabold text-navy sm:text-4xl">
              Roof cyclones — supplied, installed and repaired
            </h2>
            <p className="mt-3 text-lg text-slate">
              Wind-driven roof cyclones (turbine ventilators) pull hot, stale and humid air out of factories, warehouses,
              schools and homes with no electricity. We stock 600 mm stainless steel cyclones, install them, and repair
              noisy, wobbling, stuck or leaking ones.
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {["600 mm stainless steel", "No electricity or running cost", "Supply & installation", "Repairs & leaking bases resealed"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-ink">
                    <CheckIcon className="shrink-0 text-orange-600" /> {item}
                  </li>
                ),
              )}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products/roof-ventilators-roof-cyclones"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-orange px-6 font-bold text-navy hover:bg-orange-600"
              >
                Buy roof cyclones <ArrowRightIcon />
              </Link>
              <Link
                href="/services/roof-cyclone-installation"
                className="inline-flex min-h-12 items-center rounded-full border-2 border-navy px-6 font-bold text-navy hover:bg-navy hover:text-white"
              >
                Installation
              </Link>
              <Link
                href="/services/roof-cyclone-repair"
                className="inline-flex min-h-12 items-center rounded-full border-2 border-navy px-6 font-bold text-navy hover:bg-navy hover:text-white"
              >
                Repair
              </Link>
              <Link href="/roof-cyclone-guide" className="inline-flex min-h-12 items-center gap-1 px-2 font-semibold text-navy underline">
                Read the cyclone guide
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {services.length > 0 && (
        <section aria-labelledby="services-title" className="hex-texture bg-navy py-16 text-white">
          <Container>
            <span aria-hidden="true" className="block h-1 w-12 rounded bg-orange" />
            <h2 id="services-title" className="mt-3 font-display text-3xl font-extrabold">
              Our services
            </h2>
            <p className="mt-2 max-w-2xl text-white/85">
              We don&apos;t only supply the materials — we build and repair pizza ovens, install and repair roof
              cyclones, help you plan your project and deliver to your site.
            </p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const img = serviceImage(service.slug);
                return (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white text-ink shadow-lg"
                    >
                      <span className="relative block aspect-[16/10] bg-navy-700">
                        {img ? (
                          <Image src={img.src} alt="" fill placeholder="blur" sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                        ) : (
                          <span className="flex h-full items-center justify-center text-5xl text-orange">
                            <TruckIcon />
                          </span>
                        )}
                      </span>
                      <span className="flex flex-1 flex-col p-5">
                        <span className="font-display text-xl font-bold text-navy group-hover:underline">{service.name}</span>
                        <span className="mt-1 text-sm text-slate">{service.summary}</span>
                        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-navy">
                          Request <ArrowRightIcon />
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}


      {featured.results.length > 0 && (
        <section aria-labelledby="featured-title" className="bg-mist py-16">
          <Container>
            <SectionHeading
              id="featured-title"
              title="Shop products"
              intro="Oven materials and roof cyclones. Add what you need to your quote basket — we price it for your quantity and delivery location."
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

      <section aria-labelledby="learn-title" className="py-16">
        <Container>
          <SectionHeading
            id="learn-title"
            title="Learn before you buy"
            intro="Free guides to pizza ovens and roof cyclones — how they work, what to choose and how to look after them."
            href="/guides"
            linkLabel="All guides"
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_GUIDES.map((guide) => (
              <li key={guide.href}>
                <Link href={guide.href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white hover:shadow-lg">
                  <span className="relative block aspect-[16/10]">
                    <Image src={IMAGES[guide.imageKey].src} alt="" fill placeholder="blur" sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">{guide.topic}</span>
                    <span className="mt-1 font-display text-lg font-bold leading-snug text-navy group-hover:underline">{guide.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {applications.length > 0 && (
        <section aria-labelledby="applications-title" className="pb-16">
          <Container>
            <SectionHeading
              id="applications-title"
              title="Oven projects"
              intro="Material choices and support for each kind of job."
              href="/applications"
              linkLabel="All projects"
            />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {applications.map((application) => {
                const img = applicationImage(application.slug);
                return (
                  <li key={application.slug}>
                    <Link href={`/applications/${application.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white hover:shadow-md">
                      {img && (
                        <span className="relative block aspect-[16/10]">
                          <Image src={img.src} alt="" fill placeholder="blur" sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                        </span>
                      )}
                      <span className="flex flex-1 flex-col p-5">
                        <span className="font-display text-lg font-bold text-navy group-hover:underline">{application.name}</span>
                        <span className="mt-1 text-sm text-slate">{application.summary}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}

      <Testimonials testimonials={testimonials} settings={settings} />

      <section aria-labelledby="quote-cta" className="pb-4">
        <Container>
          <div className="grid gap-6 rounded-2xl bg-orange p-8 text-navy sm:p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <h2 id="quote-cta" className="font-display text-3xl font-extrabold">
                Planning a pizza oven?
              </h2>
              <p className="mt-2 text-lg font-medium">
                Send us the size and location — we&apos;ll quote the materials, or the complete build.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/services/pizza-oven-building" className="inline-flex min-h-12 items-center rounded-md bg-navy px-6 font-bold text-white hover:bg-navy-700">
                Request an oven build
              </Link>
              <Link href="/quote" className="inline-flex min-h-12 items-center rounded-md border-2 border-navy px-6 font-bold text-navy hover:bg-navy hover:text-white">
                Quote basket
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 rounded-xl border border-line p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate">
              <strong className="text-navy">Looking for industrial chemicals?</strong> They are supplied by the{" "}
              {settings.chemical_division_name}.
            </p>
            <a href={settings.chemical_division_url} className="inline-flex min-h-11 items-center gap-2 font-semibold text-navy underline">
              Visit the Chemical Division <ExternalIcon />
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
