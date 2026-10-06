import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckIcon } from "@/components/Icons";
import { FilterForm, ProductGrid } from "@/components/ProductGrid";
import { Container, PageHero } from "@/components/Section";
import { getCategory, getFacets, getProducts } from "@/lib/api";
import { absoluteUrl } from "@/lib/config";
import { categoryImage } from "@/lib/images";
import { first, pageNumber } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params, searchParams }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const search = await searchParams;
  const category = await getCategory(slug);
  if (!category) return { title: "Category not found", robots: { index: false } };
  const filtered = Object.keys(search).some((key) => key !== "page" && first(search, key));
  const page = pageNumber(search);
  const path = `/categories/${category.slug}`;
  return pageMetadata({
    title: category.seo_title || category.name,
    description: category.seo_description || category.intro,
    path,
    canonicalPath: !filtered && page > 1 ? `${path}?page=${page}` : path,
    index: !filtered,
    image: category.image ?? (categoryImage(category.slug) ? absoluteUrl(categoryImage(category.slug)!.src.src) : null),
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const search = await searchParams;
  const category = await getCategory(slug);
  if (!category) notFound();

  const q = first(search, "q");
  const application = first(search, "application");
  const page = pageNumber(search);
  const facets = await getFacets({ category: category.slug });
  // Each specification facet has its own query parameter (f_<key>); the API
  // applies one specification filter at a time.
  const selectedFacets = Object.fromEntries(
    facets.facets.map((facet) => [facet.key, first(search, `f_${facet.key}`, 160)]),
  );
  const activeFacet = facets.facets.find((facet) => selectedFacets[facet.key]);
  const spec = activeFacet ? `${activeFacet.key}:${selectedFacets[activeFacet.key]}` : undefined;
  const products = await getProducts({ category: category.slug, q, application, spec, page });
  const facetParams = Object.fromEntries(
    Object.entries(selectedFacets).map(([key, value]) => [`f_${key}`, value]),
  );
  const path = `/categories/${category.slug}`;

  return (
    <>
      <PageHero
        eyebrow={`Category ${category.short_code}`}
        title={category.name}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Categories", href: "/categories" },
              { name: category.name, href: path },
            ]}
          />
        }
      >
        <p>{category.intro}</p>
      </PageHero>
      <Container className="grid gap-8 py-10 lg:grid-cols-[18rem_1fr]">
        <aside className="space-y-6">
          {(() => {
            const img = categoryImage(category.slug);
            if (category.image) {
              return (
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={category.image} alt={category.image_alt} fill sizes="18rem" className="object-cover" />
                </div>
              );
            }
            return img ? (
              <figure className="overflow-hidden rounded-xl border border-line">
                <div className="relative aspect-[4/3]">
                  <Image src={img.src} alt={img.alt} fill placeholder="blur" sizes="18rem" className="object-cover" />
                </div>
                <figcaption className="px-3 py-2 text-xs text-slate">Illustrative photo</figcaption>
              </figure>
            ) : null;
          })()}
          <FilterForm
            action={path}
            q={q}
            groups={[
              {
                name: "application",
                label: "Application",
                selected: application,
                options: facets.applications.map((a) => ({ value: a.value, label: `${a.display} (${a.count})` })),
              },
              ...facets.facets.map((facet) => ({
                name: `f_${facet.key}`,
                label: facet.label,
                selected: selectedFacets[facet.key],
                options: facet.values.map((v) => ({ value: v.value, label: `${v.display} (${v.count})` })),
              })),
            ]}
          />
          {category.quote_checklist.length > 0 && (
            <div className="rounded-xl bg-navy p-5 text-white">
              <h2 className="font-display text-lg font-bold">Include in your quotation request</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {category.quote_checklist.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckIcon className="mt-0.5 shrink-0 text-orange" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/quote" className="mt-4 inline-flex min-h-11 items-center rounded-md bg-orange px-4 font-semibold text-navy hover:bg-orange-600">
                Go to quote basket
              </Link>
            </div>
          )}
        </aside>
        <section aria-label={`${category.name} products`}>
          <p className="mb-4 text-sm text-slate">
            Showing {products.count} product{products.count === 1 ? "" : "s"}
            {q || application || spec ? " matching your filters" : ""}.
          </p>
          <ProductGrid
            data={products}
            basePath={path}
            params={{ q, application, ...facetParams }}
            emptyMessage="No products in this category match those filters. Clear the filters or ask us directly."
          />
        </section>
      </Container>
    </>
  );
}
