import Link from "next/link";

import { ArticleLayout, Ref, h2Class, proseClass } from "@/components/ArticleLayout";
import { FaqSection } from "@/components/FaqSection";
import { articleByHref } from "@/lib/articles";
import { absoluteUrl } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

const meta = articleByHref("/guides/wood-fired-vs-gas-pizza-ovens");

export const metadata = pageMetadata({
  title: "Wood-Fired vs Gas Pizza Ovens Compared",
  description: meta.description,
  path: meta.href,
  image: absoluteUrl(IMAGES[meta.imageKey].src.src),
});

const ROWS = [
  ["Heat-up time", "Longer — often 45 minutes to an hour or more for a masonry oven", "Shorter — commonly 15–25 minutes"],
  ["Flavour", "Subtle wood smoke and the classic charred, blistered crust", "Clean flavour; excellent crust when hot enough"],
  ["Temperature control", "Managed by the fire; needs attention to keep steady", "Steady and adjustable at a knob"],
  ["Cleaning", "Ash to remove after use", "No ash"],
  ["Fuel", "Dry, seasoned hardwood — needs storage space", "LPG or natural gas supply and safe installation"],
  ["Best suited to", "Traditional pizzerias, restaurants that sell the theatre of fire, enthusiasts", "High-volume kitchens wanting speed and consistency"],
];

export default function Page() {
  return (
    <ArticleLayout
      meta={meta}
      intro={
        <p>
          Both can bake excellent pizza. The choice is about how you want to cook, how busy your kitchen is, and the fuel you
          can get reliably. Whichever you choose, the oven&apos;s floor, dome and insulation are built from the same refractory
          materials.
        </p>
      }
    >
      <section aria-labelledby="compare">
        <h2 id="compare" className={h2Class}>Side by side</h2>
        <div className="mt-5 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Wood-fired and gas pizza ovens compared</caption>
            <thead className="bg-navy text-white">
              <tr>
                <th scope="col" className="px-4 py-3"> </th>
                <th scope="col" className="px-4 py-3">Wood-fired</th>
                <th scope="col" className="px-4 py-3">Gas-fired</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ROWS.map(([label, wood, gas]) => (
                <tr key={label} className="odd:bg-mist/60">
                  <th scope="row" className="px-4 py-3 font-semibold text-navy">{label}</th>
                  <td className="px-4 py-3">{wood}</td>
                  <td className="px-4 py-3">{gas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate">
          Figures are typical ranges from published comparisons such as this{" "}
          <Ref href="https://www.directstoves.com/our-blog/pizza-ovens-explained-gas-vs-wood-vs-dual-fuel/">guide to gas, wood and dual-fuel pizza ovens</Ref>{" "}
          and this <Ref href="https://www.techradar.com/home/gas-vs-wood-pizza-oven-the-differences-you-need-to-know-plus-our-top-oven-recommendations">gas vs wood comparison</Ref>;
          large masonry ovens can take longer.
        </p>
      </section>

      <section aria-labelledby="flavour">
        <h2 id="flavour" className={h2Class}>Does wood really taste better?</h2>
        <div className={proseClass}>
          <p>
            Wood adds a light smokiness and many people love the look and ritual of a live fire. But a pizza spends only a
            minute or two in a very hot oven, so the flavour difference is smaller than many expect. Crust quality depends
            mostly on getting the floor and dome hot enough — which is a matter of good refractory mass and insulation for
            either fuel.
          </p>
        </div>
      </section>

      <section aria-labelledby="construction">
        <h2 id="construction" className={h2Class}>What it means for the build</h2>
        <div className={proseClass}>
          <p>
            Both types use a dense{" "}
            <Link href="/products/fire-bricks-refractory-bricks" className="font-semibold text-navy underline">fire brick</Link> or{" "}
            <Link href="/products/refractory-castables" className="font-semibold text-navy underline">castable</Link> floor and dome, an{" "}
            <Link href="/categories/pizza-oven-insulation" className="font-semibold text-navy underline">insulated</Link> hearth and dome, and a
            sealed door. A wood oven needs room for the fire, an ash-friendly floor and a good flue. A gas oven needs a
            correctly specified burner and gas installation by a qualified gas technician.
          </p>
        </div>
      </section>

      <section aria-labelledby="choose">
        <h2 id="choose" className={h2Class}>Which should you choose?</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-lg text-ink">
          <li>Busy kitchen, consistent output, little time to manage a fire: gas is usually easier.</li>
          <li>Traditional Neapolitan-style pizza and the appeal of a live fire: wood.</li>
          <li>Unreliable gas supply or a ready source of dry hardwood: wood.</li>
          <li>Not sure? Tell us how you will use the oven and we will talk it through.</li>
        </ul>
      </section>

      <FaqSection
        title="Wood vs gas questions"
        faqs={[
          {
            question: "Is a gas pizza oven cheaper to run than wood?",
            answer: "It depends on local fuel prices and how much you bake. Compare the cost of gas against good dry hardwood for your expected daily use.",
          },
          {
            question: "Do wood and gas ovens use different bricks?",
            answer: "No. Both use dense fire brick or castable for the floor and dome, with insulation underneath and outside. The difference is in the fire chamber, burner and flue.",
          },
          {
            question: "Can you build both types?",
            answer: "Tell us the fuel you prefer when you request an oven build and we will discuss the design with you. Gas installation itself must be done by a qualified gas technician.",
          },
        ]}
      />
    </ArticleLayout>
  );
}
