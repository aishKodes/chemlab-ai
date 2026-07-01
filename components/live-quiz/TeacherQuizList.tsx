"use client";

import { ClipboardList, RadioTower } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendTeacherQuiz } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackTeacherQuizzes, liveQuizApi } from "@/lib/api/liveQuizApi";

export function TeacherQuizList() {
  const [quizzes, setQuizzes] = useState<BackendTeacherQuiz[]>(fallbackTeacherQuizzes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    liveQuizApi
      .teacherQuizzes()
      .then((payload) => setQuizzes(payload.quizzes.length ? payload.quizzes : fallbackTeacherQuizzes))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-end gap-3">
        <Button href="/teacher/quizzes/create" icon={<ClipboardList className="h-4 w-4" />}>Create quiz</Button>
        <Button href="/public-quizzes" variant="secondary">View public practice</Button>
      </div>
      {error ? <ErrorState title="Teacher quiz backend unavailable" description={`Showing practice examples: ${error}`} /> : null}
      {loading ? <LoadingState label="Loading teacher quizzes" /> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.slug} interactive className="bg-gradient-to-br from-white via-sky-50 to-violet-50">
            <div className="flex flex-wrap gap-2">
              <Badge tone={quiz.visibility === "public" ? "green" : "blue"}>{quiz.visibility ?? "private"}</Badge>
              <Badge tone="amber">{quiz.question_count ?? quiz.questions?.length ?? 0} questions</Badge>
            </div>
            <h2 className="mt-3 text-xl font-black text-slate-950">{quiz.title}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{quiz.description ?? "Classroom quiz ready for a live PIN room."}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button href={`/teacher/quizzes/${quiz.id ?? quiz.slug}`} size="sm" variant="secondary">Open</Button>
              <Button href={`/teacher/quizzes/${quiz.id ?? quiz.slug}`} size="sm" icon={<RadioTower className="h-4 w-4" />}>Start live</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
