import Link from "next/link";

import { ArticleLayout, Ref, h2Class, proseClass } from "@/components/ArticleLayout";
import { FaqSection } from "@/components/FaqSection";
import { articleByHref } from "@/lib/articles";
import { absoluteUrl } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

const meta = articleByHref("/guides/roof-cyclones-vs-electric-extractor-fans");

export const metadata = pageMetadata({
  title: "Roof Cyclones vs Electric Extractor Fans",
  description: meta.description,
  path: meta.href,
  image: absoluteUrl(IMAGES[meta.imageKey].src.src),
});

const ROWS = [
  ["Power", "None — driven by wind and rising warm air", "Mains electricity"],
  ["Running cost", "Nothing to run", "Electricity for every hour it runs"],
  ["During power cuts", "Keeps working", "Stops unless on backup power"],
  ["Airflow", "Varies with the wind; lower on still days", "Steady and controllable, wind or no wind"],
  ["Noise", "Usually near-silent when bearings are good", "Motor and fan noise"],
  ["Maintenance", "Occasional bearing service; base seal checks", "Motor, wiring and controls as well as the fan"],
  ["Best for", "Continuous background removal of heat and humidity", "High, predictable extraction (e.g. fumes, kitchens, processes)"],
];

export default function Page() {
  return (
    <ArticleLayout
      meta={meta}
      intro={
        <p>
          Both pull hot, stale air out through the roof. Roof cyclones (turbine ventilators) do it for free using the wind;
          electric extractor fans do it on demand using power. Many buildings benefit from cyclones alone; some need both.
        </p>
      }
    >
      <section aria-labelledby="compare">
        <h2 id="compare" className={h2Class}>Side by side</h2>
        <div className="mt-5 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Roof cyclones and electric extractor fans compared</caption>
            <thead className="bg-navy text-white">
              <tr>
                <th scope="col" className="px-4 py-3"> </th>
                <th scope="col" className="px-4 py-3">Roof cyclone</th>
                <th scope="col" className="px-4 py-3">Electric extractor fan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ROWS.map(([label, cyclone, fan]) => (
                <tr key={label} className="odd:bg-mist/60">
                  <th scope="row" className="px-4 py-3 font-semibold text-navy">{label}</th>
                  <td className="px-4 py-3">{cyclone}</td>
                  <td className="px-4 py-3">{fan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="cyclone-strengths">
        <h2 id="cyclone-strengths" className={h2Class}>Where roof cyclones shine</h2>
        <div className={proseClass}>
          <p>
            Cyclones need no wiring and have no running cost, keep working through power cuts, and are almost silent. A
            turbine typically starts spinning in a light breeze, and even when it is still, warm air rising through the
            opening keeps some air moving. Comparisons such as this overview of{" "}
            <Ref href="https://baileylineroad.com/what-type-of-roof-ventilation-system-should-you-choose/">which roof ventilation system to choose</Ref>{" "}
            make the same point: passive turbines suit buildings that want more airflow than a static vent without wiring.
          </p>
        </div>
      </section>

      <section aria-labelledby="fan-strengths">
        <h2 id="fan-strengths" className={h2Class}>When you need powered fans</h2>
        <div className={proseClass}>
          <p>
            Because cyclones depend on the weather, their airflow varies. Where extraction must be high and predictable — for
            example over cooking lines, around fumes or dust from a process, or in a fully enclosed space with no other air
            movement — powered fans give guaranteed airflow. A common approach is cyclones for continuous background
            ventilation, with fans where demand peaks.
          </p>
        </div>
      </section>

      <section aria-labelledby="intake">
        <h2 id="intake" className={h2Class}>Do not forget intake air</h2>
        <div className={proseClass}>
          <p>
            Whatever you use to extract air, fresh air must get in to replace it — through eaves vents, wall louvres, windows or
            open doors. Extraction without intake air moves very little.
          </p>
        </div>
      </section>

      <section aria-labelledby="ours">
        <h2 id="ours" className={h2Class}>Our roof cyclones</h2>
        <div className={proseClass}>
          <p>
            We stock{" "}
            <Link href="/products/roof-ventilators-roof-cyclones" className="font-semibold text-navy underline">600 mm stainless steel roof cyclones</Link>,{" "}
            <Link href="/services/roof-cyclone-installation" className="font-semibold text-navy underline">install them</Link> and{" "}
            <Link href="/services/roof-cyclone-repair" className="font-semibold text-navy underline">repair worn or leaking ones</Link>. Send us your
            building size and use and we will recommend a number and layout.
          </p>
        </div>
      </section>

      <FaqSection
        title="Cyclones vs fans questions"
        faqs={[
          {
            question: "Can roof cyclones replace electric extractor fans?",
            answer:
              "For general removal of heat and humidity from roofs and large spaces, often yes. Where extraction must be high and constant regardless of wind, such as fumes or cooking lines, powered fans are still needed.",
          },
          {
            question: "Do roof cyclones work during a power cut?",
            answer: "Yes. They need no electricity, so they keep ventilating when the power is off.",
          },
          {
            question: "Can cyclones and fans be used together?",
            answer: "Yes. A common approach is cyclones for continuous background ventilation and powered fans where demand peaks.",
          },
        ]}
      />
    </ArticleLayout>
  );
}
