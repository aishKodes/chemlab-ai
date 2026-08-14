"use client";

import { OrbitControls } from "@react-three/drei";

export function MoleculeCameraControls({ autoRotate, resetKey, exploreMode }: { autoRotate: boolean; resetKey: number; exploreMode: boolean }) {
  return (
    <OrbitControls
      key={resetKey}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      autoRotate={exploreMode && autoRotate}
      autoRotateSpeed={0.8}
      enableRotate={exploreMode}
      enablePan={exploreMode}
      enableZoom={exploreMode}
      minDistance={4.2}
      maxDistance={13}
      maxPolarAngle={Math.PI * 0.88}
    />
  );
}
