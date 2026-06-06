"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, RotateCcw, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AparnaHintBox } from "@/components/labs/hydrocarbon-quest/AparnaHintBox";
import { CharacterActor } from "@/components/labs/hydrocarbon-quest/CharacterActor";
import { CinematicScene } from "@/components/labs/hydrocarbon-quest/CinematicScene";
import { LevelHUD } from "@/components/labs/hydrocarbon-quest/LevelHUD";
import { MoleculeGameStage } from "@/components/labs/hydrocarbon-quest/MoleculeGameStage";
import { NamingBlockInventory } from "@/components/labs/hydrocarbon-quest/NamingBlockInventory";
import { NamingSlots } from "@/components/labs/hydrocarbon-quest/NamingSlots";
import { SuccessCutaway } from "@/components/labs/hydrocarbon-quest/SuccessCutaway";
import { useHydrocarbonSound } from "@/components/labs/hydrocarbon-quest/soundHooks";
import { hydrocarbonQuestOpening, hydrocarbonQuestLevels } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestData";
import type { HydrocarbonQuestMode, NumberingOption, SlotMap } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import {
  checkSlotSolution,
  getInitialSlots,
  getLevelProgress,
  isChainComplete,
  isNextAtomCorrect,
} from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestUtils";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  const [feedback, setFeedback] = useState("Click the carbon atoms in order. We are finding the main family line first.");
  const [warning, setWarning] = useState(false);
  const [xp, setXp] = useState(0);
  const [masterHintOpen, setMasterHintOpen] = useState(false);

  const level = hydrocarbonQuestLevels[levelIndex];
  const chainComplete = isChainComplete(level, selectedAtoms);
  const numberingComplete = !level.numberingOptions || numberingOption?.correct === true;
  const canAssemble = chainComplete && numberingComplete;
  const usedBlockIds = Object.values(slots).filter(Boolean) as string[];
  const correctSlotCount = level.slots.filter((slot) => slots[slot.id] === level.correctSlotSolution[slot.id]).length;
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
  }, []);

  function resetLevel(nextIndex: number) {
    const nextLevel = hydrocarbonQuestLevels[nextIndex];
    setLevelIndex(nextIndex);
    setSelectedAtoms([]);
    setWrongAtoms([]);
    setSelectedBlockId(undefined);
    setSlots(getInitialSlots(nextLevel));
    setFailedSlotIds([]);
    setNumberingOption(undefined);
    setFeedback(nextLevel.dialogue[0]?.text ?? "Trace the carbon family line.");
    setWarning(false);
  }

  function handleOpeningNext() {
    setOpeningIndex((current) => current + 1);
  }

  function handleStartQuest() {
    sound.play("click_atom");
    setMode("level");
    resetLevel(0);
  }

  function handleAtomClick(atomId: string) {
    if (chainComplete || mode !== "level") return;
    if (selectedAtoms.includes(atomId)) return;

    if (isNextAtomCorrect(level.correctChainSequence, selectedAtoms, atomId)) {
      const nextAtoms = [...selectedAtoms, atomId];
      setSelectedAtoms(nextAtoms);
      setWrongAtoms([]);
      setWarning(false);
      sound.play("click_atom");
      if (nextAtoms.length === level.correctChainSequence.length) {
        setFeedback(level.chainCompleteMessage);
      } else {
        setFeedback("Good. Keep following the main carbon family line.");
      }
      return;
    }

    sound.play("gentle_error");
    setWrongAtoms([atomId]);
    setWarning(true);
    setFeedback(level.wrongPathHint ?? "Try again. Follow the carbon atoms in the family line from one end to the other.");
  }

  function handleNumberingSelect(option: NumberingOption) {
    setNumberingOption(option);
    if (option.correct) {
      setWarning(false);
      sound.play("snap_correct");
      if (level.id === "methylpentane") {
        setFeedback("Rank 2. Perfect. The side cousin gets the lowest possible number.");
      } else {
        setFeedback("Seat number 1. The double bond VIP is now correctly placed.");
      }
    } else {
      setWarning(true);
      sound.play("snap_wrong");
      if (level.id === "methylpentane") {
        setFeedback("Rank 4 pushes the cousin too far down. Give the branch the lowest possible number.");
      } else {
        setFeedback("You cannot make the VIP sit at the back. Give the double bond seat number 1.");
      }
    }
  }

  function handleSelectBlock(blockId: string) {
    if (!canAssemble || usedBlockIds.includes(blockId)) return;
    sound.play("drag_pickup");
    setSelectedBlockId(blockId);
  }

  function handlePlaceBlock(slotId: string, blockId: string) {
    if (!canAssemble || usedBlockIds.includes(blockId)) return;
    setSlots((current) => ({ ...current, [slotId]: blockId }));
    setFailedSlotIds((current) => current.filter((id) => id !== slotId));
    setSelectedBlockId(undefined);
    sound.play("snap_correct");
  }

  function handleRemoveBlock(slotId: string) {
    setSlots((current) => ({ ...current, [slotId]: undefined }));
    setFailedSlotIds((current) => current.filter((id) => id !== slotId));
  }

  function handleSubmit() {
    if (!canAssemble) {
      setWarning(true);
      setFeedback("Finish the molecule clues first. Then the name blocks will make sense.");
      return;
    }

    if (!checkSlotSolution(level, slots)) {
      sound.play("snap_wrong");
      setWarning(true);
      setFailedSlotIds(level.slots.filter((slot) => slots[slot.id] !== level.correctSlotSolution[slot.id]).map((slot) => slot.id));
      setFeedback("Something in the family name is misplaced. Check the carbon count, branch rank, and bond surname.");
      return;
    }

    sound.play(level.successKind === "flame" ? "flame_whoosh" : "level_complete");
    setWarning(false);
    setFailedSlotIds([]);
    setXp((current) => current + level.xp);
    setMode("success");
  }

  function handleContinueAfterSuccess() {
    if (levelIndex === hydrocarbonQuestLevels.length - 1) {
      awardLocalBadge("hydrocarbon-name-master");
      markLabCompleted(questSlug, xp);
      setMode("final");
      return;
    }

    const nextIndex = levelIndex + 1;
    setMode("level");
    resetLevel(nextIndex);
  }

  function handleRestart() {
    setXp(0);
    setOpeningIndex(0);
    setMode("story");
    resetLevel(0);
  }

  if (mode === "story") {
    return (
      <CinematicScene
        dialogueIndex={openingIndex}
        onNext={handleOpeningNext}
        onSkip={() => setOpeningIndex(hydrocarbonQuestOpening.dialogue.length)}
        onStart={handleStartQuest}
      />
    );
  }

  if (mode === "success") {
    return (
      <SuccessCutaway
        level={level}
        totalXp={xp}
        finalLevel={levelIndex === hydrocarbonQuestLevels.length - 1}
        onContinue={handleContinueAfterSuccess}
      />
    );
  }

  if (mode === "final") {
    return <FinalQuestScene totalXp={xp} onRestart={handleRestart} />;
  }

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-gradient-to-br from-sky-100 via-white to-amber-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(217,70,239,0.18),transparent_24%),radial-gradient(circle_at_50%_98%,rgba(132,204,22,0.22),transparent_30%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto] gap-3 px-3 py-3 sm:px-5">
        <LevelHUD
          level={level}
          levelNumber={levelIndex + 1}
          totalLevels={hydrocarbonQuestLevels.length}
          xp={xp}
          chainProgress={progress}
        />

        <div className="grid min-h-0 gap-3 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <MoleculeGameStage
            level={level}
            selectedAtoms={selectedAtoms}
            wrongAtoms={wrongAtoms}
            numberingOption={numberingOption}
            chainComplete={chainComplete}
            canChooseNumbering={chainComplete && Boolean(level.numberingOptions)}
            onAtomClick={handleAtomClick}
            onNumberingSelect={handleNumberingSelect}
          />

          <div className="grid gap-3 xl:grid-rows-[1fr_auto]">
            <AparnaHintBox
              message={feedback}
              mood={aparnaMood}
              warning={warning}
              onReplay={() => setFeedback(level.dialogue[0]?.text ?? level.learningGoal)}
            />
            <motion.div
              className="rounded-[1.4rem] border-2 border-white bg-white/78 p-3 shadow-lg backdrop-blur-md"
              initial={false}
              animate={{ opacity: masterHintOpen ? 1 : 0.94 }}
            >
              <button
                type="button"
                onClick={() => setMasterHintOpen((open) => !open)}
                className="focus-ring flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-white/70"
              >
                <MasterAlchem mood="avatar" size="xs" showGlow={false} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-slate-950">Ask Master Alchem</span>
                  <span className="block text-xs font-bold text-slate-600">Optional Chemlab guide</span>
                </span>
                <HelpCircle className="h-5 w-5 text-blue-600" aria-hidden="true" />
              </button>
              <AnimatePresence>
                {masterHintOpen ? (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-3 pb-2 text-sm font-bold leading-6 text-slate-700"
                  >
                    Family names help you build IUPAC names: prefix for branches, root for the main chain, suffix for the bond family.
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <div className="grid gap-3 rounded-[1.7rem] border-2 border-white bg-white/84 p-3 shadow-2xl backdrop-blur-md xl:grid-cols-[1fr_1.2fr_auto] xl:items-end">
          <NamingBlockInventory
            blocks={level.availableBlocks}
            selectedBlockId={selectedBlockId}
            usedBlockIds={usedBlockIds}
            enabled={canAssemble}
            onSelect={handleSelectBlock}
          />
          <NamingSlots
            level={level}
            slots={slots}
            selectedBlockId={selectedBlockId}
            failedSlotIds={failedSlotIds}
            enabled={canAssemble}
            onPlace={handlePlaceBlock}
            onRemove={handleRemoveBlock}
          />
          <div className="flex gap-2 xl:flex-col">
            <Button
              className="flex-1 xl:w-full"
              onClick={handleSubmit}
              disabled={!canAssemble}
              icon={<Send className="h-4 w-4" aria-hidden="true" />}
            >
              Submit name
            </Button>
            <Button
              variant="secondary"
              className="flex-1 xl:w-full"
              onClick={() => resetLevel(levelIndex)}
              icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
            >
              Reset level
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalQuestScene({ totalXp, onRestart }: { totalXp: number; onRestart: () => void }) {
  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.28),transparent_28%),radial-gradient(circle_at_78%_16%,rgba(250,204,21,0.22),transparent_24%),radial-gradient(circle_at_50%_88%,rgba(217,70,239,0.24),transparent_32%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto] gap-4 px-4 py-5 sm:px-6">
        <header className="rounded-[1.4rem] border border-white/20 bg-white/12 px-4 py-3 shadow-xl backdrop-blur-md">
          <Badge tone="amber">Quest complete</Badge>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">Hydrocarbon Name Master</h1>
        </header>

        <div className="grid min-h-0 items-end gap-4 lg:grid-cols-[0.8fr_1.2fr_0.8fr]">
          <CharacterActorFinal character="Kabir" />
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative overflow-hidden rounded-[2rem] border-2 border-white bg-white/92 p-6 text-center text-slate-950 shadow-2xl backdrop-blur-md"
          >
            <div className="absolute -left-14 -top-14 h-40 w-40 rounded-full bg-cyan-300/45 blur-3xl" />
            <motion.div
              className="relative mx-auto grid h-40 w-40 place-items-center rounded-[2rem] border-4 border-white bg-gradient-to-br from-amber-300 via-lime-200 to-cyan-300 text-amber-900 shadow-2xl"
              animate={{ y: [0, -12, 0], rotate: [0, -3, 3, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-20 w-20" aria-hidden="true" />
            </motion.div>
            <h2 className="relative mt-6 text-3xl font-black">You named three carbon families.</h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm font-bold leading-6 text-slate-700">
              Butane, 2-Methylpentane, and But-1-ene are no longer foreign words. You can now read the family clues inside a hydrocarbon name.
            </p>
            <div className="relative mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg">
              Total reward: {totalXp} XP
            </div>
          </motion.section>
          <CharacterActorFinal character="Aparna" />
        </div>

        <div className="rounded-[1.6rem] border-2 border-white bg-white/92 p-4 text-slate-950 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-black text-slate-800">Aparna: Keep this rule close. Longest chain first, branch rank next, bond family last.</p>
            <div className="flex gap-2">
              <Button href="/labs">Back to labs</Button>
              <Button variant="secondary" onClick={onRestart}>Replay quest</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CharacterActorFinal({ character }: { character: "Kabir" | "Aparna" }) {
  return (
    <div className="hidden items-end justify-center lg:flex">
      <CharacterActor character={character} pose="celebrating" speaking={character === "Aparna"} size="scene" side={character === "Kabir" ? "left" : "right"} />
    </div>
  );
}
