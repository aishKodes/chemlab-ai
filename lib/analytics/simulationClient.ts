"use client";

function anonymousId() {
  const key = "chemlab_anonymous_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID();
  window.localStorage.setItem(key, next);
  return next;
}

export function trackSimulationEventClient(
  simulationSlug: string,
  eventName: string,
  metadata: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  window
    .fetch("/api/analytics/simulation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        simulationSlug,
        eventName,
        anonymousId: anonymousId(),
        metadata,
      }),
      keepalive: true,
    })
    .catch(() => undefined);
}

export const trackSimulationStart = (simulationSlug: string, metadata: Record<string, unknown> = {}) =>
  trackSimulationEventClient(simulationSlug, "simulation_start", metadata);

export const trackSimulationComplete = (
  simulationSlug: string,
  score: number,
  mistakes: unknown[] = [],
  metadata: Record<string, unknown> = {},
) => trackSimulationEventClient(simulationSlug, "simulation_complete", { score, mistakes, ...metadata });
