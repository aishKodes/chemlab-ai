"use client";

import { ArrowRightLeft, CircleDot, Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MasterAlchemPointer } from "@/components/master-alchem/MasterAlchemPointer";

const bondingExamples = [
  {
    formula: "NaCl",
    name: "Sodium chloride",
    type: "Ionic",
    atoms: ["Na", "Cl"],
    explanation:
      "Sodium tends to lose one valence electron and chlorine tends to gain one, producing Na+ and Cl- held by electrostatic attraction.",
    notes: ["Metal + nonmetal", "Electron transfer", "Crystal lattice", "High melting point"],
  },
  {
    formula: "H2O",
    name: "Water",
    type: "Covalent",
    atoms: ["H", "O", "H"],
    explanation:
      "Oxygen shares electron pairs with two hydrogen atoms. The bonds are polar because oxygen attracts shared electrons more strongly.",
    notes: ["Nonmetals", "Shared electron pairs", "Bent shape", "Polar molecule"],
  },
  {
    formula: "CO2",
    name: "Carbon dioxide",
    type: "Covalent",
    atoms: ["O", "C", "O"],
    explanation:
      "Carbon shares two pairs of electrons with each oxygen, forming two double bonds in a linear molecule.",
    notes: ["Double bonds", "Linear shape", "Nonmetal compound", "Molecular substance"],
  },
  {
    formula: "CH4",
    name: "Methane",
    type: "Covalent",
    atoms: ["H", "C", "H", "H", "H"],
    explanation:
      "Carbon shares four electron pairs with hydrogen atoms, giving carbon a full valence shell in a tetrahedral molecule.",
    notes: ["Four single bonds", "Tetrahedral shape", "Molecular fuel", "Low polarity"],
  },
];

export function BondingLab() {
  const [selectedFormula, setSelectedFormula] = useState("NaCl");
  const selected = bondingExamples.find((example) => example.formula === selectedFormula) ?? bondingExamples[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="bg-gradient-to-br from-emerald-100 via-white to-violet-100">
        <Badge tone="blue">Prototype</Badge>
        <h2 className="mt-4 text-3xl font-black text-slate-950">Bonding playground</h2>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
          Choose a compound to compare electron transfer, electron sharing, and
          valence-shell reasoning. Drag-and-drop bonding is reserved for a later build.
        </p>
        <div className="mt-6 grid gap-3">
          {bondingExamples.map((example) => (
            <Button
              key={example.formula}
              variant={example.formula === selectedFormula ? "primary" : "secondary"}
              onClick={() => setSelectedFormula(example.formula)}
              className="justify-start"
            >
              {example.formula} · {example.name}
            </Button>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="glass-panel-strong">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-500">{selected.name}</p>
              <h2 className="mt-1 text-5xl font-black text-slate-950">{selected.formula}</h2>
            </div>
            <Badge tone={selected.type === "Ionic" ? "amber" : "cyan"}>{selected.type} bonding</Badge>
          </div>

          <div className="mt-8 flex min-h-44 flex-wrap items-center justify-center gap-4 rounded-[2rem] border-4 border-white bg-gradient-to-br from-lime-100 via-white to-cyan-100 p-6 shadow-inner">
            {selected.atoms.map((atom, index) => (
              <div key={`${atom}-${index}`} className="flex items-center gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-[1.6rem] border-4 border-white bg-gradient-to-br from-blue-500 to-violet-500 text-2xl font-black text-white shadow-lg">
                  {atom}
                </div>
                {index < selected.atoms.length - 1 ? (
                  selected.type === "Ionic" ? (
                    <ArrowRightLeft className="h-6 w-6 text-amber-200" aria-hidden="true" />
                  ) : (
                    <CircleDot className="h-6 w-6 text-cyan-200" aria-hidden="true" />
                  )
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm font-medium leading-6 text-slate-600">{selected.explanation}</p>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {selected.notes.map((note) => (
            <Card key={note}>
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                <p className="font-black text-slate-950">{note}</p>
              </div>
            </Card>
          ))}
        </div>
        <MasterAlchemPointer
          mood="celebrating"
          title="Master Alchem's bonding lens"
          message="Ask: are electrons transferred or shared? Then connect that answer to formula, charge, structure, and properties."
          href="/ai-tutor"
          cta="Ask for bonding guidance"
        />
      </div>
    </div>
  );
}
