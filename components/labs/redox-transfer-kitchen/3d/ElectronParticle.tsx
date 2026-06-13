import type { Vector3Tuple } from "./redox3DUtils";

export function ElectronParticle({ position, scale = 1 }: { position: Vector3Tuple; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial color="#7dd3fc" />
      </mesh>
      <mesh scale={[2.2, 2.2, 2.2]}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}
