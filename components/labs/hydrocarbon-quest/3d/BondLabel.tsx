"use client";

import { formatAngstrom } from "@/components/labs/hydrocarbon-quest/3d/molecule3DUtils";
import { MeasurementLabel } from "@/components/labs/hydrocarbon-quest/3d/MeasurementLabel";
import type { BuiltAtom3D, BuiltBond3D } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";
import { bondLabelPosition } from "@/components/labs/hydrocarbon-quest/3d/labelUtils";

export function BondLabel({ bond, from, to }: { bond: BuiltBond3D; from: BuiltAtom3D; to: BuiltAtom3D }) {
  const tone = bond.order === 3 ? "violet" : bond.order === 2 ? "amber" : "cyan";
  return (
    <MeasurementLabel position={bondLabelPosition(from, to, 0.24)} tone={tone}>
      {getBondName(bond, from, to)} ≈ {formatAngstrom(bond.lengthAngstrom)}
    </MeasurementLabel>
  );
}

function getBondName(bond: BuiltBond3D, from: BuiltAtom3D, to: BuiltAtom3D) {
  const elementLabel = `${from.element}${bond.order === 1 ? "–" : bond.order === 2 ? "=" : "≡"}${to.element}`;
  return elementLabel;
}
