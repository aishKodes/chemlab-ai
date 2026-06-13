import type { Metadata } from "next";
import { Redox3DStage } from "@/components/labs/redox-transfer-kitchen/Redox3DStage";

export const metadata: Metadata = {
  title: "Redox 3D Debug | Chemlab",
  robots: { index: false, follow: false },
};

export default function Redox3DDebugPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200">Development 3D debug</p>
        <h1 className="mt-3 text-4xl font-black">Electron Transfer Objects</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          This debug view renders zinc, zinc ion, copper ion, copper metal, sulphate spectators, electron particles, charge labels, and the transfer path.
        </p>
        <div className="mt-8 h-[620px]">
          <Redox3DStage levelId="simultaneous_redox" active spectatorStripped />
        </div>
      </div>
    </main>
  );
}
