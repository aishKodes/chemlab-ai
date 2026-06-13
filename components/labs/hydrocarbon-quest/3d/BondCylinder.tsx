"use client";

import * as THREE from "three";
import { BOND_DISPLAY_RADIUS, HYDROCARBON_COLORS } from "@/components/labs/hydrocarbon-quest/3d/moleculeGeometryConstants";
import { getParallelOffsets, toVector3 } from "@/components/labs/hydrocarbon-quest/3d/molecule3DUtils";
import type { BuiltAtom3D, BuiltBond3D } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";

export function BondCylinder({
  bond,
  from,
  to,
  highlighted,
  wrong,
  vip,
}: {
  bond: BuiltBond3D;
  from: BuiltAtom3D;
  to: BuiltAtom3D;
  highlighted?: boolean;
  wrong?: boolean;
  vip?: boolean;
}) {
  const start = toVector3(from.position);
  const end = toVector3(to.position);
  const offsets = getParallelOffsets(start, end, bond.order);

  return (
    <>
      {offsets.map((offset, index) => (
        <SingleCylinder
          key={`${bond.from}-${bond.to}-${index}`}
          start={start.clone().add(offset)}
          end={end.clone().add(offset)}
          radius={BOND_DISPLAY_RADIUS[bond.order]}
          color={getBondColor(bond.order, index, highlighted, wrong, vip)}
          emissive={highlighted || vip || wrong}
        />
      ))}
    </>
  );
}

function SingleCylinder({
  start,
  end,
  radius,
  color,
  emissive,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  radius: number;
  color: string;
  emissive?: boolean;
}) {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const direction = end.clone().sub(start);
  const length = direction.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

  return (
    <mesh position={mid} quaternion={quaternion} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, length, 18]} />
      <meshStandardMaterial
        color={color}
        emissive={new THREE.Color(color)}
        emissiveIntensity={emissive ? 0.3 : 0.06}
        roughness={0.34}
        metalness={0.08}
      />
    </mesh>
  );
}

function getBondColor(order: BuiltBond3D["order"], index: number, highlighted?: boolean, wrong?: boolean, vip?: boolean) {
  if (wrong) return HYDROCARBON_COLORS.wrong;
  if (highlighted) return HYDROCARBON_COLORS.correct;
  if (order === 2) return index === 0 ? HYDROCARBON_COLORS.doubleBondA : HYDROCARBON_COLORS.doubleBondB;
  if (order === 3) return HYDROCARBON_COLORS.tripleBond;
  if (vip) return HYDROCARBON_COLORS.doubleBondB;
  return HYDROCARBON_COLORS.singleBond;
}
