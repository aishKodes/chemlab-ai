import { ArrowRight, FlaskConical } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { SimulationMeta } from "@/types";

export function SimulationCard({ simulation }: { simulation: SimulationMeta }) {
  return (
    <Card interactive className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-lg border border-cyan-200/20 bg-cyan-300/10 p-3 text-cyan-100">
          <FlaskConical className="h-5 w-5" aria-hidden="true" />
        </div>
        <Badge tone={simulation.difficulty === "Foundation" ? "green" : "blue"}>
          {simulation.difficulty}
        </Badge>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{simulation.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{simulation.description}</p>
      <Link
        href={`/simulations/${simulation.slug}`}
        className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-cyan-100 transition hover:text-white"
      >
        Run simulation
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Card>
  );
}
