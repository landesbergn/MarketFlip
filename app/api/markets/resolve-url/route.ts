import { NextRequest, NextResponse } from "next/server";
import { resolvePolymarketUrl } from "@/lib/polymarket";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const url = (body.url ?? "").trim();
  if (!url) return NextResponse.json({ error: "missing_url" }, { status: 400 });

  const resolved = resolvePolymarketUrl(url);
  if (!resolved) {
    return NextResponse.json({ error: "unrecognized_url" }, { status: 400 });
  }

  return NextResponse.json({
    kind: resolved.kind,
    slug: resolved.slug,
    redirect: `/m/${resolved.slug}`,
  });
}
