import assert from "node:assert/strict";
import { hydrocarbonQuestLevels } from "../components/labs/hydrocarbon-quest/hydrocarbonQuestData";
import { validateIupacAttempt } from "../components/labs/hydrocarbon-quest/iupacValidator";
import { getInitialSlots, isChainComplete, isNextAtomCorrect } from "../components/labs/hydrocarbon-quest/hydrocarbonQuestUtils";

const playable = hydrocarbonQuestLevels.filter((level) => level.status === "playable");
const moduleThree = playable.filter((level) => level.moduleId === "vip_double_bonds");

assert.deepEqual(
  moduleThree.map((level) => level.targetName),
  ["Ethene", "Propene", "But-1-ene"],
  "Module 3 must expose its three playable alkene missions",
);

for (const level of playable) {
  const forward = [...level.correctChainSequence];
  const reverse = [...level.correctChainSequence].reverse();
  assert.equal(isChainComplete(level, forward), true, `${level.targetName}: forward trace should complete`);
  assert.equal(isChainComplete(level, reverse), true, `${level.targetName}: reverse trace should complete`);

  const traced: string[] = [];
  for (const atomId of reverse) {
    assert.equal(isNextAtomCorrect(level.correctChainSequence, traced, atomId), true, `${level.targetName}: ${atomId} should be accepted from reverse direction`);
    traced.push(atomId);
  }

  const slots = getInitialSlots(level);
  for (const [slotId, blockId] of Object.entries(level.correctSlotSolution)) slots[slotId] = blockId;
  const numberingOption = level.numberingOptions?.find((option) => option.correct);
  const result = validateIupacAttempt({ level, selectedAtoms: reverse, numberingOption, slots });
  assert.equal(result.correct, true, `${level.targetName}: complete valid solution should pass`);
}

const ethene = moduleThree.find((level) => level.targetName === "Ethene");
const propene = moduleThree.find((level) => level.targetName === "Propene");
const butOneEne = moduleThree.find((level) => level.targetName === "But-1-ene");
assert.ok(ethene && propene && butOneEne, "All Module 3 levels must exist");
assert.equal(ethene.numberingOptions, undefined, "Ethene should not ask for a redundant locant");
assert.equal(propene.numberingOptions, undefined, "Propene should not ask for a redundant locant");
assert.deepEqual(ethene.slots.map((slot) => slot.id), ["root", "suffix"]);
assert.deepEqual(propene.slots.map((slot) => slot.id), ["root", "suffix"]);
assert.deepEqual(butOneEne.slots.map((slot) => slot.id), ["root", "rank", "suffix"]);
assert.ok(butOneEne.numberingOptions?.find((option) => option.correct)?.doubleBondPosition === 1);
assert.ok(butOneEne.molecule.bonds.some((bond) => bond.type === "double"), "But-1-ene must render a double bond");

const wrongNumbering = butOneEne.numberingOptions?.find((option) => !option.correct);
const wrongNumberingResult = validateIupacAttempt({
  level: butOneEne,
  selectedAtoms: butOneEne.correctChainSequence,
  numberingOption: wrongNumbering,
  slots: { ...butOneEne.correctSlotSolution },
});
assert.equal(wrongNumberingResult.correct, false, "But-1-ene must reject numbering from the far end");

console.log(`Hydrocarbon Quest regression checks passed for ${playable.length} playable levels, including all ${moduleThree.length} Module 3 missions.`);
