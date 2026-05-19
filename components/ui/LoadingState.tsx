import { Atom } from "lucide-react";

export function LoadingState({ label = "Loading lab data" }: { label?: string }) {
  return (
    <div className="flex min-h-56 items-center justify-center">
      <div className="glass-panel flex items-center gap-3 rounded-lg px-5 py-4 text-sm text-slate-200">
        <Atom className="h-5 w-5 animate-spin text-cyan-200" aria-hidden="true" />
        <span>{label}</span>
      </div>
    </div>
  );
}
