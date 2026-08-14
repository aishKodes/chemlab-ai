"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { RotateCcw, Search, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { elementVisuals } from "@/data/molecules/moleculeCoordinates";
import { ncertMoleculeLibrary } from "@/data/molecules/ncertMoleculeLibrary";
import { validateMolecule } from "@/data/molecules/moleculeValidation";
import type { MoleculeAtom, MoleculeBond, MoleculeCategory, NcertMolecule } from "@/data/molecules/moleculeGeometryTypes";

type ClassFilter = "all" | "10" | "11" | "12";
type CategoryFilter = "all" | MoleculeCategory;

const categories: Array<{ id: CategoryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "vsepr", label: "VSEPR" },
  { id: "hydrocarbon", label: "Hydrocarbon" },
  { id: "organic", label: "Organic" },
  { id: "functional_group", label: "Functional group" },
  { id: "inorganic", label: "Inorganic" },
  { id: "coordination", label: "Coordination" },
  { id: "ionic", label: "Ionic" },
];

export function MoleculeShapes3D() {
  const [selectedId, setSelectedId] = useState("water");
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showBondLabels, setShowBondLabels] = useState(true);
  const [showLonePairs, setShowLonePairs] = useState(true);
  const [classFilter, setClassFilter] = useState<ClassFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [viewKey, setViewKey] = useState(0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return ncertMoleculeLibrary.filter((molecule) => {
      const classOk = classFilter === "all" || molecule.classLevels.includes(classFilter);
      const categoryOk = categoryFilter === "all" || molecule.categories.includes(categoryFilter);
      const textOk =
        !normalized ||
        [molecule.name, molecule.formula, molecule.geometry, molecule.chapters.join(" "), molecule.topics.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return classOk && categoryOk && textOk;
    });
  }, [categoryFilter, classFilter, query]);

  const selected = ncertMoleculeLibrary.find((molecule) => molecule.id === selectedId) ?? filtered[0] ?? ncertMoleculeLibrary[0];
  const warnings = useMemo(() => validateMolecule(selected), [selected]);

  function chooseMolecule(molecule: NcertMolecule) {
    setSelectedId(molecule.id);
    setViewKey((value) => value + 1);
    void trackEvent({
      event_type: "simulation",
      event_name: "molecule_shape_selected",
      page_path: "/labs/molecule-shapes-3d",
      metadata: { molecule: molecule.id, classLevels: molecule.classLevels, source: molecule.coordinateSource },
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ff,transparent_35%),linear-gradient(135deg,#fffdf7,#eef7ff_45%,#f5efff)]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[100rem] gap-4 px-4 py-5 lg:grid-cols-[20rem_1fr_24rem]">
        <aside className="rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-xl shadow-blue-100/50 backdrop-blur">
          <Badge tone="blue">NCERT molecule library</Badge>
          <h1 className="mt-3 text-2xl font-black text-slate-950">Molecule Shapes 3D</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            Rotate molecules, compare geometry, and check whether a model is idealized or simplified.
          </p>

          <label className="mt-4 block">
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">Search</span>
            <div className="mt-1 flex h-11 items-center gap-2 rounded-2xl border border-blue-100 bg-white px-3">
              <Search className="h-4 w-4 text-blue-500" aria-hidden="true" />
              <input
                className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="water, benzene, NH3..."
              />
            </div>
          </label>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {(["all", "10", "11", "12"] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-2xl px-3 py-2 text-xs font-black ${classFilter === item ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-900"}`}
                onClick={() => setClassFilter(item)}
              >
                {item === "all" ? "All" : `C${item}`}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`rounded-full px-3 py-1.5 text-[11px] font-black ${categoryFilter === item.id ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-800"}`}
                onClick={() => setCategoryFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-5 max-h-[34rem] space-y-2 overflow-y-auto pr-1">
            {filtered.map((molecule) => (
              <button
                key={molecule.id}
                type="button"
                className={`w-full rounded-2xl px-3 py-2 text-left text-sm font-black transition ${
                  selected.id === molecule.id ? "bg-blue-600 text-white shadow-lg" : "bg-blue-50 text-blue-900 hover:bg-blue-100"
                }`}
                onClick={() => chooseMolecule(molecule)}
              >
                {molecule.name}
                <span className="block text-xs font-bold opacity-80">{formulaText(molecule.formula)} · {molecule.geometry}</span>
              </button>
            ))}
            {!filtered.length ? <p className="rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900">No molecule matches this filter yet.</p> : null}
          </div>
        </aside>

        <section className="relative min-h-[35rem] overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 shadow-2xl shadow-blue-950/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.25),transparent_32%),radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.2),transparent_30%)]" />
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <Badge tone="green">{selected.geometry}</Badge>
            <Badge tone="cyan">{selected.bondAngles[0]}</Badge>
            <Badge tone={selected.accuracyLevel === "simplified" ? "amber" : "blue"}>{accuracyLabel(selected)}</Badge>
          </div>
          <Canvas key={`${selected.id}-${viewKey}`} camera={{ position: [0, 1.25, 5.2], fov: 45 }}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[4, 5, 5]} intensity={1.25} />
            <pointLight position={[-3, -2, 4]} intensity={0.85} color="#67e8f9" />
            <MoleculeModel molecule={selected} autoRotate={autoRotate} showLabels={showLabels} showBondLabels={showBondLabels} showLonePairs={showLonePairs} />
            <OrbitControls enablePan={false} minDistance={2.7} maxDistance={8} />
          </Canvas>
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
            <div>
              <p className="text-sm font-black text-white">{formulaText(selected.formula)}</p>
              <p className="text-xs font-semibold text-blue-100">{selected.hybridization ?? selected.coordinateSource}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Toggle label="Labels" value={showLabels} onClick={() => setShowLabels((value) => !value)} />
              <Toggle label="Bonds" value={showBondLabels} onClick={() => setShowBondLabels((value) => !value)} />
              <Toggle label="Lone pairs" value={showLonePairs} onClick={() => setShowLonePairs((value) => !value)} />
              <button type="button" className="rounded-2xl bg-white/90 px-3 py-2 text-xs font-black text-slate-900" onClick={() => setAutoRotate((value) => !value)}>
                {autoRotate ? "Pause rotation" : "Rotate"}
              </button>
              <button type="button" className="rounded-2xl bg-white/15 px-3 py-2 text-xs font-black text-white" onClick={() => setViewKey((value) => value + 1)}>
                <RotateCcw className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                Reset view
              </button>
            </div>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-violet-100/50 backdrop-blur">
          <Badge tone="green">What to notice</Badge>
          <h2 className="mt-3 text-2xl font-black text-slate-950">{selected.name}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Info label="Formula" value={formulaText(selected.formula)} />
            <Info label="Geometry" value={selected.geometry} />
            <Info label="Bond angles" value={selected.bondAngles.join(", ")} />
            <Info label="Hybridization / model" value={selected.hybridization ?? selected.coordinateSource.replaceAll("_", " ")} />
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            {selected.classLevels.map((level) => <Badge key={level} tone="slate">Class {level}</Badge>)}
            <Badge tone={selected.coordinateSource === "pubchem" ? "green" : selected.coordinateSource === "simplified" ? "amber" : "blue"}>
              {selected.coordinateSource.replaceAll("_", " ")}
            </Badge>
          </div>

          <div className="mt-5 rounded-3xl bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-blue-900">
              <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Why this shape?
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{selected.notes}</p>
            <p className="mt-2 text-xs font-bold leading-5 text-slate-500">
              Context: {selected.chapters.slice(0, 2).join(" · ")}
            </p>
          </div>

          {warnings.length && process.env.NODE_ENV !== "production" ? (
            <div className="mt-4 rounded-3xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">
              Dev warnings: {warnings.map((warning) => warning.message).join(" ")}
            </div>
          ) : null}

          <div className="mt-5 grid gap-2">
            <Button href={`/ai-tutor?prompt=${encodeURIComponent(`For ${selected.name} (${selected.formula}), explain why its geometry is ${selected.geometry.toLowerCase()} and why its bond angle is ${selected.bondAngles.join(", ")}. Connect this to ${selected.topics[0] ?? "molecular geometry"}.`)}`}>
              Ask Chem-Shastri
            </Button>
            <Button href="/resources/open-visualizations" variant="secondary">
              Open reviewed visualizations
            </Button>
          </div>
          <p className="mt-4 text-xs font-semibold leading-5 text-slate-500">
            Models are tagged by source. Idealized VSEPR and simplified models are for school-level shape understanding, not quantum-level structural precision.
          </p>
        </aside>
      </div>
    </main>
  );
}

function MoleculeModel({
  molecule,
  autoRotate,
  showLabels,
  showBondLabels,
  showLonePairs,
}: {
  molecule: NcertMolecule;
  autoRotate: boolean;
  showLabels: boolean;
  showBondLabels: boolean;
  showLonePairs: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.32;
  });
  const atomMap = useMemo(() => new Map(molecule.atoms.map((atom) => [atom.id, atom])), [molecule]);
  return (
    <group ref={groupRef}>
      {molecule.bonds.map((bond, index) => (
        <BondMesh key={`${bond.from}-${bond.to}-${index}`} bond={bond} atomMap={atomMap} showLabel={showBondLabels} />
      ))}
      {molecule.lonePairs?.map((lonePair) => showLonePairs ? <LonePairCloud key={lonePair.atomId} lonePair={lonePair} atomMap={atomMap} /> : null)}
      {molecule.atoms.map((item) => (
        <AtomMesh key={item.id} atom={item} showLabel={showLabels} />
      ))}
    </group>
  );
}

function AtomMesh({ atom: item, showLabel }: { atom: MoleculeAtom; showLabel: boolean }) {
  const visual = elementVisuals[item.element] ?? elementVisuals.default;
  return (
    <mesh position={item.position} castShadow>
      <sphereGeometry args={[visual.radius, 48, 48]} />
      <meshStandardMaterial color={visual.color} roughness={0.32} metalness={item.role === "central" ? 0.12 : 0.05} />
      {showLabel ? (
        <Html distanceFactor={9} center>
          <span className="rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-black text-slate-900 shadow">
            {item.label ?? item.element}
            {item.charge ? <sup>{item.charge}</sup> : null}
          </span>
        </Html>
      ) : null}
    </mesh>
  );
}

function BondMesh({ bond, atomMap, showLabel }: { bond: MoleculeBond; atomMap: Map<string, MoleculeAtom>; showLabel: boolean }) {
  const from = atomMap.get(bond.from);
  const to = atomMap.get(bond.to);
  if (!from || !to) return null;
  const start = new THREE.Vector3(...from.position);
  const end = new THREE.Vector3(...to.position);
  const direction = end.clone().sub(start);
  const length = direction.length();
  const midpoint = start.clone().add(end).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  const offsets = bond.order === 3 ? [-0.08, 0, 0.08] : bond.order === 2 || bond.order === 1.5 ? [-0.055, 0.055] : [0];
  const normal = new THREE.Vector3(0, 0, 1);
  return (
    <group>
      {offsets.map((offset) => {
        const position = midpoint.clone().add(normal.clone().multiplyScalar(offset));
        return (
          <mesh key={offset} position={position} quaternion={quaternion}>
            <cylinderGeometry args={[0.045, 0.045, length, 24]} />
            <meshStandardMaterial color={bond.order > 1 ? "#fbbf24" : "#93c5fd"} roughness={0.45} />
          </mesh>
        );
      })}
      {showLabel && bond.label ? (
        <Html position={midpoint.toArray()} distanceFactor={8} center>
          <span className="rounded-full bg-slate-950/75 px-2 py-1 text-[10px] font-black text-amber-100 shadow">{bond.label}</span>
        </Html>
      ) : null}
    </group>
  );
}

function LonePairCloud({ lonePair, atomMap }: { lonePair: NonNullable<NcertMolecule["lonePairs"]>[number]; atomMap: Map<string, MoleculeAtom> }) {
  const base = atomMap.get(lonePair.atomId);
  if (!base) return null;
  const positions = lonePair.positions ?? Array.from({ length: lonePair.count }, (_, index) => [base.position[0] + (index - (lonePair.count - 1) / 2) * 0.3, base.position[1] + 0.62, base.position[2] + 0.22] as [number, number, number]);
  return (
    <group>
      {positions.map((position, index) => (
        <mesh key={`${lonePair.atomId}-${index}`} position={position}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.4} />
          <Html distanceFactor={9} center>
            <span className="rounded-full bg-amber-100 px-1 text-[9px] font-black text-amber-900">LP</span>
          </Html>
        </mesh>
      ))}
    </group>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 p-3">
      <dt className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 font-black text-slate-950">{value}</dd>
    </div>
  );
}

function Toggle({ label, value, onClick }: { label: string; value: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`rounded-2xl px-3 py-2 text-xs font-black ${value ? "bg-white text-slate-900" : "bg-white/15 text-white"}`} onClick={onClick}>
      {label}
    </button>
  );
}

function formulaText(formula: string) {
  return formula
    .replace(/2/g, "₂")
    .replace(/3/g, "₃")
    .replace(/4/g, "₄")
    .replace(/5/g, "₅")
    .replace(/6/g, "₆")
    .replace(/7/g, "₇")
    .replace(/8/g, "₈")
    .replace(/9/g, "₉");
}

function accuracyLabel(molecule: NcertMolecule) {
  if (molecule.coordinateSource === "pubchem") return "PubChem 3D";
  if (molecule.coordinateSource === "idealized_vsepr") return "Idealized VSEPR";
  if (molecule.coordinateSource === "simplified") return "Simplified";
  return "Hand curated";
}
