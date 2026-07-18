import type { ElectrochemistryLevel, ElectrochemistryLevelId } from "./electrochemistryTypes";

export function ElectrochemistryQuestMap({
  levels,
  activeId,
  completed,
}: {
  levels: ElectrochemistryLevel[];
  activeId: ElectrochemistryLevelId;
  completed: ElectrochemistryLevelId[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {levels.map((level, index) => (
        <span
          key={level.id}
          className={`rounded-full px-3 py-1 text-xs font-black ${
            level.id === activeId ? "bg-blue-600 text-white" : completed.includes(level.id) ? "bg-emerald-100 text-emerald-800" : "bg-white/70 text-slate-600"
          }`}
        >
          {index + 1}. {level.title}
        </span>
      ))}
      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-slate-200">Preview: Electrolysis Mode</span>
    </div>
  );
}
