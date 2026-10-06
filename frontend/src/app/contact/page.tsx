import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactLink } from "@/components/ContactLink";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import { Container, PageHero } from "@/components/Section";
import { SITE_ORIGIN } from "@/lib/config";
import { generalWhatsAppMessage, mailtoHref, whatsappHref } from "@/lib/contact";
import { loadSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const settings = await loadSettings();
  return pageMetadata({
    title: "Contact KariVex Industrial Materials",
    description: `Call ${settings.primary_phone}, WhatsApp or email ${settings.email} for insulation, refractory, packaging, refrigeration and industrial materials. ${settings.address_line}.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await loadSettings();
  const wa = whatsappHref(settings, generalWhatsAppMessage(`${SITE_ORIGIN}/contact`));
  const cardClass = "flex gap-4 rounded-xl border border-line bg-white p-5";
  const iconClass = "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy text-xl text-white";

  return (
    <>
      <PageHero
        title="Contact the Industrial Materials Division"
        breadcrumbs={<Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />}
      >
        <p>
          Talk to our sales team about materials, specifications and quantities. {settings.relationship_wording}; we
          share the company&apos;s contact lines and warehouse.
        </p>
      </PageHero>
      <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_1.3fr]">
        <section aria-labelledby="contact-details" className="space-y-4">
          <h2 id="contact-details" className="font-display text-2xl font-bold text-navy">
            Contact details
          </h2>
          <div className={cardClass}>
            <span className={iconClass}>
              <PhoneIcon />
            </span>
            <div>
              <h3 className="font-semibold text-navy">Sales telephone</h3>
              <ul className="mt-1 space-y-1">
                {settings.primary_phone_href && (
                  <li>
                    <ContactLink kind="phone" href={settings.primary_phone_href} placement="contact" className="inline-flex min-h-9 items-center text-lg font-semibold text-navy underline">
                      {settings.primary_phone}
                    </ContactLink>
                  </li>
                )}
                {settings.secondary_phone_href && (
                  <li>
                    <ContactLink kind="phone" href={settings.secondary_phone_href} placement="contact" className="inline-flex min-h-9 items-center text-lg font-semibold text-navy underline">
                      {settings.secondary_phone}
                    </ContactLink>{" "}
                    <span className="text-sm text-slate">(alternative)</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          {wa && (
            <div className={cardClass}>
              <span className={`${iconClass} bg-[#1f7a43]`}>
                <WhatsAppIcon />
              </span>
              <div>
                <h3 className="font-semibold text-navy">WhatsApp</h3>
                <ContactLink kind="whatsapp" href={wa} placement="contact" className="inline-flex min-h-9 items-center text-lg font-semibold text-navy underline">
                  Message us on WhatsApp
                </ContactLink>
                <p className="text-sm text-slate">Opens WhatsApp with a draft message for you to review and send.</p>
              </div>
            </div>
          )}
          <div className={cardClass}>
            <span className={iconClass}>
              <MailIcon />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-navy">Email</h3>
              <ContactLink kind="email" href={mailtoHref(settings.email)} placement="contact" className="inline-flex min-h-9 items-center break-all text-lg font-semibold text-navy underline">
                {settings.email}
              </ContactLink>
            </div>
          </div>
          <div className={cardClass}>
            <span className={iconClass}>
              <PinIcon />
            </span>
            <div>
              <h3 className="font-semibold text-navy">Warehouse</h3>
              <address className="not-italic text-ink">{settings.address_line}</address>
              <p className="mt-1 text-sm text-slate">Serving {settings.regions_served}.</p>
            </div>
          </div>
          <div className={cardClass}>
            <span className={iconClass}>
              <ClockIcon />
            </span>
            <div>
              <h3 className="font-semibold text-navy">Hours</h3>
              <p className="text-ink">{settings.hours_text}</p>
            </div>
          </div>
        </section>
        <section aria-labelledby="contact-form">
          <h2 id="contact-form" className="font-display text-2xl font-bold text-navy">
            Send an enquiry
          </h2>
          <p className="mt-1 text-slate">
            For a multi-item quotation, use the{" "}
            <Link href="/quote" className="font-semibold text-navy underline">
              quote basket
            </Link>
            . For anything else, write to us here.
          </p>
          <div className="mt-5">
            {settings.contact_form_enabled ? (
              <EnquiryForm mode="contact" />
            ) : (
              <p className="rounded-xl border border-line bg-mist p-6">
                The online form is temporarily unavailable. Please call, email or WhatsApp us.
              </p>
            )}
          </div>
        </section>
      </Container>
    </>
  );
}
