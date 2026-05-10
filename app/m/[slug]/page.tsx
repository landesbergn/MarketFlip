// app/m/[slug]/page.tsx
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

  const market = await getMarketBySlug(slug, { cache: "no-store" }).catch(() => null);

  if (market) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Header />
        <MarketFlipClient market={market} />
        <History slug={slug} />
      </main>
    );
  }

  const event = await getEventBySlug(slug, { cache: "no-store" }).catch(() => null);

  if (event) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
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
    <header className="flex items-center justify-between mb-6 text-sm">
      <Link href="/" className="text-zinc-600 hover:text-zinc-900">← Back</Link>
      <RefreshOddsButton />
    </header>
  );
}
