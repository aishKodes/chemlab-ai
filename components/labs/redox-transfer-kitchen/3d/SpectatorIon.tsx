import { Text } from "@react-three/drei";
import type { Vector3Tuple } from "./redox3DUtils";

export function SpectatorIon({ position, faded = false }: { position: Vector3Tuple; faded?: boolean }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.32, 28, 28]} />
        <meshStandardMaterial color="#a78bfa" roughness={0.2} transparent opacity={faded ? 0.22 : 0.72} />
      </mesh>
      <Text position={[0, 0, 0.36]} fontSize={0.16} color={faded ? "#cbd5e1" : "#ffffff"} anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#312e81">
        SO₄²⁻
      </Text>
      {faded ? (
        <Text position={[0, -0.52, 0.02]} fontSize={0.12} color="#ddd6fe" anchorX="center" anchorY="middle">
          spectator
        </Text>
      ) : null}
    </group>
  );
}
