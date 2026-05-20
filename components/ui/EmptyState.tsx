import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center px-6 py-10 text-center">
      {icon ? (
        <div className="mb-4 rounded-lg border border-white/15 bg-white/10 p-3 text-cyan-100">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-2 max-w-lg text-sm font-medium leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </Card>
  );
}
