import { ImageResponse } from "next/og";

// Branded share preview used by iMessage, Slack, Twitter, etc.
// Renders the paper-and-ink palette with the gold coin and wordmark.

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MarketFlip — Each market is a coin weighted to its live odds.";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "84px 96px",
          background: "#fafaf7",
          color: "#0a0a0a",
          // Subtle paper grain via a layered radial gradient — Satori
          // supports CSS gradients in `background`.
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(26,58,107,0.06), transparent 55%), radial-gradient(circle at 86% 88%, rgba(212,160,23,0.10), transparent 55%)",
        }}
      >
        {/* Top row: gold coin + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <svg width="140" height="140" viewBox="-15 -15 30 30">
            <defs>
              <radialGradient id="og-gold" cx="32%" cy="26%" r="82%">
                <stop offset="0%" stopColor="#fae28a" />
                <stop offset="45%" stopColor="#d4a017" />
                <stop offset="100%" stopColor="#7a5605" />
              </radialGradient>
              <radialGradient id="og-rim" cx="50%" cy="50%" r="50%">
                <stop offset="78%" stopColor="rgba(255,225,140,0)" />
                <stop offset="86%" stopColor="rgba(255,235,170,0.55)" />
                <stop offset="92%" stopColor="rgba(110,70,8,0.5)" />
                <stop offset="100%" stopColor="rgba(60,40,4,0.85)" />
              </radialGradient>
              <radialGradient id="og-hi" cx="28%" cy="22%" r="55%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            <circle r="12.8" fill="url(#og-gold)" />
            <circle r="12.8" fill="url(#og-rim)" />
            <circle
              r="10.4"
              fill="none"
              stroke="rgba(110,70,8,0.55)"
              strokeWidth="0.5"
            />
            <circle r="12.8" fill="url(#og-hi)" />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 124,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            <span>Market</span>
            <span style={{ fontStyle: "italic", color: "#1a3a6b" }}>Flip</span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <p
            style={{
              fontSize: 64,
              lineHeight: 1.12,
              fontStyle: "italic",
              letterSpacing: "-0.012em",
              margin: 0,
              maxWidth: 920,
              color: "#0a0a0a",
            }}
          >
            Each market is a coin weighted to its live odds.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span
              style={{
                fontSize: 24,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#6b6b6b",
              }}
            >
              marketflip.xyz
            </span>
            <span
              style={{
                fontSize: 24,
                color: "#c8c4b8",
              }}
            >
              ·
            </span>
            <span
              style={{
                fontSize: 24,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#1a3a6b",
              }}
            >
              Pull one. Or a thousand.
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
