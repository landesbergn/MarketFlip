import { NextRequest, NextResponse } from "next/server";
import { searchMarkets } from "@/lib/polymarket";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ results: [] });
  try {
    // Don't cache upstream — Polymarket's /public-search response can exceed
    // Next's 2MB data-cache ceiling and the warning is noisy. Each query is
    // typically unique anyway, so caching gives little benefit.
    const results = await searchMarkets(q, { cache: "no-store" });
    return NextResponse.json({ results });
  } catch (err) {
    console.error("search route error:", err);
    return NextResponse.json(
      { results: [], error: "upstream_failure" },
      { status: 502 }
    );
  }
}
