export function buildSpokenScript(text: string) {
  return text
    .replace(/\nSources:\n[\s\S]*$/u, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700);
}
