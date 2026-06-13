"use client";

import { useState } from "react";
import { validateSpectatorIon } from "./redoxValidator";
import type { RedoxFeedback } from "./redoxTypes";

export function SpectatorIonChallenge({ onSolved, onFeedback }: { onSolved: () => void; onFeedback: (feedback: RedoxFeedback) => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    const next = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
    setSelected(next);
    const feedback = validateSpectatorIon(next);
    onFeedback(feedback);
    if (feedback.correct) onSolved();
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Tap both spectator ions</p>
      <div className="flex flex-wrap items-center gap-2 text-sm font-black">
        <span className="rounded-2xl bg-slate-900/80 px-3 py-2 text-white">Zn</span>
        <span className="text-cyan-100">+</span>
        <button type="button" onClick={() => toggle("reactant_sulfate")} className={`rounded-2xl px-3 py-2 transition ${selected.includes("reactant_sulfate") ? "bg-purple-300 text-purple-950" : "bg-white/12 text-white hover:bg-white/20"}`}>
          CuSO₄
        </button>
        <span className="text-cyan-100">→</span>
        <button type="button" onClick={() => toggle("product_sulfate")} className={`rounded-2xl px-3 py-2 transition ${selected.includes("product_sulfate") ? "bg-purple-300 text-purple-950" : "bg-white/12 text-white hover:bg-white/20"}`}>
          ZnSO₄
        </button>
        <span className="text-cyan-100">+</span>
        <span className="rounded-2xl bg-orange-400/90 px-3 py-2 text-orange-950">Cu</span>
      </div>
    </div>
  );
}
