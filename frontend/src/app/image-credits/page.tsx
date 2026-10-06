import Image from "next/image";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container, PageHero } from "@/components/Section";
import { IMAGES, IMAGE_CREDITS } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Image Credits",
  description: "Credits and licences for the illustrative photographs used on KariVex Industrial Materials.",
  path: "/image-credits",
});

export default function ImageCreditsPage() {
  return (
    <>
      <PageHero title="Image credits" breadcrumbs={<Breadcrumbs items={[{ name: "Image credits", href: "/image-credits" }]} />}>
        <p>
          Photographs marked as illustrative come from Wikimedia Commons under the licences below. They show pizza
          ovens and materials in general, not KariVex&apos;s own stock or projects. Product photos uploaded by our team
          are our own.
        </p>
      </PageHero>
      <Container className="py-10">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {IMAGE_CREDITS.map((credit) => (
            <li key={credit.key} className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="relative aspect-[4/3]">
                <Image src={IMAGES[credit.key].src} alt={credit.alt} fill placeholder="blur" sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" />
              </div>
              <div className="space-y-1 p-4 text-sm">
                <p className="font-semibold text-navy">{credit.title.replace(/\.(jpe?g|png)$/i, "")}</p>
                <p className="text-slate">By {credit.artist}</p>
                <p>
                  {credit.licenseUrl ? (
                    <a href={credit.licenseUrl} rel="license noopener noreferrer" className="text-navy underline">
                      {credit.license}
                    </a>
                  ) : (
                    credit.license
                  )}{" "}
                  ·{" "}
                  <a href={credit.sourcePage} rel="noopener noreferrer" className="text-navy underline">
                    Source
                  </a>
                </p>
                <p className="text-xs text-slate">
                  {"note" in credit && credit.note ? credit.note : "Resized and re-compressed for the web."}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
