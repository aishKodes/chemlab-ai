import { Database, FileQuestion, Gauge, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";

export function AdminShell() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Published chapters" value="5" detail="Worlds ready for review" icon={<Database className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Question bank" value="15" detail="Practice prompts prepared" icon={<FileQuestion className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Mentor activity" value="Ready" detail="Guidance review area" icon={<Gauge className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Roles" value="Scoped" detail="Admin areas stay separated" icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />} />
      </div>

      <Card className="bg-gradient-to-br from-white via-sky-50 to-violet-50">
        <h2 className="text-xl font-black text-slate-950">Admin foundation</h2>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
          This space will help educators shape chapters, questions, lab missions,
          and Master Alchem guidance as Chemlab grows.
        </p>
      </Card>
    </div>
  );
}
