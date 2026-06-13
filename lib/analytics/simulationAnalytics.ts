import { trackEvent } from "./analytics";
import { LEARNING_EVENT_TYPES } from "./eventTypes";

export function trackSimulationStart(simulationSlug: string, metadata: Record<string, unknown> = {}) {
  return trackEvent({
    eventType: LEARNING_EVENT_TYPES.simulationStart,
    eventName: "simulation_started",
    pagePath: `/labs/${simulationSlug}`,
    metadata: { simulationSlug, ...metadata },
  });
}

export function trackSimulationEvent(simulationSlug: string, eventName: string, metadata: Record<string, unknown> = {}) {
  return trackEvent({
    eventType: LEARNING_EVENT_TYPES.simulationEvent,
    eventName,
    pagePath: `/labs/${simulationSlug}`,
    metadata: { simulationSlug, ...metadata },
  });
}

export function trackSimulationComplete(
  simulationSlug: string,
  score: number,
  mistakes: unknown[] = [],
  metadata: Record<string, unknown> = {},
) {
  return trackEvent({
    eventType: LEARNING_EVENT_TYPES.simulationComplete,
    eventName: "simulation_completed",
    pagePath: `/labs/${simulationSlug}`,
    metadata: { simulationSlug, score, mistakes, ...metadata },
  });
}
