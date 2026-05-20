"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Compass, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import { getMasterAlchemScript } from "@/components/master-alchem/masterAlchemScripts";
import { cn } from "@/lib/utils";

export function MasterAlchemGuide() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const script = getMasterAlchemScript(pathname);
  const explainHref = `/ai-tutor?prompt=${encodeURIComponent(script.explainPrompt)}`;

  return (
    <aside
      aria-label="Master Alchem page guide"
      className="fixed bottom-4 right-4 z-40 w-[min(24rem,calc(100vw-2rem))] sm:bottom-5 sm:right-5"
    >
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key={script.route}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="overflow-hidden rounded-[1.8rem] border-2 border-white bg-white/90 shadow-2xl shadow-blue-900/15 backdrop-blur-xl"
          >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/35 blur-2xl" />
            <div className="relative flex gap-3 p-4">
              <MasterAlchem mood={script.mood} size="sm" showGlow={false} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                    {script.label}
                  </div>
                  <button
                    type="button"
                    className="focus-ring grid h-8 w-8 place-items-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-blue-50"
                    aria-label="Collapse Master Alchem guide"
                    onClick={() => setExpanded(false)}
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-3 text-sm font-bold leading-6 text-slate-700">{script.message}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Link
                    href={script.nextHref}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-3 py-2 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-500"
                  >
                    <Compass className="h-4 w-4" aria-hidden="true" />
                    {script.nextLabel}
                  </Link>
                  <Link
                    href={explainHref}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-black text-violet-800 transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Explain this page
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            type="button"
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.9 }}
            className={cn(
              "focus-ring ml-auto flex items-center gap-2 rounded-full border-2 border-white bg-white/92 p-2 pr-4 text-sm font-black text-blue-700 shadow-2xl backdrop-blur",
            )}
            onClick={() => setExpanded(true)}
            aria-label="Open Master Alchem guide"
          >
            <MasterAlchem mood={script.mood} size="sm" showGlow={false} className="h-14 w-14" />
            Ask Master Alchem
          </motion.button>
        )}
      </AnimatePresence>
    </aside>
  );
}

