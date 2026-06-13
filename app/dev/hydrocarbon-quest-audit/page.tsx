import fs from "node:fs";
import path from "node:path";
import { buildMolecule3D } from "@/components/labs/hydrocarbon-quest/3d/MoleculeGeometryBuilder";
import { calculateFormulaCounts, formatChemicalFormula, formulaCountsToString, parseFormulaCounts } from "@/components/labs/hydrocarbon-quest/3d/labelUtils";
import { hydrocarbonQuestLevels } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestData";

export const metadata = {
  title: "Hydrocarbon Quest Audit | Chemlab",
  description: "Development audit for Hydrocarbon Naming Quest labels, validation, and sound readiness.",
};

const expectedSoundFiles = [
  "click_atom.mp3",
  "hover_atom.mp3",
  "trace_success.mp3",
  "wrong_choice.mp3",
  "block_pick.mp3",
  "block_snap.mp3",
  "forge_success.mp3",
  "level_complete.mp3",
  "badge_unlock.mp3",
  "soft_whoosh.mp3",
  "camera_reset.mp3",
];

export default function HydrocarbonQuestAuditPage() {
  const soundDirectory = path.join(process.cwd(), "public/sounds/hydrocarbon-quest");
  const soundFiles = expectedSoundFiles.map((file) => ({
    file,
    exists: fs.existsSync(path.join(soundDirectory, file)),
  }));
  const playableLevels = hydrocarbonQuestLevels.filter((level) => level.status === "playable");
  const auditedLevels = hydrocarbonQuestLevels.map((level) => {
    const built = buildMolecule3D(level);
    const generatedFormula = formulaCountsToString(calculateFormulaCounts(built));
    const expectedFormula = formulaCountsToString(parseFormulaCounts(level.formula));
    return {
      level,
      built,
      generatedFormula,
      expectedFormula,
    };
  });
  const brokenLevels = auditedLevels.filter((entry) => entry.built.warnings.length > 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Development audit</p>
        <h1 className="mt-3 text-4xl font-black">Hydrocarbon Quest Audit</h1>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-cyan-50/80">
          A quick control room for label status, molecule validation, sound readiness, and playable level health.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <AuditCard label="Playable levels" value={String(playableLevels.length)} tone="cyan" />
          <AuditCard label="Validation warnings" value={String(brokenLevels.reduce((sum, entry) => sum + entry.built.warnings.length, 0))} tone={brokenLevels.length ? "amber" : "emerald"} />
          <AuditCard label="Sound files found" value={`${soundFiles.filter((file) => file.exists).length}/${soundFiles.length}`} tone="violet" />
          <AuditCard label="Procedural fallback" value="Enabled" tone="emerald" />
        </div>

        <section className="mt-6 rounded-[1.6rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-black">Label system status</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              "Atom labels use a separate camera-facing layer.",
              "Locant badges use upper-right offsets and collision nudges.",
              "Measurement labels appear only in Measurement View.",
              "Chemical formula labels use Unicode subscripts.",
              "Student gameplay hides technical warnings in production.",
              "Mobile can switch to Clean View to reduce label density.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-cyan-200/20 bg-slate-950/45 p-3 text-sm font-bold text-cyan-50">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[1.6rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-black">Sound system status</h2>
          <p className="mt-2 text-sm font-bold text-cyan-50/75">
            Local sound files are optional. Missing files are handled by soft procedural Web Audio sounds after the first user interaction.
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {soundFiles.map((item) => (
              <div key={item.file} className={`rounded-xl px-3 py-2 text-xs font-black ${item.exists ? "bg-emerald-300/18 text-emerald-100" : "bg-amber-300/18 text-amber-100"}`}>
                {item.file}: {item.exists ? "found" : "procedural fallback"}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[1.6rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-black">Playable levels</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {auditedLevels
              .filter((entry) => entry.level.status === "playable")
              .map((entry) => (
                <article key={entry.level.id} className="rounded-2xl border border-white/15 bg-white/90 p-4 text-slate-950 shadow-xl">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black">{entry.level.targetName}</h3>
                      <p className="mt-1 text-xs font-bold text-slate-600">{entry.level.title}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${entry.built.warnings.length ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`}>
                      {entry.built.warnings.length ? `${entry.built.warnings.length} warnings` : "valid"}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs font-black sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 px-3 py-2">Expected: {formatChemicalFormula(entry.expectedFormula)}</div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">Generated: {formatChemicalFormula(entry.generatedFormula)}</div>
                  </div>
                  {entry.built.warnings.length ? (
                    <ul className="mt-3 space-y-1 text-xs font-bold text-amber-900">
                      {entry.built.warnings.map((warning, index) => (
                        <li key={`${entry.level.id}-${warning.code}-${index}`} className="rounded-xl bg-amber-50 px-3 py-2">
                          {warning.message}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function AuditCard({ label, value, tone }: { label: string; value: string; tone: "cyan" | "violet" | "emerald" | "amber" }) {
  const toneClass = {
    cyan: "from-cyan-200 to-blue-200 text-blue-950",
    violet: "from-violet-200 to-fuchsia-200 text-violet-950",
    emerald: "from-emerald-200 to-lime-200 text-emerald-950",
    amber: "from-amber-200 to-orange-200 text-amber-950",
  }[tone];

  return (
    <div className={`rounded-[1.4rem] bg-gradient-to-br ${toneClass} p-4 shadow-xl`}>
      <p className="text-xs font-black uppercase tracking-[0.14em] opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
