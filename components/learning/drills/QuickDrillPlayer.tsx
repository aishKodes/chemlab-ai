"use client";

import { CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import type { BackendQuickDrill, BackendQuizQuestion } from "@/lib/api/backendTypes";
import { quickDrillApi } from "@/lib/api/quickDrillApi";
import { getLearningAnonymousId } from "@/lib/analytics/sessionTracker";
import { learningApi } from "@/lib/api/learningApi";
import { useTimeOnTask } from "@/hooks/useTimeOnTask";

export function QuickDrillPlayer({ drill, questions }: { drill: BackendQuickDrill; questions: BackendQuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation?: string | null } | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { getElapsedSeconds } = useTimeOnTask(!done);
  const question = questions[index];
  const options = useMemo(() => optionsFromQuestion(question), [question]);

  async function ensureAttempt() {
    if (attemptId) return attemptId;
    try {
      const payload = await quickDrillApi.startAttempt(drill.id ?? drill.slug, {
        anonymous_id: getLearningAnonymousId(),
        metadata: { drillSlug: drill.slug },
      });
      setAttemptId(payload.attempt_id);
      return payload.attempt_id;
    } catch {
      return null;
    }
  }

  async function submit() {
    if (!question || !selected || feedback) return;
    let correct = answerMatches(selected, question.correct_answer_json);
    let explanation = question.explanation;
    const nextAttemptId = await ensureAttempt();
    if (nextAttemptId && question.id) {
      try {
        const backendFeedback = await quickDrillApi.answerAttempt(nextAttemptId, {
          question_id: question.id,
          selected_answer: selected,
          response_time_ms: getElapsedSeconds() * 1000,
        });
        correct = backendFeedback.correct;
        explanation = backendFeedback.explanation ?? explanation;
      } catch {
        correct = answerMatches(selected, question.correct_answer_json);
      }
    }
    setFeedback({ correct, explanation });
    if (correct) setScore((current) => current + 1);
    if (!correct) {
      void learningApi.submitMistake({
        mistake_key: question.mistake_type ?? "quick_drill_mistake",
        anonymous_id: getLearningAnonymousId(),
        question_id: question.id,
        student_answer: selected,
        correct_answer: JSON.stringify(question.correct_answer_json),
        feedback_shown: question.explanation,
      });
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      setDone(true);
      if (attemptId) void quickDrillApi.completeAttempt(attemptId);
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
    setFeedback(null);
  }

  if (!questions.length) {
    return (
      <Card>
        <h2 className="text-xl font-black text-slate-950">No questions yet</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">This drill is waiting for questions from the Chemlab backend.</p>
      </Card>
    );
  }

  if (done) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <Card className="mx-auto max-w-3xl bg-gradient-to-br from-white via-emerald-50 to-amber-50 text-center">
        <Sparkles className="mx-auto h-10 w-10 text-amber-500" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-black text-slate-950">Drill complete</h2>
        <p className="mt-3 text-lg font-black text-blue-700">
          {score}/{questions.length} correct · {percent}%
        </p>
        <p className="mt-2 text-sm font-bold text-slate-600">Every wrong answer is now a clue for your next review.</p>
        <Button href="/quick-drills" className="mt-6" variant="secondary">
          Choose another drill
        </Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Progress value={Math.round((index / questions.length) * 100)} label={`Question ${index + 1} of ${questions.length}`} />
      <Card className="bg-gradient-to-br from-white via-cyan-50 to-lime-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="green">{drill.title}</Badge>
          <Badge tone="blue">Score {score}</Badge>
        </div>
        <h2 className="mt-6 text-2xl font-black leading-tight text-slate-950">{question.question_text}</h2>
        <div className="mt-6 grid gap-3">
          {options.map((option) => {
            const active = selected === option;
            return (
              <button
                key={option}
                type="button"
                className={`focus-ring rounded-2xl border-2 p-4 text-left text-sm font-black transition ${
                  active ? "border-blue-500 bg-blue-50 text-blue-800" : "border-white bg-white/80 text-slate-700 hover:border-cyan-300"
                }`}
                onClick={() => setSelected(option)}
              >
                {option}
              </button>
            );
          })}
        </div>
        {feedback ? (
          <div className={`mt-5 rounded-2xl p-4 ${feedback.correct ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-950"}`}>
            <div className="flex items-center gap-2 text-sm font-black">
              {feedback.correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              {feedback.correct ? "Correct" : "Try this clue next time"}
            </div>
            <p className="mt-2 text-sm font-bold leading-6">{feedback.explanation ?? question.hint}</p>
          </div>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          {!feedback ? (
            <Button onClick={submit} disabled={!selected}>
              Check answer
            </Button>
          ) : (
            <Button onClick={next}>{index + 1 >= questions.length ? "Finish drill" : "Next question"}</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function optionsFromQuestion(question?: BackendQuizQuestion) {
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

function answerMatches(selected: string, correct: BackendQuizQuestion["correct_answer_json"]) {
  if (Array.isArray(correct)) return correct.map(String).includes(selected);
  if (typeof correct === "string") {
    try {
      const parsed = JSON.parse(correct);
      return Array.isArray(parsed) ? parsed.map(String).includes(selected) : selected === String(parsed);
    } catch {
      return selected === correct;
    }
  }
  return false;
}
