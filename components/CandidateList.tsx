"use client";

import { useRef, useState } from "react";
import { CoinFlip } from "./CoinFlip";
import { MarketDescription } from "./MarketDescription";
import { ShareButton } from "./ShareButton";
import { History } from "./History";
import type { ParentEvent, FlipOutcome, HistoryEntry } from "@/lib/types";
import { track } from "@/lib/posthog";
import { addFlipToHistory, addFlipsToHistory } from "@/lib/storage";
import { extractCandidateName } from "@/lib/fmt";
import { flip as flipOnce } from "@/lib/flip";
import { formatSingleFlipShare } from "@/lib/share";

const RUN_COUNT = 100;

export function CandidateList({ event }: { event: ParentEvent }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [lastFlip, setLastFlip] = useState<FlipOutcome | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);

  const sub = event.subMarkets.find((s) => s.slug === selected) ?? null;
  const subUrl =
    typeof window !== "undefined" && sub
      ? window.location.href
      : sub?.slug ?? "";

  const handleRunHundred = () => {
    if (!sub || runningRef.current) return;
    runningRef.current = true;
    setRunning(true);

    let done = 0;
    let yesInRun = 0;
    const base = Date.now();
    const perFrame = 4;

    const tick = () => {
      const batch: HistoryEntry[] = [];
      for (let i = 0; i < perFrame && done < RUN_COUNT; i++) {
        const outcome = flipOnce(sub.yesProbability);
        if (outcome === "YES") yesInRun++;
        batch.push({
          slug: sub.slug,
          question: sub.question,
          outcomeLabel: sub.question,
          flippedTo: outcome,
          impliedProbability: sub.yesProbability,
          timestamp: base + done,
        });
        done++;
      }
      addFlipsToHistory(batch);
      setHistoryKey((k) => k + 1);

      if (done < RUN_COUNT) {
        requestAnimationFrame(tick);
      } else {
        runningRef.current = false;
        setRunning(false);
        track({
          name: "simulation_run",
          props: {
            slug: sub.slug,
            n: RUN_COUNT,
            observed_yes_count: yesInRun,
          },
        });
      }
    };
    requestAnimationFrame(tick);
  };

  return (
    <div>
      <section className="pt-10 pb-6">
        <p className="eyebrow">The field</p>
        <p className="mt-4 text-xl leading-snug max-w-2xl">
          Each candidate is its own coin. Probabilities sum below 100% — the
          market keeps room for what it doesn&rsquo;t know.
        </p>
      </section>

      <section className="pb-12">
        <p className="eyebrow mb-3">Pick one to flip</p>
        <hr className="border-0 border-t border-[var(--ink)] m-0" />
        <ul className="m-0 p-0 list-none">
          {event.subMarkets.map((s) => {
            const pct = Math.round(s.yesProbability * 100);
            const isSelected = selected === s.slug;
            return (
              <li key={s.slug} className="border-b border-[var(--rule)]">
                <button
                  onClick={() => {
                    setSelected(s.slug);
                    setLastFlip(null);
                  }}
                  className="row-hover w-full text-left grid items-center gap-6 px-3 py-5"
                  style={{
                    gridTemplateColumns: "220px 1fr 80px",
                    background: isSelected ? "var(--paper-soft)" : undefined,
                  }}
                >
                  <span className="text-[20px] leading-snug">
                    {extractCandidateName(s.question)}
                  </span>
                  <span className="block h-2 bg-[var(--rule-soft)] relative">
                    <span
                      className="absolute inset-0 block"
                      style={{
                        width: `${pct}%`,
                        background: "var(--accent)",
                      }}
                    />
                  </span>
                  <span
                    className="text-right text-[28px] italic"
                    style={{
                      color: "var(--accent)",
                      lineHeight: 1,
                    }}
                  >
                    {pct}%
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {sub && (
        <section className="pt-10 mt-10 border-t-2 border-[var(--ink)]">
          <CoinFlip
            slug={sub.slug}
            question={extractCandidateName(sub.question) + " wins."}
            yesProbability={sub.yesProbability}
            outcomeYesLabel={extractCandidateName(sub.question)}
            outcomeNoLabel="Someone else"
            onFlipComplete={(o: FlipOutcome) => {
              setLastFlip(o);
              track({
                name: "flip_executed",
                props: {
                  slug: sub.slug,
                  outcome: o,
                  implied_probability: sub.yesProbability,
                },
              });
              addFlipToHistory({
                slug: sub.slug,
                question: sub.question,
                outcomeLabel: sub.question,
                flippedTo: o,
                impliedProbability: sub.yesProbability,
                timestamp: Date.now(),
              });
              setHistoryKey((k) => k + 1);
            }}
          />

          {lastFlip && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
              <button
                className="btn-link"
                onClick={handleRunHundred}
                disabled={running}
              >
                {running ? "Running…" : "Run 100 →"}
              </button>
              <ShareButton
                slug={sub.slug}
                mode="single"
                text={formatSingleFlipShare({
                  question: sub.question,
                  yesProbability: sub.yesProbability,
                  flipped: lastFlip,
                  url: subUrl,
                })}
              />
            </div>
          )}

          <History
            slug={sub.slug}
            refreshKey={historyKey}
            yesProbability={sub.yesProbability}
          />
        </section>
      )}

      <MarketDescription text={event.description} />
    </div>
  );
}
