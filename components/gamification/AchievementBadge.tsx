import type { ReactNode } from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function AchievementBadge({
  title,
  detail,
  icon,
  className,
}: {
  title: string;
  detail: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-3xl border-2 border-white bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 px-4 py-3 text-left shadow-lg",
        className,
      )}
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/80 text-amber-600">
        {icon ?? <Trophy className="h-6 w-6" aria-hidden="true" />}
      </span>
      <span>
        <span className="block text-sm font-black text-slate-950">{title}</span>
        <span className="block text-xs font-bold text-slate-600">{detail}</span>
      </span>
    </div>
  );
}
