import assert from "node:assert/strict";
import { buildChemShastriCacheKey } from "../lib/chem-shastri/chemShastriAnswerCache";
import { answerChemShastri } from "../lib/chem-shastri/chemShastriService";

async function main() {
  const base = {
    question: "What is oxidation?",
    classLevel: "11",
    mode: "explain",
  };
  assert.notEqual(
    buildChemShastriCacheKey({ ...base, preferredLanguage: "en" }),
    buildChemShastriCacheKey({ ...base, preferredLanguage: "hi" }),
  );
  assert.notEqual(
    buildChemShastriCacheKey({ ...base, chapterSlug: "redox" }),
    buildChemShastriCacheKey({ ...base, chapterSlug: "electrochemistry" }),
  );
  assert.notEqual(
    buildChemShastriCacheKey(base),
    buildChemShastriCacheKey({ ...base, history: "previous question" }),
  );
  const english = await answerChemShastri({
    message: base.question,
    preferredLanguage: "en",
  });
  const hindi = await answerChemShastri({
    message: base.question,
    preferredLanguage: "hi",
  });
  const bengali = await answerChemShastri({
    message: base.question,
    preferredLanguage: "bn",
  });
  assert.match(english.answer, /loss of electrons/i);
  assert.match(hindi.answer, /मतलब/);
  assert.match(bengali.answer, /হারানো/);
  assert.notEqual(english.answer, hindi.answer);
  console.log(
    "PASS: cache separates languages, chapters, and conversation context; localized replies stay isolated.",
  );
}
void main();
