import "server-only";

import { connection } from "next/server";

import type {
  Application,
  Category,
  Facets,
  Paginated,
  ProductCard,
  ProductDetail,
  ProductFilters,
  SiteSettings,
  SitemapData,
} from "./types";

const API_BASE_URL = (process.env.API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");

/** Fallback revalidation window. Admin saves also trigger immediate
 * on-demand revalidation through /api/revalidate. */
const REVALIDATE_SECONDS = 300;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function apiGet<T>(path: string, tags: string[]): Promise<T | null> {
  // Pages using catalogue data render per request (never at build time),
  // while the fetch results themselves are cached and tag-revalidated.
  await connection();
  const response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS, tags },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new ApiError(response.status, `API ${path} responded ${response.status}`);
  }
  return (await response.json()) as T;
}

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await apiGet<SiteSettings>("/site-settings/", ["settings"]);
  if (!data) throw new ApiError(404, "Site settings missing");
  return data;
}

export async function getCategories(): Promise<Category[]> {
  return (await apiGet<Category[]>("/categories/", ["catalog"])) ?? [];
}

export function getCategory(slug: string) {
  return apiGet<Category>(`/categories/${encodeURIComponent(slug)}/`, ["catalog"]);
}

export async function getApplications(): Promise<Application[]> {
  return (await apiGet<Application[]>("/applications/", ["catalog"])) ?? [];
}

export function getApplication(slug: string) {
  return apiGet<Application>(`/applications/${encodeURIComponent(slug)}/`, ["catalog"]);
}

export async function getProducts(filters: ProductFilters = {}): Promise<Paginated<ProductCard>> {
  const data = await apiGet<Paginated<ProductCard>>(
    `/products/${query({ ...filters })}`,
    ["catalog"],
  );
  // DRF returns 404 for an out-of-range page.
  return data ?? { count: 0, page: filters.page ?? 1, num_pages: 0, page_size: 24, results: [] };
}

export function getProduct(slug: string) {
  return apiGet<ProductDetail>(`/products/${encodeURIComponent(slug)}/`, ["catalog"]);
}

export async function getFacets(scope: { category?: string; application?: string }): Promise<Facets> {
  return (
    (await apiGet<Facets>(`/products/facets/${query(scope)}`, ["catalog"])) ?? {
      product_count: 0,
      applications: [],
      availability: [],
      facets: [],
    }
  );
}

export async function getSitemapData(): Promise<SitemapData> {
  const data = await apiGet<SitemapData>("/sitemap/", ["catalog"]);
  return data ?? { latest_product_update: null, products: [], categories: [], applications: [] };
}

export async function getRedirect(path: string): Promise<string | null> {
  const data = await apiGet<{ new_path: string }>(`/redirects/${query({ path })}`, ["catalog"]);
  return data?.new_path ?? null;
}

export { API_BASE_URL };
