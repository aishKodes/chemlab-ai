"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CheckpointPanel } from "@/components/labs/basic-concepts-universe/CheckpointPanel";
import { MatterClassificationTree } from "@/components/labs/basic-concepts-universe/MatterClassificationTree";
import { ParticleStateSimulator } from "@/components/labs/basic-concepts-universe/ParticleStateSimulator";
import { matterCheckpoints, matterSamples } from "@/components/labs/basic-concepts-universe/basicConceptsData";
import type { MatterSample, UniverseZoneId } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";
import { trackEvent } from "@/lib/analytics/trackEvent";

type MatterState = "solid" | "liquid" | "gas";

export function MatterWorld({ onComplete }: { onComplete: (zoneId: UniverseZoneId, xp: number) => void }) {
  const [state, setState] = useState<MatterState>("solid");
  const [temperature, setTemperature] = useState(35);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<MatterSample["correctCategory"] | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const sample = matterSamples[sampleIndex];
  const correctSorts = useMemo(() => Number(selectedCategory === sample.correctCategory), [selectedCategory, sample.correctCategory]);
  const correctCheckpoints = useMemo(
    () => matterCheckpoints.filter((checkpoint, index) => answers[index] === checkpoint.answer).length,
    [answers],
  );

  function chooseCategory(category: MatterSample["correctCategory"]) {
    setSelectedCategory(category);
    if (category !== sample.correctCategory) {
      void trackEvent({
        event_type: "simulation",
        event_name: "simulation_mistake",
        page_path: "/labs/basic-concepts-chemistry-universe",
        metadata: { zone: "matter-world", mistakeKey: "matter_classification" },
      });
    }
  }

  function nextSample() {
    setSampleIndex((current) => (current + 1) % matterSamples.length);
    setSelectedCategory(null);
  }

  function complete() {
    void trackEvent({
      event_type: "simulation",
      event_name: "simulation_zone_completed",
      page_path: "/labs/basic-concepts-chemistry-universe",
      metadata: { zone: "matter-world" },
    });
    onComplete("matter-world", 120);
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[2.2rem] border border-white/60 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-700">Objective</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Make matter visible.</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
              Change the state, adjust temperature, then sort the sample into the correct branch of matter.
            </p>
          </div>
          <div className="rounded-2xl bg-blue-100 px-4 py-3 text-sm font-black text-blue-900">
            {correctSorts + correctCheckpoints}/4 checks
          </div>
        </div>

        <div className="mt-5">
          <ParticleStateSimulator state={state} temperature={temperature} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">State controls</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["solid", "liquid", "gas"] as MatterState[]).map((nextState) => (
                <button
                  key={nextState}
                  type="button"
                  onClick={() => setState(nextState)}
                  className={`focus-ring rounded-2xl px-4 py-2 text-sm font-black capitalize transition ${
                    state === nextState ? "bg-blue-700 text-white" : "bg-white text-slate-700"
                  }`}
                >
                  {nextState}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-sm font-black text-slate-800" htmlFor="matter-temperature">
              Temperature energy: {temperature}
            </label>
            <input
              id="matter-temperature"
              type="range"
              min={10}
              max={100}
              value={temperature}
              onChange={(event) => setTemperature(Number(event.target.value))}
              className="mt-2 w-full accent-blue-700"
            />
          </div>
          <MatterClassificationTree sample={sample} selectedCategory={selectedCategory} onSelect={chooseCategory} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={nextSample} className="focus-ring rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm">
            Try another sample
          </button>
          <button
            type="button"
            onClick={complete}
            disabled={correctSorts + correctCheckpoints < 4}
            className="focus-ring inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Complete Matter World
          </button>
        </div>
      </div>
      <CheckpointPanel checkpoints={matterCheckpoints} selectedAnswers={answers} onAnswer={(index, answer) => setAnswers((current) => ({ ...current, [index]: answer }))} />
    </section>
  );
}
