"use client";

/** Privacy-safe analytics events. Only product identifiers and event
 * context are sent — never names, emails, phone numbers, message text or
 * URLs containing them. Events are dropped unless the visitor has
 * accepted analytics and a measurement ID is configured. */

type EventName =
  | "generate_lead"
  | "add_to_quote"
  | "remove_from_quote"
  | "click_whatsapp"
  | "click_phone"
  | "click_email";

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: EventName, params: Params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const safe: Params = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    safe[key] = typeof value === "string" ? value.slice(0, 100) : value;
  }
  window.gtag("event", event, safe);
}

export const CONSENT_KEY = "kv-analytics-consent";
