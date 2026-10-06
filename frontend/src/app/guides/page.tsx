import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowRightIcon } from "@/components/Icons";
import { Container, PageHero } from "@/components/Section";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Guides — Pizza Ovens & Roof Cyclones",
  description: "Practical guides to building and curing pizza ovens, and to choosing, maintaining and repairing roof cyclones.",
  path: "/guides",
});

const GUIDES = [
  {
    href: "/pizza-oven-guide",
    title: "How a pizza oven is built",
    summary: "The layers of a pizza oven, the materials used in each, curing a new oven, and how hot ovens run.",
    image: IMAGES["oven-fire-floor"],
  },
  {
    href: "/roof-cyclone-guide",
    title: "Roof cyclones: how they work and how to keep them turning",
    summary: "How turbine ventilators work, where they help, choosing them, and fixing squeaks, wobbles and leaks.",
    image: IMAGES["roof-cyclone-closeup"],
  },
];

export default function GuidesPage() {
  return (
    <>
      <PageHero title="Guides" breadcrumbs={<Breadcrumbs items={[{ name: "Guides", href: "/guides" }]} />}>
        <p>Plain-language guides to help you plan, buy and look after pizza ovens and roof cyclones.</p>
      </PageHero>
      <Container className="py-12">
        <ul className="grid gap-6 md:grid-cols-2">
          {GUIDES.map((guide) => (
            <li key={guide.href}>
              <Link href={guide.href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm hover:shadow-lg">
                <span className="relative block aspect-[16/9]">
                  <Image src={guide.image.src} alt="" fill placeholder="blur" sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span className="flex flex-1 flex-col p-6">
                  <span className="font-display text-2xl font-bold text-navy group-hover:underline">{guide.title}</span>
                  <span className="mt-2 text-slate">{guide.summary}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 font-semibold text-navy">
                    Read the guide <ArrowRightIcon />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
