import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowRightIcon } from "./Icons";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function PageHero({
  eyebrow,
  title,
  children,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  breadcrumbs?: ReactNode;
}) {
  return (
    <div className="border-b border-line bg-mist">
      <Container className="py-8 sm:py-12">
        {breadcrumbs}
        {eyebrow && (
          <p className="mt-4 text-sm font-bold uppercase tracking-wider text-orange-600">
            <span className="text-navy">{eyebrow}</span>
          </p>
        )}
        <h1 className="mt-2 max-w-4xl font-display text-3xl font-extrabold text-navy sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {children && <div className="mt-4 max-w-3xl text-lg text-slate">{children}</div>}
      </Container>
    </div>
  );
}

export function SectionHeading({
  title,
  intro,
  href,
  linkLabel,
  id,
}: {
  title: string;
  intro?: string;
  href?: string;
  linkLabel?: string;
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span aria-hidden="true" className="block h-1 w-12 rounded bg-orange" />
        <h2 id={id} className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl">
          {title}
        </h2>
        {intro && <p className="mt-2 max-w-2xl text-slate">{intro}</p>}
      </div>
      {href && linkLabel && (
        <Link href={href} className="inline-flex items-center gap-1 font-semibold text-navy hover:underline">
          {linkLabel} <ArrowRightIcon />
        </Link>
      )}
    </div>
  );
}

export function CategoryBadge({ code }: { code: string }) {
  return (
    <svg viewBox="0 0 48 54" className="h-12 w-11 shrink-0" aria-hidden="true">
      <path d="M24 2 46 14.5v25L24 52 2 39.5v-25z" fill="#021533" />
      <path d="M24 2 2 14.5v25L24 52" fill="none" stroke="#fc7701" strokeWidth="4" />
      <text x="25" y="34" textAnchor="middle" fontSize="20" fontWeight="800" fill="#fefefe" fontFamily="var(--font-barlow), sans-serif">
        {code}
      </text>
    </svg>
  );
}
