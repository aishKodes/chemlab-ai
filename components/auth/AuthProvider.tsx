"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BackendApiError, getReadableApiError } from "@/lib/api/apiErrors";
import type { AuthSession, BackendUser } from "@/lib/api/backendTypes";
import type { AuthContextValue } from "@/lib/auth/authTypes";
import { getCurrentUser, loginWithBackend, logoutFromBackend, signupWithBackend } from "@/lib/auth/authClient";
import { clearAuthStorage, getCachedUser, getStoredToken, storeCachedUser, storeToken } from "@/lib/auth/tokenStorage";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(() => getCachedUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setUser(null);
      setToken(null);
      return null;
    }

    setToken(storedToken);
    try {
      const nextUser = await getCurrentUser();
      setUser(nextUser);
      setError(null);
      return nextUser;
    } catch (caught) {
      const message = getReadableApiError(caught);
      setError(message);
      if (
        caught instanceof BackendApiError &&
        ["BACKEND_UNAVAILABLE", "BACKEND_NOT_CONFIGURED", "REQUEST_TIMEOUT"].includes(caught.code)
      ) {
        const cached = getCachedUser();
        if (cached) setUser(cached);
        return cached;
      }
      clearAuthStorage();
      setUser(null);
      setToken(null);
      return null;
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await refreshUser();
      setIsLoading(false);
    })();

    const clearListener = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener("chemlab-auth-cleared", clearListener);
    return () => window.removeEventListener("chemlab-auth-cleared", clearListener);
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const session = await loginWithBackend({ email, password });
    setToken(session.token);
    setUser(session.user);
    setError(null);
    return session;
  }, []);

  const signup: AuthContextValue["signup"] = useCallback(async (payload) => {
    const session = await signupWithBackend(payload);
    setToken(session.token);
    setUser(session.user);
    setError(null);
    return session;
  }, []);

  const logout = useCallback(async () => {
    await logoutFromBackend();
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      error,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [error, isLoading, login, logout, refreshUser, signup, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}

export function applyAuthSession(session: AuthSession) {
  storeToken(session.token);
  storeCachedUser(session.user);
}
