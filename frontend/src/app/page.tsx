import Image from "next/image";
import Link from "next/link";

import { HomeHero } from "@/components/HomeHero";
import { ArrowRightIcon, ExternalIcon, TruckIcon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { Container, SectionHeading } from "@/components/Section";
import { getApplications, getProducts } from "@/lib/api";
import { SITE_ORIGIN } from "@/lib/config";
import { generalWhatsAppMessage, whatsappHref } from "@/lib/contact";
import { loadCategories, loadServices, loadSettings } from "@/lib/data";
import { IMAGES, applicationImage, categoryImage, serviceImage } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

const DEFAULT_INTRO =
  "Fire bricks, refractory cement and mortar, castable, ceramic fibre insulation, vermiculite, perlite and door seals for pizza ovens — plus oven building, repair and relining, material advice and delivery. Supplied from Nairobi.";

export async function generateMetadata() {
  const settings = await loadSettings();
  return pageMetadata({
    title: "Pizza Oven Materials, Building & Repair | KariVex Industrial Materials",
    absoluteTitle: true,
    description:
      settings.homepage_intro ||
      "Pizza oven materials and services from KariVex Industrial Materials, Nairobi: fire bricks, refractory cement and mortar, oven insulation and door seals, plus oven building, repair, advice and delivery.",
    path: "/",
  });
}

export default async function HomePage() {
  const [settings, categories, services, applications, featured] = await Promise.all([
    loadSettings(),
    loadCategories(),
    loadServices(),
    getApplications(),
    getProducts({ page_size: 8 }),
  ]);
  const wa = whatsappHref(settings, generalWhatsAppMessage(SITE_ORIGIN));
  const guideImage = IMAGES["margherita-pizza"];

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
            title="Pizza oven materials"
            intro="Everything for the floor, dome, insulation and door of a pizza oven."
            href="/products"
            linkLabel="All materials"
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      {services.length > 0 && (
        <section aria-labelledby="services-title" className="hex-texture bg-navy py-16 text-white">
          <Container>
            <span aria-hidden="true" className="block h-1 w-12 rounded bg-orange" />
            <h2 id="services-title" className="mt-3 font-display text-3xl font-extrabold">
              Pizza oven services
            </h2>
            <p className="mt-2 max-w-2xl text-white/85">
              We don&apos;t only supply the materials — we can build the oven, repair it, help you plan it and deliver
              to your site.
            </p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              title="Shop oven materials"
              intro="Add what you need to your quote basket — we price it for your quantity and delivery location."
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

      <section aria-labelledby="guide-title" className="py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={guideImage.src} alt={guideImage.alt} fill placeholder="blur" sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <span aria-hidden="true" className="block h-1 w-12 rounded bg-orange" />
            <h2 id="guide-title" className="mt-3 font-display text-3xl font-extrabold text-navy">
              How a pizza oven is built
            </h2>
            <p className="mt-3 text-lg text-slate">
              An insulated hearth, a fire-brick cooking floor, a dome that stores and reflects heat, insulation over the
              top and a sealed door. Our guide walks through each layer, the materials used, and how to cure a new oven
              without cracking it.
            </p>
            <Link href="/pizza-oven-guide" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-md bg-navy px-5 font-bold text-white hover:bg-navy-700">
              Read the pizza oven guide <ArrowRightIcon />
            </Link>
          </div>
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
