import Link from "next/link";

import { ArticleLayout, Ref, h2Class, proseClass } from "@/components/ArticleLayout";
import { FaqSection } from "@/components/FaqSection";
import { articleByHref } from "@/lib/articles";
import { absoluteUrl } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

const meta = articleByHref("/guides/choosing-fire-bricks");

export const metadata = pageMetadata({
  title: "Choosing Fire Bricks for a Pizza Oven",
  description: meta.description,
  path: meta.href,
  image: absoluteUrl(IMAGES[meta.imageKey].src.src),
});

const COMPARE = [
  ["Weight", "Heavy", "Very light (around 0.7 kg per litre)"],
  ["Stores heat", "Yes — the oven's heat battery", "Very little"],
  ["Insulates", "Poorly", "Very well"],
  ["Strength", "Hard-wearing; takes peels and logs", "Soft; damaged by tools and wood"],
  ["Where it goes", "Cooking floor and inside of the dome", "Outside the dome or under the floor, as insulation"],
];

export default function Page() {
  return (
    <ArticleLayout
      meta={meta}
      intro={
        <p>
          Fire bricks are the heart of a masonry pizza oven: they take the flame, store the heat and bake the pizza.
          Choosing the right type, and putting each type in the right place, matters more than almost any other decision.
        </p>
      }
    >
      <section aria-labelledby="two-kinds">
        <h2 id="two-kinds" className={h2Class}>Two kinds of fire brick</h2>
        <div className={proseClass}>
          <p>
            <strong>Dense fire bricks</strong> are heavy refractory bricks. They soak up heat from the fire and release it back
            into the oven, which is what bakes the base of the pizza and keeps the oven hot between pizzas.
          </p>
          <p>
            <strong>Insulating fire bricks</strong> are much lighter and full of tiny air pockets. They resist heat flow, so they
            are excellent insulation — but because they store so little heat, an oven lined with them on the inside would
            struggle to cook. Experienced builders on the{" "}
            <Ref href="https://community.fornobravo.com/forum/pizza-oven-design-and-installation/getting-started/395835-refractory-brick-or-insulating-brick">
              Forno Bravo oven-building forum
            </Ref>{" "}
            recommend dense bricks for the floor and dome, with insulating bricks used only on the outside or under the floor.
          </p>
        </div>
        <div className="mt-5 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Dense and insulating fire bricks compared</caption>
            <thead className="bg-navy text-white">
              <tr>
                <th scope="col" className="px-4 py-3"> </th>
                <th scope="col" className="px-4 py-3">Dense fire brick</th>
                <th scope="col" className="px-4 py-3">Insulating fire brick</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {COMPARE.map(([label, dense, insulating]) => (
                <tr key={label} className="odd:bg-mist/60">
                  <th scope="row" className="px-4 py-3 font-semibold text-navy">{label}</th>
                  <td className="px-4 py-3">{dense}</td>
                  <td className="px-4 py-3">{insulating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="ordinary">
        <h2 id="ordinary" className={h2Class}>Why not ordinary bricks?</h2>
        <div className={proseClass}>
          <p>
            Ordinary clay building bricks are not made for repeated heating to several hundred degrees and cooling again. In
            the hot part of an oven they can crack and spall (flake). Fire bricks are made from refractory clays for exactly
            this duty. Ordinary bricks are fine for the stand and the outer decorative enclosure.
          </p>
        </div>
      </section>

      <section aria-labelledby="floor">
        <h2 id="floor" className={h2Class}>Laying the cooking floor</h2>
        <div className={proseClass}>
          <p>
            Floor bricks are usually laid flat, tight against each other, on a thin, level bed over the insulated hearth —
            without mortar between them, so they can be replaced individually. Keep sand and grit out of the joints and make
            the surface as flat as possible so the pizza peel does not catch, as{" "}
            <Ref href="https://www.fornobravo.com/brick-oven-cooking/cooking-surface/">Forno Bravo&apos;s cooking-surface notes</Ref>{" "}
            explain.
          </p>
          <p>
            A thicker floor (bricks on edge) holds more heat for longer baking sessions but takes longer and more fuel to heat;
            bricks laid flat heat up faster. A herringbone pattern helps the peel slide across the joints.
          </p>
        </div>
      </section>

      <section aria-labelledby="dome">
        <h2 id="dome" className={h2Class}>Building the dome</h2>
        <div className={proseClass}>
          <p>
            Domes are commonly built from fire bricks cut in half and laid in rings, each bonded with a thin joint of{" "}
            <Link href="/products/refractory-mortar" className="font-semibold text-navy underline">refractory mortar</Link>. Ordinary mortar breaks down
            under oven heat. Over the finished dome goes a thick{" "}
            <Link href="/products/ceramic-fibre-blanket" className="font-semibold text-navy underline">ceramic fibre blanket</Link> layer, then the
            outer render or enclosure.
          </p>
        </div>
      </section>

      <section aria-labelledby="cutting">
        <h2 id="cutting" className={h2Class}>Cutting fire bricks safely</h2>
        <div className={proseClass}>
          <p>
            Builders use a wet brick saw or an angle grinder with a diamond blade. Always wear eye protection and a proper
            dust mask or respirator: brick dust is harmful to breathe. Curves are cut as a series of short straight cuts.
          </p>
        </div>
      </section>

      <section aria-labelledby="quantity">
        <h2 id="quantity" className={h2Class}>How many bricks?</h2>
        <div className={proseClass}>
          <p>
            It depends on the floor size, dome size and shape, and brick size. Send us the internal dimensions (or a drawing)
            and we will estimate the bricks, mortar, insulation and seal you need — see{" "}
            <Link href="/services/pizza-oven-material-advice" className="font-semibold text-navy underline">material selection advice</Link>.
          </p>
        </div>
      </section>

      <FaqSection
        title="Fire brick questions"
        faqs={[
          {
            question: "Can I use insulating fire bricks for the oven floor?",
            answer:
              "Not for the cooking surface. They store too little heat and are soft. Use dense fire bricks for the floor and inside of the dome, and insulating materials underneath and outside.",
          },
          {
            question: "Should the floor bricks be mortared together?",
            answer:
              "Floor bricks are usually laid tight without mortar between them on a thin, level bed, so the surface stays flat and bricks can be replaced individually.",
          },
          {
            question: "What protective equipment do I need for cutting fire bricks?",
            answer: "Eye protection and a proper dust mask or respirator, as brick dust is harmful to breathe. Hearing protection is also sensible with power saws.",
          },
        ]}
      />
    </ArticleLayout>
  );
}
