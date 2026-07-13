"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type Atom = { id: string; element: string; position: [number, number, number]; color: string; radius?: number };
type Bond = { from: string; to: string; order?: 1 | 2 | 3; label?: string };
type Molecule = {
  id: string;
  name: string;
  formula: string;
  geometry: string;
  angle: string;
  note: string;
  vsepr: string;
  atoms: Atom[];
  bonds: Bond[];
};

const molecules: Molecule[] = [
  {
    id: "water",
    name: "Water",
    formula: "H₂O",
    geometry: "Bent",
    angle: "about 104.5°",
    vsepr: "AX₂E₂",
    note: "Oxygen has two bond pairs and two lone pairs. Lone-pair repulsion bends the H-O-H shape.",
    atoms: [
      { id: "O", element: "O", position: [0, 0, 0], color: "#ef4444", radius: 0.32 },
      { id: "H1", element: "H", position: [-0.82, -0.52, 0], color: "#f8fafc", radius: 0.18 },
      { id: "H2", element: "H", position: [0.82, -0.52, 0], color: "#f8fafc", radius: 0.18 },
    ],
    bonds: [
      { from: "O", to: "H1" },
      { from: "O", to: "H2" },
    ],
  },
  {
    id: "carbon-dioxide",
    name: "Carbon dioxide",
    formula: "CO₂",
    geometry: "Linear",
    angle: "180°",
    vsepr: "AX₂",
    note: "Two electron regions around carbon arrange opposite each other, making a straight line.",
    atoms: [
      { id: "C", element: "C", position: [0, 0, 0], color: "#1f2937", radius: 0.28 },
      { id: "O1", element: "O", position: [-1.15, 0, 0], color: "#ef4444", radius: 0.3 },
      { id: "O2", element: "O", position: [1.15, 0, 0], color: "#ef4444", radius: 0.3 },
    ],
    bonds: [
      { from: "C", to: "O1", order: 2, label: "double" },
      { from: "C", to: "O2", order: 2, label: "double" },
    ],
  },
  {
    id: "methane",
    name: "Methane",
    formula: "CH₄",
    geometry: "Tetrahedral",
    angle: "about 109.5°",
    vsepr: "AX₄",
    note: "Four bonding pairs spread out evenly in 3D to reduce repulsion.",
    atoms: [
      { id: "C", element: "C", position: [0, 0, 0], color: "#1f2937", radius: 0.3 },
      { id: "H1", element: "H", position: [0.78, 0.78, 0.78], color: "#f8fafc", radius: 0.17 },
      { id: "H2", element: "H", position: [-0.78, -0.78, 0.78], color: "#f8fafc", radius: 0.17 },
      { id: "H3", element: "H", position: [-0.78, 0.78, -0.78], color: "#f8fafc", radius: 0.17 },
      { id: "H4", element: "H", position: [0.78, -0.78, -0.78], color: "#f8fafc", radius: 0.17 },
    ],
    bonds: [{ from: "C", to: "H1" }, { from: "C", to: "H2" }, { from: "C", to: "H3" }, { from: "C", to: "H4" }],
  },
  {
    id: "ammonia",
    name: "Ammonia",
    formula: "NH₃",
    geometry: "Trigonal pyramidal",
    angle: "about 107°",
    vsepr: "AX₃E",
    note: "Nitrogen has one lone pair, so the three N-H bonds form a pyramid shape.",
    atoms: [
      { id: "N", element: "N", position: [0, 0.28, 0], color: "#2563eb", radius: 0.3 },
      { id: "H1", element: "H", position: [0.85, -0.48, 0.25], color: "#f8fafc", radius: 0.17 },
      { id: "H2", element: "H", position: [-0.85, -0.48, 0.25], color: "#f8fafc", radius: 0.17 },
      { id: "H3", element: "H", position: [0, -0.48, -0.85], color: "#f8fafc", radius: 0.17 },
    ],
    bonds: [{ from: "N", to: "H1" }, { from: "N", to: "H2" }, { from: "N", to: "H3" }],
  },
  {
    id: "boron-trifluoride",
    name: "Boron trifluoride",
    formula: "BF₃",
    geometry: "Trigonal planar",
    angle: "about 120°",
    vsepr: "AX₃",
    note: "Three bonding regions around boron lie in one plane with equal spacing.",
    atoms: [
      { id: "B", element: "B", position: [0, 0, 0], color: "#f59e0b", radius: 0.27 },
      { id: "F1", element: "F", position: [0, 1.05, 0], color: "#22c55e", radius: 0.25 },
      { id: "F2", element: "F", position: [-0.92, -0.52, 0], color: "#22c55e", radius: 0.25 },
      { id: "F3", element: "F", position: [0.92, -0.52, 0], color: "#22c55e", radius: 0.25 },
    ],
    bonds: [{ from: "B", to: "F1" }, { from: "B", to: "F2" }, { from: "B", to: "F3" }],
  },
  {
    id: "ethene",
    name: "Ethene",
    formula: "C₂H₄",
    geometry: "Planar around each carbon",
    angle: "about 120°",
    vsepr: "sp² carbon centres",
    note: "The double bond keeps the carbon atoms and hydrogens in a flat arrangement.",
    atoms: [
      { id: "C1", element: "C", position: [-0.55, 0, 0], color: "#1f2937", radius: 0.28 },
      { id: "C2", element: "C", position: [0.55, 0, 0], color: "#1f2937", radius: 0.28 },
      { id: "H1", element: "H", position: [-1.15, 0.72, 0], color: "#f8fafc", radius: 0.16 },
      { id: "H2", element: "H", position: [-1.15, -0.72, 0], color: "#f8fafc", radius: 0.16 },
      { id: "H3", element: "H", position: [1.15, 0.72, 0], color: "#f8fafc", radius: 0.16 },
      { id: "H4", element: "H", position: [1.15, -0.72, 0], color: "#f8fafc", radius: 0.16 },
    ],
    bonds: [{ from: "C1", to: "C2", order: 2, label: "C=C" }, { from: "C1", to: "H1" }, { from: "C1", to: "H2" }, { from: "C2", to: "H3" }, { from: "C2", to: "H4" }],
  },
  {
    id: "ethyne",
    name: "Ethyne",
    formula: "C₂H₂",
    geometry: "Linear",
    angle: "180°",
    vsepr: "sp carbon centres",
    note: "The triple bond makes each carbon linear at school level.",
    atoms: [
      { id: "C1", element: "C", position: [-0.45, 0, 0], color: "#1f2937", radius: 0.28 },
      { id: "C2", element: "C", position: [0.45, 0, 0], color: "#1f2937", radius: 0.28 },
      { id: "H1", element: "H", position: [-1.25, 0, 0], color: "#f8fafc", radius: 0.16 },
      { id: "H2", element: "H", position: [1.25, 0, 0], color: "#f8fafc", radius: 0.16 },
    ],
    bonds: [{ from: "C1", to: "C2", order: 3, label: "C≡C" }, { from: "C1", to: "H1" }, { from: "C2", to: "H2" }],
  },
  {
    id: "benzene",
    name: "Benzene",
    formula: "C₆H₆",
    geometry: "Planar hexagonal ring",
    angle: "about 120°",
    vsepr: "sp² carbon centres",
    note: "Benzene is a flat ring. This school-level model shows the planar carbon skeleton and attached hydrogens.",
    atoms: ringAtoms(),
    bonds: ringBonds(),
  },
];

