"use client";

import Link from "next/link";

import { BasketIcon } from "./Icons";
import { useQuoteBasket } from "./QuoteBasket";

export function BasketLink() {
  const { items, ready } = useQuoteBasket();
  const count = ready ? items.length : 0;
  return (
    <Link
      href="/quote"
      className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-md bg-orange px-3 py-2 font-semibold text-navy hover:bg-orange-600 sm:px-4"
    >
      <BasketIcon className="text-lg" />
      <span className="hidden sm:inline">Quote basket</span>
      <span className="sr-only sm:hidden">Quote basket</span>
      <span
        className="min-w-6 rounded-full bg-navy px-1.5 text-center text-xs leading-6 text-white"
        aria-label={`${count} item${count === 1 ? "" : "s"}`}
      >
        {count}
      </span>
    </Link>
  );
}
