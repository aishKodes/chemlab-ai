"use client";

import { Timer, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { BackendQuickDrill } from "@/lib/api/backendTypes";

export function QuickDrillGrid({ drills }: { drills: BackendQuickDrill[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {drills.map((drill) => (
        <Card key={drill.slug} interactive className="bg-gradient-to-br from-white via-lime-50 to-cyan-50">
          <div className="flex items-center justify-between gap-3">
            <Badge tone="green">{drill.difficulty ?? "beginner"}</Badge>
            <span className="inline-flex items-center gap-1 text-xs font-black text-slate-500">
              <Timer className="h-4 w-4" aria-hidden="true" />
              {drill.estimated_minutes ?? 5} min
            </span>
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-950">{drill.title}</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{drill.description}</p>
          <Button href={`/quick-drills/${drill.slug}`} className="mt-5" icon={<Trophy className="h-4 w-4" aria-hidden="true" />}>
            Start drill
          </Button>
        </Card>
      ))}
    </div>
  );
}
