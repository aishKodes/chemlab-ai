"use client";

import { use, useEffect, useMemo, useState } from "react";
import { BookOpen, FlaskConical, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ResourceFeedback } from "@/components/learning/ResourceFeedback";
import { publicApi, fallbackResources } from "@/lib/api/publicApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendResource } from "@/lib/api/backendTypes";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { useResourceSession } from "@/hooks/useResourceSession";

export default function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [resource, setResource] = useState<BackendResource | null>(() => fallbackResources.find((item) => item.slug === slug) ?? null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useResourceSession({ resourceSlug: slug, resourceId: resource?.id, resourceType: resource?.type });

  useEffect(() => {
    void trackEvent({ event_type: "resource", event_name: "resource_viewed", page_path: `/resources/${slug}`, metadata: { slug } });
    publicApi
      .getResource(slug)
      .then((payload) => setResource("resource" in payload ? payload.resource : payload))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, [slug]);

  const content = useMemo(() => parseContent(resource?.content_json), [resource?.content_json]);
  const chemShastriPrompt = useMemo(() => {
    if (!resource) return "/ai-tutor";
    const prompt = `Help me learn ${resource.title}. Explain the key idea, then give me one question to try.`;
    return `/ai-tutor?prompt=${encodeURIComponent(prompt)}`;
  }, [resource]);

  if (loading && !resource) return <LoadingState label="Loading resource" />;

  return (
    <>
      <PageHeader
        eyebrow="Resource"
        title={resource?.title ?? "Resource not found"}
        description={resource?.description ?? "This resource is not available yet."}
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Showing fallback resource view" description={error} /> : null}
        {resource ? (
          <>
            <Card className="bg-gradient-to-br from-white via-sky-50 to-violet-50">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="green">{resource.type}</Badge>
                {resource.class_level ? <Badge tone="blue">Class {resource.class_level}</Badge> : null}
                {resource.status ? <Badge tone={resource.status === "published" ? "green" : "amber"}>{resource.status}</Badge> : null}
              </div>
              <h2 className="mt-4 text-3xl font-black text-slate-950">{resource.title}</h2>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-600">{resource.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {resource.route_url ? (
                  <Button href={resource.route_url} icon={<FlaskConical className="h-4 w-4" />}>
                    Open simulation
                  </Button>
                ) : null}
                <Button href={chemShastriPrompt} variant="secondary" icon={<Sparkles className="h-4 w-4" />}>
                  Ask Chem-Shastri
                </Button>
              </div>
            </Card>
            <div className="grid gap-5 md:grid-cols-3">
              <Card>
                <BookOpen className="h-6 w-6 text-blue-700" />
                <h3 className="mt-3 text-xl font-black text-slate-950">Practice path</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  Memory cards, quick drills, and concept maps can attach to this resource from the admin panel.
                </p>
              </Card>
              <Card>
                <h3 className="text-xl font-black text-slate-950">Source note</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {resource.source_reference ?? "Original Chemlab resource. Admins can add approved references from the backend."}
                </p>
              </Card>
              <Card>
                <h3 className="text-xl font-black text-slate-950">Content</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {content?.summary ?? "Detailed student-facing notes can be added through content_json or linked practice tools."}
                </p>
              </Card>
            </div>
            <ResourceFeedback resourceId={resource.id} resourceSlug={resource.slug} resourceType={resource.type} />
          </>
        ) : (
          <ErrorState title="Resource not found" description="This resource may be unpublished, archived, or waiting for backend setup." />
        )}
      </Container>
    </>
  );
}

function parseContent(value: BackendResource["content_json"]): Record<string, string> | null {
  if (!value) return null;
  if (typeof value === "object") return value as Record<string, string>;
  try {
    return JSON.parse(value) as Record<string, string>;
  } catch {
    return { summary: String(value) };
  }
}
