import { type NextRequest } from "next/server";

import { API_BASE_URL } from "@/lib/api";

/** Same-origin pass-through for the staff dashboard to Django's
 * /api/manage/. Django does all authentication (session cookie), CSRF
 * checking and permission checks; this only forwards the request and
 * relays the response, including Set-Cookie. */

const FORWARD_REQUEST_HEADERS = [
  "accept",
  "content-type",
  "cookie",
  "origin",
  "referer",
  "x-csrftoken",
  "x-forwarded-for",
  "x-forwarded-proto",
  "user-agent",
];
const FORWARD_RESPONSE_HEADERS = ["content-type", "set-cookie", "vary"];
const MAX_BODY_BYTES = 12 * 1024 * 1024; // the largest image upload Django accepts, plus form overhead
const SEGMENT = /^[A-Za-z0-9_-]+$/;

async function proxy(request: NextRequest, { params }: RouteContext<"/api/manage/[...path]">) {
  const { path } = await params;
  if (!path.length || !path.every((segment) => SEGMENT.test(segment))) {
    return Response.json({ detail: "Not found." }, { status: 404 });
  }
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) {
    return Response.json({ detail: "Upload too large (maximum 8 MB per image)." }, { status: 413 });
  }

  const headers = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const url = `${API_BASE_URL}/api/manage/${path.join("/")}/${request.nextUrl.search}`;

  try {
    const upstream = await fetch(url, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(60_000),
    });
    const responseHeaders = new Headers({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" });
    for (const name of FORWARD_RESPONSE_HEADERS) {
      if (name === "set-cookie") {
        for (const cookie of upstream.headers.getSetCookie()) responseHeaders.append("set-cookie", cookie);
      } else {
        const value = upstream.headers.get(name);
        if (value) responseHeaders.set(name, value);
      }
    }
    return new Response(upstream.status === 204 ? null : await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { detail: "The content service is not responding. Try again in a moment." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
