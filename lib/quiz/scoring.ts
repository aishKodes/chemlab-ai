import type { QuizQuestion } from "@/types";

export type QuizAnswer = Record<string, string>;

function normalize(value: unknown) {
  return String(value).trim().toLowerCase();
}

export function isAnswerCorrect(question: QuizQuestion, answer: string) {
  if (question.type === "numeric") {
    const expected = Number(question.correctAnswer);
    const actual = Number(answer);
    if (!Number.isFinite(expected) || !Number.isFinite(actual)) return false;
    return Math.abs(expected - actual) <= Math.max(0.01, Math.abs(expected) * 0.01);
  }

  if (question.type === "true_false") {
    return normalize(question.correctAnswer) === normalize(answer);
  }

  return normalize(question.correctAnswer) === normalize(answer);
}

export function scoreQuiz(questions: QuizQuestion[], answers: QuizAnswer) {
  const results = questions.map((question) => {
    const answer = answers[question.id] ?? "";
    return {
      question,
      answer,
      correct: isAnswerCorrect(question, answer),
    };
  });
  const score = results.filter((result) => result.correct).length;

  return {
    score,
    total: questions.length,
    percentage: questions.length > 0 ? Math.round((score / questions.length) * 100) : 0,
    results,
  };
}
