"use client";

import { useState } from "react";
import { flip } from "@/lib/flip";
import type { FlipOutcome } from "@/lib/types";

export type CoinFlipProps = {
  slug: string;
  question: string;
  yesProbability: number;
  outcomeYesLabel: string;
  outcomeNoLabel: string;
  flipDurationMs?: number;
  onFlipComplete?: (outcome: FlipOutcome) => void;
};

type Phase = "idle" | "flipping" | "revealed";

export function CoinFlip(props: CoinFlipProps) {
  const {
    question,
    yesProbability,
    outcomeYesLabel,
    outcomeNoLabel,
    flipDurationMs = 1900,
    onFlipComplete,
  } = props;

  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<FlipOutcome | null>(null);

  const handleFlip = () => {
    if (phase === "flipping") return;
    const outcome = flip(yesProbability);
    setResult(outcome);
    if (flipDurationMs <= 0) {
      setPhase("revealed");
      onFlipComplete?.(outcome);
      return;
    }
    setPhase("flipping");
    setTimeout(() => {
      setPhase("revealed");
      onFlipComplete?.(outcome);
    }, flipDurationMs);
  };

  const yesPct = Math.round(yesProbability * 100);
  const noPct = 100 - yesPct;
  const shownLabel =
    result === "YES" ? outcomeYesLabel : result === "NO" ? outcomeNoLabel : "";

  return (
    <section className="flex flex-col items-center text-center gap-7 py-8">
      <div className="space-y-3">
        <p className="eyebrow text-[var(--ink-faint)]">The Wager</p>
        <h1
          className="headline text-3xl sm:text-4xl md:text-5xl max-w-2xl mx-auto"
          style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1, "opsz" 144' }}
        >
          {question}
        </h1>
        <hr className="rule mx-auto w-24" />
        <div
          className="flex justify-center gap-2 text-sm"
          aria-label={`Implied odds: ${outcomeYesLabel} ${yesPct}%, ${outcomeNoLabel} ${noPct}%`}
        >
          <span className="pill-yes">{`${outcomeYesLabel} ${yesPct}%`}</span>
          <span className="pill-no">{`${outcomeNoLabel} ${noPct}%`}</span>
        </div>
      </div>

      <Coin phase={phase} result={result} />

      {phase === "revealed" && result ? (
        <div className="space-y-1">
          <p className="eyebrow text-[var(--ink-faint)]">The Verdict</p>
          <p
            role="status"
            className={`verdict ${
              result === "YES" ? "verdict--yes" : "verdict--no"
            }`}
          >
            {result === "YES" ? "\u{1F389}" : "\u{1F6A8}"} {result}
          </p>
          <p className="figure text-sm text-[var(--ink-soft)]">
            ({shownLabel})
          </p>
        </div>
      ) : phase === "flipping" ? (
        <p className="eyebrow text-[var(--ink-faint)] tracking-[0.4em]">
          ··· flipping ···
        </p>
      ) : null}

      <button
        onClick={handleFlip}
        disabled={phase === "flipping"}
        className="btn-flip"
      >
        {phase === "idle"
          ? "Flip the Coin"
          : phase === "flipping"
          ? "Flipping…"
          : "Flip Again"}
      </button>
    </section>
  );
}

function Coin({ phase, result }: { phase: Phase; result: FlipOutcome | null }) {
  return (
    <div className="coin-stage">
      <div className="coin" data-phase={phase} data-result={result ?? ""}>
        <div className="coin-face face-heads">
          <span className="coin-mark coin-mark--top">Marketflip</span>
          <span className="coin-glyph">✓</span>
          <span className="coin-mark coin-mark--bottom">Yes</span>
        </div>
        <div className="coin-face face-tails">
          <span className="coin-mark coin-mark--top">Marketflip</span>
          <span className="coin-glyph">✕</span>
          <span className="coin-mark coin-mark--bottom">No</span>
        </div>
      </div>
    </div>
  );
}
