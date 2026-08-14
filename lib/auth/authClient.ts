import { authApi, type LoginPayload, type SignupPayload } from "@/lib/api/authApi";
import { BackendApiError } from "@/lib/api/apiErrors";
import type { AuthSession, BackendUser } from "@/lib/api/backendTypes";
import { clearAuthStorage, storeCachedUser, storeToken } from "@/lib/auth/tokenStorage";

export function normalizeAuthEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeUserResponse(payload: { user: BackendUser } | BackendUser) {
  return "user" in payload ? payload.user : payload;
}

export async function loginWithBackend(payload: LoginPayload): Promise<AuthSession> {
  const session = await authApi.login({ ...payload, email: normalizeAuthEmail(payload.email) });
  storeToken(session.token);
  storeCachedUser(session.user);
  return session;
}

export async function signupWithBackend(payload: SignupPayload): Promise<AuthSession> {
  const normalizedPayload = {
    ...payload,
    name: payload.name.trim(),
    email: normalizeAuthEmail(payload.email),
    school_or_institute: payload.school_or_institute?.trim(),
  };

  try {
    const session = await authApi.signup(normalizedPayload);
    if (session.token && session.user) {
      storeToken(session.token);
      storeCachedUser(session.user);
      return session;
    }

    // Some deployments create the account but omit the session payload. A
    // normal login completes the same first-signup experience safely.
    return loginWithBackend({ email: normalizedPayload.email, password: payload.password });
  } catch (signupError) {
    if (!shouldRecoverCommittedSignup(signupError)) throw signupError;

    try {
      return await loginWithBackend({ email: normalizedPayload.email, password: payload.password });
    } catch {
      // Preserve the signup response because it normally contains the most
      // useful validation or availability message for the student.
      throw signupError;
    }
  }
}

export function shouldRecoverCommittedSignup(error: unknown) {
  if (!(error instanceof BackendApiError)) return true;
  if (["VALIDATION_ERROR", "SIGNUP_NOT_ALLOWED", "BACKEND_NOT_CONFIGURED", "BACKEND_UNAVAILABLE"].includes(error.code)) {
    return false;
  }
  return error.code === "EMAIL_TAKEN" || error.code === "REQUEST_TIMEOUT" || error.code === "INVALID_JSON" || (error.status ?? 0) >= 500;
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
