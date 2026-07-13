export type BrowserVoiceSettings = {
  voiceURI?: string;
  rate: number;
  pitch: number;
  volume: number;
  language: string;
};

export type ScoredVoice = SpeechSynthesisVoice & {
  qualityScore: number;
  qualityLabel: string;
};

const STORAGE_KEY = "chemlab_voice_settings";

export const defaultBrowserVoiceSettings: BrowserVoiceSettings = {
  rate: 0.95,
  pitch: 1,
  volume: 0.9,
  language: "en-IN",
};

export function loadBrowserVoiceSettings(): BrowserVoiceSettings {
  if (typeof window === "undefined") return defaultBrowserVoiceSettings;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null") as Partial<BrowserVoiceSettings> | null;
    return {
      ...defaultBrowserVoiceSettings,
      ...parsed,
      rate: clamp(Number(parsed?.rate ?? defaultBrowserVoiceSettings.rate), 0.85, 1),
      pitch: clamp(Number(parsed?.pitch ?? defaultBrowserVoiceSettings.pitch), 0.95, 1.05),
      volume: clamp(Number(parsed?.volume ?? defaultBrowserVoiceSettings.volume), 0, 1),
    };
  } catch {
    return defaultBrowserVoiceSettings;
  }
}

export function saveBrowserVoiceSettings(settings: BrowserVoiceSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function cleanTextForSpeech(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\|.+\|/g, " ")
    .replace(/[#*_>`~]/g, "")
    .replace(/Zn²⁺|Zn2\+/g, "zinc two plus")
    .replace(/Cu²⁺|Cu2\+/g, "copper two plus")
    .replace(/SO₄²⁻|SO4 2-|SO4-2/g, "sulphate two minus")
    .replace(/2e⁻|2e-/g, "two electrons")
    .replace(/6\.022\s*[×x]\s*10(?:\^|\s*to the power\s*)?²?³?/gi, "six point zero two two into ten to the power twenty three")
    .replace(/→|->/g, " becomes ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700);
}

export function getBrowserVoices(): ScoredVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  return window.speechSynthesis
    .getVoices()
    .map((voice) => Object.assign(voice, scoreVoice(voice)))
    .sort((a, b) => b.qualityScore - a.qualityScore);
}

export function chooseBestVoice(settings: BrowserVoiceSettings, voices = getBrowserVoices()) {
  return (
    voices.find((voice) => voice.voiceURI === settings.voiceURI) ??
    voices.find((voice) => voice.lang === settings.language) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(settings.language.slice(0, 2).toLowerCase())) ??
    voices[0] ??
    null
  );
}

export function speakWithBrowser(text: string, settings: BrowserVoiceSettings) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return { ok: false, reason: "unsupported" };
  const spoken = cleanTextForSpeech(text);
  if (!spoken) return { ok: false, reason: "empty" };

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(spoken);
  const voice = chooseBestVoice(settings);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || settings.language;
  utterance.rate = clamp(settings.rate, 0.85, 1);
  utterance.pitch = clamp(settings.pitch, 0.95, 1.05);
  utterance.volume = clamp(settings.volume, 0, 1);
  window.speechSynthesis.speak(utterance);
  return { ok: true, text: spoken, voiceName: voice?.name ?? "browser default" };
}

export function stopBrowserSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function scoreVoice(voice: SpeechSynthesisVoice) {
  const haystack = `${voice.name} ${voice.lang} ${voice.voiceURI}`.toLowerCase();
  let qualityScore = 0;
  for (const keyword of ["google", "microsoft", "natural", "neural", "premium", "enhanced", "en-in", "hi-in", "bengali", "bangla", "odia", "oriya"]) {
    if (haystack.includes(keyword)) qualityScore += 2;
  }
  if (voice.localService) qualityScore += 1;
  if (haystack.includes("default")) qualityScore += 0.5;
  const qualityLabel = qualityScore >= 5 ? "recommended" : qualityScore >= 2 ? "good" : "basic";
  return { qualityScore, qualityLabel };
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}
