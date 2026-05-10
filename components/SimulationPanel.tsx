// components/SimulationPanel.tsx
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
    <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-6">
      <div className="flex gap-2">
        {PRESETS.map((n) => (
          <button
            key={n}
            onClick={() => handleRun(n)}
            className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium hover:bg-zinc-100"
          >
            Run {n.toLocaleString()}
          </button>
        ))}
      </div>
      {result ? <Distribution r={result} /> : null}
      {result ? <Education r={result} /> : null}
    </div>
  );
}

function Distribution({ r }: { r: SimResult }) {
  const yesPct = (r.yesCount / r.n) * 100;
  return (
    <div className="rounded-md border border-zinc-200 p-3">
      <div className="h-6 w-full overflow-hidden rounded bg-zinc-200 flex">
        <div className="bg-emerald-600" style={{ width: `${yesPct}%` }} />
        <div className="bg-rose-600 grow" />
      </div>
      <div className="mt-2 flex justify-between text-xs font-mono text-zinc-700">
        <span>YES {r.yesCount.toLocaleString()}</span>
        <span>
          Implied: {Math.round(r.impliedProbability * 100)}% &middot; Observed:{" "}
          {(r.observedProbability * 100).toFixed(1)}%
        </span>
        <span>NO {r.noCount.toLocaleString()}</span>
      </div>
    </div>
  );
}

function Education({ r }: { r: SimResult }) {
  const p = r.impliedProbability;
  const closeToFifty = Math.abs(p - 0.5) < 0.1;
  return (
    <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm leading-relaxed">
      <p className="text-xs uppercase tracking-wider font-semibold text-amber-800">
        What this means
      </p>
      <p className="mt-1">
        The market said YES <strong>{Math.round(p * 100)}%</strong> of the time.{" "}
        {closeToFifty
          ? "That's barely better than a coin — outcomes near 50/50 mean the market isn't strongly committed either way."
          : `Out of ${r.n.toLocaleString()} flips, ${r.yesCount.toLocaleString()} landed YES (${(r.observedProbability * 100).toFixed(1)}%). As n grows, observed converges toward implied.`}
        {" "}A 90/10 market is strongly committed; being wrong there is a real signal.
      </p>
    </div>
  );
}
