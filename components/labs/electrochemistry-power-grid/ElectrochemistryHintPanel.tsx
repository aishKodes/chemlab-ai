import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ElectrochemistryHintPanel({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-violet-100 bg-white/85 p-4 shadow-lg">
      <div className="flex items-center gap-2 text-sm font-black text-violet-800">
        <BrainCircuit className="h-4 w-4" aria-hidden="true" />
        Chem-Shastri hint
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{message}</p>
      <Button href="/ai-tutor?prompt=Why does Daniell cell voltage change with concentration?" size="sm" variant="secondary" className="mt-3">
        Explain this
      </Button>
    </div>
  );
}
