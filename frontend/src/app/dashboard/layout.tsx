import type { Metadata } from "next";

import { DashboardProvider } from "@/components/dashboard/DashboardProvider";
import { Shell } from "@/components/dashboard/Shell";

// Staff-only area. Access is enforced by the API (Django sign-in and
// permissions); keeping it out of search results is just tidiness.
export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard | KariVex" },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <DashboardProvider>
      <Shell>{children}</Shell>
    </DashboardProvider>
  );
}
