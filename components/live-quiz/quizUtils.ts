import type { BackendTeacherQuizQuestion } from "@/lib/api/backendTypes";

export function optionsFromQuestion(question?: BackendTeacherQuizQuestion) {
  const raw = question?.options_json;
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return raw.split("|").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

export function answerMatches(selected: unknown, correct: unknown) {
  const selectedList = Array.isArray(selected) ? selected : [selected];
  const correctList = Array.isArray(correct) ? correct : [correct];
  const normalize = (item: unknown) => String(item ?? "").trim().toLowerCase();
  return selectedList.map(normalize).sort().join("|") === correctList.map(normalize).sort().join("|");
}

export function scoreLocalQuiz(questions: BackendTeacherQuizQuestion[], answers: Record<string, unknown>) {
  let score = 0;
  let correctCount = 0;
  const breakdown = questions.map((question) => {
    const correct = answerMatches(answers[String(question.id)], question.correct_answer_json);
    if (correct) {
      correctCount += 1;
      score += Number(question.points ?? 1);
    }
    return { question_id: question.id, correct, explanation: question.explanation };
  });
  const totalPoints = questions.reduce((sum, question) => sum + Number(question.points ?? 1), 0);
  return {
    score,
    total_points: totalPoints,
    correct_count: correctCount,
    wrong_count: Math.max(0, questions.length - correctCount),
    breakdown,
  };
}

export function formatSeconds(seconds?: number | null) {
  const safe = Math.max(0, Number(seconds ?? 0));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`;
}
