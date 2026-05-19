import { BarChart3, BrainCircuit, ClipboardCheck, Target } from "lucide-react";
import { chemistryModules } from "@/data/chemistry-modules";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";

const mastery = [72, 58, 41, 34, 26];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Average mastery" value="46%" detail="Across active chemistry modules" icon={<Target className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Quizzes completed" value="7" detail="Local MVP sample history" icon={<ClipboardCheck className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="AI tutor uses" value="18" detail="This week mock usage signal" icon={<BrainCircuit className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Study streak" value="4 days" detail="Future Supabase-backed streaks" icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />} />
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-white">Chapter mastery</h2>
        <div className="mt-5 space-y-4">
          {chemistryModules.map((module, index) => (
            <div key={module.slug}>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-slate-200">{module.title}</span>
                <span className="text-slate-400">{mastery[index]}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-300"
                  style={{ width: `${mastery[index]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold text-white">Recommended next action</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Revisit chemical bonding, then complete the bonding quiz. The current
            progress pattern suggests ionic formulas need another pass before mole ratios.
          </p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-white">Mistake notebook preview</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-300">
            <li>Confused isotope change with element identity in atomic structure.</li>
            <li>Changed subscripts while balancing equations.</li>
            <li>Used grams directly as mole ratios in a stoichiometry prompt.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
