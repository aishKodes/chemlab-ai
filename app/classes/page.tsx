"use client";

import { BookOpen, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { publicApi, fallbackClasses, unwrapClasses } from "@/lib/api/publicApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendClass } from "@/lib/api/backendTypes";
import { trackEvent } from "@/lib/analytics/trackEvent";

export default function ClassesPage() {
  const [classes, setClasses] = useState<BackendClass[]>(fallbackClasses);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void trackEvent({ event_type: "page", event_name: "class_page_viewed", page_path: "/classes" });
    publicApi
      .getClasses()
      .then((payload) => {
        const next = unwrapClasses(payload);
        setClasses(next.length ? next : fallbackClasses);
      })
      .catch((caught) => setError(getReadableApiError(caught)));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Classes"
        title="Choose your chemistry path."
        description="Start with your class, then open the resources and simulations that match your level."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Showing local class list" description={error} /> : null}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {classes.map((item) => (
            <Card key={item.class_level} interactive className="bg-gradient-to-br from-white via-sky-50 to-violet-50">
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-blue-600 text-white shadow-lg">
                <GraduationCap className="h-7 w-7" aria-hidden="true" />
              </div>
              <Badge className="mt-5" tone={Number(item.class_level) <= 10 ? "green" : "blue"}>
                {item.subjects?.[0]?.name ?? (Number(item.class_level) <= 10 ? "Science" : "Chemistry")}
              </Badge>
              <h2 className="mt-3 text-2xl font-black text-slate-950">{item.display_name}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                Browse chemlearning resources and simulations for Class {item.class_level}.
              </p>
              <Button href={`/classes/${item.class_level}`} className="mt-5" icon={<BookOpen className="h-4 w-4" aria-hidden="true" />}>
                Open class
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
