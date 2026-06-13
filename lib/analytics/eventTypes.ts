export const LEARNING_EVENT_TYPES = {
  pageView: "page_view",
  aiMessage: "ai_message",
  simulationStart: "simulation_start",
  simulationEvent: "simulation_event",
  simulationComplete: "simulation_complete",
  quizAttempt: "quiz_attempt",
} as const;

export type LearningEventType = (typeof LEARNING_EVENT_TYPES)[keyof typeof LEARNING_EVENT_TYPES];
