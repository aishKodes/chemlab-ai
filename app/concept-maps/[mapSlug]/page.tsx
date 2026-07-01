"use client";

import { use, useEffect, useState } from "react";
import { ConceptMapViewer } from "@/components/learning/concept-map/ConceptMapViewer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendConceptMap } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackConceptMaps } from "@/lib/api/conceptMapApi";
import { publicApi } from "@/lib/api/publicApi";
import { trackEvent } from "@/lib/analytics/trackEvent";

export default function ConceptMapDetailPage({ params }: { params: Promise<{ mapSlug: string }> }) {
  const { mapSlug } = use(params);
  const fallbackMap = fallbackConceptMaps.find((map) => map.slug === mapSlug) ?? fallbackConceptMaps[0];
  const [conceptMap, setConceptMap] = useState<BackendConceptMap>(fallbackMap);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void trackEvent({ event_type: "learning", event_name: "concept_map_viewed", page_path: `/concept-maps/${mapSlug}`, metadata: { mapSlug } });
    publicApi
      .getConceptMap(mapSlug)
      .then((payload) => setConceptMap(payload.concept_map))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, [mapSlug]);

  return (
    <>
      <PageHeader eyebrow="Concept Map" title={conceptMap.title} description={conceptMap.description ?? "Trace this chemistry idea across connected clues."} />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Using local concept map" description={error} /> : null}
        {loading && !conceptMap ? <LoadingState label="Loading concept map" /> : <ConceptMapViewer conceptMap={conceptMap} />}
      </Container>
    </>
  );
}
