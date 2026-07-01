"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Trophy, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Progress } from "@/components/ui/Progress";
import type { BackendLiveQuizParticipant } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { liveQuizApi } from "@/lib/api/liveQuizApi";
import { getLiveQuizRoom } from "@/components/live-quiz/liveQuizStorage";
import type { StoredLiveQuizRoom } from "@/components/live-quiz/liveQuizStorage";
import { optionsFromQuestion, scoreLocalQuiz } from "@/components/live-quiz/quizUtils";

export function QuizRoomPlayer({ sessionId }: { sessionId: string }) {
  const [room, setRoom] = useState<StoredLiveQuizRoom | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { correct?: boolean; explanation?: string | null }>>({});
  const [participant, setParticipant] = useState<BackendLiveQuizParticipant | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const stored = getLiveQuizRoom(sessionId);
      setRoom(stored);
      setParticipant(stored?.participant ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const question = room?.questions[index];
  const options = useMemo(() => optionsFromQuestion(question), [question]);
  const selected = question?.id ? answers[String(question.id)] : undefined;
  const currentFeedback = question?.id ? feedback[String(question.id)] : undefined;

  async function answer(option: string) {
    if (!room || !question?.id || currentFeedback) return;
    setAnswers((current) => ({ ...current, [String(question.id)]: option }));
    try {
      const payload = await liveQuizApi.answerRoom(room.session.uuid, {
        participant_id: room.participant.id,
        participant_token: room.participant_token,
        question_id: question.id,
        selected_answer: option,
        response_time_ms: 0,
      });
      setFeedback((current) => ({
        ...current,
        [String(question.id)]: { correct: payload.correct, explanation: payload.explanation },
      }));
      if (payload.participant) setParticipant(payload.participant);
      setError(null);
    } catch (caught) {
      const result = scoreLocalQuiz([question], { [String(question.id)]: option });
      setFeedback((current) => ({
        ...current,
        [String(question.id)]: { correct: result.correct_count === 1, explanation: question.explanation },
      }));
      setError(`Practice fallback used: ${getReadableApiError(caught)}`);
    }
  }

  async function complete() {
    if (!room) return;
    try {
      const payload = await liveQuizApi.completeRoom(room.session.uuid, {
        participant_id: room.participant.id,
        participant_token: room.participant_token,
        duration_seconds: 0,
      });
      setParticipant(payload.participant);
    } catch {
      const result = scoreLocalQuiz(room.questions, answers);
      setParticipant({
        ...room.participant,
        score: result.score,
        total_points: result.total_points,
        correct_count: result.correct_count,
        wrong_count: result.wrong_count,
      });
    }
    setDone(true);
  }

  if (!room) {
    return (
      <div className="mx-auto max-w-2xl">
        <ErrorState
          title="Join this quiz again"
          description="This browser does not have the participant pass for this live room. Enter the PIN again and you can continue."
          action={<Button href="/join">Join with PIN</Button>}
        />
      </div>
    );
  }

  if (!question && !done) return <LoadingState label="Preparing quiz room" />;

  if (done) {
    return (
      <Card className="mx-auto max-w-3xl bg-gradient-to-br from-white via-emerald-50 to-amber-50 text-center">
        <Trophy className="mx-auto h-12 w-12 text-amber-500" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-black text-slate-950">Quiz complete</h2>
        <p className="mt-3 text-xl font-black text-blue-700">
          {participant?.score ?? 0}/{participant?.total_points ?? room.questions.length} points
        </p>
        <p className="mt-2 text-sm font-bold text-slate-600">Your teacher can now see your result in the live room.</p>
        <Button href="/join" variant="secondary" className="mt-6">Join another quiz</Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {error ? <ErrorState title="Room fallback notice" description={error} /> : null}
      <Card className="bg-gradient-to-br from-white via-blue-50 to-violet-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="blue">PIN {room.session.pin_code}</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">{room.quiz.title}</h2>
          </div>
          <Badge tone="green">{participant?.display_name ?? room.participant.display_name}</Badge>
        </div>
      </Card>
      <Progress value={Math.round((index / room.questions.length) * 100)} label={`Question ${index + 1} of ${room.questions.length}`} />
      <Card className="bg-gradient-to-br from-white via-cyan-50 to-lime-50">
        <h3 className="text-2xl font-black leading-tight text-slate-950">{question?.question_text}</h3>
        <div className="mt-6 grid gap-3">
          {options.map((option) => {
            const active = selected === option;
            return (
              <button
                key={option}
                type="button"
                disabled={Boolean(currentFeedback)}
                className={`focus-ring rounded-2xl border-2 p-4 text-left text-sm font-black transition disabled:cursor-not-allowed ${
                  active ? "border-blue-500 bg-blue-50 text-blue-800" : "border-white bg-white/85 text-slate-700 hover:border-cyan-300"
                }`}
                onClick={() => void answer(option)}
              >
                {option}
              </button>
            );
          })}
        </div>
        {currentFeedback ? (
          <div className={`mt-5 rounded-2xl p-4 ${currentFeedback.correct ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-950"}`}>
            <div className="flex items-center gap-2 text-sm font-black">
              {currentFeedback.correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              {currentFeedback.correct ? "Correct" : "Clue unlocked"}
            </div>
            {currentFeedback.explanation ? <p className="mt-2 text-sm font-bold leading-6">{currentFeedback.explanation}</p> : null}
          </div>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          {index > 0 ? <Button variant="secondary" onClick={() => setIndex((current) => current - 1)}>Back</Button> : null}
          {index + 1 < room.questions.length ? (
            <Button disabled={!currentFeedback} onClick={() => setIndex((current) => current + 1)}>Next</Button>
          ) : (
            <Button disabled={!currentFeedback} onClick={() => void complete()}>Finish quiz</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
