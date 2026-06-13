"use client";

import { Environment, OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { ElectronStream } from "./3d/ElectronStream";
import { ReactionEquation3D } from "./3d/ReactionEquation3D";
import { ReactionZone } from "./3d/ReactionZone";
import { RedoxAtom } from "./3d/RedoxAtom";
import { RedoxIon } from "./3d/RedoxIon";
import { SpectatorIon } from "./3d/SpectatorIon";
import { redoxPositions, stageIntensity } from "./3d/redox3DUtils";
import type { RedoxLevelId } from "./redoxTypes";

const levelEquation: Partial<Record<RedoxLevelId, string>> = {
  electron_transaction: "Zn + Cu²⁺ → Zn²⁺ + Cu",
  spectator_cleanup: "Zn + CuSO₄ → ZnSO₄ + Cu",
  oxidation_gate: "Zn → Zn²⁺ + 2e⁻",
  reduction_gate: "Cu²⁺ + 2e⁻ → Cu",
  simultaneous_redox: "Zn + Cu²⁺ → Zn²⁺ + Cu",
  agents_challenge: "Zn + Cu²⁺ → Zn²⁺ + Cu",
};

function RedoxSceneContent({
  levelId,
  active,
  spectatorStripped,
  controlsEnabled,
}: {
  levelId: RedoxLevelId;
  active: boolean;
  spectatorStripped?: boolean;
  controlsEnabled: boolean;
}) {
  const intensity = stageIntensity(levelId, active);
  const zincIon = (levelId === "oxidation_gate" || levelId === "electron_transaction") && active;
  const copperMetal = (levelId === "reduction_gate" || levelId === "electron_transaction") && active;
  const simultaneous = levelId === "simultaneous_redox" || levelId === "agents_challenge";

  return (
    <>
      <color attach="background" args={["#06142f"]} />
      <ambientLight intensity={0.58} />
      <directionalLight position={[2.5, 5, 3]} intensity={2.2} castShadow />
      <pointLight position={[0, 2.3, 2.6]} intensity={active ? 26 : 12} color="#38bdf8" />
      <Stars radius={32} depth={12} count={420} factor={2.2} saturation={0.2} fade speed={0.45} />
      <Environment preset="city" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]} receiveShadow>
        <planeGeometry args={[8, 4.2]} />
        <meshStandardMaterial color="#0f1e3f" roughness={0.55} metalness={0.1} />
      </mesh>

      <ReactionZone label="Oxidation zone" subtitle="Zinc gives electrons" position={[-2.75, -0.66, 0]} color="#fb923c" active={levelId === "oxidation_gate" || simultaneous || levelId === "electron_transaction"} />
      <ReactionZone label="Reduction zone" subtitle="Copper ion receives" position={[2.75, -0.66, 0]} color="#22c55e" active={levelId === "reduction_gate" || simultaneous || levelId === "electron_transaction"} />

      {zincIon || simultaneous ? (
        <RedoxIon label="Zn²⁺" charge="+2" position={redoxPositions.zinc} color="#93c5fd" active />
      ) : (
        <RedoxAtom label="Zn" position={redoxPositions.zinc} color="#9ca3af" metal active={levelId === "oxidation_gate" || levelId === "electron_transaction"} />
      )}

      {copperMetal || simultaneous ? (
        <RedoxAtom label="Cu" position={redoxPositions.copper} color="#f97316" metal active />
      ) : (
        <RedoxIon label="Cu²⁺" charge="+2" position={redoxPositions.copper} color="#fb923c" active={levelId === "reduction_gate" || levelId === "electron_transaction"} />
      )}

      <SpectatorIon position={redoxPositions.sulfateLeft} faded={Boolean(spectatorStripped || levelId !== "spectator_cleanup")} />
      <SpectatorIon position={redoxPositions.sulfateRight} faded={Boolean(spectatorStripped || levelId !== "spectator_cleanup")} />

      <ElectronStream active={active && ["electron_transaction", "oxidation_gate", "reduction_gate", "simultaneous_redox", "agents_challenge"].includes(levelId)} progress={intensity} />
      {levelEquation[levelId] ? <ReactionEquation3D label={levelEquation[levelId] ?? ""} /> : null}

      <OrbitControls enabled={controlsEnabled} enableZoom={controlsEnabled} enableRotate={controlsEnabled} enablePan={false} maxPolarAngle={Math.PI / 2.1} minDistance={4.6} maxDistance={8.2} autoRotate={false} />
    </>
  );
}

export function Redox3DStage({
  levelId,
  active,
  spectatorStripped,
  controlsEnabled = false,
}: {
  levelId: RedoxLevelId;
  active: boolean;
  spectatorStripped?: boolean;
  controlsEnabled?: boolean;
}) {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-slate-950 shadow-2xl shadow-cyan-950/40">
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.22),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0),rgba(15,23,42,0.22))]" />
      <Canvas shadows camera={{ position: [0, 2.2, 6.4], fov: 48 }} dpr={[1, 1.65]}>
        <Suspense fallback={null}>
          <RedoxSceneContent levelId={levelId} active={active} spectatorStripped={spectatorStripped} controlsEnabled={controlsEnabled} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-2xl border border-white/10 bg-slate-950/55 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 backdrop-blur">
        {controlsEnabled ? "Explore mode: rotate the model" : "Fixed game preview"}
      </div>
    </div>
  );
}
