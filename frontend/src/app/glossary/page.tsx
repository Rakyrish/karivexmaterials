import Link from "next/link";

import { ArticleLayout, h2Class } from "@/components/ArticleLayout";
import { JsonLd } from "@/components/JsonLd";
import { articleByHref } from "@/lib/articles";
import { absoluteUrl } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

const meta = articleByHref("/glossary");

export const metadata = pageMetadata({
  title: "Glossary: Pizza Oven & Roof Cyclone Terms",
  description: meta.description,
  path: meta.href,
  image: absoluteUrl(IMAGES[meta.imageKey].src.src),
});

type Term = { term: string; definition: string; link?: { href: string; label: string } };

const PIZZA_TERMS: Term[] = [
  { term: "Refractory", definition: "Describes materials made to withstand very high temperatures without breaking down, such as fire bricks, refractory cement and castable." },
  { term: "Fire brick", definition: "A brick made from refractory clay for the hot parts of ovens, kilns and fireplaces. Dense fire bricks store heat; insulating fire bricks keep it in.", link: { href: "/guides/choosing-fire-bricks", label: "Choosing fire bricks" } },
  { term: "Refractory mortar", definition: "Heat-resistant mortar used for the thin joints between fire bricks in the hot parts of an oven.", link: { href: "/products/refractory-mortar", label: "Refractory mortar" } },
  { term: "Refractory cement", definition: "Heat-resistant cement for building and patching ovens, fireplaces and flues; often called fireproof cement.", link: { href: "/products/refractory-cement", label: "Refractory cement" } },
  { term: "Castable", definition: "A dry refractory concrete mix that is mixed with water and cast or trowelled into shape, for example to form a dome or floor slab.", link: { href: "/products/refractory-castables", label: "Refractory castable" } },
  { term: "Hearth", definition: "The floor of the oven, including the cooking surface and the insulating layer beneath it.", link: { href: "/products/hearth-materials", label: "Hearth materials" } },
  { term: "Dome", definition: "The curved roof of the oven chamber. It absorbs heat from the fire and radiates it back onto the pizza." },
  { term: "Thermal mass", definition: "The ability of heavy materials such as dense fire brick to store heat and release it slowly." },
  { term: "Ceramic fibre blanket", definition: "A light, flexible high-temperature insulation wrapped over an oven dome.", link: { href: "/products/ceramic-fibre-blanket", label: "Ceramic fibre blanket" } },
  { term: "Vermiculite / perlite", definition: "Lightweight expanded minerals mixed with cement to make insulating concrete under an oven floor.", link: { href: "/products/vermiculite", label: "Vermiculite" } },
  { term: "Curing", definition: "Drying a new or repaired oven with a series of gradually larger fires so trapped water escapes without cracking it.", link: { href: "/pizza-oven-guide", label: "Pizza oven guide" } },
  { term: "Thermal shock", definition: "Cracking caused by a sudden temperature change, for example water on a hot floor.", link: { href: "/guides/pizza-oven-care-and-maintenance", label: "Oven care" } },
  { term: "Door rope (gasket)", definition: "Ceramic fibre rope fitted round an oven door to seal in heat.", link: { href: "/products/ceramic-fibre-rope", label: "Door seal rope" } },
  { term: "Flue", definition: "The chimney or vent that carries smoke and combustion gases out of the oven." },
  { term: "Peel", definition: "The long-handled paddle used to slide pizzas into and out of the oven." },
];

const CYCLONE_TERMS: Term[] = [
  { term: "Roof cyclone", definition: "A wind-driven turbine ventilator on the roof that draws hot, stale and humid air out of a building. Also called a whirlybird or turbine vent.", link: { href: "/products/roof-ventilators-roof-cyclones", label: "Our roof cyclones" } },
  { term: "Throat", definition: "The round neck of a cyclone that sits over the roof opening. Cyclones are sized by throat diameter, for example 600 mm." },
  { term: "Vanes", definition: "The curved blades of the cyclone head that catch the wind and make it spin." },
  { term: "Bearing", definition: "The part the head spins on. Worn or dry bearings cause squeaking, wobbling or a stuck head.", link: { href: "/services/roof-cyclone-repair", label: "Cyclone repair" } },
  { term: "Base / flashing", definition: "The adaptor that joins the cyclone to the roof sheet, shaped to the roof profile and sealed against rain." },
  { term: "Stack effect", definition: "The natural rise of warm air, which pushes air out of high openings such as cyclones even when the wind is still." },
  { term: "Air change", definition: "Replacing the full volume of air in a space once with fresh air. Ventilation needs are often described in air changes per hour." },
  { term: "Intake (make-up) air", definition: "Fresh air entering through vents, louvres, windows or doors to replace the air the cyclones extract." },
  { term: "Condensation", definition: "Water forming when warm, humid air meets a cooler surface, such as the underside of a metal roof at night.", link: { href: "/guides/ventilating-hot-metal-roofs", label: "Hot metal roofs" } },
  { term: "Stainless steel", definition: "A corrosion-resistant steel alloy; the material of the cyclones we stock." },
];

function TermList({ id, title, terms }: { id: string; title: string; terms: Term[] }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className={h2Class}>{title}</h2>
      <dl className="mt-5 divide-y divide-line rounded-xl border border-line bg-white">
        {terms.map((t) => (
          <div key={t.term} className="grid gap-1 p-4 sm:grid-cols-[12rem_1fr] sm:gap-4">
            <dt className="font-semibold text-navy" id={`term-${t.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              {t.term}
            </dt>
            <dd className="text-ink">
              {t.definition}
              {t.link && (
                <>
                  {" "}
                  <Link href={t.link.href} className="font-semibold text-navy underline">{t.link.label}</Link>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function Page() {
  return (
    <ArticleLayout meta={meta} intro={<p>Plain-English explanations of the words you will meet when planning a pizza oven or roof ventilation.</p>}>
      <TermList id="pizza-terms" title="Pizza oven terms" terms={PIZZA_TERMS} />
      <TermList id="cyclone-terms" title="Roof cyclone terms" terms={CYCLONE_TERMS} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Pizza oven and roof cyclone glossary",
          url: absoluteUrl(meta.href),
          hasDefinedTerm: [...PIZZA_TERMS, ...CYCLONE_TERMS].map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.definition })),
        }}
      />
    </ArticleLayout>
  );
}
