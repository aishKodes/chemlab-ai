import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { chemistryModules, getModuleBySlug } from "@/data/chemistry-modules";
import { getQuestionsByChapter } from "@/data/sample-questions";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { Container } from "@/components/ui/Container";

type PageProps = {
  params: Promise<{ chapterSlug: string }>;
};

export function generateStaticParams() {
  return chemistryModules.map((module) => ({ chapterSlug: module.quizSlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapterSlug } = await params;
  const chemistryModule = getModuleBySlug(chapterSlug);
  return {
    title: chemistryModule ? `${chemistryModule.title} Quiz` : "Chemistry Quiz",
    description: chemistryModule ? `Practice quiz for ${chemistryModule.title}.` : "ChemLab AI quiz.",
  };
}

export default async function ChapterQuizPage({ params }: PageProps) {
  const { chapterSlug } = await params;
  const chemistryModule = getModuleBySlug(chapterSlug);
  if (!chemistryModule) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Chapter quiz"
        title={`${chemistryModule.title} Quiz`}
        description="Answer each question, submit once, and review explanations for every item."
      />
      <Container className="pb-16">
        <QuizRunner questions={getQuestionsByChapter(chapterSlug)} />
      </Container>
    </>
  );
}
