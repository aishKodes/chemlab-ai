import { Float, Text } from "@react-three/drei";
import type { Vector3Tuple } from "./redox3DUtils";

export function RedoxAtom({
  label,
  position,
  color,
  metal = false,
  active = false,
}: {
  label: string;
  position: Vector3Tuple;
  color: string;
  metal?: boolean;
  active?: boolean;
}) {
  return (
    <Float speed={active ? 1.4 : 0.7} rotationIntensity={0.08} floatIntensity={active ? 0.2 : 0.08}>
      <group position={position}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[metal ? 0.62 : 0.54, 48, 48]} />
          <meshStandardMaterial color={color} metalness={metal ? 0.45 : 0.12} roughness={0.32} emissive={active ? color : "#000000"} emissiveIntensity={active ? 0.14 : 0} />
        </mesh>
        <mesh scale={[1.15, 1.15, 1.15]}>
          <sphereGeometry args={[metal ? 0.62 : 0.54, 48, 48]} />
          <meshBasicMaterial color={color} transparent opacity={active ? 0.18 : 0.08} />
        </mesh>
        <Text position={[0, 0, 0.66]} fontSize={0.23} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.014} outlineColor="#0f172a">
          {label}
        </Text>
      </group>
    </Float>
  );
}
