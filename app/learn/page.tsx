import type { Metadata } from "next";
import { BookOpen, FlaskConical, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";

export const metadata: Metadata = {
  title: "Learn",
  description: "Browse ChemLab AI learning paths and chemistry curriculum modules.",
};

export default function LearnPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning index"
        title="Choose a structured chemistry learning path."
        description="ChemLab AI begins with chemistry and is designed to expand into teacher-guided cohorts, visual notes, and adaptive practice."
      />
      <Container className="pb-16">
        <div className="grid gap-4 lg:grid-cols-3">
          <FeatureCard
            title="Chemistry curriculum"
            description="Atomic structure, periodic trends, bonding, mole concept, and reactions with simulations and quizzes connected."
            icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
            action={<Button href="/learn/chemistry">Open chemistry</Button>}
          />
          <FeatureCard
            title="Lab-first practice"
            description="Use simulations before quizzes so the symbolic rules have a visual model behind them."
            icon={<FlaskConical className="h-6 w-6" aria-hidden="true" />}
            action={<Button href="/simulations" variant="secondary">Run simulations</Button>}
          />
          <FeatureCard
            title="Mastery tracking"
            description="Dashboard foundations show progress, mistakes, AI usage, and the next concept to repair."
            icon={<GraduationCap className="h-6 w-6" aria-hidden="true" />}
            action={<Button href="/dashboard" variant="secondary">View dashboard</Button>}
          />
        </div>
        <Card className="mt-6">
          <h2 className="text-xl font-semibold text-white">Future learning areas</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Physics and biology can be added later, but the current product stays
            chemistry-first so the tools, prompts, data model, and simulations
            are academically coherent from day one.
          </p>
        </Card>
      </Container>
    </>
  );
}
