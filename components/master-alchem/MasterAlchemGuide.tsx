"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Compass, EyeOff, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import { getMasterAlchemScript } from "@/components/master-alchem/masterAlchemScripts";
import { cn } from "@/lib/utils";

export function MasterAlchemGuide() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const script = getMasterAlchemScript(pathname);
  const explainHref = `/ai-tutor?prompt=${encodeURIComponent(script.explainPrompt)}`;
  const isLabRoute = pathname.startsWith("/labs") || pathname.startsWith("/simulations");
  const simulationCompactMode = pathname.startsWith("/labs/redox-transfer-kitchen") || pathname.startsWith("/labs/hydrocarbon-naming-quest");
  const placement = isLabRoute ? "lab-safe" : "bottom-right";

  if (pathname.startsWith("/admin") || pathname.startsWith("/dev")) {
    return null;
  }

  if (simulationCompactMode) {
    return (
      <aside
        aria-label="Master Alchem compact guide"
        data-placement="simulation-compact"
        className="pointer-events-none fixed bottom-[84px] right-3 z-30 sm:bottom-24"
      >
        <Link
          href={explainHref}
          title="Ask Master Alchem"
          aria-label="Ask Master Alchem"
          className="group pointer-events-auto grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-white/92 shadow-xl shadow-blue-950/18 backdrop-blur transition hover:-translate-y-0.5 hover:bg-cyan-50 sm:h-10 sm:w-10"
        >
          <MasterAlchem mood={script.mood} size="xs" showGlow={false} className="scale-[0.66]" />
          <span className="pointer-events-none absolute right-11 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white shadow-lg group-hover:block">
            Ask Master Alchem
          </span>
        </Link>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Master Alchem page guide"
      data-placement={placement}
      className={cn(
        "pointer-events-none fixed z-30 w-[min(20rem,calc(100vw-1.5rem))]",
        isLabRoute
          ? "bottom-24 left-3 sm:bottom-28 sm:left-5 lg:bottom-6"
          : "bottom-4 right-4 sm:bottom-5 sm:right-5",
      )}
    >
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key={script.route}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="pointer-events-auto overflow-hidden rounded-[1.55rem] border-2 border-white bg-white/92 shadow-2xl shadow-blue-900/15 backdrop-blur-xl"
          >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/35 blur-2xl" />
            <div className="relative flex gap-3 p-3 sm:p-4">
              <MasterAlchem mood={script.mood} size="xs" showGlow={false} className="shrink-0" />
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
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-3 text-sm font-bold leading-5 text-slate-700">{script.message}</p>
                <div className="mt-4 grid gap-2">
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
              "focus-ring pointer-events-auto flex items-center gap-2 rounded-full border-2 border-white bg-white/94 p-1.5 pr-3 text-sm font-black text-blue-700 shadow-2xl backdrop-blur",
              !isLabRoute && "ml-auto",
            )}
            onClick={() => setExpanded(true)}
            aria-label="Open Master Alchem guide"
          >
            <MasterAlchem mood={script.mood} size="xs" showGlow={false} />
            Ask Master Alchem
            <ChevronDown className="h-4 w-4 rotate-180" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </aside>
  );
}
