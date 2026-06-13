"use client";

import { motion } from "framer-motion";
import { Lock, Play, Star, Trophy } from "lucide-react";
import { hydrocarbonAssetRoles } from "@/components/labs/hydrocarbon-quest/assetManifest";
import { hydrocarbonQuestLevels, hydrocarbonQuestModules } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestData";
import type { HydrocarbonLevel } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function QuestMap({
  completedLevelIds,
  onStartLevel,
}: {
  completedLevelIds: string[];
  onStartLevel: (levelId: string) => void;
}) {
  const completed = new Set(completedLevelIds);
  const firstPlayable = hydrocarbonQuestLevels.find((level) => level.status === "playable" && !completed.has(level.id)) ?? hydrocarbonQuestLevels.find((level) => level.status === "playable");

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-slate-950 py-4 text-white">
      <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${hydrocarbonAssetRoles.quest_map_background.src})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-blue-950/50 to-slate-950/88" />
      <div className="relative mx-auto grid min-h-[calc(100svh-6rem)] max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-4 px-4">
        <div className="flex flex-wrap items-end justify-between gap-4 rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
          <div>
            <Badge tone="cyan">Quest map</Badge>
            <h1 className="mt-3 text-3xl font-black sm:text-5xl">Hydrocarbon Naming Quest</h1>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-cyan-50/90">
              Follow the path from simple family names to senior-secondary naming traps. Every module uses the same rule: branch first, chain middle, bond surname last.
            </p>
          </div>
          {firstPlayable ? (
            <Button onClick={() => onStartLevel(firstPlayable.id)} icon={<Play className="h-4 w-4" aria-hidden="true" />}>
              Start next level
            </Button>
          ) : null}
        </div>

        <div className="grid min-h-0 gap-4 overflow-y-auto pb-4 lg:grid-cols-3">
          {hydrocarbonQuestModules.map((module, moduleIndex) => {
            const levels = hydrocarbonQuestLevels.filter((level) => level.moduleId === module.id);
            const playable = levels.filter((level) => level.status === "playable");
            const moduleCompleted = playable.length > 0 && playable.every((level) => completed.has(level.id));
            const moduleUnlocked = moduleIndex < 3 || playable.some((level) => !completed.has(level.id));
            const role = hydrocarbonAssetRoles[module.assetRole as keyof typeof hydrocarbonAssetRoles] ?? hydrocarbonAssetRoles.game_board_background_futuristic;
            return (
              <motion.article
                key={module.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: moduleIndex * 0.05 }}
                className="group overflow-hidden rounded-[2rem] border border-white/16 bg-white/12 shadow-2xl backdrop-blur-xl"
              >
                <div className="relative h-36 overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${role.src})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                  <div className="absolute left-4 top-4">
                    <Badge tone={moduleCompleted ? "green" : moduleUnlocked ? "blue" : "amber"}>
                      {moduleCompleted ? "completed" : moduleUnlocked ? "unlocked" : "locked"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl font-black text-white">{module.title}</h2>
                    <p className="mt-1 text-xs font-bold text-cyan-50/85">{module.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-950/45 px-3 py-2 text-xs font-black text-white">
                    <span>{playable.length || levels.length} missions</span>
                    <span>{module.xp} XP</span>
                  </div>
                  <div className="grid gap-2">
                    {levels.slice(0, 6).map((level) => (
                      <LevelMapRow key={level.id} level={level} completed={completed.has(level.id)} onStartLevel={onStartLevel} />
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LevelMapRow({
  level,
  completed,
  onStartLevel,
}: {
  level: HydrocarbonLevel;
  completed: boolean;
  onStartLevel: (levelId: string) => void;
}) {
  const playable = level.status === "playable";
  return (
    <button
      type="button"
      disabled={!playable}
      onClick={() => onStartLevel(level.id)}
      className={cn(
        "focus-ring flex items-center gap-3 rounded-2xl border px-3 py-2 text-left transition",
        playable ? "border-white/15 bg-white/12 hover:-translate-y-0.5 hover:bg-white/20" : "cursor-not-allowed border-white/8 bg-slate-950/32 opacity-70",
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
          completed ? "bg-lime-300 text-lime-950" : playable ? "bg-cyan-300 text-blue-950" : "bg-slate-700 text-slate-200",
        )}
      >
        {completed ? <Trophy className="h-4 w-4" aria-hidden="true" /> : playable ? <Star className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-black text-white">{level.targetName}</span>
        <span className="block truncate text-xs font-bold text-cyan-50/70">{level.learningGoal}</span>
      </span>
    </button>
  );
}
