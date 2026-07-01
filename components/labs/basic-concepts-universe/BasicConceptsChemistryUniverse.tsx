"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BadgeCheck, Sparkles } from "lucide-react";
import { BasicConceptsHUD } from "@/components/labs/basic-concepts-universe/BasicConceptsHUD";
import { BasicConceptsQuestMap } from "@/components/labs/basic-concepts-universe/BasicConceptsQuestMap";
import { ChemicalLawsCourt } from "@/components/labs/basic-concepts-universe/ChemicalLawsCourt";
import { FormulaDetective } from "@/components/labs/basic-concepts-universe/FormulaDetective";
import { MatterWorld } from "@/components/labs/basic-concepts-universe/MatterWorld";
import { MeasurementLab } from "@/components/labs/basic-concepts-universe/MeasurementLab";
import { MolePortal } from "@/components/labs/basic-concepts-universe/MolePortal";
import { StoichiometryFactory } from "@/components/labs/basic-concepts-universe/StoichiometryFactory";
import { UniverseHub } from "@/components/labs/basic-concepts-universe/UniverseHub";
import { universeZones } from "@/components/labs/basic-concepts-universe/basicConceptsData";
import { playBasicConceptsSound } from "@/components/labs/basic-concepts-universe/basicConceptsSoundHooks";
import type { UniverseZoneId } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";
import { trackEvent } from "@/lib/analytics/trackEvent";

export function BasicConceptsChemistryUniverse() {
  const [activeZoneId, setActiveZoneId] = useState<UniverseZoneId | "hub">("hub");
  const [completed, setCompleted] = useState<UniverseZoneId[]>([]);
  const [xp, setXp] = useState(0);
  const activeZone = useMemo(
    () => universeZones.find((zone) => zone.id === activeZoneId) ?? universeZones[0],
    [activeZoneId],
  );

  useEffect(() => {
    void trackEvent({
      event_type: "simulation",
      event_name: "simulation_opened",
      page_path: "/labs/basic-concepts-chemistry-universe",
      metadata: { simulationSlug: "basic-concepts-chemistry-universe", chapter: "some-basic-concepts-of-chemistry" },
    });
  }, []);

  function openZone(zoneId: UniverseZoneId) {
    setActiveZoneId(zoneId);
    playBasicConceptsSound("zone_open");
    void trackEvent({
      event_type: "simulation",
      event_name: "simulation_zone_started",
      page_path: "/labs/basic-concepts-chemistry-universe",
      metadata: { zone: zoneId },
    });
  }

  function completeZone(zoneId: UniverseZoneId, awardedXp: number) {
    setCompleted((current) => (current.includes(zoneId) ? current : [...current, zoneId]));
    setXp((current) => current + awardedXp);
    playBasicConceptsSound("badge_unlock");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_34%),radial-gradient(circle_at_top_right,#fef3c7,transparent_32%),linear-gradient(135deg,#f8fafc,#ecfeff_46%,#f5f3ff)] px-4 py-5 text-slate-950 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <BasicConceptsHUD
          zone={activeZone}
          xp={xp}
          completedCount={completed.length}
          totalCount={universeZones.filter((zone) => zone.status === "playable").length}
        />

        {activeZoneId !== "hub" ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setActiveZoneId("hub")}
              className="focus-ring inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 text-sm font-black text-slate-800 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to universe hub
            </button>
            <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-black text-slate-700 shadow-sm">
              Chem-Shastri note: learn by seeing, testing, and trying again.
            </div>
          </div>
        ) : null}

        <BasicConceptsQuestMap
          zones={universeZones}
          activeZoneId={activeZone.id}
          completed={completed}
          onSelect={openZone}
        />

        {activeZoneId === "hub" ? <UniverseHub zones={universeZones} onSelect={openZone} /> : null}
        {activeZoneId === "matter-world" ? <MatterWorld onComplete={completeZone} /> : null}
        {activeZoneId === "measurement-lab" ? <MeasurementLab onComplete={completeZone} /> : null}
        {activeZoneId === "mole-portal" ? <MolePortal onComplete={completeZone} /> : null}
        {activeZoneId === "stoichiometry-factory" ? <StoichiometryFactory onComplete={completeZone} /> : null}
        {activeZoneId === "chemical-laws-court" ? <ChemicalLawsCourt /> : null}
        {activeZoneId === "formula-detective" ? <FormulaDetective /> : null}

        {completed.length >= 4 ? (
          <section className="rounded-[2.2rem] border border-green-200 bg-green-50 p-6 shadow-[0_18px_60px_rgba(22,163,74,0.16)]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-3xl bg-green-600 text-white shadow-lg">
                <BadgeCheck className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-green-800">Badge unlocked</p>
                <h2 className="text-2xl font-black text-slate-950">Unit 1 Explorer</h2>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  You completed the first playable Unit 1 path: matter, measurement, mole, and stoichiometry.
                </p>
              </div>
              <Sparkles className="ml-auto h-8 w-8 text-green-700" aria-hidden="true" />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
