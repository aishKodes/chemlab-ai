"use client";

import { use, useEffect, useState } from "react";
import { QuickDrillPlayer } from "@/components/learning/drills/QuickDrillPlayer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendQuickDrill, BackendQuizQuestion } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackQuickDrillQuestions, fallbackQuickDrills, quickDrillApi } from "@/lib/api/quickDrillApi";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { useResourceSession } from "@/hooks/useResourceSession";

export default function QuickDrillPage({ params }: { params: Promise<{ drillSlug: string }> }) {
  const { drillSlug } = use(params);
  const fallbackDrill = fallbackQuickDrills.find((drill) => drill.slug === drillSlug) ?? fallbackQuickDrills[0];
  const [drill, setDrill] = useState<BackendQuickDrill>(fallbackDrill);
  const [questions, setQuestions] = useState<BackendQuizQuestion[]>(fallbackQuickDrillQuestions[drillSlug] ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useResourceSession({ resourceSlug: drill.resource_id ? undefined : drill.slug, resourceId: drill.resource_id ?? undefined, resourceType: "quick_drill" });

  useEffect(() => {
    void trackEvent({ event_type: "learning", event_name: "quick_drill_started", page_path: `/quick-drills/${drillSlug}`, metadata: { drillSlug } });
    quickDrillApi
      .getQuestions(drillSlug)
      .then((payload) => {
        setDrill(payload.drill);
        setQuestions(payload.questions.length ? payload.questions : fallbackQuickDrillQuestions[drillSlug] ?? []);
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, [drillSlug]);

  return (
    <>
      <PageHeader eyebrow="Quick Drill" title={drill.title} description={drill.description ?? "Answer each question and watch the clues sharpen."} />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Using local questions" description={error} /> : null}
        {loading && !questions.length ? <LoadingState label="Loading drill" /> : <QuickDrillPlayer drill={drill} questions={questions} />}
      </Container>
    </>
  );
}
