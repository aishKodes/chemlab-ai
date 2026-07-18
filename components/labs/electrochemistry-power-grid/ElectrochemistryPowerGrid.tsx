"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CellBuilderStage } from "./CellBuilderStage";
import { CellNotationPanel } from "./CellNotationPanel";
import { ElectrochemistryHeroIntro } from "./ElectrochemistryHeroIntro";
import { ElectrochemistryHintPanel } from "./ElectrochemistryHintPanel";
import { ElectrochemistryHUD } from "./ElectrochemistryHUD";
import { ElectrochemistryLevelComplete } from "./ElectrochemistryLevelComplete";
import { ElectrochemistryQuestMap } from "./ElectrochemistryQuestMap";
import { ElectrochemistryQuizGate } from "./ElectrochemistryQuizGate";
import { HalfReactionPanel } from "./HalfReactionPanel";
import { NernstControlPanel } from "./NernstControlPanel";
import { VoltageMeter } from "./VoltageMeter";
import { cellParts, electrochemistryLevels } from "./electrochemistryData";
import { calculateDaniellCellVoltage } from "./electrochemistryCalculations";
import { playElectrochemistrySound } from "./electrochemistrySoundHooks";
import type { CellPart, ConcentrationState, ElectrochemistryLevelId, IonDirectionAnswer } from "./electrochemistryTypes";
import { validateAnodeAnswer, validateCathodeAnswer, validateCellBuild, validateIonDirection } from "./electrochemistryValidation";
import { trackElectrochemistry } from "./electrochemistryAnalytics";

