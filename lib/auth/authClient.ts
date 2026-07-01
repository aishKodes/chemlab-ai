import { authApi, type LoginPayload, type SignupPayload } from "@/lib/api/authApi";
import type { AuthSession, BackendUser } from "@/lib/api/backendTypes";
import { clearAuthStorage, storeCachedUser, storeToken } from "@/lib/auth/tokenStorage";

function normalizeUserResponse(payload: { user: BackendUser } | BackendUser) {
  return "user" in payload ? payload.user : payload;
}

export async function loginWithBackend(payload: LoginPayload): Promise<AuthSession> {
  const session = await authApi.login(payload);
  storeToken(session.token);
  storeCachedUser(session.user);
  return session;
}

export async function signupWithBackend(payload: SignupPayload): Promise<AuthSession> {
  const session = await authApi.signup(payload);
  if (session.token) storeToken(session.token);
  if (session.user) storeCachedUser(session.user);
  return session;
}

export async function getCurrentUser() {
  const payload = await authApi.me();
  const user = normalizeUserResponse(payload);
  storeCachedUser(user);
  return user;
}

export async function logoutFromBackend() {
  try {
    await authApi.logout();
  } catch {
    // Logout must always clear local state, even when the backend is offline.
  } finally {
    clearAuthStorage();
  }
}

export function normalizeProfileResponse(payload: { user: BackendUser } | BackendUser) {
  return normalizeUserResponse(payload);
}
