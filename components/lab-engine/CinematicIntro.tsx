"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CinematicIntro({
  eyebrow,
  title,
  subtitle,
  lines,
  startLabel,
  onStart,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  lines: Array<{ speaker: string; text: string; highlight?: boolean }>;
  startLabel: string;
  onStart: () => void;
}) {
  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-gradient-to-br from-sky-100 via-white to-violet-100 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.28),transparent_30%),radial-gradient(circle_at_84%_14%,rgba(168,85,247,0.2),transparent_28%)]" />
      <Container className="relative grid min-h-[calc(100svh-8rem)] items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 rounded-[2.35rem] border-2 border-white bg-white/68 p-5 shadow-2xl backdrop-blur-md lg:grid-cols-[1fr_20rem] lg:items-center lg:p-8"
        >
          <div>
            <Badge tone="blue">{eyebrow}</Badge>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] text-slate-950 sm:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-slate-700">{subtitle}</p>
            <div className="mt-7 space-y-3">
              {lines.map((line) => (
                <div
                  key={`${line.speaker}-${line.text}`}
                  className={`rounded-[1.35rem] border-2 p-4 shadow-lg ${line.highlight ? "border-cyan-200 bg-cyan-50" : "border-white bg-white/82"}`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{line.speaker}</p>
                  <p className="mt-2 text-base font-black leading-6 text-slate-800">{line.text}</p>
                </div>
              ))}
            </div>
            <Button onClick={onStart} size="lg" className="mt-8" icon={<Zap className="h-5 w-5" aria-hidden="true" />}>
              {startLabel}
            </Button>
          </div>
          <div className="relative grid min-h-80 place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-950 via-slate-900 to-violet-950 p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.32),transparent_30%),radial-gradient(circle_at_62%_70%,rgba(250,204,21,0.18),transparent_28%)]" />
            <MasterAlchem mood="guide" size="lg" showGlow />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
