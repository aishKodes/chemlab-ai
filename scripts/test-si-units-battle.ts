import {
  SI_NCERT_SOURCE,
  siBaseCores,
  siUnitsQuickDrillQuestions,
} from "../data/quizzes/siUnitsBattle";

const expectedCores = [
  ["Length", "metre", "m"],
  ["Mass", "kilogram", "kg"],
  ["Time", "second", "s"],
  ["Electric current", "ampere", "A"],
  ["Thermodynamic temperature", "kelvin", "K"],
  ["Amount of substance", "mole", "mol"],
  ["Luminous intensity", "candela", "cd"],
];

const coreErrors = expectedCores.filter(
  ([quantity, unit, symbol], index) => {
    const actual = siBaseCores[index];
    return actual?.quantity !== quantity || actual.unit !== unit || actual.symbol !== symbol;
  },
);
const questionErrors = siUnitsQuickDrillQuestions.filter(
  (question) =>
    !question.options.includes(question.answer) ||
    !question.explanation.trim() ||
    !question.mistakeKey.trim() ||
    !question.sourceReference.includes("NCERT Class 11 Chemistry") ||
    !["exact", "adapted"].includes(question.exactOrAdapted),
);
const ids = siUnitsQuickDrillQuestions.map((question) => question.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

console.log(
  JSON.stringify({
    source: SI_NCERT_SOURCE,
    baseCoreCount: siBaseCores.length,
    questionCount: siUnitsQuickDrillQuestions.length,
    coreErrors,
    questionErrors: questionErrors.map((question) => question.id),
    duplicateIds,
  }),
);

if (siBaseCores.length !== 7 || coreErrors.length || questionErrors.length || duplicateIds.length) {
  process.exitCode = 1;
}
