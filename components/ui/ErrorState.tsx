import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function ErrorState({
  title = "Something needs attention",
  description,
  action,
}: {
  title?: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-rose-200 bg-rose-50/85">
      <div className="flex gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-rose-600 shadow-sm">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{description}</p>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </Card>
  );
}
