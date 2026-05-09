# MarketFlip

Take a live Polymarket market, read its current implied probabilities, and flip a virtual coin weighted by those odds. The single dramatic flip is the entertainment hook; running 1,000 simulations with an inline education panel is the substance.

## Status

Pre-implementation. Design spec lives at [`docs/superpowers/specs/2026-05-09-marketflip-design.md`](docs/superpowers/specs/2026-05-09-marketflip-design.md).

## Stack

- Next.js 15 (App Router) · TypeScript · Tailwind
- Vercel (edge cache for trending; live fetch for individual markets)
- PostHog (client-side analytics)
- Polymarket Gamma API (no auth required)

## v1 scope

- Polymarket only
- Live (unresolved) markets only
- Three entry points: paste URL, search, trending
- Single weighted flip + 100/1k/10k simulation modes
- localStorage flip history
- Wordle-style copy-text sharing

See the design spec for full details and the v2 roadmap.
