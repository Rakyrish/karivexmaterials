import Image from "next/image";

import type { IllustrativeImage } from "@/lib/images";
import type { ProductImage } from "@/lib/types";

/** Uploaded product photograph; otherwise a clearly labelled illustrative
 * stock photo; otherwise a neutral placeholder. */
export function ProductVisual({
  image,
  fallback,
  label,
  sizes,
  preload = false,
  className = "",
}: {
  image: ProductImage | null | undefined;
  fallback?: IllustrativeImage;
  label: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  if (image?.image) {
    return (
      <div className={`relative aspect-[4/3] overflow-hidden bg-mist ${className}`}>
        <Image src={image.image} alt={image.alt_text} fill sizes={sizes} preload={preload} className="object-cover" />
      </div>
    );
  }
  if (fallback) {
    return (
      <div className={`relative aspect-[4/3] overflow-hidden bg-mist ${className}`}>
        <Image
          src={fallback.src}
          alt={fallback.alt}
          fill
          sizes={sizes}
          preload={preload}
          placeholder={fallback.badge ? "blur" : "empty"}
          className={fallback.badge ? "object-cover" : "bg-white object-contain"}
        />
        {fallback.badge && (
          <span className="absolute bottom-2 left-2 rounded bg-navy/85 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-white">
            {fallback.badge}
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      className={`relative flex aspect-[4/3] flex-col items-center justify-center gap-2 overflow-hidden bg-mist text-slate ${className}`}
      role="img"
      aria-label={`Photograph of ${label} to follow`}
    >
      <svg viewBox="0 0 64 72" className="h-14 w-14" aria-hidden="true">
        <path d="M32 3 61 19.5v33L32 69 3 52.5v-33z" fill="none" stroke="#c4ccd7" strokeWidth="3" />
        <path d="M32 18 47 26.5v19L32 54 17 45.5v-19z" fill="#dce2ea" />
      </svg>
      <span className="text-xs font-medium uppercase tracking-wider">Photo to follow</span>
    </div>
  );
}
