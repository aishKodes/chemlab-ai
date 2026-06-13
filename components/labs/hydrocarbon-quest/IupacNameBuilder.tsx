"use client";

import { NamingBlockInventory } from "@/components/labs/hydrocarbon-quest/NamingBlockInventory";
import { NamingSlots } from "@/components/labs/hydrocarbon-quest/NamingSlots";
import type { HydrocarbonLevel, SlotMap } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export function IupacNameBuilder({
  level,
  slots,
  selectedBlockId,
  usedBlockIds,
  failedSlotIds,
  enabled,
  onSelect,
  onPlace,
  onRemove,
}: {
  level: HydrocarbonLevel;
  slots: SlotMap;
  selectedBlockId?: string;
  usedBlockIds: string[];
  failedSlotIds: string[];
  enabled: boolean;
  onSelect: (blockId: string) => void;
  onPlace: (slotId: string, blockId: string) => void;
  onRemove: (slotId: string) => void;
}) {
  return (
    <>
      <NamingBlockInventory blocks={level.availableBlocks} selectedBlockId={selectedBlockId} usedBlockIds={usedBlockIds} enabled={enabled} onSelect={onSelect} compact />
      <NamingSlots level={level} slots={slots} selectedBlockId={selectedBlockId} failedSlotIds={failedSlotIds} enabled={enabled} onPlace={onPlace} onRemove={onRemove} compact />
    </>
  );
}
