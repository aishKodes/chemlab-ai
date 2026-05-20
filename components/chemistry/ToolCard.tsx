import { ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export type ToolMeta = {
  slug: string;
  title: string;
  description: string;
};

export const tools: ToolMeta[] = [
  {
    slug: "molecular-mass-calculator",
    title: "Molecular Mass Calculator",
    description: "Parse formulas like H2O, CO2, CaCO3, and C6H12O6 with element-by-element mass breakdowns.",
  },
  {
    slug: "mole-calculator",
    title: "Mole Calculator",
    description: "Convert between grams, moles, and particles using molar mass and Avogadro's number.",
  },
  {
    slug: "equation-balancer",
    title: "Equation Balance Checker",
    description: "Count atoms on each side of a reaction and verify whether it satisfies conservation of mass.",
  },
];

export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Card interactive className="h-full bg-gradient-to-br from-white via-amber-50 to-pink-50">
      <div className="rounded-2xl border-2 border-white bg-gradient-to-br from-amber-300 to-orange-400 p-3 text-white shadow-lg">
        <Calculator className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-xl font-black text-slate-950">{tool.title}</h3>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{tool.description}</p>
      <Link
        href={`/tools/${tool.slug}`}
        className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-orange-700 shadow transition hover:-translate-y-0.5 hover:bg-white"
      >
        Open tool
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Card>
  );
}
