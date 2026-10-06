import Link from "next/link";

import { Container } from "@/components/Section";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  // Rendered under the root layout only, so it brings the site chrome itself.
  return (
    <SiteChrome>
    <Container className="py-20">
      <p className="text-sm font-bold uppercase tracking-wider text-slate">Error 404</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-navy">We couldn&apos;t find that page</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate">
        The product or page may have been renamed or is no longer listed. Search the catalogue, or tell us what you are
        looking for.
      </p>
      <form action="/products" role="search" className="mt-8 flex max-w-xl overflow-hidden rounded-lg border border-line">
        <label htmlFor="nf-search" className="sr-only">
          Search materials
        </label>
        <input id="nf-search" name="q" type="search" placeholder="Search materials" className="min-h-12 w-full px-4 outline-none" />
        <button type="submit" className="bg-orange px-5 font-bold text-navy hover:bg-orange-600">
          Search
        </button>
      </form>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/products" className="font-semibold text-navy underline">
          Browse all products
        </Link>
        <Link href="/categories" className="font-semibold text-navy underline">
          Product categories
        </Link>
        <Link href="/contact" className="font-semibold text-navy underline">
          Contact sales
        </Link>
      </div>
    </Container>
    </SiteChrome>
  );
}
