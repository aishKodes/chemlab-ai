"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function DaniellCellDialogue({
  eyebrow,
  title,
  message,
  prompt,
  mood,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  message: string;
  prompt?: string;
  mood: MasterAlchemMood;
  compact?: boolean;
}) {
  return (
    <motion.aside
      key={`${title}-${message}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border-2 border-white bg-white/88 p-4 shadow-2xl backdrop-blur-md",
        compact ? "lg:max-w-md" : "",
      )}
      aria-live="polite"
    >
      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-cyan-200/55 blur-2xl" />
      <div className="relative grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <MasterAlchem mood={mood} size="sm" showGlow className="mx-auto" />
        <div>
          <Badge tone={mood === "warning" ? "amber" : mood === "celebrating" ? "green" : "cyan"}>{eyebrow}</Badge>
          <h2 className="mt-3 text-xl font-black text-slate-950">{title}</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{message}</p>
          {prompt ? (
            <p className="mt-3 flex gap-2 rounded-2xl bg-blue-50 px-3 py-2 text-sm font-black leading-5 text-blue-800">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {prompt}
            </p>
          ) : null}
        </div>
      </div>
    </motion.aside>
  );
}
