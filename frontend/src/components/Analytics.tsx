"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

import { CONSENT_KEY } from "@/lib/analytics";

type Consent = "granted" | "denied" | null;

/** Google Analytics 4, loaded only when a measurement ID is configured in
 * Site settings AND the visitor accepts. GA4's own page_view (including
 * history-change page views from enhanced measurement) is the only page
 * view source — no manual page_view events are sent. */
export function Analytics({ measurementId }: { measurementId: string }) {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: Consent = null;
    try {
      const value = window.localStorage.getItem(CONSENT_KEY);
      stored = value === "granted" || value === "denied" ? value : null;
    } catch {
      /* storage blocked: ask each visit */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored);
    setReady(true);
  }, []);

  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return null;

  const choose = (value: Exclude<Consent, null>) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    setConsent(value);
  };

  return (
    <>
      {consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {ready && consent === null && (
        <div
          role="region"
          aria-label="Analytics consent"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-xl border border-line bg-white p-4 shadow-xl sm:p-5"
        >
          <p className="text-sm text-ink">
            We would like to use Google Analytics to understand which pages and products are useful. It is off
            unless you accept. See our{" "}
            <Link href="/privacy" className="font-semibold text-navy underline">
              privacy notice
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => choose("granted")}
              className="min-h-11 rounded-md bg-orange px-4 font-semibold text-navy hover:bg-orange-600"
            >
              Accept analytics
            </button>
            <button
              type="button"
              onClick={() => choose("denied")}
              className="min-h-11 rounded-md border border-navy px-4 font-semibold text-navy hover:bg-mist"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
