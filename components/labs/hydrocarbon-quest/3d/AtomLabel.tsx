"use client";

import { Html } from "@react-three/drei";
import type { BuiltAtom3D, Vec3 } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";
import { cn } from "@/lib/utils";

export function AtomLabel({
  atom,
  position,
  visible,
}: {
  atom: BuiltAtom3D;
  position: Vec3;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <group position={position}>
      <Html center distanceFactor={7.5} className="pointer-events-none select-none">
        <span
          className={cn(
            "inline-flex min-h-6 min-w-6 items-center justify-center rounded-full border-2 px-1.5 text-[11px] font-black shadow-[0_10px_24px_rgba(15,23,42,0.28)] backdrop-blur-md",
            atom.element === "H"
              ? "border-white/80 bg-white/90 text-slate-700"
              : atom.role === "methyl"
                ? "border-amber-200 bg-amber-100 text-amber-950"
                : atom.role === "ethyl"
                  ? "border-emerald-200 bg-emerald-100 text-emerald-950"
                  : "border-cyan-200 bg-slate-950/88 text-cyan-50",
          )}
        >
          {atom.element}
        </span>
      </Html>
    </group>
  );
}
