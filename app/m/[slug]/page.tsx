import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarketBySlug, getEventBySlug } from "@/lib/polymarket";
import { CandidateList } from "@/components/CandidateList";
import { Nameplate } from "@/components/Nameplate";
import { MarketDescription } from "@/components/MarketDescription";
import { MarketFlipClient } from "./MarketFlipClient";
import type { FlippableMarket } from "@/lib/types";
import { fmtResolveDate, reframeQuestion } from "@/lib/fmt";

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.marketflip.xyz";

type PageProps = { params: Promise<{ slug: string }> };

// Inline JSON-LD payload — invisible to readers but parsed by Google
// and LLM crawlers. Kept inline so each render uses fresh probabilities.
function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const market = await getMarketBySlug(slug, { cache: "no-store" }).catch(
    () => null
  );
  const question = market
    ? reframeQuestion(
        market.question,
        market.outcomes[0]?.label,
        market.outcomes[1]?.label
      )
    : null;
  // Reference the sitewide opengraph-image. Overriding openGraph in a
  // route disables Next.js's file-based image inheritance, so we point
  // at the same generated URL explicitly.
  const sharedImage = "/opengraph-image";
  const canonicalPath = `/m/${slug}`;
  if (!question) {
    const event = await getEventBySlug(slug, { cache: "no-store" }).catch(
      () => null
    );
    if (!event) return {};
    const eventDescription = `${event.question} — flip this Polymarket prediction market on MarketFlip. Each market is a coin weighted to its live implied odds.`;
    return {
      title: event.question,
      description: eventDescription,
      alternates: { canonical: canonicalPath },
      openGraph: {
        title: event.question,
        description: eventDescription,
        url: canonicalPath,
        images: [sharedImage],
      },
      twitter: {
        card: "summary_large_image",
        title: event.question,
        description: eventDescription,
        images: [sharedImage],
      },
    };
  }
  const yesPct = Math.round((market!.outcomes[0]?.probability ?? 0) * 100);
  const description = `Polymarket implies ${yesPct}% — the market sees yes in ${yesPct} of 100 futures. Flip the coin on MarketFlip.`;
  return {
    title: question,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: question,
      description,
      url: canonicalPath,
      images: [sharedImage],
    },
    twitter: {
      card: "summary_large_image",
      title: question,
      description,
      images: [sharedImage],
    },
  };
}

