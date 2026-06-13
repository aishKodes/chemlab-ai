"use client";

import type { ReactNode } from "react";
import { Html } from "@react-three/drei";
import type { Vec3 } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";
import { cn } from "@/lib/utils";

export function MeasurementLabel({
  position,
  children,
  tone = "cyan",
}: {
  position: Vec3;
  children: ReactNode;
  tone?: "cyan" | "amber" | "violet";
}) {
  return (
    <group position={position}>
      <Html center distanceFactor={7} className="pointer-events-none select-none">
        <span
          className={cn(
            "rounded-full border px-2 py-1 text-[10px] font-black shadow-lg backdrop-blur-md",
            tone === "amber" && "border-amber-200 bg-slate-950/84 text-amber-50",
            tone === "violet" && "border-violet-200 bg-slate-950/84 text-violet-50",
            tone === "cyan" && "border-cyan-200 bg-slate-950/84 text-cyan-50",
          )}
        >
          {children}
        </span>
      </Html>
    </group>
  );
}
