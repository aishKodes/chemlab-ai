import type { Metadata } from "next";
import { BookOpen, FlaskConical, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";

export const metadata: Metadata = {
  title: "Learn",
  description: "Browse chemlearning learning paths and chemistry curriculum modules.",
};

export default function LearnPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning index"
        title="Choose your next chemistry world."
        description="Pick a world, enter a quest, run a lab, and let Chem-Shastri guide the tricky parts."
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
            description="See your XP, badges, mistakes to repair, and the next mission waiting for you."
            icon={<GraduationCap className="h-6 w-6" aria-hidden="true" />}
            action={<Button href="/dashboard" variant="secondary">View dashboard</Button>}
          />
        </div>
        <Card className="mt-6">
          <h2 className="text-xl font-black text-slate-950">Chemistry first</h2>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
            chemlearning starts with chemistry so atoms, reactions, moles, bonding,
            and lab evidence all connect inside one learning adventure.
          </p>
        </Card>
      </Container>
    </>
  );
}
