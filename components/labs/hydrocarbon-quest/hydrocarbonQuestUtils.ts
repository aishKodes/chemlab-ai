import type { HydrocarbonLevel, NamingBlock, SlotMap } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export function isNextAtomCorrect(sequence: string[], clickedAtoms: string[], atomId: string) {
  if (clickedAtoms.length === 0) {
    return atomId === sequence[0] || atomId === sequence.at(-1);
  }

  const tracingForward = clickedAtoms[0] === sequence[0];
  const expectedIndex = tracingForward ? clickedAtoms.length : sequence.length - 1 - clickedAtoms.length;
  return sequence[expectedIndex] === atomId;
}

export function isChainComplete(level: HydrocarbonLevel, clickedAtoms: string[]) {
  return isSamePath(level.correctChainSequence, clickedAtoms);
}

export function isSamePath(sequence: string[], clickedAtoms: string[]) {
  if (sequence.length !== clickedAtoms.length) return false;
  const forward = sequence.every((atomId, index) => clickedAtoms[index] === atomId);
  const reverse = sequence.every((atomId, index) => clickedAtoms[sequence.length - 1 - index] === atomId);
  return forward || reverse;
}

export function checkSlotSolution(level: HydrocarbonLevel, slots: SlotMap) {
  return Object.entries(level.correctSlotSolution).every(([slotId, blockId]) => slots[slotId] === blockId);
}

export function getBlockById(blocks: NamingBlock[], blockId?: string) {
  if (!blockId) return undefined;
  return blocks.find((block) => block.id === blockId);
}

export function assembleName(level: HydrocarbonLevel, slots: SlotMap) {
  if (checkSlotSolution(level, slots)) return level.targetName;

  const labels = level.slots
    .map((slot) => getBlockById(level.availableBlocks, slots[slot.id])?.label ?? "")
    .filter(Boolean);

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
