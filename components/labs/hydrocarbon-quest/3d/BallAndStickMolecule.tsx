"use client";

import { useMemo } from "react";
import { AtomSphere } from "@/components/labs/hydrocarbon-quest/3d/AtomSphere";
import { BondCylinder } from "@/components/labs/hydrocarbon-quest/3d/BondCylinder";
import { FloatingLabelLayer } from "@/components/labs/hydrocarbon-quest/3d/FloatingLabelLayer";
import { buildMolecule3D } from "@/components/labs/hydrocarbon-quest/3d/MoleculeGeometryBuilder";
import { MoleculeMeasurementOverlay } from "@/components/labs/hydrocarbon-quest/3d/MoleculeMeasurementOverlay";
import { getAtomById, isBondInSelectedPath } from "@/components/labs/hydrocarbon-quest/3d/molecule3DUtils";
import type { Molecule3DRenderOptions, Molecule3DStageProps } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";

export function BallAndStickMolecule({
  level,
  selectedAtoms,
  wrongAtoms = [],
  numberingOption,
  glowing,
  onAtomClick,
  onAtomHover,
  options,
}: Omit<Molecule3DStageProps, "className"> & { options: Molecule3DRenderOptions; onAtomHover?: (atomId: string) => void }) {
  const molecule = useMemo(() => buildMolecule3D(level), [level]);
  const visibleAtoms = options.showHydrogens ? molecule.atoms : molecule.atoms.filter((atom) => atom.element !== "H");
  const visibleAtomIds = new Set(visibleAtoms.map((atom) => atom.id));
  const visibleBonds = molecule.bonds.filter((bond) => visibleAtomIds.has(bond.from) && visibleAtomIds.has(bond.to));

  return (
    <group>
      {visibleBonds.map((bond) => {
        const from = getAtomById(molecule.atoms, bond.from);
        const to = getAtomById(molecule.atoms, bond.to);
        if (!from || !to) return null;
        const selectedPath = isBondInSelectedPath(bond, selectedAtoms, level.correctChainSequence);
        const wrongPath = wrongAtoms.includes(bond.from) || wrongAtoms.includes(bond.to);
        return (
          <BondCylinder
            key={`${bond.from}-${bond.to}`}
            bond={bond}
            from={from}
            to={to}
            highlighted={selectedPath || (glowing && selectedPath)}
            wrong={wrongPath}
            vip={bond.order > 1}
          />
        );
      })}
      {visibleAtoms.map((atom) => {
        const selected = selectedAtoms.includes(atom.id);
        const wrong = wrongAtoms.includes(atom.id);
        const correctGlow = Boolean(glowing && level.correctChainSequence.includes(atom.id));
        return (
          <AtomSphere
            key={atom.id}
            atom={atom}
            selected={selected}
            wrong={wrong}
            correctGlow={correctGlow}
            onClick={atom.element === "C" ? onAtomClick : undefined}
            onHover={atom.element === "C" ? onAtomHover : undefined}
          />
        );
      })}
      {options.showLabels ? (
        <FloatingLabelLayer
          atoms={visibleAtoms}
          correctMainChain={level.correctChainSequence}
          numberingOption={numberingOption}
          options={options}
        />
      ) : null}
      {options.showMeasurements ? <MoleculeMeasurementOverlay molecule={molecule} /> : null}
    </group>
  );
}
