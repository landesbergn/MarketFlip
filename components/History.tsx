"use client";

import { useEffect, useState } from "react";
import { readHistory, clearHistory } from "@/lib/storage";
import type { HistoryEntry } from "@/lib/types";

export function History({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (!open) return;
    setEntries(readHistory().filter((e) => e.slug === slug));
  }, [open, slug]);

  return (
    <div className="mt-12">
      <hr className="rule mb-4" />
      <button
        onClick={() => setOpen((o) => !o)}
        className="eyebrow text-[var(--ink-soft)] hover:text-[var(--oxblood)] transition-colors"
      >
        {open
          ? "− Hide ledger"
          : "+ Show flip history for this market"}
      </button>
      {open ? (
        <div className="mt-4 ticket p-4 cursor-default" style={{ transform: "none" }}>
          {entries.length === 0 ? (
            <p className="figure text-sm text-[var(--ink-faint)] italic">
              No flips yet for this market.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--rule-soft)]">
              {entries.map((e, i) => (
                <li
                  key={i}
                  className="flex justify-between items-baseline py-2 first:pt-0"
                >
                  <span className="text-sm">
                    <span
                      className={`figure font-semibold mr-2 ${
                        e.flippedTo === "YES"
                          ? "text-[var(--green-deep)]"
                          : "text-[var(--oxblood)]"
                      }`}
                    >
                      {e.flippedTo === "YES" ? "🎉 YES" : "🚨 NO"}
                    </span>
                    <span className="text-[var(--ink-soft)] italic">
                      — {e.outcomeLabel}
                    </span>
                  </span>
                  <span className="figure text-[10px] text-[var(--ink-faint)] tabular-nums">
                    {new Date(e.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {entries.length > 0 ? (
            <button
              onClick={() => {
                clearHistory();
                setEntries([]);
              }}
              className="mt-3 eyebrow text-[var(--oxblood)] hover:text-[var(--oxblood-deep)] transition-colors"
            >
              Clear all history
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
