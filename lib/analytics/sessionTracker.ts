const SESSION_ID_KEY = "chemlab_learning_session_id";
const ANONYMOUS_ID_KEY = "chemlab_anonymous_id";

function createId(prefix: string) {
  const random = Math.random().toString(36).slice(2);
  return `${prefix}_${Date.now().toString(36)}_${random}`;
}

export function getLearningSessionId() {
  if (typeof window === "undefined") return "server_session";
  const existing = window.sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;
  const next = createId("session");
  window.sessionStorage.setItem(SESSION_ID_KEY, next);
  return next;
}

export function getLearningAnonymousId() {
  if (typeof window === "undefined") return "server_anonymous";
  const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY);
  if (existing) return existing;
  const next = createId("anon");
  window.localStorage.setItem(ANONYMOUS_ID_KEY, next);
  return next;
}

export function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}
