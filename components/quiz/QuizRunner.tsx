"use client";

import { ClipboardCheck, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { QuizCard } from "@/components/quiz/QuizCard";
import { QuizResult } from "@/components/quiz/QuizResult";
import { scoreQuiz, type QuizAnswer } from "@/lib/quiz/scoring";
import type { QuizQuestion } from "@/types";

export function QuizRunner({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [submitted, setSubmitted] = useState(false);
  const result = useMemo(() => scoreQuiz(questions, answers), [answers, questions]);

  if (questions.length === 0) {
    return (
      <EmptyState
        title="No questions yet"
        description="This chapter is ready for content authoring, but no local sample questions are attached yet."
        icon={<ClipboardCheck className="h-5 w-5" aria-hidden="true" />}
      />
    );
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <QuizResult result={result} />
        <Button
          variant="secondary"
          icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
          onClick={() => {
            setSubmitted(false);
            setAnswers({});
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        void fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chapterSlug: questions[0]?.chapterSlug,
            answers,
          }),
        }).catch(() => undefined);
      }}
    >
      {questions.map((question, index) => (
        <QuizCard
          key={question.id}
          question={question}
          index={index}
          value={answers[question.id] ?? ""}
          onChange={(value) =>
            setAnswers((current) => ({
              ...current,
              [question.id]: value,
            }))
          }
        />
      ))}
      <Button type="submit" icon={<ClipboardCheck className="h-4 w-4" aria-hidden="true" />}>
        Submit quiz
      </Button>
    </form>
  );
}
