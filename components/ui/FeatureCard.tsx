import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  action?: ReactNode;
};

export function FeatureCard({ title, description, icon, action }: FeatureCardProps) {
  return (
    <Card interactive className="h-full">
      <div className="mb-5 inline-flex rounded-2xl border border-cyan-200 bg-cyan-100 p-3 text-cyan-700">
        {icon}
      </div>
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}
