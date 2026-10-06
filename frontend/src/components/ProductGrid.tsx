import Link from "next/link";

import type { Paginated, ProductCard as ProductCardData } from "@/lib/types";

import { Pagination } from "./Pagination";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  data,
  basePath,
  params,
  emptyMessage,
}: {
  data: Paginated<ProductCardData>;
  basePath: string;
  params: Record<string, string | undefined>;
  emptyMessage: string;
}) {
  if (data.results.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-mist p-8 text-center">
        <p className="font-display text-xl font-bold text-navy">No matching products</p>
        <p className="mt-2 text-slate">{emptyMessage}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="inline-flex min-h-11 items-center rounded-md border border-navy px-4 font-semibold text-navy hover:bg-white">
            Clear search and filters
          </Link>
          <Link href="/contact" className="inline-flex min-h-11 items-center rounded-md bg-orange px-4 font-semibold text-navy hover:bg-orange-600">
            Ask us about a material
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {data.results.map((product) => (
          <ProductCard key={product.slug} product={product} headingLevel={2} />
        ))}
      </div>
      <Pagination page={data.page} numPages={data.num_pages} basePath={basePath} params={params} />
    </>
  );
}

/** Plain GET filter form (works without JavaScript). */
export function FilterForm({
  action,
  q,
  groups,
  hiddenFields = {},
}: {
  action: string;
  q?: string;
  groups: { name: string; label: string; selected?: string; options: { value: string; label: string }[] }[];
  hiddenFields?: Record<string, string | undefined>;
}) {
  const active = Boolean(q) || groups.some((g) => g.selected);
  return (
    <form action={action} method="get" className="on-light space-y-5 rounded-xl border border-line bg-white p-5" aria-label="Filter products">
      {Object.entries(hiddenFields).map(([name, value]) => (value ? <input key={name} type="hidden" name={name} value={value} /> : null))}
      <div>
        <label htmlFor="filter-q" className="text-sm font-semibold text-navy">
          Search
        </label>
        <input
          id="filter-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Name, material or use"
          className="mt-1 block min-h-11 w-full rounded-md border border-line px-3 focus:border-navy focus:outline-none"
        />
      </div>
      {groups
        .filter((group) => group.options.length > 0)
        .map((group) => (
          <div key={group.name}>
            <label htmlFor={`filter-${group.name}`} className="text-sm font-semibold text-navy">
              {group.label}
            </label>
            <select
              id={`filter-${group.name}`}
              name={group.name}
              defaultValue={group.selected ?? ""}
              className="mt-1 block min-h-11 w-full rounded-md border border-line bg-white px-3 focus:border-navy focus:outline-none"
            >
              <option value="">Any</option>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="min-h-11 rounded-md bg-navy px-4 font-semibold text-white hover:bg-navy-700">
          Apply filters
        </button>
        {active && (
          <Link href={action} className="inline-flex min-h-11 items-center rounded-md px-3 font-semibold text-navy underline">
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
