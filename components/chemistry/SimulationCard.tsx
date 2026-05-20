import { ArrowRight, FlaskConical, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { SimulationMeta } from "@/types";

export function SimulationCard({ simulation }: { simulation: SimulationMeta }) {
  return (
    <Card interactive className="h-full bg-gradient-to-br from-cyan-50 via-white to-lime-50">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl border-2 border-white bg-gradient-to-br from-cyan-400 to-blue-500 p-3 text-white shadow-lg">
          <FlaskConical className="h-5 w-5" aria-hidden="true" />
        </div>
        <Badge tone={simulation.difficulty === "Foundation" ? "green" : "blue"}>
          {simulation.difficulty}
        </Badge>
      </div>
      <h3 className="mt-5 text-xl font-black text-slate-950">{simulation.title}</h3>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{simulation.description}</p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime-100 px-3 py-1 text-xs font-black text-lime-800">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        +90 XP lab
      </div>
      <Link
        href={`/simulations/${simulation.slug}`}
        className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-blue-700 shadow transition hover:-translate-y-0.5 hover:bg-white"
      >
        Run lab
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Card>
  );
}
