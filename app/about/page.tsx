import type { Metadata } from "next";
import { GraduationCap, Microscope, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { MasterAlchemBubble } from "@/components/master-alchem/MasterAlchemBubble";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";

export const metadata: Metadata = {
  title: "Academic Mission",
  description: "The academic mission behind Chemlab.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Academic mission"
        title="Delightful chemistry can still be rigorous."
        description="Chemlab turns models, quantities, evidence, and careful reasoning into a colourful world students want to explore."
      />
      <Container className="pb-16">
        <div className="grid gap-4 lg:grid-cols-3">
          <FeatureCard
            title="Model before memorization"
            description="Students see atoms, ions, reactions, and mole quantities as manipulable systems before memorizing formulas."
            icon={<Microscope className="h-6 w-6" aria-hidden="true" />}
          />
          <FeatureCard
            title="Active learning"
            description="Simulations, quizzes, explanations, and mistake review form one loop rather than disconnected study activities."
            icon={<GraduationCap className="h-6 w-6" aria-hidden="true" />}
          />
          <FeatureCard
            title="Safe guidance"
            description="Master Alchem keeps chemistry focused on learning, evidence, and safe theory instead of risky real-world instructions."
            icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
          />
        </div>
        <MasterAlchemBubble
          mood="idle"
          eyebrow="Mentor philosophy"
          message="Master Alchem is designed to feel warm and magical, but his teaching style stays precise: evidence first, safe theory, clear steps, and no shame when students are wrong."
          className="mt-6"
        />
        <Card className="mt-6">
          <h2 className="text-2xl font-black text-slate-950">Built for access</h2>
          <p className="mt-4 max-w-3xl text-sm font-medium leading-6 text-slate-600">
            Chemlab is designed to be useful before a school buys anything:
            students can explore worlds, run labs, practice quizzes, and ask for
            guidance as the learning universe grows.
          </p>
        </Card>
      </Container>
    </>
  );
}
