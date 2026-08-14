import { analyticsApi } from "@/lib/api/analyticsApi";
import type { LearningEventPayload } from "@/lib/api/backendTypes";
import { createBrowserId } from "@/lib/client/browserId";

const ANONYMOUS_ID_KEY = "chemlab_anonymous_id";

export function getAnonymousId() {
  if (typeof window === "undefined") return undefined;
  let id = window.localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!id) {
    id = createBrowserId("anon");
    window.localStorage.setItem(ANONYMOUS_ID_KEY, id);
  }
  return id;
}

export async function trackEvent(payload: Omit<LearningEventPayload, "anonymous_id"> & { anonymous_id?: string }) {
  try {
    await analyticsApi.trackEvent({
      anonymous_id: getAnonymousId(),
      ...payload,
    });
  } catch {
    // Analytics must never block learning.
  }
}
