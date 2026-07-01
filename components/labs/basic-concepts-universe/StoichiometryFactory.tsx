"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CheckpointPanel } from "@/components/labs/basic-concepts-universe/CheckpointPanel";
import { LimitingReagentGame } from "@/components/labs/basic-concepts-universe/LimitingReagentGame";
import { stoichiometryCheckpoints } from "@/components/labs/basic-concepts-universe/basicConceptsData";
import type { UniverseZoneId } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";
import { trackEvent } from "@/lib/analytics/trackEvent";

export function StoichiometryFactory({ onComplete }: { onComplete: (zoneId: UniverseZoneId, xp: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const correctCheckpoints = useMemo(
    () => stoichiometryCheckpoints.filter((checkpoint, index) => answers[index] === checkpoint.answer).length,
    [answers],
  );

  function complete() {
    void trackEvent({
      event_type: "simulation",
      event_name: "simulation_zone_completed",
      page_path: "/labs/basic-concepts-chemistry-universe",
      metadata: { zone: "stoichiometry-factory" },
    });
    onComplete("stoichiometry-factory", 200);
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[2.2rem] border border-white/60 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">Objective</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Run the balanced-equation machine.</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
              Feed reactant moles into the factory. The balanced equation decides product amount and leftover reactant.
            </p>
          </div>
          <div className="rounded-2xl bg-orange-100 px-4 py-3 text-sm font-black text-orange-900">{correctCheckpoints}/3 checks</div>
        </div>
        <div className="mt-5">
          <LimitingReagentGame />
        </div>
        <button
          type="button"
          onClick={complete}
          disabled={correctCheckpoints < 3}
          className="focus-ring mt-5 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Complete Stoichiometry Factory
        </button>
      </div>
      <CheckpointPanel checkpoints={stoichiometryCheckpoints} selectedAnswers={answers} onAnswer={(index, answer) => setAnswers((current) => ({ ...current, [index]: answer }))} />
    </section>
  );
}
