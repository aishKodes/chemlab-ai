"use client";

import { AtomLabel } from "@/components/labs/hydrocarbon-quest/3d/AtomLabel";
import { LocantBadge } from "@/components/labs/hydrocarbon-quest/3d/LocantBadge";
import { applyManagedOffset, resolveLabelCollisions } from "@/components/labs/hydrocarbon-quest/3d/LabelCollisionManager";
import { atomLabelOffset, labelPosition, locantOffset } from "@/components/labs/hydrocarbon-quest/3d/labelUtils";
import { getNumberForAtom } from "@/components/labs/hydrocarbon-quest/3d/molecule3DUtils";
import type { BuiltAtom3D, Molecule3DRenderOptions } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";
import type { NumberingOption } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export function FloatingLabelLayer({
  atoms,
  correctMainChain,
  numberingOption,
  options,
}: {
  atoms: BuiltAtom3D[];
  correctMainChain: string[];
  numberingOption?: NumberingOption;
  options: Molecule3DRenderOptions;
}) {
  if (options.labelMode === "clean") return null;

  const atomAnchors = atoms
    .filter((atom) => atom.element === "C" || (atom.element === "H" && options.showHydrogenLabels))
    .map((atom) => ({
      id: `atom-${atom.id}`,
      atom,
      category: atom.element === "H" ? ("hydrogen" as const) : ("atom" as const),
      position: labelPosition(atom, atomLabelOffset(atom)),
    }));

  const locantAnchors = atoms
    .filter((atom) => getNumberForAtom(atom.id, correctMainChain, numberingOption))
    .map((atom, index) => ({
      id: `locant-${atom.id}`,
      atom,
      category: "locant" as const,
      position: labelPosition(atom, locantOffset(atom, index)),
    }));

  const labels = resolveLabelCollisions([...atomAnchors, ...locantAnchors]);

  return (
    <>
      {labels.map((label) => {
        const position = applyManagedOffset(label.position, label.offset);
        if (label.category === "locant" && label.atom) {
          return (
            <LocantBadge
              key={label.id}
              number={getNumberForAtom(label.atom.id, correctMainChain, numberingOption)}
              position={position}
              correct={numberingOption?.correct}
            />
          );
        }
        if (label.atom) {
          return (
            <AtomLabel
              key={label.id}
              atom={label.atom}
              position={position}
              visible
            />
          );
        }
        return null;
      })}
    </>
  );
}