export function MoleculeShapes3D() {
  const [selectedId, setSelectedId] = useState("water");
  const [autoRotate, setAutoRotate] = useState(true);
  const selected = molecules.find((molecule) => molecule.id === selectedId) ?? molecules[0];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ff,transparent_35%),linear-gradient(135deg,#fffdf7,#eef7ff_45%,#f5efff)]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[96rem] gap-4 px-4 py-5 lg:grid-cols-[18rem_1fr_22rem]">
        <aside className="rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-xl shadow-blue-100/50 backdrop-blur">
          <Badge tone="blue">School-level 3D</Badge>
          <h1 className="mt-3 text-2xl font-black text-slate-950">Molecule Shapes 3D</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Rotate the molecule. Look at the shape. Chemistry is 3D.</p>
          <div className="mt-5 grid gap-2">
            {molecules.map((molecule) => (
              <button
                key={molecule.id}
                type="button"
                className={`rounded-2xl px-3 py-2 text-left text-sm font-black transition ${selected.id === molecule.id ? "bg-blue-600 text-white shadow-lg" : "bg-blue-50 text-blue-900 hover:bg-blue-100"}`}
                onClick={() => {
                  setSelectedId(molecule.id);
                  void trackEvent({ event_type: "simulation", event_name: "molecule_shape_selected", page_path: "/labs/molecule-shapes-3d", metadata: { molecule: molecule.id } });
                }}
              >
                {molecule.name}
                <span className="block text-xs font-bold opacity-75">{molecule.formula}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 shadow-2xl shadow-blue-950/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.25),transparent_32%),radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.2),transparent_30%)]" />
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <Badge tone="green">{selected.geometry}</Badge>
            <Badge tone="cyan">{selected.angle}</Badge>
          </div>
          <Canvas camera={{ position: [0, 1.2, 5], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[4, 5, 5]} intensity={1.2} />
            <pointLight position={[-3, -2, 4]} intensity={0.8} color="#67e8f9" />
            <MoleculeModel molecule={selected} autoRotate={autoRotate} />
            <OrbitControls enablePan={false} minDistance={2.8} maxDistance={7} />
          </Canvas>
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
            <div>
              <p className="text-sm font-black text-white">{selected.formula}</p>
              <p className="text-xs font-semibold text-blue-100">{selected.vsepr}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-2xl bg-white/90 px-3 py-2 text-xs font-black text-slate-900" onClick={() => setAutoRotate((value) => !value)}>
                {autoRotate ? "Pause rotation" : "Rotate"}
              </button>
              <button type="button" className="rounded-2xl bg-white/15 px-3 py-2 text-xs font-black text-white" onClick={() => setSelectedId(selected.id)}>
                <RotateCcw className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                Reset view
              </button>
            </div>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-violet-100/50 backdrop-blur">
          <Badge tone="green">What to notice</Badge>
          <h2 className="mt-3 text-2xl font-black text-slate-950">{selected.name}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Info label="Formula" value={selected.formula} />
            <Info label="Geometry" value={selected.geometry} />
            <Info label="Bond angle" value={selected.angle} />
            <Info label="VSEPR note" value={selected.vsepr} />
          </dl>
          <div className="mt-5 rounded-3xl bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-blue-900">
              <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Why this shape?
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{selected.note}</p>
          </div>
          <div className="mt-5 grid gap-2">
            <Button href={`/ai-tutor?prompt=${encodeURIComponent(`Why is ${selected.name} ${selected.geometry.toLowerCase()}?`)}`}>
              Ask Chem-Shastri
            </Button>
            <Button href="/resources/open-visualizations" variant="secondary">
              Open reviewed visualizations
            </Button>
          </div>
          <p className="mt-4 text-xs font-semibold leading-5 text-slate-500">
            This is a school-level molecular geometry visualization. It is built for learning shapes, not quantum-level structural accuracy.
          </p>
        </aside>
      </div>
    </main>
  );
}

