"use client";

import { useEffect, useRef } from "react";
import { learningApi } from "@/lib/api/learningApi";
import { getLearningAnonymousId, getLearningSessionId } from "@/lib/analytics/sessionTracker";

type ResourceSessionOptions = {
  resourceSlug?: string;
  resourceId?: number;
  resourceType?: string;
  metadata?: Record<string, unknown>;
  enabled?: boolean;
};

export function useResourceSession(options: ResourceSessionOptions) {
  const sessionId = useRef<number | null>(null);
  const startedAt = useRef<number>(0);
  const enabled = options.enabled ?? true;

  useEffect(() => {
    if (!enabled || (!options.resourceSlug && !options.resourceId)) return;
    let cancelled = false;
    startedAt.current = Date.now();

    learningApi
      .startResourceSession({
        resource_slug: options.resourceSlug,
        resource_id: options.resourceId,
        resource_type: options.resourceType,
        anonymous_id: getLearningAnonymousId(),
        session_id: getLearningSessionId(),
        metadata: options.metadata,
      })
      .then((payload) => {
        if (!cancelled) sessionId.current = payload.resource_session_id ?? null;
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      if (!sessionId.current) return;
      void learningApi.endResourceSession({
        resource_session_id: sessionId.current,
        duration_seconds: Math.max(1, Math.floor((Date.now() - startedAt.current) / 1000)),
        completed: false,
        completion_percent: 0,
        exit_reason: "left_page",
      });
    };
  }, [enabled, options.metadata, options.resourceId, options.resourceSlug, options.resourceType]);

  return null;
}
