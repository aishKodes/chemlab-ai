"use client";

import { Html } from "@react-three/drei";
import type { Vec3 } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";
import { cn } from "@/lib/utils";

export function LocantBadge({
  number,
  position,
  correct,
}: {
  number?: number;
  position: Vec3;
  correct?: boolean;
}) {
  if (!number) return null;

  return (
    <group position={position}>
      <Html center distanceFactor={7} className="pointer-events-none select-none">
        <span
          className={cn(
            "grid h-8 w-8 place-items-center rounded-full border-2 border-white text-sm font-black text-white shadow-[0_0_28px_rgba(255,255,255,0.28)]",
            correct ? "bg-emerald-500 ring-4 ring-emerald-300/35" : "animate-pulse bg-rose-500 ring-4 ring-rose-300/35",
          )}
        >
          {number}
        </span>
      </Html>
    </group>
  );
}
