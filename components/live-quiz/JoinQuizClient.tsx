"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendLiveQuizSession, BackendTeacherQuiz } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { liveQuizApi } from "@/lib/api/liveQuizApi";
import { storeLiveQuizRoom } from "@/components/live-quiz/liveQuizStorage";

export function JoinQuizClient({ initialPin = "" }: { initialPin?: string }) {
  const router = useRouter();
  const [pin, setPin] = useState(initialPin);
  const [name, setName] = useState("");
  const [session, setSession] = useState<BackendLiveQuizSession | null>(null);
  const [quiz, setQuiz] = useState<BackendTeacherQuiz | null>(null);
  const [loading, setLoading] = useState(Boolean(initialPin));
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPin) return;
    liveQuizApi
      .joinInfo(initialPin)
      .then((payload) => {
        setSession(payload.session);
        setQuiz(payload.quiz);
        setError(null);
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, [initialPin]);

  function findPin() {
    const clean = pin.replace(/\D/g, "").slice(0, 6);
    if (clean.length !== 6) {
      setError("Enter the 6-digit quiz PIN from your teacher.");
      return;
    }
    router.push(`/join/${clean}`);
  }

  async function joinRoom() {
    if (!pin || !name.trim()) {
      setError("Enter your name to join the live quiz.");
      return;
    }
    setJoining(true);
    try {
      const payload = await liveQuizApi.joinByPin(pin, { guest_name: name.trim() });
      storeLiveQuizRoom(payload);
      router.push(`/quiz-room/${payload.session.uuid}`);
    } catch (caught) {
      setError(getReadableApiError(caught));
    } finally {
      setJoining(false);
    }
  }

  if (loading) return <LoadingState label="Finding quiz room" />;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {error ? <ErrorState title="Quiz room needs attention" description={error} /> : null}
      <Card className="bg-gradient-to-br from-white via-cyan-50 to-lime-50">
        <Badge tone="blue">Live quiz PIN</Badge>
        <h2 className="mt-3 text-3xl font-black text-slate-950">{quiz ? quiz.title : "Enter your classroom PIN"}</h2>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
          {quiz?.description ?? "Your teacher will show a 6-digit PIN. Join with your name, answer the questions, and watch the leaderboard update."}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-[0.7fr_1fr]">
          <label>
            <span className="text-sm font-black text-slate-700">PIN</span>
            <input
              className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-2xl font-black tracking-[0.25em] text-slate-950 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
            />
          </label>
          <label>
            <span className="text-sm font-black text-slate-700">Your name</span>
            <input
              className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Name for leaderboard"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {session ? (
            <Button onClick={joinRoom} disabled={joining}>{joining ? "Joining..." : "Join quiz"}</Button>
          ) : (
            <Button onClick={findPin}>Find quiz</Button>
          )}
          <Button href="/public-quizzes" variant="secondary">Practice public quizzes</Button>
        </div>
      </Card>
    </div>
  );
}
