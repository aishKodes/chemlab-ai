import { Text } from "@react-three/drei";
import type { Vector3Tuple } from "./redox3DUtils";
import { ChargeBadge } from "./ChargeBadge";

export function RedoxIon({
  label,
  charge,
  position,
  color,
  active = false,
}: {
  label: string;
  charge: string;
  position: Vector3Tuple;
  color: string;
  active?: boolean;
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[0.58, 4]} />
        <meshStandardMaterial color={color} roughness={0.22} metalness={0.08} emissive={active ? color : "#000000"} emissiveIntensity={active ? 0.18 : 0} transparent opacity={0.96} />
      </mesh>
      <mesh scale={[1.22, 1.22, 1.22]}>
        <icosahedronGeometry args={[0.58, 4]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.22 : 0.08} />
      </mesh>
      <Text position={[0, 0, 0.66]} fontSize={0.21} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.014} outlineColor="#0f172a">
        {label}
      </Text>
      <ChargeBadge label={charge} position={[0.5, 0.5, 0.18]} color="#bae6fd" />
    </group>
  );
}
