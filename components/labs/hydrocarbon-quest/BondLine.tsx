import type { MoleculeAtom, MoleculeBond } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export function BondLine({ bond, from, to, highlighted }: { bond: MoleculeBond; from: MoleculeAtom; to: MoleculeAtom; highlighted?: boolean }) {
  const stroke = bond.type === "triple" ? "#8b5cf6" : bond.type === "double" ? "#f59e0b" : highlighted ? "#22c55e" : "#475569";
  return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={stroke} strokeWidth={highlighted ? 10 : 7} strokeLinecap="round" />;
}
