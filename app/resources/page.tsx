"use client";

import { FlaskConical, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { publicApi, fallbackResources, unwrapResources } from "@/lib/api/publicApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendResource } from "@/lib/api/backendTypes";
import { trackEvent } from "@/lib/analytics/trackEvent";

export default function ResourcesPage() {
  const [resources, setResources] = useState<BackendResource[]>(fallbackResources);
  const [classFilter, setClassFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void trackEvent({ event_type: "resource", event_name: "resource_viewed", page_path: "/resources" });
    publicApi
      .getResources()
      .then((payload) => {
        const next = unwrapResources(payload);
        setResources(next.length ? next : fallbackResources);
      })
      .catch((caught) => setError(getReadableApiError(caught)));
  }, []);

  const visibleResources = useMemo(
    () => (classFilter === "all" ? resources : resources.filter((resource) => resource.class_level === classFilter)),
    [classFilter, resources],
  );

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Open a chemlearning learning resource."
        description="Find simulations and class resources that help chemistry become visible and playable."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Showing local resource fallback" description={error} /> : null}
        <Card className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-blue-700" aria-hidden="true" />
            <p className="text-sm font-black text-slate-800">Filter by class</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "9", "10", "11", "12"].map((option) => (
              <button
                key={option}
                type="button"
                className={`rounded-full px-4 py-2 text-xs font-black transition ${
                  classFilter === option ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                }`}
                onClick={() => setClassFilter(option)}
              >
                {option === "all" ? "All" : `Class ${option}`}
              </button>
            ))}
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white via-amber-50 to-cyan-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge tone="amber">Open resources</Badge>
              <h2 className="mt-3 text-2xl font-black text-slate-950">Reviewed external visualizations</h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                chemlearning keeps PhET, Mol*, and other public resources in review until license, attribution, and accuracy checks are complete.
              </p>
            </div>
            <Button href="/resources/open-visualizations" variant="secondary">
              Open curation page
            </Button>
          </div>
        </Card>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleResources.map((resource) => (
            <Card key={resource.slug} interactive className="bg-gradient-to-br from-white via-sky-50 to-violet-50">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="green">{resource.type}</Badge>
                {resource.class_level ? <Badge tone="blue">Class {resource.class_level}</Badge> : null}
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-950">{resource.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{resource.description}</p>
              {resource.route_url ? (
                <Button href={resource.route_url} className="mt-5" icon={<FlaskConical className="h-4 w-4" aria-hidden="true" />}>
                  Open simulation
                </Button>
              ) : null}
              <Button href={`/resources/${resource.slug}`} className="mt-3" variant="secondary">
                View resource details
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
