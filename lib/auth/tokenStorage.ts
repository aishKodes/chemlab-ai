import type { BackendUser } from "@/lib/api/backendTypes";

export const AUTH_TOKEN_KEY = "chemlab_auth_token";
export const AUTH_USER_KEY = "chemlab_auth_user";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredToken() {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function storeToken(token: string) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getCachedUser(): BackendUser | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BackendUser;
  } catch {
    window.localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function storeCachedUser(user: BackendUser) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearCachedUser() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function clearAuthStorage() {
  clearStoredToken();
  clearCachedUser();
}
