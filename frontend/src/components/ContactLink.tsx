"use client";

import type { ReactNode } from "react";

import { track } from "@/lib/analytics";

type Kind = "phone" | "email" | "whatsapp";

const EVENTS = { phone: "click_phone", email: "click_email", whatsapp: "click_whatsapp" } as const;

/** tel:/mailto:/wa.me link that records an anonymous click event.
 * Only the link placement and product slug are sent to analytics. */
export function ContactLink({
  kind,
  href,
  placement,
  productSlug,
  className,
  children,
  ariaLabel,
}: {
  kind: Kind;
  href: string;
  placement: string;
  productSlug?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const external = kind === "whatsapp";
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => track(EVENTS[kind], { placement, item_id: productSlug })}
    >
      {children}
    </a>
  );
}
