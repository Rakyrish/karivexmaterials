"use client";

import { use } from "react";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { ResourceForm } from "@/components/dashboard/ResourceForm";
import { serviceSections } from "@/lib/dashboard-resources";

export default function EditServicesPage({ params }: PageProps<"/dashboard/services/[id]">) {
  const { id } = use(params);
  const { can } = useDashboard();
  return (
    <ResourceForm
      endpoint="services"
      id={id}
      title={(v) => (id === "new" ? "Add a service" : String(v.name || "Services"))}
      sections={serviceSections}
      defaults={{ status: "draft", order: 0 }}
      listHref="/dashboard/services"
      listLabel="All services"
      publicPath={(v) => (v.status === "published" ? `/services/${v.slug}` : null)}
      canEdit={id === "new" ? can("catalog.add_service") : can("catalog.change_service")}
      canDelete={can("catalog.delete_service")}
      deleteWarning="Delete this service permanently? To take it off the site but keep it, set Visibility to Hidden instead."
    />
  );
}
