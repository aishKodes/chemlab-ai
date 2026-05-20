"use client";

import { CheckCircle2, Scale, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MasterAlchemPointer } from "@/components/master-alchem/MasterAlchemPointer";
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
      <Card className="bg-gradient-to-br from-orange-100 via-white to-fuchsia-100">
        <Badge tone="amber">{toolMode ? "Tool v1" : "Simulation v1"}</Badge>
        <h2 className="mt-4 text-3xl font-black text-slate-950">
          {toolMode ? "Equation balance checker" : "Conservation of mass lab"}
        </h2>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
          This v1 checker validates atom counts in a typed equation. Automatic
          matrix-based balancing is a planned next step.
        </p>
        <label className="mt-6 block">
          <span className="text-sm font-black text-slate-700">Chemical equation</span>
          <input
            value={equation}
            onChange={(event) => setEquation(event.target.value)}
            placeholder="2H2 + O2 -> 2H2O"
            className="focus-ring mt-2 h-12 w-full rounded-2xl border border-orange-100 bg-white/90 px-3 font-mono text-sm font-bold text-slate-800 placeholder:text-slate-400"
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
            <div className="rounded-2xl border-2 border-white bg-gradient-to-br from-orange-400 to-rose-500 p-3 text-white shadow-lg">
              <Scale className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-500">Puzzle status</p>
              {parsed.valid ? (
                <div className="mt-2 flex items-center gap-3">
                  {parsed.balanced ? (
                    <CheckCircle2 className="h-7 w-7 text-emerald-300" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-7 w-7 text-rose-300" aria-hidden="true" />
                  )}
                    <h2 className="text-2xl font-black text-slate-950">
                    {parsed.balanced ? "Balanced equation" : "Not balanced yet"}
                  </h2>
                </div>
              ) : (
                <p className="mt-2 font-bold text-rose-700">{parsed.error}</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-black text-slate-950">Atom count chips</h3>
          <div className="mt-4 overflow-hidden rounded-3xl border border-blue-100 bg-white/70">
            <table className="w-full text-left text-sm">
              <thead className="bg-blue-50 text-slate-700">
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
                  <tr key={row.symbol} className="text-slate-700">
                    <td className="px-4 py-3 font-black text-slate-950">{row.symbol}</td>
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
                    <td colSpan={4} className="px-4 py-8 text-center font-semibold text-slate-500">
                      Enter a valid equation to inspect atom counts.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="font-black text-slate-950">Why this works</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
            Chemical reactions rearrange atoms. A balanced equation keeps the
            number of each atom identical on both sides, which is the symbolic
            expression of conservation of mass.
          </p>
        </Card>
        {parsed.valid && parsed.balanced ? (
          <Card className="bg-gradient-to-br from-lime-100 via-white to-cyan-100">
            <h3 className="text-xl font-black text-slate-950">Puzzle cleared!</h3>
            <p className="mt-2 text-sm font-medium text-slate-600">
              Conservation of mass is satisfied. Reward unlocked: +100 XP.
            </p>
          </Card>
        ) : null}
        <MasterAlchemPointer
          mood={parsed.valid && parsed.balanced ? "celebrating" : "thinking"}
          title="Master Alchem's conservation clue"
          message="You may change coefficients, but do not change subscripts. Subscripts change the substance; coefficients change how many particles react."
          href="/ai-tutor"
          cta="Ask for a balancing hint"
        />
      </div>
    </div>
  );
}
