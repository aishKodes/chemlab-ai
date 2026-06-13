"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { ElectronParticle } from "./ElectronParticle";
import { electronPoint } from "./redox3DUtils";

const offsets = [0, 0.18, 0.36, 0.54];

export function ElectronStream({ active, progress = 1 }: { active: boolean; progress?: number }) {
  const groupRef = useRef<Group>(null);
  const particleRefs = useRef<Array<Group | null>>([]);
  const frameRef = useRef(0);

  useFrame((_, delta) => {
    frameRef.current = (frameRef.current + delta * (active ? 0.42 : 0.08)) % 1;
    if (groupRef.current) {
      groupRef.current.visible = active || progress > 0.2;
    }
    offsets.forEach((offset, index) => {
      const particle = particleRefs.current[index];
      if (!particle) return;
      particle.position.set(...electronPoint(frameRef.current * progress, offset));
    });
  });

  return (
    <group ref={groupRef}>
      {offsets.map((offset, index) => (
        <group
          key={offset}
          ref={(node) => {
            particleRefs.current[index] = node;
          }}
        >
          <ElectronParticle position={[0, 0, 0]} scale={active ? 1 : 0.75} />
        </group>
      ))}
    </group>
  );
}
