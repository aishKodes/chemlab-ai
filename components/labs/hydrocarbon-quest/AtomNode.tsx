import type { MoleculeAtom } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export function AtomNode({ atom, selected }: { atom: MoleculeAtom; selected?: boolean }) {
  return (
    <g>
      <circle cx={atom.x} cy={atom.y} r={atom.element === "H" ? 18 : 40} fill={selected ? "#bbf7d0" : atom.element === "H" ? "#f8fafc" : "#7dd3fc"} stroke="#ffffff" strokeWidth="4" />
      <text x={atom.x} y={atom.y + 6} textAnchor="middle" className="fill-slate-900 text-base font-black">
        {atom.element}
      </text>
    </g>
  );
}
