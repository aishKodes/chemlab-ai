import { cleanTextForSpeech } from "./browserSpeech";

export function buildSpokenScript(text: string) {
  return cleanTextForSpeech(text.replace(/\nSources:\n[\s\S]*$/u, ""));
}
