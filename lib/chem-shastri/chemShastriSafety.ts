import { checkChemistrySafety } from "@/lib/ai/safety";

const STRICT_UNSAFE_PATTERNS = [
  /\b(step[- ]by[- ]step|recipe|procedure|exact amounts?|concentration|temperature|yield)\b.{0,80}\b(explosive|poison|toxin|weapon|drug|cyanide|chloroform|chlorine gas)\b/i,
  /\b(bypass|hide|evade|undetectable)\b.{0,80}\b(lab|police|school|safety)\b/i,
  /\b(make|generate|release)\b.{0,80}\b(toxic gas|chlorine gas|hydrogen cyanide|phosgene)\b/i,
  /\bwithout supervision\b.{0,80}\b(acid|base|gas|oxidizer|solvent)\b/i,
];

export function checkChemShastriSafety(message: string) {
  const base = checkChemistrySafety(message);
  if (base.status !== "safe") return base;
  const strictMatch = STRICT_UNSAFE_PATTERNS.find((pattern) => pattern.test(message));
  if (!strictMatch) return base;
  return {
    status: "unsafe_chemistry" as const,
    reason: "unsafe procedural chemistry request",
    safeResponse:
      "I can help with the school-level theory, hazards, and safe lab reasoning, but I cannot provide practical instructions for harmful chemicals or unsafe procedures. Let us reframe this as a safe concept question.",
  };
}
