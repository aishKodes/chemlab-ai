import { redoxAssetManifest } from "./redoxAssetManifest";
import type { RedoxLevel } from "./redoxTypes";

export function RedoxHintPanel({ level, feedback }: { level: RedoxLevel; feedback?: string }) {
  return (
    <aside className="rounded-[1.5rem] border border-amber-200/25 bg-amber-50/90 p-4 text-slate-900 shadow-xl shadow-amber-950/10">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200 to-orange-200">
          <img src={redoxAssetManifest.paati_explaining_character.src} alt="Jaya Paati" className="h-full w-full object-contain object-top" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">Jaya Paati says</p>
          <p className="text-sm font-black">Follow the transfer</p>
        </div>
      </div>
      <p className="text-sm font-bold leading-relaxed text-slate-800">{feedback ?? level.paatiHint}</p>
      <p className="mt-4 rounded-2xl border border-orange-200 bg-white/70 p-3 text-xs font-black uppercase tracking-[0.16em] text-orange-700">
        Use the Why button for the deeper explanation.
      </p>
    </aside>
  );
}
