import Image from "next/image";
import Link from "next/link";

import logo from "../../../public/brand/karivex-logo.png";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExternalIcon } from "@/components/Icons";
import { Container, PageHero } from "@/components/Section";
import { loadCategories, loadSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the Industrial Materials Division",
  description:
    "KariVex Industrial Materials is the Industrial Materials Division of KariVex Solutions Ltd, supplying insulation, refractory, packaging, refrigeration and industrial sealing materials from Nairobi.",
  path: "/about",
});

export default async function AboutPage() {
  const [settings, categories] = await Promise.all([loadSettings(), loadCategories()]);
  return (
    <>
      <PageHero
        title="About KariVex Industrial Materials"
        breadcrumbs={<Breadcrumbs items={[{ name: "About", href: "/about" }]} />}
      >
        <p>
          {settings.site_name} is the {settings.division_descriptor} of {settings.parent_company_name}. It is a
          division of the company, not a separately registered business.
        </p>
      </PageHero>
      <Container className="grid gap-12 py-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="prose-copy max-w-3xl space-y-4 text-lg text-ink">
          <h2 className="font-display text-2xl font-bold text-navy">What the division supplies</h2>
          <p>
            The Industrial Materials Division brings together the construction, insulation and industrial supplies in
            the {settings.parent_company_name} range, organised into six product families:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-base">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/categories/${category.slug}`} className="font-semibold text-navy underline">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            Our customers include contractors, factories, roofing and insulation buyers, bakeries and oven builders,
            refrigeration businesses, packaging buyers and cold-chain operators. Because the right material depends on
            the job, we quote against your specification, quantity and delivery location rather than publishing fixed
            prices.
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
            <li>We supply materials. We do not provide installation services through this website.</li>
            <li>
              Product specifications, ratings and brands are published only where they have been confirmed. Ask us for
              the manufacturer&apos;s datasheet for any product we quote.
            </li>
            <li>We serve customers in {settings.regions_served}.</li>
            <li>Office and warehouse hours: {settings.hours_text}.</li>
          </ul>
        </div>
        <aside className="space-y-6">
          <div className="flex justify-center rounded-2xl border border-line bg-white p-8">
            <Image src={logo} alt="KariVex — Strength Behind Every Project" className="h-auto w-64" sizes="256px" />
          </div>
          <div className="rounded-2xl bg-navy p-6 text-white">
            <h2 className="font-display text-xl font-bold">Ready to price your materials?</h2>
            <p className="mt-2 text-white/85">Add products to the quote basket or contact the sales team.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/quote" className="inline-flex min-h-11 items-center rounded-md bg-orange px-4 font-semibold text-navy hover:bg-orange-600">
                Request a quote
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
