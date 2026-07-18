import { Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ElectrochemistryHeroIntro({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.35),transparent_35%),linear-gradient(135deg,#020617,#172554_45%,#312e81)] px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Class 12 Electrochemistry</p>
          <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">Electrochemistry Power Grid Studio</h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-blue-100">
            Build a working chemical cell, watch electrons flow, and control voltage with the Nernst equation.
          </p>
          <Button onClick={onStart} className="mt-7" size="lg" icon={<Zap className="h-5 w-5" />}>Start the grid</Button>
        </div>
        <div className="relative min-h-[24rem] rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <div className="absolute left-8 right-8 top-20 h-2 rounded-full bg-cyan-200 shadow-[0_0_40px_rgba(103,232,249,0.95)]" />
          <div className="absolute bottom-10 left-10 h-48 w-32 rounded-b-[3rem] rounded-t-2xl border-4 border-white/55 bg-sky-400/35" />
          <div className="absolute bottom-10 right-10 h-48 w-32 rounded-b-[3rem] rounded-t-2xl border-4 border-white/55 bg-blue-700/35" />
          <div className="absolute left-1/2 top-16 h-24 w-44 -translate-x-1/2 rounded-t-full border-[10px] border-b-0 border-emerald-300" />
          <p className="absolute bottom-7 left-0 right-0 text-center text-sm font-black uppercase tracking-[0.18em] text-cyan-100">{"Zn -> electrons -> Cu"}</p>
        </div>
      </div>
    </section>
  );
}