export function ElectrochemistryPowerGrid() {
  const [started, setStarted] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [parts, setParts] = useState<Set<CellPart>>(new Set());
  const [completed, setCompleted] = useState<ElectrochemistryLevelId[]>([]);
  const [xp, setXp] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [reactionActive, setReactionActive] = useState(false);
  const [ionActive, setIonActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [concentrations, setConcentrations] = useState<ConcentrationState>({ zn2Concentration: 1, cu2Concentration: 1, temperatureK: 298 });
  const [answered, setAnswered] = useState({ anode: false, cathode: false, ions: false, nernst: false });

  const level = electrochemistryLevels[levelIndex];
  const voltage = calculateDaniellCellVoltage(concentrations);
  const cellBuilt = validateCellBuild(parts);
  const currentComplete = completed.includes(level.id);

  useEffect(() => {
    if (started) trackElectrochemistry("electrochemistry_lab_opened");
  }, [started]);

  function completeLevel(id = level.id) {
    if (completed.includes(id)) return;
    const nextCompleted = [...completed, id];
    setCompleted(nextCompleted);
    setXp((value) => value + level.xp);
    setFeedback("Excellent. The grid is one step closer to full power.");
    playElectrochemistrySound("level_complete", muted);
    trackElectrochemistry("electrochemistry_level_completed", { level: id, xp: level.xp });
    if (nextCompleted.length === electrochemistryLevels.length) {
      trackElectrochemistry("electrochemistry_completed", { xp: xp + level.xp });
    }
  }

  function installPart(part: CellPart) {
    const next = new Set(parts);
    next.add(part);
    setParts(next);
    setFeedback(`${cellParts.find((item) => item.id === part)?.label} installed.`);
    playElectrochemistrySound(part === "wire" ? "circuit_connect" : "soft_click", muted);
    if (validateCellBuild(next)) {
      setReactionActive(true);
      trackElectrochemistry("electrochemistry_cell_built");
      completeLevel("build_cell");
    }
  }

  function nextLevel() {
    setFeedback("");
    setLevelIndex((value) => Math.min(value + 1, electrochemistryLevels.length - 1));
    trackElectrochemistry("electrochemistry_level_started", { level: electrochemistryLevels[Math.min(levelIndex + 1, electrochemistryLevels.length - 1)].id });
  }

  if (!started) {
    return <ElectrochemistryHeroIntro onStart={() => setStarted(true)} />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.22),transparent_30%),linear-gradient(135deg,#eff6ff,#fdf4ff_45%,#fff7ed)] px-4 py-5">
      <div className="mx-auto grid max-w-[100rem] gap-4 lg:grid-cols-[18rem_1fr_23rem]">
        <aside className="space-y-4">
          <ElectrochemistryHUD level={level} index={levelIndex} total={electrochemistryLevels.length} xp={xp} />
          <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-lg">
            <Badge tone="blue">Current objective</Badge>
            <p className="mt-3 text-sm font-bold leading-6 text-slate-700">{level.objective}</p>
            <div className="mt-4">
              <ElectrochemistryQuestMap levels={electrochemistryLevels} activeId={level.id} completed={completed} />
            </div>
          </div>
          <VoltageMeter voltage={voltage} active={cellBuilt || reactionActive} />
        </aside>

        <section className="space-y-4">
          <CellBuilderStage parts={parts} reactionActive={reactionActive} ionActive={ionActive} />
          <ActionTray
            levelId={level.id}
            parts={parts}
            cellBuilt={cellBuilt}
            currentComplete={currentComplete}
            answered={answered}
            muted={muted}
            onMute={() => setMuted((value) => !value)}
            onInstall={installPart}
            onRunReaction={() => {
              setReactionActive(true);
              setFeedback("Electrons are moving through the external wire from zinc to copper.");
              playElectrochemistrySound("electron_hum", muted);
              trackElectrochemistry("electrochemistry_level_completed", { level: "electron_flow_action" });
              completeLevel("electron_flow");
            }}
            onNext={nextLevel}
          />
          {feedback ? <ElectrochemistryLevelComplete title={feedback} xp={currentComplete ? 0 : level.xp} /> : null}
        </section>

        <aside className="space-y-4">
          <ElectrochemistryHintPanel message={hintFor(level.id)} />
          {level.id === "find_electrodes" ? (
            <div className="space-y-3">
              <ElectrochemistryQuizGate
                question="Where does oxidation happen?"
                options={[
                  { id: "zinc_anode", label: "Zinc side: anode" },
                  { id: "copper_cathode", label: "Copper side: cathode" },
                ]}
                feedback={feedback}
                onAnswer={(answer) => {
                  if (validateAnodeAnswer(answer)) {
                    setAnswered((value) => ({ ...value, anode: true }));
                    setFeedback("Correct. Zinc loses electrons, so oxidation happens at the zinc anode.");
                    playElectrochemistrySound("voltage_success", muted);
                  } else {
                    setFeedback("Try again. Oxidation is loss of electrons. Which metal gives electrons?");
                    playElectrochemistrySound("wrong_soft", muted);
                    trackElectrochemistry("electrochemistry_wrong_anode");
                  }
                }}
              />
              <ElectrochemistryQuizGate
                question="Where does reduction happen?"
                options={[
                  { id: "zinc_anode", label: "Zinc side: anode" },
                  { id: "copper_cathode", label: "Copper side: cathode" },
                ]}
                onAnswer={(answer) => {
                  if (validateCathodeAnswer(answer)) {
                    const next = { ...answered, cathode: true };
                    setAnswered(next);
                    setFeedback("Correct. Cu2+ gains electrons at the copper cathode.");
                    if (next.anode) completeLevel("find_electrodes");
                  } else {
                    setFeedback("Try again. Reduction is gain of electrons. Which ion receives them?");
                    playElectrochemistrySound("wrong_soft", muted);
                    trackElectrochemistry("electrochemistry_wrong_cathode");
                  }
                }}
              />
            </div>
          ) : null}
          {level.id === "ion_flow" ? (
            <ElectrochemistryQuizGate
              question="Which salt bridge movement keeps charge balanced?"
              options={[
                { id: "anions_to_anode_cations_to_cathode", label: "Anions move to anode, cations move to cathode" },
                { id: "anions_to_cathode_cations_to_anode", label: "Anions move to cathode, cations move to anode" },
                { id: "electrons_through_bridge", label: "Electrons move through the salt bridge" },
              ]}
              feedback={feedback}
              onAnswer={(answer) => {
                if (validateIonDirection(answer as IonDirectionAnswer)) {
                  setIonActive(true);
                  setAnswered((value) => ({ ...value, ions: true }));
                  setFeedback("Correct. The salt bridge carries ions, not electrons, to maintain neutrality.");
                  trackElectrochemistry("electrochemistry_level_completed", { level: "ion_flow_choice" });
                  completeLevel("ion_flow");
                } else {
                  setFeedback("Mistake clue: electrons use the wire. Ions use the salt bridge to balance charge.");
                  playElectrochemistrySound("wrong_soft", muted);
                  trackElectrochemistry("electrochemistry_wrong_ion_direction", { answer });
                }
              }}
            />
          ) : null}
          {level.id === "nernst_lab" ? (
            <NernstControlPanel
              concentrations={concentrations}
              onChange={(next) => {
                setConcentrations(next);
                setAnswered((value) => ({ ...value, nernst: true }));
                trackElectrochemistry("electrochemistry_nernst_changed", next);
              }}
              onReset={() => setConcentrations({ zn2Concentration: 1, cu2Concentration: 1, temperatureK: 298 })}
            />
          ) : (
            <>
              <HalfReactionPanel />
              <CellNotationPanel />
            </>
          )}
          {level.id === "nernst_lab" && answered.nernst && !currentComplete ? (
            <Button onClick={() => completeLevel("nernst_lab")}>Complete Nernst Lab</Button>
          ) : null}
          {completed.length === electrochemistryLevels.length ? <FinalBadge /> : null}
        </aside>
      </div>
    </main>
  );
}

