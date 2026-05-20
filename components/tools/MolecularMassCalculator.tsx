"use client";

import { Beaker } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { calculateMolecularMass } from "@/lib/chemistry/molar-mass";

const formulas = ["H2O", "CO2", "NaCl", "CaCO3", "C6H12O6", "MgCl2"];

export function MolecularMassCalculator() {
  const [formula, setFormula] = useState("H2O");
  const result = useMemo(() => calculateMolecularMass(formula), [formula]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="bg-gradient-to-br from-sky-100 via-white to-amber-100">
        <div className="rounded-2xl border-2 border-white bg-gradient-to-br from-blue-500 to-cyan-400 p-3 text-white shadow-lg">
          <Beaker className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-3xl font-black text-slate-950">Molecular mass calculator</h2>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
          Enter a formula using standard element symbols. Parentheses are supported
          for school-level compounds such as Ca(OH)2.
        </p>
        <label className="mt-6 block">
          <span className="text-sm font-black text-slate-700">Chemical formula</span>
          <input
            value={formula}
            onChange={(event) => setFormula(event.target.value)}
            className="focus-ring mt-2 h-12 w-full rounded-2xl border border-blue-100 bg-white/90 px-3 font-mono font-bold text-slate-800"
            placeholder="C6H12O6"
          />
        </label>
        <div className="mt-5 flex flex-wrap gap-2">
          {formulas.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={formula === item ? "primary" : "secondary"}
              onClick={() => setFormula(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="glass-panel-strong">
        {result.valid ? (
          <>
            <Badge tone="green">Valid formula</Badge>
            <h3 className="mt-4 text-4xl font-black text-slate-950">
              {result.totalMass.toFixed(3)} g/mol
            </h3>
            <div className="mt-6 overflow-hidden rounded-3xl border border-blue-100 bg-white/75">
              <table className="w-full text-left text-sm">
                <thead className="bg-blue-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Element</th>
                    <th className="px-4 py-3">Count</th>
                    <th className="px-4 py-3">Atomic mass</th>
                    <th className="px-4 py-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100 text-slate-700">
                  {result.breakdown.map((item) => (
                    <tr key={item.symbol}>
                      <td className="px-4 py-3">
                        <span className="font-black text-slate-950">{item.symbol}</span>
                        <span className="ml-2 font-medium text-slate-500">{item.name}</span>
                      </td>
                      <td className="px-4 py-3">{item.count}</td>
                      <td className="px-4 py-3">{item.atomicMass}</td>
                      <td className="px-4 py-3">{item.subtotal.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div>
            <Badge tone="rose">Check formula</Badge>
            <h3 className="mt-4 text-2xl font-black text-slate-950">Formula not parsed</h3>
            <p className="mt-3 text-sm font-bold leading-6 text-rose-700">{result.error}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
