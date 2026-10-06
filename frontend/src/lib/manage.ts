/** Browser-side client for the staff dashboard. All calls go to the
 * same-origin /api/manage/ proxy; Django enforces sign-in, CSRF and
 * permissions on every request. */

export type Status = "draft" | "published" | "archived";

export const STATUS_LABELS: Record<Status, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Hidden",
};

export const AVAILABILITY_LABELS: Record<string, string> = {
  in_stock: "In stock",
  on_order: "Available on order",
  unknown: "On enquiry",
};

export interface SessionUser {
  username: string;
  name: string;
  is_superuser: boolean;
  groups: string[];
}

export interface Session {
  authenticated: boolean;
  user?: SessionUser;
  permissions?: string[];
  site_origin?: string;
}

/** Field-level or general error returned by the API. */
export class ApiError extends Error {
  status: number;
  fields: Record<string, string[]>;

  constructor(status: number, body: unknown) {
    const fields: Record<string, string[]> = {};
    let message = `Request failed (${status}).`;
    if (body && typeof body === "object") {
      for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
        const list = Array.isArray(value) ? value.map(describe) : [describe(value)];
        if (key === "detail" || key === "non_field_errors") message = list.join(" ");
        else fields[key] = list;
      }
      if (Object.keys(fields).length && message.startsWith("Request failed")) {
        message = "Please correct the highlighted fields.";
      }
    }
    if (status === 403 && message.startsWith("Request failed")) message = "You don't have permission to do that.";
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

function describe(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : describe(v)}`)
      .join("; ");
  }
  return String(value);
}

function csrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

type Body = Record<string, unknown> | FormData;

export async function api<T = unknown>(path: string, options: { method?: string; body?: Body } = {}): Promise<T> {
  const method = options.method || (options.body ? "POST" : "GET");
  const headers: Record<string, string> = { Accept: "application/json" };
  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }
  if (method !== "GET") headers["X-CSRFToken"] = csrfToken();

  const response = await fetch(`/api/manage/${path.replace(/^\/+|\/+$/g, "")}`, {
    method,
    headers,
    body,
    credentials: "same-origin",
    cache: "no-store",
  });
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 || (response.status === 403 && /sign in|credentials/i.test(String(data?.detail)))) {
      window.dispatchEvent(new Event("dashboard:signed-out"));
    }
    throw new ApiError(response.status, data);
  }
  return data as T;
}

/** Build multipart form data for an upload (null clears an image). */
export function formData(values: Record<string, string | number | boolean | Blob | null | undefined>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) continue;
    if (value === null) form.append(key, "");
    else if (value instanceof Blob) form.append(key, value);
    else form.append(key, String(value));
  }
  return form;
}

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export function checkImage(file: File): string | null {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "Choose a JPEG, PNG or WebP image.";
  if (file.size > MAX_IMAGE_BYTES) return "That image is larger than 8 MB. Resize it and try again.";
  return null;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
