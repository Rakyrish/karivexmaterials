"use client";

import { use } from "react";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { ResourceForm } from "@/components/dashboard/ResourceForm";
import { applicationSections } from "@/lib/dashboard-resources";

export default function EditApplicationsPage({ params }: PageProps<"/dashboard/applications/[id]">) {
  const { id } = use(params);
  const { can } = useDashboard();
  return (
    <ResourceForm
      endpoint="applications"
      id={id}
      title={(v) => (id === "new" ? "Add a use" : String(v.name || "Uses"))}
      sections={applicationSections}
      defaults={{ status: "published", order: 0 }}
      listHref="/dashboard/applications"
      listLabel="All uses"
      publicPath={(v) => (v.status === "published" ? `/applications/${v.slug}` : null)}
      canEdit={id === "new" ? can("catalog.add_application") : can("catalog.change_application")}
      canDelete={can("catalog.delete_application")}
      deleteWarning="Delete this permanently?"
    />
  );
}
