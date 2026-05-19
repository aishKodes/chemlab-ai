import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { chemistryModules } from "@/data/chemistry-modules";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Quizzes",
  description: "Mastery quizzes for ChemLab AI chemistry chapters.",
};

export default function QuizIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mastery quizzes"
        title="Check understanding with chemistry-focused feedback."
        description="Each quiz uses local sample questions for the MVP and can save attempts when Supabase auth is connected."
      />
      <Container className="pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {chemistryModules.map((module) => (
            <Link key={module.slug} href={`/quiz/${module.quizSlug}`} className="focus-ring rounded-lg">
              <Card interactive className="h-full">
                <div className="flex items-start justify-between gap-4">
                  <ClipboardCheck className="h-6 w-6 text-cyan-200" aria-hidden="true" />
                  <Badge tone={module.difficulty === "Foundation" ? "green" : "amber"}>
                    {module.difficulty}
                  </Badge>
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">{module.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Practice questions with immediate explanations and a mastery signal.
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
