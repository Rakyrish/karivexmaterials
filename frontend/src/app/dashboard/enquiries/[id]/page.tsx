"use client";

import { use, useEffect, useState, type ReactNode } from "react";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Button, Card, EnquiryStatus, Field, Notice, PageHeader, Spinner, inputClass } from "@/components/dashboard/ui";
import { ApiError, api, formatDate } from "@/lib/manage";

interface Item {
  id: number;
  product_name_snapshot: string;
  variant_label_snapshot: string;
  product_url_snapshot: string;
  quantity: string;
  unit: string;
  notes: string;
}

interface Enquiry {
  id: number;
  reference_number: string;
  kind: string;
  service_name_snapshot: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  delivery_location: string;
  project_notes: string;
  status: string;
  internal_notes: string;
  notification_sent: boolean;
  notification_error: string;
  created_at: string;
  items: Item[];
}

const STATUSES: [string, string][] = [
  ["new", "New"],
  ["in_progress", "In progress"],
  ["quoted", "Quoted"],
  ["closed", "Closed"],
];

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wider text-slate">{label}</dt>
      <dd className="mt-0.5 break-words text-ink">{children || "—"}</dd>
    </div>
  );
}

export default function EnquiryPage({ params }: PageProps<"/dashboard/enquiries/[id]">) {
  const { id } = use(params);
  const { can } = useDashboard();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Enquiry>(`enquiries/${id}`).then(
      (data) => {
        setEnquiry(data);
        setStatus(data.status);
        setNotes(data.internal_notes);
      },
      (err: Error) => setMessage({ tone: "error", text: err.message }),
    );
  }, [id]);

  if (!enquiry) return message ? <Notice tone="error">{message.text}</Notice> : <Spinner />;

  async function save() {
    setBusy(true);
    try {
      const data = await api<Enquiry>(`enquiries/${id}`, { method: "PATCH", body: { status, internal_notes: notes } });
      setEnquiry(data);
      setMessage({ tone: "success", text: "Saved." });
    } catch (err) {
      setMessage({ tone: "error", text: err instanceof ApiError ? err.message : "Could not save." });
    } finally {
      setBusy(false);
    }
  }

  const canEdit = can("enquiries.change_enquiry");
  const reply = `mailto:${enquiry.email}?subject=${encodeURIComponent(`Your enquiry ${enquiry.reference_number}`)}`;

  return (
    <>
      <PageHeader
        title={enquiry.name}
        description={`${enquiry.reference_number} · received ${formatDate(enquiry.created_at)}`}
        back={{ href: "/dashboard/enquiries", label: "All enquiries" }}
        actions={<EnquiryStatus status={enquiry.status} />}
      />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {!enquiry.notification_sent && enquiry.notification_error && (
            <Notice tone="warning">
              The email notification for this enquiry failed, so it may not be in the inbox. Reply from here.
            </Notice>
          )}
          <Card title="Customer">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail label="Name">{enquiry.name}</Detail>
              <Detail label="Company">{enquiry.company}</Detail>
              <Detail label="Email">
                <a className="font-semibold text-navy underline" href={reply}>
                  {enquiry.email}
                </a>
              </Detail>
              <Detail label="Phone">
                {enquiry.phone && (
                  <a className="font-semibold text-navy underline" href={`tel:${enquiry.phone.replace(/\s+/g, "")}`}>
                    {enquiry.phone}
                  </a>
                )}
              </Detail>
              <Detail label="Location">{enquiry.delivery_location}</Detail>
              <Detail label="Service">{enquiry.service_name_snapshot}</Detail>
            </dl>
          </Card>
          <Card title="Message">
            <p className="whitespace-pre-line text-ink">{enquiry.project_notes || "No message."}</p>
          </Card>
          {enquiry.items.length > 0 && (
            <Card title="Items requested">
              <ul className="divide-y divide-line">
                {enquiry.items.map((item) => (
                  <li key={item.id} className="py-2">
                    <p className="font-semibold text-navy">
                      {item.product_name_snapshot}
                      {item.variant_label_snapshot ? ` — ${item.variant_label_snapshot}` : ""}
                    </p>
                    <p className="text-sm text-slate">
                      Quantity: {Number(item.quantity)} {item.unit}
                      {item.notes ? ` · ${item.notes}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
        <Card title="Follow-up">
          {message && (
            <div className="mb-4">
              <Notice tone={message.tone}>{message.text}</Notice>
            </div>
          )}
          <div className="space-y-4">
            <Field label="Status">
              {(fid) => (
                <select id={fid} className={inputClass} value={status} disabled={!canEdit} onChange={(e) => setStatus(e.target.value)}>
                  {STATUSES.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field label="Staff notes" hint="Only visible to staff.">
              {(fid) => (
                <textarea id={fid} rows={6} className={inputClass} value={notes} disabled={!canEdit} onChange={(e) => setNotes(e.target.value)} />
              )}
            </Field>
            {canEdit && (
              <Button onClick={() => void save()} disabled={busy || (status === enquiry.status && notes === enquiry.internal_notes)}>
                {busy ? "Saving…" : "Save"}
              </Button>
            )}
            <a href={reply} className="block text-sm font-semibold text-navy underline">
              Reply by email
            </a>
          </div>
        </Card>
      </div>
    </>
  );
}
