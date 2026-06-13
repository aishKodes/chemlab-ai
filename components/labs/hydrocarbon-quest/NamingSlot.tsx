import type { NamingSlot as NamingSlotType } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export function NamingSlot({ slot }: { slot: NamingSlotType }) {
  return (
    <span className="rounded-2xl border-2 border-dashed border-cyan-200 bg-white/80 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-700">
      {slot.label}
    </span>
  );
}
