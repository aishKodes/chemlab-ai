"use client";

import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendPublicLeaderboardEntry, BackendTeacherQuiz } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackLeaderboard, fallbackTeacherQuizzes, liveQuizApi } from "@/lib/api/liveQuizApi";
import { formatSeconds } from "@/components/live-quiz/quizUtils";

export function LeaderboardView({ quizSlug }: { quizSlug?: string }) {
  const [quiz, setQuiz] = useState<BackendTeacherQuiz | null>(quizSlug ? fallbackTeacherQuizzes.find((item) => item.slug === quizSlug) ?? null : null);
  const [rows, setRows] = useState<BackendPublicLeaderboardEntry[]>(quizSlug ? fallbackLeaderboard : []);
  const [loading, setLoading] = useState(Boolean(quizSlug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizSlug) return;
    liveQuizApi
      .leaderboard(quizSlug)
      .then((payload) => {
        setQuiz(payload.quiz);
        setRows(payload.leaderboard);
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, [quizSlug]);

  if (!quizSlug) {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {fallbackTeacherQuizzes.map((item) => (
          <Card key={item.slug} interactive className="bg-gradient-to-br from-white via-amber-50 to-cyan-50">
            <Badge tone="amber">Leaderboard</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">{item.title}</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{item.description}</p>
            <a className="mt-5 inline-flex text-sm font-black text-blue-700 hover:text-blue-500" href={`/leaderboards/${item.slug}`}>
              Open leaderboard
            </a>
          </Card>
        ))}
      </div>
    );
  }

  if (loading) return <LoadingState label="Loading leaderboard" />;

  return (
    <div className="space-y-5">
      {error ? <ErrorState title="Showing practice leaderboard" description={error} /> : null}
      <Card className="bg-gradient-to-br from-white via-amber-50 to-cyan-50">
        <Trophy className="h-10 w-10 text-amber-500" aria-hidden="true" />
        <h2 className="mt-3 text-3xl font-black text-slate-950">{quiz?.title ?? "Quiz leaderboard"}</h2>
        <p className="mt-2 text-sm font-bold text-slate-600">Fast, accurate answers climb the board.</p>
      </Card>
      <Card>
        <div className="space-y-3">
          {rows.length ? rows.map((row, index) => (
            <div key={`${row.id ?? row.participant_name}-${index}`} className="grid gap-3 rounded-2xl bg-white/75 p-4 sm:grid-cols-[4rem_1fr_auto] sm:items-center">
              <Badge tone={index === 0 ? "amber" : "blue"}>#{index + 1}</Badge>
              <div>
                <p className="font-black text-slate-950">{row.participant_name}</p>
                <p className="text-xs font-bold text-slate-500">{formatSeconds(row.duration_seconds)}</p>
              </div>
              <p className="text-lg font-black text-blue-700">{row.score}/{row.total_points ?? "?"}</p>
            </div>
          )) : <p className="text-sm font-bold text-slate-600">No public attempts yet.</p>}
        </div>
      </Card>
    </div>
  );
}
