"use client";

import { EditLink, ResourceList } from "@/components/dashboard/ResourceList";
import { EnquiryStatus } from "@/components/dashboard/ui";
import { formatDate } from "@/lib/manage";

const KIND: Record<string, string> = { quote: "Quote", contact: "General", service: "Service" };

export default function EnquiriesPage() {
  return (
    <ResourceList
      endpoint="enquiries"
      title="Enquiries"
      description="Quote requests and messages sent through the website forms. Every enquiry is saved here even if the email notification fails."
      statusOptions={[
        ["", "All"],
        ["new", "New"],
        ["in_progress", "In progress"],
        ["quoted", "Quoted"],
        ["closed", "Closed"],
      ]}
      empty="No enquiries yet."
      columns={[
        {
          label: "From",
          render: (row) => (
            <>
              <EditLink endpoint="enquiries" row={row}>
                {String(row.name)}
              </EditLink>
              <span className="block text-xs text-slate">{String(row.company || row.email)}</span>
            </>
          ),
        },
        { label: "Type", render: (row) => KIND[String(row.kind)] ?? String(row.kind) },
        { label: "Reference", render: (row) => <span className="font-mono text-xs">{String(row.reference_number)}</span> },
        { label: "Received", render: (row) => formatDate(String(row.created_at)) },
        {
          label: "Email",
          render: (row) =>
            row.notification_sent ? (
              "Sent"
            ) : row.notification_error ? (
              <span className="font-semibold text-red-700">Failed</span>
            ) : (
              <span className="text-slate">Pending</span>
            ),
        },
        { label: "Status", render: (row) => <EnquiryStatus status={String(row.status)} /> },
      ]}
    />
  );
}
