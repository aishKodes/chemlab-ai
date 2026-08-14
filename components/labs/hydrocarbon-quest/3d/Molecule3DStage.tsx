"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Html, Stars } from "@react-three/drei";
import { Crosshair, Eye, FlaskConical, RotateCcw, Ruler, ScanSearch, Tag, Wind } from "lucide-react";
import type { ReactNode } from "react";
import { Suspense, useMemo, useState } from "react";
import { BallAndStickMolecule } from "@/components/labs/hydrocarbon-quest/3d/BallAndStickMolecule";
import { ChemicalFormulaLabel } from "@/components/labs/hydrocarbon-quest/3d/ChemicalFormulaLabel";
import { MoleculeCameraControls } from "@/components/labs/hydrocarbon-quest/3d/MoleculeCameraControls";
import { MoleculeLegend } from "@/components/labs/hydrocarbon-quest/3d/MoleculeLegend";
import { buildMolecule3D } from "@/components/labs/hydrocarbon-quest/3d/MoleculeGeometryBuilder";
import type { Molecule3DStageProps } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";
import { SoundToggle } from "@/components/labs/hydrocarbon-quest/SoundToggle";
import { useHydrocarbonSound } from "@/components/labs/hydrocarbon-quest/soundHooks";
import { cn } from "@/lib/utils";

export function Molecule3DStage({
  level,
  selectedAtoms,
  wrongAtoms = [],
  numberingOption,
  glowing,
  onAtomClick,
  className,
}: Molecule3DStageProps) {
  const [showHydrogens, setShowHydrogens] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [exploreMode, setExploreMode] = useState(false);
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const built = useMemo(() => buildMolecule3D(level), [level]);
  const sound = useHydrocarbonSound();
  const labelMode = !showLabels ? "clean" : showMeasurements ? "measurement" : "learning";
  const showDevWarnings = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEV_MODE === "true";

  function applyLabelMode(mode: "clean" | "learning" | "measurement") {
    if (mode === "clean") {
      setShowLabels(false);
      setShowMeasurements(false);
      return;
    }
    setShowLabels(true);
    setShowMeasurements(mode === "measurement");
  }

  function resetCamera() {
    setCameraResetKey((key) => key + 1);
    sound.play("reset_camera");
  }

  return (
    <section className={cn("relative h-full min-h-[20rem] overflow-hidden rounded-[1.6rem] border border-white/70 bg-slate-950 shadow-2xl sm:min-h-[23rem]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_16%,rgba(56,189,248,0.24),transparent_32%),radial-gradient(circle_at_76%_20%,rgba(251,191,36,0.18),transparent_28%),linear-gradient(135deg,#020617,#0f172a_48%,#172554)]" />
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 4.2, 8.4], fov: 43 }}
        className="relative z-10"
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={<LoadingMolecule />}>
          <ambientLight intensity={0.85} />
          <directionalLight position={[4, 6, 6]} intensity={2.1} castShadow />
          <pointLight position={[-4, 3, -5]} intensity={1.8} color="#67e8f9" />
          <pointLight position={[4, 2, 4]} intensity={1.1} color="#facc15" />
          <Stars radius={18} depth={18} count={80} factor={1.2} saturation={0} fade speed={0.22} />
          <group position={[0, -0.25, 0]}>
            <BallAndStickMolecule
              level={level}
              selectedAtoms={selectedAtoms}
              wrongAtoms={wrongAtoms}
              numberingOption={numberingOption}
              glowing={glowing}
              onAtomClick={onAtomClick}
              onAtomHover={() => sound.play("atom_hover")}
              options={{ showHydrogens, showLabels, showHydrogenLabels: showLabels && showHydrogens, showMeasurements, autoRotate, labelMode }}
            />
          </group>
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.62, 0]}>
            <circleGeometry args={[7, 64]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.55} roughness={0.9} />
          </mesh>
          <Environment preset="city" />
          <MoleculeCameraControls autoRotate={autoRotate} resetKey={cameraResetKey} exploreMode={exploreMode} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-3 top-3 z-20 flex max-w-[72%] flex-col gap-2">
        <div className="pointer-events-auto flex flex-wrap items-start gap-2">
          <ChemicalFormulaLabel formula={level.formula} name={level.targetName} />
          <SoundToggle />
        </div>
        <MoleculeLegend compact />
      </div>

      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-end justify-between gap-2">
        <div className="rounded-full border border-white/20 bg-slate-950/78 px-3 py-2 text-[11px] font-bold text-cyan-50 shadow-lg backdrop-blur-md">
          {exploreMode ? "Explore view: drag to rotate and scroll to zoom." : "Game view: camera locked so every carbon is easy to tap."}
        </div>
        <div className="flex max-w-full flex-wrap gap-2 rounded-2xl border border-white/30 bg-slate-950/70 p-1.5 shadow-xl backdrop-blur-md">
          <ToggleButton active={showHydrogens} onClick={() => setShowHydrogens((value) => !value)} label="H atoms" icon={<FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />} />
          <ToggleButton
            active={exploreMode}
            onClick={() => {
              setExploreMode((value) => {
                if (value) {
                  setAutoRotate(false);
                  setCameraResetKey((key) => key + 1);
                }
                return !value;
              });
            }}
            label={exploreMode ? "Back to game" : "Explore 3D"}
            icon={<ScanSearch className="h-3.5 w-3.5" aria-hidden="true" />}
          />
          {exploreMode ? (
            <>
              <ToggleButton active={labelMode === "clean"} onClick={() => applyLabelMode("clean")} label="Clean" icon={<Eye className="h-3.5 w-3.5" aria-hidden="true" />} />
              <ToggleButton active={labelMode === "learning"} onClick={() => applyLabelMode("learning")} label="Labels" icon={<Tag className="h-3.5 w-3.5" aria-hidden="true" />} />
              <ToggleButton active={labelMode === "measurement"} onClick={() => applyLabelMode("measurement")} label="Measure" icon={<Ruler className="h-3.5 w-3.5" aria-hidden="true" />} />
              <ToggleButton active={autoRotate} onClick={() => setAutoRotate((value) => !value)} label="Auto rotate" icon={<Wind className="h-3.5 w-3.5" aria-hidden="true" />} />
              <ToggleButton active={false} onClick={resetCamera} label="Reset" icon={<RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />} />
              <ToggleButton active={false} onClick={resetCamera} label="Focus" icon={<Crosshair className="h-3.5 w-3.5" aria-hidden="true" />} />
            </>
          ) : null}
        </div>
      </div>

      {showDevWarnings && built.warnings.length ? (
        <div className="absolute right-3 top-3 z-20 max-w-xs rounded-2xl border border-amber-200 bg-amber-50/92 px-3 py-2 text-xs font-bold text-amber-950 shadow-lg backdrop-blur-md">
          Geometry check: {built.warnings[0].message}
        </div>
      ) : null}
    </section>
  );
}

function ToggleButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition",
        active ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white hover:bg-white/20",
      )}
    >
      {icon ?? <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />}
      {label}
    </button>
  );
}

function LoadingMolecule() {
  return (
    <Html center>
      <div className="rounded-2xl bg-white/90 px-4 py-3 text-sm font-black text-slate-950 shadow-xl">
        Building molecule...
      </div>
    </Html>
  );
}
