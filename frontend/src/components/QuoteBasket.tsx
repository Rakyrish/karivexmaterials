"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { track } from "@/lib/analytics";

/** The customer's unsent quote basket lives in browser storage only. The
 * catalogue itself always comes from the server; product names here are
 * display copies that the server re-validates on submission. */

export interface BasketItem {
  key: string;
  slug: string;
  name: string;
  variantId: number | null;
  variantLabel: string;
  quantity: string;
  unit: string;
  notes: string;
}

interface BasketContextValue {
  items: BasketItem[];
  ready: boolean;
  add: (item: Omit<BasketItem, "key">) => void;
  update: (key: string, patch: Partial<Pick<BasketItem, "quantity" | "unit" | "notes">>) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "kv-quote-basket-v1";
const BasketContext = createContext<BasketContextValue | null>(null);

function itemKey(slug: string, variantId: number | null) {
  return `${slug}::${variantId ?? "none"}`;
}

function readStorage(): BasketItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i && typeof i.slug === "string") : [];
  } catch {
    return [];
  }
}

export function QuoteBasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydrate from storage after mount so server and client markup match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStorage());
    setReady(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode) — basket still works for this page view */
    }
  }, [items, ready]);

  const add = useCallback((item: Omit<BasketItem, "key">) => {
    const key = itemKey(item.slug, item.variantId);
    setItems((current) => {
      const existing = current.find((i) => i.key === key);
      if (existing) {
        const sum = Number(existing.quantity) + Number(item.quantity);
        return current.map((i) =>
          i.key === key
            ? { ...i, quantity: Number.isFinite(sum) ? String(sum) : item.quantity, unit: item.unit || i.unit }
            : i,
        );
      }
      return [...current, { ...item, key }];
    });
    track("add_to_quote", { item_id: item.slug, item_variant: item.variantLabel || undefined });
  }, []);

  const update = useCallback<BasketContextValue["update"]>((key, patch) => {
    setItems((current) => current.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }, []);

  const remove = useCallback(
    (key: string) => {
      const removed = items.find((i) => i.key === key);
      if (removed) track("remove_from_quote", { item_id: removed.slug });
      setItems((current) => current.filter((i) => i.key !== key));
    },
    [items],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, ready, add, update, remove, clear }),
    [items, ready, add, update, remove, clear],
  );
  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useQuoteBasket() {
  const context = useContext(BasketContext);
  if (!context) throw new Error("useQuoteBasket must be used inside QuoteBasketProvider");
  return context;
}
