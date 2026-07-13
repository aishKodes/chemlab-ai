"use client";

import { Square, Volume2 } from "lucide-react";
import { speakWithBrowser, stopBrowserSpeech, type BrowserVoiceSettings } from "@/lib/voice/browserSpeech";

export function ChemShastriSpeakButton({
  text,
  settings,
  onSpoken,
}: {
  text: string;
  settings: BrowserVoiceSettings;
  onSpoken?: (metadata: { voiceName?: string; text?: string }) => void;
}) {
  return (
    <span className="inline-flex gap-1">
      <button
        type="button"
        className="rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] font-black text-blue-700 hover:bg-blue-100"
        onClick={() => {
          const result = speakWithBrowser(text, settings);
          if (result.ok) onSpoken?.({ voiceName: result.voiceName, text: result.text });
        }}
      >
        <Volume2 className="mr-1 inline h-3 w-3" aria-hidden="true" />
        speak
      </button>
      <button
        type="button"
        aria-label="Stop Chem-Shastri voice"
        className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white/80 text-slate-600 hover:bg-white"
        onClick={stopBrowserSpeech}
      >
        <Square className="h-3 w-3" aria-hidden="true" />
      </button>
    </span>
  );
}
