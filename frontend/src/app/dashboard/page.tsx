"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Card, EnquiryStatus, Notice, PageHeader, Spinner, buttonClass } from "@/components/dashboard/ui";
import { api, formatDate } from "@/lib/manage";

type Counts = Record<"draft" | "published" | "archived", number>;

interface Overview {
  products?: Counts;
  products_without_photos?: number;
  services?: Counts;
  categories?: Counts;
  testimonials?: Counts;
  enquiries_new?: number;
  enquiries_failed_email?: number;
  recent_enquiries?: { id: number; reference_number: string; name: string; kind: string; status: string; created_at: string }[];
}

function Stat({ label, counts, href }: { label: string; counts: Counts; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-navy hover:shadow-md">
      <p className="text-sm font-semibold text-slate">{label}</p>
      <p className="mt-1 font-display text-3xl font-extrabold text-navy">{counts.published}</p>
      <p className="text-xs text-slate">
        live · {counts.draft} draft · {counts.archived} hidden
      </p>
    </Link>
  );
}

export default function DashboardHome() {
  const { session, can } = useDashboard();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Overview>("overview").then(setData, (err: Error) => setError(err.message));
  }, []);

  const firstName = session?.user?.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title={`Welcome${firstName ? `, ${firstName}` : ""}`}
        description="Manage what appears on materials.karivexsolutionsltd.com. Changes you save go live within seconds."
        actions={
          <>
            <Link href="/dashboard/preview" className={buttonClass("secondary")}>
              View the site
            </Link>
            {can("catalog.add_product") && (
              <Link href="/dashboard/products/new" className={buttonClass()}>
                + Add product
              </Link>
            )}
          </>
        }
      />
      {error && <Notice tone="error">{error}</Notice>}
      {!data && !error && <Spinner />}
      {data && (
        <div className="space-y-6">
          {(data.enquiries_failed_email ?? 0) > 0 && (
            <Notice tone="warning">
              {data.enquiries_failed_email} enquiry email notification(s) failed to send. The enquiries are saved —{" "}
              <Link href="/dashboard/enquiries" className="font-semibold underline">
                review them here
              </Link>
              .
            </Notice>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.products && <Stat label="Products" counts={data.products} href="/dashboard/products" />}
            {data.services && <Stat label="Services" counts={data.services} href="/dashboard/services" />}
            {data.categories && <Stat label="Categories" counts={data.categories} href="/dashboard/categories" />}
            {data.testimonials && <Stat label="Testimonials" counts={data.testimonials} href="/dashboard/testimonials" />}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Quick tasks">
              <ul className="space-y-2 text-sm">
                {can("catalog.add_product") && <QuickLink href="/dashboard/products/new" text="Add a new product" />}
                {can("catalog.change_productimage") && <QuickLink href="/dashboard/products" text="Upload or change product photos" />}
                {can("catalog.change_service") && <QuickLink href="/dashboard/services" text="Edit services and their photos" />}
                {can("sitesettings.change_sitesettings") && (
                  <QuickLink href="/dashboard/settings" text="Change phone numbers, email, hours or the homepage headline" />
                )}
                {can("catalog.add_testimonial") && <QuickLink href="/dashboard/testimonials/new" text="Add a customer testimonial" />}
                <QuickLink href="/dashboard/preview" text="Preview the website on desktop or mobile" />
              </ul>
              {(data.products_without_photos ?? 0) > 0 && (
                <p className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-navy">
                  {data.products_without_photos} live product(s) have no uploaded photo yet and show a built-in picture.
                </p>
              )}
            </Card>

            {data.recent_enquiries && (
              <Card title={`Latest enquiries${data.enquiries_new ? ` · ${data.enquiries_new} new` : ""}`}>
                {data.recent_enquiries.length === 0 ? (
                  <p className="text-sm text-slate">No enquiries yet.</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {data.recent_enquiries.map((e) => (
                      <li key={e.id}>
                        <Link href={`/dashboard/enquiries/${e.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-orange-600">
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-navy">{e.name}</span>
                            <span className="text-xs text-slate">
                              {e.reference_number} · {formatDate(e.created_at)}
                            </span>
                          </span>
                          <EnquiryStatus status={e.status} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function QuickLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <Link href={href} className="font-semibold text-navy hover:text-orange-600 hover:underline">
        {text} →
      </Link>
    </li>
  );
}
