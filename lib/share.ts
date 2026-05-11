// lib/share.ts
import type { FlipOutcome } from "./types";
import { displayLabel, isLiteralYesNo } from "./fmt";

type SingleFlipShare = {
  question: string;
  yesProbability: number;
  flipped: FlipOutcome;
  yesLabel?: string;
  noLabel?: string;
  url: string;
};

type SimulationShare = {
  question: string;
  yesProbability: number;
  n: number;
  yesCount: number;
  noCount: number;
  yesLabel?: string;
  noLabel?: string;
  url: string;
};

const fmtPct = (p: number, decimals = 0) =>
  `${(p * 100).toFixed(decimals)}%`;

const fmtInt = (n: number) => n.toLocaleString("en-US");

export function formatSingleFlipShare(s: SingleFlipShare): string {
  const literal = isLiteralYesNo(s.yesLabel, s.noLabel);
  const landed = displayLabel(s.flipped, s.yesLabel, s.noLabel);
  const yesToken = literal ? "YES" : s.yesLabel ?? "YES";
  const emoji = s.flipped === "YES" ? "🎉" : "🚨";
  return [
    `"${s.question}"`,
    `Market said: ${fmtPct(s.yesProbability)} ${yesToken}`,
    `I flipped: ${emoji} ${landed}`,
    s.url,
  ].join("\n");
}

export function formatSimulationShare(s: SimulationShare): string {
  const observed = s.yesCount / s.n;
  const literal = isLiteralYesNo(s.yesLabel, s.noLabel);
  const yesToken = literal ? "YES" : s.yesLabel ?? "YES";
  const noToken = literal ? "NO" : s.noLabel ?? "NO";
  return [
    `"${s.question}"`,
    `${fmtInt(s.n)} sims · Implied: ${fmtPct(s.yesProbability)} · Observed: ${fmtPct(observed, 1)}`,
    `${yesToken} ${fmtInt(s.yesCount)} · ${noToken} ${fmtInt(s.noCount)}`,
    s.url,
  ].join("\n");
}
