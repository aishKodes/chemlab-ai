"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { redoxAssetManifest } from "./redoxAssetManifest";
import { redoxAgentQuestions } from "./redoxQuestData";
import type { RedoxGameState } from "./redoxGameState";
import type { RedoxLevel } from "./redoxTypes";

function MurukkuToken({ transferred, animating }: { transferred: boolean; animating: boolean }) {
  return (
    <motion.div
      className="relative grid h-20 w-20 place-items-center rounded-full border-[12px] border-amber-300 bg-gradient-to-br from-amber-100 to-orange-500 shadow-2xl shadow-amber-400/40 before:absolute before:inset-4 before:rounded-full before:border-4 before:border-orange-800/55 before:content-['']"
      animate={transferred ? { x: 178, scale: 1.03 } : animating ? { x: [0, 178], scale: [1, 1.08, 1.03] } : { x: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      aria-label="Murukku token"
    />
  );
}

function ElectronCoin({ index, transferred, animating }: { index: number; transferred: boolean; animating: boolean }) {
  return (
    <motion.div
      className="grid h-14 w-14 place-items-center rounded-full border-2 border-cyan-100 bg-gradient-to-br from-white to-cyan-300 text-sm font-black text-blue-950 shadow-2xl shadow-cyan-300/35"
      animate={
        transferred
          ? { x: 250, y: index === 0 ? -18 : 18, scale: 1.04 }
          : animating
            ? { x: [0, 250], y: [index === 0 ? -18 : 18, index === 0 ? -54 : 54, index === 0 ? -18 : 18], scale: [1, 1.12, 1.04] }
            : { x: 0, y: index === 0 ? -18 : 18, scale: 1 }
      }
      transition={{ duration: 0.95, ease: "easeInOut", delay: index * 0.08 }}
    >
      e⁻
    </motion.div>
  );
}

function CounterCard({ label, value, tone }: { label: string; value: string | number; tone: "amber" | "cyan" | "green" | "orange" }) {
  const toneClass = {
    amber: "from-amber-200 to-orange-300 text-orange-950",
    cyan: "from-cyan-200 to-blue-300 text-blue-950",
    green: "from-lime-200 to-emerald-300 text-emerald-950",
    orange: "from-orange-200 to-red-300 text-orange-950",
  }[tone];

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${toneClass} px-4 py-3 text-center shadow-lg`}>
      <span className="sr-only">
        {label} {value}
      </span>
      <p className="text-xs font-black uppercase tracking-[0.16em] opacity-75">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function PersonZone({ name, src, count, label }: { name: string; src: string; count: number; label: string }) {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/16 bg-white/12 p-4 text-center shadow-xl backdrop-blur">
      <div className="mx-auto h-52 max-w-44 overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-amber-100/40 to-cyan-100/25">
        <img src={src} alt={name} className="h-full w-full object-contain object-bottom" />
      </div>
      <h3 className="mt-3 text-xl font-black text-white">{name}</h3>
      <p className="text-sm font-bold text-cyan-100">{label}</p>
      <div className="mt-3">
        <CounterCard label="Murukku" value={count} tone={count ? "amber" : "cyan"} />
      </div>
    </div>
  );
}

function ChemistryZone({ label, species, count, tone }: { label: string; species: string; count: number; tone: "cyan" | "orange" | "green" }) {
  return (
    <div className="rounded-[1.5rem] border border-white/16 bg-slate-950/45 p-5 text-center shadow-xl backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">{label}</p>
      <div className={`mx-auto mt-4 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br ${tone === "orange" ? "from-orange-300 to-red-500" : tone === "green" ? "from-lime-300 to-emerald-500" : "from-cyan-200 to-blue-500"} text-3xl font-black text-white shadow-2xl`}>
        {species}
      </div>
      <div className="mt-4">
        <CounterCard label={label.includes("Giver") ? "Electron coins left" : "Electron coins received"} value={count} tone={tone} />
      </div>
    </div>
  );
}

function QuizGate({
  title,
  equation,
  question,
  options,
  selectedAnswer,
  onAnswer,
  successLabel,
  correctValue,
}: {
  title: string;
  equation: string;
  question: string;
  options: Array<{ label: string; value: string }>;
  selectedAnswer?: string;
  onAnswer: (value: string) => void;
  successLabel: string;
  correctValue: string;
}) {
  const answeredCorrectly = selectedAnswer === correctValue;
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-5">
      <div className="rounded-[1.5rem] border border-cyan-200/20 bg-slate-950/54 p-5 text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100">{title}</p>
        <p className="mt-3 text-3xl font-black text-white">{equation}</p>
      </div>
      <div className="rounded-[1.5rem] border border-white/16 bg-white/12 p-5">
        <p className="text-xl font-black text-white">{question}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onAnswer(option.value)}
              className={`rounded-2xl border px-4 py-4 text-sm font-black transition hover:-translate-y-0.5 ${
                selectedAnswer === option.value
                  ? option.value === correctValue
                    ? "border-lime-200 bg-lime-300 text-lime-950"
                    : "border-rose-200 bg-rose-300 text-rose-950"
                  : "border-white/16 bg-white/12 text-white hover:bg-white/20"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {answeredCorrectly ? (
          <div className="mt-4 rounded-2xl bg-lime-300/16 p-3 text-sm font-black text-lime-100">
            <CheckCircle2 className="mr-2 inline h-4 w-4" aria-hidden />
            {successLabel}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SpectatorCleanupBoard({
  selectedItems,
  onToggle,
}: {
  selectedItems: string[];
  onToggle: (id: string) => void;
}) {
  const selectedBoth = selectedItems.includes("reactant_sulfate") && selectedItems.includes("product_sulfate");
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5">
      <div className="rounded-[1.5rem] border border-white/16 bg-white/12 p-5 text-center shadow-xl backdrop-blur">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Full equation</p>
        <p className="mt-3 text-2xl font-black text-white">Zn + CuSO₄ → ZnSO₄ + Cu</p>
        <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-amber-100">Ionic form</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-lg font-black">
          <span className="rounded-2xl bg-white/10 px-3 py-2">Zn</span>
          <span>+</span>
          <span className="rounded-2xl bg-orange-300 px-3 py-2 text-orange-950">Cu²⁺</span>
          <span>+</span>
          <button type="button" onClick={() => onToggle("reactant_sulfate")} className={`rounded-2xl px-3 py-2 transition ${selectedItems.includes("reactant_sulfate") ? "bg-slate-500 text-slate-200 line-through" : "bg-purple-300 text-purple-950 hover:-translate-y-0.5"}`}>
            SO₄²⁻
          </button>
          <span>→</span>
          <span className="rounded-2xl bg-cyan-300 px-3 py-2 text-cyan-950">Zn²⁺</span>
          <span>+</span>
          <button type="button" onClick={() => onToggle("product_sulfate")} className={`rounded-2xl px-3 py-2 transition ${selectedItems.includes("product_sulfate") ? "bg-slate-500 text-slate-200 line-through" : "bg-purple-300 text-purple-950 hover:-translate-y-0.5"}`}>
            SO₄²⁻
          </button>
          <span>+</span>
          <span className="rounded-2xl bg-orange-400 px-3 py-2 text-orange-950">Cu</span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <div className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-300/12 p-5 text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">Net ionic equation remains</p>
          <p className="mt-3 text-2xl font-black text-white">{selectedBoth ? "Zn + Cu²⁺ → Zn²⁺ + Cu" : "Tap both SO₄²⁻ ions to reveal it"}</p>
          {selectedBoth ? <p className="mt-2 text-sm font-black text-emerald-100">Net ionic equation remains after the spectator ions move aside.</p> : null}
        </div>
        <div className="rounded-[1.5rem] border border-purple-200/20 bg-purple-300/12 p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-100">Spectator Gallery</p>
          <div className="mt-3 flex gap-2">
            {selectedItems.map((item) => (
              <span key={item} className="rounded-full bg-slate-300 px-3 py-2 text-sm font-black text-slate-800">
                SO₄²⁻
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RedoxTogetherBoard({ reactionRun }: { reactionRun: boolean }) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-orange-200/24 bg-orange-400/12 p-5 text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-100">Oxidation</p>
          <p className="mt-3 text-2xl font-black text-white">Zn loses 2e⁻</p>
          <AnimatePresence>{reactionRun ? <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl bg-orange-300 px-4 py-3 font-black text-orange-950">Zinc is oxidized.</motion.p> : null}</AnimatePresence>
        </div>
        <div className="rounded-[1.5rem] border border-cyan-200/24 bg-cyan-400/12 p-5 text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Reduction</p>
          <p className="mt-3 text-2xl font-black text-white">Cu²⁺ gains 2e⁻</p>
          <AnimatePresence>{reactionRun ? <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl bg-cyan-300 px-4 py-3 font-black text-cyan-950">Copper ion is reduced.</motion.p> : null}</AnimatePresence>
        </div>
      </div>
      <div className="relative h-28 overflow-hidden rounded-[1.5rem] border border-white/12 bg-slate-950/45">
        <div className="absolute left-[14%] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-cyan-200 shadow-lg shadow-cyan-300" />
        <div className="absolute left-[22%] right-[22%] top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-300 via-cyan-200 to-lime-300" />
        <div className="absolute right-[14%] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-orange-300 shadow-lg shadow-orange-300" />
        <AnimatePresence>
          {reactionRun ? (
            <>
              {[0, 1].map((index) => (
                <motion.div key={index} className="absolute left-[18%] top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-cyan-200 text-sm font-black text-cyan-950" initial={{ x: 0, y: index ? 14 : -14 }} animate={{ x: 520, y: index ? 14 : -14 }} transition={{ duration: 0.95, delay: index * 0.08, ease: "easeInOut" }}>
                  e⁻
                </motion.div>
              ))}
            </>
          ) : null}
        </AnimatePresence>
      </div>
      {reactionRun ? <p className="rounded-[1.25rem] bg-lime-300 px-4 py-3 text-center text-lg font-black text-lime-950">One electron transfer creates both events.</p> : null}
    </div>
  );
}

function AgentChallengeBoard({
  answers,
  onAnswer,
}: {
  answers: Record<string, string>;
  onAnswer: (questionId: string, answer: string) => void;
}) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4">
      {redoxAgentQuestions.map((question, index) => {
        const answered = answers[question.id] === question.correctAnswer;
        const locked = index > 0 && answers[redoxAgentQuestions[index - 1].id] !== redoxAgentQuestions[index - 1].correctAnswer;
        return (
          <div key={question.id} className={`rounded-[1.5rem] border p-4 ${answered ? "border-lime-200/30 bg-lime-300/12" : "border-white/12 bg-white/10"}`}>
            <p className="font-black text-white">{question.prompt}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {question.options.map((option) => (
                <button key={option} type="button" disabled={locked || answered} onClick={() => onAnswer(question.id, option)} className="rounded-2xl bg-white/12 px-4 py-2 text-sm font-black text-white transition hover:bg-cyan-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-45">
                  {option}
                </button>
              ))}
            </div>
            {answered ? <p className="mt-3 rounded-2xl bg-lime-300 px-3 py-2 text-sm font-black text-lime-950">{question.explanation}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

export function RedoxTransactionBoard({
  level,
  state,
  onGateAnswer,
  onToggleSpectator,
  onAgentAnswer,
}: {
  level: RedoxLevel;
  state: RedoxGameState;
  onGateAnswer: (answer: string) => void;
  onToggleSpectator: (id: string) => void;
  onAgentAnswer: (questionId: string, answer: string) => void;
}) {
  const murukkuDone = state.murukkuTransferred;
  const electronDone = state.transferredElectrons === 2;

  return (
    <section className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-cyan-200/16 bg-slate-950/58 p-4 shadow-2xl shadow-cyan-950/25 backdrop-blur">
      <img src={redoxAssetManifest.redox_game_board_background.src} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/74 via-slate-900/52 to-blue-950/70" />
      <div className="relative z-10 flex min-h-[398px] items-center justify-center">
        {level.id === "murukku_transaction" ? (
          <div className="grid w-full max-w-5xl items-center gap-4 md:grid-cols-[1fr_260px_1fr]">
            <PersonZone name="Jaya Paati" src={redoxAssetManifest.paati_giving_murukku_character.src} count={murukkuDone ? 0 : 1} label="Giver zone" />
            <div className="grid place-items-center gap-4">
              <p className="rounded-full bg-amber-300 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-amber-950">Same transfer</p>
              <div className="relative h-24 w-[260px]">
                <div className="absolute left-8 right-8 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-300 to-lime-300" />
                <ArrowRight className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-lime-200" aria-hidden />
                <MurukkuToken transferred={murukkuDone} animating={state.isAnimating} />
              </div>
              {murukkuDone ? <p className="rounded-2xl bg-lime-300 px-4 py-3 text-center font-black text-lime-950">This is one transaction.</p> : null}
            </div>
            <PersonZone name="Karthik" src={redoxAssetManifest.karthik_realization_character.src} count={murukkuDone ? 1 : 0} label="Receiver zone" />
          </div>
        ) : level.id === "electron_transaction" ? (
          <div className="grid w-full max-w-5xl items-center gap-4 md:grid-cols-[1fr_320px_1fr]">
            <ChemistryZone label="Giver zone" species={electronDone ? "Zn²⁺" : "Zn"} count={electronDone ? 0 : 2} tone="cyan" />
            <div className="grid place-items-center gap-4">
              <div className="grid gap-2 rounded-[1.25rem] border border-white/16 bg-white/10 p-3 text-center text-sm font-black text-white">
                <span>Murukku transfer: Paati gives → Karthik receives</span>
                <span>Electron transfer: Zn gives 2e⁻ → Cu²⁺ receives 2e⁻</span>
              </div>
              <div className="relative h-32 w-[320px]">
                <div className="absolute left-8 right-8 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-300 to-orange-300" />
                <ElectronCoin index={0} transferred={electronDone} animating={state.isAnimating} />
                <ElectronCoin index={1} transferred={electronDone} animating={state.isAnimating} />
              </div>
            </div>
            <ChemistryZone label="Receiver zone" species={electronDone ? "Cu" : "Cu²⁺"} count={electronDone ? 2 : 0} tone="orange" />
          </div>
        ) : level.id === "oxidation_gate" ? (
          <QuizGate title="LEO gate" equation="Zn → Zn²⁺ + 2e⁻" question="What happened to zinc?" selectedAnswer={state.selectedAnswer} onAnswer={onGateAnswer} successLabel="Loss of Electrons = Oxidation" correctValue="oxidation" options={[{ label: "Lost electrons", value: "oxidation" }, { label: "Gained electrons", value: "gain_wrong" }, { label: "Stayed same", value: "same_wrong" }]} />
        ) : level.id === "reduction_gate" ? (
          <QuizGate title="GER gate" equation="Cu²⁺ + 2e⁻ → Cu" question="What happened to copper ion?" selectedAnswer={state.selectedAnswer} onAnswer={onGateAnswer} successLabel="Gain of Electrons = Reduction" correctValue="reduction" options={[{ label: "Lost electrons", value: "loss_wrong" }, { label: "Gained electrons", value: "reduction" }, { label: "Disappeared", value: "gone_wrong" }]} />
        ) : level.id === "spectator_cleanup" ? (
          <SpectatorCleanupBoard selectedItems={state.selectedItems} onToggle={onToggleSpectator} />
        ) : level.id === "simultaneous_redox" ? (
          <RedoxTogetherBoard reactionRun={state.reactionRun} />
        ) : (
          <AgentChallengeBoard answers={state.agentAnswers} onAnswer={onAgentAnswer} />
        )}
      </div>
    </section>
  );
}
