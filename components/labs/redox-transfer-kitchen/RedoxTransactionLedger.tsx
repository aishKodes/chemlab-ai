import { CheckCircle2, Circle } from "lucide-react";
import type { RedoxGameState } from "./redoxGameState";

const ledgerChecks = [
  ["giverIdentified", "Giver identified"] as const,
  ["receiverIdentified", "Receiver identified"] as const,
  ["electronsTransferred", "Electrons transferred"] as const,
  ["oxidationDetected", "Oxidation detected"] as const,
  ["reductionDetected", "Reduction detected"] as const,
  ["spectatorRemoved", "Spectator removed"] as const,
  ["redoxLinked", "Redox link formed"] as const,
];

export function RedoxTransactionLedger({ state }: { state: RedoxGameState }) {
  return (
    <aside className="rounded-[1.5rem] border border-cyan-100/30 bg-white/12 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100">Redox Transaction Ledger</p>
      <div className="mt-4 grid gap-3">
        <div className="rounded-2xl border border-white/12 bg-slate-950/50 p-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-300">Before</p>
          <div className="mt-2 grid gap-1 text-sm font-bold text-white">
            <span>Zn: neutral giver</span>
            <span>Cu²⁺: needs 2 electrons</span>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-200/20 bg-amber-300/10 p-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-100">Transaction</p>
          <div className="mt-2 grid gap-1 text-sm font-bold text-white">
            <span className={state.ledgerState.electronsTransferred ? "text-lime-200" : ""}>Zn gives 2e⁻</span>
            <span className={state.ledgerState.electronsTransferred ? "text-lime-200" : ""}>Cu²⁺ receives 2e⁻</span>
          </div>
        </div>
        <div className="rounded-2xl border border-lime-200/20 bg-lime-300/10 p-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-100">After</p>
          <div className="mt-2 grid gap-1 text-sm font-bold text-white">
            <span>{state.zincState === "Zn²⁺" ? "Zn²⁺ formed" : "Zn waiting"}</span>
            <span>{state.copperState === "Cu" ? "Cu formed" : "Cu²⁺ waiting"}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {ledgerChecks.map(([key, label]) => {
          const done = state.ledgerState[key];
          return (
            <div key={key} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${done ? "bg-lime-300/18 text-lime-100" : "bg-white/8 text-slate-300"}`}>
              {done ? <CheckCircle2 className="h-4 w-4 text-lime-300" aria-hidden /> : <Circle className="h-4 w-4" aria-hidden />}
              {label}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
