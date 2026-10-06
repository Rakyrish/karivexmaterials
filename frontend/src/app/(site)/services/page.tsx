import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowRightIcon, CheckIcon, TruckIcon } from "@/components/Icons";
import { Container, PageHero } from "@/components/Section";
import { loadServices } from "@/lib/data";
import { serviceImage } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pizza Oven & Roof Cyclone Services in Kenya",
  description:
    "Pizza oven building, repair and relining, material advice and delivery, plus roof cyclone installation and repair, from KariVex Industrial Materials in Nairobi.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await loadServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Pizza oven and roof cyclone services"
        breadcrumbs={<Breadcrumbs items={[{ name: "Services", href: "/services" }]} />}
      >
        <p>
          As well as supplying the materials, we build and repair pizza ovens, install and repair roof cyclones, help
          you choose materials for your own project, and deliver to your site. Every job is quoted individually.
        </p>
      </PageHero>
      <Container className="py-12">
        <ul className="grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const img = serviceImage(service.slug);
            return (
              <li key={service.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                {service.image ? (
                  <div className="relative aspect-[16/9]">
                    <Image src={service.image} alt={service.image_alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
                  </div>
                ) : img ? (
                  <div className="relative aspect-[16/9]">
                    <Image src={img.src} alt={img.alt} fill placeholder="blur" sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
                  </div>
                ) : (
                  <div className="hex-texture flex aspect-[16/9] items-center justify-center bg-navy text-6xl text-orange">
                    <TruckIcon />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-2xl font-bold text-navy">
                    <Link href={`/services/${service.slug}`} className="hover:underline">
                      {service.name}
                    </Link>
                  </h2>
                  <p className="mt-2 text-slate">{service.summary}</p>
                  {service.includes.length > 0 && (
                    <ul className="mt-4 space-y-1.5 text-sm text-ink">
                      {service.includes.slice(0, 4).map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckIcon className="mt-0.5 shrink-0 text-orange-600" /> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-auto inline-flex items-center gap-1 pt-5 font-semibold text-navy hover:underline"
                    aria-label={`${service.name}: details and request`}
                  >
                    Details and request <ArrowRightIcon />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </>
  );
}
