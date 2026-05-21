"use client";

import type { MoleculeModel } from "@/components/simulations/molecule-explorer/moleculeData";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function MoleculeInfoPanel({ molecule }: { molecule: MoleculeModel }) {
  return (
    <Card className="bg-gradient-to-br from-white via-lime-50 to-cyan-50">
      <Badge tone="green">{molecule.formula}</Badge>
      <h3 className="mt-4 text-2xl font-black text-slate-950">{molecule.geometry}</h3>
      <p className="mt-2 text-sm font-black text-blue-700">Bond angle: {molecule.bondAngle}</p>
      <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{molecule.whatToNotice}</p>
    </Card>
  );
}
