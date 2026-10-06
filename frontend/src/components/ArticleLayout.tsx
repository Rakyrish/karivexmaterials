import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ARTICLES, type ArticleMeta } from "@/lib/articles";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/config";
import { IMAGES } from "@/lib/images";

import { Breadcrumbs } from "./Breadcrumbs";
import { ArrowRightIcon } from "./Icons";
import { JsonLd } from "./JsonLd";
import { Container } from "./Section";

/** External reference woven into the text: descriptive words, never a bare URL. */
export function Ref({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      className="font-semibold text-navy underline decoration-orange decoration-2 underline-offset-2 hover:text-orange-600"
    >
      {children}
    </a>
  );
}

export const h2Class = "font-display text-2xl font-extrabold text-navy sm:text-3xl";
export const proseClass = "prose-copy mt-4 space-y-4 text-lg leading-relaxed text-ink";

const CTA: Record<string, { title: string; text: string; links: { href: string; label: string }[] }> = {
  "Pizza ovens": {
    title: "Planning or fixing a pizza oven?",
    text: "Get the fire bricks, mortar, insulation and seals — or let us build or repair the oven.",
    links: [
      { href: "/products", label: "Oven materials" },
      { href: "/services/pizza-oven-building", label: "Oven building" },
      { href: "/services/pizza-oven-repair-relining", label: "Oven repair" },
    ],
  },
  "Roof cyclones": {
    title: "Need roof cyclones?",
    text: "We stock 600 mm stainless steel roof cyclones, install them, and repair worn or leaking ones.",
    links: [
      { href: "/products/roof-ventilators-roof-cyclones", label: "Buy roof cyclones" },
      { href: "/services/roof-cyclone-installation", label: "Installation" },
      { href: "/services/roof-cyclone-repair", label: "Repair" },
    ],
  },
  "Pizza ovens & roof cyclones": {
    title: "Talk to us",
    text: "Pizza oven materials, oven building and repair, and roof cyclones supplied, installed and repaired.",
    links: [
      { href: "/products", label: "Products" },
      { href: "/services", label: "Services" },
      { href: "/contact", label: "Contact" },
    ],
  },
};

export function ArticleLayout({
  meta,
  intro,
  children,
}: {
  meta: ArticleMeta;
  intro: ReactNode;
  children: ReactNode;
}) {
  const image = IMAGES[meta.imageKey];
  const cta = CTA[meta.topic];
  const related = ARTICLES.filter((a) => a.href !== meta.href && (a.topic === meta.topic || meta.topic.includes(a.topic))).slice(0, 3);
  const updated = new Date(meta.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <div className="border-b border-line bg-mist">
        <Container className="grid gap-8 py-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <Breadcrumbs items={[{ name: "Guides", href: "/guides" }, { name: meta.title, href: meta.href }]} />
            <p className="mt-5 text-sm font-bold uppercase tracking-wider text-orange-600">{meta.topic}</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-navy sm:text-4xl lg:text-5xl">{meta.title}</h1>
            <div className="mt-4 max-w-2xl text-lg text-slate">{intro}</div>
            <p className="mt-4 text-sm text-slate">
              By KariVex Industrial Materials · Updated <time dateTime={meta.updated}>{updated}</time>
            </p>
          </div>
          <figure className="overflow-hidden rounded-2xl shadow-lg">
            <div className="relative aspect-[4/3]">
              <Image src={image.src} alt={image.alt} fill preload placeholder="blur" sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </div>
            {image.badge && <figcaption className="bg-white px-3 py-2 text-xs text-slate">{image.badge}</figcaption>}
          </figure>
        </Container>
      </div>

      <Container className="grid gap-12 py-12 lg:grid-cols-[1.6fr_1fr]">
        <article className="space-y-12">{children}</article>
        <aside className="space-y-6">
          <div className="rounded-2xl bg-navy p-6 text-white lg:sticky lg:top-40">
            <h2 className="font-display text-xl font-bold">{cta.title}</h2>
            <p className="mt-2 text-white/85">{cta.text}</p>
            <ul className="mt-4 space-y-2">
              {cta.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex items-center gap-1 font-semibold text-orange hover:underline">
                    {link.label} <ArrowRightIcon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-guides" className="bg-mist py-12">
          <Container>
            <h2 id="related-guides" className="font-display text-2xl font-bold text-navy">
              Keep reading
            </h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white hover:shadow-lg">
                    <span className="relative block aspect-[16/9]">
                      <Image src={IMAGES[a.imageKey].src} alt="" fill placeholder="blur" sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
                    </span>
                    <span className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-600">{a.topic}</span>
                      <span className="mt-1 font-display text-lg font-bold text-navy group-hover:underline">{a.title}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.title,
          description: meta.description,
          image: [absoluteUrl(image.src.src)],
          datePublished: meta.published,
          dateModified: meta.updated,
          mainEntityOfPage: absoluteUrl(meta.href),
          author: { "@type": "Organization", "@id": `${SITE_ORIGIN}/#division`, name: "KariVex Industrial Materials" },
          publisher: { "@id": `${SITE_ORIGIN}/#division` },
          about: meta.topic,
        }}
      />
    </>
  );
}
