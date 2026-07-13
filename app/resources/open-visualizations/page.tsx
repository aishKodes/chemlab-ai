import type { Metadata } from "next";
import { ExternalLink, LockKeyhole } from "lucide-react";
import { getPublishableOpenResources, openResourceCandidates } from "@/data/open-resources/openResourceCandidates";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Open Visualizations",
  description: "Reviewed open chemistry visualizations and simulations curated by Chemlab.",
};

export default function OpenVisualizationsPage() {
  const resources = getPublishableOpenResources();

  return (
    <>
      <PageHeader
        eyebrow="Open Visualizations"
        title="Reviewed external chemistry tools will appear here."
        description="Chemlab links external resources only after license, attribution, and accuracy review."
      />
      <Container className="space-y-6 pb-16">
        <Card className="bg-gradient-to-br from-white via-amber-50 to-cyan-50">
          <div className="flex gap-3">
            <LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-black text-slate-950">Nothing unreviewed is public.</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                We have {openResourceCandidates.length} strong candidates in admin review. They stay hidden from students until license and accuracy are checked.
              </p>
            </div>
          </div>
        </Card>

        {resources.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <Card key={resource.slug} interactive>
                <Badge tone="green">{resource.provider}</Badge>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{resource.name}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{resource.whyUseful}</p>
                <p className="mt-3 text-xs font-bold text-slate-500">{resource.attributionText}</p>
                <Button href={resource.sourceUrl} className="mt-5" icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}>
                  Open resource
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <Badge tone="amber">Review in progress</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">External resources are not published yet.</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              For the demo, use Chemlab’s own featured labs first. Admins can review PhET, Mol*, and JSmol candidates in the open-resource curation queue.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button href="/showcase">Open Chemlab showcase</Button>
              <Button href="/labs/molecule-shapes-3d" variant="secondary">Open Molecule Shapes 3D</Button>
            </div>
          </Card>
        )}
      </Container>
    </>
  );
}
