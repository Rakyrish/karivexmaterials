"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { ApiError, api, formData } from "@/lib/manage";

import {
  FieldInput,
  clearOptionCache,
  imageFieldNames,
  jsonBody,
  type ImageChange,
  type SectionDef,
  type Values,
} from "./fields";
import { Button, Card, Notice, PageHeader, Spinner, StatusBadge, ViewOnSite } from "./ui";

export interface ResourceFormProps {
  /** API collection, e.g. "services"; for a singleton, the full path ("settings"). */
  endpoint: string;
  /** Record id, "new" to create, or undefined for a singleton. */
  id?: string;
  title: (values: Values) => string;
  description?: ReactNode;
  sections: SectionDef[];
  defaults?: Values;
  listHref?: string;
  listLabel?: string;
  publicPath?: (values: Values) => string | null;
  canEdit: boolean;
  canDelete?: boolean;
  /** Extra panels rendered under the form (e.g. product photos). */
  children?: (record: Values, reload: () => void) => ReactNode;
  deleteWarning?: string;
  /** Show the extra panels above the form instead of below it. */
  extrasFirst?: boolean;
}

const STATUS_KEY = "status";

export function ResourceForm({
  endpoint,
  id,
  title,
  description,
  sections,
  defaults = {},
  listHref,
  listLabel = "Back",
  publicPath,
  canEdit,
  canDelete = false,
  children,
  deleteWarning = "Delete this permanently? This cannot be undone.",
  extrasFirst = false,
}: ResourceFormProps) {
  const router = useRouter();
  const isNew = id === "new";
  const recordPath = id === undefined ? endpoint : `${endpoint}/${id}`;
  const [record, setRecord] = useState<Values | null>(isNew ? { ...defaults } : null);
  const [values, setValues] = useState<Values>(isNew ? { ...defaults } : {});
  const [images, setImages] = useState<Record<string, ImageChange>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (isNew) return;
    api<Values>(recordPath).then(
      (data) => {
        setRecord(data);
        setValues(data);
        setImages({});
      },
      (err: Error) => setLoadError(err.message),
    );
  }, [isNew, recordPath]);

  /** Reload after a side panel (photos, sizes, specs) saves, keeping any
   * fields the user is still editing in the main form. */
  const refresh = () => {
    const previous = record;
    api<Values>(recordPath).then(
      (data) => {
        setRecord(data);
        setValues((current) =>
          Object.fromEntries(
            Object.keys(data).map((key) => [
              key,
              previous && JSON.stringify(current[key]) !== JSON.stringify(previous[key]) ? current[key] : data[key],
            ]),
          ),
        );
      },
      (err: Error) => setLoadError(err.message),
    );
  };

  useEffect(load, [load]);

  const dirty =
    record !== null &&
    (Object.values(images).some((c) => c.file || c.removed) ||
      Object.keys(jsonBody(sections, values)).some((k) => JSON.stringify(values[k]) !== JSON.stringify(record[k])));

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setSaving(true);
    setErrors({});
    setMessage(null);
    try {
      let saved = await api<Values>(isNew ? endpoint : recordPath, {
        method: isNew ? "POST" : "PATCH",
        body: jsonBody(sections, values),
      });
      const savedPath = id === undefined ? endpoint : `${endpoint}/${saved.id}`;
      const uploads: Record<string, File | null> = {};
      for (const name of imageFieldNames(sections)) {
        const change = images[name];
        if (change?.file) uploads[name] = change.file;
        else if (change?.removed) uploads[name] = null;
      }
      if (Object.keys(uploads).length) {
        saved = await api<Values>(savedPath, { method: "PATCH", body: formData(uploads) });
      }
      clearOptionCache();
      if (isNew) {
        router.replace(`${listHref ?? `/dashboard/${endpoint}`}/${saved.id}?created=1`);
        return;
      }
      setRecord(saved);
      setValues(saved);
      setImages({});
      setMessage({ tone: "success", text: "Saved. The public site updates within a few seconds." });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields);
        setMessage({ tone: "error", text: err.message });
      } else {
        setMessage({ tone: "error", text: "Could not save. Check your connection and try again." });
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    try {
      await api(recordPath, { method: "DELETE" });
      clearOptionCache();
      router.replace(listHref ?? `/dashboard/${endpoint}`);
    } catch (err) {
      setMessage({ tone: "error", text: err instanceof Error ? err.message : "Could not delete." });
      setConfirmDelete(false);
      setSaving(false);
    }
  }

  if (loadError) return <Notice tone="error">{loadError}</Notice>;
  if (!record) return <Spinner />;

  const path = publicPath && !isNew ? publicPath(record) : null;
  const created = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("created");

  return (
    <div className="pb-24">
      <PageHeader
        title={isNew ? title(values) : title(record)}
        description={description}
        back={listHref ? { href: listHref, label: listLabel } : undefined}
        actions={
          <>
            {STATUS_KEY in record && !isNew && <StatusBadge status={String(record[STATUS_KEY])} />}
            {path && <ViewOnSite path={path} />}
          </>
        }
      />

      <div className="space-y-4">
        {created && !message && <Notice tone="success">Created. You can keep editing below.</Notice>}
        {!canEdit && <Notice>You can view this but your account can&apos;t change it.</Notice>}
        {message && <Notice tone={message.tone}>{message.text}</Notice>}

        {extrasFirst && !isNew && children?.(record, refresh)}

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (canEdit) void save();
          }}
        >
          {sections.map((section) => (
            <Card key={section.title} title={section.title} description={section.description}>
              <div className="grid gap-4 sm:grid-cols-2">
                {section.fields.map((def) => (
                  <FieldInput
                    key={def.name}
                    def={def}
                    value={values[def.name]}
                    error={errors[def.name]}
                    disabled={!canEdit || saving}
                    onChange={(value) => setValues((v) => ({ ...v, [def.name]: value }))}
                    image={images[def.name]}
                    onImage={(change) => setImages((c) => ({ ...c, [def.name]: change }))}
                  />
                ))}
              </div>
            </Card>
          ))}

          {canEdit && (
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 py-3 backdrop-blur lg:left-64">
              <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
                <span className="text-sm text-slate">{dirty ? "You have unsaved changes." : isNew ? "" : "All changes saved."}</span>
                <div className="flex gap-2">
                  {canDelete && !isNew && (
                    <Button variant="danger" disabled={saving} onClick={() => setConfirmDelete(true)}>
                      Delete
                    </Button>
                  )}
                  <button type="submit" className="inline-flex min-h-10 items-center rounded-lg bg-orange px-6 text-sm font-bold text-navy hover:bg-orange-600 disabled:opacity-50" disabled={saving || (!dirty && !isNew)}>
                    {saving ? "Saving…" : isNew ? "Create" : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>

        {!extrasFirst && !isNew && children?.(record, refresh)}

        {confirmDelete && (
          <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-delete" className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h2 id="confirm-delete" className="font-display text-xl font-bold text-navy">
                Delete?
              </h2>
              <p className="mt-2 text-slate">{deleteWarning}</p>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setConfirmDelete(false)} autoFocus>
                  Cancel
                </Button>
                <Button variant="danger" disabled={saving} onClick={() => void remove()}>
                  Delete permanently
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
