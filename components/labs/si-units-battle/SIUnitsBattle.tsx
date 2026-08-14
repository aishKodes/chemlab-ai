"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Gauge, RotateCcw, ShieldCheck, Sparkles, Target, Volume2, VolumeX, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import {
  conversionQuestions,
  finalBossQuestions,
  precisionQuestions,
  siBaseCores,
  significantFigureQuestions,
  unitAttackQuestions,
  type SourceBackedQuestion,
} from "@/data/quizzes/siUnitsBattle";
import { playSiBattleSound } from "./siUnitsBattleSound";

const scenes = ["SI Command Centre", "Unit Attack", "Conversion Bridge", "Precision Shield", "Significant Figures Boss", "Final Boss"] as const;

const sceneQuestions: Record<number, SourceBackedQuestion[]> = {
  1: unitAttackQuestions.slice(0, 2),
  2: conversionQuestions,
  3: precisionQuestions,
  4: significantFigureQuestions.slice(0, 3),
  5: finalBossQuestions,
};

export function SIUnitsBattle() {
  const [scene, setScene] = useState(0);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);
  const [muted, setMuted] = useState(false);

  const progress = finished ? 100 : Math.round(((scene + step / Math.max(1, scene === 0 ? 7 : sceneQuestions[scene]?.length ?? 1)) / scenes.length) * 100);
  const question = scene === 0 ? null : sceneQuestions[scene]?.[step];
  const core = scene === 0 ? siBaseCores[step] : null;

  const coreOptions = useMemo(() => {
    if (!core) return [];
    const distractors = siBaseCores.filter((item) => item.quantity !== core.quantity).slice((step * 2) % 5, (step * 2) % 5 + 2);
    return [core, ...distractors].sort((a, b) => a.unit.localeCompare(b.unit));
  }, [core, step]);

  function choose(answer: string) {
    if (feedback) return;
    setSelected(answer);
    playSiBattleSound("click", muted);
  }

  function check() {
    if (!selected || feedback) return;
    const answer = core ? `${core.unit} (${core.symbol})` : question?.answer;
    const correct = selected === answer;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setXp((value) => value + 20 + Math.min(streak, 4) * 5);
      setStreak((value) => value + 1);
      playSiBattleSound(streak >= 2 ? "combo" : "correct", muted);
    } else {
      setStreak(0);
      setMistakes((value) => value + 1);
      playSiBattleSound("wrong", muted);
    }
  }

  function advance() {
    if (feedback !== "correct") {
      setSelected(null);
      setFeedback(null);
      return;
    }
    const count = scene === 0 ? siBaseCores.length : sceneQuestions[scene]?.length ?? 0;
    if (step + 1 < count) {
      setStep((value) => value + 1);
      setSelected(null);
      setFeedback(null);
      return;
    }
    if (scene + 1 < scenes.length) {
      setScene((value) => value + 1);
      setStep(0);
      setSelected(null);
      setFeedback(null);
      return;
    }
    setFinished(true);
    setXp((value) => value + 100);
    playSiBattleSound("complete", muted);
  }

  function reset() {
    setScene(0);
    setStep(0);
    setSelected(null);
    setFeedback(null);
    setXp(0);
    setStreak(0);
    setMistakes(0);
    setFinished(false);
  }

  if (finished) {
    const rank = mistakes === 0 ? "Measurement Master" : mistakes <= 3 ? "Unit Commander" : "SI Cadet";
    return (
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#67e8f9_0,transparent_28%),radial-gradient(circle_at_80%_25%,#c4b5fd_0,transparent_30%),linear-gradient(145deg,#07152f,#123b63_55%,#111827)] px-4 py-8 text-white">
        <motion.section initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl text-center">
          <motion.div animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.08, 1] }} transition={{ duration: 1.2 }} className="mx-auto grid h-28 w-28 place-items-center rounded-full border-4 border-amber-200 bg-amber-400/20 shadow-[0_0_60px_rgba(250,204,21,0.55)]">
            <ShieldCheck className="h-14 w-14 text-amber-200" />
          </motion.div>
          <p className="mt-7 text-sm font-black uppercase tracking-[0.2em] text-cyan-200">Battle complete</p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">{rank}</h1>
          <p className="mt-4 text-lg font-bold text-blue-100">All seven SI power cores are online. You earned {xp} XP.</p>
          <button type="button" onClick={reset} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-blue-950 shadow-xl">
            <RotateCcw className="h-4 w-4" /> Replay battle
          </button>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,.3),transparent_26%),radial-gradient(circle_at_84%_18%,rgba(168,85,247,.25),transparent_28%),linear-gradient(145deg,#07152f,#0b3154_55%,#111827)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(125,211,252,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,.12)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-[96rem] flex-col px-3 py-3 sm:px-5 sm:py-5">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-slate-950/35 px-4 py-3 backdrop-blur-xl">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-300">Class 11 · Unit 1</p>
            <h1 className="text-xl font-black sm:text-2xl">SI Units Battle</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="rounded-full bg-cyan-400/15 px-3 py-2 text-cyan-100">XP {xp}</span>
            <span className="rounded-full bg-amber-400/15 px-3 py-2 text-amber-100">Streak {streak}</span>
            <button type="button" onClick={() => setMuted((value) => !value)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10" aria-label={muted ? "Turn sound on" : "Mute sound"}>
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400" /></div>

        <section className="grid flex-1 items-stretch gap-3 py-3 lg:grid-cols-[13rem_1fr_16rem]">
          <aside className="hidden rounded-3xl border border-white/10 bg-slate-950/30 p-4 backdrop-blur lg:block">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">Mission path</p>
            <ol className="mt-4 space-y-3">
              {scenes.map((name, index) => <li key={name} className={`flex items-center gap-2 text-sm font-bold ${index === scene ? "text-white" : index < scene ? "text-emerald-300" : "text-slate-500"}`}><span className={`grid h-7 w-7 place-items-center rounded-full ${index <= scene ? "bg-cyan-400/20" : "bg-white/5"}`}>{index < scene ? <Check className="h-4 w-4" /> : index + 1}</span>{name}</li>)}
            </ol>
          </aside>

          <div className="relative flex min-h-[34rem] flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-b from-white/10 to-slate-950/35 p-4 shadow-2xl backdrop-blur sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">{scenes[scene]} · {step + 1}/{scene === 0 ? 7 : sceneQuestions[scene]?.length}</p>
                <h2 className="mt-2 text-2xl font-black sm:text-3xl">{core ? `Power the ${core.quantity} core` : question?.prompt}</h2>
              </div>
              <motion.span animate={{ boxShadow: ["0 0 0 rgba(34,211,238,0)", "0 0 35px rgba(34,211,238,.7)", "0 0 0 rgba(34,211,238,0)"] }} transition={{ repeat: Infinity, duration: 2 }} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cyan-400/20"><Zap className="h-6 w-6 text-cyan-200" /></motion.span>
            </div>

            {scene === 3 ? <PrecisionTargetPreview step={step} /> : <EnergyCoreVisual scene={scene} coreSymbol={core?.symbol} />}

            <div className="mt-auto grid gap-2 sm:grid-cols-3">
              {(core ? coreOptions.map((item) => `${item.unit} (${item.symbol})`) : question?.options ?? []).map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  animate={feedback === "wrong" && selected === option ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
                  onClick={() => choose(option)}
                  className={`min-h-16 rounded-2xl border-2 px-3 py-3 text-sm font-black transition ${selected === option ? "border-cyan-300 bg-cyan-300/20 text-white shadow-[0_0_28px_rgba(34,211,238,.25)]" : "border-white/10 bg-white/8 text-blue-50 hover:border-white/30"}`}
                >{option}</motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {feedback ? <motion.div key={feedback} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-3 rounded-2xl border p-3 text-sm font-bold ${feedback === "correct" ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-100" : "border-amber-300/30 bg-amber-400/15 text-amber-100"}`}>{feedback === "correct" ? "Energy link locked. " : "Good clue. Try the rule again. "}{core ? `${core.quantity} uses ${core.unit}, symbol ${core.symbol}.` : question?.explanation}</motion.div> : null}
            </AnimatePresence>

            <div className="mt-3 flex justify-end">
              {!feedback ? <button type="button" onClick={check} disabled={!selected} className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg disabled:cursor-not-allowed disabled:opacity-40">Lock answer</button> : <button type="button" onClick={advance} className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-blue-950 shadow-lg">{feedback === "correct" ? "Continue" : "Try again"}</button>}
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-slate-950/30 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-cyan-200"><Gauge className="h-5 w-5" /><h3 className="font-black">Command notes</h3></div>
            <p className="mt-3 text-sm font-semibold leading-6 text-blue-100">{core ? "Connect the quantity to both its SI unit and correct symbol." : scene === 2 ? "Move across the bridge by cancelling units and multiplying powers of ten." : scene === 3 ? "Precision compares repeated readings. Accuracy compares with the true value." : scene === 4 ? "Use the operation rule first, then round only the final answer." : "Choose one answer, check the reason, and keep the streak alive."}</p>
            <div className="mt-5 rounded-2xl bg-white/8 p-3 text-xs font-bold leading-5 text-slate-300"><Sparkles className="mr-2 inline h-4 w-4 text-amber-300" />Source: NCERT Class 11 Chemistry, Unit 1.</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-black text-violet-200"><Target className="h-4 w-4" />Rank improves with accuracy, not speed.</div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function EnergyCoreVisual({ scene, coreSymbol }: { scene: number; coreSymbol?: string }) {
  return <div className="relative my-6 grid min-h-48 place-items-center"><div className="absolute h-44 w-44 rounded-full border border-cyan-300/20" /><motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute h-36 w-36 rounded-full border-2 border-dashed border-violet-300/40" /><motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="grid h-24 w-24 place-items-center rounded-full border-4 border-cyan-200 bg-gradient-to-br from-cyan-400/35 to-violet-500/35 text-3xl font-black shadow-[0_0_55px_rgba(34,211,238,.45)]">{coreSymbol ?? (scene === 2 ? "10ⁿ" : scene === 4 ? "3 sf" : "SI")}</motion.div></div>;
}

function PrecisionTargetPreview({ step }: { step: number }) {
  const points = step === 0 ? [[72, 30], [74, 32], [70, 31], [73, 28]] : [[50, 50], [52, 49], [48, 51], [51, 53]];
  return <div className="relative mx-auto my-5 aspect-square w-48 rounded-full border-[10px] border-blue-200/40 bg-white/90 shadow-[0_0_40px_rgba(125,211,252,.25)]"><div className="absolute inset-[20%] rounded-full border-4 border-violet-200" /><div className="absolute inset-[39%] rounded-full bg-red-400" />{points.map(([x, y], index) => <motion.span key={index} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.08 }} className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-700 shadow-lg" style={{ left: `${x}%`, top: `${y}%` }} />)}</div>;
}
