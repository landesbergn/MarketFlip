// components/PageViewTracker.tsx
"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/posthog";

export function PageViewTracker({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    track(event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