export default async function MarketPage({ params }: PageProps) {
  const { slug } = await params;

  const market = await getMarketBySlug(slug, { cache: "no-store" }).catch(
    () => null
  );

  if (market) {
    // Only show a "← The field" back link for true multi-candidate
    // events (e.g. "2028 Presidential" with one sub-market per candidate).
    // We skip:
    //  - Standalone binary markets with no parent event.
    //  - Events whose slug matches the market's own slug — those are
    //    aggregator wrappers (a sports game's moneyline + props +
    //    spreads all share the parent slug), not a field of peers the
    //    user navigated through.
    const parent = market.parentEvent;
    let fieldBack: { href: string; label: string } | null = null;
    if (parent && parent.slug !== market.slug) {
      const parentEvent = await getEventBySlug(parent.slug, {
        next: { revalidate: 300 },
      }).catch(() => null);
      if (parentEvent && parentEvent.subMarkets.length > 1) {
        fieldBack = { href: `/m/${parent.slug}`, label: "← The field" };
      }
    }
    const question = reframeQuestion(
      market.question,
      market.outcomes[0]?.label,
      market.outcomes[1]?.label
    );
    const yesPct = Math.round((market.outcomes[0]?.probability ?? 0) * 100);
    const noPct = 100 - yesPct;
    const pageUrl = `${SITE_URL}/m/${slug}`;
    const marketJsonLd = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      url: pageUrl,
      mainEntity: {
        "@type": "Question",
        name: question,
        text: market.question,
        ...(market.description ? { description: market.description } : {}),
        ...(market.endDate ? { dateModified: new Date().toISOString() } : {}),
        answerCount: 2,
        suggestedAnswer: [
          {
            "@type": "Answer",
            text: `${market.outcomes[0]?.label ?? "Yes"} — implied probability ${yesPct}% on Polymarket.`,
          },
          {
            "@type": "Answer",
            text: `${market.outcomes[1]?.label ?? "No"} — implied probability ${noPct}% on Polymarket.`,
          },
        ],
      },
      isPartOf: {
        "@type": "WebSite",
        name: "MarketFlip",
        url: SITE_URL,
      },
    };
    return (
      <>
        <JsonLd data={marketJsonLd} />
        <Nameplate
          showBack={fieldBack !== null}
          backHref={fieldBack?.href}
          backLabel={fieldBack?.label}
        />
        <main className="mx-auto max-w-[1024px] px-5 sm:px-8 lg:px-14 pb-[calc(96px+env(safe-area-inset-bottom))] lg:pb-12">
          <MarketFlipClient market={market} />
        </main>
      </>
    );
  }

  const event = await getEventBySlug(slug, { cache: "no-store" }).catch(
    () => null
  );

  if (event) {
    const eventPageUrl = `${SITE_URL}/m/${slug}`;

    // Single-market event: flatten directly into the binary flip UI.
    if (event.subMarkets.length === 1) {
      const sub = event.subMarkets[0];
      const synthetic: FlippableMarket = {
        id: event.slug,
        slug: event.slug,
        question: event.question,
        description: event.description,
        outcomes: [
          { label: "Yes", probability: sub.yesProbability },
          { label: "No", probability: 1 - sub.yesProbability },
        ],
        endDate: event.endDate,
        volume24h: 0,
        url: event.url,
      };
      const yesPct = Math.round(sub.yesProbability * 100);
      const singleJsonLd = {
        "@context": "https://schema.org",
        "@type": "QAPage",
        url: eventPageUrl,
        mainEntity: {
          "@type": "Question",
          name: event.question,
          text: event.question,
          ...(event.description ? { description: event.description } : {}),
          answerCount: 2,
          suggestedAnswer: [
            {
              "@type": "Answer",
              text: `Yes — implied probability ${yesPct}% on Polymarket.`,
            },
            {
              "@type": "Answer",
              text: `No — implied probability ${100 - yesPct}% on Polymarket.`,
            },
          ],
        },
        isPartOf: { "@type": "WebSite", name: "MarketFlip", url: SITE_URL },
      };
      return (
        <>
          <JsonLd data={singleJsonLd} />
          <Nameplate />
          <main className="mx-auto max-w-[1024px] px-5 sm:px-8 lg:px-14 pb-[calc(96px+env(safe-area-inset-bottom))] lg:pb-12">
            <MarketFlipClient market={synthetic} />
          </main>
        </>
      );
    }

    const fieldJsonLd = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      url: eventPageUrl,
      mainEntity: {
        "@type": "Question",
        name: event.question,
        text: event.question,
        ...(event.description ? { description: event.description } : {}),
        answerCount: event.subMarkets.length,
        suggestedAnswer: event.subMarkets.map((s) => ({
          "@type": "Answer",
          text: `${s.question} — implied probability ${Math.round(
            s.yesProbability * 100
          )}% on Polymarket.`,
        })),
      },
      isPartOf: { "@type": "WebSite", name: "MarketFlip", url: SITE_URL },
    };

    return (
      <>
        <JsonLd data={fieldJsonLd} />
        <Nameplate />
        <main className="mx-auto max-w-[1024px] px-5 sm:px-8 lg:px-14 pb-12">
          <section className="pt-5 sm:pt-10 pb-3 sm:pb-6">
            <p className="eyebrow">
              {[fmtResolveDate(event.endDate) ? `resolves ${fmtResolveDate(event.endDate)}` : null]
                .filter(Boolean)
                .join(" · ") || "Live event"}
            </p>
            <h1
              className="display mt-2.5 sm:mt-3.5 text-[28px] sm:text-[40px] md:text-[48px]"
              style={{ lineHeight: 1.06 }}
            >
              {event.question}
            </h1>
            <MarketDescription text={event.description} />
          </section>
          <hr className="border-0 border-t border-[var(--rule)] m-0" />
          <CandidateList event={event} />
        </main>
      </>
    );
  }

  notFound();
}
