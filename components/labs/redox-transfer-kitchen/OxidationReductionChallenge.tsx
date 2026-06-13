"use client";

import type { RedoxFeedback, RedoxLevelId } from "./redoxTypes";

export function OxidationReductionChallenge({
  levelId,
  onSolved,
  onFeedback,
}: {
  levelId: RedoxLevelId;
  onSolved: () => void;
  onFeedback: (feedback: RedoxFeedback) => void;
}) {
  const isZinc = levelId === "oxidation_gate";
  const title = isZinc ? "Click the giver" : "Click the receiver";
  const correct = isZinc ? "Zinc" : "Copper ion";

  function answer(choice: string) {
    if (choice === correct) {
      onFeedback({
        correct: true,
        message: isZinc ? "Correct. Zinc loses two electrons. LEO means oxidation." : "Correct. Copper ion gains the two electrons. GER means reduction.",
      });
      onSolved();
      return;
    }

    onFeedback({
      correct: false,
      message: "Not that one yet. Follow the electron movement.",
      hint: isZinc ? "The oxidized species loses electrons." : "The reduced species gains electrons.",
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">{title}</p>
      <div className="flex flex-wrap gap-2">
        {["Zinc", "Copper ion", "Sulphate"].map((choice) => (
          <button key={choice} type="button" onClick={() => answer(choice)} className="rounded-2xl bg-white/12 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/20">
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
