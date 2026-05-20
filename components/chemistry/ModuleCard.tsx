import { ArrowRight, Clock, Map, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ChemistryModule } from "@/types";

export function ModuleCard({ module }: { module: ChemistryModule }) {
  return (
    <Card interactive className="flex h-full flex-col bg-gradient-to-br from-white via-sky-50 to-violet-50">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={module.difficulty === "Foundation" ? "green" : "blue"}>
          Quest
        </Badge>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-slate-600 shadow-sm">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {module.estimatedMinutes} min
        </span>
      </div>
      <div className="mt-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg">
        <Map className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-xl font-black text-slate-950">{module.title}</h3>
      <p className="mt-3 flex-1 text-sm font-medium leading-6 text-slate-600">{module.summary}</p>
      <div className="mt-5 flex items-center gap-2 text-xs font-black text-blue-700">
        <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
        {module.learningOutcomes.length} learning outcomes
      </div>
      <Link
        href={`/learn/chemistry/${module.slug}`}
        className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-500"
      >
        Enter quest
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Card>
  );
}
