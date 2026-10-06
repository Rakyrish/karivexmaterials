"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { CloseIcon, MenuIcon, SearchIcon } from "./Icons";

export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when navigating.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line text-2xl text-navy"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-line bg-paper px-4 pb-6 pt-4 shadow-lg"
      >
        <form action="/products" role="search" className="mb-4">
          <label htmlFor="mobile-search" className="sr-only">
            Search materials
          </label>
          <div className="flex items-center rounded-md border border-line bg-white">
            <input
              id="mobile-search"
              name="q"
              type="search"
              placeholder="Search materials, e.g. ceramic fibre"
              className="min-h-11 w-full bg-transparent px-3 outline-none"
            />
            <button type="submit" className="min-h-11 px-3 text-navy" aria-label="Search">
              <SearchIcon />
            </button>
          </div>
        </form>
        <nav aria-label="Mobile">
          <ul className="divide-y divide-line">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="flex min-h-12 items-center text-lg font-semibold text-navy"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/quote" className="flex min-h-12 items-center text-lg font-semibold text-navy">
                Request a quote
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
