import { notFound } from "next/navigation";
import Link from "next/link";
import { getMarketBySlug, getEventBySlug } from "@/lib/polymarket";
import { CandidateList } from "@/components/CandidateList";
import { History } from "@/components/History";
import { RefreshOddsButton } from "@/components/RefreshOddsButton";
import { MarketFlipClient } from "./MarketFlipClient";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export default async function MarketPage({ params }: PageProps) {
  const { slug } = await params;

  const market = await getMarketBySlug(slug, { cache: "no-store" }).catch(
    () => null
  );

  if (market) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <Header />
        <MarketFlipClient market={market} />
        <History slug={slug} />
      </main>
    );
  }

  const event = await getEventBySlug(slug, { cache: "no-store" }).catch(
    () => null
  );

  if (event) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <Header />
        <CandidateList event={event} />
        <History slug={slug} />
      </main>
    );
  }

  notFound();
}

function Header() {
  return (
    <header className="rise rise-1">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="eyebrow text-[var(--ink-soft)] hover:text-[var(--oxblood)] transition-colors"
        >
          ← Marketflip
        </Link>
        <RefreshOddsButton />
      </div>
      <hr className="rule mt-3 mb-2" />
    </header>
  );
}
