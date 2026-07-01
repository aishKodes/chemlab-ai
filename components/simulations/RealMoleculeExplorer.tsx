"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Rotate3D, Sparkles, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MasterAlchemBubble } from "@/components/master-alchem/MasterAlchemBubble";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Molecule = {
  key: string;
  name: string;
  formula: string;
  geometry: string;
  bondAngle: string;
  explanation: string;
  xyz: string;
};

type ThreeDmolViewer = {
  clear: () => void;
  addModel: (data: string, format: string) => unknown;
  setStyle: (selection: Record<string, unknown>, style: Record<string, unknown>) => void;
  zoomTo: () => void;
  render: () => void;
  spin: (axis: string | false, speed?: number) => void;
};

type ThreeDmolApi = {
  createViewer: (element: HTMLElement, options?: Record<string, unknown>) => ThreeDmolViewer;
};

const molecules: Molecule[] = [
  {
    key: "water",
    name: "Water",
    formula: "H₂O",
    geometry: "Bent",
    bondAngle: "104.5°",
    explanation:
      "Water bends because oxygen has two bonding pairs and two lone pairs. Lone pairs push harder, so the molecule is not straight.",
    xyz: `3
water
O 0.000 0.000 0.000
H 0.758 0.584 0.000
H -0.758 0.584 0.000`,
  },
  {
    key: "methane",
    name: "Methane",
    formula: "CH₄",
    geometry: "Tetrahedral",
    bondAngle: "109.5°",
    explanation:
      "Methane spreads four C-H bonds evenly in 3D space. That tetrahedral shape keeps electron pairs as far apart as possible.",
    xyz: `5
methane
C 0.000 0.000 0.000
H 0.629 0.629 0.629
H -0.629 -0.629 0.629
H -0.629 0.629 -0.629
H 0.629 -0.629 -0.629`,
  },
  {
    key: "carbon-dioxide",
    name: "Carbon dioxide",
    formula: "CO₂",
    geometry: "Linear",
    bondAngle: "180°",
    explanation:
      "Carbon dioxide is linear because carbon has two electron regions. They point opposite ways, making a straight molecule.",
    xyz: `3
carbon dioxide
O -1.160 0.000 0.000
C 0.000 0.000 0.000
O 1.160 0.000 0.000`,
  },
  {
    key: "ammonia",
    name: "Ammonia",
    formula: "NH₃",
    geometry: "Trigonal pyramidal",
    bondAngle: "107°",
    explanation:
      "Ammonia has three N-H bonds and one lone pair. The lone pair pushes the bonds downward into a pyramid shape.",
    xyz: `4
ammonia
N 0.000 0.000 0.110
H 0.000 0.939 -0.274
H 0.813 -0.469 -0.274
H -0.813 -0.469 -0.274`,
  },
  {
    key: "sodium-chloride",
    name: "Sodium chloride",
    formula: "NaCl",
    geometry: "Ionic crystal model",
    bondAngle: "Repeating lattice",
    explanation:
      "Sodium chloride is not a single covalent molecule. It forms a repeating crystal of Na+ and Cl- ions packed in a regular pattern.",
    xyz: `8
sodium chloride crystal fragment
Na -1.2 -1.2 -1.2
Cl 0.0 -1.2 -1.2
Cl -1.2 0.0 -1.2
Na 0.0 0.0 -1.2
Cl -1.2 -1.2 0.0
Na 0.0 -1.2 0.0
Na -1.2 0.0 0.0
Cl 0.0 0.0 0.0`,
  },
];

