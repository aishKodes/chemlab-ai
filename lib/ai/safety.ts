export type SafetyStatus = "safe" | "unsafe_chemistry" | "review";

const UNSAFE_PATTERNS = [
  /\b(explosive|explosives|detonator|nitroglycerin|tnt|rdx|hmtd|tatp)\b/i,
  /\b(make|prepare|synthesi[sz]e|cook|manufacture)\b.{0,60}\b(poison|cyanide|ricin|chloroform|methamphetamine|drug)\b/i,
  /\b(chlorine gas|mustard gas|phosgene|hydrogen cyanide|nerve agent)\b/i,
  /\b(home lab|at home)\b.{0,80}\b(acid|chlorine|ammonia|explosive|poison|gas)\b/i,
  /\bself[- ]harm\b|\bsuicide\b/i,
];

export function checkChemistrySafety(message: string): { status: SafetyStatus; reason?: string; safeResponse?: string } {
  const match = UNSAFE_PATTERNS.find((pattern) => pattern.test(message));
  if (!match) return { status: "safe" };
  return {
    status: "unsafe_chemistry",
    reason: "unsafe practical chemistry request",
    safeResponse:
      "I can explain the theory safely, but I cannot guide you through preparing harmful chemicals or unsafe lab actions. Let's study the reaction conceptually in the virtual lab or with school supervision.",
  };
}
