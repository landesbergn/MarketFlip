import Link from "next/link";
import type { FlippableMarket } from "@/lib/types";

export function MarketCard({ market }: { market: FlippableMarket }) {
  const yes = market.outcomes[0];
  const no = market.outcomes[1];
  const yesPct = Math.round((yes?.probability ?? 0) * 100);
  const noPct = 100 - yesPct;

  return (
    <Link
      href={`/m/${market.slug}`}
      className="ticket flex flex-col p-4 group min-h-[8.5rem]"
    >
      <p className="text-[1rem] leading-snug font-semibold text-[var(--ink)] flex-1 [overflow-wrap:anywhere] [hyphens:auto]">
        {market.question}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex gap-1.5 flex-wrap">
          <span className="pill-yes">{`${yes?.label ?? "Y"} ${yesPct}%`}</span>
          <span className="pill-no">{`${no?.label ?? "N"} ${noPct}%`}</span>
        </div>
        {market.volume24h > 0 ? (
          <span className="figure text-[10px] text-[var(--ink-faint)] tabular-nums whitespace-nowrap">
            ${formatVolume(market.volume24h)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString("en-US");
}
