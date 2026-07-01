"use client";

import { Copy, RadioTower, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendLiveQuizAnswer, BackendLiveQuizParticipant, BackendLiveQuizSession, BackendTeacherQuiz } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackTeacherQuizzes, liveQuizApi } from "@/lib/api/liveQuizApi";
import { formatSeconds } from "@/components/live-quiz/quizUtils";

type Report = {
  session: BackendLiveQuizSession;
  participants: BackendLiveQuizParticipant[];
  answers: BackendLiveQuizAnswer[];
};

export function TeacherQuizDetail({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<BackendTeacherQuiz | null>(null);
  const [session, setSession] = useState<BackendLiveQuizSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    liveQuizApi
      .teacherQuiz(quizId)
      .then((payload) => setQuiz(payload.quiz))
      .catch((caught) => {
        setError(getReadableApiError(caught));
        setQuiz(fallbackTeacherQuizzes.find((item) => String(item.id) === quizId || item.slug === quizId) ?? null);
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  async function startLive() {
    try {
      const payload = await liveQuizApi.startLive(quizId);
      setSession(payload.session);
      setError(null);
    } catch (caught) {
      setError(getReadableApiError(caught));
    }
  }

  if (loading) return <LoadingState label="Loading quiz" />;

  return (
    <div className="space-y-5">
      {error ? <ErrorState title="Quiz backend notice" description={error} /> : null}
      <Card className="bg-gradient-to-br from-white via-cyan-50 to-lime-50">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge tone={quiz?.visibility === "public" ? "green" : "blue"}>{quiz?.visibility ?? "classroom"}</Badge>
            <h2 className="mt-3 text-3xl font-black text-slate-950">{quiz?.title ?? "Teacher quiz"}</h2>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-600">{quiz?.description ?? "Start a live PIN room when your class is ready."}</p>
          </div>
          <Button onClick={startLive} icon={<RadioTower className="h-4 w-4" />}>Start live room</Button>
        </div>
      </Card>
      {session ? <LivePinCard session={session} /> : null}
    </div>
  );
}

export function TeacherLiveRoom({ sessionId, resultsOnly = false }: { sessionId: string; resultsOnly?: boolean }) {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function requestReport(showLoading = true) {
    if (showLoading) setLoading(true);
    const request = resultsOnly ? liveQuizApi.liveResults(sessionId) : liveQuizApi.liveSession(sessionId);
    request
      .then((payload) => {
        setReport(payload);
        setError(null);
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    queueMicrotask(() => requestReport(false));
    if (resultsOnly) return;
    const timer = window.setInterval(() => requestReport(false), 7000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, resultsOnly]);

  async function endLive() {
    try {
      const payload = await liveQuizApi.endLive(sessionId);
      setReport(payload);
    } catch (caught) {
      setError(getReadableApiError(caught));
    }
  }

  if (loading && !report) return <LoadingState label="Loading live room" />;

  return (
    <div className="space-y-5">
      {error ? <ErrorState title="Live room notice" description={error} /> : null}
      {report?.session ? (
        <Card className="bg-gradient-to-br from-white via-blue-50 to-violet-50">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge tone={report.session.status === "ended" ? "amber" : "green"}>{report.session.status}</Badge>
              <h2 className="mt-3 text-3xl font-black text-slate-950">{report.session.quiz_title ?? "Live quiz room"}</h2>
              <p className="mt-2 text-sm font-bold text-slate-600">PIN: <span className="text-xl text-blue-700">{report.session.pin_code}</span></p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => requestReport(true)} variant="secondary">Refresh</Button>
              {report.session.status !== "ended" ? <Button onClick={endLive} variant="danger">End live</Button> : null}
            </div>
          </div>
        </Card>
      ) : null}
      {report?.session?.join_url ? <LivePinCard session={report.session} /> : null}
      <Card>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="text-xl font-black text-slate-950">Live results</h3>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Student</th>
                <th className="p-3">Score</th>
                <th className="p-3">Correct</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {(report?.participants ?? []).map((participant, index) => (
                <tr key={participant.id} className="border-t border-blue-50 bg-white/55">
                  <td className="p-3 font-black text-blue-700">#{participant.rank_position ?? index + 1}</td>
                  <td className="p-3 font-black text-slate-900">{participant.display_name}</td>
                  <td className="p-3 font-black text-slate-700">{participant.score ?? 0}/{participant.total_points ?? "?"}</td>
                  <td className="p-3 font-bold text-slate-600">{participant.correct_count ?? 0}</td>
                  <td className="p-3 font-bold text-slate-600">{formatSeconds(participant.duration_seconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!(report?.participants ?? []).length ? <p className="py-6 text-sm font-bold text-slate-600">No students have joined yet.</p> : null}
        </div>
      </Card>
    </div>
  );
}

function LivePinCard({ session }: { session: BackendLiveQuizSession }) {
  return (
    <Card className="bg-gradient-to-br from-amber-50 via-white to-cyan-50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">Student join PIN</p>
          <p className="mt-2 text-5xl font-black tracking-[0.18em] text-slate-950">{session.pin_code}</p>
          <p className="mt-2 text-sm font-bold text-slate-600">{session.join_url}</p>
        </div>
        <Button
          variant="secondary"
          icon={<Copy className="h-4 w-4" />}
          onClick={() => {
            if (typeof navigator !== "undefined" && session.join_url) void navigator.clipboard.writeText(session.join_url);
          }}
        >
          Copy link
        </Button>
      </div>
    </Card>
  );
}
