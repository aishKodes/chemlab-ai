"use client";

import { CheckCircle2, Trophy, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import type { BackendPublicLeaderboardEntry, BackendTeacherQuiz, BackendTeacherQuizQuestion } from "@/lib/api/backendTypes";
import { liveQuizApi } from "@/lib/api/liveQuizApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { formatSeconds, optionsFromQuestion, scoreLocalQuiz } from "@/components/live-quiz/quizUtils";

type ResultShape = {
  score?: number;
  total_points?: number;
  correct_count?: number;
  wrong_count?: number;
  breakdown?: Array<{ question_id?: number; correct?: boolean; explanation?: string | null }>;
};

export function PublicQuizPlayer({
  quiz,
  questions,
  fallbackLeaderboard = [],
}: {
  quiz: BackendTeacherQuiz;
  questions: BackendTeacherQuizQuestion[];
  fallbackLeaderboard?: BackendPublicLeaderboardEntry[];
}) {
  const [name, setName] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ResultShape | null>(null);
  const [leaderboard, setLeaderboard] = useState<BackendPublicLeaderboardEntry[]>(fallbackLeaderboard);
  const [error, setError] = useState<string | null>(null);
  const question = questions[index];
  const options = useMemo(() => optionsFromQuestion(question), [question]);
  const answered = question?.id ? answers[String(question.id)] : undefined;

  async function finish() {
    if (!name.trim()) {
      setError("Enter your display name before submitting.");
      return;
    }
    const duration = startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0;
    try {
      const payload = await liveQuizApi.publicAttempt(quiz.slug, {
        participant_name: name.trim(),
        answers,
        duration_seconds: duration,
      });
      setResult(payload.result as ResultShape);
      setLeaderboard(payload.leaderboard);
      setError(null);
    } catch (caught) {
      setResult(scoreLocalQuiz(questions, answers));
      setLeaderboard(fallbackLeaderboard);
      setError(`Practice mode result shown: ${getReadableApiError(caught)}`);
    }
  }

  if (!questions.length) {
    return (
      <Card>
        <h2 className="text-xl font-black text-slate-950">Quiz questions are being prepared</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">This public quiz is waiting for questions from the Chemlab backend.</p>
      </Card>
    );
  }

  if (result) {
    const total = Number(result.total_points ?? questions.length);
    const score = Number(result.score ?? 0);
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
        <Card className="bg-gradient-to-br from-white via-emerald-50 to-amber-50 text-center">
          <Trophy className="mx-auto h-12 w-12 text-amber-500" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-black text-slate-950">Battle complete</h2>
          <p className="mt-3 text-xl font-black text-blue-700">
            {score}/{total} points
          </p>
          <p className="mt-2 text-sm font-bold text-slate-600">Every answer is a clue for your next attempt.</p>
          {error ? <p className="mt-4 rounded-2xl bg-amber-100 p-3 text-sm font-bold text-amber-900">{error}</p> : null}
          <div className="mt-6 flex justify-center gap-3">
            <Button href="/public-quizzes" variant="secondary">More quizzes</Button>
            <Button href={`/leaderboards/${quiz.slug}`}>Leaderboard</Button>
          </div>
        </Card>
        <LeaderboardMini rows={leaderboard} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Card className="bg-gradient-to-br from-white via-sky-50 to-violet-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="blue">{quiz.title}</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">Ready for the battle?</h2>
          </div>
          <label className="block min-w-52">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Display name</span>
            <input
              className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </label>
        </div>
      </Card>

      <Progress value={Math.round((index / questions.length) * 100)} label={`Question ${index + 1} of ${questions.length}`} />
      <Card className="bg-gradient-to-br from-white via-cyan-50 to-lime-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="green">Question {index + 1}</Badge>
          <Badge tone="amber">{question.points ?? 1} point</Badge>
        </div>
        <h3 className="mt-6 text-2xl font-black leading-tight text-slate-950">{question.question_text}</h3>
        <div className="mt-6 grid gap-3">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`focus-ring rounded-2xl border-2 p-4 text-left text-sm font-black transition ${
                answered === option ? "border-blue-500 bg-blue-50 text-blue-800" : "border-white bg-white/85 text-slate-700 hover:border-cyan-300"
              }`}
              onClick={() => {
                if (!startedAt) setStartedAt(Date.now());
                if (!question.id) return;
                setAnswers((current) => ({ ...current, [String(question.id)]: option }));
              }}
            >
              {option}
            </button>
          ))}
        </div>
        {error ? <p className="mt-4 rounded-2xl bg-amber-100 p-3 text-sm font-bold text-amber-900">{error}</p> : null}
        <div className="mt-6 flex justify-end gap-3">
          {index > 0 ? <Button variant="secondary" onClick={() => setIndex((current) => current - 1)}>Back</Button> : null}
          {index + 1 < questions.length ? (
            <Button disabled={!answered} onClick={() => setIndex((current) => current + 1)}>Next</Button>
          ) : (
            <Button disabled={!answered} onClick={finish}>Submit quiz</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function LeaderboardMini({ rows }: { rows: BackendPublicLeaderboardEntry[] }) {
  return (
    <Card>
      <h2 className="text-xl font-black text-slate-950">Leaderboard</h2>
      <div className="mt-4 space-y-3">
        {rows.length ? rows.slice(0, 8).map((row, index) => (
          <div key={`${row.id ?? row.participant_name}-${index}`} className="flex items-center justify-between rounded-2xl bg-white/75 p-3">
            <div className="flex items-center gap-3">
              {index === 0 ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-slate-300" />}
              <span className="font-black text-slate-900">{row.participant_name}</span>
            </div>
            <span className="text-sm font-black text-blue-700">
              {row.score}/{row.total_points ?? "?"} · {formatSeconds(row.duration_seconds)}
            </span>
          </div>
        )) : <p className="text-sm font-bold text-slate-600">No public attempts yet. Be the first name here.</p>}
      </div>
    </Card>
  );
}
