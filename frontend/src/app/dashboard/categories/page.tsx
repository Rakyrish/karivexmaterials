"use client";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { EditLink, ResourceList, Thumb } from "@/components/dashboard/ResourceList";
import { StatusBadge } from "@/components/dashboard/ui";

export default function CategoriesPage() {
  const { can } = useDashboard();
  return (
    <ResourceList
      endpoint="categories"
      title="Categories"
      description="Groups of products shown on the site, e.g. Fire bricks or Roof cyclones."
      addLabel="Add category"
      canAdd={can("catalog.add_category")}
      columns={[
        { label: "Photo", render: (row) => <Thumb src={row.image} />, className: "w-20" },
        {
          label: "Name",
          render: (row) => (
            <EditLink endpoint="categories" row={row}>
              {String(row.name)}
            </EditLink>
          ),
        },
        { label: "Products", render: (row) => String(row.product_count ?? 0) },
        { label: "Status", render: (row) => <StatusBadge status={String(row.status)} /> },
        {
          label: "",
          className: "text-right",
          render: (row) =>
            row.status === "published" ? (
              <a href={`/categories/${row.slug}`} target="_blank" rel="noopener" className="text-xs font-semibold text-slate hover:text-navy">
                View ↗
              </a>
            ) : null,
        },
      ]}
    />
  );
}
