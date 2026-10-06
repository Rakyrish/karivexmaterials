"use client";

import Image from "next/image";
import { useState } from "react";

import type { IllustrativeImage } from "@/lib/images";
import type { ProductImage } from "@/lib/types";

import { ProductVisual } from "./ProductVisual";

export function Gallery({
  images,
  productName,
  fallback,
}: {
  images: ProductImage[];
  productName: string;
  fallback?: IllustrativeImage;
}) {
  const [active, setActive] = useState(0);
  if (images.length <= 1) {
    return (
      <ProductVisual
        image={images[0]}
        fallback={fallback}
        label={productName}
        sizes="(min-width:1024px) 50vw, 100vw"
        preload
        className="rounded-xl border border-line"
      />
    );
  }
  const current = images[active] ?? images[0];
  return (
    <div>
      <ProductVisual
        image={current}
        label={productName}
        sizes="(min-width:1024px) 50vw, 100vw"
        preload
        className="rounded-xl border border-line"
      />
      <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5" aria-label="Product photographs">
        {images.map((image, index) => (
          <li key={image.image}>
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={index === active}
              aria-label={`Show photo ${index + 1}: ${image.alt_text}`}
              className={`relative block aspect-square w-full overflow-hidden rounded-md border-2 ${
                index === active ? "border-orange" : "border-line"
              }`}
            >
              <Image src={image.image} alt="" fill sizes="96px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
