"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, HelpCircle, Sparkles } from "lucide-react";
import type { DaniellAnswerState, DaniellChallengeQuestion } from "@/components/labs/daniell-cell/daniellCellTypes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

export function DaniellCellChallenge({
  questions,
  currentIndex,
  answer,
  correctCount,
  onAnswer,
  onNext,
  onFinish,
}: {
  questions: DaniellChallengeQuestion[];
  currentIndex: number;
  answer?: DaniellAnswerState;
  correctCount: number;
  onAnswer: (optionId: string) => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const question = questions[currentIndex];
  const selected = question.options.find((option) => option.id === answer?.selectedOptionId);
  const isCorrect = Boolean(answer?.isCorrect);
  const isLast = currentIndex === questions.length - 1;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.75rem] border-2 border-white bg-gradient-to-br from-white via-amber-50 to-cyan-50 p-5 shadow-2xl"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge tone="amber">Boss Check</Badge>
          <h2 className="mt-3 text-2xl font-black text-slate-950">{question.question}</h2>
        </div>
        <div className="min-w-40">
          <Progress value={(correctCount / questions.length) * 100} label={`${correctCount}/${questions.length} correct`} />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {question.options.map((option) => {
          const isSelected = answer?.selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onAnswer(option.id)}
              className={cn(
                "focus-ring rounded-[1.25rem] border-2 bg-white px-4 py-4 text-left text-sm font-black leading-5 text-slate-700 shadow-lg transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50",
                isSelected && isCorrect && "border-lime-300 bg-lime-50 text-lime-900",
                isSelected && !isCorrect && "border-amber-300 bg-amber-50 text-amber-900",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={`${selected.id}-${String(isCorrect)}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              "mt-4 rounded-[1.25rem] p-4 text-sm font-bold leading-6",
              isCorrect ? "bg-lime-100 text-lime-900" : "bg-amber-100 text-amber-900",
            )}
          >
            <div className="flex gap-2">
              {isCorrect ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> : <HelpCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}
              <p>{selected.feedback}</p>
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 rounded-[1.25rem] bg-blue-50 p-4 text-sm font-bold leading-6 text-blue-800"
          >
            {question.hint}
          </motion.p>
        )}
      </AnimatePresence>

      {isCorrect ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-4 py-2 text-sm font-black text-lime-800">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            +25 XP
          </span>
          <Button onClick={isLast ? onFinish : onNext}>
            {isLast ? "See final explanation" : "Next clue"}
          </Button>
        </div>
      ) : null}
    </motion.section>
  );
}
