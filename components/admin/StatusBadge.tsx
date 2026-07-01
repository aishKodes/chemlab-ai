"use client";

import { Badge } from "@/components/ui/Badge";

export function StatusBadge({ status }: { status?: string | null }) {
  const value = status ?? "unknown";
  const tone =
    value === "published" || value === "active" || value === "verified" || value === "sent"
      ? "green"
      : value === "draft" || value === "pending" || value === "queued"
        ? "amber"
        : value === "blocked" || value === "deleted" || value === "failed" || value === "archived"
          ? "rose"
          : "slate";

  return <Badge tone={tone}>{value}</Badge>;
}
