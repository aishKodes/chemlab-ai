"use client";

import type { Checkpoint } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";

export function CheckpointPanel({
  checkpoints,
  selectedAnswers,
  onAnswer,
}: {
  checkpoints: Checkpoint[];
  selectedAnswers: Record<number, string>;
  onAnswer: (index: number, answer: string) => void;
}) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">Checkpoint</p>
      <div className="mt-4 space-y-4">
        {checkpoints.map((checkpoint, index) => {
          const selected = selectedAnswers[index];
          const isCorrect = selected === checkpoint.answer;
          return (
            <div key={checkpoint.question} className="rounded-2xl bg-slate-50 p-4">
              <h4 className="text-sm font-black text-slate-950">{checkpoint.question}</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {checkpoint.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onAnswer(index, option)}
                    className={`focus-ring rounded-2xl border px-3 py-2 text-xs font-black transition hover:-translate-y-0.5 ${
                      selected === option
                        ? option === checkpoint.answer
                          ? "border-green-300 bg-green-100 text-green-900"
                          : "border-red-300 bg-red-100 text-red-900"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {selected ? (
                <p className={`mt-3 text-xs font-bold leading-5 ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                  {isCorrect ? checkpoint.explanation : "Try again. Read the clue and choose the concept, not the trap."}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
