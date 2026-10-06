"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import mark from "../../../public/brand/karivex-mark.png";
import { useDashboard } from "./DashboardProvider";
import { Spinner } from "./ui";

const NAV: { href: string; label: string; permission?: string; icon: string }[] = [
  { href: "/dashboard", label: "Overview", icon: "M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10" },
  { href: "/dashboard/preview", label: "View the site", icon: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10-3a3 3 0 100 6 3 3 0 000-6z" },
  { href: "/dashboard/products", label: "Products", permission: "catalog.view_product", icon: "M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7M12 11v10" },
  { href: "/dashboard/categories", label: "Categories", permission: "catalog.view_category", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/dashboard/services", label: "Services", permission: "catalog.view_service", icon: "M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" },
  { href: "/dashboard/applications", label: "Uses", permission: "catalog.view_application", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/dashboard/testimonials", label: "Testimonials", permission: "catalog.view_testimonial", icon: "M4 5h16v11H8l-4 4z" },
  { href: "/dashboard/enquiries", label: "Enquiries", permission: "enquiries.view_enquiry", icon: "M3 6h18v12H3zM3 6l9 7 9-7" },
  { href: "/dashboard/settings", label: "Site settings", permission: "sitesettings.view_sitesettings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.8 1.2V21a2 2 0 11-4 0v-.1A1.7 1.7 0 006.2 19.6l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.7 1.7 0 002.2 14H2a2 2 0 110-4h.1A1.7 1.7 0 003.4 7.2l-.1-.1a2 2 0 112.8-2.8l.1.1A1.7 1.7 0 009 3.1V3a2 2 0 114 0v.1a1.7 1.7 0 002.8 1.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { session, can, signOut } = useDashboard();
  const pathname = usePathname();
  // The mobile menu is open for the page it was opened on; navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean | ((v: boolean) => boolean)) =>
    setOpenOn((typeof value === "function" ? value(open) : value) ? pathname : null);

  if (pathname === "/dashboard/login") return <>{children}</>;
  if (!session?.authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist">
        <Spinner label="Checking your sign-in…" />
      </div>
    );
  }

  const items = NAV.filter((item) => !item.permission || can(item.permission));
  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-mist">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-navy px-4 py-3 text-white lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-display font-bold">
          <Image src={mark} alt="" className="h-8 w-auto" /> Dashboard
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="dashboard-nav"
          className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-semibold"
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <aside
        id="dashboard-nav"
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-col bg-navy text-white lg:flex ${open ? "flex" : "hidden"}`}
      >
        <Link href="/dashboard" className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <Image src={mark} alt="" className="h-10 w-auto" />
          <span className="leading-tight">
            <span className="block font-display font-bold">KariVex Materials</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-orange">Website dashboard</span>
          </span>
        </Link>
        <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive(item.href) ? "bg-orange text-navy" : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <NavIcon d={item.icon} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-white/10 pt-4">
            <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white">
              Open the website <span aria-hidden="true">↗</span>
            </a>
            <a href="/admin/" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white">
              Advanced admin <span aria-hidden="true">↗</span>
            </a>
          </div>
        </nav>
        <div className="border-t border-white/10 px-5 py-4 text-sm">
          <p className="font-semibold">{session.user?.name}</p>
          <p className="text-xs text-white/60">{session.user?.is_superuser ? "Owner" : session.user?.groups.join(", ") || "Staff"}</p>
          <button type="button" onClick={() => void signOut()} className="mt-3 font-semibold text-orange hover:underline">
            Sign out
          </button>
        </div>
      </aside>
      {open && <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 bg-navy/40 lg:hidden" onClick={() => setOpen(false)} />}

      <main id="main" className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
