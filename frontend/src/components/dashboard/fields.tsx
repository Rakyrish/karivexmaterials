"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/manage";

import { ImageInput } from "./ImageInput";
import { Field, inputClass } from "./ui";

export type FieldDef = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  wide?: boolean;
} & (
  | { type: "text" | "url" | "email" | "date" | "number" | "price"; maxLength?: number; placeholder?: string }
  | { type: "textarea" | "lines" | "faqs"; rows?: number; placeholder?: string }
  | { type: "select"; options: [string, string][]; nullable?: boolean }
  | { type: "checkbox" }
  | { type: "image"; fit?: string }
  | { type: "relation"; endpoint: string; multiple: boolean; labelKey?: string; nullable?: boolean }
);

export interface SectionDef {
  title: string;
  description?: string;
  fields: FieldDef[];
}

export type Values = Record<string, unknown>;

export interface ImageChange {
  file: File | null;
  removed: boolean;
}

const LINES_HINT = "One item per line.";
const FAQ_HINT = "Write each as “Q: question” on one line and “A: answer” on the next. Leave a blank line between questions.";

interface Option {
  id: number;
  label: string;
}

const optionCache = new Map<string, Promise<Option[]>>();

function loadOptions(endpoint: string, labelKey: string) {
  const key = `${endpoint}:${labelKey}`;
  if (!optionCache.has(key)) {
    const promise = api<Record<string, unknown>[]>(endpoint).then((rows) =>
      rows.map((row) => ({ id: row.id as number, label: String(row[labelKey] ?? row.id) })),
    );
    promise.catch(() => optionCache.delete(key));
    optionCache.set(key, promise);
  }
  return optionCache.get(key)!;
}

/** Forget cached option lists (after creating or renaming a record). */
export function clearOptionCache() {
  optionCache.clear();
}

function RelationInput({
  id,
  def,
  value,
  onChange,
  disabled,
}: {
  id: string;
  def: Extract<FieldDef, { type: "relation" }>;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}) {
  const [options, setOptions] = useState<Option[] | null>(null);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    loadOptions(def.endpoint, def.labelKey ?? "name").then(setOptions, () => setOptions([]));
  }, [def.endpoint, def.labelKey]);

  const visible = useMemo(
    () => (options ?? []).filter((o) => o.label.toLowerCase().includes(filter.trim().toLowerCase())),
    [options, filter],
  );

  if (!options) return <p className="text-sm text-slate">Loading options…</p>;

  if (!def.multiple) {
    return (
      <select
        id={id}
        className={inputClass}
        value={value == null ? "" : String(value)}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">{def.nullable ? "— None —" : "— Choose —"}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  const selected = new Set((value as number[] | undefined) ?? []);
  return (
    <div className="rounded-lg border border-line bg-white">
      {options.length > 8 && (
        <input
          type="search"
          placeholder="Filter…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border-b border-line px-3 py-2 text-sm outline-none"
          aria-label={`Filter ${def.label}`}
        />
      )}
      <ul id={id} className="max-h-56 overflow-y-auto p-2">
        {visible.map((o) => (
          <li key={o.id}>
            <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-mist">
              <input
                type="checkbox"
                checked={selected.has(o.id)}
                disabled={disabled}
                onChange={(e) => {
                  const next = new Set(selected);
                  if (e.target.checked) next.add(o.id);
                  else next.delete(o.id);
                  onChange([...next]);
                }}
                className="h-4 w-4 accent-orange"
              />
              {o.label}
            </label>
          </li>
        ))}
        {visible.length === 0 && <li className="px-2 py-1.5 text-sm text-slate">Nothing to choose.</li>}
      </ul>
      <p className="border-t border-line px-3 py-1.5 text-xs text-slate">{selected.size} selected</p>
    </div>
  );
}

export function FieldInput({
  def,
  value,
  onChange,
  error,
  disabled,
  image,
  onImage,
}: {
  def: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string[];
  disabled?: boolean;
  image?: ImageChange;
  onImage?: (change: ImageChange) => void;
}) {
  const hint =
    def.hint ?? (def.type === "lines" ? LINES_HINT : def.type === "faqs" ? FAQ_HINT : undefined);
  const label = def.required ? `${def.label} *` : def.label;
  const className = def.wide || ["textarea", "lines", "faqs", "relation", "image"].includes(def.type) ? "sm:col-span-2" : "";

  if (def.type === "checkbox") {
    return (
      <div className={className}>
        <label className="flex items-start gap-3 rounded-lg border border-line bg-white p-3">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 accent-orange"
            checked={!!value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>
            <span className="block text-sm font-semibold text-navy">{def.label}</span>
            {hint && <span className="block text-xs text-slate">{hint}</span>}
          </span>
        </label>
        {error && <p className="mt-1 text-xs font-semibold text-red-700">{error.join(" ")}</p>}
      </div>
    );
  }

  return (
    <Field label={label} hint={hint} error={error} className={className}>
      {(id) => {
        switch (def.type) {
          case "textarea":
          case "lines":
          case "faqs":
            return (
              <textarea
                id={id}
                rows={def.rows ?? (def.type === "faqs" ? 10 : 5)}
                className={`${inputClass} font-[inherit]`}
                value={(value as string) ?? ""}
                placeholder={def.placeholder}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
              />
            );
          case "select":
            return (
              <select
                id={id}
                className={inputClass}
                value={value == null ? "" : String(value)}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value === "" && def.nullable ? null : e.target.value)}
              >
                {def.nullable && <option value="">— None —</option>}
                {def.options.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            );
          case "relation":
            return <RelationInput id={id} def={def} value={value} onChange={onChange} disabled={disabled} />;
          case "image":
            return (
              <ImageInput
                id={id}
                value={(value as string) ?? null}
                pending={image?.file ?? null}
                removed={image?.removed ?? false}
                disabled={disabled}
                fit={def.fit}
                onChoose={(file) => onImage?.({ file, removed: false })}
                onRemove={() => onImage?.({ file: null, removed: true })}
                onUndo={() => onImage?.({ file: null, removed: false })}
              />
            );
          default:
            return (
              <input
                id={id}
                type={def.type === "price" ? "number" : def.type}
                step={def.type === "price" ? "0.01" : def.type === "number" ? "1" : undefined}
                min={def.type === "price" || def.type === "number" ? 0 : undefined}
                className={inputClass}
                value={value == null ? "" : String(value)}
                maxLength={"maxLength" in def ? def.maxLength : undefined}
                placeholder={"placeholder" in def ? def.placeholder : undefined}
                required={def.required}
                disabled={disabled}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (def.type === "number") onChange(raw === "" ? 0 : Number(raw));
                  else if (def.type === "price" || def.type === "date") onChange(raw === "" ? null : raw);
                  else onChange(raw);
                }}
              />
            );
        }
      }}
    </Field>
  );
}

/** Split values into the JSON body and pending image uploads. */
export function imageFieldNames(sections: SectionDef[]) {
  return sections.flatMap((s) => s.fields.filter((f) => f.type === "image").map((f) => f.name));
}

export function jsonBody(sections: SectionDef[], values: Values) {
  const body: Values = {};
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.type !== "image" && field.name in values) body[field.name] = values[field.name];
    }
  }
  return body;
}
