import { backendClient } from "@/lib/api/backendClient";
import type { AuthSession, BackendUser } from "@/lib/api/backendTypes";

export type SignupPayload = {
  role: "student" | "teacher";
  name: string;
  email: string;
  password: string;
  class_level?: "9" | "10" | "11" | "12" | "";
  school_or_institute?: string;
  preferred_language?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const authApi = {
  signup: (payload: SignupPayload) => backendClient.post<AuthSession>("/api/auth/signup", payload),
  login: (payload: LoginPayload) => backendClient.post<AuthSession>("/api/auth/login", payload),
  logout: () => backendClient.post<{ message?: string }>("/api/auth/logout", {}),
  me: () => backendClient.get<{ user: BackendUser } | BackendUser>("/api/auth/me"),
  verifyEmail: (payload: { email?: string; code: string }) =>
    backendClient.post<{ verified?: boolean }>("/api/auth/verify-email", payload),
  resendVerification: (payload: { email: string }) =>
    backendClient.post<{ sent?: boolean }>("/api/auth/resend-verification", payload),
  forgotPassword: (payload: { email: string }) =>
    backendClient.post<{ sent?: boolean }>("/api/auth/forgot-password", payload),
  resetPassword: (payload: { email?: string; token?: string; code?: string; password: string }) =>
    backendClient.post<{ reset?: boolean }>("/api/auth/reset-password", payload),
};
