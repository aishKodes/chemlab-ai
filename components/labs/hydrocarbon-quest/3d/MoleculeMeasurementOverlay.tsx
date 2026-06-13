"use client";

import { BondAngleArc } from "@/components/labs/hydrocarbon-quest/3d/BondAngleArc";
import { BondLabel } from "@/components/labs/hydrocarbon-quest/3d/BondLabel";
import { BOND_ANGLES_DEGREES } from "@/components/labs/hydrocarbon-quest/3d/moleculeGeometryConstants";
import { getAtomById } from "@/components/labs/hydrocarbon-quest/3d/molecule3DUtils";
import type { BuiltMolecule3D } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";

export function MoleculeMeasurementOverlay({ molecule }: { molecule: BuiltMolecule3D }) {
  const carbonBonds = molecule.bonds.filter((bond) => !bond.from.includes("_h") && !bond.to.includes("_h")).slice(0, 4);
  const angleData = getAngleData(molecule);

  return (
    <>
      {carbonBonds.map((bond) => {
        const from = getAtomById(molecule.atoms, bond.from);
        const to = getAtomById(molecule.atoms, bond.to);
        if (!from || !to) return null;
        return <BondLabel key={`${bond.from}-${bond.to}`} bond={bond} from={from} to={to} />;
      })}
      {angleData ? (
        <BondAngleArc
          a={angleData.a}
          center={angleData.center}
          b={angleData.b}
          label={`~${angleData.angle}°`}
        />
      ) : null}
    </>
  );
}

function getAngleData(molecule: BuiltMolecule3D) {
  const center = molecule.atoms.find((atom) => atom.element === "C");
  if (!center) return undefined;
  const neighbors = molecule.bonds
    .filter((bond) => bond.from === center.id || bond.to === center.id)
    .map((bond) => getAtomById(molecule.atoms, bond.from === center.id ? bond.to : bond.from))
    .filter(Boolean);
  if (neighbors.length < 2) return undefined;
  const angle = center.hybridization === "sp" ? BOND_ANGLES_DEGREES.SP_LINEAR : center.hybridization === "sp2" ? BOND_ANGLES_DEGREES.SP2_TRIGONAL_PLANAR : BOND_ANGLES_DEGREES.SP3_TETRAHEDRAL;
  return {
    a: neighbors[0]!,
    center,
    b: neighbors[1]!,
    angle,
  };
}
