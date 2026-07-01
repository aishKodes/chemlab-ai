"use client";

import { GitBranch } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendConceptMap } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackConceptMaps } from "@/lib/api/conceptMapApi";
import { publicApi } from "@/lib/api/publicApi";
import { trackEvent } from "@/lib/analytics/trackEvent";

export default function ConceptMapsPage() {
  const [maps, setMaps] = useState<BackendConceptMap[]>(fallbackConceptMaps);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void trackEvent({ event_type: "learning", event_name: "concept_maps_opened", page_path: "/concept-maps" });
    publicApi
      .getConceptMaps()
      .then((payload) => setMaps(payload.concept_maps.length ? payload.concept_maps : fallbackConceptMaps))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Concept Maps" title="See how chemistry ideas connect." description="Use maps to link formulas, words, and lab actions into one clear picture." />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Using local concept maps" description={error} /> : null}
        {loading ? (
          <LoadingState label="Loading concept maps" />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {maps.map((map) => (
              <Card key={map.slug} interactive>
                <Badge tone="blue">Concept map</Badge>
                <GitBranch className="mt-5 h-8 w-8 text-violet-700" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-black text-slate-950">{map.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{map.description}</p>
                <Button href={`/concept-maps/${map.slug}`} className="mt-5" variant="secondary">
                  Open map
                </Button>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
