"use client";

import { useEffect, useState } from "react";
import { QuickDrillGrid } from "@/components/learning/drills/QuickDrillGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendQuickDrill } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackQuickDrills, quickDrillApi } from "@/lib/api/quickDrillApi";
import { trackEvent } from "@/lib/analytics/trackEvent";

export default function QuickDrillsPage() {
  const [drills, setDrills] = useState<BackendQuickDrill[]>(fallbackQuickDrills);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void trackEvent({ event_type: "learning", event_name: "quick_drills_opened", page_path: "/quick-drills" });
    quickDrillApi
      .getDrills()
      .then((payload) => setDrills(payload.drills.length ? payload.drills : fallbackQuickDrills))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Quick Drills"
        title="Short battles for chemistry confidence."
        description="Answer a few focused questions, get instant clues, and turn mistakes into your next mission."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Using local quick drills" description={error} /> : null}
        {loading ? <LoadingState label="Loading quick drills" /> : <QuickDrillGrid drills={drills} />}
      </Container>
    </>
  );
}
