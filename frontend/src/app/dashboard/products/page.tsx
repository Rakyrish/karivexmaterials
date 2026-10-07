"use client";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { EditLink, ResourceList, Thumb } from "@/components/dashboard/ResourceList";
import { StatusBadge } from "@/components/dashboard/ui";
import { AVAILABILITY_LABELS } from "@/lib/manage";

export default function ProductsPage() {
  const { can } = useDashboard();
  return (
    <ResourceList
      endpoint="products"
      title="Products"
      description="Everything for sale on the site. Hidden products stay saved but don't appear."
      addLabel="Add product"
      canAdd={can("catalog.add_product")}
      empty="No products yet. Add your first one."
      columns={[
        { label: "Photo", render: (row) => <Thumb src={row.thumbnail} />, className: "w-20" },
        {
          label: "Product",
          render: (row) => (
            <>
              <EditLink endpoint="products" row={row}>
                {String(row.name)}
              </EditLink>
              <span className="block text-xs text-slate">{String(row.category ?? "")}</span>
            </>
          ),
        },
        { label: "Availability", render: (row) => AVAILABILITY_LABELS[String(row.availability_status)] ?? "" },
        {
          label: "Price",
          render: (row) => (row.price ? `${row.price_currency} ${Number(row.price).toLocaleString("en-KE")}` : <span className="text-slate">Quote</span>),
        },
        { label: "Status", render: (row) => <StatusBadge status={String(row.status)} /> },
        {
          label: "",
          className: "text-right",
          render: (row) =>
            row.status === "published" ? (
              <a href={`/products/${row.slug}`} target="_blank" rel="noopener" className="text-xs font-semibold text-slate hover:text-navy">
                View ↗
              </a>
            ) : null,
        },
      ]}
    />
  );
}
