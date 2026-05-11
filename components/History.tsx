"use client";

import { useEffect, useState } from "react";
import { readHistory, clearHistory } from "@/lib/storage";
import type { HistoryEntry } from "@/lib/types";

type Props = {
  slug: string;
  /**
   * Bumped by the parent every time a new flip lands so the component
   * re-reads localStorage and re-renders the distribution.
   */
  refreshKey?: number;
  /**
   * Implied YES probability — used to anchor the comparison line
   * (implied vs. observed).
   */
  yesProbability: number;
};

export function History({ slug, refreshKey = 0, yesProbability }: Props) {
  const [open, setOpen] = useState(true);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(readHistory().filter((e) => e.slug === slug));
  }, [slug, refreshKey]);

  // Hide entirely if there are zero flips for this market.
  if (entries.length === 0) return null;

  const yesCount = entries.filter((e) => e.flippedTo === "YES").length;
  const noCount = entries.length - yesCount;
  const observed = entries.length > 0 ? (yesCount / entries.length) * 100 : 0;
  const implied = Math.round(yesProbability * 100);

  return (
    <section className="mt-10 pt-8 border-t border-[var(--rule)]">
      <div className="flex items-baseline justify-between">
        <button
          onClick={() => setOpen((o) => !o)}
          className="eyebrow"
          style={{
            background: "transparent",
            border: 0,
            padding: 0,
            cursor: "pointer",
          }}
          aria-expanded={open}
        >
          {open
            ? "− Your flip history for this market"
            : `+ Your flip history for this market · ${entries.length} ${entries.length === 1 ? "flip" : "flips"}`}
        </button>
        {open && entries.length > 0 && (
          <button
            onClick={() => {
              clearHistory();
              setEntries([]);
            }}
            className="figure text-[10px] tracking-[0.15em] uppercase text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors"
            style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
          >
            Clear
          </button>
        )}
      </div>

      {open && (
        <>
          <p className="mt-3 text-[22px] leading-snug max-w-[720px]">
            Across your{" "}
            <span style={{ color: "var(--accent)" }}>{entries.length}</span>{" "}
            {entries.length === 1 ? "flip" : "flips"}, YES came up{" "}
            <span style={{ color: "var(--accent)" }}>{yesCount}</span>{" "}
            {yesCount === 1 ? "time" : "times"}.{" "}
            <span className="text-[var(--ink-soft)] italic">
              Implied: {implied}%. Yours: {observed.toFixed(0)}%.
            </span>
          </p>

          <div className="mt-5">
            <FlipDots entries={entries} />
            <div className="flex gap-6 mt-4">
              <LegendDot solid label={`${yesCount} YES`} />
              <LegendDot solid={false} label={`${noCount} NO`} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function FlipDots({ entries }: { entries: HistoryEntry[] }) {
  // Render newest first, left-to-right.
  const ordered = [...entries].reverse();
  const size = 14;
  const gap = 4;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap,
        maxWidth: "100%",
      }}
    >
      {ordered.map((e, i) => {
        const filled = e.flippedTo === "YES";
        return (
          <div
            key={`${e.timestamp}-${i}`}
            title={`${e.flippedTo} · ${new Date(e.timestamp).toLocaleString()}`}
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              background: filled ? "var(--accent)" : "transparent",
              border: filled ? "none" : "1.25px solid var(--ink)",
              opacity: filled ? 1 : 0.55,
            }}
          />
        );
      })}
    </div>
  );
}

function LegendDot({ solid, label }: { solid: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: solid ? "var(--accent)" : "transparent",
          border: solid ? "none" : "1.25px solid var(--ink)",
          opacity: solid ? 1 : 0.55,
        }}
      />
      <span className="eyebrow" style={{ fontSize: 10 }}>
        {label}
      </span>
    </div>
  );
}
