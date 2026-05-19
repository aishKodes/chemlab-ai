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
    <Card interactive className="h-full">
      <div className="rounded-lg border border-blue-200/20 bg-blue-300/10 p-3 text-blue-100">
        <Calculator className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{tool.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{tool.description}</p>
      <Link
        href={`/tools/${tool.slug}`}
        className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-cyan-100 transition hover:text-white"
      >
        Open tool
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Card>
  );
}
