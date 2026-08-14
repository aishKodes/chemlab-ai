"use client";

import { motion } from "framer-motion";
import { RotateCcw, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AparnaHintBox } from "@/components/labs/hydrocarbon-quest/AparnaHintBox";
import { CinematicStage } from "@/components/labs/hydrocarbon-quest/CinematicStage";
import { HydrocarbonStoryIntro } from "@/components/labs/hydrocarbon-quest/HydrocarbonStoryIntro";
import { LevelHUD } from "@/components/labs/hydrocarbon-quest/LevelHUD";
import { MoleculeBoard } from "@/components/labs/hydrocarbon-quest/MoleculeBoard";
import { NamingBlockInventory } from "@/components/labs/hydrocarbon-quest/NamingBlockInventory";
import { NamingSlots } from "@/components/labs/hydrocarbon-quest/NamingSlots";
import { QuestMap } from "@/components/labs/hydrocarbon-quest/QuestMap";
import { QuestActionGuide, type QuestActionStep } from "@/components/labs/hydrocarbon-quest/QuestActionGuide";
import { SuccessCutaway } from "@/components/labs/hydrocarbon-quest/SuccessCutaway";
import { useHydrocarbonSound } from "@/components/labs/hydrocarbon-quest/soundHooks";
import { hydrocarbonQuestOpening, hydrocarbonQuestLevels } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestData";
import { finalBadgeScene, puzzleScene, stageAreaStyle } from "@/components/labs/hydrocarbon-quest/sceneLayouts";
import { validateIupacAttempt } from "@/components/labs/hydrocarbon-quest/iupacValidator";
import type { HydrocarbonQuestMode, NumberingOption, SlotMap } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import {
  getInitialSlots,
  getLevelProgress,
  isChainComplete,
  isNextAtomCorrect,
} from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestUtils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { trackSimulationComplete, trackSimulationEventClient, trackSimulationStart } from "@/lib/analytics/simulationClient";
import { awardLocalBadge, markLabCompleted, markLabStarted } from "@/lib/progress/labProgress";

const questSlug = "hydrocarbon-naming-quest";

