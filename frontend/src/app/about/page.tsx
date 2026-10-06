import Image from "next/image";
import Link from "next/link";

import logo from "../../../public/brand/karivex-logo.png";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExternalIcon } from "@/components/Icons";
import { Container, PageHero } from "@/components/Section";
import { loadCategories, loadServices, loadSettings } from "@/lib/data";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us — Pizza Ovens & Roof Cyclones",
  description:
    "KariVex Industrial Materials, the Industrial Materials Division of KariVex Solutions Ltd, supplies pizza oven materials, builds and repairs pizza ovens, and supplies and repairs roof cyclones from Nairobi.",
  path: "/about",
});

export default async function AboutPage() {
  const [settings, categories, services] = await Promise.all([loadSettings(), loadCategories(), loadServices()]);
  const photo = IMAGES["pizzaiolo-oven"];
  return (
    <>
      <PageHero title="About KariVex Industrial Materials" breadcrumbs={<Breadcrumbs items={[{ name: "About", href: "/about" }]} />}>
        <p>
          {settings.site_name} is the {settings.division_descriptor} of {settings.parent_company_name}. It is a
          division of the company, not a separately registered business. Our focus is pizza ovens — the materials that
          go into them, and building, repairing and delivering for them — and roof cyclones, which we supply, install
          and repair.
        </p>
      </PageHero>
      <Container className="grid gap-12 py-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="prose-copy max-w-3xl space-y-4 text-lg text-ink">
          <h2 className="font-display text-2xl font-bold text-navy">What we supply</h2>
          <p>Materials for every part of a pizza oven, and roof cyclones:</p>
          <ul className="list-disc space-y-1 pl-6 text-base">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/categories/${category.slug}`} className="font-semibold text-navy underline">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="pt-4 font-display text-2xl font-bold text-navy">What we do</h2>
          <ul className="list-disc space-y-1 pl-6 text-base">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className="font-semibold text-navy underline">
                  {service.name}
                </Link>{" "}
                — {service.summary}
              </li>
            ))}
          </ul>
          <p>
            We work with pizzerias, restaurants, hotels, bakeries, oven builders, factories, warehouses and home owners. Every oven is
            different, so we quote materials and work against your oven size, design and location rather than
            publishing fixed prices.
          </p>

          <h2 className="pt-4 font-display text-2xl font-bold text-navy">Part of {settings.parent_company_name}</h2>
          <p>
            {settings.parent_company_name} also operates a Chemical Division, which supplies industrial chemicals
            through the company&apos;s main website. The two divisions share the same company contact lines and
            warehouse on {settings.address_line.split(",").slice(0, 2).join(",")}.
          </p>
          <p>
            <a href={settings.chemical_division_url} className="inline-flex items-center gap-1 font-semibold text-navy underline">
              Visit the {settings.chemical_division_name} website <ExternalIcon />
            </a>
          </p>

          <h2 className="pt-4 font-display text-2xl font-bold text-navy">Working with us</h2>
          <ul className="list-disc space-y-2 pl-6 text-base">
            <li>
              Product specifications, ratings and brands are published only where they have been confirmed. Ask for the
              manufacturer&apos;s datasheet for any product we quote.
            </li>
            <li>The scope, price and timing of building, repair and delivery work are confirmed in each quotation.</li>
            <li>We serve customers in {settings.regions_served}.</li>
            <li>Office and warehouse hours: {settings.hours_text}.</li>
          </ul>
        </div>
        <aside className="space-y-6">
          <figure className="overflow-hidden rounded-2xl border border-line">
            <Image src={photo.src} alt={photo.alt} placeholder="blur" sizes="(min-width:1024px) 33vw, 100vw" className="h-auto w-full" />
            <figcaption className="p-3 text-xs text-slate">Illustrative photo</figcaption>
          </figure>
          <div className="flex justify-center rounded-2xl border border-line bg-white p-8">
            <Image src={logo} alt="KariVex — Strength Behind Every Project" className="h-auto w-56" sizes="224px" />
          </div>
          <div className="rounded-2xl bg-navy p-6 text-white">
            <h2 className="font-display text-xl font-bold">Planning a pizza oven?</h2>
            <p className="mt-2 text-white/85">Get the materials, or let us build or repair it for you.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/services" className="inline-flex min-h-11 items-center rounded-md bg-orange px-4 font-semibold text-navy hover:bg-orange-600">
                Our services
              </Link>
              <Link href="/contact" className="inline-flex min-h-11 items-center rounded-md border border-white px-4 font-semibold hover:bg-white hover:text-navy">
                Contact us
              </Link>
            </div>
          </div>
        </aside>
      </Container>
    </>
  );
}
