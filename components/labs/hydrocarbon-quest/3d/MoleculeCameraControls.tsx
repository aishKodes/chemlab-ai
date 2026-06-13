"use client";

import { OrbitControls } from "@react-three/drei";

export function MoleculeCameraControls({ autoRotate, resetKey }: { autoRotate: boolean; resetKey: number }) {
  return (
    <OrbitControls
      key={resetKey}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      minDistance={4.2}
      maxDistance={13}
      maxPolarAngle={Math.PI * 0.88}
    />
  );
}
