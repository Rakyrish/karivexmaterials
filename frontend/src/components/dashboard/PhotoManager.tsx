"use client";

import { useRef, useState } from "react";

import { ApiError, IMAGE_ACCEPT, api, checkImage, formData } from "@/lib/manage";

import { Button, Card, Notice, inputClass } from "./ui";

interface Photo {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
  width: number | null;
  height: number | null;
}

/** Upload, describe, reorder, set main and delete a product's photos. */
export function PhotoManager({
  productId,
  productName,
  photos,
  onChange,
  canAdd,
  canChange,
  canDelete,
}: {
  productId: number;
  productName: string;
  photos: Photo[];
  onChange: () => void;
  canAdd: boolean;
  canChange: boolean;
  canDelete: boolean;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [alts, setAlts] = useState<Record<number, string>>({});

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      setMessage({ tone: "success", text: success });
      onChange();
    } catch (err) {
      setMessage({ tone: "error", text: err instanceof ApiError ? Object.values(err.fields).flat().join(" ") || err.message : "Something went wrong." });
    } finally {
      setBusy(false);
      setConfirming(null);
    }
  }

  async function upload() {
    if (!file) return;
    await run(async () => {
      await api("product-images", {
        body: formData({
          product: productId,
          image: file,
          alt_text: alt.trim() || productName,
          is_primary: photos.length === 0,
          order: photos.length,
        }),
      });
      setFile(null);
      setAlt("");
    }, "Photo uploaded and live on the product page.");
  }

  const sorted = [...photos].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.order - b.order);

  function move(index: number, delta: number) {
    const list = sorted.filter((p) => !p.is_primary);
    const offset = sorted.length - list.length;
    const from = index - offset;
    const to = from + delta;
    if (from < 0 || to < 0 || to >= list.length) return;
    [list[from], list[to]] = [list[to], list[from]];
    void run(
      () => Promise.all(list.map((p, i) => (p.order === i + 1 ? null : api(`product-images/${p.id}`, { method: "PATCH", body: { order: i + 1 } })))),
      "Order updated.",
    );
  }

  return (
    <Card
      title="Photos"
      description="The main photo is used on product cards, the product page and in Google. Use real photos of your products."
    >
      {message && (
        <div className="mb-4">
          <Notice tone={message.tone}>{message.text}</Notice>
        </div>
      )}
      {sorted.length === 0 && <p className="mb-4 text-sm text-slate">No photos uploaded yet — the site shows a built-in illustrative picture.</p>}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((photo, index) => (
          <li key={photo.id} className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="relative aspect-[4/3] bg-mist">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.image} alt={photo.alt_text} className="h-full w-full object-cover" />
              {photo.is_primary && (
                <span className="absolute left-2 top-2 rounded bg-orange px-2 py-0.5 text-xs font-bold text-navy">Main photo</span>
              )}
            </div>
            <div className="space-y-2 p-3">
              <label className="block text-xs font-semibold text-navy" htmlFor={`alt-${photo.id}`}>
                Description
              </label>
              <div className="flex gap-2">
                <input
                  id={`alt-${photo.id}`}
                  className={`${inputClass} text-sm`}
                  value={alts[photo.id] ?? photo.alt_text}
                  disabled={!canChange || busy}
                  maxLength={200}
                  onChange={(e) => setAlts((a) => ({ ...a, [photo.id]: e.target.value }))}
                />
                {alts[photo.id] !== undefined && alts[photo.id] !== photo.alt_text && (
                  <Button
                    disabled={busy || !alts[photo.id].trim()}
                    onClick={() =>
                      void run(async () => {
                        await api(`product-images/${photo.id}`, { method: "PATCH", body: { alt_text: alts[photo.id] } });
                        setAlts((a) => {
                          const next = { ...a };
                          delete next[photo.id];
                          return next;
                        });
                      }, "Description saved.")
                    }
                  >
                    Save
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {canChange && !photo.is_primary && (
                  <>
                    <Button variant="secondary" className="min-h-8 px-2 text-xs" disabled={busy} onClick={() => void run(() => api(`product-images/${photo.id}`, { method: "PATCH", body: { is_primary: true } }), "Main photo changed.")}>
                      Make main
                    </Button>
                    <Button variant="ghost" className="min-h-8 px-2 text-xs" disabled={busy} onClick={() => move(index, -1)} aria-label="Move earlier">
                      ←
                    </Button>
                    <Button variant="ghost" className="min-h-8 px-2 text-xs" disabled={busy} onClick={() => move(index, 1)} aria-label="Move later">
                      →
                    </Button>
                  </>
                )}
                {canDelete &&
                  (confirming === photo.id ? (
                    <>
                      <Button variant="danger" className="min-h-8 px-2 text-xs" disabled={busy} onClick={() => void run(() => api(`product-images/${photo.id}`, { method: "DELETE" }), "Photo deleted.")}>
                        Confirm delete
                      </Button>
                      <Button variant="ghost" className="min-h-8 px-2 text-xs" onClick={() => setConfirming(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="danger" className="ml-auto min-h-8 px-2 text-xs" disabled={busy} onClick={() => setConfirming(photo.id)}>
                      Delete
                    </Button>
                  ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {canAdd && (
        <div className="mt-6 rounded-xl border-2 border-dashed border-line bg-mist p-4">
          <p className="font-semibold text-navy">Add a photo</p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <input
              ref={fileInput}
              type="file"
              accept={IMAGE_ACCEPT}
              className="sr-only"
              id="new-photo"
              onChange={(e) => {
                const chosen = e.target.files?.[0] ?? null;
                e.target.value = "";
                if (!chosen) return;
                const problem = checkImage(chosen);
                setMessage(problem ? { tone: "error", text: problem } : null);
                if (!problem) setFile(chosen);
              }}
            />
            <Button variant="secondary" onClick={() => fileInput.current?.click()} disabled={busy}>
              {file ? "Choose a different file" : "Choose photo…"}
            </Button>
            {file && <span className="max-w-[14rem] truncate text-sm text-slate">{file.name}</span>}
          </div>
          {file && (
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div className="min-w-[16rem] flex-1">
                <label htmlFor="new-photo-alt" className="block text-xs font-semibold text-navy">
                  Describe what the photo shows
                </label>
                <input
                  id="new-photo-alt"
                  className={`${inputClass} mt-1`}
                  value={alt}
                  maxLength={200}
                  placeholder={`e.g. Stack of ${productName.toLowerCase()} in our warehouse`}
                  onChange={(e) => setAlt(e.target.value)}
                />
              </div>
              <Button onClick={() => void upload()} disabled={busy}>
                {busy ? "Uploading…" : "Upload photo"}
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
