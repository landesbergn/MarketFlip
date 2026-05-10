import { Suspense } from "react";
import { TrendingGrid } from "@/components/TrendingGrid";
import { SearchInput } from "@/components/SearchInput";
import { PageViewTracker } from "@/components/PageViewTracker";

export const metadata = {
  title: "MarketFlip — Today's Card",
  description:
    "Take a live Polymarket market, simulate a coin flip weighted by its odds, and see what the market is actually saying.",
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <PageViewTracker event={{ name: "home_viewed" }} />

      {/* Nameplate */}
      <header className="rise rise-1">
        <h1 className="headline text-6xl sm:text-7xl md:text-8xl">
          Market<span className="italic text-[var(--oxblood)]">Flip</span>
        </h1>
        <p className="mt-3 text-[var(--ink-soft)] text-base sm:text-lg italic">
          A weighted coin, drawn from the live odds.{" "}
          <span className="text-[var(--ink-faint)]">— Daily.</span>
        </p>
        <hr className="rule-double mt-6" />
      </header>

      {/* Search */}
      <section className="mt-10 rise rise-2">
        <p className="eyebrow mb-3">Find a market</p>
        <SearchInput />
      </section>

      {/* Today's card */}
      <section className="mt-14 rise rise-3">
        <div className="flex items-end justify-between mb-4">
          <h2 className="headline text-3xl sm:text-4xl">Today&rsquo;s Card</h2>
          <span className="eyebrow hidden sm:inline">By 24-hour Volume</span>
        </div>
        <hr className="rule mb-5" />
        <Suspense
          fallback={
            <p className="eyebrow text-[var(--ink-faint)]">
              Drawing the card&hellip;
            </p>
          }
        >
          <TrendingGrid />
        </Suspense>
      </section>
    </main>
  );
}
