import { answerChemShastri } from "../lib/chem-shastri/chemShastriService";

const cases = [
  {
    message: "why zinc is reducing agent?",
    simulationSlug: "redox-transfer-kitchen",
    currentPage: "/labs/redox-transfer-kitchen",
    expected: [/zinc/i, /reducing agent/i, /electron/i],
  },
  {
    message: "why count from left?",
    simulationSlug: "hydrocarbon-naming-quest",
    currentPage: "/labs/hydrocarbon-naming-quest",
    expected: [/lowest/i, /number/i, /methyl|locant|branch/i],
  },
  {
    message: "why Avogadro number?",
    simulationSlug: "basic-concepts-chemistry-universe",
    currentPage: "/labs/basic-concepts-chemistry-universe",
    expected: [/mole/i, /particle/i, /6\.022|six/i],
  },
  {
    message: "why water is bent?",
    simulationSlug: "molecule-shapes-3d",
    currentPage: "/labs/molecule-shapes-3d",
    expected: [/water/i, /bent/i, /lone/i],
  },
];

async function main() {
  for (const item of cases) {
    const response = await answerChemShastri({
      message: item.message,
      role: "student",
      classLevel: "11",
      preferredLanguage: "en",
      currentPage: item.currentPage,
      simulationSlug: item.simulationSlug,
      usePageContext: true,
    });
    const answer = response.answer || response.message || "";
    const ok = item.expected.every((pattern) => pattern.test(answer)) && !response.shouldClarify;
    console.log(JSON.stringify({ ok, page: item.currentPage, answerPreview: answer.slice(0, 120), chips: response.contextChips }));
    if (!ok) process.exitCode = 1;
  }
}

void main();
