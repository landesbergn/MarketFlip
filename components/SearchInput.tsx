"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FlippableMarket } from "@/lib/types";
import { track } from "@/lib/posthog";

export function SearchInput() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<FlippableMarket[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    let cancelled = false;
    const id = setTimeout(async () => {
      setLoading(true);
      track({ name: "market_searched", props: { query: q.trim() } });
      try {
        const res = await fetch(
          `/api/markets/search?q=${encodeURIComponent(q.trim())}`
        );
        if (!res.ok) throw new Error("search failed");
        const data = (await res.json()) as { results: FlippableMarket[] };
        if (!cancelled) setResults(data.results);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [q]);

  return (
    <div className="w-full">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] pointer-events-none">
          ✦
        </span>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the wire…"
          aria-label="Search markets"
          className="paper-input w-full text-base pl-9 pr-3 py-3"
          style={{ borderRadius: "2px" }}
        />
      </div>
      {loading ? (
        <p className="eyebrow mt-3 text-[var(--ink-faint)]">
          Inquiring&hellip;
        </p>
      ) : results && results.length === 0 ? (
        <p className="eyebrow mt-3 text-[var(--ink-faint)]">No matches.</p>
      ) : results ? (
        <ul className="mt-3 divide-y divide-[var(--rule-soft)] border-t border-b border-[var(--rule-soft)]">
          {results.slice(0, 8).map((m) => (
            <li key={m.slug}>
              <Link
                href={`/m/${m.slug}`}
                className="block px-1 py-2.5 hover:bg-[var(--paper-bright)] transition-colors group"
              >
                <span className="text-[0.95rem] text-[var(--ink)] group-hover:text-[var(--oxblood)]">
                  {m.question}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
