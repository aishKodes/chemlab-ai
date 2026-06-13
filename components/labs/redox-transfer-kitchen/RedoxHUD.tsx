import type { RedoxLevel } from "./redoxTypes";

export function RedoxHUD({
  level,
  levelIndex,
  totalLevels,
  xp,
}: {
  level: RedoxLevel;
  levelIndex: number;
  totalLevels: number;
  xp: number;
}) {
  const progress = Math.round(((levelIndex + 1) / totalLevels) * 100);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/12 bg-slate-950/62 px-4 py-3 text-white shadow-xl backdrop-blur-xl">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Electron Exchange Table</p>
        <h1 className="text-lg font-black md:text-2xl">{level.title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden min-w-[160px] md:block">
          <div className="h-2 overflow-hidden rounded-full bg-white/12">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-lime-300 to-cyan-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-right text-xs font-bold text-cyan-100">
            Level {levelIndex + 1}/{totalLevels}
          </p>
        </div>
        <div className="rounded-2xl bg-amber-300 px-4 py-2 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/25">{xp} XP</div>
      </div>
    </header>
  );
}
