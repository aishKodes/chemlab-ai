"use client";

import { use, useEffect, useState } from "react";
import { PublicQuizPlayer } from "@/components/live-quiz/PublicQuizPlayer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendTeacherQuiz, BackendTeacherQuizQuestion } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackLeaderboard, fallbackPublicQuizQuestions, fallbackTeacherQuizzes, liveQuizApi } from "@/lib/api/liveQuizApi";

export default function PublicQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [quiz, setQuiz] = useState<BackendTeacherQuiz>(fallbackTeacherQuizzes.find((item) => item.slug === slug) ?? fallbackTeacherQuizzes[0]);
  const [questions, setQuestions] = useState<BackendTeacherQuizQuestion[]>(fallbackPublicQuizQuestions[slug] ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    liveQuizApi
      .publicQuiz(slug)
      .then((payload) => {
        setQuiz(payload.quiz);
        setQuestions(payload.questions.length ? payload.questions : fallbackPublicQuizQuestions[slug] ?? []);
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <PageHeader eyebrow="Public Quiz" title={quiz.title} description={quiz.description ?? "Answer and learn from instant clues."} />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Using practice quiz fallback" description={error} /> : null}
        {loading && !questions.length ? <LoadingState label="Loading quiz" /> : <PublicQuizPlayer quiz={quiz} questions={questions} fallbackLeaderboard={fallbackLeaderboard} />}
      </Container>
    </>
  );
}
