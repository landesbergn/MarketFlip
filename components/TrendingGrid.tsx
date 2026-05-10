import { getTrendingMarkets } from "@/lib/polymarket";
import type { FlippableMarket } from "@/lib/types";
import { MarketCard } from "./MarketCard";
import { StaleBanner } from "./StaleBanner";

export const revalidate = 60;

export async function TrendingGrid() {
  let markets: FlippableMarket[] = [];
  let stale = false;
  try {
    markets = await getTrendingMarkets(12, { next: { revalidate: 60 } });
  } catch {
    markets = [];
    stale = true;
  }

  if (markets.length === 0) {
    return (
      <div className="border border-[var(--rule)] bg-[var(--paper-bright)] px-6 py-10 text-center">
        <p className="eyebrow text-[var(--ink-faint)]">No live markets.</p>
        <p className="figure mt-2 text-xs text-[var(--ink-soft)]">
          Try again in a minute.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stale ? <StaleBanner /> : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {markets.map((m) => (
          <MarketCard key={m.slug} market={m} />
        ))}
      </div>
    </div>
  );
}