function MoleculeModel({ molecule, autoRotate }: { molecule: Molecule; autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });
  const atomMap = useMemo(() => new Map(molecule.atoms.map((atom) => [atom.id, atom])), [molecule]);
  return (
    <group ref={groupRef}>
      {molecule.bonds.map((bond, index) => (
        <BondMesh key={`${bond.from}-${bond.to}-${index}`} bond={bond} atomMap={atomMap} />
      ))}
      {molecule.atoms.map((atom) => (
        <mesh key={atom.id} position={atom.position} castShadow>
          <sphereGeometry args={[atom.radius ?? 0.24, 48, 48]} />
          <meshStandardMaterial color={atom.color} roughness={0.32} metalness={0.08} />
          <Html distanceFactor={9} center>
            <span className="rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-black text-slate-900 shadow">{atom.element}</span>
          </Html>
        </mesh>
      ))}
    </group>
  );
}

function BondMesh({ bond, atomMap }: { bond: Bond; atomMap: Map<string, Atom> }) {
  const from = atomMap.get(bond.from);
  const to = atomMap.get(bond.to);
  if (!from || !to) return null;
  const start = new THREE.Vector3(...from.position);
  const end = new THREE.Vector3(...to.position);
  const direction = end.clone().sub(start);
  const length = direction.length();
  const midpoint = start.clone().add(end).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  const offsets = bond.order === 3 ? [-0.06, 0, 0.06] : bond.order === 2 ? [-0.045, 0.045] : [0];
  const normal = new THREE.Vector3(0, 0, 1);
  return (
    <group>
      {offsets.map((offset) => {
        const position = midpoint.clone().add(normal.clone().multiplyScalar(offset));
        return (
          <mesh key={offset} position={position} quaternion={quaternion}>
            <cylinderGeometry args={[0.045, 0.045, length, 24]} />
            <meshStandardMaterial color={bond.order && bond.order > 1 ? "#fbbf24" : "#93c5fd"} roughness={0.45} />
          </mesh>
        );
      })}
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

function ringAtoms(): Atom[] {
  const atoms: Atom[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    atoms.push({ id: `C${i + 1}`, element: "C", position: [Math.cos(angle), Math.sin(angle), 0], color: "#1f2937", radius: 0.24 });
    atoms.push({ id: `H${i + 1}`, element: "H", position: [1.45 * Math.cos(angle), 1.45 * Math.sin(angle), 0], color: "#f8fafc", radius: 0.14 });
  }
  return atoms;
}

function ringBonds(): Bond[] {
  const bonds: Bond[] = [];
  for (let i = 1; i <= 6; i++) {
    const next = i === 6 ? 1 : i + 1;
    bonds.push({ from: `C${i}`, to: `C${next}`, order: i % 2 === 0 ? 2 : 1 });
    bonds.push({ from: `C${i}`, to: `H${i}` });
  }
  return bonds;
}
