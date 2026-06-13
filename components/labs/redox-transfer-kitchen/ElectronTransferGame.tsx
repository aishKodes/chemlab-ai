"use client";

import { ArrowRight, HelpCircle, RotateCcw, Sparkles, Telescope } from "lucide-react";
import { useState } from "react";
import type { Dispatch } from "react";
import { redoxAgentQuestions, redoxLevels } from "./redoxQuestData";
import type { RedoxGameAction } from "./redoxReducer";
import { isCurrentLevelSuccessful } from "./redoxReducer";
import type { RedoxGameState } from "./redoxGameState";
import { Redox3DStage } from "./Redox3DStage";
import { RedoxHintPanel } from "./RedoxHintPanel";
import { RedoxHUD } from "./RedoxHUD";
import { RedoxSoundToggle } from "./RedoxSoundToggle";
import { RedoxTransactionBoard } from "./RedoxTransactionBoard";
import { RedoxTransactionLedger } from "./RedoxTransactionLedger";
import { useRedoxSound } from "./redoxSoundHooks";
import type { RedoxLevelId } from "./redoxTypes";

function primaryActionFor(levelId: RedoxLevelId) {
  if (levelId === "murukku_transaction") return "Give murukku";
  if (levelId === "electron_transaction") return "Transfer electrons";
  if (levelId === "simultaneous_redox") return "Run Redox Reaction";
  return "";
}

function whyTextFor(levelId: RedoxLevelId) {
  if (levelId === "murukku_transaction") return "The snack story makes the transfer idea visible first: one person loses and the other gains in one event.";
  if (levelId === "electron_transaction") return "Electrons are the transferred objects in redox. Zinc is the giver. Copper ion is the receiver.";
  if (levelId === "oxidation_gate") return "LEO is the memory hook: Loss of Electrons is Oxidation.";
  if (levelId === "reduction_gate") return "GER is the memory hook: Gain of Electrons is Reduction.";
  if (levelId === "spectator_cleanup") return "A spectator ion appears unchanged on both sides, so it is removed from the net ionic equation.";
  if (levelId === "simultaneous_redox") return "The same electrons lost by zinc are gained by copper ion. That is why oxidation and reduction happen together.";
  return "Agents are named by what they cause: the giver causes reduction, and the receiver causes oxidation.";
}

export function ElectronTransferGame({
  state,
  dispatch,
  onAction,
  onNext,
  onResetLevel,
}: {
  state: RedoxGameState;
  dispatch: Dispatch<RedoxGameAction>;
  onAction: () => void;
  onNext: () => void;
  onResetLevel: () => void;
}) {
  const [whyOpen, setWhyOpen] = useState(false);
  const { play } = useRedoxSound();
  const level = redoxLevels[state.currentLevelIndex];
  const completed = isCurrentLevelSuccessful(state);
  const xp = redoxLevels.filter((item) => state.completedLevels.includes(item.id)).reduce((total, item) => total + item.xp, 0);
  const primaryAction = primaryActionFor(level.id);
  const showPrimary = Boolean(primaryAction) && !completed;

  return (
    <div className="min-h-screen bg-[#071225] bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.16),transparent_34%)] px-3 py-4 text-white md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1500px] flex-col gap-3">
        <RedoxHUD level={level} levelIndex={state.currentLevelIndex} totalLevels={redoxLevels.length} xp={xp} />

        <main className="grid flex-1 gap-3 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <section className="order-2 xl:order-1">
            <RedoxTransactionLedger state={state} />
          </section>

          <section className="order-1 min-h-[460px] xl:order-2">
            {state.mode === "explore" ? (
              <div className="relative h-full min-h-[520px]">
                <Redox3DStage levelId={level.id} active={completed || state.currentStep !== "objective"} spectatorStripped={state.ledgerState.spectatorRemoved} controlsEnabled />
                <button
                  type="button"
                  onClick={() => dispatch({ type: "set_mode", mode: "game" })}
                  className="absolute right-4 top-4 z-30 rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-cyan-950 shadow-lg"
                >
                  Back to Game View
                </button>
              </div>
            ) : (
              <RedoxTransactionBoard
                level={level}
                state={state}
                onGateAnswer={(answer) => {
                  const correct = (level.id === "oxidation_gate" && answer === "oxidation") || (level.id === "reduction_gate" && answer === "reduction");
                  dispatch({ type: "choose_gate_answer", answer });
                  play(correct ? "correct_answer" : "wrong_answer_soft");
                  if (correct) play("ledger_check");
                }}
                onToggleSpectator={(id) => {
                  const nextSelected = state.selectedItems.includes(id) ? state.selectedItems.filter((item) => item !== id) : [...state.selectedItems, id];
                  dispatch({ type: "toggle_spectator", id });
                  if (nextSelected.includes("reactant_sulfate") && nextSelected.includes("product_sulfate")) {
                    play("ion_transform");
                    play("ledger_check");
                  }
                }}
                onAgentAnswer={(questionId, answer) => {
                  const question = redoxAgentQuestions.find((item) => item.id === questionId);
                  const correct = question?.correctAnswer === answer;
                  dispatch({ type: "answer_agent", questionId, answer });
                  play(correct ? "correct_answer" : "wrong_answer_soft");
                  if (correct) play("ledger_check");
                }}
              />
            )}
          </section>

          <section className="order-3">
            <RedoxHintPanel level={level} feedback={state.feedback} />
          </section>
        </main>

        <footer className="rounded-[1.5rem] border border-white/12 bg-slate-950/76 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Current objective</p>
              <p className="mt-1 text-lg font-black text-white">{level.objective}</p>
              {completed ? <p className="mt-1 text-sm font-bold text-lime-200">{level.successMessage}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <RedoxSoundToggle />
              <button
                type="button"
                onClick={() => setWhyOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/18"
              >
                <HelpCircle className="h-4 w-4" aria-hidden />
                Why?
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "set_mode", mode: state.mode === "explore" ? "game" : "explore" })}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/12 px-4 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300 hover:text-cyan-950"
              >
                <Telescope className="h-4 w-4" aria-hidden />
                {state.mode === "explore" ? "Game View" : "Explore 3D Mode"}
              </button>
              <button type="button" onClick={onResetLevel} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/18">
                <RotateCcw className="h-4 w-4" aria-hidden />
                Reset level
              </button>
              {showPrimary ? (
                <button
                  type="button"
                  disabled={state.isAnimating}
                  onClick={onAction}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-orange-900/30 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
                >
                  <Sparkles className="h-4 w-4" aria-hidden />
                  {primaryAction}
                </button>
              ) : null}
              {completed ? (
                <button type="button" onClick={onNext} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-lime-300 to-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-900/30 transition hover:-translate-y-0.5">
                  {state.currentLevelIndex === redoxLevels.length - 1 ? "Unlock badge" : "Continue"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              ) : null}
            </div>
          </div>
          {whyOpen ? <div className="mt-4 rounded-2xl border border-amber-200/20 bg-amber-300/12 p-4 text-sm font-bold leading-relaxed text-amber-50">{whyTextFor(level.id)}</div> : null}
        </footer>
      </div>
    </div>
  );
}
