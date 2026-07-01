import type { AuthSession, BackendUser, UserRole } from "@/lib/api/backendTypes";

export type AuthContextValue = {
  user: BackendUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthSession>;
  signup: (payload: {
    role: "student" | "teacher";
    name: string;
    email: string;
    password: string;
    class_level?: "9" | "10" | "11" | "12" | "";
    school_or_institute?: string;
    preferred_language?: string;
  }) => Promise<AuthSession>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<BackendUser | null>;
};

export function dashboardPathForRole(role?: UserRole | null) {
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teacher/dashboard";
  return "/student/dashboard";
}
