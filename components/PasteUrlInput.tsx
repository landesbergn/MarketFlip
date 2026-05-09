// components/PasteUrlInput.tsx
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
        track({
          name: "market_url_pasted",
          props: { host, valid: false },
        });
        if (data.error === "unrecognized_url") {
          setError("We only support Polymarket URLs in v1. Try a polymarket.com link.");
        } else {
          setError("Couldn't parse that URL — make sure it's a Polymarket market or event link.");
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
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste a Polymarket URL…"
          aria-label="Polymarket URL"
          className="grow rounded-md border-2 border-zinc-900 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={submitting || !value.trim()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Go
        </button>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-700">{error}</p> : null}
    </form>
  );
}
