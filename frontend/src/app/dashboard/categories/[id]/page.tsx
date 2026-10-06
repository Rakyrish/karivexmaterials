"use client";

import { use } from "react";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { ResourceForm } from "@/components/dashboard/ResourceForm";
import { categorySections } from "@/lib/dashboard-resources";

export default function EditCategoriesPage({ params }: PageProps<"/dashboard/categories/[id]">) {
  const { id } = use(params);
  const { can } = useDashboard();
  return (
    <ResourceForm
      endpoint="categories"
      id={id}
      title={(v) => (id === "new" ? "Add a category" : String(v.name || "Categories"))}
      sections={categorySections}
      defaults={{ status: "published", order: 0 }}
      listHref="/dashboard/categories"
      listLabel="All categories"
      publicPath={(v) => (v.status === "published" ? `/categories/${v.slug}` : null)}
      canEdit={id === "new" ? can("catalog.add_category") : can("catalog.change_category")}
      canDelete={can("catalog.delete_category")}
      deleteWarning="Delete this category permanently? A category that still has products can't be deleted — hide it instead."
    />
  );
}
