import { backendClient } from "@/lib/api/backendClient";
import type { BackendResourceSession, BackendSimulationSession } from "@/lib/api/backendTypes";

export const learningApi = {
  startResourceSession: (payload: Record<string, unknown>) =>
    backendClient.post<BackendResourceSession>("/api/learning/resource-session/start", payload),
  endResourceSession: (payload: Record<string, unknown>) =>
    backendClient.post<{ ended: boolean }>("/api/learning/resource-session/end", payload),
  startSimulationSession: (payload: Record<string, unknown>) =>
    backendClient.post<BackendSimulationSession>("/api/learning/simulation-session/start", payload),
  simulationEvent: (payload: Record<string, unknown>) =>
    backendClient.post<{ event_id: number }>("/api/learning/simulation-session/event", payload),
  endSimulationSession: (payload: Record<string, unknown>) =>
    backendClient.post<{ ended: boolean }>("/api/learning/simulation-session/end", payload),
  submitMistake: (payload: Record<string, unknown>) =>
    backendClient.post<{ mistake_id: number }>("/api/learning/mistake", payload),
  submitResourceFeedback: (payload: Record<string, unknown>) =>
    backendClient.post<{ feedback_id: number }>("/api/learning/resource-feedback", payload),
  logChemShastriQuestion: (payload: Record<string, unknown>) =>
    backendClient.post<{ question_log_id: number }>("/api/learning/chem-shastri/question-log", payload),
  submitChemShastriFeedback: (payload: { question_log_id: number; helpful_rating: string }) =>
    backendClient.post<{ updated: boolean }>("/api/learning/chem-shastri/feedback", payload),
};
