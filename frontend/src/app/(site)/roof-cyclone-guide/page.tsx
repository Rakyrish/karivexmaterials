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
  title: "Roof Cyclone Guide: How They Work & Common Faults",
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

const MATERIALS = [
  {
    material: "Stainless steel (what we stock)",
    corrosion: "Highest resistance; suits coastal sites, damp buildings and areas with fumes",
    strength: "Strongest; resists dents and weathering",
    notes: "Higher purchase price, lower cost over the life of the roof",
  },
  {
    material: "Aluminium",
    corrosion: "Good; forms its own protective oxide layer, but can pit in acidic or alkaline air",
    strength: "Light; dents more easily",
    notes: "Common lower-cost choice for homes",
  },
  {
    material: "Galvanised steel",
    corrosion: "Protected by its zinc coating until the coating wears or is scratched",
    strength: "Strong",
    notes: "Can rust once the coating is damaged",
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
    question: "How often should roof cyclones be serviced?",
    answer:
      "For homes, a visual check once a year is usually enough. On factories and warehouses, check them at least every six months: make sure they spin freely and quietly, the fixings are tight and the base seal is intact.",
  },
  {
    question: "Why are your cyclones stainless steel?",
    answer:
      "Stainless steel is the most corrosion-resistant of the common cyclone materials, so it holds up well on exposed roofs, near the coast and over damp or fume-laden buildings.",
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
                common for commercial roofs. We stock 600 mm cyclones. Larger buildings usually need several cyclones
                rather than one big one.
              </p>
              <p>
                <strong>Number and spacing.</strong> The number depends on the building&apos;s volume and use. Cyclones are
                usually placed high on the roof, near the ridge, and spread out evenly so the whole space is ventilated.
              </p>
              <p>
                <strong>Material.</strong> Cyclones are made in aluminium, stainless steel or galvanised steel.
                Stainless steel, which we stock, resists rust and weathering on exposed roofs.
              </p>
              <p>
                <strong>Base.</strong> The base must match the roof sheet profile and pitch, and be sealed properly to keep
                rain out.
              </p>
            </div>
          </section>

          <section aria-labelledby="how-many">
            <h2 id="how-many" className={h2}>
              How many cyclones, and where
            </h2>
            <div className="prose-copy mt-4 space-y-4 text-lg text-ink">
              <p>
                For roof spaces, a widely used rule of thumb is about 1 unit of vent area for every 300 units of floor
                area (for example 1 m² of vents per 300 m²), split between low-level air intake and high-level exhaust
                such as cyclones, as explained in this{" "}
                <Ref href="https://www.familyhandyman.com/?p=19188">comparison of roof vents and turbine vents</Ref>.
                Factories, warehouses and poultry houses usually need more air movement than a home roof space, because
                machinery, stock, animals or processes add heat and moisture.
              </p>
              <p>
                Cyclones belong high on the roof, close to the ridge, where the hottest air collects. Manufacturer{" "}
                <Ref href="https://res.cloudinary.com/amerhart/image/upload/Documents/Product/Lomanco%20Whirlybird%20BEB-BIB%20Installation">
                  installation guidance for whirlybirds
                </Ref>{" "}
                spaces them evenly along the ridge: with two, each sits a quarter of the ridge length in from its end;
                with three, the outer two sit a sixth of the length in from each end and the third goes in the middle.
              </p>
              <p>
                Cyclones also need air to replace what they extract, through eaves vents, louvres, windows or doors.
                Send us your roof size and building use and we will recommend a number and layout.
              </p>
            </div>
          </section>

          <section aria-labelledby="materials">
            <h2 id="materials" className={h2}>
              Stainless steel, aluminium or galvanised?
            </h2>
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Roof cyclone materials compared</caption>
                <thead className="bg-navy text-white">
                  <tr>
                    <th scope="col" className="px-4 py-3">Material</th>
                    <th scope="col" className="px-4 py-3">Corrosion</th>
                    <th scope="col" className="px-4 py-3">Strength</th>
                    <th scope="col" className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {MATERIALS.map((m) => (
                    <tr key={m.material} className="odd:bg-mist/60">
                      <th scope="row" className="px-4 py-3 font-semibold text-navy">{m.material}</th>
                      <td className="px-4 py-3">{m.corrosion}</td>
                      <td className="px-4 py-3">{m.strength}</td>
                      <td className="px-4 py-3">{m.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-slate">
              General guidance on how the metals behave; the right choice also depends on budget and site conditions.
            </p>
          </section>

          <section aria-labelledby="installation">
            <h2 id="installation" className={h2}>
              What installation involves
            </h2>
            <ol className="mt-4 space-y-3">
              {[
                "Plan the number and positions of the cyclones along the ridge.",
                "Mark and cut a round opening in the roof sheet for each cyclone's throat.",
                "Fit a base (flashing) that matches the roof sheet profile and pitch.",
                "Seal the base and fix it securely so rain cannot get in.",
                "Fit the cyclone head, check it is level and turns freely.",
              ].map((step, i) => (
                <li key={step} className="flex gap-3 text-lg text-ink">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange font-bold text-navy">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-slate">
              Roof work is dangerous; it needs proper access equipment and fall protection.{" "}
              <Link href="/services/roof-cyclone-installation" className="font-semibold text-navy underline">
                We install 600 mm stainless steel cyclones
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="maintenance">
            <h2 id="maintenance" className={h2}>
              Maintenance
            </h2>
            <ul className="mt-4 space-y-2 text-lg text-ink">
              {[
                "Homes: a visual check once a year, ideally before the hottest season.",
                "Factories and warehouses: inspect at least every six months.",
                "Check that each cyclone spins freely and quietly in a breeze.",
                "Tighten loose screws and bolts on the head and base.",
                "Clean off dust and debris; lubricate or replace dry bearings.",
                "Check the base seal for cracks and reseal if water gets in.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckIcon className="mt-1.5 shrink-0 text-orange-600" /> {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-slate">
              Intervals follow typical guidance such as this{" "}
              <Ref href="https://aerovent.com/wp-content/uploads/2018/12/Model-53-40C-and-SV40-Roof-Ventilators-IM-120.pdf">
                roof ventilator maintenance manual
              </Ref>{" "}
              and these{" "}
              <Ref href="https://www.hunker.com/12359164/how-to-lubricate-roof-vents/">tips on lubricating roof vents</Ref>.
            </p>
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
            <Image
              src={IMAGES["cyclone-on-corrugated-roof"].src}
              alt={IMAGES["cyclone-on-corrugated-roof"].alt}
              placeholder="blur"
              sizes="(min-width:1024px) 33vw, 100vw"
              className="h-auto w-full"
            />
            <figcaption className="p-3 text-xs text-slate">A cyclone fitted on a corrugated roof with a sealed base (illustrative photo).</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-line">
            <Image src={vanes.src} alt={vanes.alt} placeholder="blur" sizes="(min-width:1024px) 33vw, 100vw" className="h-auto w-full" />
            <figcaption className="p-3 text-xs text-slate">Worn, dirty vanes and the top bearing (illustrative photo).</figcaption>
          </figure>
          <div className="rounded-2xl bg-navy p-6 text-white lg:sticky lg:top-40">
            <h2 className="font-display text-xl font-bold">Need cyclones fitted or fixed?</h2>
            <p className="mt-2 text-white/85">
              We stock 600 mm stainless steel roof cyclones, install them, and repair noisy, stuck or leaking ones.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/products/roof-ventilators-roof-cyclones" className="inline-flex min-h-11 items-center gap-1 rounded-md bg-orange px-4 font-semibold text-navy hover:bg-orange-600">
                Buy roof cyclones <ArrowRightIcon />
              </Link>
              <Link href="/services/roof-cyclone-installation" className="inline-flex min-h-11 items-center rounded-md border border-white px-4 font-semibold hover:bg-white hover:text-navy">
                Installation
              </Link>
              <Link href="/services/roof-cyclone-repair" className="inline-flex min-h-11 items-center rounded-md border border-white px-4 font-semibold hover:bg-white hover:text-navy">
                Repair
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
          image: [absoluteUrl(closeup.src.src), absoluteUrl(roof.src.src), absoluteUrl(IMAGES["cyclone-on-corrugated-roof"].src.src)],
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
