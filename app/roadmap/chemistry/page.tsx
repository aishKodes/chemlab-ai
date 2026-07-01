import type { Metadata } from "next";
import { FlaskConical, Sparkles } from "lucide-react";
import { class11SomeBasicConceptsContentPack } from "@/data/content-packs/class-11/some-basic-concepts-of-chemistry";
import { labCatalog } from "@/data/labs/labCatalog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Chemistry Roadmap",
  description: "Chemlab class-wise chemistry roadmap for Class 9 to 12.",
};

const classRows = [
  { classLevel: "9", title: "Class 9 Science", status: "Starter resources live", chapters: ["Matter in Our Surroundings", "Atoms and Molecules"] },
  { classLevel: "10", title: "Class 10 Science", status: "Redox simulation live", chapters: ["Chemical Reactions", "Acids, Bases and Salts"] },
  { classLevel: "11", title: "Class 11 Chemistry", status: "Unit 1 content factory active", chapters: [class11SomeBasicConceptsContentPack.blueprint.chapterTitle] },
  { classLevel: "12", title: "Class 12 Chemistry", status: "Electrochemistry flagship live", chapters: ["Electrochemistry"] },
];

export default function ChemistryRoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Roadmap"
        title="Chemlab chemistry worlds are growing."
        description="See what is live now and what is moving through the content factory."
      />
      <Container className="space-y-6 pb-16">
        <div className="grid gap-5 md:grid-cols-2">
          {classRows.map((row) => (
            <Card key={row.classLevel} interactive className="bg-gradient-to-br from-white via-cyan-50 to-amber-50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge tone="blue">{row.title}</Badge>
                  <h2 className="mt-3 text-2xl font-black text-slate-950">Class {row.classLevel} path</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{row.status}</p>
                </div>
                <Sparkles className="h-8 w-8 text-blue-700" aria-hidden="true" />
              </div>
              <div className="mt-5 space-y-2">
                {row.chapters.map((chapter) => (
                  <div key={chapter} className="rounded-2xl bg-white/80 p-3 text-sm font-black text-slate-700 shadow-sm">
                    {chapter}
                  </div>
                ))}
              </div>
              <Button href={`/classes/${row.classLevel}`} className="mt-5" variant="secondary">
                Open class
              </Button>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-blue-950 via-violet-950 to-slate-950 text-white">
          <Badge tone="green">Featured labs</Badge>
          <h2 className="mt-3 text-3xl font-black">Built as simulations, not static notes.</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {labCatalog
              .filter((lab) => lab.status === "featured")
              .slice(0, 6)
              .map((lab) => (
                <a
                  key={lab.slug}
                  href={lab.route}
                  className="focus-ring rounded-2xl bg-white/10 p-4 text-sm font-bold text-blue-100 transition hover:bg-white/15"
                >
                  <FlaskConical className="mb-3 h-5 w-5 text-cyan-200" aria-hidden="true" />
                  <span className="block font-black text-white">{lab.title}</span>
                  {lab.description}
                </a>
              ))}
          </div>
        </Card>
      </Container>
    </>
  );
}
