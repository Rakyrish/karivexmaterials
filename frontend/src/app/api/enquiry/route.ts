import { NextResponse, type NextRequest } from "next/server";

import { API_BASE_URL } from "@/lib/api";

const MAX_BODY_BYTES = 64 * 1024;

/** Same-origin endpoint for quote/contact forms. Forwards to the Django
 * API on the internal network; Django validates, stores, rate-limits and
 * notifies. The visitor's IP (as set by the reverse proxy) is passed on for
 * rate limiting. */
export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ detail: "Unsupported content type." }, { status: 415 });
  }
  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return NextResponse.json({ detail: "Request too large." }, { status: 413 });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) headers["X-Forwarded-For"] = forwardedFor;

  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/enquiries/`, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { detail: "The enquiry service is temporarily unavailable. Please try again or contact us directly." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
