// app/page.tsx
import { Suspense } from "react";
import { TrendingGrid } from "@/components/TrendingGrid";
import { PasteUrlInput } from "@/components/PasteUrlInput";
import { SearchInput } from "@/components/SearchInput";
import { PageViewTracker } from "@/components/PageViewTracker";

export const metadata = {
  title: "MarketFlip — flip a coin against a Polymarket market",
  description:
    "Take a live Polymarket market, simulate a coin flip weighted by its odds, and see what the market is actually saying.",
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <PageViewTracker event={{ name: "home_viewed" }} />
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold tracking-tight">🪙 MarketFlip</h1>
        <p className="text-xs text-zinc-500">trending · search</p>
      </header>

      <section className="space-y-3 mb-6">
        <PasteUrlInput />
        <SearchInput />
      </section>

      <section>
        <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500 font-semibold">
          Trending now
        </p>
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading markets…</p>}>
          <TrendingGrid />
        </Suspense>
      </section>
    </main>
  );
}
