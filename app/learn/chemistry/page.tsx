import type { Metadata } from "next";
import { chemistryModules } from "@/data/chemistry-modules";
import { ModuleCard } from "@/components/chemistry/ModuleCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Chemistry Curriculum",
  description: "Structured chemistry modules for ChemLab AI simulations, quizzes, and tools.",
};

export default function ChemistryCurriculumPage() {
  return (
    <>
      <PageHeader
        eyebrow="Chemistry curriculum"
        title="A concept map for atoms, bonds, moles, and reactions."
        description="Each module includes outcomes, prerequisites, visual notes, related simulations, tools, quizzes, and AI tutor context."
      />
      <Container className="pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {chemistryModules.map((module) => (
            <ModuleCard key={module.slug} module={module} />
          ))}
        </div>
      </Container>
    </>
  );
}
