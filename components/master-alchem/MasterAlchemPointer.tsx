"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";
import { cn } from "@/lib/utils";

type MasterAlchemPointerProps = {
  mood?: MasterAlchemMood;
  title: string;
  message: string;
  href?: string;
  cta?: string;
  className?: string;
};

export function MasterAlchemPointer({
  mood = "idle",
  title,
  message,
  href,
  cta = "Follow guidance",
  className,
}: MasterAlchemPointerProps) {
  const content = (
    <div
      className={cn(
        "focus-ring group relative overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-br from-sky-100 via-white to-amber-100 p-4 shadow-xl transition hover:-translate-y-1",
        className,
      )}
    >
      <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-violet-300/40 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <MasterAlchem mood={mood} size="sm" />
        <div>
          <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-blue-700">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
            Master Alchem
          </div>
          <h3 className="mt-3 text-lg font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{message}</p>
          {href ? (
            <span className="mt-3 inline-flex items-center gap-2 text-sm font-black text-blue-700">
              {cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
