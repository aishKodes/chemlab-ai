import type { Metadata } from "next";
import { GraduationCap, Microscope, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";

export const metadata: Metadata = {
  title: "Academic Mission",
  description: "The academic mission behind ChemLab AI.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Academic mission"
        title="ChemLab AI is built for rigorous understanding."
        description="The platform treats chemistry as a system of models, quantities, evidence, and careful reasoning. The design is serious because the subject deserves it."
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
            title="Safe AI foundation"
            description="The tutor is server-routed, rate-limited, chemistry-focused, and instructed to refuse unsafe real-world chemistry requests."
            icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
          />
        </div>
        <Card className="mt-6">
          <h2 className="text-2xl font-semibold text-white">Why start with free infrastructure?</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
            Vercel Free, Supabase Free, and fetch-based AI adapters make the MVP
            deployable without paid platform commitments. The architecture still
            respects production boundaries: private keys stay on the server,
            role-based content management has schema support, and the app works
            with mock data when external services are absent.
          </p>
        </Card>
      </Container>
    </>
  );
}
