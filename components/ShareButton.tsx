"use client";

import { useState } from "react";
import { track } from "@/lib/posthog";

type Props = {
  text: string;
  slug: string;
  mode: "single" | "sim";
};

export function ShareButton({ text, slug, mode }: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      track({ name: "result_shared", props: { slug, mode } });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={onClick}
      className="btn-ghost"
      aria-live="polite"
    >
      {copied ? "✓ Copied" : "Share Result"}
    </button>
  );
}