export function HydrocarbonNamingQuest() {
  const sound = useHydrocarbonSound();
  const [mode, setMode] = useState<HydrocarbonQuestMode>("story");
  const [openingIndex, setOpeningIndex] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedAtoms, setSelectedAtoms] = useState<string[]>([]);
  const [wrongAtoms, setWrongAtoms] = useState<string[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>();
  const [slots, setSlots] = useState<SlotMap>(() => getInitialSlots(hydrocarbonQuestLevels[0]));
  const [failedSlotIds, setFailedSlotIds] = useState<string[]>([]);
  const [numberingOption, setNumberingOption] = useState<NumberingOption | undefined>();
  const [feedback, setFeedback] = useState("Tap either end of the carbon chain, then follow each connected carbon.");
  const [warning, setWarning] = useState(false);
  const [xp, setXp] = useState(0);
  const [completedLevelIds, setCompletedLevelIds] = useState<string[]>([]);

  const level = hydrocarbonQuestLevels[levelIndex];
  const playableLevels = hydrocarbonQuestLevels.filter((item) => item.status === "playable");
  const currentPlayableNumber = Math.max(1, playableLevels.findIndex((item) => item.id === level.id) + 1);
  const hasNextPlayableLevel = hydrocarbonQuestLevels.some((item, index) => index > levelIndex && item.status === "playable");
  const chainComplete = isChainComplete(level, selectedAtoms);
  const numberingComplete = !level.numberingOptions || numberingOption?.correct === true;
  const canAssemble = chainComplete && numberingComplete;
  const usedBlockIds = Object.values(slots).filter(Boolean) as string[];
  const correctSlotCount = level.slots.filter((slot) => slots[slot.id] === level.correctSlotSolution[slot.id]).length;
  const allSlotsFilled = level.slots.every((slot) => Boolean(slots[slot.id]));
  const readyToCheck = canAssemble && allSlotsFilled;
  const currentQuestStep: QuestActionStep = !chainComplete
    ? "trace"
    : !numberingComplete
      ? "number"
      : !allSlotsFilled
        ? "build"
        : "check";
  const progress = getLevelProgress({
    chainComplete,
    numberingComplete: chainComplete && numberingComplete,
    slotCount: level.slots.length,
    correctSlotCount,
    levelComplete: mode === "success",
  });

  const aparnaMood = useMemo(() => {
    if (warning) return "warning";
    if (chainComplete && numberingComplete && correctSlotCount === level.slots.length) return "celebrating";
    if (chainComplete) return "pointing";
    return level.dialogue[0]?.pose ?? "thinking";
  }, [chainComplete, correctSlotCount, level, numberingComplete, warning]);

  useEffect(() => {
    markLabStarted(questSlug);
    trackSimulationStart(questSlug);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [mode, levelIndex, openingIndex]);

  function resetLevel(nextIndex: number) {
    const nextLevel = hydrocarbonQuestLevels[nextIndex];
    setLevelIndex(nextIndex);
    setSelectedAtoms([]);
    setWrongAtoms([]);
    setSelectedBlockId(undefined);
    setSlots(getInitialSlots(nextLevel));
    setFailedSlotIds([]);
    setNumberingOption(undefined);
    setFeedback(getLevelStartMessage(nextLevel));
    setWarning(false);
  }

  function handleOpeningNext() {
    setOpeningIndex((current) => {
      const next = current + 1;
      if (next >= hydrocarbonQuestOpening.dialogue.length) setMode("map");
      return next;
    });
  }

  function handleStartLevel(levelId: string) {
    const index = hydrocarbonQuestLevels.findIndex((item) => item.id === levelId && item.status === "playable");
    if (index < 0) return;
    sound.play("click_atom");
    trackSimulationEventClient(questSlug, "level_start", { levelId });
    setMode("level");
    resetLevel(index);
  }

  function handleAtomClick(atomId: string) {
    if (chainComplete || mode !== "level") return;
    if (selectedAtoms.includes(atomId)) return;

    if (isNextAtomCorrect(level.correctChainSequence, selectedAtoms, atomId)) {
      trackSimulationEventClient(questSlug, "atom_clicked", { atomId, levelId: level.id, correct: true });
      const nextAtoms = [...selectedAtoms, atomId];
      setSelectedAtoms(nextAtoms);
      setWrongAtoms([]);
      setWarning(false);
      sound.play("click_atom");
      if (nextAtoms.length === level.correctChainSequence.length) {
        sound.play("correct_chain_completed");
        setFeedback(
          level.numberingOptions
            ? `${level.chainCompleteMessage} Choose one of the two numbering directions below the molecule.`
            : `${level.chainCompleteMessage} The name blocks are now unlocked.`,
        );
      } else {
        setFeedback(`Good. ${level.correctChainSequence.length - nextAtoms.length} carbon${level.correctChainSequence.length - nextAtoms.length === 1 ? "" : "s"} left in the parent chain.`);
      }
      return;
    }

    sound.play("wrong_chain");
    trackSimulationEventClient(questSlug, "wrong_chain", { atomId, levelId: level.id });
    setWrongAtoms([atomId]);
    setWarning(true);
    setFeedback(level.wrongPathHint ?? "Try again. Follow the carbon atoms in the family line from one end to the other.");
  }

  function handleNumberingSelect(option: NumberingOption) {
    setNumberingOption(option);
    if (option.correct) {
      trackSimulationEventClient(questSlug, "numbering_selected", { levelId: level.id, correct: true });
      setWarning(false);
      sound.play("snap_correct");
      if (level.targetName.includes("Methyl")) {
        setFeedback("Rank 2. Perfect. The side cousin gets the lowest possible number.");
      } else if (level.targetName.includes("ene")) {
        setFeedback("Seat number 1. The double bond VIP is now correctly placed.");
      } else {
        setFeedback("Correct numbering. The lowest important locant wins.");
      }
    } else {
      trackSimulationEventClient(questSlug, "wrong_numbering", { levelId: level.id });
      setWarning(true);
      sound.play("snap_wrong");
      if (level.targetName.includes("Methyl")) {
        setFeedback("Rank 4 pushes the cousin too far down. Give the branch the lowest possible number.");
      } else if (level.targetName.includes("ene")) {
        setFeedback("You cannot make the VIP sit at the back. Give the double bond the lowest possible number.");
      } else {
        setFeedback("Try the other numbering direction. Lowest locant wins.");
      }
    }
  }

  function handleSelectBlock(blockId: string) {
    if (!canAssemble || usedBlockIds.includes(blockId)) return;
    trackSimulationEventClient(questSlug, "name_block_selected", { levelId: level.id, blockId });
    const block = level.availableBlocks.find((item) => item.id === blockId);
    const compatibleSlot = block ? getSingleCompatibleSlot(level, block.kind, block.label, slots) : undefined;
    if (compatibleSlot) {
      handlePlaceBlock(compatibleSlot, blockId);
      return;
    }
    sound.play("block_pick");
    setSelectedBlockId(blockId);
    setFeedback("Block selected. Tap the matching empty slot to place it.");
  }

  function handlePlaceBlock(slotId: string, blockId: string) {
    if (!canAssemble || usedBlockIds.includes(blockId)) return;
    const block = level.availableBlocks.find((item) => item.id === blockId);
    if (level.correctSlotSolution[slotId] !== blockId) {
      setFailedSlotIds([slotId]);
      setSelectedBlockId(undefined);
      setWarning(true);
      sound.play("snap_wrong");
      trackSimulationEventClient(questSlug, "wrong_name_block", { levelId: level.id, slotId, blockId });
      setFeedback(getWrongBlockMessage(slotId, block?.label ?? "That block"));
      return;
    }

    const nextSlots = { ...slots, [slotId]: blockId };
    const remaining = level.slots.filter((slot) => !nextSlots[slot.id]).length;
    setSlots(nextSlots);
    setFailedSlotIds((current) => current.filter((id) => id !== slotId));
    setSelectedBlockId(undefined);
    setWarning(false);
    sound.play("block_snap_correct");
    setFeedback(remaining === 0 ? "The full name is assembled. Press Check IUPAC name." : `Correct block. ${remaining} name part${remaining === 1 ? "" : "s"} left.`);
  }

  function handleRemoveBlock(slotId: string) {
    setSlots((current) => ({ ...current, [slotId]: undefined }));
    setFailedSlotIds((current) => current.filter((id) => id !== slotId));
  }

  function handleSubmit() {
    const result = validateIupacAttempt({ level, selectedAtoms, numberingOption, slots });
    trackSimulationEventClient(questSlug, "submit_answer", { levelId: level.id, correct: result.correct });
    if (!result.correct) {
      sound.play("snap_wrong");
      setWarning(true);
      setFailedSlotIds(level.slots.filter((slot) => slots[slot.id] !== level.correctSlotSolution[slot.id]).map((slot) => slot.id));
      setFeedback(`${result.message} ${result.hint}`);
      return;
    }

    sound.play(level.successKind === "flame" ? "flame_whoosh" : "level_complete");
    setWarning(false);
    setFailedSlotIds([]);
    setXp((current) => current + level.xp);
    setCompletedLevelIds((current) => Array.from(new Set([...current, level.id])));
    trackSimulationEventClient(questSlug, "level_complete", { levelId: level.id, xp: level.xp });
    setMode("success");
  }

  function handleContinueAfterSuccess() {
    const nextPlayable = hydrocarbonQuestLevels.find((item, index) => index > levelIndex && item.status === "playable");
    if (!nextPlayable) {
      awardLocalBadge("hydrocarbon-name-master");
      markLabCompleted(questSlug, xp);
      trackSimulationComplete(questSlug, xp, [], { completedLevelIds });
      sound.play("badge_unlock");
      setMode("final");
      return;
    }

    const nextIndex = hydrocarbonQuestLevels.findIndex((item) => item.id === nextPlayable.id);
    setMode("level");
    resetLevel(nextIndex);
  }

  function handleRestart() {
    setXp(0);
    setCompletedLevelIds([]);
    setOpeningIndex(0);
    setMode("story");
    resetLevel(0);
  }

  if (mode === "story") {
    return (
      <HydrocarbonStoryIntro
        index={openingIndex}
        onNext={handleOpeningNext}
        onSkip={() => {
          setOpeningIndex(hydrocarbonQuestOpening.dialogue.length);
          setMode("map");
        }}
      />
    );
  }

  if (mode === "map") {
    return <QuestMap completedLevelIds={completedLevelIds} onStartLevel={handleStartLevel} />;
  }

  if (mode === "success") {
    return (
      <SuccessCutaway
        level={level}
        totalXp={xp}
        finalLevel={!hasNextPlayableLevel}
        onContinue={handleContinueAfterSuccess}
      />
    );
  }

  if (mode === "final") {
    return <FinalQuestScene totalXp={xp} onRestart={handleRestart} />;
  }

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-slate-950 py-4 text-slate-950 xl:h-[calc(100svh-5rem)] xl:min-h-[46rem]">
      <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${puzzleScene.backgroundSrc})` }} />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/88 via-blue-950/50 to-amber-900/45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.26),transparent_32%),radial-gradient(circle_at_82%_16%,rgba(250,204,21,0.20),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl flex-col gap-4 px-4 xl:h-full xl:min-h-0">
        <div className="shrink-0">
          <LevelHUD
            level={level}
            levelNumber={currentPlayableNumber}
            totalLevels={playableLevels.length}
            xp={xp}
            chainProgress={progress}
          />
        </div>

        <div className="grid flex-1 min-h-0 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(24rem,0.75fr)]">
          <div className="min-h-[31rem] overflow-hidden rounded-[2rem] border-2 border-white/70 bg-white/22 p-2 shadow-2xl backdrop-blur-xl xl:h-full xl:min-h-0">
            <MoleculeBoard
              level={level}
              selectedAtoms={selectedAtoms}
              wrongAtoms={wrongAtoms}
              numberingOption={numberingOption}
              chainComplete={chainComplete}
              canChooseNumbering={chainComplete && Boolean(level.numberingOptions)}
              onAtomClick={handleAtomClick}
              onNumberingSelect={handleNumberingSelect}
            />
          </div>

          <aside className="grid min-h-0 gap-3 xl:grid-rows-[auto_minmax(0,1fr)_auto]">
            <AparnaHintBox
              message={feedback}
              mood={aparnaMood}
              warning={warning}
              showCharacter={false}
              className="p-3"
            />

            <div className="min-h-0 space-y-3 overflow-y-auto rounded-[1.6rem] border-2 border-white bg-white/90 p-3 shadow-2xl backdrop-blur-md">
              <QuestActionGuide level={level} currentStep={currentQuestStep} />
              <NamingBlockInventory
                blocks={level.availableBlocks}
                selectedBlockId={selectedBlockId}
                usedBlockIds={usedBlockIds}
                enabled={canAssemble}
                onSelect={handleSelectBlock}
                compact
              />
              <NamingSlots
                level={level}
                slots={slots}
                selectedBlockId={selectedBlockId}
                failedSlotIds={failedSlotIds}
                enabled={canAssemble}
                onPlace={handlePlaceBlock}
                onRemove={handleRemoveBlock}
                compact
              />
            </div>

            <div className="grid gap-2 rounded-[1.4rem] border-2 border-white bg-white/90 p-3 shadow-xl backdrop-blur-md sm:grid-cols-2">
              <Button
                onClick={handleSubmit}
                disabled={!readyToCheck}
                icon={<Send className="h-4 w-4" aria-hidden="true" />}
              >
                Check IUPAC name
              </Button>
              <Button
                variant="secondary"
                onClick={() => resetLevel(levelIndex)}
                icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
              >
                Reset
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function getLevelStartMessage(level: (typeof hydrocarbonQuestLevels)[number]) {
  if (level.moduleId === "vip_double_bonds") {
    return "Start at either end. Tap each connected carbon in the chain that contains the glowing double bond.";
  }
  if (level.moduleId === "cousin_branches") {
    return "Tap the longest connected carbon chain from either end. Leave the hanging cousin out for now.";
  }
  return "Tap either end of the molecule, then follow each connected carbon in the parent chain.";
}

function getSingleCompatibleSlot(
  level: (typeof hydrocarbonQuestLevels)[number],
  kind: (typeof level.availableBlocks)[number]["kind"],
  label: string,
  slots: SlotMap,
) {
  let slotType = kind;
  if (kind === "distractor") {
    if (/^[\d,]+-?$/.test(label)) slotType = "rank";
    else if (/methyl|ethyl/i.test(label)) slotType = "prefix";
  }
  const candidates = level.slots.filter((slot) => {
    if (slots[slot.id]) return false;
    if (slotType === "rank") return slot.id.toLowerCase().includes("rank") || slot.id === "rank";
    if (slotType === "prefix") return slot.id.toLowerCase().includes("prefix") || slot.id === "prefix";
    return slot.id === slotType;
  });
  return candidates.length === 1 ? candidates[0].id : undefined;
}

function getWrongBlockMessage(slotId: string, label: string) {
  if (slotId === "root") return `${label} does not match the number of carbons in the parent chain. Count the blue chain again.`;
  if (slotId === "suffix") return `${label} does not match the highlighted bond. A double bond needs ene; a single bond needs ane.`;
  if (slotId.toLowerCase().includes("rank") || slotId === "rank") return `${label} is not the lowest locant shown by your numbering choice.`;
  if (slotId.toLowerCase().includes("prefix") || slotId === "prefix") return `${label} does not name the highlighted side branch.`;
  return `${label} does not fit this name slot. Use the molecule clue and try another block.`;
}

function FinalQuestScene({ totalXp, onRestart }: { totalXp: number; onRestart: () => void }) {
  const badgeArea = { x: 560, y: 170, width: 820, height: 560 };

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-3 text-white">
      <CinematicStage
        layout={finalBadgeScene}
        showCharacters={false}
        kabirPose="success"
        aparnaPose="celebrating"
        activeSpeaker="Aparna"
        particleTone="gold"
        hud={
          <div className="rounded-[1.25rem] border border-white/25 bg-slate-950/45 px-4 py-3 text-white shadow-xl backdrop-blur-md">
            <Badge tone="amber">Quest complete</Badge>
            <h1 className="mt-2 text-2xl font-black sm:text-4xl">Hydrocarbon Name Master</h1>
          </div>
        }
        dialogue={
          <div className="rounded-[1.35rem] border-2 border-white bg-white/92 p-4 text-slate-950 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-black text-slate-800">Aparna: Keep this rule close. Longest chain first, branch rank next, bond family last.</p>
              <div className="flex gap-2">
                <Button href="/labs">Back to labs</Button>
                <Button variant="secondary" onClick={onRestart}>Replay quest</Button>
              </div>
            </div>
          </div>
        }
      >
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute z-30 overflow-hidden rounded-[2rem] border-2 border-white bg-white/92 p-6 text-center text-slate-950 shadow-2xl backdrop-blur-md"
          style={stageAreaStyle(badgeArea)}
        >
          <div className="absolute -left-14 -top-14 h-40 w-40 rounded-full bg-cyan-300/45 blur-3xl" />
          <motion.div
            className="relative mx-auto grid h-40 w-40 place-items-center rounded-[2rem] border-4 border-white bg-gradient-to-br from-amber-300 via-lime-200 to-cyan-300 text-amber-900 shadow-2xl"
            animate={{ y: [0, -12, 0], rotate: [0, -3, 3, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-20 w-20" aria-hidden="true" />
          </motion.div>
          <h2 className="relative mt-6 text-3xl font-black">You cleared the hydrocarbon naming quest.</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-sm font-bold leading-6 text-slate-700">
            Butane, 2-Methylpentane, But-1-ene, and the senior-secondary boss name are no longer foreign words. You can now read the family clues inside a hydrocarbon name.
          </p>
          <div className="relative mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg">
            Total reward: {totalXp} XP
          </div>
        </motion.section>
      </CinematicStage>
    </section>
  );
}
