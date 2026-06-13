import type { RedoxSpeaker } from "./redoxTypes";

const speakerTone: Record<RedoxSpeaker, string> = {
  Karthik: "from-sky-500/90 to-cyan-500/80",
  "Jaya Paati": "from-amber-400/90 to-orange-500/85",
  Chemlab: "from-violet-500/90 to-cyan-500/85",
};

export function RedoxDialogueBox({
  speaker,
  text,
  compact = false,
}: {
  speaker: RedoxSpeaker;
  text: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/18 bg-slate-950/62 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2">
        <span className={`rounded-full bg-gradient-to-r ${speakerTone[speaker]} px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg`}>
          {speaker}
        </span>
        <span className="h-px flex-1 bg-white/18" />
      </div>
      <p className={compact ? "text-sm font-semibold leading-relaxed text-white" : "text-base font-semibold leading-relaxed text-white md:text-lg"}>{text}</p>
    </div>
  );
}
