"use client";

import { FlaskConical, GraduationCap } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { publicApi, fallbackClasses, fallbackResources, unwrapResources } from "@/lib/api/publicApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendClass, BackendResource } from "@/lib/api/backendTypes";
import { trackEvent } from "@/lib/analytics/trackEvent";

export default function ClassDetailPage() {
  const params = useParams<{ classLevel: string }>();
  const classLevel = params.classLevel;
  const fallbackClass = fallbackClasses.find((item) => item.class_level === classLevel) ?? fallbackClasses[0];
  const [classInfo, setClassInfo] = useState<BackendClass>(fallbackClass);
  const [resources, setResources] = useState<BackendResource[]>(fallbackResources.filter((item) => item.class_level === classLevel));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void trackEvent({
      event_type: "page",
      event_name: "class_page_viewed",
      page_path: `/classes/${classLevel}`,
      metadata: { classLevel },
    });

    publicApi
      .getClass(classLevel)
      .then((payload) => {
        if ("class" in payload) {
          setClassInfo(payload.class);
          if (payload.resources?.length) setResources(payload.resources);
        } else {
          setClassInfo(payload);
        }
      })
      .catch((caught) => setError(getReadableApiError(caught)));

    publicApi
      .getResources({ class_level: classLevel })
      .then((payload) => {
        const next = unwrapResources(payload);
        if (next.length) setResources(next);
      })
      .catch(() => undefined);
  }, [classLevel]);

  const subject = useMemo(
    () => classInfo.subjects?.[0]?.name ?? (Number(classLevel) <= 10 ? "Science" : "Chemistry"),
    [classInfo.subjects, classLevel],
  );

  return (
    <>
      <PageHeader
        eyebrow={`Class ${classLevel}`}
        title={`${classInfo.display_name ?? `Class ${classLevel}`} resources`}
        description={`Explore ${subject} through simulations, practice, and guided chemlearning resources.`}
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Using local class fallback" description={error} /> : null}
        <Card className="bg-gradient-to-br from-white via-cyan-50 to-amber-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge tone="blue">{subject}</Badge>
              <h2 className="mt-3 text-2xl font-black text-slate-950">Class {classLevel} learning map</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                More chapters, topic maps, and practice sets will appear here as chemlearning grows.
              </p>
            </div>
            <GraduationCap className="h-12 w-12 text-blue-600" aria-hidden="true" />
          </div>
        </Card>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(resources.length ? resources : fallbackResources).map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      </Container>
    </>
  );
}

function ResourceCard({ resource }: { resource: BackendResource }) {
  return (
    <Card interactive>
      <Badge tone="green">{resource.type}</Badge>
      <h3 className="mt-3 text-xl font-black text-slate-950">{resource.title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{resource.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {resource.route_url ? (
          <Button href={resource.route_url} icon={<FlaskConical className="h-4 w-4" aria-hidden="true" />}>
            Open simulation
          </Button>
        ) : null}
        <Button href={`/resources/${resource.slug}`} variant="secondary">
          View resource
        </Button>
      </div>
    </Card>
  );
}
