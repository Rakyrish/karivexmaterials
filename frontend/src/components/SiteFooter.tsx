import Image from "next/image";
import Link from "next/link";

import logo from "../../public/brand/karivex-logo.png";
import { generalWhatsAppMessage, mailtoHref, whatsappHref } from "@/lib/contact";
import { SITE_ORIGIN } from "@/lib/config";
import type { Category, ServiceRef, SiteSettings } from "@/lib/types";

import { ContactLink } from "./ContactLink";
import { ClockIcon, ExternalIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";

export function SiteFooter({
  settings,
  categories,
  services,
}: {
  settings: SiteSettings;
  categories: Category[];
  services: ServiceRef[];
}) {
  const wa = whatsappHref(settings, generalWhatsAppMessage(SITE_ORIGIN));
  const year = new Date().getFullYear();
  return (
    <footer className="hex-texture mt-20 bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-block rounded-lg bg-white p-3">
            <Image src={logo} alt="KariVex — Strength Behind Every Project" className="h-28 w-auto" sizes="112px" />
          </div>
          <p className="mt-4 font-display text-lg font-bold">{settings.site_name}</p>
          <p className="text-sm text-white/80">
            {settings.division_descriptor} · {settings.relationship_wording}
          </p>
        </div>

        <nav aria-label="Materials and services">
          <h2 className="font-display text-base font-bold uppercase tracking-wider text-orange">Products</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/categories/${category.slug}`} className="text-white/85 hover:text-white hover:underline">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="mt-6 font-display text-base font-bold uppercase tracking-wider text-orange">Services</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className="text-white/85 hover:text-white hover:underline">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer">
          <h2 className="font-display text-base font-bold uppercase tracking-wider text-orange">Company</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/products", "All oven materials"],
              ["/pizza-oven-guide", "Pizza oven guide"],
              ["/roof-cyclone-guide", "Roof cyclone guide"],
              ["/applications", "Oven projects"],
              ["/quote", "Request a quote"],
              ["/about", "About the division"],
              ["/contact", "Contact"],
              ["/privacy", "Privacy notice"],
              ["/image-credits", "Image credits"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-white/85 hover:text-white hover:underline">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={settings.chemical_division_url}
                className="inline-flex items-center gap-1 text-white/85 hover:text-white hover:underline"
              >
                {settings.chemical_division_name} <ExternalIcon className="text-xs" />
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-base font-bold uppercase tracking-wider text-orange">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {settings.primary_phone_href && (
              <li>
                <ContactLink kind="phone" href={settings.primary_phone_href} placement="footer" className="inline-flex items-center gap-2 hover:underline">
                  <PhoneIcon /> {settings.primary_phone}
                </ContactLink>
              </li>
            )}
            {settings.secondary_phone_href && (
              <li>
                <ContactLink kind="phone" href={settings.secondary_phone_href} placement="footer" className="inline-flex items-center gap-2 hover:underline">
                  <PhoneIcon /> {settings.secondary_phone}
                </ContactLink>
              </li>
            )}
            {wa && (
              <li>
                <ContactLink kind="whatsapp" href={wa} placement="footer" className="inline-flex items-center gap-2 hover:underline">
                  <WhatsAppIcon /> WhatsApp {settings.primary_phone}
                </ContactLink>
              </li>
            )}
            <li>
              <ContactLink kind="email" href={mailtoHref(settings.email)} placement="footer" className="inline-flex items-center gap-2 break-all hover:underline">
                <MailIcon /> {settings.email}
              </ContactLink>
            </li>
            <li className="flex gap-2 text-white/85">
              <PinIcon className="mt-0.5 shrink-0" /> <span>{settings.address_line}</span>
            </li>
            <li className="flex gap-2 text-white/85">
              <ClockIcon className="mt-0.5 shrink-0" /> <span>{settings.hours_text}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/70 sm:flex-row sm:justify-between sm:px-6">
          <p>
            © {year} {settings.parent_company_name}. {settings.site_name} is the {settings.division_descriptor.toLowerCase()} of{" "}
            {settings.parent_company_name}.
          </p>
          <p>Serving {settings.regions_served}.</p>
        </div>
      </div>
    </footer>
  );
}
