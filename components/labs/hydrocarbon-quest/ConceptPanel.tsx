import type { ReactNode } from "react";

export function ConceptPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="rounded-[1.4rem] border border-white/70 bg-white/88 p-4 text-slate-900 shadow-lg backdrop-blur-md">
      <h2 className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">{title}</h2>
      <div className="mt-3 text-sm font-bold leading-6 text-slate-700">{children}</div>
    </aside>
  );
}
