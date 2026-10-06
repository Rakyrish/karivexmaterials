"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold text-navy">Something went wrong</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate">
        This page could not be loaded just now. Please try again. You can still reach our sales team by phone, email or
        WhatsApp using the details at the top and bottom of this page.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="min-h-11 rounded-md bg-orange px-5 font-bold text-navy hover:bg-orange-600"
        >
          Try again
        </button>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-md border border-navy px-5 font-bold text-navy">
          Go to the homepage
        </Link>
      </div>
    </div>
  );
}
