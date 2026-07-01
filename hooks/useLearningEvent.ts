"use client";

import { useCallback } from "react";
import type { LearningEventPayload } from "@/lib/api/backendTypes";
import { trackEvent } from "@/lib/analytics/trackEvent";

export function useLearningEvent() {
  return useCallback((payload: Omit<LearningEventPayload, "anonymous_id">) => {
    void trackEvent(payload);
  }, []);
}
