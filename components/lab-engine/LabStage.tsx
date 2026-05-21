"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LabStage({
  children,
  className,
  label = "Interactive lab stage",
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        "relative min-h-0 flex-1 overflow-hidden rounded-[2rem] border-2 border-white bg-slate-950 shadow-2xl shadow-blue-950/25",
        className,
      )}
    >
      {children}
    </section>
  );
}
