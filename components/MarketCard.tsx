import Link from "next/link";
import type { FlippableMarket } from "@/lib/types";

export function MarketCard({ market }: { market: FlippableMarket }) {
  const yes = market.outcomes[0];
  const no = market.outcomes[1];
  const yesPct = Math.round((yes?.probability ?? 0) * 100);
  const noPct = 100 - yesPct;

  return (
    <Link href={`/m/${market.slug}`} className="ticket block p-4 group">
      <div className="flex items-center justify-between mb-2">
        <span className="eyebrow text-[var(--ink-faint)]">
          № {market.slug.slice(0, 6).toUpperCase()}
        </span>
        <span className="figure text-xs text-[var(--ink-faint)] group-hover:text-[var(--oxblood)] transition-colors">
          ↗
        </span>
      </div>

      <p
        className="text-[1.05rem] leading-snug font-semibold text-[var(--ink)] line-clamp-3 mb-3"
        style={{ fontVariationSettings: '"SOFT" 0, "opsz" 32' }}
      >
        {market.question}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="pill-yes">{`${yes?.label ?? "Y"} ${yesPct}%`}</span>
          <span className="pill-no">{`${no?.label ?? "N"} ${noPct}%`}</span>
        </div>
        <span className="figure text-[10px] text-[var(--ink-faint)] tabular-nums">
          ${formatVolume(market.volume24h)}
        </span>
      </div>
    </Link>
  );
}

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString("en-US");
}
