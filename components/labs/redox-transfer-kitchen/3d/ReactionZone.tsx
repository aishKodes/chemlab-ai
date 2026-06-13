import { Text } from "@react-three/drei";
import type { Vector3Tuple } from "./redox3DUtils";

export function ReactionZone({
  label,
  subtitle,
  position,
  color,
  active,
}: {
  label: string;
  subtitle: string;
  position: Vector3Tuple;
  color: string;
  active: boolean;
}) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.88, 1.08, 72]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.42 : 0.18} />
      </mesh>
      <Text position={[0, -0.9, 0.02]} fontSize={0.16} color="#e0f2fe" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#020617">
        {label}
      </Text>
      <Text position={[0, -1.14, 0.02]} fontSize={0.115} color="#fefce8" anchorX="center" anchorY="middle">
        {subtitle}
      </Text>
    </group>
  );
}
