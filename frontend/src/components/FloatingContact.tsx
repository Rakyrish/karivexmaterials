import { SITE_ORIGIN } from "@/lib/config";
import { generalWhatsAppMessage, mailtoHref, whatsappHref } from "@/lib/contact";
import type { SiteSettings } from "@/lib/types";

import { ContactLink } from "./ContactLink";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

/** Always-visible call / WhatsApp / email buttons (bottom-right). */
export function FloatingContact({ settings }: { settings: SiteSettings }) {
  const wa = whatsappHref(settings, generalWhatsAppMessage(SITE_ORIGIN));
  const button =
    "group relative flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg ring-2 ring-white transition-transform hover:scale-105";
  const label =
    "pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-navy px-3 py-1.5 text-sm font-semibold text-white shadow group-hover:block group-focus-visible:block";
  return (
    <nav
      aria-label="Quick contact"
      className="fixed right-4 z-40 flex flex-col gap-3"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {wa && (
        <ContactLink kind="whatsapp" href={wa} placement="floating" ariaLabel="Chat with us on WhatsApp" className={`${button} bg-[#25D366] text-white`}>
          <WhatsAppIcon />
          <span className={label} aria-hidden="true">
            WhatsApp us
          </span>
        </ContactLink>
      )}
      {settings.primary_phone_href && (
        <ContactLink
          kind="phone"
          href={settings.primary_phone_href}
          placement="floating"
          ariaLabel={`Call ${settings.primary_phone}`}
          className={`${button} bg-orange text-navy`}
        >
          <PhoneIcon />
          <span className={label} aria-hidden="true">
            Call {settings.primary_phone}
          </span>
        </ContactLink>
      )}
      <ContactLink
        kind="email"
        href={mailtoHref(settings.email, "Pizza oven enquiry")}
        placement="floating"
        ariaLabel={`Email ${settings.email}`}
        className={`${button} bg-navy text-white`}
      >
        <MailIcon />
        <span className={label} aria-hidden="true">
          Email us
        </span>
      </ContactLink>
    </nav>
  );
}
