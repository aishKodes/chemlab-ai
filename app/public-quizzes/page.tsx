"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/layout/PageHeader";
import type { BackendTeacherQuiz } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackTeacherQuizzes, liveQuizApi } from "@/lib/api/liveQuizApi";

export default function PublicQuizzesPage() {
  const [quizzes, setQuizzes] = useState<BackendTeacherQuiz[]>(fallbackTeacherQuizzes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    liveQuizApi
      .publicQuizzes()
      .then((payload) => setQuizzes(payload.quizzes.length ? payload.quizzes : fallbackTeacherQuizzes))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Public Quizzes"
        title="Practice battles open to everyone."
        description="Try quick chemistry quizzes, learn from clues, and climb the leaderboard."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Showing practice quizzes" description={error} /> : null}
        {loading ? <LoadingState label="Loading public quizzes" /> : null}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.slug} interactive className="bg-gradient-to-br from-white via-cyan-50 to-lime-50">
              <Badge tone="green">{quiz.question_count ?? quiz.questions?.length ?? 0} questions</Badge>
              <h2 className="mt-3 text-xl font-black text-slate-950">{quiz.title}</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{quiz.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button href={`/public-quizzes/${quiz.slug}`} size="sm">Start</Button>
                <Button href={`/leaderboards/${quiz.slug}`} size="sm" variant="secondary">Leaderboard</Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
