import Link from "next/link";

import { AVAILABILITY_LABELS } from "@/lib/config";
import { productFallbackImage } from "@/lib/images";
import type { ProductCard as ProductCardData } from "@/lib/types";

import { ArrowRightIcon } from "./Icons";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product, headingLevel = 3 }: { product: ProductCardData; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const href = `/products/${product.slug}`;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-lg focus-within:shadow-lg">
      <ProductVisual
        image={product.primary_image}
        fallback={productFallbackImage(product.slug, product.primary_category.slug)}
        label={product.name} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate">{product.primary_category.name}</p>
        <Heading className="mt-1 font-display text-lg font-bold leading-snug text-navy">
          {/* The whole card is clickable via this link's stretched overlay. */}
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </Heading>
        {product.short_summary && <p className="mt-2 text-sm text-slate">{product.short_summary}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm">
          <span className="text-slate">
            {AVAILABILITY_LABELS[product.availability_status]}
            {product.variant_count > 1 ? ` · ${product.variant_count} options` : ""}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-navy group-hover:text-orange-600" aria-hidden="true">
            View <ArrowRightIcon />
          </span>
        </div>
      </div>
      {/* Keyboard focus ring for the stretched link. */}
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-navy group-has-[a:focus-visible]:ring-[3px]" aria-hidden="true" />
    </article>
  );
}
