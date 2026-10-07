"use client";

import Link from "next/link";
import { useId, type ReactNode } from "react";

import { STATUS_LABELS, type Status } from "@/lib/manage";

export const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-ink shadow-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/15 disabled:bg-mist disabled:text-slate";

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="text-sm font-semibold text-slate hover:text-navy">
            ← {back.label}
          </Link>
        )}
        <h1 className="mt-1 font-display text-2xl font-extrabold text-navy sm:text-3xl">{title}</h1>
        {description && <div className="mt-1 max-w-3xl text-slate">{description}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, description, children, className = "" }: {
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {title && <h2 className="font-display text-lg font-bold text-navy">{title}</h2>}
      {description && <p className="mt-1 text-sm text-slate">{description}</p>}
      <div className={title || description ? "mt-4" : ""}>{children}</div>
    </section>
  );
}

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
const BUTTON: Record<ButtonVariant, string> = {
  primary: "bg-orange text-navy hover:bg-orange-600",
  secondary: "border border-line bg-white text-navy hover:border-navy",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  ghost: "text-navy hover:bg-mist",
};

export function buttonClass(variant: ButtonVariant = "primary") {
  return `inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON[variant]}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type="button" {...props} className={`${buttonClass(variant)} ${className}`} />;
}

export function Field({
  label,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  hint?: ReactNode;
  error?: string[];
  children: (id: string) => ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-navy">
        {label}
      </label>
      <div className="mt-1">{children(id)}</div>
      {hint && !error && <p className="mt-1 text-xs text-slate">{hint}</p>}
      {error && <p className="mt-1 text-xs font-semibold text-red-700">{error.join(" ")}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "published"
      ? "bg-emerald-100 text-emerald-800"
      : status === "draft"
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-200 text-slate-700";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${tone}`}>
      {STATUS_LABELS[status as Status] ?? status}
    </span>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success" | "warning"; children: ReactNode }) {
  const styles = {
    info: "border-navy/15 bg-mist text-navy",
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-10 text-slate" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-orange" aria-hidden="true" />
      {label}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border-2 border-dashed border-line bg-white p-10 text-center text-slate">{children}</div>;
}

/** External link to the public page, opened in a new tab. */
export function ViewOnSite({ path, label = "View on site" }: { path: string; label?: string }) {
  return (
    <a href={path} target="_blank" rel="noopener" className={buttonClass("secondary")}>
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}

export function EnquiryStatus({ status }: { status: string }) {
  if (["draft", "published", "archived"].includes(status)) return <StatusBadge status={status} />;
  const tone: Record<string, string> = {
    new: "bg-orange-50 text-orange-600",
    in_progress: "bg-sky-100 text-sky-800",
    quoted: "bg-violet-100 text-violet-800",
    closed: "bg-slate-200 text-slate-700",
  };
  return (
    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${tone[status] ?? "bg-mist"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
