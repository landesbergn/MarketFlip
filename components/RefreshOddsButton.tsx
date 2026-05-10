"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefreshOddsButton() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onClick = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <button
      onClick={onClick}
      disabled={refreshing}
      className="eyebrow text-[var(--ink-soft)] hover:text-[var(--oxblood)] disabled:opacity-50 transition-colors"
    >
      {refreshing ? "↻ Refreshing…" : "↻ Refresh odds"}
    </button>
  );
}
