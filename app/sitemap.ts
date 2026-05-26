import type { MetadataRoute } from "next";
import { getTrendingMarkets } from "@/lib/polymarket";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.marketflip.xyz";

// Re-fetch the trending list once an hour. Bot crawls are sparse; this
// keeps Polymarket calls bounded while still surfacing fresh slugs.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  // Pull a wide slice of trending markets so Google has fresh URLs to
  // crawl on each revalidate. Failures here must not break the sitemap.
  const markets = await getTrendingMarkets(200, {
    next: { revalidate: 3600 },
  }).catch(() => []);

  for (const m of markets) {
    if (!m.slug) continue;
    entries.push({
      url: `${SITE_URL}/m/${m.slug}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.7,
    });
  }

  return entries;
}
