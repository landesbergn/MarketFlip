"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/posthog";

export function PasteUrlInput() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/markets/resolve-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });
      const host = (() => {
        try {
          return new URL(value).hostname;
        } catch {
          return "invalid";
        }
      })();
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        track({ name: "market_url_pasted", props: { host, valid: false } });
        if (data.error === "unrecognized_url") {
          setError(
            "We only support Polymarket URLs in v1. Try a polymarket.com link."
          );
        } else {
          setError(
            "Couldn't parse that URL — make sure it's a Polymarket market or event link."
          );
        }
        return;
      }
      const data = (await res.json()) as { redirect: string };
      track({ name: "market_url_pasted", props: { host, valid: true } });
      router.push(data.redirect);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste a Polymarket URL…"
          aria-label="Polymarket URL"
          className="paper-input grow text-base px-4 py-3"
          style={{ borderRadius: "2px 0 0 2px", borderRightWidth: 0 }}
        />
        <button
          type="submit"
          disabled={submitting || !value.trim()}
          className="btn-ink whitespace-nowrap"
          style={{ borderRadius: "0 2px 2px 0" }}
        >
          {submitting ? "Checking" : "Run"}
        </button>
      </div>
      {error ? (
        <p className="figure mt-2 text-xs text-[var(--oxblood)]">{error}</p>
      ) : null}
    </form>
  );
}
