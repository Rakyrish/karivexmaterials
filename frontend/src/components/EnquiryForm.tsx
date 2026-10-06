"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";

import { track } from "@/lib/analytics";

import { CheckIcon } from "./Icons";
import { useQuoteBasket } from "./QuoteBasket";

type Mode = "quote" | "contact" | "service";

interface Confirmation {
  reference_number: string;
  service_name_snapshot?: string;
  items: { product_name_snapshot: string; variant_label_snapshot: string; quantity: string; unit: string }[];
}

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "project_notes" | "items" | "service_slug" | "form", string>
>;

function newKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID().replace(/-/g, "");
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

function flatten(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join(" ");
  return "";
}

const fieldClass =
  "mt-1 block min-h-11 w-full rounded-md border border-line bg-white px-3 py-2 text-ink focus:border-navy focus:outline-none focus-visible:outline-navy aria-[invalid=true]:border-red-700";

export function EnquiryForm({ mode, serviceSlug }: { mode: Mode; serviceSlug?: string }) {
  const { items, ready, update, remove, clear } = useQuoteBasket();
  const id = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  // One key per request: retries and double-clicks reuse it, so the server
  // returns the original enquiry instead of creating a duplicate.
  const keyRef = useRef<string>("");
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  if (confirmation) {
    return (
      <div className="on-light rounded-xl border border-green-200 bg-green-50 p-6 sm:p-8" role="status" tabIndex={-1}>
        <p className="flex items-center gap-2 font-display text-2xl font-bold text-navy">
          <CheckIcon className="text-green-700" /> Request received
        </p>
        <p className="mt-3 text-ink">
          Your reference number is{" "}
          <strong className="font-mono text-lg text-navy">{confirmation.reference_number}</strong>. Please quote it if
          you contact us about this request.
        </p>
        {confirmation.service_name_snapshot && (
          <p className="mt-2 text-ink">
            Service requested: <strong>{confirmation.service_name_snapshot}</strong>
          </p>
        )}
        {confirmation.items.length > 0 && (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink">
            {confirmation.items.map((item, index) => (
              <li key={index}>
                {item.quantity} {item.unit} × {item.product_name_snapshot}
                {item.variant_label_snapshot ? ` (${item.variant_label_snapshot})` : ""}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-sm text-slate">
          Our sales team will review your request during business hours. For anything urgent, call or WhatsApp us.
        </p>
        <Link href="/products" className="mt-5 inline-flex min-h-11 items-center font-semibold text-navy underline">
          Continue browsing materials
        </Link>
      </div>
    );
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    const get = (name: string) => String(form.get(name) ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!get("name")) nextErrors.name = "Enter your name.";
    if (!get("email")) nextErrors.email = "Enter your email address so we can send the quotation.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) nextErrors.email = "Enter a valid email address.";
    if (mode === "quote" && items.length === 0) nextErrors.items = "Your quote basket is empty.";
    if (mode === "contact" && !get("project_notes")) nextErrors.project_notes = "Tell us what you need.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    if (!keyRef.current) keyRef.current = newKey();
    setSubmitting(true);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: mode,
          service_slug: mode === "service" ? serviceSlug : undefined,
          name: get("name"),
          company: get("company"),
          email: get("email"),
          phone: get("phone"),
          delivery_location: get("delivery_location"),
          project_notes: get("project_notes"),
          website: get("website"),
          idempotency_key: keyRef.current,
          items:
            mode === "quote"
              ? items.map((item) => ({
                  product_slug: item.slug,
                  variant_id: item.variantId,
                  quantity: item.quantity,
                  unit: item.unit,
                  notes: item.notes,
                }))
              : [],
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        track("generate_lead", { enquiry_type: mode, line_count: mode === "quote" ? items.length : 0 });
        if (mode === "quote") clear();
        keyRef.current = "";
        setConfirmation(data as Confirmation);
        window.scrollTo({ top: 0 });
        return;
      }
      if (response.status === 400 && data && typeof data === "object") {
        const fieldErrors: FieldErrors = {};
        for (const key of ["name", "email", "phone", "project_notes", "items", "service_slug"] as const) {
          if (key in data) fieldErrors[key] = flatten((data as Record<string, unknown>)[key]);
        }
        if ("detail" in data || "non_field_errors" in data) {
          fieldErrors.form = flatten((data as Record<string, unknown>).detail ?? (data as Record<string, unknown>).non_field_errors);
        }
        setErrors(Object.keys(fieldErrors).length ? fieldErrors : { form: "Please check the form and try again." });
      } else {
        setErrors({
          form:
            flatten((data as Record<string, unknown>).detail) ||
            "We could not send your request just now. Please try again, or contact us by phone, email or WhatsApp.",
        });
      }
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
    } catch {
      setErrors({
        form: "Network problem — your request was not confirmed. Please try again (it will not be duplicated), or contact us directly.",
      });
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
    } finally {
      setSubmitting(false);
    }
  };

  const errorList = Object.entries(errors).filter(([, message]) => message);

  return (
    <form onSubmit={onSubmit} noValidate className="on-light space-y-8" aria-describedby={`${id}-required`}>
      {mode === "quote" && (
        <section aria-labelledby={`${id}-basket`}>
          <h2 id={`${id}-basket`} className="font-display text-2xl font-bold text-navy">
            Items in your basket
          </h2>
          {!ready ? (
            <p className="mt-3 text-slate">Loading your basket…</p>
          ) : items.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-line bg-mist p-6">
              <p className="font-semibold text-navy">Your quote basket is empty.</p>
              <p className="mt-1 text-sm text-slate">
                Browse the catalogue and use “Add to quote basket” on each product you need.
              </p>
              <Link href="/products" className="mt-3 inline-flex min-h-11 items-center font-semibold text-navy underline">
                Browse products
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line rounded-xl border border-line bg-white">
              {items.map((item) => (
                <li key={item.key} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <p className="font-semibold text-navy">
                      <Link href={`/products/${item.slug}`} className="hover:underline">
                        {item.name}
                      </Link>
                    </p>
                    {item.variantLabel && <p className="text-sm text-slate">Option: {item.variantLabel}</p>}
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-[7rem_8rem_1fr]">
                      <label className="text-xs font-semibold text-navy">
                        Quantity
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          inputMode="decimal"
                          value={item.quantity}
                          onChange={(e) => update(item.key, { quantity: e.target.value })}
                          className={fieldClass}
                          aria-label={`Quantity for ${item.name}`}
                        />
                      </label>
                      <label className="text-xs font-semibold text-navy">
                        Unit
                        <input
                          type="text"
                          maxLength={60}
                          value={item.unit}
                          placeholder="e.g. rolls"
                          onChange={(e) => update(item.key, { unit: e.target.value })}
                          className={fieldClass}
                          aria-label={`Unit for ${item.name}`}
                        />
                      </label>
                      <label className="col-span-2 text-xs font-semibold text-navy sm:col-span-1">
                        Notes
                        <input
                          type="text"
                          maxLength={300}
                          value={item.notes}
                          placeholder="Size, thickness, grade…"
                          onChange={(e) => update(item.key, { notes: e.target.value })}
                          className={fieldClass}
                          aria-label={`Notes for ${item.name}`}
                        />
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.key)}
                    className="min-h-11 rounded-md border border-line px-3 text-sm font-semibold text-navy hover:bg-mist"
                    aria-label={`Remove ${item.name} from basket`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section aria-labelledby={`${id}-details`} className="rounded-xl border border-line bg-white p-5 sm:p-6">
        <h2 id={`${id}-details`} className="font-display text-2xl font-bold text-navy">
          Your details
        </h2>
        <p id={`${id}-required`} className="mt-1 text-sm text-slate">
          Fields marked <span aria-hidden="true">*</span>
          <span className="sr-only">required</span> are required. Everything else is optional.
        </p>

        {errorList.length > 0 && (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            role="alert"
            className="mt-4 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-900"
          >
            <p className="font-semibold">Please fix the following:</p>
            <ul className="mt-1 list-disc pl-5">
              {errorList.map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field id={`${id}-name`} name="name" label="Your name" required autoComplete="name" error={errors.name} />
          <Field id={`${id}-company`} name="company" label="Company" autoComplete="organization" />
          <Field
            id={`${id}-email`}
            name="email"
            type="email"
            label="Email"
            required
            autoComplete="email"
            error={errors.email}
          />
          <Field
            id={`${id}-phone`}
            name="phone"
            type="tel"
            label="Phone / WhatsApp"
            autoComplete="tel"
            placeholder="+254 7XX XXX XXX"
            error={errors.phone}
          />
          <div className="sm:col-span-2">
            <Field
              id={`${id}-location`}
              name="delivery_location"
              label={mode === "service" ? "Oven / site location" : "Delivery location"}
              placeholder="Town / site, county or country"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${id}-notes`} className="text-sm font-semibold text-navy">
              {mode === "quote" ? "Project notes" : mode === "service" ? "About your oven or project" : "How can we help?"}
              {mode === "contact" && <span aria-hidden="true"> *</span>}
            </label>
            <textarea
              id={`${id}-notes`}
              name="project_notes"
              rows={5}
              maxLength={5000}
              required={mode === "contact"}
              aria-invalid={errors.project_notes ? true : undefined}
              placeholder={
                mode === "quote"
                  ? "Oven size, drawings, timeline, or anything else that helps us quote accurately."
                  : mode === "service"
                    ? "Oven type and size, what you need done, site details and when you need it."
                    : "Products, specifications and quantities you are looking for."
              }
              className={`${fieldClass} py-2`}
            />
          </div>
          {/* Honeypot for bots; hidden from people and assistive technology. */}
          <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
        </div>

        <p className="mt-5 text-xs text-slate">
          We use these details only to respond to this request. See our{" "}
          <Link href="/privacy" className="font-semibold text-navy underline">
            privacy notice
          </Link>
          .
        </p>
        <button
          type="submit"
          disabled={submitting || (mode === "quote" && ready && items.length === 0)}
          aria-disabled={submitting || undefined}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-orange px-6 font-bold text-navy hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting
            ? "Sending…"
            : mode === "quote"
              ? "Send quotation request"
              : mode === "service"
                ? "Send service request"
                : "Send enquiry"}
        </button>
      </section>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  autoComplete,
  placeholder,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-navy">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        maxLength={type === "email" ? 254 : 200}
        className={fieldClass}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
