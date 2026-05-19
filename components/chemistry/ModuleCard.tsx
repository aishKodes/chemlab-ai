import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ChemistryModule } from "@/types";

export function ModuleCard({ module }: { module: ChemistryModule }) {
  return (
    <Card interactive className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={module.difficulty === "Foundation" ? "green" : "blue"}>
          {module.difficulty}
        </Badge>
        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {module.estimatedMinutes} min
        </span>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{module.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{module.summary}</p>
      <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
        <GraduationCap className="h-4 w-4 text-cyan-200" aria-hidden="true" />
        {module.learningOutcomes.length} learning outcomes
      </div>
      <Link
        href={`/learn/chemistry/${module.slug}`}
        className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-cyan-100 transition hover:text-white"
      >
        Open module
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Card>
  );
}
