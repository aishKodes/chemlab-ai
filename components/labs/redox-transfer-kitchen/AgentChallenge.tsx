"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { redoxAgentQuestions } from "./redoxQuestData";
import { validateAgentAnswer } from "./redoxValidator";
import type { RedoxFeedback } from "./redoxTypes";

export function AgentChallenge({ onComplete, onFeedback }: { onComplete: () => void; onFeedback: (feedback: RedoxFeedback) => void }) {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Record<string, string>>({});
  const question = redoxAgentQuestions[index];

  function choose(answer: string) {
    const feedback = validateAgentAnswer(question.id, answer);
    onFeedback(feedback);
    if (!feedback.correct) return;

    const nextAnswered = { ...answered, [question.id]: answer };
    setAnswered(nextAnswered);
    if (index === redoxAgentQuestions.length - 1) {
      onComplete();
      return;
    }
    setIndex((current) => current + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Paati’s agent challenge</p>
        <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold text-white">
          {index + 1}/{redoxAgentQuestions.length}
        </span>
      </div>
      <motion.div key={question.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.5rem] border border-white/12 bg-white/10 p-4">
        <p className="text-lg font-black text-white">{question.prompt}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {question.options.map((option) => (
            <button key={option} type="button" onClick={() => choose(option)} className="rounded-2xl border border-white/12 bg-white/12 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-cyan-300 hover:text-slate-950">
              {option}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
