"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  Maximize2,
  MessageCircle,
  RotateCcw,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { acidBaseMissions } from "./acidBaseMissions";
import { trackEvent } from "@/lib/analytics/trackEvent";
import {
  awardLocalBadge,
  markLabCompleted,
  markLabStarted,
} from "@/lib/progress/labProgress";

const slug = "acid-base-discovery";
const simulation = "/vendor/phet/acid-base-solutions_en.html?initialScreen=1";

export function AcidBaseDiscovery() {
  const [missionIndex, setMissionIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const mission = acidBaseMissions[missionIndex];
  const correct = selected === mission.answer;
  const finished = completed.length === acidBaseMissions.length;

  useEffect(() => {
    markLabStarted(slug);
    void trackEvent({
      event_type: "simulation",
      event_name: "simulation_started",
      page_path: `/labs/${slug}`,
      metadata: { simulationSlug: slug },
    });
  }, []);

  function answer(index: number) {
    if (correct) return;
    setSelected(index);
    const isCorrect = index === mission.answer;
    void trackEvent({
      event_type: "simulation",
      event_name: isCorrect
        ? "simulation_step_completed"
        : "simulation_mistake",
      page_path: `/labs/${slug}`,
      metadata: {
        simulationSlug: slug,
        mission: missionIndex + 1,
        answer: index,
      },
    });
    if (isCorrect && !completed.includes(missionIndex)) {
      const next = [...completed, missionIndex];
      setCompleted(next);
      if (next.length === acidBaseMissions.length) {
        markLabCompleted(slug, 120);
        awardLocalBadge("acid-base-detective");
        void trackEvent({
          event_type: "simulation",
          event_name: "simulation_completed",
          page_path: `/labs/${slug}`,
          metadata: { simulationSlug: slug, xp: 120 },
        });
      }
    }
  }

  return (
    <main className="bg-slate-50 text-slate-950">
      <div
        ref={stage}
        className="mx-auto max-w-[1500px] bg-slate-50 px-3 py-4 sm:px-6 [&:fullscreen]:overflow-y-auto"
      >
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/labs"
              aria-label="Back to labs"
              className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-extrabold sm:text-2xl">
                Acid-Base Discovery
              </h1>
              <p className="text-xs text-slate-500">
                Look closer. Test a prediction. Follow the ions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-2 text-sm font-bold text-teal-700">
              {completed.length}/3 discoveries
            </span>
            <button
              type="button"
              title="Reset the experiment"
              aria-label="Reset the experiment"
              onClick={() => {
                setLoaded(false);
                setFrameKey(frameKey + 1);
              }}
              className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Expand the lab"
              aria-label="Expand the lab"
              onClick={() => {
                if (document.fullscreenElement)
                  void document.exitFullscreen().catch(() => undefined);
                else
                  void stage.current
                    ?.requestFullscreen?.()
                    .catch(() => undefined);
              }}
              className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </header>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section
            aria-label="Interactive acid-base experiment"
            className="min-w-0"
          >
            <div
              className="mb-3 flex gap-1 overflow-x-auto border-b border-slate-200"
              aria-label="Discovery missions"
            >
              {acidBaseMissions.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    setMissionIndex(index);
                    setSelected(
                      completed.includes(index)
                        ? acidBaseMissions[index].answer
                        : null,
                    );
                    setShowHint(false);
                  }}
                  aria-pressed={index === missionIndex}
                  className={`focus-ring inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-bold ${missionIndex === index ? "border-teal-600 text-teal-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                >
                  {completed.includes(index) ? (
                    <CheckCircle2
                      className="h-4 w-4 text-teal-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="text-xs">0{index + 1}</span>
                  )}
                  {item.title}
                </button>
              ))}
            </div>
            <p className="mb-3 flex min-h-10 items-center gap-2 text-sm font-semibold leading-6 text-slate-700">
              <FlaskConical
                className="h-5 w-5 shrink-0 text-teal-600"
                aria-hidden="true"
              />
              {mission.instruction}
            </p>
            <div className="relative h-[min(64dvh,640px)] min-h-[300px] overflow-hidden rounded-lg border border-slate-200 bg-[#e5f6fa]">
              {!loaded && (
                <p
                  role="status"
                  className="absolute inset-0 grid place-items-center text-sm text-slate-600"
                >
                  Opening the experiment…
                </p>
              )}
              <iframe
                key={frameKey}
                title="PhET Acid-Base Solutions interactive simulation"
                src={simulation}
                onLoad={() => setLoaded(true)}
                className="absolute inset-0 h-full w-full border-0"
                sandbox="allow-scripts allow-downloads"
                allow="fullscreen"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-[11px] leading-5 text-slate-500">
              Simulation by{" "}
              <a
                href="https://phet.colorado.edu/en/simulations/acid-base-solutions"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                PhET Interactive Simulations, University of Colorado Boulder
              </a>
              , licensed under{" "}
              <a
                href="https://creativecommons.org/licenses/by-nc/4.0/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                CC BY-NC 4.0
              </a>
              . Original simulation, with a separate chemlearning lesson. Free
              non-commercial educational use.
            </p>
          </section>
          <aside className="flex flex-col border-t border-slate-200 py-4 xl:border-l xl:border-t-0 xl:pl-5">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Check your discovery
            </p>
            <h2 className="mt-3 text-lg font-extrabold leading-7">
              {mission.question}
            </h2>
            <div className="mt-4 grid gap-2">
              {mission.options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  disabled={correct}
                  aria-pressed={selected === index}
                  onClick={() => answer(index)}
                  className={`focus-ring rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${selected === index ? (correct ? "border-teal-500 bg-teal-50 text-teal-900" : "border-amber-400 bg-amber-50 text-amber-900") : "border-slate-200 bg-white hover:border-blue-400"}`}
                >
                  {option}
                </button>
              ))}
            </div>
            {selected !== null && (
              <div
                role="status"
                className={`mt-4 border-l-2 pl-3 text-sm leading-6 ${correct ? "border-teal-500 text-teal-900" : "border-amber-500 text-amber-900"}`}
              >
                <p className="font-bold">
                  {correct ? "That’s the idea." : "A clue for your next try"}
                </p>
                <p className="mt-1">
                  {correct ? mission.explanation : mission.hint}
                </p>
              </div>
            )}
            {!correct && (
              <button
                type="button"
                onClick={() => {
                  setShowHint(!showHint);
                  if (!showHint)
                    void trackEvent({
                      event_type: "simulation",
                      event_name: "simulation_hint_used",
                      metadata: {
                        simulationSlug: slug,
                        mission: missionIndex + 1,
                      },
                    });
                }}
                className="focus-ring mt-4 self-start text-sm font-bold text-blue-700"
              >
                {showHint ? "Hide clue" : "I need a clue"}
              </button>
            )}
            {showHint && !correct && (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {mission.hint}
              </p>
            )}
            {correct && missionIndex < 2 && (
              <button
                type="button"
                onClick={() => {
                  setMissionIndex(missionIndex + 1);
                  setSelected(
                    completed.includes(missionIndex + 1)
                      ? acidBaseMissions[missionIndex + 1].answer
                      : null,
                  );
                  setShowHint(false);
                }}
                className="focus-ring mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-bold text-white"
              >
                Next discovery{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            {finished && (
              <div role="status" className="mt-5 border-y border-teal-200 py-4">
                <Trophy className="h-8 w-8 text-amber-500" aria-hidden="true" />
                <h3 className="mt-2 font-extrabold">Acid-Base Detective</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Three discoveries complete. +120 XP saved on this device.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCompleted([]);
                    setMissionIndex(0);
                    setSelected(null);
                    setShowHint(false);
                  }}
                  className="focus-ring mt-3 text-sm font-bold text-teal-700"
                >
                  Try the discoveries again
                </button>
              </div>
            )}
            <div className="mt-auto pt-8">
              <Link
                href="/ai-tutor?prompt=Explain%20the%20difference%20between%20acid%20strength%20and%20concentration"
                className="focus-ring flex items-center gap-2 text-sm font-bold text-blue-700"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask
                Chem-Shastri
              </Link>
              <a
                href={simulation}
                target="_blank"
                rel="noreferrer"
                className="focus-ring mt-3 inline-flex items-center gap-2 text-xs text-slate-500"
              >
                Open experiment in its own window{" "}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
