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
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        {icon ? (
          <div className="rounded-lg border border-cyan-200/20 bg-cyan-300/10 p-2 text-cyan-100">
            {icon}
          </div>
        ) : null}
      </div>
      {detail ? <p className="mt-3 text-sm leading-6 text-slate-300">{detail}</p> : null}
    </Card>
  );
}
