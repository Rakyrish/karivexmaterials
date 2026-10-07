import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { ArrowRightIcon, FlameIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { Container, PageHero } from "@/components/Section";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pizza Oven Guide — Layers, Materials & Curing",
  description:
    "How a pizza oven is built layer by layer, which refractory and insulation materials go where, why a new oven must be cured slowly, and the temperatures pizza ovens work at.",
  path: "/pizza-oven-guide",
});

const LAYERS = [
  {
    title: "1. Foundation and stand",
    body: "A level, solid base — typically a reinforced concrete slab with a block or brick stand — carries the considerable weight of the oven.",
    link: null,
  },
  {
    title: "2. Insulated hearth",
    body: "A layer of insulation under the cooking floor stops heat draining down into the stand. It is commonly made with vermiculite or perlite mixed with cement, or insulating board or blanket.",
    link: { href: "/categories/pizza-oven-insulation", label: "Oven insulation" },
  },
  {
    title: "3. Cooking floor",
    body: "Fire bricks laid flat (often in a herringbone or running-bond pattern) on a thin bed of fine material, or a cast refractory slab. This is the surface the pizza bakes on.",
    link: { href: "/categories/oven-floor-hearth", label: "Floor & hearth materials" },
  },
  {
    title: "4. Dome or walls",
    body: "Fire bricks bonded with refractory mortar, or refractory castable cast over a former. The dome absorbs heat from the fire and radiates it back onto the pizza.",
    link: { href: "/categories/dome-walls-bonding", label: "Dome, walls & bonding" },
  },
  {
    title: "5. Dome insulation",
    body: "Ceramic fibre blanket or other insulation wrapped over the dome keeps heat in the oven and the outside cooler. Without it, an oven loses heat and burns more fuel.",
    link: { href: "/products/ceramic-fibre-blanket", label: "Ceramic fibre blanket" },
  },
  {
    title: "6. Door, seal and finish",
    body: "The door opening, flue connection and outer enclosure or render complete the oven. A ceramic fibre rope seal helps the door close tightly.",
    link: { href: "/categories/door-seals-finishing", label: "Door seals & finishing" },
  },
];

const PUBLISHED = "2026-10-06";

const GUIDE_FAQS = [
  {
    question: "What materials do I need to build a pizza oven?",
    answer:
      "A typical masonry pizza oven uses fire bricks or refractory castable for the floor and dome, refractory mortar for the joints, insulation under the floor (for example vermiculite or perlite concrete) and over the dome (for example ceramic fibre blanket), and a door seal.",
  },
  {
    question: "Why does a new pizza oven need curing?",
    answer:
      "Mortar, castable and concrete still hold water after building. Small fires that grow gradually over several days drive that moisture out slowly; very hot early fires can turn it to steam and crack the oven.",
  },
  {
    question: "How hot does a pizza oven get?",
    answer:
      "For Neapolitan-style pizza, the AVPN describes a floor of about 380–430 °C and a dome around 485 °C, baking a pizza in roughly 60–90 seconds. Other pizza styles bake at lower temperatures.",
  },
  {
    question: "Can ordinary cement or bricks be used in a pizza oven?",
    answer:
      "Not for the hot parts of the oven. Ordinary bricks and cement are not made for repeated high-temperature heating and cooling; refractory materials are used where the oven gets hot.",
  },
];

/** External reference woven into the text: descriptive words, never a bare URL. */
function Ref({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} rel="noopener noreferrer" className="font-semibold text-navy underline decoration-orange decoration-2 underline-offset-2 hover:text-orange-600">
      {children}
    </a>
  );
}

