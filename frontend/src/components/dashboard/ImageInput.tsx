"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { IMAGE_ACCEPT, checkImage } from "@/lib/manage";

import { Button } from "./ui";

/** Current image preview with choose / replace / remove. The parent decides
 * when to upload: `value` is the stored URL, `pending` a chosen File, and
 * `removed` marks the stored image for deletion. */
export function ImageInput({
  id,
  value,
  pending,
  removed,
  disabled,
  onChoose,
  onRemove,
  onUndo,
  aspect = "aspect-[4/3]",
  fit = "object-cover",
}: {
  id: string;
  value: string | null;
  pending: File | null;
  removed: boolean;
  disabled?: boolean;
  onChoose: (file: File) => void;
  onRemove: () => void;
  onUndo: () => void;
  aspect?: string;
  fit?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const preview = useMemo(() => (pending ? URL.createObjectURL(pending) : null), [pending]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const shown = preview ?? (removed ? null : value);

  return (
    <div className="space-y-2">
      <div className={`relative ${aspect} w-full max-w-sm overflow-hidden rounded-xl border border-line bg-mist`}>
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="" className={`h-full w-full ${fit}`} />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-slate">
            {removed ? "Image will be removed when you save." : "No image uploaded — the site shows its built-in photo."}
          </div>
        )}
        {pending && (
          <span className="absolute left-2 top-2 rounded bg-orange px-2 py-0.5 text-xs font-bold text-navy">New — save to upload</span>
        )}
      </div>
      <input
        ref={input}
        id={id}
        type="file"
        accept={IMAGE_ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          const problem = checkImage(file);
          setError(problem);
          if (!problem) onChoose(file);
        }}
      />
      {!disabled && (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => input.current?.click()}>
            {shown ? "Replace image" : "Upload image"}
          </Button>
          {(pending || removed) && (
            <Button variant="ghost" onClick={onUndo}>
              Undo
            </Button>
          )}
          {value && !removed && !pending && (
            <Button variant="danger" onClick={onRemove}>
              Remove
            </Button>
          )}
        </div>
      )}
      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
      <p className="text-xs text-slate">JPEG, PNG or WebP up to 8 MB. Large photos are resized automatically.</p>
    </div>
  );
}
