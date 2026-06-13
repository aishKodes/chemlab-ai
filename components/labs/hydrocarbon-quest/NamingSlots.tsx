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
  compact = false,
}: {
  level: HydrocarbonLevel;
  slots: SlotMap;
  selectedBlockId?: string;
  failedSlotIds: string[];
  enabled: boolean;
  onPlace: (slotId: string, blockId: string) => void;
  onRemove: (slotId: string) => void;
  compact?: boolean;
}) {
  const placedName = assembleName(level, slots);

  return (
    <section aria-labelledby="naming-slots" className={cn("rounded-[1.4rem] border-2 border-white bg-white/84 shadow-lg backdrop-blur-md", compact ? "p-2" : "p-3")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="naming-slots" className={cn("font-black text-slate-950", compact ? "text-xs" : "text-sm")}>
            Family name slots
          </h2>
          {compact ? null : <p className="mt-1 text-xs font-bold text-slate-600">First Name + Middle Name + Surname</p>}
        </div>
        <motion.div
          key={placedName || "empty"}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("rounded-full bg-slate-950 font-black text-white shadow-lg", compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm")}
        >
          {placedName || "Build the name"}
        </motion.div>
      </div>

      <div className={cn("grid gap-2", compact ? "mt-2 grid-cols-2 xl:grid-cols-4" : "mt-3 sm:grid-cols-2 xl:grid-cols-4")}>
        {level.slots.map((slot) => {
          const blockId = slots[slot.id];
          const block = blockId ? getBlockById(level.availableBlocks, blockId) : undefined;
          const failed = failedSlotIds.includes(slot.id);
          return (
            <motion.div
              key={slot.id}
              animate={failed ? { x: [0, -8, 8, -4, 0] } : undefined}
              role="button"
              tabIndex={enabled && selectedBlockId ? 0 : -1}
              aria-label={`Place selected block in ${slot.label}`}
              className={cn(
                "rounded-[1.2rem] border-2 border-dashed bg-white/72 transition",
                compact ? "min-h-[4.2rem] p-2" : "min-h-[6.25rem] p-3",
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
              onKeyDown={(event) => {
                if (!enabled || !selectedBlockId) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onPlace(slot.id, selectedBlockId);
                }
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-blue-700">{compact ? getCompactSlotLabel(slot.id) : slot.label}</p>
                  {compact ? null : <p className="mt-1 text-xs font-bold leading-4 text-slate-500">{slot.helper}</p>}
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
              {block ? <PlacedBlock block={block} compact={compact} /> : <div className={cn("rounded-2xl bg-slate-50 px-3 py-2 font-black text-slate-400", compact ? "mt-1 text-xs" : "mt-3 text-sm")}>{compact ? "Tap slot" : "Drop here"}</div>}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function getCompactSlotLabel(slotId: string) {
  if (slotId === "rank") return "Rank";
  if (slotId === "ethylRank") return "3-";
  if (slotId === "ethylPrefix") return "Ethyl";
  if (slotId === "methylRank") return "2-";
  if (slotId === "methylPrefix") return "Methyl";
  if (slotId === "doubleRank") return "C=C Seat";
  if (slotId === "prefix") return "Prefix";
  if (slotId === "root") return "Root";
  if (slotId === "suffix") return "Suffix";
  return slotId;
}

function PlacedBlock({ block, compact }: { block: NamingBlock; compact?: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.88, y: 8, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      className={cn("rounded-2xl border-2 text-center font-black shadow-md", compact ? "mt-1 px-2 py-1 text-sm" : "mt-3 px-3 py-2 text-base", blockClass(block.kind))}
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
