"use client";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { EditLink, ResourceList, Thumb } from "@/components/dashboard/ResourceList";
import { StatusBadge } from "@/components/dashboard/ui";

export default function ServicesPage() {
  const { can } = useDashboard();
  return (
    <ResourceList
      endpoint="services"
      title="Services"
      description="Services you offer, e.g. oven building, repairs, cyclone installation."
      addLabel="Add service"
      canAdd={can("catalog.add_service")}
      columns={[
        { label: "Photo", render: (row) => <Thumb src={row.image} />, className: "w-20" },
        {
          label: "Name",
          render: (row) => (
            <EditLink endpoint="services" row={row}>
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
              <a href={`/services/${row.slug}`} target="_blank" rel="noopener" className="text-xs font-semibold text-slate hover:text-navy">
                View ↗
              </a>
            ) : null,
        },
      ]}
    />
  );
}
