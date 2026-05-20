import { Lightbulb } from "lucide-react";

export function ExplanationBox({ explanation }: { explanation: string }) {
  return (
    <div className="rounded-[1.25rem] border border-cyan-200 bg-cyan-50 p-4">
      <div className="flex gap-3">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200" aria-hidden="true" />
        <p className="text-sm font-medium leading-6 text-slate-700">{explanation}</p>
      </div>
    </div>
  );
}
