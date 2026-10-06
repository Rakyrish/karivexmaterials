import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowRightIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { Container, PageHero } from "@/components/Section";
import { ARTICLES, type Topic } from "@/lib/articles";
import { absoluteUrl } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Guides: Pizza Ovens & Roof Cyclones Explained",
  description:
    "Free guides on building, choosing and caring for pizza ovens, and on choosing, installing and maintaining roof cyclones, plus a glossary and FAQ.",
  path: "/guides",
});

const SECTIONS: { topic: Topic; title: string; intro: string }[] = [
  { topic: "Pizza ovens", title: "Pizza ovens", intro: "How ovens are built, which materials to choose, and how to look after them." },
  { topic: "Roof cyclones", title: "Roof cyclones", intro: "How turbine ventilators work, how many you need, and keeping buildings cool and dry." },
  { topic: "Pizza ovens & roof cyclones", title: "Reference", intro: "Definitions and quick answers." },
];

export default function GuidesPage() {
  return (
    <>
      <PageHero title="Guides and learning centre" breadcrumbs={<Breadcrumbs items={[{ name: "Guides", href: "/guides" }]} />}>
        <p>
          Practical, plain-language guides to pizza ovens and roof cyclones — so you can plan, buy and maintain with
          confidence, whether you do the work yourself or ask us.
        </p>
      </PageHero>
      <Container className="space-y-14 py-12">
        {SECTIONS.map((section) => (
          <section key={section.topic} aria-labelledby={`topic-${section.title}`}>
            <span aria-hidden="true" className="block h-1 w-12 rounded bg-orange" />
            <h2 id={`topic-${section.title}`} className="mt-3 font-display text-3xl font-extrabold text-navy">
              {section.title}
            </h2>
            <p className="mt-1 text-slate">{section.intro}</p>
            <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ARTICLES.filter((a) => a.topic === section.topic).map((article) => (
                <li key={article.href}>
                  <Link href={article.href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm hover:shadow-lg">
                    <span className="relative block aspect-[16/9]">
                      <Image
                        src={IMAGES[article.imageKey].src}
                        alt=""
                        fill
                        placeholder="blur"
                        sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </span>
                    <span className="flex flex-1 flex-col p-6">
                      <span className="font-display text-xl font-bold text-navy group-hover:underline">{article.title}</span>
                      <span className="mt-2 text-slate">{article.description}</span>
                      <span className="mt-auto inline-flex items-center gap-1 pt-4 font-semibold text-navy">
                        Read <ArrowRightIcon />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Pizza oven and roof cyclone guides",
          itemListElement: ARTICLES.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(a.href), name: a.title })),
        }}
      />
    </>
  );
}
