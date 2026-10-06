"use client";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { EditLink, ResourceList, Thumb } from "@/components/dashboard/ResourceList";
import { StatusBadge } from "@/components/dashboard/ui";

export default function ApplicationsPage() {
  const { can } = useDashboard();
  return (
    <ResourceList
      endpoint="applications"
      title="Uses"
      description="Where the products are used (e.g. home pizza ovens, commercial kitchens). Each has its own page."
      addLabel="Add use"
      canAdd={can("catalog.add_application")}
      columns={[
        { label: "Photo", render: (row) => <Thumb src={row.image} />, className: "w-20" },
        {
          label: "Name",
          render: (row) => (
            <EditLink endpoint="applications" row={row}>
              {String(row.name)}
            </EditLink>
          ),
        },
        { label: "Summary", render: (row) => <span className="text-slate">{String(row.summary ?? "")}</span> },
        { label: "Status", render: (row) => <StatusBadge status={String(row.status)} /> },
        {
          label: "",
          className: "text-right",
          render: (row) =>
            row.status === "published" ? (
              <a href={`/applications/${row.slug}`} target="_blank" rel="noopener" className="text-xs font-semibold text-slate hover:text-navy">
                View ↗
              </a>
            ) : null,
        },
      ]}
    />
  );
}
