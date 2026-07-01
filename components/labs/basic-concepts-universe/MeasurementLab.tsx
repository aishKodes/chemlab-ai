"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CheckpointPanel } from "@/components/labs/basic-concepts-universe/CheckpointPanel";
import { PrecisionAccuracyTarget } from "@/components/labs/basic-concepts-universe/PrecisionAccuracyTarget";
import { ScientificNotationZoom } from "@/components/labs/basic-concepts-universe/ScientificNotationZoom";
import { SignificantFiguresJudge } from "@/components/labs/basic-concepts-universe/SignificantFiguresJudge";
import { UnitConversionBridge } from "@/components/labs/basic-concepts-universe/UnitConversionBridge";
import { measurementCheckpoints } from "@/components/labs/basic-concepts-universe/basicConceptsData";
import type { UniverseZoneId } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";
import { trackEvent } from "@/lib/analytics/trackEvent";

export function MeasurementLab({ onComplete }: { onComplete: (zoneId: UniverseZoneId, xp: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const correctCheckpoints = useMemo(
    () => measurementCheckpoints.filter((checkpoint, index) => answers[index] === checkpoint.answer).length,
    [answers],
  );

  function complete() {
    void trackEvent({
      event_type: "simulation",
      event_name: "simulation_zone_completed",
      page_path: "/labs/basic-concepts-chemistry-universe",
      metadata: { zone: "measurement-lab" },
    });
    onComplete("measurement-lab", 140);
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[2.2rem] border border-white/60 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Objective</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Make every measurement trustworthy.</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
              Zoom across powers of ten, judge significant figures, compare target patterns, and convert units with the factor-label bridge.
            </p>
          </div>
          <div className="rounded-2xl bg-violet-100 px-4 py-3 text-sm font-black text-violet-900">{correctCheckpoints}/3 checks</div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <ScientificNotationZoom />
          <SignificantFiguresJudge />
          <PrecisionAccuracyTarget />
          <UnitConversionBridge />
        </div>
        <button
          type="button"
          onClick={complete}
          disabled={correctCheckpoints < 3}
          className="focus-ring mt-5 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Complete Measurement Lab
        </button>
      </div>
      <CheckpointPanel checkpoints={measurementCheckpoints} selectedAnswers={answers} onAnswer={(index, answer) => setAnswers((current) => ({ ...current, [index]: answer }))} />
    </section>
  );
}
