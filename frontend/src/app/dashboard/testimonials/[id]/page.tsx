"use client";

import { use } from "react";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { ResourceForm } from "@/components/dashboard/ResourceForm";
import { testimonialSections } from "@/lib/dashboard-resources";

export default function EditTestimonialPage({ params }: PageProps<"/dashboard/testimonials/[id]">) {
  const { id } = use(params);
  const { can } = useDashboard();
  return (
    <ResourceForm
      endpoint="testimonials"
      id={id}
      title={(v) => (id === "new" ? "Add a testimonial" : String(v.customer_name || "Testimonial"))}
      description="Published testimonials appear on the homepage. They are never marked up as Google reviews."
      sections={testimonialSections}
      defaults={{ status: "draft", topic: "general", rating: null, service: null, consent_confirmed: false, order: 0 }}
      listHref="/dashboard/testimonials"
      listLabel="All testimonials"
      publicPath={(v) => (v.status === "published" ? "/" : null)}
      canEdit={id === "new" ? can("catalog.add_testimonial") : can("catalog.change_testimonial")}
      canDelete={can("catalog.delete_testimonial")}
    />
  );
}
