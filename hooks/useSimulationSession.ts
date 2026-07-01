"use client";

import { useCallback, useEffect, useRef } from "react";
import { learningApi } from "@/lib/api/learningApi";
import { getLearningAnonymousId, getLearningSessionId } from "@/lib/analytics/sessionTracker";

export function useSimulationSession(simulationSlug: string, enabled = true) {
  const sessionId = useRef<number | null>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !simulationSlug) return;
    let cancelled = false;
    startedAt.current = Date.now();
    learningApi
      .startSimulationSession({
        simulation_slug: simulationSlug,
        anonymous_id: getLearningAnonymousId(),
        session_id: getLearningSessionId(),
      })
      .then((payload) => {
        if (!cancelled) sessionId.current = payload.simulation_session_id ?? null;
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      if (!sessionId.current) return;
      void learningApi.endSimulationSession({
        simulation_session_id: sessionId.current,
        duration_seconds: Math.max(1, Math.floor((Date.now() - startedAt.current) / 1000)),
        completed: false,
      });
    };
  }, [enabled, simulationSlug]);

  const trackStep = useCallback(
    (eventName: string, metadata: Record<string, unknown> = {}) => {
      void learningApi.simulationEvent({
        simulation_session_id: sessionId.current,
        simulation_slug: simulationSlug,
        event_name: eventName,
        step_key: String(metadata.stepKey ?? metadata.step ?? "general"),
        success: metadata.success,
        mistake_key: metadata.mistakeKey ?? metadata.mistake_key,
        anonymous_id: getLearningAnonymousId(),
        metadata,
      });
    },
    [simulationSlug],
  );

  return { trackStep };
}
