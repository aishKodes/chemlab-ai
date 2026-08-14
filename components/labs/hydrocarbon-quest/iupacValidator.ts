import type { HydrocarbonLevel, NumberingOption, SlotMap } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { isSamePath } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestUtils";

export type IupacValidationResult =
  | {
      correct: true;
      message: string;
      hint: string;
    }
  | {
      correct: false;
      errorType: "incomplete_chain" | "wrong_chain" | "wrong_numbering" | "wrong_name_block" | "incomplete_name";
      message: string;
      hint: string;
    };

export function validateIupacAttempt({
  level,
  selectedAtoms,
  numberingOption,
  slots,
}: {
  level: HydrocarbonLevel;
  selectedAtoms: string[];
  numberingOption?: NumberingOption;
  slots: SlotMap;
}): IupacValidationResult {
  if (selectedAtoms.length < level.correctChainSequence.length) {
    return {
      correct: false,
      errorType: "incomplete_chain",
      message: "The main chain is not fully traced yet.",
      hint: "Start at one end of the parent chain and tap every carbon in order.",
    };
  }

  const chainCorrect = isSamePath(level.correctChainSequence, selectedAtoms);
  if (!chainCorrect) {
    const traceTask = level.tasks.find((task) => task.type === "trace_main_chain");
    return {
      correct: false,
      errorType: "wrong_chain",
      message: "That path includes a branch or misses the longest parent chain.",
      hint: traceTask?.wrongHint ?? "Find the longest continuous carbon chain first.",
    };
  }

  if (level.numberingOptions?.length && !numberingOption?.correct) {
    const directionTask = level.tasks.find((task) => task.type === "choose_numbering_direction");
    return {
      correct: false,
      errorType: "wrong_numbering",
      message: getWrongNumberingMessage(level),
      hint: directionTask?.wrongHint ?? "Number from the side that gives the first important feature the lowest number.",
    };
  }

  const emptySlot = level.slots.find((slot) => !slots[slot.id]);
  if (emptySlot) {
    return {
      correct: false,
      errorType: "incomplete_name",
      message: `${emptySlot.label} is still empty.`,
      hint: "Use the molecule clues first, then place the matching name block.",
    };
  }

  const wrongSlot = level.slots.find((slot) => slots[slot.id] !== level.correctSlotSolution[slot.id]);
  if (wrongSlot) {
    return {
      correct: false,
      errorType: "wrong_name_block",
      message: `${wrongSlot.label} has the wrong block.`,
      hint: getSlotHint(wrongSlot.id),
    };
  }

  return {
    correct: true,
    message: `${level.targetName} is correct.`,
    hint: level.explanation,
  };
}

function getWrongNumberingMessage(level: HydrocarbonLevel) {
  if (level.targetName.includes("Methyl")) {
    return "The branch can get a lower number from the other side.";
  }
  if (level.targetName.includes("ene")) {
    return "The double bond must get the lowest possible number.";
  }
  if (level.targetName.includes("yne")) {
    return "The triple bond must get the lowest possible number.";
  }
  return "The numbering direction gives a higher locant than necessary.";
}

function getSlotHint(slotId: string) {
  if (slotId.includes("Rank") || slotId === "rank" || slotId.includes("Locant")) return "Locants are numbers. Give branches and multiple bonds the lowest possible positions.";
  if (slotId.includes("Prefix") || slotId === "prefix") return "The prefix names the side branch, such as methyl or ethyl.";
  if (slotId === "root") return "The root word comes from the number of carbons in the main chain.";
  if (slotId === "suffix") return "The suffix comes from the bond family: single, double, or triple.";
  return "Check the family-name rule: prefix first, root in the middle, suffix at the end.";
}
