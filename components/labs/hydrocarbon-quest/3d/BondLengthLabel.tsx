"use client";

import { Html } from "@react-three/drei";
import { toVector3, formatAngstrom } from "@/components/labs/hydrocarbon-quest/3d/molecule3DUtils";
import type { BuiltAtom3D, BuiltBond3D } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";

export function BondLengthLabel({ bond, from, to }: { bond: BuiltBond3D; from: BuiltAtom3D; to: BuiltAtom3D }) {
  const mid = toVector3(from.position).add(toVector3(to.position)).multiplyScalar(0.5);
  return (
    <group position={[mid.x, mid.y + 0.18, mid.z]}>
      <Html center distanceFactor={7} className="pointer-events-none select-none">
        <span className="rounded-full border border-cyan-200 bg-slate-950/82 px-2 py-1 text-[10px] font-black text-cyan-50 shadow-lg">
          {formatAngstrom(bond.lengthAngstrom)}
        </span>
      </Html>
    </group>
  );
}
