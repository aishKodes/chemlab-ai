"use client";

import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { calculateAngleDegrees, toVector3 } from "@/components/labs/hydrocarbon-quest/3d/molecule3DUtils";
import type { BuiltAtom3D } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";

export function BondAngleArc({ a, center, b, label }: { a: BuiltAtom3D; center: BuiltAtom3D; b: BuiltAtom3D; label?: string }) {
  const centerVector = toVector3(center.position);
  const aVector = toVector3(a.position).sub(centerVector).normalize();
  const bVector = toVector3(b.position).sub(centerVector).normalize();
  const points = Array.from({ length: 16 }, (_, index) => {
    const t = index / 15;
    const vector = new THREE.Vector3().copy(aVector).lerp(bVector, t).normalize().multiplyScalar(0.68).add(centerVector);
    return vector;
  });
  const angle = calculateAngleDegrees(a.position, center.position, b.position);
  const labelPosition = points[Math.floor(points.length / 2)].clone().add(new THREE.Vector3(0, 0.22, 0));

  return (
    <>
      <Line points={points} color="#facc15" lineWidth={2} transparent opacity={0.85} />
      <group position={labelPosition}>
        <Html center distanceFactor={7} className="pointer-events-none select-none">
          <span className="rounded-full border border-amber-200 bg-slate-950/82 px-2 py-1 text-[10px] font-black text-amber-50 shadow-lg">
            {label ?? `${Math.round(angle)}°`}
          </span>
        </Html>
      </group>
    </>
  );
}
