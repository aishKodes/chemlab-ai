"use client";

import { Sparkles, Star, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

export function GameHUD({
  title,
  badge,
  progress,
  xp,
  stars,
}: {
  title: string;
  badge: string;
  progress: number;
  xp: number;
  stars: number;
}) {
  return (
    <Card className="border-white/80 bg-white/86 p-4 shadow-xl backdrop-blur">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue">{badge}</Badge>
            <Badge tone="green">Lab flow</Badge>
          </div>
          <h2 className="mt-3 text-2xl font-black text-slate-950">{title}</h2>
          <div className="mt-3">
            <Progress value={progress} label="Scene progress" />
          </div>
        </div>
        <HudNumber icon={<Sparkles className="h-5 w-5" aria-hidden="true" />} label="XP" value={`+${xp}`} />
        <HudNumber icon={<Star className="h-5 w-5" aria-hidden="true" />} label="Stars" value={`${stars}/3`} />
      </div>
    </Card>
  );
}

function HudNumber({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white bg-white/75 px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
        <span className="text-amber-600">{icon}</span>
        {label}
      </div>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

export function RewardBadge({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-[1.4rem] border-2 border-white bg-gradient-to-br from-yellow-200 via-amber-100 to-cyan-100 px-4 py-3 shadow-xl">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-amber-600">
        <Trophy className="h-6 w-6" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm font-black text-slate-950">{title}</span>
        <span className="block text-xs font-bold text-slate-600">{detail}</span>
      </span>
    </div>
  );
}
