import { CalendarCheck, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

export function DailyQuestCard() {
  return (
    <Card className="quest-pop bg-gradient-to-br from-lime-100 via-white to-cyan-100">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-300 text-lime-900 shadow-sm">
            <CalendarCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-black uppercase text-lime-700">
              Daily quest
            </p>
            <h3 className="text-xl font-black text-slate-950">Balance 3 reaction puzzles</h3>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 shadow">
          +120 XP
        </span>
      </div>
      <p className="mt-4 text-sm font-medium leading-6 text-slate-600">
        Every formula becomes a visual puzzle. Finish today&apos;s quest to keep your streak glowing.
      </p>
      <div className="mt-5">
        <Progress value={66} label="2 of 3 puzzles" />
      </div>
      <Button
        href="/simulations/equation-balancer"
        className="mt-5"
        icon={<FlaskConical className="h-4 w-4" aria-hidden="true" />}
      >
        Continue quest
      </Button>
    </Card>
  );
}
