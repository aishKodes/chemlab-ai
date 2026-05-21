"use client";

export function EquationOverlay({ title, equation }: { title: string; equation: string }) {
  return (
    <div className="rounded-[1.1rem] border border-white/30 bg-slate-950/68 px-4 py-3 text-white shadow-xl backdrop-blur-md">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100">{title}</p>
      <p className="mt-1 text-lg font-black">{equation}</p>
    </div>
  );
}
