import { answerChemShastri } from "../lib/chem-shastri/chemShastriService";

const cases = [
  { message: "Why is zinc the anode?", expected: [/zinc/i, /anode/i, /oxidation|lose/i] },
  { message: "Why do electrons flow from zinc to copper?", expected: [/electron/i, /zinc/i, /copper/i] },
  { message: "What is the salt bridge doing?", expected: [/salt bridge/i, /ion/i, /charge/i] },
  { message: "Why does voltage change when concentration changes?", expected: [/Nernst|concentration/i, /voltage/i] },
  { message: "What is Nernst equation?", expected: [/Ecell|Nernst/i, /Zn|Cu/i] },
  { message: "What is cell notation?", expected: [/Zn/i, /Cu/i, /salt bridge|double line/i] },
  { message: "Why is E cell 1.10 V?", expected: [/1\.10|one point one|0\.34|0\.76/i, /cathode|anode/i] },
];

async function main() {
  for (const item of cases) {
    const response = await answerChemShastri({
      message: item.message,
      role: "student",
      classLevel: "12",
      preferredLanguage: "en",
      currentPage: "/labs/electrochemistry-power-grid",
      simulationSlug: "electrochemistry-power-grid",
      usePageContext: true,
    });
    const answer = response.answer || response.message || "";
    const ok = item.expected.every((pattern) => pattern.test(answer)) && !response.shouldClarify;
    console.log(JSON.stringify({ ok, message: item.message, answerPreview: answer.slice(0, 140), chips: response.contextChips }));
    if (!ok) process.exitCode = 1;
  }
}

void main();
