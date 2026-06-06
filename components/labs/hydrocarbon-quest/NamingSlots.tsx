"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { HydrocarbonLevel, NamingBlock, SlotMap } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { assembleName, getBlockById } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestUtils";
import { cn } from "@/lib/utils";

export function NamingSlots({
  level,
  slots,
  selectedBlockId,
  failedSlotIds,
  enabled,
  onPlace,
  onRemove,
}: {
  level: HydrocarbonLevel;
  slots: SlotMap;
  selectedBlockId?: string;
  failedSlotIds: string[];
  enabled: boolean;
  onPlace: (slotId: string, blockId: string) => void;
  onRemove: (slotId: string) => void;
}) {
  const placedName = assembleName(level, slots);

  return (
    <section aria-labelledby="naming-slots" className="rounded-[1.4rem] border-2 border-white bg-white/84 p-3 shadow-lg backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="naming-slots" className="text-sm font-black text-slate-950">
            Family name slots
          </h2>
          <p className="mt-1 text-xs font-bold text-slate-600">First Name + Middle Name + Surname</p>
        </div>
        <motion.div
          key={placedName || "empty"}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-lg"
        >
          {placedName || "Build the name"}
        </motion.div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {level.slots.map((slot) => {
          const blockId = slots[slot.id];
          const block = blockId ? getBlockById(level.availableBlocks, blockId) : undefined;
          const failed = failedSlotIds.includes(slot.id);
          return (
            <motion.div
              key={slot.id}
              animate={failed ? { x: [0, -8, 8, -4, 0] } : undefined}
              className={cn(
                "min-h-[6.25rem] rounded-[1.2rem] border-2 border-dashed bg-white/72 p-3 transition",
                failed ? "border-rose-300 bg-rose-50" : "border-cyan-200",
                enabled && selectedBlockId && "hover:border-blue-400 hover:bg-blue-50/80",
              )}
              onDragOver={(event) => {
                if (enabled) event.preventDefault();
              }}
              onDrop={(event) => {
                if (!enabled) return;
                const droppedBlock = event.dataTransfer.getData("text/plain");
                if (droppedBlock) onPlace(slot.id, droppedBlock);
              }}
              onClick={() => {
                if (enabled && selectedBlockId) onPlace(slot.id, selectedBlockId);
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-blue-700">{slot.label}</p>
                  <p className="mt-1 text-xs font-bold leading-4 text-slate-500">{slot.helper}</p>
                </div>
                {block ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemove(slot.id);
                    }}
                    className="focus-ring rounded-full bg-slate-100 p-1 text-slate-600 hover:bg-rose-100 hover:text-rose-700"
                    aria-label={`Remove ${block.label}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              {block ? <PlacedBlock block={block} /> : <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-black text-slate-400">Drop here</div>}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function PlacedBlock({ block }: { block: NamingBlock }) {
  return (
    <motion.div
      initial={{ scale: 0.88, y: 8, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      className={cn("mt-3 rounded-2xl border-2 px-3 py-2 text-center text-base font-black shadow-md", blockClass(block.kind))}
    >
      {block.label}
    </motion.div>
  );
}

function blockClass(kind: NamingBlock["kind"]) {
  if (kind === "rank") return "border-amber-300 bg-amber-100 text-amber-900";
  if (kind === "prefix") return "border-violet-300 bg-violet-100 text-violet-900";
  if (kind === "root") return "border-cyan-300 bg-cyan-100 text-cyan-900";
  if (kind === "suffix") return "border-lime-300 bg-lime-100 text-lime-900";
  return "border-slate-200 bg-slate-50 text-slate-500";
}
