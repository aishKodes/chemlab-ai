import { trackEvent } from "@/lib/analytics/trackEvent";

export function trackElectrochemistry(event_name: string, metadata?: Record<string, unknown>) {
  void trackEvent({
    event_type: "simulation",
    event_name,
    page_path: "/labs/electrochemistry-power-grid",
    metadata,
  });
}
