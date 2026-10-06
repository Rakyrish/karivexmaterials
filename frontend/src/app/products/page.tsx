import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FilterForm, ProductGrid } from "@/components/ProductGrid";
import { Container, PageHero } from "@/components/Section";
import { getApplications, getFacets, getProducts } from "@/lib/api";
import { loadCategories } from "@/lib/data";
import { first, pageNumber } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

const FILTER_KEYS = ["q", "category", "application", "availability"] as const;

export async function generateMetadata({ searchParams }: PageProps<"/products">) {
  const params = await searchParams;
  const filtered = FILTER_KEYS.some((key) => first(params, key));
  const page = pageNumber(params);
  return pageMetadata({
    title: page > 1 && !filtered ? `Industrial Materials Catalogue — Page ${page}` : "Industrial Materials Catalogue",
    description:
      "Search and filter the KariVex Industrial Materials catalogue: insulation, refractory and ceramic fibre, roof ventilators, EPS boxes, refrigeration materials and industrial tapes.",
    path: "/products",
    // Search and filter combinations are not indexed; plain pagination is.
    canonicalPath: !filtered && page > 1 ? `/products?page=${page}` : "/products",
    index: !filtered,
  });
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const params = await searchParams;
  const q = first(params, "q");
  const category = first(params, "category");
  const application = first(params, "application");
  const availability = first(params, "availability");
  const page = pageNumber(params);

  const [products, categories, applications, facets] = await Promise.all([
    getProducts({ q, category, application, availability, page }),
    loadCategories(),
    getApplications(),
    getFacets({}),
  ]);

  const filterParams = { q, category, application, availability };

  return (
    <>
      <PageHero
        title={q ? `Search results for “${q}”` : "Industrial materials catalogue"}
        breadcrumbs={<Breadcrumbs items={[{ name: "Products", href: "/products" }]} />}
      >
        <p>
          {products.count} product{products.count === 1 ? "" : "s"}
          {q || category || application || availability ? " match your search" : " across six categories"}. Add items to
          your quote basket and send one request.
        </p>
      </PageHero>
      <Container className="grid gap-8 py-10 lg:grid-cols-[18rem_1fr]">
        <aside>
          <FilterForm
            action="/products"
            q={q}
            groups={[
              {
                name: "category",
                label: "Category",
                selected: category,
                options: categories.map((c) => ({ value: c.slug, label: `${c.name} (${c.product_count})` })),
              },
              {
                name: "application",
                label: "Application",
                selected: application,
                options: applications.map((a) => ({ value: a.slug, label: a.name })),
              },
              {
                name: "availability",
                label: "Availability",
                selected: availability,
                // Only offered when records actually differ in availability.
                options:
                  facets.availability.length > 1 || availability
                    ? facets.availability.map((a) => ({ value: a.value, label: `${a.display} (${a.count})` }))
                    : [],
              },
            ]}
          />
        </aside>
        <section aria-label="Products">
          <ProductGrid
            data={products}
            basePath="/products"
            params={filterParams}
            emptyMessage="Try a different spelling or a broader term, or tell us what you need and we will check whether we can supply it."
          />
        </section>
      </Container>
    </>
  );
}