export default function PizzaOvenGuidePage() {
  const hero = IMAGES["oven-fire-floor"];
  const design = IMAGES["pizza-oven-design-mosaic"];
  const pizza = IMAGES["margherita-pizza"];
  return (
    <>
      <PageHero
        eyebrow="Guide"
        title="How a pizza oven is built"
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Guides", href: "/guides" },
              { name: "Pizza oven guide", href: "/pizza-oven-guide" },
            ]}
          />
        }
      >
        <p>
          A short, practical overview of the layers in a masonry pizza oven, the materials used in each, and how a
          new oven is brought up to temperature, drawing on established oven-building guidance such as Forno
          Bravo&apos;s <Ref href="https://www.fornobravo.com/pompeii-oven/oven-overview/">Pompeii brick oven overview</Ref>{" "}
          and this <Ref href="https://ourwayoflife.co.nz/diy-project-how-to-build-a-pizza-oven">step-by-step pizza oven build</Ref>.
          General guidance only — always follow your oven design and the manufacturer&apos;s instructions for each
          material.
        </p>
      </PageHero>

      <Container className="grid gap-12 py-12 lg:grid-cols-[1.5fr_1fr]">
        <article className="space-y-12">
          <section aria-labelledby="layers">
            <h2 id="layers" className="font-display text-3xl font-extrabold text-navy">
              The layers of a pizza oven
            </h2>
            <ol className="mt-6 space-y-4">
              {LAYERS.map((layer) => (
                <li key={layer.title} className="rounded-xl border border-line bg-white p-5">
                  <h3 className="font-display text-xl font-bold text-navy">{layer.title}</h3>
                  <p className="mt-2 text-ink">{layer.body}</p>
                  {layer.link && (
                    <Link href={layer.link.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy underline">
                      {layer.link.label} <ArrowRightIcon />
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="curing">
            <h2 id="curing" className="font-display text-3xl font-extrabold text-navy">
              Curing a new or repaired oven
            </h2>
            <div className="prose-copy mt-4 space-y-4 text-lg text-ink">
              <p>
                Even when an oven looks dry, its mortar, castable and concrete still hold water. If the first fires are
                too hot, that water turns to steam inside the masonry and can cause hairline cracks or worse.
              </p>
              <p>
                The usual approach is to let the finished oven stand for several days, then light a series of small
                fires that get progressively larger and hotter over about a week, so the moisture leaves slowly. Oven
                and material makers publish their own schedules — for example these{" "}
                <Ref href="https://www.fornobravo.com/PDF/curing.pdf">step-by-step oven curing instructions</Ref> and
                this <Ref href="https://texasovenco.com/cure-re-cure-illustrated-guide">illustrated cure and re-cure guide</Ref>{" "}
                — but always follow the one for your own oven.
              </p>
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-xl bg-orange-50 p-5 text-ink">
              <FlameIcon className="mt-1 shrink-0 text-xl text-orange-600" />
              <p>
                Repaired ovens need curing too: new mortar, castable or patching cement contains water that must be
                driven out gradually.
              </p>
            </div>
          </section>

          <section aria-labelledby="temperatures">
            <h2 id="temperatures" className="font-display text-3xl font-extrabold text-navy">
              How hot pizza ovens run
            </h2>
            <div className="prose-copy mt-4 space-y-4 text-lg text-ink">
              <p>
                For <Ref href="https://en.wikipedia.org/wiki/Neapolitan_pizza">authentic Neapolitan pizza</Ref>, the
                Associazione Verace Pizza Napoletana (AVPN) describes a wood-fired oven with a floor of roughly
                380–430 °C and a dome around 485 °C, baking each pizza in about 60–90 seconds — figures oven maker
                Alfa Forni also explains in its guide to the{" "}
                <Ref href="https://help.alfaforni.com/en/the-ideal-temperature-for-baking-neapolitan-pizza">ideal temperature for Neapolitan pizza</Ref>.
                Other styles bake cooler and longer.
              </p>
              <p>
                That is why the hot face of an oven is built from refractory materials, and why the insulation layers
                matter: they let the floor and dome store heat for pizza after pizza.
              </p>
            </div>
          </section>

          <FaqSection faqs={GUIDE_FAQS} title="Pizza oven questions" />

        </article>

        <aside className="space-y-6">
          <figure className="overflow-hidden rounded-2xl border border-line">
            <Image src={design.src} alt={design.alt} placeholder="blur" sizes="(min-width:1024px) 33vw, 100vw" className="h-auto w-full" />
            <figcaption className="p-3 text-xs text-slate">
              A finished oven: tiled dome over the insulation, chimney, and a stand with log storage (example design).
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-line">
            <Image src={hero.src} alt={hero.alt} placeholder="blur" sizes="(min-width:1024px) 33vw, 100vw" className="h-auto w-full" />
            <figcaption className="p-3 text-xs text-slate">Fire on the floor of a brick dome oven (illustrative).</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-line">
            <Image src={pizza.src} alt={pizza.alt} placeholder="blur" sizes="(min-width:1024px) 33vw, 100vw" className="h-auto w-full" />
            <figcaption className="p-3 text-xs text-slate">Neapolitan-style margherita (illustrative).</figcaption>
          </figure>
          <div className="rounded-2xl bg-navy p-6 text-white lg:sticky lg:top-40">
            <h2 className="font-display text-xl font-bold">Planning an oven?</h2>
            <p className="mt-2 text-white/85">
              Buy the materials for your own build, or ask us to build or repair the oven for you.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/services/pizza-oven-building" className="inline-flex min-h-11 items-center rounded-md bg-orange px-4 font-semibold text-navy hover:bg-orange-600">
                Oven building
              </Link>
              <Link href="/products" className="inline-flex min-h-11 items-center rounded-md border border-white px-4 font-semibold hover:bg-white hover:text-navy">
                Oven materials
              </Link>
            </div>
          </div>
        </aside>
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How a pizza oven is built: layers, materials and curing",
          description:
            "How a masonry pizza oven is built layer by layer, which refractory and insulation materials go where, and how to cure a new oven.",
          image: [absoluteUrl(hero.src.src), absoluteUrl(pizza.src.src)],
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          mainEntityOfPage: absoluteUrl("/pizza-oven-guide"),
          author: { "@type": "Organization", "@id": `${SITE_ORIGIN}/#division`, name: "KariVex Industrial Materials" },
          publisher: { "@id": `${SITE_ORIGIN}/#division` },
        }}
      />
    </>
  );
}
