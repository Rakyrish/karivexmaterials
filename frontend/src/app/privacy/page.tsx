import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container, PageHero } from "@/components/Section";
import { loadSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Notice",
  description:
    "How KariVex Industrial Materials handles the information you send through quotation and contact forms, the quote basket and optional analytics.",
  path: "/privacy",
});

const UPDATED = "6 October 2026";

export default async function PrivacyPage() {
  const settings = await loadSettings();
  const h2 = "pt-6 font-display text-2xl font-bold text-navy";
  return (
    <>
      <PageHero title="Privacy notice" breadcrumbs={<Breadcrumbs items={[{ name: "Privacy notice", href: "/privacy" }]} />}>
        <p>
          This notice explains how {settings.parent_company_name} handles information collected through this website,{" "}
          {settings.site_name}. Last updated {UPDATED}.
        </p>
      </PageHero>
      <Container className="py-10">
        <div className="max-w-3xl space-y-4 text-ink">
          <h2 className={h2}>Who is responsible</h2>
          <p>
            This website is operated by {settings.parent_company_name} for its {settings.division_descriptor}. Contact:{" "}
            <a href={`mailto:${settings.email}`} className="font-semibold text-navy underline">
              {settings.email}
            </a>
            , {settings.primary_phone}, {settings.address_line}.
          </p>

          <h2 className={h2}>What we collect and why</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Quotation, service request and contact forms:</strong> your name, email address and any optional details you give
              (company, phone, delivery location, project notes) and the products, options, quantities and notes in your
              request. We use these only to respond to your enquiry, prepare quotations and follow up on that request.
            </li>
            <li>
              <strong>Email notification:</strong> when you submit a form, its contents are emailed to our sales inbox so
              staff can respond. Your email address is set as the reply-to address.
            </li>
            <li>
              <strong>Security and abuse prevention:</strong> your IP address is used briefly to limit repeated form
              submissions, and our hosting provider keeps standard server logs.
            </li>
          </ul>

          <h2 className={h2}>Information stored in your browser</h2>
          <p>
            Your quote basket and your analytics choice are stored in your own browser (local storage) so they survive
            page reloads. They are not sent to us until you submit a form. You can clear them at any time by clearing
            this site&apos;s data in your browser.
          </p>

          <h2 className={h2}>Analytics</h2>
          <p>
            If analytics is enabled on this site, Google Analytics is loaded only after you choose “Accept analytics”.
            It records which pages are visited and anonymous actions such as adding a product to the quote basket or
            clicking a call, email or WhatsApp button. We do not send your name, email address, phone number or message
            text to analytics. If you decline, analytics is not loaded.
          </p>

          <h2 className={h2}>WhatsApp, phone and email links</h2>
          <p>
            WhatsApp buttons open WhatsApp with a draft message that you can edit before sending; nothing is sent
            automatically. Messages you send through WhatsApp or your own email service are also handled under those
            services&apos; own terms.
          </p>

          <h2 className={h2}>Who can see your information</h2>
          <p>
            Enquiries are stored in this website&apos;s database and are accessible only to authorised{" "}
            {settings.parent_company_name} staff through a password-protected administration area. We do not sell
            your information.
          </p>

          <h2 className={h2}>How long we keep it</h2>
          <p>
            We keep enquiries for as long as needed to respond, prepare and follow up quotations, and keep related
            business records. You can ask us to delete an enquiry that is no longer needed.
          </p>

          <h2 className={h2}>Your choices</h2>
          <p>
            You can ask to see, correct or delete the information you have sent us by contacting{" "}
            <a href={`mailto:${settings.email}`} className="font-semibold text-navy underline">
              {settings.email}
            </a>
            . Please include your enquiry reference number if you have one.
          </p>
        </div>
      </Container>
    </>
  );
}
