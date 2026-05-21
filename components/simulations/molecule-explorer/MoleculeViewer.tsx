"use client";

import { Rotate3D, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MoleculeModel } from "@/components/simulations/molecule-explorer/moleculeData";
import { Button } from "@/components/ui/Button";

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

export function MoleculeViewer({ molecule }: { molecule: MoleculeModel }) {
  const [loadError, setLoadError] = useState("");
  const [spinning, setSpinning] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<ThreeDmolViewer | null>(null);

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
        viewer.addModel(molecule.xyz, "xyz");
        viewer.setStyle(
          {},
          {
            stick: { radius: molecule.viewerStyle === "lattice" ? 0.06 : 0.16 },
            sphere: { scale: molecule.viewerStyle === "lattice" ? 0.38 : 0.28 },
          },
        );
        viewer.zoomTo();
        viewer.render();
        viewer.spin(spinning ? "y" : false, spinning ? 0.55 : undefined);
        setLoadError("");
      } catch {
        setLoadError("The 3D model could not load in this browser. The molecule notes are still available.");
      }
    }

    void renderMolecule();
    return () => {
      cancelled = true;
      viewerRef.current?.spin(false);
    };
  }, [molecule, spinning]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-slate-950">{molecule.name}</h2>
          <p className="mt-1 text-sm font-black text-blue-700">{molecule.formula}</p>
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
        <div ref={containerRef} className="h-[min(58svh,31rem)] min-h-[22rem] w-full" aria-label={`${molecule.name} 3D model`} />
      </div>
      {loadError ? (
        <p className="mt-3 rounded-2xl bg-amber-100 px-4 py-3 text-sm font-bold text-amber-900">{loadError}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-black text-slate-600">
        <ZoomIn className="h-4 w-4 text-blue-600" aria-hidden="true" />
        Drag to rotate. Scroll or pinch to zoom.
      </div>
    </div>
  );
}
