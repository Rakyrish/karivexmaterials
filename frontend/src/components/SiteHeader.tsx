import Image from "next/image";
import Link from "next/link";

import logo from "../../public/brand/karivex-logo.png";
import mark from "../../public/brand/karivex-mark.png";
import { generalWhatsAppMessage, mailtoHref, whatsappHref } from "@/lib/contact";
import { SITE_ORIGIN } from "@/lib/config";
import type { SiteSettings } from "@/lib/types";

import { BasketLink } from "./BasketLink";
import { ContactLink } from "./ContactLink";
import { ClockIcon, MailIcon, PhoneIcon, SearchIcon, WhatsAppIcon } from "./Icons";
import { MobileMenu } from "./MobileMenu";

export const NAV_LINKS = [
  { href: "/products", label: "Oven Materials" },
  { href: "/services", label: "Services" },
  { href: "/pizza-oven-guide", label: "Oven Guide" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const wa = whatsappHref(settings, generalWhatsAppMessage(SITE_ORIGIN));
  return (
    <header className="sticky top-0 z-40 shadow-[0_1px_0_var(--color-line)]">
      <div className="bg-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm sm:px-6">
          <p className="hidden text-white/85 md:block">{settings.relationship_wording}</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
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
            <li className="hidden sm:block">
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
            <li className="hidden items-center gap-1.5 text-white/80 lg:inline-flex">
              <ClockIcon /> {settings.hours_text}
            </li>
          </ul>
        </div>
      </div>

      <div className="on-light bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/90">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label={`${settings.site_name} — home`}>
            {settings.logo_header_override ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logo_header_override} alt="" className="h-14 w-auto lg:h-[76px]" />
            ) : (
              <>
                <Image src={mark} alt="" className="h-10 w-auto shrink-0 sm:h-11 lg:hidden" preload sizes="40px" />
                <Image src={logo} alt="" className="hidden h-[76px] w-auto lg:block" preload sizes="76px" />
              </>
            )}
            <span className="flex min-w-0 flex-col border-l-2 border-orange pl-2 leading-tight sm:pl-3">
              <span className="font-display text-[0.95rem] font-bold text-navy sm:text-lg lg:whitespace-nowrap">
                {settings.site_name}
              </span>
              <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate sm:text-xs lg:whitespace-nowrap">
                {settings.division_descriptor}
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="whitespace-nowrap rounded-md px-3 py-2 font-semibold text-navy hover:bg-mist hover:text-navy-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <form action="/products" role="search" className="ml-2 hidden 2xl:block">
            <label htmlFor="header-search" className="sr-only">
              Search materials
            </label>
            <div className="flex items-center rounded-md border border-line bg-white focus-within:border-navy">
              <input
                id="header-search"
                name="q"
                type="search"
                placeholder="Search materials"
                className="w-44 bg-transparent px-3 py-2 text-sm outline-none"
              />
              <button type="submit" className="px-3 py-2 text-navy" aria-label="Search">
                <SearchIcon />
              </button>
            </div>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-2">
            <BasketLink />
            <MobileMenu links={NAV_LINKS} />
          </div>
        </div>
      </div>
    </header>
  );
}
