import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const ALLOWED_TAGS = new Set(["catalog", "settings"]);

function secretMatches(provided: string | null): boolean {
  const expected = process.env.REVALIDATE_SECRET || "";
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Called by Django after catalogue or settings changes so public pages
 * show admin edits on the next request. */
export async function POST(request: NextRequest) {
  if (!secretMatches(request.headers.get("x-revalidate-secret"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { tags?: unknown };
  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => ALLOWED_TAGS.has(t as string)) : [];
  for (const tag of tags) {
    // expire: 0 — the next request fetches fresh data instead of serving stale.
    revalidateTag(tag, { expire: 0 });
  }
  return NextResponse.json({ ok: true, revalidated: tags });
}
