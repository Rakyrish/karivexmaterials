"use client";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { EditLink, ResourceList } from "@/components/dashboard/ResourceList";
import { StatusBadge } from "@/components/dashboard/ui";

export default function TestimonialsPage() {
  const { can } = useDashboard();
  return (
    <ResourceList
      endpoint="testimonials"
      title="Testimonials"
      description="Real customer feedback. Only published entries with the customer's permission appear on the site; placeholders are examples and can't be published."
      addLabel="Add testimonial"
      canAdd={can("catalog.add_testimonial")}
      columns={[
        {
          label: "Customer",
          render: (row) => (
            <>
              <EditLink endpoint="testimonials" row={row}>
                {String(row.customer_name)}
              </EditLink>
              {row.is_placeholder ? <span className="ml-2 rounded bg-mist px-1.5 py-0.5 text-[0.65rem] font-bold uppercase text-slate">Placeholder</span> : null}
            </>
          ),
        },
        { label: "Quote", render: (row) => <span className="line-clamp-2 text-slate">{String(row.quote)}</span> },
        { label: "Rating", render: (row) => (row.rating ? `${row.rating} / 5` : "—") },
        { label: "Consent", render: (row) => (row.consent_confirmed ? "Yes" : <span className="text-slate">No</span>) },
        { label: "Status", render: (row) => <StatusBadge status={String(row.status)} /> },
      ]}
    />
  );
}
