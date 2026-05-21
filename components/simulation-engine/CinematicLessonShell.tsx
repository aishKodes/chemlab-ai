"use client";

import { AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { CinematicScene } from "@/components/simulation-engine/CinematicScene";
import { GameHUD, RewardBadge } from "@/components/simulation-engine/GameHUD";
import { StepControls } from "@/components/simulation-engine/StepControls";
import type { CinematicLessonConfig } from "@/components/simulation-engine/simulationTypes";
import { Card } from "@/components/ui/Card";

export function CinematicLessonShell({ config }: { config: CinematicLessonConfig }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>();

  const scene = config.scenes[sceneIndex] ?? config.scenes[0];
  const answeredCorrectly = selectedOptionId === config.challenge.correctOptionId;
  const isLastScene = sceneIndex === config.scenes.length - 1;
  const progress = Math.round(((sceneIndex + 1) / config.scenes.length) * 100);
  const xp = scene.phase === "reward" ? config.xpReward : answeredCorrectly ? Math.round(config.xpReward * 0.45) : sceneIndex * 15;
  const stars = scene.phase === "reward" ? 3 : answeredCorrectly ? 2 : sceneIndex >= 2 ? 1 : 0;

  const currentStepIndex = useMemo(() => {
    if (scene.phase === "story") return 0;
    if (scene.phase === "experiment") return 1;
    if (scene.phase === "challenge") return 2;
    return 3;
  }, [scene.phase]);

  function reset() {
    setSceneIndex(0);
    setSelectedOptionId(undefined);
  }

  function next() {
    if (scene.phase === "challenge" && !answeredCorrectly) return;
    setSceneIndex((current) => Math.min(current + 1, config.scenes.length - 1));
  }

  function back() {
    setSceneIndex((current) => Math.max(current - 1, 0));
  }

  return (
    <div className="space-y-5">
      <GameHUD title={config.title} badge={config.badge} progress={progress} xp={xp} stars={stars} />

      <AnimatePresence mode="wait">
        <CinematicScene
          key={scene.id}
          scene={scene}
          challenge={config.challenge}
          selectedOptionId={selectedOptionId}
          onSelectOption={setSelectedOptionId}
        />
      </AnimatePresence>

      {scene.phase === "reward" ? (
        <Card className="bg-gradient-to-br from-amber-100 via-white to-cyan-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-950">{config.rewardTitle}</h2>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-700">{config.rewardDetail}</p>
            </div>
            <RewardBadge title={config.rewardTitle} detail={`+${config.xpReward} XP`} />
          </div>
        </Card>
      ) : null}

      <StepControls
        steps={config.steps}
        currentIndex={currentStepIndex}
        canGoBack={sceneIndex > 0}
        canGoNext={!isLastScene && (scene.phase !== "challenge" || answeredCorrectly)}
        nextLabel={scene.phase === "challenge" ? "Claim reward" : scene.phase === "story" ? "Start experiment" : "Next scene"}
        onBack={back}
        onNext={next}
        onReset={reset}
      />
    </div>
  );
}
