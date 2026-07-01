import { backendClient } from "@/lib/api/backendClient";
import type { BackendQuickDrill, BackendQuizAttempt, BackendQuizQuestion } from "@/lib/api/backendTypes";

export const fallbackQuickDrills: BackendQuickDrill[] = [
  {
    id: 1,
    title: "Redox Basics 5-Minute Drill",
    slug: "redox-basics-5-minute-drill",
    description: "A quick check for LEO, GER, and redox agents.",
    difficulty: "beginner",
    estimated_minutes: 5,
    status: "published",
  },
  {
    id: 2,
    title: "IUPAC Starter Drill",
    slug: "iupac-starter-drill",
    description: "Practice roots, suffixes, branches, and lowest numbering.",
    difficulty: "beginner",
    estimated_minutes: 5,
    status: "published",
  },
];

export const fallbackQuickDrillQuestions: Record<string, BackendQuizQuestion[]> = {
  "redox-basics-5-minute-drill": [
    {
      id: 1,
      drill_id: 1,
      question_text: "Zinc changes from Zn to Zn2+ by losing electrons. What is this called?",
      question_type: "mcq",
      options_json: ["Oxidation", "Reduction", "Neutralization"],
      correct_answer_json: ["Oxidation"],
      explanation: "Loss of electrons is oxidation.",
      hint: "Use LEO.",
    },
    {
      id: 2,
      drill_id: 1,
      question_text: "Copper ion gains electrons and becomes copper metal. What is this called?",
      question_type: "mcq",
      options_json: ["Reduction", "Oxidation", "Evaporation"],
      correct_answer_json: ["Reduction"],
      explanation: "Gain of electrons is reduction.",
      hint: "Use GER.",
    },
  ],
  "iupac-starter-drill": [
    {
      id: 3,
      drill_id: 2,
      question_text: "A straight chain has four carbon atoms and only single bonds. Which name fits?",
      question_type: "mcq",
      options_json: ["Butane", "Propane", "Butene"],
      correct_answer_json: ["Butane"],
      explanation: "Four carbons gives But and single bonds give ane.",
    },
    {
      id: 4,
      drill_id: 2,
      question_text: "In 2-methylpentane, what does methyl describe?",
      question_type: "mcq",
      options_json: ["A one-carbon branch", "The five-carbon main chain", "A double bond"],
      correct_answer_json: ["A one-carbon branch"],
      explanation: "Methyl is the one-carbon side branch.",
    },
  ],
};

export const quickDrillApi = {
  getDrills: () => backendClient.get<{ drills: BackendQuickDrill[] }>("/api/public/quick-drills"),
  getDrill: (idOrSlug: string | number) => backendClient.get<{ drill: BackendQuickDrill }>(`/api/public/quick-drills/${idOrSlug}`),
  getQuestions: (idOrSlug: string | number) =>
    backendClient.get<{ drill: BackendQuickDrill; questions: BackendQuizQuestion[] }>(
      `/api/public/quick-drills/${idOrSlug}/questions`,
    ),
  startAttempt: (drillId: string | number, payload: { anonymous_id?: string; metadata?: Record<string, unknown> } = {}) =>
    backendClient.post<{ attempt_id: number; uuid?: string; total_questions?: number }>(
      `/api/learning/quick-drills/${drillId}/attempts/start`,
      payload,
    ),
  answerAttempt: (
    attemptId: string | number,
    payload: {
      question_id: number;
      selected_answer: unknown;
      response_time_ms?: number;
      hint_used?: boolean;
    },
  ) =>
    backendClient.post<{ correct: boolean; explanation?: string | null; hint?: string | null; correct_answer?: unknown }>(
      `/api/learning/quick-drills/attempts/${attemptId}/answer`,
      payload,
    ),
  completeAttempt: (attemptId: string | number) =>
    backendClient.post<{ completed: boolean; attempt: BackendQuizAttempt }>(
      `/api/learning/quick-drills/attempts/${attemptId}/complete`,
    ),
  getAttempt: (attemptId: string | number) =>
    backendClient.get<{ attempt: BackendQuizAttempt }>(`/api/learning/quick-drills/attempts/${attemptId}`),
};
