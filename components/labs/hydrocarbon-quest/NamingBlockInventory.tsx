"use client";

import { motion } from "framer-motion";
import type { DragEvent } from "react";
import type { NamingBlock } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { cn } from "@/lib/utils";

export function NamingBlockInventory({
  blocks,
  selectedBlockId,
  usedBlockIds,
  enabled,
  onSelect,
  compact = false,
}: {
  blocks: NamingBlock[];
  selectedBlockId?: string;
  usedBlockIds: string[];
  enabled: boolean;
  onSelect: (blockId: string) => void;
  compact?: boolean;
}) {
  const used = new Set(usedBlockIds);

  return (
    <section aria-labelledby="naming-blocks" className={cn("rounded-[1.4rem] border-2 border-white bg-white/78 shadow-lg backdrop-blur-md", compact ? "p-2" : "p-3")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="naming-blocks" className="text-sm font-black text-slate-950">
          Name blocks
        </h2>
        {compact ? null : <p className="text-xs font-bold text-slate-600">Tap once to place. Dragging also works.</p>}
      </div>
      <div className={cn("flex flex-wrap gap-2", compact ? "mt-2" : "mt-3")}>
        {blocks.map((block) => {
          const isUsed = used.has(block.id);
          const isSelected = selectedBlockId === block.id;
          return (
            <motion.button
              key={block.id}
              type="button"
              draggable={enabled && !isUsed}
              disabled={!enabled || isUsed}
              onDragStart={(event) => {
                const dragEvent = event as unknown as DragEvent<HTMLButtonElement>;
                dragEvent.dataTransfer.setData("text/plain", block.id);
              }}
              onClick={() => onSelect(block.id)}
              whileHover={enabled && !isUsed ? { y: -3, scale: 1.03 } : undefined}
              whileTap={enabled && !isUsed ? { scale: 0.97 } : undefined}
              className={cn(
                "focus-ring rounded-2xl border-2 text-sm font-black shadow-[0_5px_0_rgba(15,23,42,0.12)] transition",
                compact ? "px-3 py-1.5" : "px-4 py-2",
                getBlockStyle(block.kind),
                isSelected && "ring-4 ring-blue-300",
                isUsed && "cursor-not-allowed opacity-35 grayscale",
                !enabled && "cursor-not-allowed opacity-45",
              )}
            >
              {block.label}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function getBlockStyle(kind: NamingBlock["kind"]) {
  if (kind === "rank") return "border-amber-300 bg-amber-100 text-amber-900";
  if (kind === "prefix") return "border-violet-300 bg-violet-100 text-violet-900";
  if (kind === "root") return "border-cyan-300 bg-cyan-100 text-cyan-900";
  if (kind === "suffix") return "border-lime-300 bg-lime-100 text-lime-900";
  return "border-slate-200 bg-white text-slate-500";
}
