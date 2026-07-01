import { backendClient } from "@/lib/api/backendClient";
import type { BackendAdminAnalyticsSummary, BackendDailyLearningRollup, BackendLearningEvent } from "@/lib/api/backendTypes";

export const analyticsAdminApi = {
  summary: () => backendClient.get<BackendAdminAnalyticsSummary>("/api/admin/analytics/summary"),
  events: () => backendClient.get<{ events: BackendLearningEvent[] }>("/api/admin/analytics/events"),
  resources: () => backendClient.get<{ sessions: unknown[] }>("/api/admin/analytics/resources"),
  simulations: () => backendClient.get<{ sessions: unknown[]; top_simulations: unknown[] }>("/api/admin/analytics/simulations"),
  mistakes: () => backendClient.get<{ mistakes: unknown[]; top_mistakes: unknown[] }>("/api/admin/analytics/mistakes"),
  chemShastri: () => backendClient.get<{ questions: unknown[]; top_intents: unknown[] }>("/api/admin/analytics/chem-shastri"),
  students: () => backendClient.get<{ students: unknown[]; active_students: number }>("/api/admin/analytics/students"),
  teachers: () => backendClient.get<{ teachers: unknown[]; classrooms: unknown[] }>("/api/admin/analytics/teachers"),
  rollups: () => backendClient.get<{ rollups: BackendDailyLearningRollup[] }>("/api/admin/analytics/rollups"),
  runRollups: (date?: string) => backendClient.post<{ rollup: unknown }>("/api/admin/analytics/rollups/run", date ? { date } : {}),
  rollupStatus: () => backendClient.get<{ last_rollup: BackendDailyLearningRollup | null }>("/api/admin/analytics/rollups/status"),
};
