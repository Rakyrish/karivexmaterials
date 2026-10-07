"use client";

import { useRef, useState } from "react";

import { PageHeader, buttonClass, inputClass } from "@/components/dashboard/ui";

const PAGES: [string, string][] = [
  ["/", "Homepage"],
  ["/products", "Products"],
  ["/categories", "Categories"],
  ["/services", "Services"],
  ["/guides", "Guides"],
  ["/pizza-oven-guide", "Pizza oven guide"],
  ["/roof-cyclone-guide", "Roof cyclone guide"],
  ["/faq", "FAQ"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/quote", "Quote basket"],
];

const DEVICES = [
  { key: "desktop", label: "Desktop", width: "100%" },
  { key: "tablet", label: "Tablet", width: "820px" },
  { key: "mobile", label: "Phone", width: "390px" },
] as const;

/** Browse the live public site inside the dashboard at different screen sizes. */
export default function PreviewPage() {
  const [path, setPath] = useState("/");
  const [typed, setTyped] = useState("/");
  const [device, setDevice] = useState<(typeof DEVICES)[number]["key"]>("desktop");
  const [nonce, setNonce] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);
  const width = DEVICES.find((d) => d.key === device)!.width;

  function go(next: string) {
    const clean = next.startsWith("/") ? next : `/${next}`;
    // Only pages of this website, never the dashboard itself.
    if (clean.startsWith("/dashboard") || clean.startsWith("//")) return;
    setPath(clean);
    setTyped(clean);
  }

  return (
    <>
      <PageHeader
        title="View the site"
        description="Browse the live website as visitors see it. Draft and hidden items don't appear here."
        actions={
          <a href={path} target="_blank" rel="noopener" className={buttonClass("secondary")}>
            Open in new tab ↗
          </a>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select aria-label="Page" className={`${inputClass} max-w-[14rem]`} value={PAGES.some(([p]) => p === path) ? path : ""} onChange={(e) => e.target.value && go(e.target.value)}>
          <option value="">Other page…</option>
          {PAGES.map(([p, label]) => (
            <option key={p} value={p}>
              {label}
            </option>
          ))}
        </select>
        <form
          className="flex min-w-[14rem] flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            go(typed.trim() || "/");
          }}
        >
          <input aria-label="Page address" className={`${inputClass} font-mono text-sm`} value={typed} onChange={(e) => setTyped(e.target.value)} />
          <button type="submit" className={buttonClass("secondary")}>
            Go
          </button>
        </form>
        <div className="flex rounded-lg border border-line bg-white p-1" role="group" aria-label="Screen size">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              type="button"
              aria-pressed={device === d.key}
              onClick={() => setDevice(d.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold ${device === d.key ? "bg-navy text-white" : "text-slate hover:bg-mist"}`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <button type="button" className={buttonClass("ghost")} onClick={() => setNonce((n) => n + 1)}>
          Reload
        </button>
      </div>
      <div className="flex justify-center overflow-x-auto rounded-2xl border border-line bg-slate-200 p-3">
        <iframe
          key={`${path}-${nonce}`}
          ref={frame}
          title="Website preview"
          src={path}
          style={{ width, maxWidth: "100%" }}
          className="h-[78vh] rounded-xl border border-line bg-white shadow-lg transition-[width]"
          onLoad={() => {
            // Keep the address box in step when someone clicks links inside the preview.
            try {
              const loc = frame.current?.contentWindow?.location;
              if (loc && loc.pathname !== path && !loc.pathname.startsWith("/dashboard")) setTyped(loc.pathname + loc.search);
            } catch {
              /* cross-origin: ignore */
            }
          }}
        />
      </div>
    </>
  );
}
