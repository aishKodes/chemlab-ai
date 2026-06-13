import { Text } from "@react-three/drei";

export function ReactionEquation3D({ label }: { label: string }) {
  return (
    <group position={[0, 1.92, 0]}>
      <mesh>
        <planeGeometry args={[5.7, 0.52]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.68} />
      </mesh>
      <Text position={[0, 0, 0.02]} fontSize={0.18} color="#fefce8" anchorX="center" anchorY="middle" maxWidth={5.4}>
        {label}
      </Text>
    </group>
  );
}
