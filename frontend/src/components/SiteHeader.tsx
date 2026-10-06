import Image from "next/image";
import Link from "next/link";

import mark from "../../public/brand/karivex-mark.png";
import { generalWhatsAppMessage, mailtoHref, whatsappHref } from "@/lib/contact";
import { SITE_ORIGIN } from "@/lib/config";
import type { SiteSettings } from "@/lib/types";

import { BasketLink } from "./BasketLink";
import { ContactLink } from "./ContactLink";
import { ClockIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import { MobileMenu } from "./MobileMenu";

export const NAV_LINKS = [
  { href: "/products", label: "Oven Materials" },
  { href: "/categories/roof-cyclones", label: "Roof Cyclones" },
  { href: "/services", label: "Services" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const wa = whatsappHref(settings, generalWhatsAppMessage(SITE_ORIGIN));
  return (
    <header className="sticky top-0 z-40 shadow-[0_1px_0_var(--color-line)]">
      <div className="bg-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm sm:px-6">
          <p className="hidden shrink-0 text-white/85 md:block">{settings.relationship_wording}</p>
          <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 sm:gap-x-5">
            {settings.primary_phone_href && (
              <li>
                <ContactLink
                  kind="phone"
                  href={settings.primary_phone_href}
                  placement="topbar"
                  className="inline-flex min-h-8 items-center gap-1.5 hover:text-orange"
                >
                  <PhoneIcon /> {settings.primary_phone}
                </ContactLink>
              </li>
            )}
            <li className="hidden lg:block">
              <ContactLink
                kind="email"
                href={mailtoHref(settings.email)}
                placement="topbar"
                className="inline-flex min-h-8 items-center gap-1.5 hover:text-orange"
              >
                <MailIcon /> {settings.email}
              </ContactLink>
            </li>
            {wa && (
              <li>
                <ContactLink
                  kind="whatsapp"
                  href={wa}
                  placement="topbar"
                  className="inline-flex min-h-8 items-center gap-1.5 hover:text-orange"
                >
                  <WhatsAppIcon /> WhatsApp
                </ContactLink>
              </li>
            )}
            <li className="hidden items-center gap-1.5 text-white/80 xl:inline-flex">
              <ClockIcon /> {settings.hours_text}
            </li>
          </ul>
        </div>
      </div>

      <div className="on-light bg-paper">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:px-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 sm:gap-3 xl:shrink-0"
            aria-label={`${settings.site_name} — home`}
          >
            {settings.logo_header_override ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logo_header_override} alt="" className="h-10 w-auto sm:h-11 lg:h-12" />
            ) : (
              <Image
                src={mark}
                alt=""
                className="h-10 w-auto shrink-0 sm:h-11 lg:h-12"
                preload
                sizes="(min-width: 1024px) 48px, 44px"
              />
            )}
            <span className="flex min-w-0 flex-col border-l-2 border-orange pl-2 sm:pl-3">
              <span className="font-display text-sm font-bold leading-snug text-navy sm:text-base lg:text-lg xl:whitespace-nowrap">
                {settings.site_name}
              </span>
              <span className="text-[0.65rem] font-semibold uppercase tracking-wider leading-tight text-slate sm:text-xs xl:whitespace-nowrap">
                {settings.division_descriptor}
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="ml-auto hidden shrink-0 xl:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-semibold text-navy hover:bg-mist hover:text-navy-700 xl:px-3 xl:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-2">
            <BasketLink />
            <MobileMenu links={NAV_LINKS} />
          </div>
        </div>
      </div>
    </header>
  );
}