export function RealMoleculeExplorer() {
  const [selectedKey, setSelectedKey] = useState("water");
  const [loadError, setLoadError] = useState("");
  const [spinning, setSpinning] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<ThreeDmolViewer | null>(null);
  const selected = molecules.find((molecule) => molecule.key === selectedKey) ?? molecules[0];

  useEffect(() => {
    let cancelled = false;

    async function renderMolecule() {
      if (!containerRef.current) return;
      try {
        const threeDmolModule = await import("3dmol");
        if (cancelled) return;
        const moduleWithDefault = threeDmolModule as unknown as { default?: ThreeDmolApi };
        const viewerApi = moduleWithDefault.default ?? (threeDmolModule as unknown as ThreeDmolApi);
        if (!viewerRef.current) {
          viewerRef.current = viewerApi.createViewer(containerRef.current, {
            backgroundColor: "white",
            antialias: true,
          });
        }
        const viewer = viewerRef.current;
        viewer.clear();
        viewer.addModel(selected.xyz, "xyz");
        viewer.setStyle(
          {},
          {
            stick: { radius: selected.key === "sodium-chloride" ? 0.08 : 0.16 },
            sphere: { scale: selected.key === "sodium-chloride" ? 0.42 : 0.28 },
          },
        );
        viewer.zoomTo();
        viewer.render();
        viewer.spin(spinning ? "y" : false, spinning ? 0.5 : undefined);
        setLoadError("");
      } catch {
        setLoadError("The 3D viewer could not load in this browser. The molecule notes are still available.");
      }
    }

    void renderMolecule();
    return () => {
      cancelled = true;
    };
  }, [selected, spinning]);

  return (
    <div className="space-y-6">
      <MasterAlchemBubble
        mood="guide"
        eyebrow="Molecule Explorer"
        message="Rotate the model, compare the shapes, and ask yourself: what are the electron pairs trying to do?"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.82fr]">
        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50 to-violet-100 p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.18),transparent_28%)]" />
          <div className="relative p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Badge tone="blue">Real 3D molecule viewer</Badge>
                <h2 className="mt-3 text-3xl font-black text-slate-950">{selected.name}</h2>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<Rotate3D className="h-4 w-4" aria-hidden="true" />}
                onClick={() => setSpinning((value) => !value)}
              >
                {spinning ? "Pause rotation" : "Rotate"}
              </Button>
            </div>

            <div className="mt-5 overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-2xl">
              <div ref={containerRef} className="h-[28rem] w-full" aria-label={`${selected.name} 3D model`} />
            </div>
            {loadError ? (
              <p className="mt-3 rounded-2xl bg-amber-100 px-4 py-3 text-sm font-bold text-amber-900">
                {loadError}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-black text-slate-600">
              <ZoomIn className="h-4 w-4 text-blue-600" aria-hidden="true" />
              Drag to rotate. Scroll or pinch to zoom.
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white via-lime-50 to-cyan-50">
            <Badge tone="green">{selected.formula}</Badge>
            <h3 className="mt-4 text-2xl font-black text-slate-950">{selected.geometry}</h3>
            <p className="mt-2 text-sm font-black text-blue-700">Bond angle: {selected.bondAngle}</p>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{selected.explanation}</p>
          </Card>

          <Card className="bg-white/85">
            <h3 className="text-xl font-black text-slate-950">Choose a molecule</h3>
            <div className="mt-4 grid gap-3">
              {molecules.map((molecule) => (
                <button
                  key={molecule.key}
                  type="button"
                  className={cn(
                    "focus-ring rounded-2xl border-2 bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-blue-200",
                    selected.key === molecule.key ? "border-blue-500 shadow-lg shadow-blue-100" : "border-slate-100",
                  )}
                  onClick={() => setSelectedKey(molecule.key)}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>
                      <span className="block text-sm font-black text-slate-950">{molecule.name}</span>
                      <span className="block text-xs font-bold text-slate-500">{molecule.geometry}</span>
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                      {molecule.formula}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <AnimatePresence mode="wait">
            <motion.div
              key={selected.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-[1.6rem] border-2 border-white bg-gradient-to-br from-violet-100 via-white to-amber-100 p-5 shadow-xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-violet-700">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                Chem-Shastri says
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
                First notice the shape, then ask why the electron pairs settle there. Shape is the clue that connects bonding to behaviour.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
