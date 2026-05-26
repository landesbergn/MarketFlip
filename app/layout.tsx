import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketflip.xyz";
const SITE_TITLE = "MarketFlip — Flip a market";
// On-page voice is preserved verbatim in app/page.tsx. The metadata
// description below is only used by SERP snippets and link unfurls,
// so it can carry search keywords ("Polymarket", "prediction markets")
// without altering anything visible on the site.
const SITE_DESCRIPTION =
  "Flip live Polymarket prediction markets as coins weighted to their implied probabilities. Each market is a coin weighted to its live odds — pull one for a flip, or simulate a thousand.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // Per-page titles ("Will Bitcoin hit $150k?") get suffixed with the
    // brand so iMessage / share previews still read as MarketFlip.
    template: "%s · MarketFlip",
  },
  description: SITE_DESCRIPTION,
  applicationName: "MarketFlip",
  keywords: [
    "Polymarket",
    "prediction markets",
    "prediction market odds",
    "implied probability",
    "coin flip",
    "weighted coin",
    "Monte Carlo",
    "MarketFlip",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "MarketFlip",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    // The branded image lives at app/opengraph-image.tsx — Next.js wires
    // it into the metadata automatically. Per-market routes can override
    // by colocating their own opengraph-image file.
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
