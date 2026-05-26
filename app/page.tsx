import { Suspense } from "react";
import { TrendingGrid } from "@/components/TrendingGrid";
import { SearchInput } from "@/components/SearchInput";
import { Nameplate } from "@/components/Nameplate";

export const metadata = {
  title: "MarketFlip — Flip a market",
  description:
    "Flip live Polymarket prediction markets as coins weighted to their implied probabilities. Each market is a coin weighted to its live odds — pull one for a flip, or simulate a thousand.",
  alternates: { canonical: "/" },
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.marketflip.xyz";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MarketFlip",
  alternateName: "MarketFlip — Flip a market",
  url: SITE_URL,
  description:
    "Flip live Polymarket prediction-market questions as coins weighted to their implied probabilities. Pull one flip or simulate a thousand.",
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "MarketFlip",
    url: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD is consumed by Google/LLM crawlers; not rendered to users.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Nameplate />
      <main className="mx-auto max-w-[1024px] px-5 sm:px-8 lg:px-14">
        {/* Heading exists for crawlers and screen readers — sr-only keeps
            the visual layout unchanged. Bing flagged the homepage as
            missing an <h1>; the printed wordmark in <Nameplate> isn't
            semantic. */}
        <h1 className="sr-only">
          MarketFlip — flip live Polymarket prediction markets as coins
          weighted to their implied probabilities
        </h1>
        {/* Tagline */}
        <section className="rise rise-1 pt-4 sm:pt-6 pb-6 sm:pb-7">
          <p className="max-w-[520px] text-[18px] leading-relaxed text-[var(--ink-soft)] italic">
            Each market is a coin weighted to its live odds.
          </p>
        </section>

        {/* Search */}
        <section className="rise rise-2">
          <SearchInput />
        </section>

        {/* Today's list */}
        <section className="rise rise-3 mt-7 sm:mt-8 pb-12">
          <p className="eyebrow mb-3.5">Today &middot; by 24h volume</p>
          <hr className="border-0 border-t border-[var(--ink)] m-0" />
          <Suspense
            fallback={
              <p className="eyebrow text-[var(--ink-faint)] py-6">
                Drawing the card&hellip;
              </p>
            }
          >
            <TrendingGrid />
          </Suspense>
        </section>
      </main>
    </>
  );
}
