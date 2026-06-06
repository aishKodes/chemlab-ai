import type { HydrocarbonLevel, NamingBlock, SlotMap } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export function isNextAtomCorrect(sequence: string[], clickedAtoms: string[], atomId: string) {
  return sequence[clickedAtoms.length] === atomId;
}

export function isChainComplete(level: HydrocarbonLevel, clickedAtoms: string[]) {
  return level.correctChainSequence.every((atomId, index) => clickedAtoms[index] === atomId);
}

export function checkSlotSolution(level: HydrocarbonLevel, slots: SlotMap) {
  return Object.entries(level.correctSlotSolution).every(([slotId, blockId]) => slots[slotId] === blockId);
}

export function getBlockById(blocks: NamingBlock[], blockId?: string) {
  if (!blockId) return undefined;
  return blocks.find((block) => block.id === blockId);
}

export function assembleName(level: HydrocarbonLevel, slots: SlotMap) {
  const labels = level.slots
    .map((slot) => getBlockById(level.availableBlocks, slots[slot.id])?.label ?? "")
    .filter(Boolean);

  if (level.id === "methylpentane") return labels.join("");
  if (level.id === "butene") return `${labels[0] ?? ""}-${labels[1] ?? ""}${labels[2] ?? ""}`;
  return labels.join("");
}

export function getInitialSlots(level: HydrocarbonLevel): SlotMap {
  return Object.fromEntries(level.slots.map((slot) => [slot.id, undefined]));
}

export function getLevelProgress({
  chainComplete,
  numberingComplete,
  slotCount,
  correctSlotCount,
  levelComplete,
}: {
  chainComplete: boolean;
  numberingComplete: boolean;
  slotCount: number;
  correctSlotCount: number;
  levelComplete: boolean;
}) {
  if (levelComplete) return 100;
  const chain = chainComplete ? 35 : 0;
  const numbering = numberingComplete ? 25 : 0;
  const assembly = slotCount ? Math.round((correctSlotCount / slotCount) * 35) : 0;
  return Math.min(95, chain + numbering + assembly);
}
