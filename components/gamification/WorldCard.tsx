import type { ReactNode } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

export function WorldCard({
  title,
  description,
  progress,
  missions,
  xp,
  status,
  href,
  icon,
  gradient,
  locked,
}: {
  title: string;
  description: string;
  progress: number;
  missions?: number;
  xp: number;
  status?: string;
  href: string;
  icon: ReactNode;
  gradient: string;
  locked?: boolean;
}) {
  return (
    <Link
      href={locked ? "#" : href}
      aria-disabled={locked}
      className={cn(
        "focus-ring group relative block min-h-72 overflow-hidden rounded-[2rem] border-4 border-white p-5 shadow-xl transition duration-200 hover:-translate-y-2 hover:rotate-[0.4deg]",
        gradient,
        locked && "pointer-events-none grayscale",
      )}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/30" />
      <div className="absolute -bottom-12 left-6 h-28 w-28 rounded-full bg-white/20" />
      <div className="relative flex items-start justify-between gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-[1.4rem] bg-white/75 text-slate-900 shadow-lg transition group-hover:scale-110">
          {icon}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-slate-700 shadow">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
          {xp} XP
        </span>
      </div>
      <div className="relative mt-8">
        <h3 className="text-2xl font-black text-slate-950">{title}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{description}</p>
      </div>
      <div className="relative mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-black text-slate-700 shadow-sm">
          {missions ?? 5} missions
        </span>
        <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-black text-slate-700 shadow-sm">
          {locked ? "Locked" : status ?? "Unlocked"}
        </span>
      </div>
      <div className="relative mt-6">
        <Progress value={progress} label={locked ? "Locked" : "Quest progress"} />
      </div>
      <div className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-blue-700 shadow">
        {locked ? "Unlock soon" : "Enter quest"}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </Link>
  );
}
