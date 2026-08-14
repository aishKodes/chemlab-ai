"use client";

import { GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { BackendConceptMap } from "@/lib/api/backendTypes";

type ConceptMapData = {
  nodes?: Array<string | { id?: string; label?: string; title?: string }>;
  edges?: Array<{ from?: string; to?: string; label?: string }>;
};

export function ConceptMapViewer({ conceptMap }: { conceptMap: BackendConceptMap }) {
  const data = parseMap(conceptMap.map_json);
  const nodes = (data.nodes ?? []).map((node) => (typeof node === "string" ? { id: node, label: node } : { id: node.id ?? node.label ?? node.title ?? "concept", label: node.label ?? node.title ?? node.id ?? "Concept" }));
  const edges = data.edges ?? [];

  return (
    <Card className="bg-gradient-to-br from-white via-violet-50 to-cyan-50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone="blue" className="border-violet-300 bg-violet-100 text-violet-800">Concept map</Badge>
          <h2 className="mt-3 text-3xl font-black text-slate-950">{conceptMap.title}</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">{conceptMap.description}</p>
        </div>
        <GitBranch className="h-10 w-10 text-violet-700" aria-hidden="true" />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          <h3 className="text-lg font-black text-slate-950">Concept nodes</h3>
          {nodes.map((node, index) => (
            <div key={`${node.id}-${index}`} className="rounded-2xl border border-white bg-white/80 p-4 font-black text-slate-800 shadow-sm">
              {node.label}
            </div>
          ))}
        </div>
        <div className="min-h-80 rounded-[1.5rem] border border-white bg-slate-950 p-5 text-white shadow-inner">
          <h3 className="text-lg font-black">Connections</h3>
          <div className="mt-5 space-y-4">
            {edges.length ? (
              edges.map((edge, index) => (
                <div key={`${edge.from}-${edge.to}-${index}`} className="rounded-2xl border border-cyan-300/25 bg-white/10 p-4">
                  <p className="text-sm font-black text-cyan-100">
                    {edge.from} <span className="text-amber-300">→</span> {edge.to}
                  </p>
                  {edge.label ? <p className="mt-1 text-xs font-bold text-white/70">{edge.label}</p> : null}
                </div>
              ))
            ) : (
              <p className="text-sm font-bold text-white/70">Admin can add map connections from the chemlearning backend.</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function parseMap(value: BackendConceptMap["map_json"]): ConceptMapData {
  if (!value) return {};
  if (typeof value === "object") return value as ConceptMapData;
  try {
    return JSON.parse(value) as ConceptMapData;
  } catch {
    return {};
  }
}
