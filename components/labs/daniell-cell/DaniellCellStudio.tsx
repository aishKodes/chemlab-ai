"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, CheckCircle2, RotateCcw, Sparkles, Trophy, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { DaniellCellChallenge } from "@/components/labs/daniell-cell/DaniellCellChallenge";
import { DaniellCellGameStage } from "@/components/labs/daniell-cell/DaniellCellGameStage";
import {
  calculateProgressFromSteps,
  checkChallengeAnswer,
  getCellVoltage,
  initialDaniellBuildState,
} from "@/components/labs/daniell-cell/daniellCellLogic";
import {
  daniellChallengeQuestions,
  daniellPhaseStories,
  finalExplanationFacts,
  getPrimaryAction,
  introExchange,
} from "@/components/labs/daniell-cell/daniellCellStory";
import type { DaniellAnswerState, DaniellBuildState, DaniellPhase } from "@/components/labs/daniell-cell/daniellCellTypes";
import { LabShell } from "@/components/lab-engine/LabShell";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { trackSimulationComplete, trackSimulationEventClient, trackSimulationStart } from "@/lib/analytics/simulationClient";
import { cn } from "@/lib/utils";
import { awardLocalBadge, markLabCompleted, markLabStarted } from "@/lib/progress/labProgress";

export function DaniellCellStudio() {
  const reducedMotion = Boolean(useReducedMotion());
  const [phase, setPhase] = useState<DaniellPhase>("cinematic_intro");
  const [buildState, setBuildState] = useState<DaniellBuildState>(initialDaniellBuildState);
  const [reactionProgress, setReactionProgress] = useState(0);
  const [xp, setXp] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, DaniellAnswerState>>({});
  const [latestFeedbackMood, setLatestFeedbackMood] = useState<MasterAlchemMood | null>(null);
  const rewardClaimedRef = useRef(false);

  useEffect(() => {
    if (!buildState.cellStarted) return;
    let frame = 0;
    const tick = () => {
      setReactionProgress((current) => {
        if (current >= 1) return current;
        return Math.min(1, current + (reducedMotion ? 0.0022 : 0.0052));
      });
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [buildState.cellStarted, reducedMotion]);

  const voltage = getCellVoltage(reactionProgress);
  const canChallenge = reactionProgress >= 0.72;
  const currentQuestion = daniellChallengeQuestions[challengeIndex];
  const currentAnswer = answers[currentQuestion.id];
  const correctCount = daniellChallengeQuestions.filter((question) => answers[question.id]?.isCorrect).length;
  const story = useMemo(() => getLiveStory(phase, buildState, latestFeedbackMood), [buildState, latestFeedbackMood, phase]);
  const primaryAction = getPrimaryAction(phase, buildState.zincPlaced, buildState.copperPlaced, canChallenge);

  function addXp(amount: number) {
    setXp((current) => current + amount);
  }

  function handleAction(actionId: string) {
    setLatestFeedbackMood(null);
    trackSimulationEventClient("daniell-cell-studio", "action_clicked", { actionId, phase });

    if (actionId === "build-cell") {
      markLabStarted("daniell-cell-studio");
      trackSimulationStart("daniell-cell-studio");
      setPhase("setup_cell");
      return;
    }

    if (actionId === "place-zinc") {
      setBuildState((current) => ({ ...current, zincPlaced: true }));
      addXp(10);
      return;
    }

    if (actionId === "place-copper") {
      setBuildState((current) => ({ ...current, copperPlaced: true }));
      setPhase("connect_circuit");
      addXp(10);
      return;
    }

    if (actionId === "connect-wire") {
      setBuildState((current) => ({ ...current, wireConnected: true }));
      setPhase("add_salt_bridge");
      addXp(10);
      return;
    }

    if (actionId === "add-salt-bridge") {
      setBuildState((current) => ({ ...current, saltBridgeAdded: true }));
      setPhase("start_reaction");
      addXp(10);
      return;
    }

    if (actionId === "start-cell") {
      setBuildState((current) => ({ ...current, cellStarted: true }));
      setPhase("observe_flow");
      addXp(20);
      return;
    }

    if (actionId === "take-challenge" && canChallenge) {
      setPhase("challenge");
      setChallengeIndex(0);
      return;
    }

    if (actionId === "claim-badge") {
      if (!rewardClaimedRef.current) {
        rewardClaimedRef.current = true;
        addXp(100);
        markLabCompleted("daniell-cell-studio", xp + 100);
        trackSimulationComplete("daniell-cell-studio", xp + 100, [], { correctCount });
        awardLocalBadge("electrochem-explorer");
      }
      setPhase("reward");
      return;
    }

    if (actionId === "restart") {
      rewardClaimedRef.current = false;
      setPhase("cinematic_intro");
      setBuildState(initialDaniellBuildState);
      setReactionProgress(0);
      setXp(0);
      setChallengeIndex(0);
      setAnswers({});
      setLatestFeedbackMood(null);
    }
  }

  function handleAnswer(optionId: string) {
    const isCorrect = checkChallengeAnswer(currentQuestion, optionId);
    trackSimulationEventClient("daniell-cell-studio", isCorrect ? "correct_answer" : "wrong_answer", {
      questionId: currentQuestion.id,
      optionId,
      phase,
    });
    const previousCorrect = Boolean(answers[currentQuestion.id]?.isCorrect);
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: {
        selectedOptionId: optionId,
        isCorrect,
      },
    }));
    setLatestFeedbackMood(isCorrect ? "celebrating" : "warning");
    if (isCorrect && !previousCorrect) addXp(25);
  }

  function handleNextQuestion() {
    setLatestFeedbackMood(null);
    setChallengeIndex((current) => Math.min(current + 1, daniellChallengeQuestions.length - 1));
  }

  function handleFinishChallenge() {
    setLatestFeedbackMood(null);
    setPhase("explanation");
  }

  if (phase === "cinematic_intro") {
    return <DaniellIntro onStart={() => handleAction("build-cell")} />;
  }

  const actionList = primaryAction ? [primaryAction] : [];
  const progress = calculateProgressFromSteps(buildState, phase);

  return (
    <LabShell
      title="Daniell Cell Studio"
      subtitle="Build a galvanic cell and watch electron flow create voltage."
      phase={story.eyebrow}
      progress={progress}
      xp={xp}
      badge="Electrochemistry"
      voltage={`${voltage.toFixed(2)} V`}
      masterAlchemMessage={story.masterAlchemMessage}
      masterAlchemMood={story.mood}
      actions={phase === "challenge" || phase === "reward" ? [] : actionList}
      onAction={handleAction}
      sidePanel={phase === "explanation" ? <FinalExplanationPanel /> : null}
      challenge={
        phase === "challenge" ? (
          <DaniellCellChallenge
            questions={daniellChallengeQuestions}
            currentIndex={challengeIndex}
            answer={currentAnswer}
            correctCount={correctCount}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            onFinish={handleFinishChallenge}
          />
        ) : null
      }
      reward={phase === "reward" ? <RewardPanel xp={xp} onRestart={() => handleAction("restart")} /> : null}
    >
        <DaniellCellGameStage
          phase={phase}
          buildState={buildState}
          reactionProgress={reactionProgress}
          voltage={voltage}
          xp={xp}
          showHud={false}
        />
    </LabShell>
  );
}

