"use client";

/** Last-resort error boundary (e.g. the root layout failed). Uses plain
 * markup because the app's layout and styles may be unavailable. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en-KE">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1.5rem", color: "#021533" }}>
        <h1>KariVex Industrial Materials is temporarily unavailable</h1>
        <p>Please try again shortly. Sales: +254 710 851911 · info@karivexsolutionsltd.com</p>
        <button type="button" onClick={reset} style={{ padding: "0.75rem 1.25rem", background: "#FC7701", border: 0, fontWeight: 700 }}>
          Try again
        </button>
      </body>
    </html>
  );
}
