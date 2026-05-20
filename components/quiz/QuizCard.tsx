"use client";

import type { QuizQuestion } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function QuizCard({
  question,
  value,
  onChange,
  index,
}: {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
  index: number;
}) {
  const inputName = `question-${question.id}`;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone="blue">Question {index + 1}</Badge>
        <Badge tone={question.difficulty === "Foundation" ? "green" : "amber"}>
          {question.difficulty}
        </Badge>
      </div>
      <h2 className="mt-5 text-xl font-black leading-8 text-slate-950">{question.questionText}</h2>

      {question.type === "multiple_choice" && question.options ? (
        <fieldset className="mt-5 space-y-3">
          <legend className="sr-only">Answer choices</legend>
          {question.options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-blue-100 bg-white/75 p-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white"
            >
              <input
                type="radio"
                name={inputName}
                value={option}
                checked={value === option}
                onChange={(event) => onChange(event.target.value)}
                className="mt-1 accent-cyan-300"
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
      ) : question.type === "true_false" ? (
        <fieldset className="mt-5 flex gap-3">
          <legend className="sr-only">True or false</legend>
          {["true", "false"].map((option) => (
            <label
              key={option}
            className="flex cursor-pointer items-center gap-2 rounded-2xl border border-blue-100 bg-white/75 px-4 py-3 text-sm font-semibold capitalize text-slate-700"
            >
              <input
                type="radio"
                name={inputName}
                value={option}
                checked={value === option}
                onChange={(event) => onChange(event.target.value)}
                className="accent-cyan-300"
              />
              {option}
            </label>
          ))}
        </fieldset>
      ) : (
        <label className="mt-5 block">
          <span className="text-sm font-black text-slate-700">Numerical answer</span>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            inputMode="decimal"
            className="focus-ring mt-2 h-11 w-full rounded-2xl border border-blue-100 bg-white/90 px-3 font-bold text-slate-800"
          />
        </label>
      )}
    </Card>
  );
}
