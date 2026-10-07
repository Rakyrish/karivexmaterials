"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import { api } from "@/lib/manage";

import { EmptyState, Notice, PageHeader, Spinner, buttonClass, inputClass } from "./ui";

export type Row = Record<string, unknown> & { id: number };

export interface Column {
  label: string;
  render: (row: Row) => ReactNode;
  className?: string;
}

export function ResourceList({
  endpoint,
  title,
  description,
  columns,
  addLabel,
  canAdd,
  statusFilter = true,
  statusOptions = [
    ["", "All"],
    ["published", "Published"],
    ["draft", "Draft"],
    ["archived", "Hidden"],
  ],
  empty = "Nothing here yet.",
}: {
  endpoint: string;
  title: string;
  description?: ReactNode;
  columns: Column[];
  addLabel?: string;
  canAdd?: boolean;
  statusFilter?: boolean;
  statusOptions?: [string, string][];
  empty?: ReactNode;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    const timer = setTimeout(() => {
      api<Row[]>(`${endpoint}${params.size ? `?${params}` : ""}`).then(
        (data) => {
          setRows(data);
          setError(null);
        },
        (err: Error) => setError(err.message),
      );
    }, search ? 250 : 0);
    return () => clearTimeout(timer);
  }, [endpoint, search, status]);

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          canAdd && addLabel ? (
            <Link href={`/dashboard/${endpoint}/new`} className={buttonClass()}>
              + {addLabel}
            </Link>
          ) : undefined
        }
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          aria-label={`Search ${title.toLowerCase()}`}
          className={`${inputClass} max-w-xs`}
        />
        {statusFilter && (
          <div className="flex flex-wrap gap-1 rounded-lg border border-line bg-white p-1" role="group" aria-label="Filter by status">
            {statusOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={status === value}
                onClick={() => setStatus(value)}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold ${status === value ? "bg-navy text-white" : "text-slate hover:bg-mist"}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {!rows && !error && <Spinner />}
      {rows && rows.length === 0 && <EmptyState>{search || status ? "No matches." : empty}</EmptyState>}
      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-line bg-mist text-xs uppercase tracking-wider text-slate">
              <tr>
                {columns.map((c) => (
                  <th key={c.label} scope="col" className={`px-4 py-3 font-bold ${c.className ?? ""}`}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-mist/60">
                  {columns.map((c) => (
                    <td key={c.label} className={`px-4 py-3 align-middle ${c.className ?? ""}`}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows && rows.length > 0 && <p className="mt-2 text-xs text-slate">{rows.length} shown</p>}
    </>
  );
}

/** First-column link to the edit page. */
export function EditLink({ endpoint, row, children }: { endpoint: string; row: Row; children: ReactNode }) {
  return (
    <Link href={`/dashboard/${endpoint}/${row.id}`} className="font-semibold text-navy hover:text-orange-600 hover:underline">
      {children}
    </Link>
  );
}

export function Thumb({ src }: { src: unknown }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={String(src)} alt="" className="h-12 w-16 rounded-md border border-line object-cover" />
  ) : (
    <span className="flex h-12 w-16 items-center justify-center rounded-md border border-dashed border-line text-[0.6rem] text-slate">
      no photo
    </span>
  );
}
