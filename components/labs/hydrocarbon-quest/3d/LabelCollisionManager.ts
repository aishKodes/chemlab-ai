import type { BuiltAtom3D, Vec3 } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";

export type LabelCategory = "atom" | "hydrogen" | "locant" | "bond" | "angle";

export type LabelAnchor = {
  id: string;
  atom?: BuiltAtom3D;
  position: Vec3;
  category: LabelCategory;
};

export type ManagedLabelAnchor = LabelAnchor & {
  offset: Vec3;
};

export function resolveLabelCollisions(labels: LabelAnchor[]): ManagedLabelAnchor[] {
  const occupied = new Map<string, number>();

  return labels.map((label, index) => {
    const key = bucketKey(label.position);
    const count = occupied.get(key) ?? 0;
    occupied.set(key, count + 1);
    const spiral = getSpiralOffset(count + index * 0.08);
    const categoryLift = label.category === "locant" ? 0.16 : label.category === "bond" ? 0.08 : 0;

    return {
      ...label,
      offset: [spiral[0], spiral[1] + categoryLift, spiral[2]],
    };
  });
}

export function applyManagedOffset(position: Vec3, offset: Vec3): Vec3 {
  return [position[0] + offset[0], position[1] + offset[1], position[2] + offset[2]];
}

function bucketKey(position: Vec3) {
  return `${Math.round(position[0] * 2) / 2}:${Math.round(position[1] * 2) / 2}:${Math.round(position[2] * 2) / 2}`;
}

function getSpiralOffset(seed: number): Vec3 {
  const angle = seed * 2.399;
  const radius = Math.min(0.36, seed * 0.08);
  return [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, Math.sin(angle) * radius];
}
