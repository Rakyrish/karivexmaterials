import Link from "next/link";

import { ArticleLayout, Ref, h2Class, proseClass } from "@/components/ArticleLayout";
import { FaqSection } from "@/components/FaqSection";
import { CheckIcon } from "@/components/Icons";
import { articleByHref } from "@/lib/articles";
import { absoluteUrl } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

const meta = articleByHref("/guides/pizza-oven-care-and-maintenance");

export const metadata = pageMetadata({
  title: "Pizza Oven Care and Maintenance Guide",
  description: meta.description,
  path: meta.href,
  image: absoluteUrl(IMAGES[meta.imageKey].src.src),
});

const ROUTINE = [
  ["After every use", "Let the oven cool, then brush the ash and debris to the centre and shovel it into a metal bin with a lid."],
  ["Every week (busy kitchens)", "Brush the floor with a brass-bristle brush; check the door seal and the flue for build-up."],
  ["Every few months", "Inspect the dome and floor for widening cracks or loose bricks; check the outer render and rain protection."],
  ["Every year", "Have the flue/chimney cleaned; replace a hardened or crumbling door rope seal; review any repairs."],
];

export default function Page() {
  return (
    <ArticleLayout
      meta={meta}
      intro={
        <p>
          A well-built masonry oven can last many years. The two things that shorten its life are sudden temperature changes
          and water. Here is how to look after it day to day, and how to tell when it needs repair.
        </p>
      }
    >
      <section aria-labelledby="thermal-shock">
        <h2 id="thermal-shock" className={h2Class}>Avoid thermal shock</h2>
        <div className={proseClass}>
          <p>
            Rapid temperature change is the main cause of cracked floors and domes. Heat the oven up gradually from cold, never
            throw water on a hot floor or dome, and let it cool down on its own. Maintenance guides such as this{" "}
            <Ref href="https://theexaminernews.com/buying-guides/outdoor-pizza-oven-maintenance-the-ultimate-guide/">outdoor pizza oven maintenance guide</Ref>{" "}
            put thermal shock at the top of the list.
          </p>
        </div>
      </section>

      <section aria-labelledby="cleaning">
        <h2 id="cleaning" className={h2Class}>Cleaning the floor</h2>
        <div className={proseClass}>
          <p>
            Most cleaning happens by itself: the fire burns off food residue. Once the oven has cooled, sweep ash to the
            centre with a brass-bristle brush and lift it out with a metal shovel into a lidded metal bin, as described in
            this <Ref href="https://www.fontanaforniusa.com/blogs/news-1/how-to-clean-and-maintain-your-woodfired-pizza-oven">guide to cleaning a wood-fired oven</Ref>.
            Avoid soap and chemicals on the cooking floor — the bricks are porous.
          </p>
        </div>
      </section>

      <section aria-labelledby="rain">
        <h2 id="rain" className={h2Class}>Keep the rain out</h2>
        <div className={proseClass}>
          <p>
            Moisture does more long-term damage than heat. Outdoor ovens need a sound, waterproof outer render or a roof over
            them, and the door closed when not in use. A wet oven will take extra firing to dry out: after heavy rain or a long
            period of disuse, light a few long, gentle fires below pizza temperature before cooking at full heat — the
            Forno Bravo community&apos;s advice on{" "}
            <Ref href="https://community.fornobravo.com/forum/regional-forums/northeast-us/16217-care-of-oven-in-regards-to-rain">caring for an oven in the rain</Ref>{" "}
            explains why.
          </p>
        </div>
      </section>

      <section aria-labelledby="routine">
        <h2 id="routine" className={h2Class}>A simple maintenance routine</h2>
        <div className="mt-5 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Pizza oven maintenance routine</caption>
            <tbody className="divide-y divide-line">
              {ROUTINE.map(([when, what]) => (
                <tr key={when} className="odd:bg-mist/60">
                  <th scope="row" className="w-1/3 px-4 py-3 font-semibold text-navy">{when}</th>
                  <td className="px-4 py-3">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="repair">
        <h2 id="repair" className={h2Class}>When does an oven need repair?</h2>
        <ul className="mt-4 space-y-2 text-lg text-ink">
          {[
            "Cracks that are getting wider, or that you can see light or smoke through",
            "Floor bricks that rock, have sunk or have broken edges that catch the peel",
            "Loose bricks or crumbling mortar in the dome or mouth",
            "Smoke escaping round the door, or a door seal that is hard and flattened",
            "The oven losing heat much faster than it used to (often failed insulation)",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <CheckIcon className="mt-1.5 shrink-0 text-orange-600" /> {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-lg text-ink">
          Fine hairline cracks are normal in masonry ovens. For anything more, our{" "}
          <Link href="/services/pizza-oven-repair-relining" className="font-semibold text-navy underline">pizza oven repair and relining</Link>{" "}
          service can assess it — send photos.
        </p>
      </section>

      <FaqSection
        title="Oven care questions"
        faqs={[
          {
            question: "Can I clean the oven floor with water?",
            answer: "Never on a hot oven. Sudden cooling can crack the floor. Brush ash out once the oven is cold; let the fire burn off food residue.",
          },
          {
            question: "Do I need to cure the oven again after it has been unused?",
            answer: "If it has absorbed moisture from rain or long disuse, light a few long, gentle fires below pizza temperature to dry it out before cooking at full heat.",
          },
          {
            question: "How often should the door seal be replaced?",
            answer: "When the rope becomes hard, flattened or crumbly, or smoke escapes round the door. Busy ovens may need a new seal yearly.",
          },
        ]}
      />
    </ArticleLayout>
  );
}
