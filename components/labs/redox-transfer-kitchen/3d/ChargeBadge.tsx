import { Text } from "@react-three/drei";
import type { Vector3Tuple } from "./redox3DUtils";

export function ChargeBadge({ label, position, color = "#fef3c7" }: { label: string; position: Vector3Tuple; color?: string }) {
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[0.34, 40]} />
        <meshBasicMaterial color={color} transparent opacity={0.92} />
      </mesh>
      <Text position={[0, 0, 0.03]} fontSize={0.16} color="#111827" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}