function ActionTray({
  levelId,
  parts,
  cellBuilt,
  currentComplete,
  answered,
  muted,
  onMute,
  onInstall,
  onRunReaction,
  onNext,
}: {
  levelId: ElectrochemistryLevelId;
  parts: Set<CellPart>;
  cellBuilt: boolean;
  currentComplete: boolean;
  answered: { anode: boolean; cathode: boolean; ions: boolean; nernst: boolean };
  muted: boolean;
  onMute: () => void;
  onInstall: (part: CellPart) => void;
  onRunReaction: () => void;
  onNext: () => void;
}) {
  const remaining = cellParts.filter((part) => !parts.has(part.id));
  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-black text-slate-700">Action tray</p>
        <button type="button" onClick={onMute} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{muted ? "Sound off" : "Sound on"}</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {levelId === "build_cell" ? remaining.map((part) => (
          <button key={part.id} type="button" className="rounded-2xl bg-blue-600 px-4 py-2 text-xs font-black text-white" onClick={() => onInstall(part.id)}>
            Place {part.label}
          </button>
        )) : null}
        {levelId === "electron_flow" ? (
          <button type="button" className="rounded-2xl bg-cyan-600 px-4 py-2 text-xs font-black text-white disabled:opacity-50" disabled={!cellBuilt} onClick={onRunReaction}>
            Run reaction
          </button>
        ) : null}
        {levelId === "ion_flow" ? <span className="rounded-2xl bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-800">Choose the ion direction on the right.</span> : null}
        {levelId === "nernst_lab" ? <span className="rounded-2xl bg-violet-50 px-4 py-2 text-xs font-black text-violet-800">Move the concentration sliders and watch voltage.</span> : null}
        {currentComplete && levelId !== "nernst_lab" && levelId !== "electron_flow" ? <Button onClick={onNext} size="sm">Continue</Button> : null}
        {currentComplete && levelId === "electron_flow" ? <Button onClick={onNext} size="sm">Continue to salt bridge</Button> : null}
        {currentComplete && levelId === "nernst_lab" ? <span className="rounded-2xl bg-amber-100 px-4 py-2 text-xs font-black text-amber-900">Badge unlocked</span> : null}
        {levelId === "find_electrodes" && answered.anode && answered.cathode && currentComplete ? <Button onClick={onNext} size="sm">Continue</Button> : null}
      </div>
    </div>
  );
}

function hintFor(levelId: ElectrochemistryLevelId) {
  const hints: Record<ElectrochemistryLevelId, string> = {
    build_cell: "A Daniell cell needs two half-cells, a wire for electrons, and a salt bridge for ions.",
    find_electrodes: "Oxidation happens at the anode. In this cell, zinc gives electrons.",
    electron_flow: "Electrons flow through the external wire from zinc anode to copper cathode.",
    ion_flow: "The salt bridge carries ions to prevent charge buildup. It does not carry electrons.",
    nernst_lab: "Changing concentration changes Q. For Daniell cell, Q = [Zn2+] / [Cu2+].",
  };
  return hints[levelId];
}

function FinalBadge() {
  return (
    <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-3xl bg-gradient-to-br from-amber-100 to-emerald-100 p-5 text-center shadow-xl">
      <Badge tone="green">Badge unlocked</Badge>
      <h3 className="mt-3 text-2xl font-black text-slate-950">Electrochemistry Grid Master</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
        You built the cell, traced electrons, balanced ions, and controlled voltage with the Nernst equation.
      </p>
    </motion.div>
  );
}
