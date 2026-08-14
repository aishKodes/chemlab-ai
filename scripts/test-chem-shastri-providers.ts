import {
  chemShastriModelFor,
  chemShastriProviderOrder,
} from "../lib/chem-shastri/providers/providerRouter";
import { directChemistryAnswer } from "../lib/chem-shastri/chemShastriResponseFormatter";

const original = {
  geminiKey: process.env.GEMINI_API_KEY,
  groqKey: process.env.GROQ_API_KEY,
  geminiModel: process.env.GEMINI_MODEL,
  groqModel: process.env.GROQ_MODEL,
  mockMode: process.env.CHEM_SHASTRI_MOCK_MODE,
};

function setKeys(gemini?: string, groq?: string) {
  if (gemini) process.env.GEMINI_API_KEY = gemini;
  else delete process.env.GEMINI_API_KEY;
  if (groq) process.env.GROQ_API_KEY = groq;
  else delete process.env.GROQ_API_KEY;
  delete process.env.CHEM_SHASTRI_MOCK_MODE;
}

const cases = [
  { name: "Gemini only", gemini: "test", expected: ["gemini", "mock"] },
  { name: "Groq only", groq: "test", expected: ["groq", "mock"] },
  { name: "Both", gemini: "test", groq: "test", expected: ["gemini", "groq", "mock"] },
  { name: "Neither", expected: ["mock"] },
];

let failed = false;
for (const item of cases) {
  setKeys(item.gemini, item.groq);
  const actual = chemShastriProviderOrder();
  const pass = JSON.stringify(actual) === JSON.stringify(item.expected);
  console.log(JSON.stringify({ case: item.name, pass, order: actual }));
  if (!pass) failed = true;
}

process.env.GEMINI_MODEL = "gemini-test-model";
process.env.GROQ_MODEL = "groq-test-model";
const modelOverridesPass =
  chemShastriModelFor("gemini") === "gemini-test-model" &&
  chemShastriModelFor("groq") === "groq-test-model";
const hindi = directChemistryAnswer("What is oxidation?", "hi") ?? "";
const bengali = directChemistryAnswer("What is oxidation?", "bn") ?? "";
const languagePass = /LEO/.test(hindi) && /LEO/.test(bengali) && hindi !== bengali;
console.log(JSON.stringify({ modelOverridesPass, languagePass }));
if (!modelOverridesPass || !languagePass) failed = true;

function restore(name: keyof NodeJS.ProcessEnv, value?: string) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}
restore("GEMINI_API_KEY", original.geminiKey);
restore("GROQ_API_KEY", original.groqKey);
restore("GEMINI_MODEL", original.geminiModel);
restore("GROQ_MODEL", original.groqModel);
restore("CHEM_SHASTRI_MOCK_MODE", original.mockMode);

if (failed) process.exitCode = 1;
