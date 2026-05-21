import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import { chemistryModules } from "@/data/chemistry-modules";
import { BossBattleCard } from "@/components/gamification/BossBattleCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { MasterAlchemBubble } from "@/components/master-alchem/MasterAlchemBubble";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Battle Arena",
  description: "Boss battle chemistry quizzes with XP, explanations, streaks, and mastery feedback.",
};

export default function QuizIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Battle Arena"
        title="Battle Arena"
        description="Every boss battle checks real understanding, explains every answer, and turns weak concepts into monsters you can defeat."
      />
      <Container className="pb-16">
        <MasterAlchemBubble
          compact
          mood="celebrating"
          eyebrow="Battle briefing"
          message="A boss battle is not a judgment. It is a signal. Win XP for what you know, then send weak spots to the Mistake Lab."
          actionLabel="Warm up with a hint"
          actionHref="/ai-tutor"
          className="mb-6"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {chemistryModules.map((module, index) => (
            <BossBattleCard
              key={module.slug}
              title={`${module.title} Boss`}
              chapter={module.title}
              hp={[78, 63, 71, 82, 88][index] ?? 70}
              xp={[160, 180, 220, 240, 260][index] ?? 180}
              href={`/quiz/${module.quizSlug}`}
            />
          ))}
        </div>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-blue-700 shadow">
          <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
          Pick a battle, answer carefully, and send weak spots to the Mistake Lab.
        </div>
      </Container>
    </>
  );
}
