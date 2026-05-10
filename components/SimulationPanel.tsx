"use client";

import { useState } from "react";
import { simulate } from "@/lib/simulate";
import type { SimResult } from "@/lib/types";

type Props = {
  slug: string;
  question: string;
  yesProbability: number;
  onSimulationComplete?: (r: SimResult) => void;
};

const PRESETS = [100, 1000, 10000] as const;

export function SimulationPanel({ yesProbability, onSimulationComplete }: Props) {
  const [result, setResult] = useState<SimResult | null>(null);

  const handleRun = (n: number) => {
    const r = simulate(yesProbability, n);
    setResult(r);
    onSimulationComplete?.(r);
  };

  return (
    <section className="mt-12">
      <hr className="rule-double mb-6" />
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="eyebrow">Stress-test the Card</p>
          <h2 className="headline text-2xl sm:text-3xl mt-1">
            Run the Numbers
          </h2>
        </div>
        <p className="figure text-xs text-[var(--ink-faint)] hidden sm:block">
          repeat the wager <em>n</em> times
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((n) => (
          <button
            key={n}
            onClick={() => handleRun(n)}
            className="btn-ghost"
          >
            Run {n.toLocaleString()}
          </button>
        ))}
      </div>

      {result ? (
        <>
          <Distribution r={result} />
          <Education r={result} />
        </>
      ) : null}
    </section>
  );
}

function Distribution({ r }: { r: SimResult }) {
  const yesPct = (r.yesCount / r.n) * 100;
  return (
    <div className="mt-6 ticket p-4">
      <div className="flex justify-between items-baseline mb-3">
        <span className="eyebrow">{r.n.toLocaleString()} flips</span>
        <span className="figure text-xs text-[var(--ink-faint)]">
          implied vs. observed
        </span>
      </div>

      <div className="h-7 w-full overflow-hidden flex border border-[var(--ink)]">
        <div
          className="bg-[var(--green)] flex items-center justify-end pr-2 text-[10px] tracking-wide font-medium text-[var(--paper-bright)]"
          style={{
            width: `${yesPct}%`,
            fontFamily: "var(--font-mono)",
            minWidth: yesPct > 5 ? undefined : 0,
          }}
        >
          {yesPct > 12 ? "YES" : ""}
        </div>
        <div
          className="bg-[var(--oxblood)] grow flex items-center pl-2 text-[10px] tracking-wide font-medium text-[var(--paper-bright)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {100 - yesPct > 12 ? "NO" : ""}
        </div>
      </div>

      <div className="grid grid-cols-3 mt-3 text-xs">
        <div className="border-r border-[var(--rule)] pr-3">
          <span className="eyebrow text-[var(--ink-faint)] block">YES</span>
          <span className="figure text-lg text-[var(--green-deep)] font-semibold">
            {r.yesCount.toLocaleString()}
          </span>
        </div>
        <div className="border-r border-[var(--rule)] px-3 text-center space-y-1">
          <div>
            <span className="eyebrow text-[var(--ink-faint)]">Implied:</span>{" "}
            <span className="figure text-base text-[var(--ink)] font-semibold">
              {Math.round(r.impliedProbability * 100)}%
            </span>
          </div>
          <div>
            <span className="eyebrow text-[var(--ink-faint)]">Observed:</span>{" "}
            <span className="figure text-base text-[var(--ink)] font-semibold">
              {(r.observedProbability * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="pl-3 text-right">
          <span className="eyebrow text-[var(--ink-faint)] block">NO</span>
          <span className="figure text-lg text-[var(--oxblood-deep)] font-semibold">
            {r.noCount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function Education({ r }: { r: SimResult }) {
  const p = r.impliedProbability;
  const closeToFifty = Math.abs(p - 0.5) < 0.1;
  return (
    <div className="mt-4 border border-[var(--gold-deep)] bg-[rgba(199,154,68,0.08)] p-4">
      <p className="eyebrow text-[var(--gold-deep)] mb-2">Editor&rsquo;s Note</p>
      <p className="text-[0.95rem] leading-relaxed text-[var(--ink)]">
        <span
          className="float-left mr-2 mt-0.5 text-3xl leading-none text-[var(--oxblood)]"
          style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
        >
          {closeToFifty ? "T" : "T"}
        </span>
        {closeToFifty
          ? `he market said YES ${Math.round(p * 100)}% of the time — barely better than a coin. Outcomes near 50/50 mean the market isn't strongly committed either way.`
          : `he market said YES ${Math.round(p * 100)}% of the time. Out of ${r.n.toLocaleString()} flips, ${r.yesCount.toLocaleString()} landed YES (${(r.observedProbability * 100).toFixed(1)}%). As n grows, observed converges toward implied.`}{" "}
        A 90/10 market is strongly committed; being wrong there is a real signal.
      </p>
    </div>
  );
}
