export type BrowserVoiceInstruction = {
  mode: "browser";
  provider: "browser";
  text: string;
  language: string;
  autoSpeak: boolean;
};

export function browserVoiceInstruction(text: string, language = "en-IN"): BrowserVoiceInstruction {
  return {
    mode: "browser",
    provider: "browser",
    text,
    language,
    autoSpeak: process.env.VOICE_AUTO_SPEAK === "true",
  };
}
