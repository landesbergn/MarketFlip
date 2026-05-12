"use client";

import { useState } from "react";

type Props = {
  text?: string | null;
};

export function MarketDescription({ text }: Props) {
  const [open, setOpen] = useState(false);

  if (!text || !text.trim()) return null;

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="eyebrow"
        style={{
          background: "transparent",
          border: 0,
          padding: 0,
          cursor: "pointer",
        }}
        aria-expanded={open}
      >
        {open ? "− Resolution criteria" : "+ Resolution criteria"}
      </button>
      {open && (
        <div className="mt-3 text-[15px] leading-relaxed text-[var(--ink-soft)] space-y-3 max-w-prose">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
