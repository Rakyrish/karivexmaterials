import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { AddToQuote } from "@/components/AddToQuote";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Gallery } from "@/components/Gallery";
import { FaqSection } from "@/components/FaqSection";
import { CheckIcon, FileIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/Section";
import { getProduct, getRedirect } from "@/lib/api";
import { AVAILABILITY_LABELS, SITE_ORIGIN, absoluteUrl } from "@/lib/config";
import { loadSettings } from "@/lib/data";
import { productFallbackImage } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import type { ProductDetail, Variant } from "@/lib/types";

const VARIANT_COLUMNS: { key: keyof Variant; label: string }[] = [
  { key: "thickness", label: "Thickness" },
  { key: "dimensions", label: "Dimensions" },
  { key: "density", label: "Density" },
  { key: "diameter", label: "Diameter / size" },
  { key: "box_capacity", label: "Capacity" },
  { key: "pack_size", label: "Pack size" },
  { key: "sales_unit_override", label: "Unit" },
];

async function loadProductOrRedirect(slug: string): Promise<ProductDetail> {
  const product = await getProduct(slug);
  if (product) return product;
  const target = await getRedirect(`/products/${slug}`);
  if (target && target !== `/products/${slug}`) permanentRedirect(target);
  notFound();
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found", robots: { index: false } };
  const primaryImage = product.images.find((i) => i.is_primary) ?? product.images[0];
  const fallback = productFallbackImage(product.slug, product.primary_category.slug);
  return pageMetadata({
    title: product.seo_title || product.name,
    description: product.seo_description || product.short_summary || product.description,
    path: `/products/${product.slug}`,
    image: primaryImage?.image
      ? absoluteUrl(primaryImage.image)
      : fallback
        ? absoluteUrl(fallback.src.src)
        : null,
  });
}

const SCHEMA_AVAILABILITY: Record<string, string> = {
  in_stock: "https://schema.org/InStock",
  on_order: "https://schema.org/BackOrder",
};

function formatPrice(price: string, currency: string) {
  const value = Number(price);
  return `${currency} ${value.toLocaleString("en-KE", { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}

function productJsonLd(product: ProductDetail) {
  // Only verified facts. No offers, prices, ratings or reviews are published,
  // so this is descriptive markup and not eligible for Google product rich results.
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl(`/products/${product.slug}`)}#product`,
    name: product.name,
    description: product.short_summary || product.description,
    url: absoluteUrl(`/products/${product.slug}`),
    category: product.primary_category.name,
  };
  if (product.images.length) {
    data.image = product.images.map((i) => absoluteUrl(i.image));
  } else {
    // Owner-supplied product photos (no badge) may represent the product;
    // stock "illustrative" photos are never put in Product markup.
    const own = productFallbackImage(product.slug, product.primary_category.slug);
    if (own && own.badge === null) data.image = [absoluteUrl(own.src.src)];
  }
  if (product.brand) data.brand = { "@type": "Brand", name: product.brand };
  if (product.sku) data.sku = product.sku;
  if (product.offer) {
    // Only published when an administrator has entered a confirmed price.
    data.offers = {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      price: product.offer.price,
      priceCurrency: product.offer.currency,
      itemCondition: "https://schema.org/NewCondition",
      ...(product.offer.valid_until ? { priceValidUntil: product.offer.valid_until } : {}),
      ...(SCHEMA_AVAILABILITY[product.availability_status]
        ? { availability: SCHEMA_AVAILABILITY[product.availability_status] }
        : {}),
      seller: { "@id": `${SITE_ORIGIN}/#division` },
    };
  }
  if (product.specifications.length) {
    data.additionalProperty = product.specifications.map((s) => ({
      "@type": "PropertyValue",
      name: s.label,
      value: s.unit ? `${s.value} ${s.unit}` : s.value,
    }));
  }
  return data;
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([loadProductOrRedirect(slug), loadSettings()]);
  const url = absoluteUrl(`/products/${product.slug}`);
  const variantColumns = VARIANT_COLUMNS.filter((col) => product.variants.some((v) => v[col.key]));
  const otherCategories = product.additional_categories.filter((c) => c.slug !== product.primary_category.slug);
  const paragraphs = product.description.split(/\n\s*\n/).filter(Boolean);
  const moq =
    product.minimum_order_quantity && Number(product.minimum_order_quantity) > 0
      ? `${Number(product.minimum_order_quantity)} ${product.moq_unit || product.sales_unit}`.trim()
      : null;

  return (
    <>
      <div className="border-b border-line bg-mist">
        <Container className="py-4">
          <Breadcrumbs
            items={[
              { name: "Products", href: "/products" },
              { name: product.primary_category.name, href: `/categories/${product.primary_category.slug}` },
              { name: product.name, href: `/products/${product.slug}` },
            ]}
          />
        </Container>
      </div>

      <Container className="grid gap-10 py-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Gallery
            images={product.images}
            productName={product.name}
            fallback={productFallbackImage(product.slug, product.primary_category.slug)}
          />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-slate">
            <Link href={`/categories/${product.primary_category.slug}`} className="hover:text-navy hover:underline">
              {product.primary_category.name}
            </Link>
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-navy sm:text-4xl">{product.name}</h1>
          {product.short_summary && <p className="mt-3 text-lg text-slate">{product.short_summary}</p>}
          {product.offer && (
            <p className="mt-4 text-2xl font-extrabold text-navy">
              {formatPrice(product.offer.price, product.offer.currency)}
              {product.offer.unit && <span className="ml-2 text-base font-semibold text-slate">{product.offer.unit}</span>}
              <span className="mt-1 block text-sm font-normal text-slate">
                Delivery and quantity pricing confirmed on your quotation.
              </span>
            </p>
          )}
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-mist p-3">
              <dt className="font-semibold text-navy">Availability</dt>
              <dd className="text-slate">{AVAILABILITY_LABELS[product.availability_status]}</dd>
            </div>
            <div className="rounded-lg bg-mist p-3">
              <dt className="font-semibold text-navy">Sales unit</dt>
              <dd className="text-slate">{product.sales_unit || "Confirmed on quotation"}</dd>
            </div>
            {product.brand && (
              <div className="rounded-lg bg-mist p-3">
                <dt className="font-semibold text-navy">Brand</dt>
                <dd className="text-slate">{product.brand}</dd>
              </div>
            )}
            {moq && (
              <div className="rounded-lg bg-mist p-3">
                <dt className="font-semibold text-navy">Minimum order</dt>
                <dd className="text-slate">{moq}</dd>
              </div>
            )}
          </dl>
          <div className="mt-6">
            <AddToQuote
              slug={product.slug}
              name={product.name}
              url={url}
              variants={product.variants}
              salesUnit={product.sales_unit}
              whatsappBaseUrl={settings.whatsapp_base_url}
              phone={settings.primary_phone}
              phoneHref={settings.primary_phone_href}
              email={settings.email}
            />
          </div>
        </div>
      </Container>

      <Container className="grid gap-10 pb-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          <section aria-labelledby="about-product">
            <h2 id="about-product" className="font-display text-2xl font-bold text-navy">
              About this product
            </h2>
            <div className="prose-copy mt-3 max-w-3xl text-ink">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            {product.synonyms.length > 0 && (
              <p className="mt-4 text-sm text-slate">
                <span className="font-semibold text-navy">Also searched as:</span> {product.synonyms.join(", ")}
              </p>
            )}
          </section>

          <section aria-labelledby="specs">
            <h2 id="specs" className="font-display text-2xl font-bold text-navy">
              Specifications
            </h2>
            {product.specifications.length > 0 ? (
              <div className="mt-4 overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Specifications for {product.name}</caption>
                  <tbody className="divide-y divide-line">
                    {product.specifications.map((spec) => (
                      <tr key={spec.label} className="odd:bg-mist/60">
                        <th scope="row" className="w-1/2 px-4 py-3 font-semibold text-navy">
                          {spec.label}
                        </th>
                        <td className="px-4 py-3 text-ink">
                          {spec.value}
                          {spec.unit ? ` ${spec.unit}` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 max-w-3xl text-slate">
                Detailed specifications for this product are confirmed per order against the supplier datasheet. Tell us
                the specification you need in your quotation request and we will confirm what is available.
              </p>
            )}

            {product.variants.length > 0 && (
              <div className="mt-6">
                <h3 className="font-display text-lg font-bold text-navy">Available options</h3>
                <div className="mt-3 overflow-x-auto rounded-xl border border-line">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">Options for {product.name}</caption>
                    <thead className="bg-navy text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3">
                          Option
                        </th>
                        {variantColumns.map((col) => (
                          <th key={col.key} scope="col" className="px-4 py-3">
                            {col.label}
                          </th>
                        ))}
                        <th scope="col" className="px-4 py-3">
                          Availability
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {product.variants.map((variant) => (
                        <tr key={variant.id} className="odd:bg-mist/60">
                          <th scope="row" className="px-4 py-3 font-semibold text-navy">
                            {variant.label}
                          </th>
                          {variantColumns.map((col) => (
                            <td key={col.key} className="px-4 py-3">
                              {String(variant[col.key] || "—")}
                            </td>
                          ))}
                          <td className="px-4 py-3">{AVAILABILITY_LABELS[variant.availability_status]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          <FaqSection faqs={product.faqs ?? []} title={`${product.name}: common questions`} />

          {product.documents.length > 0 && (
            <section aria-labelledby="docs">
              <h2 id="docs" className="font-display text-2xl font-bold text-navy">
                Datasheets & documents
              </h2>
              <ul className="mt-3 space-y-2">
                {product.documents.map((doc) => (
                  <li key={doc.file}>
                    <a
                      href={doc.file}
                      className="inline-flex min-h-11 items-center gap-2 font-semibold text-navy underline"
                      download
                    >
                      <FileIcon /> {doc.title} <span className="text-sm font-normal text-slate">(PDF)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          {(product.services ?? []).length > 0 && (
            <div className="rounded-xl bg-navy p-6 text-white">
              <h2 className="font-display text-xl font-bold">Want us to do the work?</h2>
              <p className="mt-1 text-sm text-white/80">This material is used in these services:</p>
              <ul className="mt-3 space-y-2">
                {product.services.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`} className="font-semibold text-orange hover:underline">
                      {service.name}
                    </Link>
                    <p className="text-sm text-white/80">{service.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.selection_notes.length > 0 && (
            <div className="rounded-xl border border-line bg-white p-6">
              <h2 className="font-display text-xl font-bold text-navy">What to tell us</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {product.selection_notes.map((note) => (
                  <li key={note} className="flex gap-2">
                    <CheckIcon className="mt-0.5 shrink-0 text-orange-600" /> {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(product.applications.length > 0 || otherCategories.length > 0) && (
            <div className="rounded-xl border border-line bg-mist p-6">
              {product.applications.length > 0 && (
                <>
                  <h2 className="font-display text-lg font-bold text-navy">Used for</h2>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {product.applications.map((app) => (
                      <li key={app.slug}>
                        <Link
                          href={`/applications/${app.slug}`}
                          className="inline-flex min-h-9 items-center rounded-full border border-navy/20 bg-white px-3 text-sm font-semibold text-navy hover:border-navy"
                        >
                          {app.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {otherCategories.length > 0 && (
                <>
                  <h2 className="mt-5 font-display text-lg font-bold text-navy">Also listed in</h2>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {otherCategories.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/categories/${cat.slug}`}
                          className="inline-flex min-h-9 items-center rounded-full border border-navy/20 bg-white px-3 text-sm font-semibold text-navy hover:border-navy"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </aside>
      </Container>

      {product.related_products.length > 0 && (
        <section aria-labelledby="related" className="mt-10 bg-mist py-12">
          <Container>
            <h2 id="related" className="font-display text-2xl font-bold text-navy">
              Related materials
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {product.related_products.slice(0, 4).map((related) => (
                <ProductCard key={related.slug} product={related} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <JsonLd data={productJsonLd(product)} />
    </>
  );
}
