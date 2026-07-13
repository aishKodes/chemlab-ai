import { answerChemShastri } from "../lib/chem-shastri/chemShastriService";

const questions = [
  "What is oxidation?",
  "What is reduction?",
  "Why do oxidation and reduction happen together?",
  "What is reducing agent?",
  "What is oxidizing agent?",
  "What is IUPAC nomenclature?",
  "How do I name butane?",
  "Why is it called 2-methylpentane?",
  "What is mole concept?",
  "What is Avogadro constant?",
  "What are significant figures?",
  "What is precision and accuracy?",
  "What is stoichiometry?",
  "What is limiting reagent?",
  "What is molarity?",
  "Explain states of matter.",
  "Explain classification of matter.",
  "How should I study chemistry?",
  "I am a teacher. How should I explain redox?",
  "I am a teacher. Make 5 questions on redox.",
];

const rawErrorPatterns = [/stack trace/i, /api key/i, /fetch failed/i, /undefined/i, /null given/i, /SQLSTATE/i];

async function main() {
  for (const question of questions) {
    const response = await answerChemShastri({
      message: question,
      role: question.toLowerCase().includes("teacher") ? "teacher" : "student",
      classLevel: "11",
      preferredLanguage: "en",
      currentPage: "/showcase",
      usePageContext: true,
    });
    const answer = response.answer || response.message || "";
    const ok = answer.length > 30 && !response.shouldClarify && !rawErrorPatterns.some((pattern) => pattern.test(answer));
    console.log(JSON.stringify({ ok, question, source: response.source, provider: response.providerUsed ?? response.provider, answerPreview: answer.slice(0, 90) }));
    if (!ok) process.exitCode = 1;
  }
}

void main();
