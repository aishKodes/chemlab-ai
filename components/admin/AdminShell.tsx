import { Database, FileQuestion, Gauge, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";

export function AdminShell() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Published chapters" value="5" detail="Seed-ready curriculum records" icon={<Database className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Question bank" value="15" detail="Local seed questions for MVP" icon={<FileQuestion className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="AI logs" value="Ready" detail="Server route logs usage when Supabase exists" icon={<Gauge className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="RLS posture" value="Scoped" detail="Role-aware policy foundation" icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />} />
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-white">Admin foundation</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          The MVP keeps admin intentionally thin: content, questions, and AI usage
          have route shells and schema support without exposing service-role
          credentials to the browser.
        </p>
      </Card>
    </div>
  );
}
