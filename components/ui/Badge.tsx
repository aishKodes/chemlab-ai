import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "cyan" | "blue" | "green" | "amber" | "rose" | "slate";

const tones: Record<BadgeTone, string> = {
  cyan: "border-cyan-200/25 bg-cyan-300/10 text-cyan-100",
  blue: "border-blue-200/25 bg-blue-300/10 text-blue-100",
  green: "border-emerald-200/25 bg-emerald-300/10 text-emerald-100",
  amber: "border-amber-200/25 bg-amber-300/10 text-amber-100",
  rose: "border-rose-200/25 bg-rose-300/10 text-rose-100",
  slate: "border-slate-200/15 bg-slate-200/8 text-slate-200",
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
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
