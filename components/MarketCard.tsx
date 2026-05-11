import Link from "next/link";
import type { FlippableMarket } from "@/lib/types";
import { fmtVol, fmtResolveDate } from "@/lib/fmt";

/**
 * A single market row in the home list. Renders as a horizontal row, not a card.
 * Left: question + meta. Right: big italic accent percentage.
 */
export function MarketCard({ market }: { market: FlippableMarket }) {
  const yes = market.outcomes[0];
  const yesPct = Math.round((yes?.probability ?? 0) * 100);
  const resolves = fmtResolveDate(market.endDate);
  const vol = market.volume24h > 0 ? fmtVol(market.volume24h) : null;

  return (
    <li className="border-b border-[var(--rule)]">
      <Link
        href={`/m/${market.slug}`}
        className="row-hover grid items-center gap-6 px-3 py-5"
        style={{ gridTemplateColumns: "1fr auto" }}
      >
        <div className="min-w-0">
          <p className="text-[22px] leading-[1.25] tracking-tight">
            {market.question}
          </p>
          <p className="figure mt-1.5 text-[11px] tracking-[0.05em] text-[var(--ink-mono)]">
            {[resolves, vol ? `vol ${vol}` : null].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="text-right min-w-[100px]">
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: 40,
              lineHeight: 1,
              color: "var(--accent)",
              fontStyle: "italic",
              letterSpacing: "-0.02em",
            }}
          >
            <span>{yesPct}</span>
            <span
              style={{
                fontSize: 22,
                color: "var(--ink)",
                fontStyle: "normal",
                marginLeft: 4,
                letterSpacing: 0,
              }}
            >
              %
            </span>
          </div>
          <p className="eyebrow mt-1 text-[9px]">YES</p>
        </div>
      </Link>
    </li>
  );
}
