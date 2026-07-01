import { buildChemShastriContext } from "../lib/chem-shastri/chemShastriContextBuilder";
import { detectChemShastriIntent, shouldAskClarifyingQuestion } from "../lib/chem-shastri/chemShastriIntentDetector";
import { resolveChemShastriMode } from "../lib/chem-shastri/chemShastriModeResolver";
import { directChemistryAnswer } from "../lib/chem-shastri/chemShastriResponseFormatter";

const cases = [
  {
    message: "What is oxidation?",
    classLevel: "10" as const,
    currentPage: "/labs/redox-transfer-kitchen",
    expectedClarify: false,
  },
  {
    message: "Explain",
    classLevel: "11" as const,
    currentPage: "/simulations/molecule-explorer",
    expectedClarify: true,
  },
  {
    message: "Why are oxidation and reduction inseparable?",
    classLevel: "10" as const,
    currentPage: "/labs/redox-transfer-kitchen",
    expectedClarify: false,
  },
];

for (const item of cases) {
  const mode = resolveChemShastriMode("explain");
  const context = buildChemShastriContext({
    message: item.message,
    classLevel: item.classLevel,
    currentPage: item.currentPage,
    role: "student",
    preferredLanguage: "en",
  });
  const intent = detectChemShastriIntent(item.message, mode);
  const clarification = shouldAskClarifyingQuestion(item.message);
  const direct = directChemistryAnswer(item.message);
  const pass = clarification.shouldClarify === item.expectedClarify;
  console.log(
    JSON.stringify(
      {
        pass,
        message: item.message,
        intent,
        shouldClarify: clarification.shouldClarify,
        directAnswer: Boolean(direct),
        chips: context.chips,
      },
      null,
      2,
    ),
  );
  if (!pass) process.exitCode = 1;
}
