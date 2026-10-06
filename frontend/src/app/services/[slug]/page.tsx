import Image from "next/image";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactLink } from "@/components/ContactLink";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Testimonials } from "@/components/Testimonials";
import { FaqSection } from "@/components/FaqSection";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/Section";
import { getService, getTestimonials } from "@/lib/api";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/config";
import { whatsappHref } from "@/lib/contact";
import { loadSettings } from "@/lib/data";
import { serviceImage } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found", robots: { index: false } };
  return pageMetadata({
    title: service.seo_title || service.name,
    description: service.seo_description || service.summary || service.description,
    path: `/services/${service.slug}`,
    image: service.image
      ? absoluteUrl(service.image)
      : serviceImage(service.slug)
        ? absoluteUrl(serviceImage(service.slug)!.src.src)
        : null,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getService(slug), loadSettings()]);
  if (!service) notFound();
  const testimonials = await getTestimonials(service.slug.includes("cyclone") ? "cyclones" : "pizza");
  const path = `/services/${service.slug}`;
  const stock = serviceImage(service.slug);
  const paragraphs = service.description.split(/\n\s*\n/).filter(Boolean);
  const wa = whatsappHref(
    settings,
    `Hello KariVex, I would like to request: ${service.name}.\nLocation: \nDetails: \n\n${SITE_ORIGIN}${path}`,
  );

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        {(service.image || stock) && (
          <Image
            src={service.image || stock!.src}
            alt=""
            fill
            preload
            sizes="100vw"
            placeholder={service.image ? "empty" : "blur"}
            className="-z-10 object-cover opacity-35"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/85 to-navy/40" aria-hidden="true" />
        <Container className="py-12 sm:py-16">
          <div className="[&_a]:text-white/85 [&_nav]:text-white/80 [&_span[aria-current]]:text-white">
            <Breadcrumbs
              items={[
                { name: "Services", href: "/services" },
                { name: service.name, href: path },
              ]}
            />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-wider text-orange">Service</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-extrabold sm:text-5xl">{service.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">{service.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#request" className="inline-flex min-h-12 items-center rounded-md bg-orange px-5 font-bold text-navy hover:bg-orange-600">
              Request this service
            </a>
            {wa && (
              <ContactLink
                kind="whatsapp"
                href={wa}
                placement={`service_${service.slug}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[#1f7a43] px-5 font-bold text-white hover:bg-[#17633a]"
              >
                <WhatsAppIcon /> WhatsApp us
              </ContactLink>
            )}
            {settings.primary_phone_href && (
              <ContactLink
                kind="phone"
                href={settings.primary_phone_href}
                placement={`service_${service.slug}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-md border-2 border-white px-5 font-bold text-white hover:bg-white hover:text-navy"
              >
                <PhoneIcon /> {settings.primary_phone}
              </ContactLink>
            )}
          </div>
          {!service.image && stock?.badge && <p className="mt-6 text-xs text-white/60">Background: {stock.badge.toLowerCase()}.</p>}
        </Container>
      </section>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section aria-labelledby="about-service">
            <h2 id="about-service" className="font-display text-2xl font-bold text-navy">
              About this service
            </h2>
            <div className="prose-copy mt-3 text-lg text-ink">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </section>
          <FaqSection faqs={service.faqs ?? []} />
          {service.includes.length > 0 && (
            <section aria-labelledby="includes" className="rounded-2xl bg-mist p-6">
              <h2 id="includes" className="font-display text-xl font-bold text-navy">
                What it covers
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-ink">
                    <CheckIcon className="mt-1 shrink-0 text-orange-600" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate">
                The exact scope, price and timing are confirmed in your quotation.
              </p>
            </section>
          )}
        </div>
        {service.request_checklist.length > 0 && (
          <aside className="h-fit rounded-2xl bg-navy p-6 text-white">
            <h2 className="font-display text-xl font-bold">What to tell us</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {service.request_checklist.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckIcon className="mt-0.5 shrink-0 text-orange" /> {item}
                </li>
              ))}
            </ul>
          </aside>
        )}
      </Container>

      {service.related_products.length > 0 && (
        <section aria-labelledby="materials" className="bg-mist py-12">
          <Container>
            <h2 id="materials" className="font-display text-2xl font-bold text-navy">
              Materials used for this service
            </h2>
            <p className="mt-1 text-slate">Also available to buy on their own for your own project.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {service.related_products.slice(0, 6).map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <Testimonials testimonials={testimonials} settings={settings} title="Customer feedback" />

      <section id="request" aria-labelledby="request-title" className="scroll-mt-40 py-12">
        <Container className="max-w-4xl">
          <h2 id="request-title" className="font-display text-3xl font-extrabold text-navy">
            Request: {service.name}
          </h2>
          <p className="mt-2 text-slate">Send the details and we will get back to you with next steps and a quotation.</p>
          <div className="mt-6">
            {settings.contact_form_enabled ? (
              <EnquiryForm mode="service" serviceSlug={service.slug} />
            ) : (
              <p className="rounded-xl border border-line bg-mist p-6">
                The online form is temporarily unavailable. Please call, email or WhatsApp us.
              </p>
            )}
          </div>
        </Container>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.summary || service.description,
          url: absoluteUrl(path),
          serviceType: service.name,
          provider: { "@id": `${SITE_ORIGIN}/#division` },
        }}
      />
    </>
  );
}
