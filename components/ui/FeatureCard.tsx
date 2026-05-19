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
      <div className="mb-5 inline-flex rounded-lg border border-cyan-200/20 bg-cyan-300/10 p-3 text-cyan-100">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}
