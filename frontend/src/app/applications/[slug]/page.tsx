import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckIcon } from "@/components/Icons";
import { ProductGrid } from "@/components/ProductGrid";
import { Container, PageHero } from "@/components/Section";
import { getApplication, getProducts } from "@/lib/api";
import { pageNumber } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params, searchParams }: PageProps<"/applications/[slug]">) {
  const { slug } = await params;
  const page = pageNumber(await searchParams);
  const application = await getApplication(slug);
  if (!application) return { title: "Application not found", robots: { index: false } };
  const path = `/applications/${application.slug}`;
  return pageMetadata({
    title: application.seo_title || `${application.name} — Pizza Oven Materials`,
    description: application.seo_description || application.intro,
    path,
    canonicalPath: page > 1 ? `${path}?page=${page}` : path,
    image: application.image,
  });
}

export default async function ApplicationPage({ params, searchParams }: PageProps<"/applications/[slug]">) {
  const { slug } = await params;
  const page = pageNumber(await searchParams);
  const application = await getApplication(slug);
  if (!application) notFound();
  const products = await getProducts({ application: application.slug, page });
  const path = `/applications/${application.slug}`;

  return (
    <>
      <PageHero
        eyebrow="Oven project"
        title={application.name}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Oven projects", href: "/applications" },
              { name: application.name, href: path },
            ]}
          />
        }
      >
        <p>{application.intro}</p>
      </PageHero>
      <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_20rem]">
        <section aria-labelledby="app-products">
          <h2 id="app-products" className="font-display text-2xl font-bold text-navy">
            Related products ({products.count})
          </h2>
          <div className="mt-5">
            <ProductGrid
              data={products}
              basePath={path}
              params={{}}
              emptyMessage="Products for this application are being added. Contact us with your requirements in the meantime."
            />
          </div>
        </section>
        {application.considerations.length > 0 && (
          <aside className="h-fit rounded-xl border border-line bg-mist p-6 lg:sticky lg:top-40">
            <h2 className="font-display text-xl font-bold text-navy">Selection considerations</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink">
              {application.considerations.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckIcon className="mt-0.5 shrink-0 text-orange-600" /> {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate">
              Share these details in your quotation request so we can match the right materials.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/quote" className="inline-flex min-h-11 items-center rounded-md bg-orange px-4 font-semibold text-navy hover:bg-orange-600">
                Request a quote
              </Link>
              <Link href="/services" className="inline-flex min-h-11 items-center rounded-md border border-navy px-4 font-semibold text-navy hover:bg-white">
                Our services
              </Link>
            </div>
          </aside>
        )}
      </Container>
    </>
  );
}
