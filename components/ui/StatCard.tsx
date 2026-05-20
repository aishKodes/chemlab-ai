import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  className?: string;
};

export function StatCard({ label, value, detail, icon, className }: StatCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>
        {icon ? (
          <div className="rounded-2xl border border-cyan-200 bg-cyan-100 p-2 text-cyan-700">
            {icon}
          </div>
        ) : null}
      </div>
      {detail ? <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{detail}</p> : null}
    </Card>
  );
}
