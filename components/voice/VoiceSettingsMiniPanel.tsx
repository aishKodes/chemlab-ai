"use client";

import { useEffect, useState } from "react";
import { getBrowserVoices, loadBrowserVoiceSettings, saveBrowserVoiceSettings, speakWithBrowser, type BrowserVoiceSettings, type ScoredVoice } from "@/lib/voice/browserSpeech";

export function VoiceSettingsMiniPanel({
  settings,
  onChange,
}: {
  settings: BrowserVoiceSettings;
  onChange: (settings: BrowserVoiceSettings) => void;
}) {
  const [voices, setVoices] = useState<ScoredVoice[]>([]);

  useEffect(() => {
    const refresh = () => setVoices(getBrowserVoices());
    refresh();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = refresh;
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  function update(next: BrowserVoiceSettings) {
    saveBrowserVoiceSettings(next);
    onChange(next);
  }

  const best = voices[0];

  return (
    <div className="mt-4 rounded-2xl border border-blue-100 bg-white/75 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-800">Voice settings</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            Manual browser voice only. Pick the most natural voice available on this device.
          </p>
        </div>
        {best ? <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">{best.qualityLabel}</span> : null}
      </div>

      <label className="mt-3 block">
        <span className="text-xs font-black text-slate-600">Voice</span>
        <select
          value={settings.voiceURI ?? ""}
          onChange={(event) => update({ ...settings, voiceURI: event.target.value || undefined })}
          className="focus-ring mt-1 h-10 w-full rounded-xl border border-blue-100 bg-white px-2 text-xs font-bold text-slate-700"
        >
          <option value="">Best available</option>
          {voices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name} - {voice.lang} ({voice.qualityLabel})
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3 grid gap-2">
        <label className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-2 text-xs font-bold text-slate-600">
          Rate
          <input type="range" min="0.85" max="1" step="0.05" value={settings.rate} onChange={(event) => update({ ...settings, rate: Number(event.target.value) })} />
          <span>{settings.rate.toFixed(2)}</span>
        </label>
        <label className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-2 text-xs font-bold text-slate-600">
          Pitch
          <input type="range" min="0.95" max="1.05" step="0.01" value={settings.pitch} onChange={(event) => update({ ...settings, pitch: Number(event.target.value) })} />
          <span>{settings.pitch.toFixed(2)}</span>
        </label>
        <label className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-2 text-xs font-bold text-slate-600">
          Volume
          <input type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={(event) => update({ ...settings, volume: Number(event.target.value) })} />
          <span>{Math.round(settings.volume * 100)}%</span>
        </label>
      </div>

      {voices.length === 0 || !voices.some((voice) => voice.qualityScore >= 2) ? (
        <p className="mt-3 rounded-xl bg-amber-50 p-2 text-xs font-semibold leading-5 text-amber-800">
          Your browser has only basic voices. For a better demo, open in Chrome or Edge and choose a Google or Microsoft natural voice if available.
        </p>
      ) : null}

      <button
        type="button"
        className="mt-3 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700 hover:bg-white"
        onClick={() => {
          speakWithBrowser("Hello, I am Chem-Shastri. Let us make chemistry easier.", settings);
        }}
      >
        Preview voice
      </button>
    </div>
  );
}

export function useVoiceSettings() {
  const [settings, setSettings] = useState<BrowserVoiceSettings>(() => loadBrowserVoiceSettings());
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSettings(loadBrowserVoiceSettings());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  function update(next: BrowserVoiceSettings) {
    saveBrowserVoiceSettings(next);
    setSettings(next);
  }
  return [settings, update] as const;
}
