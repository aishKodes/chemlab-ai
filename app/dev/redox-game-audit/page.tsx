import type { Metadata } from "next";
import { redoxAssetManifest, redoxAssetRoles } from "@/components/labs/redox-transfer-kitchen/redoxAssetManifest";
import { redoxAgentQuestions, redoxLevels, redoxStoryFrames } from "@/components/labs/redox-transfer-kitchen/redoxQuestData";
import { initialRedoxGameState, redoxSuccessConditions } from "@/components/labs/redox-transfer-kitchen/redoxGameState";

export const metadata: Metadata = {
  title: "Redox Game Audit | chemlearning",
  robots: { index: false, follow: false },
};

const soundEvents = [
  "murukku_transfer_start",
  "murukku_received",
  "electron_release",
  "electron_travel",
  "ion_transform",
  "correct_answer",
  "wrong_answer_soft",
  "ledger_check",
  "level_complete",
  "badge_unlock",
  "transition_whoosh",
];

const levelRepairStatus = {
  murukku_transaction: "works: one button, counter transaction, no 3D dependency",
  electron_transaction: "works: two electron coins move left-to-right outside 3D",
  oxidation_gate: "works: answer gate checks oxidation",
  reduction_gate: "works: answer gate checks reduction",
  spectator_cleanup: "works: spectator appears after electron transfer",
  simultaneous_redox: "works: run reaction reveals both labels together",
  agents_challenge: "works: four sequential agent checks",
};

export default function RedoxGameAuditPage() {
  const unsafeAssets = redoxAssetRoles.filter((role) => redoxAssetManifest[role].checkerboardSuspected);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">Development audit</p>
        <h1 className="mt-3 text-4xl font-black">Redox Transfer Kitchen Repair Audit</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          This page records the repaired learning flow: transaction table first, optional 3D exploration second, compact Chem-Shastri launcher, and reducer-based success conditions.
        </p>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <article className="rounded-[2rem] border border-white/12 bg-white/8 p-5">
            <h2 className="text-2xl font-black">State machine</h2>
            <dl className="mt-4 grid gap-2 text-sm font-semibold text-slate-200">
              <div>currentLevelIndex: {initialRedoxGameState.currentLevelIndex}</div>
              <div>currentStep: {initialRedoxGameState.currentStep}</div>
              <div>mode: {initialRedoxGameState.mode}</div>
              <div>isAnimating: {String(initialRedoxGameState.isAnimating)}</div>
              <div>3D orbit controls disabled by default</div>
            </dl>
          </article>
          <article className="rounded-[2rem] border border-white/12 bg-white/8 p-5">
            <h2 className="text-2xl font-black">Layout warnings</h2>
            <div className="mt-4 grid gap-2 text-sm font-semibold text-lime-100">
              <div className="rounded-2xl bg-lime-300/12 px-3 py-2">No central 3D orbit scene in default learning mode.</div>
              <div className="rounded-2xl bg-lime-300/12 px-3 py-2">Action tray stays below the board.</div>
              <div className="rounded-2xl bg-lime-300/12 px-3 py-2">Chem-Shastri compact launcher: right edge, bottom safe area.</div>
              <div className="rounded-2xl bg-lime-300/12 px-3 py-2">Long explanation is moved into Why drawer.</div>
            </div>
          </article>
          <article className="rounded-[2rem] border border-white/12 bg-white/8 p-5">
            <h2 className="text-2xl font-black">Assets</h2>
            <p className="mt-2 text-slate-300">{redoxAssetRoles.length} roles mapped. {unsafeAssets.length} raw character cutouts had checkerboard suspicion and use processed files.</p>
            <div className="mt-4 max-h-48 space-y-2 overflow-auto pr-1">
              {redoxAssetRoles.map((role) => (
                <div key={role} className="rounded-2xl bg-white/8 px-3 py-2 text-xs font-semibold">
                  {role} → {redoxAssetManifest[role].usedIn}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/12 bg-white/8 p-5">
          <h2 className="text-2xl font-black">Levels and success conditions</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {redoxLevels.map((level, index) => (
              <article key={level.id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-black">
                    {index + 1}. {level.title}
                  </h3>
                  <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-cyan-950">{level.xp} XP</span>
                </div>
                <p className="mt-2 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-black text-amber-100">Level id: {level.id}</p>
                <p className="mt-2 text-sm font-semibold text-slate-300">{level.objective}</p>
                <p className="mt-3 rounded-2xl bg-white/8 px-3 py-2 text-sm font-bold text-cyan-100">Success: {redoxSuccessConditions[level.id]}</p>
                <p className="mt-2 rounded-2xl bg-lime-300/12 px-3 py-2 text-sm font-bold text-lime-100">{levelRepairStatus[level.id]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-white/12 bg-white/8 p-5">
            <h2 className="text-2xl font-black">Story and challenge coverage</h2>
            <p className="mt-2 text-slate-300">{redoxStoryFrames.length} story frames. {redoxAgentQuestions.length} agent questions.</p>
            <div className="mt-4 space-y-2">
              {redoxStoryFrames.map((frame) => (
                <div key={frame.id} className="rounded-2xl bg-white/8 px-3 py-2 text-sm font-semibold">
                  {frame.id}: {frame.speaker} · {frame.overlay ?? "image"}
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-[2rem] border border-white/12 bg-white/8 p-5">
            <h2 className="text-2xl font-black">Sound status</h2>
            <p className="mt-2 text-slate-300">Optional files no-op safely; procedural Web Audio fallback is available after user interaction.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {soundEvents.map((sound) => (
                <span key={sound} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
                  {sound}
                </span>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
