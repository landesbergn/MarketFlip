import { Suspense } from "react";
import { TrendingGrid } from "@/components/TrendingGrid";
import { PasteUrlInput } from "@/components/PasteUrlInput";
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
        <div className="flex items-center justify-between text-[var(--ink-soft)]">
          <span className="eyebrow">Vol. I · No. 001</span>
          <span className="eyebrow">A Wagering Almanac</span>
        </div>
        <hr className="rule mt-3" />
        <h1 className="headline mt-6 text-6xl sm:text-7xl md:text-8xl">
          Market<span className="italic text-[var(--oxblood)]">Flip</span>
        </h1>
        <p className="mt-3 text-[var(--ink-soft)] text-base sm:text-lg italic">
          A weighted coin, drawn from the live odds.{" "}
          <span className="text-[var(--ink-faint)]">— Daily.</span>
        </p>
        <hr className="rule-double mt-6" />
      </header>

      {/* Place a market */}
      <section className="mt-10 rise rise-2">
        <p className="eyebrow mb-3">Place a Market</p>
        <div className="space-y-4">
          <PasteUrlInput />
          <div className="flex items-center gap-3 text-[var(--ink-faint)]">
            <span className="h-px flex-1 bg-[var(--rule-soft)]" />
            <span className="eyebrow">or</span>
            <span className="h-px flex-1 bg-[var(--rule-soft)]" />
          </div>
          <SearchInput />
        </div>
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

      {/* Footer */}
      <footer className="mt-20 rise rise-4">
        <hr className="rule mb-4" />
        <div className="flex flex-wrap items-center justify-between gap-2 text-[var(--ink-faint)]">
          <span className="eyebrow">Set in Fraunces &amp; IBM Plex Mono</span>
          <span className="eyebrow">Live odds · Polymarket</span>
        </div>
      </footer>
    </main>
  );
}
