import { backendClient } from "@/lib/api/backendClient";
import type { LearningEventPayload } from "@/lib/api/backendTypes";

export const analyticsApi = {
  trackEvent: (payload: LearningEventPayload) =>
    backendClient.post<{ stored?: boolean }>("/api/analytics/event", payload),
};
