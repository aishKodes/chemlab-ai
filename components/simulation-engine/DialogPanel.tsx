"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function DialogPanel({
  mood = "guide",
  message,
  eyebrow = "Master Alchem",
}: {
  mood?: MasterAlchemMood;
  message: string;
  eyebrow?: string;
}) {
  return (
    <Card className="relative overflow-hidden border-white/80 bg-white/90 p-0 shadow-xl backdrop-blur">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/35 blur-2xl" />
      <div className="relative flex gap-3 p-4">
        <MasterAlchem mood={mood} size="sm" showGlow={false} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <Badge tone={mood === "warning" ? "amber" : mood === "celebrating" ? "green" : "blue"}>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {eyebrow}
            </span>
          </Badge>
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm font-black leading-6 text-slate-750"
          >
            {message}
          </motion.p>
        </div>
      </div>
    </Card>
  );
}
