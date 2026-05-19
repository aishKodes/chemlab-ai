import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function ExplanationBox({ explanation }: { explanation: string }) {
  return (
    <Card className="border-cyan-200/20 bg-cyan-300/8">
      <div className="flex gap-3">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200" aria-hidden="true" />
        <p className="text-sm leading-6 text-slate-200">{explanation}</p>
      </div>
    </Card>
  );
}