function DaniellIntro({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-gradient-to-br from-sky-100 via-white to-violet-100 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.28),transparent_30%),radial-gradient(circle_at_84%_14%,rgba(168,85,247,0.2),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(250,204,21,0.2),transparent_26%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-cyan-100/80 to-transparent" />
      <Container className="relative grid min-h-[calc(100vh-8rem)] items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 rounded-[2.6rem] border-2 border-white bg-white/62 p-5 shadow-2xl backdrop-blur-md lg:grid-cols-[1fr_0.85fr] lg:items-center lg:p-8"
        >
          <div>
            <Badge tone="blue">Class 12 Electrochemistry</Badge>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] text-slate-950 sm:text-6xl lg:text-7xl">
              Daniell Cell Studio
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-slate-700">
              Build a galvanic cell and watch a chemical reaction become voltage.
            </p>
            <div className="mt-7 space-y-3">
              <DialogueLine speaker="Student" text={introExchange[0]} />
              <DialogueLine speaker="Chem-Shastri" text={introExchange[1]} highlight />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={onStart} size="lg" icon={<Zap className="h-5 w-5" aria-hidden="true" />}>
                Build the Cell
              </Button>
              <Button href="/learn/chemistry/chemical-reactions" variant="secondary" size="lg">
                Review reactions
              </Button>
            </div>
          </div>
          <div className="relative min-h-[28rem] overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-blue-950 via-slate-900 to-violet-950 p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.32),transparent_30%),radial-gradient(circle_at_62%_70%,rgba(250,204,21,0.18),transparent_28%)]" />
            <ParticleField />
            <div className="relative grid h-full place-items-center">
              <MasterAlchem mood="guide" size="hero" showGlow className="max-h-[24rem] max-w-[24rem]" />
              <div className="absolute bottom-4 left-4 right-4 rounded-[1.35rem] border border-white/20 bg-white/12 p-4 shadow-xl backdrop-blur-md">
                <p className="text-sm font-black text-cyan-100">Today&apos;s mission</p>
                <p className="mt-2 text-xl font-black text-white">Separate oxidation and reduction, then follow the electrons.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function DialogueLine({ speaker, text, highlight }: { speaker: string; text: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-[1.35rem] border-2 p-4 shadow-lg", highlight ? "border-cyan-200 bg-cyan-50" : "border-white bg-white/80")}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{speaker}</p>
      <p className="mt-2 text-base font-black leading-6 text-slate-800">{text}</p>
    </div>
  );
}

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }, (_, index) => (
        <motion.span
          key={index}
          className="absolute h-2 w-2 rounded-full bg-cyan-200/70 shadow-[0_0_18px_rgba(103,232,249,0.8)]"
          style={{
            left: `${(index * 37) % 96}%`,
            top: `${12 + ((index * 29) % 74)}%`,
          }}
          animate={{ y: [0, -16, 0], opacity: [0.32, 0.82, 0.32] }}
          transition={{ duration: 3.8 + (index % 5) * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function FinalExplanationPanel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.75rem] border-2 border-white bg-white/90 p-5 shadow-2xl backdrop-blur-md"
    >
      <Badge tone="green">Final explanation</Badge>
      <h2 className="mt-3 text-2xl font-black text-slate-950">What made the voltage?</h2>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
        Zinc was oxidized at the anode. Copper ions were reduced at the cathode. The electron flow through the wire produced a voltage.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {finalExplanationFacts.map(([label, value]) => (
          <div key={label} className="rounded-[1.2rem] border border-slate-100 bg-slate-50 p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function RewardPanel({ xp, onRestart }: { xp: number; onRestart: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative overflow-hidden rounded-[1.75rem] border-2 border-white bg-gradient-to-br from-amber-100 via-white to-lime-100 p-5 shadow-2xl"
    >
      <RewardBurst />
      <div className="relative">
        <span className="grid h-16 w-16 place-items-center rounded-[1.4rem] bg-amber-300 text-amber-900 shadow-xl">
          <Trophy className="h-8 w-8" aria-hidden="true" />
        </span>
        <Badge tone="green" className="mt-4">Badge unlocked</Badge>
        <h2 className="mt-3 text-3xl font-black text-slate-950">Electrochem Explorer</h2>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
          You built the cell, traced the electron path, and connected the animation to the chemical equation.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <RewardStat icon={<Sparkles className="h-5 w-5" aria-hidden="true" />} label="XP" value={`${xp}`} />
          <RewardStat icon={<BadgeCheck className="h-5 w-5" aria-hidden="true" />} label="Badge" value="Unlocked" />
          <RewardStat icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />} label="Mission" value="Complete" />
        </div>
        <Button onClick={onRestart} className="mt-5" variant="secondary" icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}>
          Run the cell again
        </Button>
      </div>
    </motion.section>
  );
}

function RewardStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] bg-white/78 p-4 shadow-lg">
      <div className="flex items-center gap-2 text-blue-700">
        {icon}
        <p className="text-xs font-black uppercase tracking-[0.14em]">{label}</p>
      </div>
      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function RewardBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }, (_, index) => (
        <motion.span
          key={index}
          className="absolute h-2.5 w-2.5 rounded-full bg-amber-400"
          style={{
            left: "50%",
            top: "18%",
          }}
          animate={{
            x: Math.cos(index * 0.65) * (60 + (index % 5) * 22),
            y: Math.sin(index * 0.65) * (50 + (index % 4) * 18),
            opacity: [0, 1, 0],
            scale: [0.6, 1.2, 0.5],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            delay: index * 0.08,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function getLiveStory(phase: DaniellPhase, buildState: DaniellBuildState, feedbackMood: MasterAlchemMood | null) {
  const base = daniellPhaseStories[phase];

  if (phase === "setup_cell" && !buildState.zincPlaced) {
    return {
      ...base,
      title: "Place the zinc electrode",
      masterAlchemMessage: "Zinc will be our anode. It is ready to lose electrons.",
      prompt: "Oxidation means loss of electrons.",
    };
  }

  if (phase === "setup_cell" && buildState.zincPlaced && !buildState.copperPlaced) {
    return {
      ...base,
      title: "Place the copper electrode",
      masterAlchemMessage: "Copper will be our cathode. Copper ions will gain electrons here.",
      prompt: "Reduction means gain of electrons.",
    };
  }

  if (phase === "challenge" && feedbackMood === "warning") {
    return {
      ...base,
      mood: "warning" as const,
      masterAlchemMessage: "Try again. Mistakes are clues. Look for where electrons are lost or gained.",
    };
  }

  if (phase === "challenge" && feedbackMood === "celebrating") {
    return {
      ...base,
      mood: "celebrating" as const,
      masterAlchemMessage: "You found the clue. Keep following the electron trail.",
    };
  }

  return base;
}
