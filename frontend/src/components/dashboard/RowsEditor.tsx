"use client";

import { useState } from "react";

import { ApiError, api } from "@/lib/manage";

import { Button, Card, Notice, inputClass } from "./ui";

type RowValue = string | boolean | number | null | undefined;
type Row = Record<string, RowValue>;

export interface RowColumn {
  name: string;
  label: string;
  type?: "text" | "checkbox" | "select";
  options?: [string, string][];
  placeholder?: string;
  width?: string;
}

/** Edit a list of rows (specifications, sizes/variants) and save the whole
 * list on the product in one request. */
export function RowsEditor({
  title,
  description,
  productId,
  field,
  columns,
  initial,
  blank,
  canEdit,
  onSaved,
  addLabel,
}: {
  title: string;
  description: string;
  productId: number;
  field: string;
  columns: RowColumn[];
  initial: Row[];
  blank: Row;
  canEdit: boolean;
  onSaved: () => void;
  addLabel: string;
}) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const dirty = JSON.stringify(rows) !== JSON.stringify(initial);

  const update = (index: number, name: string, value: RowValue) =>
    setRows((list) => list.map((row, i) => (i === index ? { ...row, [name]: value } : row)));

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      const cleaned = rows
        .filter((row) => String(row[columns[0].name] ?? "").trim())
        .map((row, order) => ({ ...row, order }));
      await api(`products/${productId}`, { method: "PATCH", body: { [field]: cleaned } });
      setMessage({ tone: "success", text: "Saved." });
      onSaved();
    } catch (err) {
      setMessage({
        tone: "error",
        text: err instanceof ApiError ? Object.values(err.fields).flat().join(" ") || err.message : "Could not save.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card title={title} description={description}>
      {message && (
        <div className="mb-3">
          <Notice tone={message.tone}>{message.text}</Notice>
        </div>
      )}
      {rows.length === 0 && <p className="mb-3 text-sm text-slate">None yet.</p>}
      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate">
                {columns.map((c) => (
                  <th key={c.name} scope="col" className={`px-1 pb-2 font-bold ${c.width ?? ""}`}>
                    {c.label}
                  </th>
                ))}
                <th className="w-px" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={String(row.id ?? `new-${index}`)}>
                  {columns.map((c) => (
                    <td key={c.name} className="px-1 py-1">
                      {c.type === "checkbox" ? (
                        <input
                          type="checkbox"
                          aria-label={c.label}
                          className="h-5 w-5 accent-orange"
                          checked={!!row[c.name]}
                          disabled={!canEdit}
                          onChange={(e) => update(index, c.name, e.target.checked)}
                        />
                      ) : c.type === "select" ? (
                        <select
                          aria-label={c.label}
                          className={`${inputClass} py-1.5`}
                          value={String(row[c.name] ?? "")}
                          disabled={!canEdit}
                          onChange={(e) => update(index, c.name, e.target.value)}
                        >
                          {c.options?.map(([v, l]) => (
                            <option key={v} value={v}>
                              {l}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          aria-label={c.label}
                          className={`${inputClass} py-1.5`}
                          value={String(row[c.name] ?? "")}
                          placeholder={c.placeholder}
                          disabled={!canEdit}
                          onChange={(e) => update(index, c.name, e.target.value)}
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-1">
                    {canEdit && (
                      <button
                        type="button"
                        aria-label="Remove row"
                        className="rounded px-2 py-1 text-red-700 hover:bg-red-50"
                        onClick={() => setRows((list) => list.filter((_, i) => i !== index))}
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {canEdit && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setRows((list) => [...list, { ...blank }])}>
            + {addLabel}
          </Button>
          {dirty && (
            <>
              <Button onClick={() => void save()} disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </Button>
              <Button variant="ghost" onClick={() => setRows(initial)} disabled={busy}>
                Undo changes
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
