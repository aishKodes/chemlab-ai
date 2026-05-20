import { cn } from "@/lib/utils";

export function Progress({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-slate-600">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div className="h-3 overflow-hidden rounded-full border border-white/70 bg-white/75 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lime-400 via-cyan-400 to-blue-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
