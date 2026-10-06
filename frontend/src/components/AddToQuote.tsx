"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { productWhatsAppMessage, whatsappHref, mailtoHref } from "@/lib/contact";
import type { Variant } from "@/lib/types";

import { ContactLink } from "./ContactLink";
import { CheckIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import { useQuoteBasket } from "./QuoteBasket";

export function AddToQuote({
  slug,
  name,
  url,
  variants,
  salesUnit,
  whatsappBaseUrl,
  phone,
  phoneHref,
  email,
}: {
  slug: string;
  name: string;
  url: string;
  variants: Variant[];
  salesUnit: string;
  whatsappBaseUrl: string | null;
  phone: string;
  phoneHref: string | null;
  email: string;
}) {
  const { add } = useQuoteBasket();
  const id = useId();
  const [variantId, setVariantId] = useState<string>(variants.length === 1 ? String(variants[0].id) : "");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState(salesUnit);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState("");

  const variant = variants.find((v) => String(v.id) === variantId);
  const effectiveUnit = unit || variant?.sales_unit_override || "";
  const wa = whatsappHref(
    { whatsapp_base_url: whatsappBaseUrl },
    productWhatsAppMessage({ productName: name, variantLabel: variant?.label, url }),
  );

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const qty = Number(quantity);
    if (variants.length > 1 && !variant) {
      setError("Choose an option first.");
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      setError("Enter a quantity greater than zero.");
      return;
    }
    setError("");
    add({
      slug,
      name,
      variantId: variant?.id ?? null,
      variantLabel: variant?.label ?? "",
      quantity: String(qty),
      unit: effectiveUnit,
      notes: notes.trim(),
    });
    setAdded(`${name}${variant ? ` (${variant.label})` : ""} added to your quote basket.`);
  };

  const fieldClass =
    "mt-1 block min-h-11 w-full rounded-md border border-line bg-white px-3 text-ink focus:border-navy focus:outline-none focus-visible:outline-navy";

  return (
    <div className="on-light rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-display text-xl font-bold text-navy">Request a quotation</h2>
      <p className="mt-1 text-sm text-slate">
        Prices depend on specification, quantity and delivery location. Add this item to your quote basket, then send
        one request for everything you need.
      </p>
      <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
        {variants.length > 1 && (
          <div>
            <label htmlFor={`${id}-variant`} className="text-sm font-semibold text-navy">
              Option <span className="text-slate">(required)</span>
            </label>
            <select
              id={`${id}-variant`}
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              className={fieldClass}
              aria-invalid={error.startsWith("Choose") || undefined}
            >
              <option value="">Select an option…</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        )}
        {variants.length === 1 && (
          <p className="text-sm">
            <span className="font-semibold text-navy">Option:</span> {variants[0].label}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${id}-qty`} className="text-sm font-semibold text-navy">
              Quantity
            </label>
            <input
              id={`${id}-qty`}
              type="number"
              inputMode="decimal"
              min="0.01"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={fieldClass}
              aria-invalid={error.startsWith("Enter") || undefined}
            />
          </div>
          <div>
            <label htmlFor={`${id}-unit`} className="text-sm font-semibold text-navy">
              Unit <span className="font-normal text-slate">(optional)</span>
            </label>
            <input
              id={`${id}-unit`}
              type="text"
              placeholder={variant?.sales_unit_override || "e.g. rolls, bags, m²"}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              maxLength={60}
              className={fieldClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-notes`} className="text-sm font-semibold text-navy">
            Specification notes <span className="font-normal text-slate">(optional)</span>
          </label>
          <input
            id={`${id}-notes`}
            type="text"
            maxLength={300}
            placeholder="e.g. thickness, size, grade"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={fieldClass}
          />
        </div>
        {error && (
          <p role="alert" className="text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="flex min-h-12 w-full items-center justify-center rounded-md bg-orange px-5 font-bold text-navy hover:bg-orange-600"
        >
          Add to quote basket
        </button>
        <div aria-live="polite">
          {added && (
            <p className="flex flex-wrap items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-900">
              <CheckIcon /> {added}
              <Link href="/quote" className="font-semibold text-navy underline">
                View basket and send request
              </Link>
            </p>
          )}
        </div>
      </form>

      <div className="mt-5 border-t border-line pt-5">
        <p className="text-sm font-semibold text-navy">Prefer to talk to us?</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {wa && (
            <ContactLink
              kind="whatsapp"
              href={wa}
              placement="product"
              productSlug={slug}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#1f7a43] px-3 font-semibold text-white hover:bg-[#17633a]"
            >
              <WhatsAppIcon /> WhatsApp
            </ContactLink>
          )}
          {phoneHref && (
            <ContactLink
              kind="phone"
              href={phoneHref}
              placement="product"
              productSlug={slug}
              ariaLabel={`Call ${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-navy px-3 font-semibold text-navy hover:bg-mist"
            >
              <PhoneIcon /> Call
            </ContactLink>
          )}
          <ContactLink
            kind="email"
            href={mailtoHref(email, `Quotation request: ${name}${variant ? ` (${variant.label})` : ""}`)}
            placement="product"
            productSlug={slug}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-navy px-3 font-semibold text-navy hover:bg-mist"
          >
            <MailIcon /> Email
          </ContactLink>
        </div>
        <p className="mt-2 text-xs text-slate">
          WhatsApp opens with a prefilled message including this product{variant ? " and option" : ""} and page link — you
          review and send it yourself.
        </p>
      </div>
    </div>
  );
}
