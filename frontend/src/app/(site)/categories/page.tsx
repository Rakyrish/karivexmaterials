import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowRightIcon } from "@/components/Icons";
import { CategoryBadge, Container, PageHero } from "@/components/Section";
import { loadCategories } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pizza Oven Material Categories",
  description:
    "Pizza oven materials by part of the oven: floor and hearth, dome and walls, insulation, and door seals and finishing.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const categories = await loadCategories();
  return (
    <>
      <PageHero
        title="Pizza oven materials by part of the oven"
        breadcrumbs={<Breadcrumbs items={[{ name: "Categories", href: "/categories" }]} />}
      >
        <p>Choose the part of the oven you are working on. Materials used in more than one part appear in each.</p>
      </PageHero>
      <Container className="py-10">
        <ul className="grid gap-5 md:grid-cols-2">
          {categories.map((category) => (
            <li key={category.slug} className="flex flex-col rounded-xl border border-line bg-white p-6">
              <div className="flex items-start gap-4">
                <CategoryBadge code={category.short_code} />
                <div>
                  <h2 className="font-display text-2xl font-bold text-navy">
                    <Link href={`/categories/${category.slug}`} className="hover:underline">
                      {category.name}
                    </Link>
                  </h2>
                  <p className="text-sm font-semibold text-slate">
                    {category.product_count} product{category.product_count === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-slate">{category.intro}</p>
              <Link
                href={`/categories/${category.slug}`}
                className="mt-auto inline-flex items-center gap-1 pt-4 font-semibold text-navy hover:underline"
                aria-label={`View ${category.name}`}
              >
                View products <ArrowRightIcon />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
