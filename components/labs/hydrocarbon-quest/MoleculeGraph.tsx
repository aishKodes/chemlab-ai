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

  return (
    <svg
      className="h-full min-h-[18rem] w-full overflow-visible"
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

      {level.molecule.bonds.map((bond) => (
        <BondLine
          key={`${bond.from}-${bond.to}`}
          bond={bond}
          from={atomsById.get(bond.from)}
          to={atomsById.get(bond.to)}
          highlighted={isBondHighlighted(bond, selectedAtoms, level.correctChainSequence)}
          vip={level.id === "butene" && bond.type === "double"}
          warning={numberingOption && !numberingOption.correct && level.id === "butene" && bond.type === "double"}
          gradientId={bondGradientId}
        />
      ))}

      {level.molecule.atoms.map((atom, index) => {
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
              role="button"
              tabIndex={0}
              aria-label={`Select carbon ${index + 1}${atom.id.startsWith("b") ? " branch" : ""}`}
              onClick={() => onAtomClick?.(atom.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onAtomClick?.(atom.id);
                }
              }}
              className="cursor-pointer outline-none"
              initial={false}
              animate={{
                scale: wrong ? [1, 1.16, 0.96, 1] : selected || (glowing && inMainChain) ? [1, 1.06, 1] : 1,
              }}
              transition={{ duration: wrong ? 0.42 : 1.8, repeat: selected && !wrong ? Infinity : 0, ease: "easeInOut" }}
            >
              <circle
                cx={atom.x}
                cy={atom.y}
                r={atom.id.startsWith("b") ? 35 : 40}
                fill={wrong ? "#fecdd3" : selected ? "#bbf7d0" : `url(#${atomGradientId})`}
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

      {level.id === "methylpentane" ? (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <path d="M250 178 C218 162 218 130 245 103" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 9" />
          <text x="315" y="118" className="fill-amber-800 text-base font-black">
            side cousin
          </text>
        </motion.g>
      ) : null}

      {level.id === "butene" ? (
        <motion.g animate={{ opacity: [0.62, 1, 0.62], scale: [1, 1.02, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <path d="M188 170 C240 126 302 126 354 170" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <text x="215" y="116" className={cn("fill-fuchsia-700 text-base font-black", numberingOption && !numberingOption.correct && "fill-rose-700")}>
            double-bond VIP
          </text>
        </motion.g>
      ) : null}
    </svg>
  );
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
