"use client";

import { useCursor } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";
import { ATOM_DISPLAY_RADII, HYDROCARBON_COLORS } from "@/components/labs/hydrocarbon-quest/3d/moleculeGeometryConstants";
import type { BuiltAtom3D } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";

export function AtomSphere({
  atom,
  selected,
  wrong,
  correctGlow,
  onClick,
  onHover,
}: {
  atom: BuiltAtom3D;
  selected?: boolean;
  wrong?: boolean;
  correctGlow?: boolean;
  onClick?: (atomId: string) => void;
  onHover?: (atomId: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && atom.element === "C");
  const radius = ATOM_DISPLAY_RADII[atom.element];
  const color = getAtomColor(atom, selected, wrong, correctGlow, hovered);
  const emissive = selected || correctGlow || hovered ? color : wrong ? HYDROCARBON_COLORS.wrong : "#020617";
  const isClickableCarbon = atom.element === "C" && onClick;

  return (
    <group position={atom.position}>
      <mesh
        castShadow
        receiveShadow
        onPointerOver={(event) => {
          event.stopPropagation();
          if (isClickableCarbon) {
            setHovered(true);
            onHover?.(atom.id);
          }
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
        onClick={(event) => {
          event.stopPropagation();
          if (isClickableCarbon) onClick(atom.id);
        }}
        scale={selected ? 1.12 : wrong ? 1.08 : hovered ? 1.08 : 1}
      >
        <sphereGeometry args={[radius, atom.element === "H" ? 24 : 36, atom.element === "H" ? 16 : 24]} />
        <meshStandardMaterial
          color={color}
          emissive={new THREE.Color(emissive)}
          emissiveIntensity={selected || correctGlow ? 0.32 : wrong ? 0.24 : hovered ? 0.18 : 0.05}
          roughness={0.28}
          metalness={atom.element === "H" ? 0.08 : 0.18}
        />
      </mesh>
      {selected || hovered || wrong ? (
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={wrong ? 1.25 : selected ? 1.18 : 1.08}>
          <torusGeometry args={[radius + 0.13, 0.018, 12, 48]} />
          <meshBasicMaterial
            color={wrong ? HYDROCARBON_COLORS.wrong : selected ? HYDROCARBON_COLORS.correct : HYDROCARBON_COLORS.selected}
            transparent
            opacity={wrong ? 0.82 : 0.68}
          />
        </mesh>
      ) : null}
    </group>
  );
}

function getAtomColor(atom: BuiltAtom3D, selected?: boolean, wrong?: boolean, correctGlow?: boolean, hovered?: boolean) {
  if (wrong) return HYDROCARBON_COLORS.wrong;
  if (selected || hovered) return HYDROCARBON_COLORS.selected;
  if (correctGlow) return HYDROCARBON_COLORS.correct;
  return HYDROCARBON_COLORS[atom.role] ?? HYDROCARBON_COLORS.other;
}
