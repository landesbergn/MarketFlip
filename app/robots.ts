import type { MetadataRoute } from "next";

// Canonical host is the www subdomain — Vercel redirects apex → www, so
// every sitemap entry and robots Host: directive must point at www to
// avoid Search Console's "redirected sitemap" / "different host" errors.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.marketflip.xyz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
