import { BrainCircuit, MessageCircle, Sparkles } from "lucide-react";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const modes = ["Explain", "Hint", "Step-by-Step", "Quiz Me", "Exam Mode", "Check My Answer", "Lab Guide"];

export function MasterAlchemCard() {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-white to-violet-100">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-fuchsia-200/55 blur-2xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
        <MasterAlchem mood="guide" size="md" className="shrink-0" />
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-violet-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Master Alchem
          </div>
          <h3 className="mt-4 text-3xl font-black text-slate-950">
            A magical science mentor who helps you think step by step.
          </h3>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-700">
            Master Alchem gives hints before answers, turns calculations into visible
            steps, guides lab thinking, and helps students recover from mistakes
            without shame.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {modes.map((mode) => (
              <span
                key={mode}
                className="rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-black text-blue-700 shadow-sm"
              >
                {mode}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[1.5rem] border-2 border-white bg-white/85 p-4 shadow-lg lg:w-72">
          <div className="flex items-center gap-2 text-sm font-black text-slate-800">
            <MessageCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
            Master Alchem says
          </div>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-700">
            “Predict first: if electrons change but protons stay the same, what changes - identity or charge?”
          </p>
          <Button
            href="/ai-tutor"
            className="mt-4 w-full"
            icon={<BrainCircuit className="h-4 w-4" aria-hidden="true" />}
          >
            Ask Master Alchem
          </Button>
        </div>
      </div>
    </Card>
  );
}
