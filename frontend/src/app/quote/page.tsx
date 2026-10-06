import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactLink } from "@/components/ContactLink";
import { EnquiryForm } from "@/components/EnquiryForm";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { Container, PageHero } from "@/components/Section";
import { SITE_ORIGIN } from "@/lib/config";
import { generalWhatsAppMessage, mailtoHref, whatsappHref } from "@/lib/contact";
import { loadSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a Quotation",
  description:
    "Send one quotation request for all the pizza oven materials in your basket, with quantities and delivery location.",
  path: "/quote",
  // The basket is personal and empty for crawlers — keep it out of search.
  index: false,
});

export default async function QuotePage() {
  const settings = await loadSettings();
  const wa = whatsappHref(settings, generalWhatsAppMessage(`${SITE_ORIGIN}/quote`));
  return (
    <>
      <PageHero
        title="Request a quotation"
        breadcrumbs={<Breadcrumbs items={[{ name: "Request a quotation", href: "/quote" }]} />}
      >
        <p>
          Review the items in your basket, adjust quantities and units, and send one request. Prices are quoted for
          your specification, quantity and delivery location — there is no online payment.
        </p>
      </PageHero>
      <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_20rem]">
        <div>
          {settings.contact_form_enabled ? (
            <EnquiryForm mode="quote" />
          ) : (
            <p className="rounded-xl border border-line bg-mist p-6 text-ink">
              Online quotation requests are temporarily unavailable. Please call, email or WhatsApp us.
            </p>
          )}
        </div>
        <aside className="h-fit space-y-3 rounded-xl bg-navy p-6 text-white">
          <h2 className="font-display text-xl font-bold">Prefer to call or message?</h2>
          <p className="text-sm text-white/80">{settings.hours_text}</p>
          {settings.primary_phone_href && (
            <ContactLink kind="phone" href={settings.primary_phone_href} placement="quote" className="flex min-h-11 items-center gap-2 font-semibold hover:text-orange">
              <PhoneIcon /> {settings.primary_phone}
            </ContactLink>
          )}
          {settings.secondary_phone_href && (
            <ContactLink kind="phone" href={settings.secondary_phone_href} placement="quote" className="flex min-h-11 items-center gap-2 font-semibold hover:text-orange">
              <PhoneIcon /> {settings.secondary_phone}
            </ContactLink>
          )}
          {wa && (
            <ContactLink kind="whatsapp" href={wa} placement="quote" className="flex min-h-11 items-center gap-2 font-semibold hover:text-orange">
              <WhatsAppIcon /> WhatsApp
            </ContactLink>
          )}
          <ContactLink kind="email" href={mailtoHref(settings.email, "Quotation request")} placement="quote" className="flex min-h-11 items-center gap-2 break-all font-semibold hover:text-orange">
            <MailIcon /> {settings.email}
          </ContactLink>
        </aside>
      </Container>
    </>
  );
}
