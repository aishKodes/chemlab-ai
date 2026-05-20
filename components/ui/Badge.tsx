import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "cyan" | "blue" | "green" | "amber" | "rose" | "slate";

const tones: Record<BadgeTone, string> = {
  cyan: "border-cyan-300 bg-cyan-100 text-cyan-800",
  blue: "border-blue-300 bg-blue-100 text-blue-800",
  green: "border-emerald-300 bg-emerald-100 text-emerald-800",
  amber: "border-amber-300 bg-amber-100 text-amber-900",
  rose: "border-rose-300 bg-rose-100 text-rose-800",
  slate: "border-slate-300 bg-white/80 text-slate-700",
};

export function Badge({
  children,
  className,
  tone = "cyan",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
