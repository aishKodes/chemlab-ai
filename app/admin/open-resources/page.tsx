import type { Metadata } from "next";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { openResourceCandidates } from "@/data/open-resources/openResourceCandidates";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Open Resource Curation",
  description: "Review external simulations and visualizations before chemlearning publishes or embeds them.",
};

export default function AdminOpenResourcesPage() {
  const reviewed = openResourceCandidates.filter((item) => item.licenseReviewed).length;
  const publishable = openResourceCandidates.filter(
    (item) => item.licenseReviewed && ["reviewed", "verified"].includes(item.accuracyReviewStatus),
  ).length;

  return (
    <div className="space-y-6 pb-16">
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/40">
        <Badge tone="amber">Admin review only</Badge>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Open simulation curation queue</h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
          These are high-quality external candidates for chemlearning, but they stay draft until license, attribution, and accuracy are reviewed.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Metric label="Candidates" value={openResourceCandidates.length} />
          <Metric label="License reviewed" value={reviewed} />
          <Metric label="Publishable now" value={publishable} />
        </div>
      </section>

      <Card className="bg-amber-50/80">
        <div className="flex gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
          <p className="text-sm font-bold leading-6 text-amber-900">
            Publishing rule: external resources need source URL, license type, attribution text, license reviewed confirmation, and reviewed or verified accuracy status. Link-only is the default until embedding is explicitly allowed.
          </p>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        {openResourceCandidates.map((resource) => (
          <Card key={resource.slug} className="bg-white/85">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Badge tone={resource.licenseReviewed ? "green" : "amber"}>{resource.licenseReviewed ? "license reviewed" : "needs license review"}</Badge>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{resource.name}</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{resource.provider} • {resource.topic}</p>
              </div>
              <Badge tone="slate">{resource.usageType.replaceAll("_", " ")}</Badge>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{resource.whyUseful}</p>
            <div className="mt-4 grid gap-2 text-xs font-bold text-slate-600">
              <p><span className="text-slate-950">Classes:</span> {resource.classMapping.join(", ")}</p>
              <p><span className="text-slate-950">License:</span> {resource.licenseType}</p>
              <p><span className="text-slate-950">Attribution:</span> {resource.attributionText}</p>
              <p><span className="text-slate-950">chemlearning idea:</span> {resource.chemlabEnhancementIdea}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button href={resource.sourceUrl} variant="secondary" icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}>
                Open source
              </Button>
              <Badge tone={resource.publicStatus === "published" ? "green" : "slate"}>{resource.publicStatus}</Badge>
              <Badge tone={resource.accuracyReviewStatus === "verified" ? "green" : "amber"}>accuracy {resource.accuracyReviewStatus}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/80 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black text-blue-900">{value}</p>
    </div>
  );
}
