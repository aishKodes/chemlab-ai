import type { ChemShastriLanguage } from "./chemShastriTypes";
import { findCuratedFallbackAnswer } from "./curatedFallbackAnswers";

const DIRECT_ANSWERS: Array<{ pattern: RegExp; answer: string }> = [
  {
    pattern: /\bwhat is oxidation\b|\boxidation meaning\b|\bdefine oxidation\b/i,
    answer:
      "Oxidation means loss of electrons. In school chemistry, remember LEO: Loss of Electrons is Oxidation. Example: Zn -> Zn²⁺ + 2e⁻, so zinc is oxidized.",
  },
  {
    pattern: /\bwhat is reduction\b|\breduction meaning\b|\bdefine reduction\b/i,
    answer:
      "Reduction means gain of electrons. Remember GER: Gain of Electrons is Reduction. Example: Cu²⁺ + 2e⁻ -> Cu, so copper ion is reduced.",
  },
  {
    pattern: /\bredox\b.*\btogether\b|\boxidation and reduction\b.*\binseparable\b|\bwhy.*redox\b/i,
    answer:
      "Redox is one electron-transfer transaction. One substance gives electrons, so it is oxidized. Another receives those same electrons, so it is reduced. They happen together because electrons cannot be lost into nowhere.",
  },
  {
    pattern: /\bspectator ion\b|\bso4\b|\bsulphate\b|\bsulfate\b/i,
    answer:
      "A spectator ion is present before and after the reaction without changing. In Zn + CuSO₄ -> ZnSO₄ + Cu, SO₄²⁻ stays as sulphate on both sides, so the net ionic reaction is Zn + Cu²⁺ -> Zn²⁺ + Cu.",
  },
  {
    pattern: /\breducing agent\b|\boxidizing agent\b|\boxidising agent\b/i,
    answer:
      "The reducing agent is the substance that gets oxidized because it gives electrons to reduce another substance. The oxidizing agent is the substance that gets reduced because it receives electrons and causes oxidation. In the zinc-copper reaction, zinc is the reducing agent and Cu²⁺ is the oxidizing agent.",
  },
  {
    pattern: /\biupac|hydrocarbon|methyl|butane|pentane|alkene|alkane/i,
    answer:
      "For hydrocarbon naming, first find the longest carbon chain, then number from the end that gives the first branch or multiple bond the lowest number. Root words tell chain length: meth, eth, prop, but, pent. Suffix tells bond type: ane for single, ene for double, yne for triple.",
  },
];

const LANGUAGE_DIRECT_ANSWERS: Record<"hi" | "bn", Array<{ pattern: RegExp; answer: string }>> = {
  hi: [
    {
      pattern: /oxidation|ऑक्सीकरण/i,
      answer: "Oxidation का मतलब electrons का निकलना है। याद रखें: LEO — Loss of Electrons is Oxidation. उदाहरण: Zn → Zn²⁺ + 2e⁻।",
    },
    {
      pattern: /\bmole\b|मोल/i,
      answer: "Mole पदार्थ की मात्रा की SI unit है। एक mole में 6.02214076 × 10²³ कण होते हैं। ये कण atoms, molecules या ions हो सकते हैं।",
    },
    {
      pattern: /significant figures|सार्थक अंक/i,
      answer: "Significant figures किसी measurement में भरोसेमंद digits बताते हैं। सभी non-zero digits significant होते हैं; शुरू के zeros नहीं, लेकिन decimal के बाद के अंतिम zeros significant हो सकते हैं।",
    },
  ],
  bn: [
    {
      pattern: /oxidation|জারণ/i,
      answer: "Oxidation মানে electron হারানো। মনে রাখো: LEO — Loss of Electrons is Oxidation। উদাহরণ: Zn → Zn²⁺ + 2e⁻।",
    },
    {
      pattern: /\bmole\b|মোল/i,
      answer: "Mole হলো পদার্থের পরিমাণের SI unit। এক mole-এ 6.02214076 × 10²³ টি কণা থাকে। কণাগুলি atom, molecule বা ion হতে পারে।",
    },
    {
      pattern: /significant figures|সার্থক অঙ্ক/i,
      answer: "Significant figures একটি measurement-এর নির্ভরযোগ্য digits দেখায়। সব non-zero digit significant; শুরুর zero নয়, তবে decimal-এর পরে শেষের zero significant হতে পারে।",
    },
  ],
};

export function directChemistryAnswer(message: string, language: ChemShastriLanguage = "en") {
  if (language === "hi" || language === "bn") {
    const localized = LANGUAGE_DIRECT_ANSWERS[language].find((entry) => entry.pattern.test(message));
    if (localized) return localized.answer;
  }
  return findCuratedFallbackAnswer(message)?.answer ?? DIRECT_ANSWERS.find((entry) => entry.pattern.test(message))?.answer ?? null;
}

export function languageNotice(language: ChemShastriLanguage) {
  if (language === "hi") return "You can ask in Hindi or Hinglish too.";
  if (language === "bn") return "You can ask in Bengali too.";
  return null;
}
