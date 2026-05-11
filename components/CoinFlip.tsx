"use client";

import { useState } from "react";
import { flip } from "@/lib/flip";
import { questionToStatement } from "@/lib/fmt";
import type { FlipOutcome } from "@/lib/types";

export type CoinFlipProps = {
  slug: string;
  question: string;
  yesProbability: number;
  outcomeYesLabel: string;
  outcomeNoLabel: string;
  /** Total flip animation duration. 0 means instant (used in tests). */
  flipDurationMs?: number;
  onFlipComplete?: (outcome: FlipOutcome) => void;
};

type Phase = "idle" | "flipping" | "landed";

const FLIP_TURNS = 8; // even number of half-turns — same face returns to camera

export function CoinFlip(props: CoinFlipProps) {
  const {
    question,
    yesProbability,
    outcomeYesLabel,
    outcomeNoLabel,
    flipDurationMs = 1500,
    onFlipComplete,
  } = props;

  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<FlipOutcome | null>(null);
  const [rotation, setRotation] = useState(0); // accumulating rotateX
  const [flipCount, setFlipCount] = useState(0);

  const yesPct = Math.round(yesProbability * 100);
  const noPct = 100 - yesPct;
  const statement = questionToStatement(question);

  const handleFlip = () => {
    if (phase === "flipping") return;
    const outcome = flip(yesProbability);
    // Previous face (treat initial as YES at rotation=0).
    const previousFace: FlipOutcome = result ?? "YES";
    const sameFace = previousFace === outcome;
    const nextRotation =
      rotation + FLIP_TURNS * 180 + (sameFace ? 0 : 180);

    setResult(outcome);
    setRotation(nextRotation);
    setFlipCount((c) => c + 1);

    if (flipDurationMs <= 0) {
      setPhase("landed");
      onFlipComplete?.(outcome);
      return;
    }
    setPhase("flipping");
    setTimeout(() => {
      setPhase("landed");
      onFlipComplete?.(outcome);
    }, flipDurationMs);
  };

  return (
    <section
      className="py-10 grid gap-14 items-center"
      style={{ gridTemplateColumns: "220px 1fr" }}
    >
      <div className="grid place-items-end justify-self-center">
        <div className="coin-stage">
          <div className="coin-shadow" data-state={phase} />
          <div
            key={flipCount}
            className="coin-arc"
            data-state={phase}
          >
            <div
              className="coin-spin"
              data-state={phase}
              style={{ transform: `rotateX(${rotation}deg)` }}
            >
              <div className="coin-face coin-face--yes">
                {phase === "landed" && result === "YES"
                  ? "YES"
                  : phase === "idle"
                  ? "?"
                  : ""}
              </div>
              <div className="coin-face coin-face--no">
                {phase === "landed" && result === "NO" ? "NO" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-label={`Implied odds: ${outcomeYesLabel} ${yesPct}%, ${outcomeNoLabel} ${noPct}%`}
      >
        {phase === "idle" && (
          <>
            <h2 className="text-3xl font-semibold tracking-tight">
              Draw one future.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)] max-w-sm">
              One flip, weighted to the odds.
            </p>
            <button onClick={handleFlip} className="btn-primary mt-6">
              Flip the coin
            </button>
          </>
        )}

        {phase === "flipping" && (
          <p className="text-2xl italic text-[var(--ink-faint)]">drawing&hellip;</p>
        )}

        {phase === "landed" && result && (
          <Result
            result={result}
            statement={statement}
            yesPct={yesPct}
            onAgain={handleFlip}
          />
        )}
      </div>
    </section>
  );
}

function Result({
  result,
  statement,
  yesPct,
  onAgain,
}: {
  result: FlipOutcome;
  statement: string;
  yesPct: number;
  onAgain: () => void;
}) {
  const noPct = 100 - yesPct;
  const landedOdds = result === "YES" ? yesPct : noPct;

  return (
    <div>
      <p className="eyebrow">The coin landed on</p>
      <p
        role="status"
        className="display mt-1"
        style={{
          fontSize: 84,
          color: result === "YES" ? "var(--accent)" : "var(--ink)",
          lineHeight: 0.95,
          fontStyle: "italic",
        }}
      >
        {result}.
      </p>
      <p className="mt-3 text-[22px] leading-snug max-w-md">
        {result === "YES" ? (
          <span>{statement}</span>
        ) : (
          <span>
            Not&hairsp;—&hairsp;<span className="text-[var(--ink-soft)]">{statement}</span>
          </span>
        )}
      </p>
      <p className="figure mt-2 text-[11px] tracking-[0.15em] uppercase text-[var(--ink-mono)]">
        Market priced {result} at {landedOdds}%.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button onClick={onAgain} className="btn-outline">
          Flip again
        </button>
        <span data-slot="result-actions" />
      </div>
    </div>
  );
}
