"use client";

import { motion } from "framer-motion";
import type { HydrocarbonLevel, MoleculeAtom, MoleculeBond, NumberingOption } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { cn } from "@/lib/utils";

type MoleculeGraphProps = {
  level: HydrocarbonLevel;
  selectedAtoms: string[];
  wrongAtoms?: string[];
  numberingOption?: NumberingOption;
  glowing?: boolean;
  onAtomClick?: (atomId: string) => void;
};

export function MoleculeGraph({
  level,
  selectedAtoms,
  wrongAtoms = [],
  numberingOption,
  glowing = false,
  onAtomClick,
}: MoleculeGraphProps) {
  const atomsById = new Map(level.molecule.atoms.map((atom) => [atom.id, atom]));
  const glowId = `hydrocarbon-glow-${level.id}`;
  const bondGradientId = `hydrocarbon-bond-${level.id}`;
  const atomGradientId = `hydrocarbon-atom-${level.id}`;
  const hydrogens = level.molecule.showHydrogens ? buildHydrogenAtoms(level) : [];
  const firstMultipleBond = level.molecule.bonds.find((bond) => bond.type === "double" || bond.type === "triple");
  const firstMultipleBondFrom = firstMultipleBond ? atomsById.get(firstMultipleBond.from) : undefined;
  const firstMultipleBondTo = firstMultipleBond ? atomsById.get(firstMultipleBond.to) : undefined;

  return (
    <div className="relative h-full min-h-[18rem] w-full">
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 800 430"
        role="img"
        aria-label={`${level.targetName} molecule puzzle`}
      >
      <defs>
        <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.05  0 0 0 0 0.72  0 0 0 0 1  0 0 0 0.9 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={bondGradientId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="52%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <radialGradient id={atomGradientId} cx="34%" cy="28%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#cffafe" />
          <stop offset="100%" stopColor="#38bdf8" />
        </radialGradient>
      </defs>

      <rect x="28" y="42" width="744" height="342" rx="34" fill="rgba(255,255,255,0.58)" stroke="rgba(255,255,255,0.82)" />
      <path d="M78 350 C180 310 275 386 400 350 S625 310 728 354" fill="none" stroke="rgba(14,165,233,0.18)" strokeWidth="18" />

      {hydrogens.map((hydrogen) => (
        <g key={hydrogen.id}>
          <line x1={hydrogen.parent.x} y1={hydrogen.parent.y} x2={hydrogen.x} y2={hydrogen.y} stroke="rgba(226,232,240,0.92)" strokeWidth="3" strokeLinecap="round" />
          <circle cx={hydrogen.x} cy={hydrogen.y} r="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
          <text x={hydrogen.x} y={hydrogen.y + 6} textAnchor="middle" className="pointer-events-none fill-slate-600 text-base font-black">
            H
          </text>
        </g>
      ))}

      {level.molecule.bonds.map((bond) => (
        <BondLine
          key={`${bond.from}-${bond.to}`}
          bond={bond}
          from={atomsById.get(bond.from)}
          to={atomsById.get(bond.to)}
          highlighted={isBondHighlighted(bond, selectedAtoms, level.correctChainSequence)}
          vip={bond.type === "double" || bond.type === "triple"}
          warning={Boolean(numberingOption && !numberingOption.correct && (bond.type === "double" || bond.type === "triple"))}
          gradientId={bondGradientId}
        />
      ))}

      {level.molecule.atoms.map((atom) => {
        const selected = selectedAtoms.includes(atom.id);
        const wrong = wrongAtoms.includes(atom.id);
        const inMainChain = level.correctChainSequence.includes(atom.id);
        const number = getNumberForAtom(atom.id, level.correctChainSequence, numberingOption);

        return (
          <g key={atom.id}>
            {number ? (
              <motion.g initial={{ opacity: 0, y: -8, scale: 0.82 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
                <circle
                  cx={atom.x}
                  cy={atom.y - 70}
                  r="22"
                  fill={numberingOption?.correct ? "#22c55e" : "#fb7185"}
                  stroke="#ffffff"
                  strokeWidth="4"
                />
                <text x={atom.x} y={atom.y - 63} textAnchor="middle" className="fill-white text-lg font-black">
                  {number}
                </text>
              </motion.g>
            ) : null}
            <motion.g
              className="pointer-events-none"
              initial={false}
              animate={{
                scale: wrong ? [1, 1.16, 0.96, 1] : selected || (glowing && inMainChain) ? [1, 1.06, 1] : 1,
              }}
              transition={{ duration: wrong ? 0.42 : 1.8, repeat: selected && !wrong ? Infinity : 0, ease: "easeInOut" }}
            >
              <circle
                cx={atom.x}
                cy={atom.y}
                r={atom.id.startsWith("m") || atom.id.startsWith("e") ? 34 : 40}
                fill={wrong ? "#fecdd3" : selected ? "#bbf7d0" : atomFill(atom.role, atomGradientId)}
                stroke={wrong ? "#e11d48" : selected ? "#16a34a" : "#ffffff"}
                strokeWidth="5"
                filter={selected || glowing ? `url(#${glowId})` : undefined}
              />
              <text x={atom.x} y={atom.y - 4} textAnchor="middle" className="pointer-events-none fill-slate-900 text-xl font-black">
                {atom.element}
              </text>
              <text x={atom.x} y={atom.y + 21} textAnchor="middle" className="pointer-events-none fill-slate-700 text-[13px] font-black">
                {atom.label}
              </text>
            </motion.g>
          </g>
        );
      })}

      {level.molecule.atoms.some((atom) => atom.role === "methyl") ? (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <path d="M250 178 C218 162 218 130 245 103" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 9" />
          <text x="315" y="118" className="fill-amber-800 text-base font-black">
            methyl cousin
          </text>
        </motion.g>
      ) : null}

      {firstMultipleBondFrom && firstMultipleBondTo ? (
        <motion.g animate={{ opacity: [0.62, 1, 0.62], scale: [1, 1.02, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <path
            d={`M${firstMultipleBondFrom.x} ${firstMultipleBondFrom.y - 80} C${(firstMultipleBondFrom.x + firstMultipleBondTo.x) / 2} ${firstMultipleBondFrom.y - 128} ${(firstMultipleBondFrom.x + firstMultipleBondTo.x) / 2} ${firstMultipleBondTo.y - 128} ${firstMultipleBondTo.x} ${firstMultipleBondTo.y - 80}`}
            fill="none"
            stroke={firstMultipleBond?.type === "triple" ? "#8b5cf6" : "#f59e0b"}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x={(firstMultipleBondFrom.x + firstMultipleBondTo.x) / 2 - 70} y={Math.min(firstMultipleBondFrom.y, firstMultipleBondTo.y) - 104} className={cn("fill-fuchsia-700 text-base font-black", numberingOption && !numberingOption.correct && "fill-rose-700")}>
            {firstMultipleBond?.type === "triple" ? "triple-bond trail" : "double-bond VIP"}
          </text>
        </motion.g>
      ) : null}
      </svg>
      <div className="absolute inset-0 z-20">
        {level.molecule.atoms.map((atom, index) => (
          <button
            key={atom.id}
            type="button"
            aria-label={`Select carbon ${index + 1}${atom.id.startsWith("b") || atom.id.startsWith("e") ? " branch" : ""}`}
            onClick={() => onAtomClick?.(atom.id)}
            className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-transparent outline-none transition focus-visible:ring-4 focus-visible:ring-blue-500/70"
            style={{ left: `${(atom.x / 800) * 100}%`, top: `${(atom.y / 430) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function atomFill(role: MoleculeAtom["role"], atomGradientId: string) {
  if (role === "methyl") return "#fb923c";
  if (role === "ethyl") return "#4ade80";
  if (role === "other") return "#c084fc";
  return `url(#${atomGradientId})`;
}

function buildHydrogenAtoms(level: HydrocarbonLevel) {
  const atomsById = new Map(level.molecule.atoms.map((atom) => [atom.id, atom]));
  const bondsByAtom = new Map<string, MoleculeBond[]>();
  for (const bond of level.molecule.bonds) {
    bondsByAtom.set(bond.from, [...(bondsByAtom.get(bond.from) ?? []), bond]);
    bondsByAtom.set(bond.to, [...(bondsByAtom.get(bond.to) ?? []), bond]);
  }

  return level.molecule.atoms.flatMap((atom) => {
    if (atom.element !== "C") return [];
    const bonds = bondsByAtom.get(atom.id) ?? [];
    const valenceUsed = bonds.reduce((sum, bond) => sum + bondOrder(bond.type), 0);
    const hydrogenCount = Math.max(0, 4 - valenceUsed);
    const usedVectors = bonds
      .map((bond) => atomsById.get(bond.from === atom.id ? bond.to : bond.from))
      .filter(Boolean)
      .map((neighbor) => normalize({ x: (neighbor?.x ?? atom.x) - atom.x, y: (neighbor?.y ?? atom.y) - atom.y }));
    const directions = chooseHydrogenDirections(usedVectors, hydrogenCount);
    return directions.map((direction, index) => ({
      id: `${atom.id}-h${index + 1}`,
      parent: atom,
      x: atom.x + direction.x * 68,
      y: atom.y + direction.y * 68,
    }));
  });
}

function bondOrder(type: MoleculeBond["type"]) {
  if (type === "double") return 2;
  if (type === "triple") return 3;
  return 1;
}

function normalize(vector: { x: number; y: number }) {
  const length = Math.hypot(vector.x, vector.y) || 1;
  return { x: vector.x / length, y: vector.y / length };
}

function chooseHydrogenDirections(usedVectors: Array<{ x: number; y: number }>, count: number) {
  const candidates = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -0.72, y: -0.72 },
    { x: 0.72, y: -0.72 },
    { x: -0.72, y: 0.72 },
    { x: 0.72, y: 0.72 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ].map(normalize);

  const ranked = candidates
    .map((candidate) => ({
      candidate,
      score: usedVectors.reduce((max, used) => Math.max(max, candidate.x * used.x + candidate.y * used.y), -1),
    }))
    .sort((a, b) => a.score - b.score)
    .map((item) => item.candidate);

  return ranked.slice(0, count);
}

function BondLine({
  bond,
  from,
  to,
  highlighted,
  vip,
  warning,
  gradientId,
}: {
  bond: MoleculeBond;
  from?: MoleculeAtom;
  to?: MoleculeAtom;
  highlighted: boolean;
  vip?: boolean;
  warning?: boolean;
  gradientId: string;
}) {
  if (!from || !to) return null;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy) || 1;
  const offsetX = (-dy / length) * 8;
  const offsetY = (dx / length) * 8;
  const stroke = warning ? "#fb7185" : highlighted || vip ? `url(#${gradientId})` : "#475569";
  const baseProps = {
    x1: from.x,
    y1: from.y,
    x2: to.x,
    y2: to.y,
    strokeLinecap: "round" as const,
  };

  if (bond.type === "double") {
    return (
      <motion.g
        animate={vip ? { opacity: [0.78, 1, 0.78] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <line {...baseProps} x1={from.x + offsetX} y1={from.y + offsetY} x2={to.x + offsetX} y2={to.y + offsetY} stroke={warning ? "#fb7185" : "#d946ef"} strokeWidth="8" />
        <line {...baseProps} x1={from.x - offsetX} y1={from.y - offsetY} x2={to.x - offsetX} y2={to.y - offsetY} stroke={warning ? "#fb7185" : "#f59e0b"} strokeWidth="8" />
      </motion.g>
    );
  }

  if (bond.type === "triple") {
    return (
      <motion.g
        animate={vip ? { opacity: [0.78, 1, 0.78] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <line {...baseProps} stroke="#8b5cf6" strokeWidth="7" />
        <line {...baseProps} x1={from.x + offsetX} y1={from.y + offsetY} x2={to.x + offsetX} y2={to.y + offsetY} stroke="#c084fc" strokeWidth="6" />
        <line {...baseProps} x1={from.x - offsetX} y1={from.y - offsetY} x2={to.x - offsetX} y2={to.y - offsetY} stroke="#6d28d9" strokeWidth="6" />
      </motion.g>
    );
  }

  return (
    <motion.line
      {...baseProps}
      stroke={highlighted ? `url(#${gradientId})` : stroke}
      strokeWidth={highlighted ? 10 : 7}
      strokeDasharray={highlighted ? "10 8" : undefined}
      animate={highlighted ? { strokeDashoffset: [0, -36] } : undefined}
      transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
    />
  );
}

function isBondHighlighted(bond: MoleculeBond, selectedAtoms: string[], sequence: string[]) {
  const selected = new Set(selectedAtoms);
  if (!selected.has(bond.from) || !selected.has(bond.to)) return false;
  const fromIndex = sequence.indexOf(bond.from);
  const toIndex = sequence.indexOf(bond.to);
  return Math.abs(fromIndex - toIndex) === 1;
}

function getNumberForAtom(atomId: string, sequence: string[], option?: NumberingOption) {
  if (!option) return undefined;
  const index = sequence.indexOf(atomId);
  if (index === -1) return undefined;
  return option.id === "left" ? index + 1 : sequence.length - index;
}
