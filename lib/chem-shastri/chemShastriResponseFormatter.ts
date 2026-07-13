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

export function directChemistryAnswer(message: string) {
  return findCuratedFallbackAnswer(message)?.answer ?? DIRECT_ANSWERS.find((entry) => entry.pattern.test(message))?.answer ?? null;
}

export function languageNotice(language: ChemShastriLanguage) {
  if (language === "hi") return "You can ask in Hindi or Hinglish too.";
  if (language === "bn") return "You can ask in Bengali too.";
  if (language === "or") return "You can ask in Odia too.";
  return null;
}
