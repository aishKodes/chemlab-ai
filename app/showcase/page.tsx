import type { Metadata } from "next";
import { BarChart3, BookOpenCheck, BrainCircuit, FlaskConical, Hexagon, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Showcase",
  description: "The strongest real Chemlab experiences for students, teachers, and demos.",
};

const showcaseItems = [
  {
    title: "Redox Transfer Kitchen",
    classLevel: "Class 10-12",
    concept: "Redox reactions",
    why: "Paati’s murukku story turns oxidation and reduction into one visible transaction.",
    href: "/labs/redox-transfer-kitchen",
    status: "ready",
    icon: FlaskConical,
  },
  {
    title: "Hydrocarbon Naming Quest",
    classLevel: "Class 11",
    concept: "IUPAC naming",
    why: "Students trace carbon families, rank branches, and build names through a puzzle game.",
    href: "/labs/hydrocarbon-naming-quest",
    status: "ready",
    icon: Trophy,
  },
  {
    title: "Chemistry Scale Universe",
    classLevel: "Class 11",
    concept: "Some Basic Concepts",
    why: "A multi-zone universe for matter, measurement, mole concept, and stoichiometry.",
    href: "/labs/basic-concepts-chemistry-universe",
    status: "ready",
    icon: FlaskConical,
  },
  {
    title: "Molecule Shapes 3D",
    classLevel: "Class 11",
    concept: "VSEPR geometry",
    why: "Rotate school-level molecules and compare geometry, bond angles, and lone-pair effects.",
    href: "/labs/molecule-shapes-3d",
    status: "ready",
    icon: Hexagon,
  },
  {
    title: "Teacher Live Quiz",
    classLevel: "Teacher tools",
    concept: "Classroom practice",
    why: "Teachers can launch quiz rooms and turn quick drills into classroom battles.",
    href: "/teacher/quizzes",
    status: "beta",
    icon: Users,
  },
  {
    title: "Smart Memory Cards",
    classLevel: "Class 9-12",
    concept: "Retrieval practice",
    why: "Cards connect concepts, formulas, mistakes, and Chem-Shastri prompts.",
    href: "/memory-cards",
    status: "beta",
    icon: BookOpenCheck,
  },
  {
    title: "Admin Analytics / Roadmap",
    classLevel: "Admin workspace",
    concept: "Build planning",
    why: "Admins can review coverage, spot missing simulations, and choose the highest-impact chapters to build next.",
    href: "/admin/roadmap",
    status: "ready",
    icon: BarChart3,
  },
  {
    title: "Open Visualization Queue",
    classLevel: "Resource review",
    concept: "External resources",
    why: "PhET, Mol*, and Jmol candidates stay in review until license, attribution, and accuracy checks are complete.",
    href: "/admin/open-resources",
    status: "needs_review",
    icon: BookOpenCheck,
  },
  {
    title: "Chem-Shastri",
    classLevel: "All learners",
    concept: "Guided chemistry help",
    why: "Curated fallback answers keep the mentor useful even when provider APIs are unavailable.",
    href: "/ai-tutor",
    status: "ready",
    icon: BrainCircuit,
  },
];

const statusMeta = {
  ready: { label: "Ready", tone: "green" as const },
  beta: { label: "Beta", tone: "amber" as const },
  needs_review: { label: "Needs review", tone: "blue" as const },
  external_review: { label: "External / license review", tone: "blue" as const },
};

export default function ShowcasePage() {
  const ready = showcaseItems.filter((item) => item.status === "ready");
  const beta = showcaseItems.filter((item) => item.status !== "ready");

  return (
    <>
      <PageHeader
        eyebrow="Showcase"
        title="The strongest Chemlab experiences, live on the real site."
        description="No presentation shell. These are the actual student and teacher experiences to open during a demo."
      />
      <Container className="space-y-10 pb-16">
        <Card className="bg-gradient-to-br from-blue-950 via-violet-950 to-slate-950 text-white">
          <Badge tone="green">Must show first</Badge>
          <h2 className="mt-3 text-3xl font-black">Start with the experiences that already feel like Chemlab.</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-blue-100">
            Open a story lab, a 3D molecule view, and Chem-Shastri. These show the product direction without hiding behind a separate mode.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/labs/redox-transfer-kitchen">Open Redox</Button>
            <Button href="/labs/molecule-shapes-3d" variant="secondary">Open Molecules</Button>
            <Button href="/ai-tutor" variant="secondary">Ask Chem-Shastri</Button>
          </div>
        </Card>

        <section>
          <Badge tone="green">Ready</Badge>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ready.map((item) => (
              <ShowcaseCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section>
          <Badge tone="amber">Beta and review queues</Badge>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {beta.map((item) => (
              <ShowcaseCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}

function ShowcaseCard({ item }: { item: (typeof showcaseItems)[number] }) {
  const Icon = item.icon;
  const status = statusMeta[item.status as keyof typeof statusMeta] ?? statusMeta.beta;
  return (
    <Card interactive className="bg-gradient-to-br from-white via-cyan-50 to-amber-50">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-3xl border-2 border-white bg-blue-600 text-white shadow-lg">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
      <h2 className="mt-5 text-2xl font-black text-slate-950">{item.title}</h2>
      <p className="mt-1 text-xs font-black uppercase tracking-wide text-blue-700">{item.classLevel} • {item.concept}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{item.why}</p>
      <Button href={item.href} className="mt-5" variant={item.status === "ready" ? "primary" : "secondary"}>
        Open
      </Button>
    </Card>
  );
}
