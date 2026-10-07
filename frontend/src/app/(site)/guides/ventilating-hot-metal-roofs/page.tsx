import Link from "next/link";

import { ArticleLayout, Ref, h2Class, proseClass } from "@/components/ArticleLayout";
import { FaqSection } from "@/components/FaqSection";
import { CheckIcon } from "@/components/Icons";
import { articleByHref } from "@/lib/articles";
import { absoluteUrl } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

const meta = articleByHref("/guides/ventilating-hot-metal-roofs");

export const metadata = pageMetadata({
  title: "Ventilating Hot Metal Roofs: Factories & Warehouses",
  description: meta.description,
  path: meta.href,
  image: absoluteUrl(IMAGES[meta.imageKey].src.src),
});

export default function Page() {
  return (
    <ArticleLayout
      meta={meta}
      intro={
        <p>
          Metal roofs are everywhere on Kenyan factories, warehouses, workshops, schools and farms. In the sun they get very
          hot, and at night they can drip with condensation. Good roof ventilation tackles both problems.
        </p>
      }
    >
      <section aria-labelledby="heat">
        <h2 id="heat" className={h2Class}>Why buildings under metal roofs overheat</h2>
        <div className={proseClass}>
          <p>
            Bare metal sheets absorb the sun and radiate heat down into the building, and hot air collects under the roof with
            nowhere to go. The result is a stuffy, overheated space: uncomfortable for workers, hard on stock and machinery,
            and expensive if fans or air conditioning are trying to fight it.
          </p>
        </div>
      </section>

      <section aria-labelledby="sweating">
        <h2 id="sweating" className={h2Class}>Why metal roofs “sweat”</h2>
        <div className={proseClass}>
          <p>
            Metal heats and cools quickly. When warm, humid air inside meets the cooler underside of the roof — especially at
            night or after rain — water vapour condenses into droplets that drip onto stock and floors and slowly rust the
            roof. As this explanation of{" "}
            <Ref href="https://www.rawlinspaints.com/blog/how-to-stop-condensation-on-metal-roofs/">condensation on metal roofs</Ref>{" "}
            notes, poorly ventilated, uninsulated buildings suffer most.
          </p>
        </div>
      </section>

      <section aria-labelledby="ventilation">
        <h2 id="ventilation" className={h2Class}>What roof ventilation does</h2>
        <ul className="mt-4 space-y-2 text-lg text-ink">
          {[
            "Lets the hottest air escape at the highest point instead of building up",
            "Carries moisture out before it can condense on the roof",
            "Replaces stale air, smells and fumes with outside air",
            "Works alongside insulation and reflective roof surfaces, not instead of them",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <CheckIcon className="mt-1.5 shrink-0 text-orange-600" /> {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="poultry">
        <h2 id="poultry" className={h2Class}>Poultry and livestock houses</h2>
        <div className={proseClass}>
          <p>
            Heat stress is a major problem in poultry houses: birds eat less, drink more and pant, and laying and growth
            suffer. Extension and industry advice on{" "}
            <Ref href="https://www.thepoultrysite.com/articles/time-to-think-about-hot-weather-management">hot-weather management of poultry houses</Ref>{" "}
            stresses removing heat through ventilation and reducing the heat coming through the roof. Roof cyclones are one
            part of that picture, together with side openings, shading, and in larger houses, fans.
          </p>
        </div>
      </section>

      <section aria-labelledby="where-cyclones">
        <h2 id="where-cyclones" className={h2Class}>Where roof cyclones fit in</h2>
        <div className={proseClass}>
          <p>
            Roof cyclones sit at the ridge, exactly where hot, humid air gathers, and extract it continuously without power.
            For most warehouses, workshops and farm buildings they are a simple first step. Read{" "}
            <Link href="/roof-cyclone-guide" className="font-semibold text-navy underline">how many cyclones you need and where</Link>, compare{" "}
            <Link href="/guides/roof-cyclones-vs-electric-extractor-fans" className="font-semibold text-navy underline">cyclones and electric fans</Link>, or ask us
            to plan and{" "}
            <Link href="/services/roof-cyclone-installation" className="font-semibold text-navy underline">install 600 mm stainless steel cyclones</Link>{" "}
            for you.
          </p>
        </div>
      </section>

      <FaqSection
        title="Hot roof questions"
        faqs={[
          {
            question: "Will roof cyclones stop my metal roof from dripping?",
            answer:
              "Ventilation removes the warm, moist air that causes condensation, which usually reduces dripping a lot. Very humid buildings may also need insulation under the roof sheets.",
          },
          {
            question: "Are roof cyclones enough for a poultry house?",
            answer:
              "They help remove heat and moisture continuously, but large or closed houses usually also need side openings and often fans. Plan ventilation for the number of birds and the climate.",
          },
          {
            question: "Can cyclones be added to an existing building?",
            answer: "Yes. They are commonly fitted to existing metal roofs, with a base matched to the roof profile and sealed against rain.",
          },
        ]}
      />
    </ArticleLayout>
  );
}
