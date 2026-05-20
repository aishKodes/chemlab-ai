import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function LevelBadge({
  level,
  title,
  className,
}: {
  level: number;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-2 border-white bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 px-4 py-2 text-sm font-black text-slate-950 shadow-lg",
        className,
      )}
    >
      <Star className="h-4 w-4 fill-white text-white" aria-hidden="true" />
      <span>Level {level}</span>
      {title ? <span className="text-slate-700">· {title}</span> : null}
    </div>
  );
}
