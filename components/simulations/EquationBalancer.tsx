"use client";

import { CheckCircle2, Scale, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  equationExamples,
  getEquationRows,
  parseChemicalEquation,
} from "@/lib/chemistry/equations";

export function EquationBalancer({ toolMode = false }: { toolMode?: boolean }) {
  const [equation, setEquation] = useState(equationExamples[0]);
  const parsed = useMemo(() => parseChemicalEquation(equation), [equation]);
  const rows = useMemo(() => getEquationRows(parsed), [parsed]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <Badge tone="amber">{toolMode ? "Tool v1" : "Simulation v1"}</Badge>
        <h2 className="mt-4 text-2xl font-semibold text-white">
          {toolMode ? "Equation balance checker" : "Conservation of mass lab"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          This v1 checker validates atom counts in a typed equation. Automatic
          matrix-based balancing is a planned next step.
        </p>
        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-200">Chemical equation</span>
          <input
            value={equation}
            onChange={(event) => setEquation(event.target.value)}
            placeholder="2H2 + O2 -> 2H2O"
            className="focus-ring mt-2 h-12 w-full rounded-lg border border-white/12 bg-slate-950/70 px-3 font-mono text-sm text-white placeholder:text-slate-500"
          />
        </label>
        <div className="mt-5 flex flex-wrap gap-2">
          {equationExamples.map((example) => (
            <Button
              key={example}
              variant={example === equation ? "primary" : "secondary"}
              size="sm"
              onClick={() => setEquation(example)}
            >
              {example}
            </Button>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="glass-panel-strong">
          <div className="flex items-start gap-4">
            <div className="rounded-lg border border-cyan-200/20 bg-cyan-300/10 p-3 text-cyan-100">
              <Scale className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Balance status</p>
              {parsed.valid ? (
                <div className="mt-2 flex items-center gap-3">
                  {parsed.balanced ? (
                    <CheckCircle2 className="h-7 w-7 text-emerald-300" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-7 w-7 text-rose-300" aria-hidden="true" />
                  )}
                  <h2 className="text-2xl font-semibold text-white">
                    {parsed.balanced ? "Balanced equation" : "Not balanced yet"}
                  </h2>
                </div>
              ) : (
                <p className="mt-2 text-rose-200">{parsed.error}</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white">Atom count table</h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.06] text-slate-300">
                <tr>
                  <th className="px-4 py-3">Element</th>
                  <th className="px-4 py-3">Reactants</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <tr key={row.symbol} className="text-slate-200">
                      <td className="px-4 py-3 font-semibold">{row.symbol}</td>
                      <td className="px-4 py-3">{row.left}</td>
                      <td className="px-4 py-3">{row.right}</td>
                      <td className="px-4 py-3">
                        <Badge tone={row.balanced ? "green" : "rose"}>
                          {row.balanced ? "match" : "mismatch"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      Enter a valid equation to inspect atom counts.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-white">Why this works</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Chemical reactions rearrange atoms. A balanced equation keeps the
            number of each atom identical on both sides, which is the symbolic
            expression of conservation of mass.
          </p>
        </Card>
      </div>
    </div>
  );
}
