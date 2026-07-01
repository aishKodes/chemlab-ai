import { Atom } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.2),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.16),transparent_30%),linear-gradient(135deg,#fff7ed,#eff6ff_48%,#f5f3ff)]" />
      <Container className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/75 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm">
            <Atom className="h-3.5 w-3.5" aria-hidden="true" />
            {eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-xl text-base font-semibold leading-8 text-slate-700">{description}</p>
          <div className="mt-8 grid max-w-xl gap-3 text-sm font-bold text-slate-700 sm:grid-cols-3">
            {["Safe accounts", "Role-aware dashboards", "Labs stay open"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border-2 border-white bg-white/86 p-5 shadow-2xl shadow-blue-950/12 backdrop-blur">
          {children}
        </div>
      </Container>
    </section>
  );
}
