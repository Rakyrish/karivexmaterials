import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { ArrowRightIcon, CheckIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { Container, PageHero } from "@/components/Section";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Roof Cyclone Guide — How Turbine Ventilators Work & Common Faults",
  description:
    "How roof cyclones (turbine ventilators, whirlybirds) work, where they help, how to choose them, and how to fix squeaking, wobbling, stuck or leaking cyclones.",
  path: "/roof-cyclone-guide",
  image: absoluteUrl(IMAGES["roof-cyclone-closeup"].src.src),
});

const PUBLISHED = "2026-10-06";

/** External reference woven into the text: descriptive words, never a bare URL. */
function Ref({ href, children }: { href: string; children: ReactNode }) {
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

const PROBLEMS = [
  {
    symptom: "Squeaking, grinding or squealing",
    cause: "Worn bearing, or bearing lubricant dried out or washed away",
    fix: "Clean and lubricate, or replace the bearing; replace the head if the bearing seat is damaged",
  },
  {
    symptom: "Head wobbles or clatters in strong wind",
    cause: "Badly worn bearing, bent spindle or loose fixings",
    fix: "Replace the bearing, straighten or replace the spindle, re-tighten fixings and check the unit is level",
  },
  {
    symptom: "Stopped spinning",
    cause: "Seized or rusted bearing, damaged vanes rubbing, or debris",
    fix: "Free or replace the bearing, repair or replace the head, clear debris",
  },
  {
    symptom: "Water leaking around the cyclone",
    cause: "Failed sealant or loose fasteners where the base meets the roof sheet",
    fix: "Clean the joint, refit fasteners and reseal the base with a suitable roof sealant",
  },
  {
    symptom: "Dented, cracked or corroded vanes",
    cause: "Storm damage, impact or age",
    fix: "Replace the head or the whole cyclone",
  },
];

const FAQS = [
  {
    question: "What is the difference between a roof cyclone, a turbine ventilator and a whirlybird?",
    answer:
      "They are different names for the same thing: a wind-driven turbine vent mounted on the roof. “Roof cyclone” is the common name in Kenya.",
  },
  {
    question: "Do roof cyclones work without wind?",
    answer:
      "They spin best in a breeze. On still days they act as an open passive vent, and warm air rising inside the building still escapes through them.",
  },
  {
    question: "How long do roof cyclones last?",
    answer:
      "It depends on the material, the bearings and the conditions. Bearings are the part that wears; replacing or servicing them often brings a noisy cyclone back into good working order.",
  },
  {
    question: "Why does my cyclone leak when it rains?",
    answer:
      "Most leaks come from the joint where the cyclone base meets the roof sheet, where sealant has cracked or fixings have loosened. Resealing the base usually fixes it.",
  },
];

export default function RoofCycloneGuidePage() {
  const closeup = IMAGES["roof-cyclone-closeup"];
  const roof = IMAGES["industrial-roof-cyclones"];
  const vanes = IMAGES["roof-cyclone-vanes"];
  const h2 = "font-display text-3xl font-extrabold text-navy";
  return (
    <>
      <PageHero
        eyebrow="Guide"
        title="Roof cyclones: how they work and how to keep them turning"
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Guides", href: "/guides" },
              { name: "Roof cyclone guide", href: "/roof-cyclone-guide" },
            ]}
          />
        }
      >
        <p>
          A practical guide to roof cyclones — also called turbine ventilators or whirlybirds — drawing on published
          explanations such as this overview of{" "}
          <Ref href="https://engineerfix.com/what-is-a-whirlybird-roof-vent-and-how-does-it-work/">how whirlybird roof vents work</Ref>{" "}
          and this <Ref href="https://www.no1roofing.com.au/whirlybirds-for-roofs/">roofer&apos;s guide to whirlybirds</Ref>.
        </p>
      </PageHero>

      <Container className="grid gap-12 py-12 lg:grid-cols-[1.5fr_1fr]">
        <article className="space-y-12">
          <section aria-labelledby="what">
            <h2 id="what" className={h2}>
              What a roof cyclone does
            </h2>
            <div className="prose-copy mt-4 space-y-4 text-lg text-ink">
              <p>
                A roof cyclone is a turbine of curved vanes sitting on a short throat over an opening in the roof. When
                the wind turns the vanes, the spinning head creates low pressure above the opening, pulling warm, stale
                and humid air up and out of the building. At the same time, hot air naturally rises (the stack effect),
                so even a gentle breeze keeps air moving.
              </p>
              <p>
                Because the wind does the work, cyclones need no electricity and have no running cost. Their limitation
                is that they depend on wind: on a completely still day they behave like an open passive vent.
              </p>
            </div>
          </section>

          <figure className="overflow-hidden rounded-2xl border border-line">
            <Image src={roof.src} alt={roof.alt} placeholder="blur" sizes="(min-width:1024px) 60vw, 100vw" className="h-auto w-full" />
            <figcaption className="p-3 text-xs text-slate">Cyclones spaced along the ridge of an industrial roof (illustrative photo).</figcaption>
          </figure>

          <section aria-labelledby="where">
            <h2 id="where" className={h2}>
              Where they help
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Factories and workshops with heat from machinery",
                "Warehouses and stores under hot metal roofs",
                "Poultry and livestock houses",
                "Schools, churches and halls",
                "Kitchens, bakeries and laundries with steam and heat",
                "Homes with hot, stuffy roof spaces",
              ].map((item) => (
                <li key={item} className="flex gap-2 rounded-xl bg-mist p-4 text-ink">
                  <CheckIcon className="mt-1 shrink-0 text-orange-600" /> {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="choosing">
            <h2 id="choosing" className={h2}>
              Choosing roof cyclones
            </h2>
            <div className="prose-copy mt-4 space-y-4 text-lg text-ink">
              <p>
                <strong>Size.</strong> Cyclones are sized by their throat diameter; in Kenya 500 mm and 600 mm throats are
                common for commercial roofs. Larger buildings usually need several cyclones rather than one big one.
              </p>
              <p>
                <strong>Number and spacing.</strong> The number depends on the building&apos;s volume and use. Cyclones are
                usually placed high on the roof, near the ridge, and spread out evenly so the whole space is ventilated.
              </p>
              <p>
                <strong>Material.</strong> Cyclones are made in aluminium, stainless steel or galvanised steel. Ask us
                which suits your site and budget.
              </p>
              <p>
                <strong>Base.</strong> The base must match the roof sheet profile and pitch, and be sealed properly to keep
                rain out.
              </p>
            </div>
          </section>

          <section aria-labelledby="problems">
            <h2 id="problems" className={h2}>
              Common problems and fixes
            </h2>
            <p className="mt-4 text-lg text-ink">
              Bearings are the part that wears. As explained in these notes on{" "}
              <Ref href="https://engineerfix.com/common-problems-with-turbine-roof-vents/">common turbine vent problems</Ref>{" "}
              and on <Ref href="https://www.askthebuilder.com/spinning-turbine-vent-noise/">noisy spinning vents</Ref>, a
              worn bearing first squeaks, then lets the head wobble, and can finally seize — see also this guide to{" "}
              <Ref href="https://roofingsuperstore.co.uk/help-and-advice/project-guides/roof-ventilation/why-is-my-roof-vent-turbine-not-spinning">
                why a roof turbine stops spinning
              </Ref>
              .
            </p>
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Roof cyclone problems, likely causes and fixes</caption>
                <thead className="bg-navy text-white">
                  <tr>
                    <th scope="col" className="px-4 py-3">Symptom</th>
                    <th scope="col" className="px-4 py-3">Likely cause</th>
                    <th scope="col" className="px-4 py-3">Usual fix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {PROBLEMS.map((p) => (
                    <tr key={p.symptom} className="odd:bg-mist/60">
                      <th scope="row" className="px-4 py-3 font-semibold text-navy">{p.symptom}</th>
                      <td className="px-4 py-3">{p.cause}</td>
                      <td className="px-4 py-3">{p.fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-slate">
              Working on a roof is dangerous. Use proper access equipment and safety measures, or ask us to do the repair.
            </p>
          </section>

          <FaqSection faqs={FAQS} title="Roof cyclone questions" />
        </article>

        <aside className="space-y-6">
          <figure className="overflow-hidden rounded-2xl border border-line">
            <Image src={closeup.src} alt={closeup.alt} placeholder="blur" sizes="(min-width:1024px) 33vw, 100vw" className="h-auto w-full" />
            <figcaption className="p-3 text-xs text-slate">A roof cyclone (illustrative photo).</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-line">
            <Image src={vanes.src} alt={vanes.alt} placeholder="blur" sizes="(min-width:1024px) 33vw, 100vw" className="h-auto w-full" />
            <figcaption className="p-3 text-xs text-slate">Worn, dirty vanes and the top bearing (illustrative photo).</figcaption>
          </figure>
          <div className="rounded-2xl bg-navy p-6 text-white lg:sticky lg:top-40">
            <h2 className="font-display text-xl font-bold">Need cyclones or a repair?</h2>
            <p className="mt-2 text-white/85">We supply roof cyclones and repair noisy, stuck or leaking ones.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/products/roof-ventilators-roof-cyclones" className="inline-flex min-h-11 items-center gap-1 rounded-md bg-orange px-4 font-semibold text-navy hover:bg-orange-600">
                Buy roof cyclones <ArrowRightIcon />
              </Link>
              <Link href="/services/roof-cyclone-repair" className="inline-flex min-h-11 items-center rounded-md border border-white px-4 font-semibold hover:bg-white hover:text-navy">
                Cyclone repair
              </Link>
            </div>
          </div>
        </aside>
      </Container>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Roof cyclones: how they work and how to keep them turning",
          description:
            "How roof cyclones (turbine ventilators) work, where they help, how to choose them, and common faults and fixes.",
          image: [absoluteUrl(closeup.src.src), absoluteUrl(roof.src.src)],
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          mainEntityOfPage: absoluteUrl("/roof-cyclone-guide"),
          author: { "@type": "Organization", "@id": `${SITE_ORIGIN}/#division`, name: "KariVex Industrial Materials" },
          publisher: { "@id": `${SITE_ORIGIN}/#division` },
        }}
      />
    </>
  );
}
