"use client";

import { Html } from "@react-three/drei";
import type { BuiltAtom3D } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";

export function AtomNumberBadge({ atom, number, correct }: { atom: BuiltAtom3D; number?: number; correct?: boolean }) {
  if (!number) return null;
  return (
    <group position={[atom.position[0], atom.position[1] + 0.62, atom.position[2]]}>
      <Html center distanceFactor={8} className="pointer-events-none select-none">
        <span className={`grid h-8 w-8 place-items-center rounded-full border-2 border-white text-sm font-black text-white shadow-xl ${correct ? "bg-emerald-500" : "bg-rose-500"}`}>
          {number}
        </span>
      </Html>
    </group>
  );
}
