"use client";

import { useState } from "react";
import { buildMolecule3D } from "@/components/labs/hydrocarbon-quest/3d/MoleculeGeometryBuilder";
import { Molecule3DStage } from "@/components/labs/hydrocarbon-quest/3d/Molecule3DStage";
import { calculateFormulaCounts, formatChemicalFormula, formulaCountsToString, parseFormulaCounts } from "@/components/labs/hydrocarbon-quest/3d/labelUtils";
import { calculateAngleDegrees, getAtomById } from "@/components/labs/hydrocarbon-quest/3d/molecule3DUtils";
import { hydrocarbonQuestLevels } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestData";
import type { HydrocarbonLevel } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const debugTargets = ["Methane", "Ethane", "Butane", "2-Methylpentane", "But-1-ene", "Ethyne"];

export function Molecule3DDebug() {
  const levels = debugTargets.map((target) => hydrocarbonQuestLevels.find((level) => level.targetName === target)).filter(Boolean) as HydrocarbonLevel[];
  const [activeId, setActiveId] = useState(levels[0]?.id);
  const activeLevel = levels.find((level) => level.id === activeId) ?? levels[0] ?? hydrocarbonQuestLevels[0]!;
  const built = buildMolecule3D(activeLevel);
  const calculatedFormula = formulaCountsToString(calculateFormulaCounts(built));
  const expectedFormula = formulaCountsToString(parseFormulaCounts(activeLevel.formula));
  const valenceRows = built.atoms
    .filter((atom) => atom.element === "C")
    .map((atom) => {
      const attachedBonds = built.bonds.filter((bond) => bond.from === atom.id || bond.to === atom.id);
      return {
        atom,
        valence: attachedBonds.reduce((sum, bond) => sum + bond.order, 0),
        hydrogens: attachedBonds.filter((bond) => bond.from.includes("_h") || bond.to.includes("_h")).length,
      };
    });
  const angle = getFirstAngle(activeLevel);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <Badge tone="blue">Development only</Badge>
        <h1 className="mt-3 text-4xl font-black">Molecule 3D Debug</h1>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-cyan-50/82">
          Inspect generated 3D geometry, hydrogens, valence, bond order, and measurement readiness for the Hydrocarbon Naming Quest.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {levels.map((level) => (
            <Button
              key={level.id}
              size="sm"
              variant={level.id === activeLevel.id ? "primary" : "secondary"}
              onClick={() => setActiveId(level.id)}
            >
              {level.targetName}
            </Button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
          <Molecule3DStage
            level={activeLevel}
            selectedAtoms={activeLevel.correctChainSequence.slice(0, Math.min(2, activeLevel.correctChainSequence.length))}
            wrongAtoms={[]}
            glowing
          />

          <aside className="space-y-4 rounded-[1.6rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
            <section>
              <h2 className="text-xl font-black">{activeLevel.targetName}</h2>
              <p className="mt-1 text-sm font-bold text-cyan-50/78">{formatChemicalFormula(activeLevel.formula)} · {activeLevel.learningGoal}</p>
            </section>

            <section className="rounded-2xl bg-white/90 p-3 text-slate-950">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-cyan-700">Label controls to verify</h3>
              <div className="mt-3 grid gap-2 text-xs font-bold text-slate-700">
                <p className="rounded-xl bg-cyan-50 p-2">Use Clean, Learning, and Measurement View inside the 3D stage.</p>
                <p className="rounded-xl bg-blue-50 p-2">Learning View: C/H atom labels and locants stay separate from atoms.</p>
                <p className="rounded-xl bg-amber-50 p-2">Measurement View: bond length and angle labels appear only when requested.</p>
              </div>
            </section>

            <section className="rounded-2xl bg-slate-950/55 p-3">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-cyan-200">Geometry warnings</h3>
              {built.warnings.length ? (
                <ul className="mt-3 space-y-2 text-xs font-bold text-amber-100">
                  {built.warnings.map((warning, index) => (
                    <li key={`${warning.code}-${index}`} className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-2">
                      {warning.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-2 text-xs font-bold text-emerald-100">
                  No validation warnings.
                </p>
              )}
            </section>

            <section className="rounded-2xl bg-white/90 p-3 text-slate-950">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Formula calculation</h3>
              <div className="mt-3 grid gap-2 text-xs font-black">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span>Expected</span>
                  <span>{formatChemicalFormula(expectedFormula)}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span>Generated</span>
                  <span>{formatChemicalFormula(calculatedFormula)}</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white/90 p-3 text-slate-950">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">Hydrogen valence check</h3>
              <div className="mt-3 grid gap-2">
                {valenceRows.map(({ atom, valence, hydrogens }) => (
                  <div key={atom.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs font-black">
                    <span>{atom.id} · {atom.hybridization}</span>
                    <span>{hydrogens} H · valence {valence}/4</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white/90 p-3 text-slate-950">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-violet-700">Atom and bond data</h3>
              <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-slate-950 p-3 text-[11px] leading-5 text-cyan-50">
                {JSON.stringify(
                  {
                    atoms: built.atoms.map((atom) => ({ id: atom.id, element: atom.element, role: atom.role, hybridization: atom.hybridization, position: atom.position.map((value) => Number(value.toFixed(2))) })),
                    bonds: built.bonds,
                    firstAngleDegrees: angle ? Number(angle.toFixed(1)) : undefined,
                  },
                  null,
                  2,
                )}
              </pre>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function getFirstAngle(level: HydrocarbonLevel) {
  const built = buildMolecule3D(level);
  const center = built.atoms.find((atom) => atom.element === "C");
  if (!center) return undefined;
  const neighbors = built.bonds
    .filter((bond) => bond.from === center.id || bond.to === center.id)
    .map((bond) => getAtomById(built.atoms, bond.from === center.id ? bond.to : bond.from))
    .filter(Boolean);
  if (neighbors.length < 2) return undefined;
  return calculateAngleDegrees(neighbors[0]!.position, center.position, neighbors[1]!.position);
}
