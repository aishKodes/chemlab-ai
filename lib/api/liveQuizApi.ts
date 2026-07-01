import { backendClient } from "@/lib/api/backendClient";
import type {
  BackendLiveQuizAnswer,
  BackendLiveQuizParticipant,
  BackendLiveQuizSession,
  BackendPublicLeaderboardEntry,
  BackendTeacherQuiz,
  BackendTeacherQuizQuestion,
} from "@/lib/api/backendTypes";

export const fallbackTeacherQuizzes: BackendTeacherQuiz[] = [
  {
    id: 101,
    title: "Redox Transfer Starter Battle",
    slug: "redox-transfer-starter-battle",
    description: "Practice LEO, GER, spectator ions, and redox agents from the Redox Transfer Kitchen story.",
    status: "published",
    visibility: "public",
    question_count: 5,
    time_limit_minutes: 6,
    show_correct_after_each: true,
    show_leaderboard: true,
  },
  {
    id: 102,
    title: "Hydrocarbon Naming Starter Battle",
    slug: "hydrocarbon-naming-starter-battle",
    description: "Check roots, suffixes, branches, and lowest numbering from Hydrocarbon Naming Quest.",
    status: "published",
    visibility: "public",
    question_count: 5,
    time_limit_minutes: 6,
    show_correct_after_each: true,
    show_leaderboard: true,
  },
];

export const fallbackPublicQuizQuestions: Record<string, BackendTeacherQuizQuestion[]> = {
  "redox-transfer-starter-battle": [
    {
      id: 1001,
      quiz_id: 101,
      question_text: "Which phrase defines oxidation?",
      question_type: "mcq",
      options_json: ["Loss of electrons", "Gain of electrons", "No electron change"],
      correct_answer_json: ["Loss of electrons"],
      explanation: "Oxidation means loss of electrons. Remember LEO.",
      points: 1,
    },
    {
      id: 1002,
      quiz_id: 101,
      question_text: "In Zn + Cu2+ to Zn2+ + Cu, zinc is:",
      question_type: "mcq",
      options_json: ["oxidized", "reduced", "spectator"],
      correct_answer_json: ["oxidized"],
      explanation: "Zinc loses electrons and becomes Zn2+.",
      points: 1,
    },
    {
      id: 1003,
      quiz_id: 101,
      question_text: "The reducing agent in the zinc and copper ion reaction is:",
      question_type: "mcq",
      options_json: ["Zinc", "Copper ion", "Sulphate"],
      correct_answer_json: ["Zinc"],
      explanation: "Zinc gives electrons and causes copper ion to reduce.",
      points: 1,
    },
    {
      id: 1004,
      quiz_id: 101,
      question_text: "SO4 2- is a spectator ion when it:",
      question_type: "mcq",
      options_json: ["appears unchanged on both sides", "loses electrons", "becomes copper"],
      correct_answer_json: ["appears unchanged on both sides"],
      explanation: "Spectator ions are removed from the net ionic equation.",
      points: 1,
    },
    {
      id: 1005,
      quiz_id: 101,
      question_text: "Why do oxidation and reduction happen together?",
      question_type: "mcq",
      options_json: ["One species gives electrons and another receives them", "Atoms disappear", "Only oxygen reacts"],
      correct_answer_json: ["One species gives electrons and another receives them"],
      explanation: "Redox is one electron-transfer transaction.",
      points: 1,
    },
  ],
  "hydrocarbon-naming-starter-battle": [
    {
      id: 2001,
      quiz_id: 102,
      question_text: "A four carbon chain with only single bonds is named:",
      question_type: "mcq",
      options_json: ["Butane", "Butene", "Pentane"],
      correct_answer_json: ["Butane"],
      explanation: "But means four carbons and ane means single bonds.",
      points: 1,
    },
    {
      id: 2002,
      quiz_id: 102,
      question_text: "A five carbon main chain uses which root?",
      question_type: "mcq",
      options_json: ["Pent", "But", "Hex"],
      correct_answer_json: ["Pent"],
      explanation: "Pent is the root for five carbons.",
      points: 1,
    },
    {
      id: 2003,
      quiz_id: 102,
      question_text: "Methyl means:",
      question_type: "mcq",
      options_json: ["one carbon branch", "two carbon branch", "double bond"],
      correct_answer_json: ["one carbon branch"],
      explanation: "A methyl group is a one-carbon side branch.",
      points: 1,
    },
    {
      id: 2004,
      quiz_id: 102,
      question_text: "The suffix ene tells us the molecule has:",
      question_type: "mcq",
      options_json: ["a double bond", "only single bonds", "a triple bond"],
      correct_answer_json: ["a double bond"],
      explanation: "Alkenes use the suffix ene.",
      points: 1,
    },
    {
      id: 2005,
      quiz_id: 102,
      question_text: "In but-1-ene, the number 1 tells us:",
      question_type: "mcq",
      options_json: ["the double bond starts at carbon 1", "there is one carbon", "the branch is methyl"],
      correct_answer_json: ["the double bond starts at carbon 1"],
      explanation: "The multiple bond gets the lowest possible number.",
      points: 1,
    },
  ],
};

