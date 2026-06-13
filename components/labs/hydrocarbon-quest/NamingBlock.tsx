import type { NamingBlock as NamingBlockType } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export function NamingBlock({ block }: { block: NamingBlockType }) {
  return <span className="rounded-2xl border border-white/70 bg-white px-3 py-2 text-sm font-black text-slate-900 shadow">{block.label}</span>;
}
