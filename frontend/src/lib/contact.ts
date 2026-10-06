import type { SiteSettings } from "./types";

type WhatsAppSource = Pick<SiteSettings, "whatsapp_base_url">;

/** wa.me link with a prefilled message. Opening it never sends anything:
 * the visitor reviews and sends the message in WhatsApp themselves. */
export function whatsappHref(settings: WhatsAppSource, message?: string): string | null {
  if (!settings.whatsapp_base_url) return null;
  return message
    ? `${settings.whatsapp_base_url}?text=${encodeURIComponent(message)}`
    : settings.whatsapp_base_url;
}

export function productWhatsAppMessage(opts: {
  productName: string;
  variantLabel?: string;
  url: string;
}): string {
  const product = opts.variantLabel ? `${opts.productName} (${opts.variantLabel})` : opts.productName;
  return [
    `Hello KariVex Industrial Materials, I would like a quotation for ${product}.`,
    "Quantity: ",
    "Delivery location: ",
    "",
    opts.url,
  ].join("\n");
}

export function generalWhatsAppMessage(pageUrl: string): string {
  return `Hello KariVex Industrial Materials, I have an enquiry about your materials.\n\n${pageUrl}`;
}

export function mailtoHref(email: string, subject?: string): string {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}
