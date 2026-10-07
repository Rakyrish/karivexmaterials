"use client";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { ResourceForm } from "@/components/dashboard/ResourceForm";
import { settingsSections } from "@/lib/dashboard-resources";

export default function SettingsPage() {
  const { can } = useDashboard();
  return (
    <ResourceForm
      endpoint="settings"
      title={() => "Site settings"}
      description="Contact details, homepage headline and branding used across the whole website."
      sections={settingsSections}
      publicPath={() => "/"}
      canEdit={can("sitesettings.change_sitesettings")}
    />
  );
}
