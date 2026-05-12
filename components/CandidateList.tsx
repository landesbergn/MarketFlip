import Link from "next/link";
import type { ParentEvent } from "@/lib/types";
import { extractCandidateName } from "@/lib/fmt";

export function CandidateList({ event }: { event: ParentEvent }) {
  return (
    <div>
      <section className="pt-8 sm:pt-10 pb-6">
        <p className="eyebrow">The field</p>
        <p className="mt-3 sm:mt-4 text-[18px] sm:text-xl leading-snug max-w-2xl">
          Each candidate is its own coin. Probabilities sum below 100% — the
          market keeps room for what it doesn&rsquo;t know. Pick one to flip.
        </p>
      </section>

      <section className="pb-10">
        <hr className="border-0 border-t border-[var(--ink)] m-0" />
        <ul className="m-0 p-0 list-none">
          {event.subMarkets.map((s) => {
            const pct = Math.round(s.yesProbability * 100);
            return (
              <li key={s.slug} className="border-b border-[var(--rule)]">
                <Link
                  href={`/m/${s.slug}`}
                  className="row-hover candidate-row block w-full text-left px-1 py-3 sm:py-5"
                >
                  <span
                    className="candidate-name text-[17px] sm:text-[20px] leading-snug truncate"
                  >
                    {extractCandidateName(s.question)}
                  </span>
                  <span
                    className="candidate-pct text-right text-[22px] sm:text-[28px] italic whitespace-nowrap"
                    style={{ color: "var(--accent)", lineHeight: 1 }}
                  >
                    {pct}%
                  </span>
                  <span className="candidate-bar block h-2 bg-[var(--rule-soft)] relative">
                    <span
                      className="absolute inset-0 block"
                      style={{
                        width: `${Math.max(2, pct)}%`,
                        background: "var(--accent)",
                      }}
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
