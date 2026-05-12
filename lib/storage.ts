// lib/storage.ts
import type { HistoryEntry } from "./types";

export const HISTORY_KEY = "marketflip:history";
// Cap is global across markets; "Run 100" can add 100 entries at once,
// so we hold enough for several markets' worth of runs plus manual flips.
export const HISTORY_CAP = 1000;

export function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addFlipToHistory(entry: HistoryEntry): void {
  if (typeof window === "undefined") return;
  const current = readHistory();
  const next = [entry, ...current].slice(0, HISTORY_CAP);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

/**
 * Append many entries at once, preserving order (the last item in
 * `newEntries` ends up most-recent). Used by the "Run 100" action so
 * we hit localStorage once instead of 100 times.
 */
export function addFlipsToHistory(newEntries: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  if (newEntries.length === 0) return;
  const current = readHistory();
  // Reverse so the last item passed is the most recent (head), then prepend.
  const next = [...newEntries.slice().reverse(), ...current].slice(0, HISTORY_CAP);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HISTORY_KEY);
}