export const fallbackLeaderboard: BackendPublicLeaderboardEntry[] = [
  { id: 1, participant_name: "Aarav", score: 5, total_points: 5, correct_count: 5, duration_seconds: 78, created_at: "practice" },
  { id: 2, participant_name: "Diya", score: 4, total_points: 5, correct_count: 4, duration_seconds: 92, created_at: "practice" },
  { id: 3, participant_name: "Kabir", score: 4, total_points: 5, correct_count: 4, duration_seconds: 110, created_at: "practice" },
];

export type LiveQuizReport = {
  session: BackendLiveQuizSession;
  participants: BackendLiveQuizParticipant[];
  answers: BackendLiveQuizAnswer[];
};

export const liveQuizApi = {
  teacherQuizzes: () => backendClient.get<{ quizzes: BackendTeacherQuiz[] }>("/api/teacher/quizzes"),
  createTeacherQuiz: (payload: Partial<BackendTeacherQuiz>) =>
    backendClient.post<{ quiz_id: number; uuid: string; slug: string; quiz: BackendTeacherQuiz }>("/api/teacher/quizzes", payload),
  teacherQuiz: (id: string | number) => backendClient.get<{ quiz: BackendTeacherQuiz }>(`/api/teacher/quizzes/${id}`),
  updateTeacherQuiz: (id: string | number, payload: Partial<BackendTeacherQuiz>) =>
    backendClient.put<{ updated: boolean; quiz: BackendTeacherQuiz }>(`/api/teacher/quizzes/${id}`, payload),
  startLive: (id: string | number) =>
    backendClient.post<{ session: BackendLiveQuizSession; pin_code: string; join_url: string }>(
      `/api/teacher/quizzes/${id}/start-live`,
      {},
    ),
  liveSession: (sessionId: string | number) => backendClient.get<LiveQuizReport>(`/api/teacher/live/${sessionId}`),
  endLive: (sessionId: string | number) => backendClient.post<LiveQuizReport>(`/api/teacher/live/${sessionId}/end`, {}),
  liveResults: (sessionId: string | number) => backendClient.get<LiveQuizReport>(`/api/teacher/live/${sessionId}/results`),

  joinInfo: (pin: string) => backendClient.get<{ session: BackendLiveQuizSession; quiz: BackendTeacherQuiz }>(`/api/quiz-join/${pin}`),
  joinByPin: (pin: string, payload: { guest_name: string }) =>
    backendClient.post<{
      session: BackendLiveQuizSession;
      participant: BackendLiveQuizParticipant;
      participant_token: string;
      quiz: BackendTeacherQuiz;
      questions: BackendTeacherQuizQuestion[];
    }>(`/api/quiz-join/${pin}/join`, payload),
  answerRoom: (
    sessionId: string | number,
    payload: { participant_id: number; participant_token: string; question_id: number; selected_answer: unknown; response_time_ms?: number },
  ) =>
    backendClient.post<{
      correct: boolean;
      points_awarded: number;
      explanation?: string | null;
      correct_answer?: unknown;
      participant?: BackendLiveQuizParticipant;
    }>(`/api/quiz-room/${sessionId}/answer`, payload),
  completeRoom: (
    sessionId: string | number,
    payload: { participant_id: number; participant_token: string; duration_seconds?: number },
  ) =>
    backendClient.post<{ completed: boolean; participant: BackendLiveQuizParticipant; answers: BackendLiveQuizAnswer[] }>(
      `/api/quiz-room/${sessionId}/complete`,
      payload,
    ),

  publicQuizzes: () => backendClient.get<{ quizzes: BackendTeacherQuiz[] }>("/api/public/quizzes"),
  publicQuiz: (slug: string) =>
    backendClient.get<{ quiz: BackendTeacherQuiz; questions: BackendTeacherQuizQuestion[] }>(`/api/public/quizzes/${slug}`),
  publicAttempt: (slug: string, payload: { participant_name: string; answers: Record<string, unknown>; duration_seconds?: number }) =>
    backendClient.post<{ result: Record<string, unknown>; leaderboard: BackendPublicLeaderboardEntry[] }>(
      `/api/public/quizzes/${slug}/attempt`,
      payload,
    ),
  leaderboard: (slug: string) =>
    backendClient.get<{ quiz: BackendTeacherQuiz; leaderboard: BackendPublicLeaderboardEntry[] }>(
      `/api/public/quizzes/${slug}/leaderboard`,
    ),
};
