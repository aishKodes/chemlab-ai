import { Award, BarChart3, Beaker, Flame, MessageCircle, Trophy, WandSparkles } from "lucide-react";
import { chemistryModules } from "@/data/chemistry-modules";
import { DailyQuestCard } from "@/components/gamification/DailyQuestCard";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { MistakeMonsterCard } from "@/components/gamification/MistakeMonsterCard";
import { XpBar } from "@/components/gamification/XpBar";
import { MasterAlchemBubble } from "@/components/master-alchem/MasterAlchemBubble";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { StatCard } from "@/components/ui/StatCard";

const mastery = [72, 58, 41, 34, 26];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total XP" value="2,840" detail="740 XP until next level" icon={<Trophy className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Study streak" value="4 days" detail="Keep your flame glowing" icon={<Flame className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Labs completed" value="6" detail="2 practicals this week" icon={<Beaker className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Chem-Shastri" value="18 hints" detail="Mentor activity" icon={<MessageCircle className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Monsters left" value="3" detail="Defeat with practice loops" icon={<WandSparkles className="h-5 w-5" aria-hidden="true" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <DailyQuestCard />
        <Card className="bg-gradient-to-br from-white via-sky-50 to-violet-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-blue-700">
                Progress Galaxy
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Level up across chemistry worlds
              </h2>
            </div>
            <LevelBadge level={4} title="Atom Explorer" />
          </div>
          <div className="mt-6">
            <XpBar xp={740} nextLevelXp={1000} />
          </div>
          <div className="mt-6 space-y-4">
            {chemistryModules.map((module, index) => (
              <Progress key={module.slug} value={mastery[index] ?? 0} label={module.title} />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-lime-100 via-white to-cyan-100">
          <h2 className="text-xl font-black text-slate-950">Recommended next action</h2>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
            Enter Bonding Forest, then fight the Valency Gatekeeper. Your recent
            answers show ionic formulas are almost unlocked.
          </p>
        </Card>
        <section
          aria-label="Mistake monsters remaining"
          className="lg:col-span-2 rounded-[2rem] bg-gradient-to-br from-rose-50 via-white to-violet-50 p-1"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <MistakeMonsterCard
              name="Mass Number Goblin"
              concept="Atomic structure"
              weakness="Protons + neutrons."
              hp={35}
              tone="lime"
            />
            <MistakeMonsterCard
              name="Mole Ratio Phantom"
              concept="Mole concept"
              weakness="Convert grams first."
              hp={52}
              tone="cyan"
            />
            <MistakeMonsterCard
              name="Valency Dragon"
              concept="Bonding"
              weakness="Neutral total charge."
              hp={68}
              tone="coral"
            />
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <MasterAlchemBubble
          compact
          mood="celebrating"
          eyebrow="Recommended mission"
          message="You are becoming a chemist. Run one Bonding Forest simulation, then explain why NaCl is ionic in one sentence."
          actionLabel="Ask for a hint"
          actionHref="/ai-tutor"
        />
        <Card className="bg-gradient-to-br from-amber-50 via-white to-cyan-50">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-amber-600" aria-hidden="true" />
            <h2 className="text-xl font-black text-slate-950">Recent achievements</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Atom Built", "+80 XP", "Created a stable neon atom"],
              ["Lab Focus", "+120 XP", "Completed two guided simulations"],
              ["Mistake Repaired", "+90 XP", "Defeated one misconception"],
            ].map(([title, xp, detail]) => (
              <div key={title} className="rounded-3xl bg-white/80 p-4 shadow-sm">
                <p className="font-black text-slate-950">{title}</p>
                <p className="mt-1 text-sm font-black text-lime-700">{xp}</p>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="bg-white/80">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-blue-600" aria-hidden="true" />
          <h2 className="text-xl font-black text-slate-950">Recent battle results</h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["Atomic Identity Boss", "82%", "+160 XP"],
            ["Periodic Kingdom Trial", "74%", "+120 XP"],
            ["Mole Mountain Sprint", "61%", "+90 XP"],
          ].map(([title, score, xp]) => (
            <div key={title} className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4">
              <p className="font-black text-slate-950">{title}</p>
              <p className="mt-2 text-sm font-bold text-slate-600">{score} mastery</p>
              <p className="mt-1 text-sm font-black text-lime-700">{xp}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
