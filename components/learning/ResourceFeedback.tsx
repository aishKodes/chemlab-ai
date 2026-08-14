"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { learningApi } from "@/lib/api/learningApi";
import { getLearningAnonymousId } from "@/lib/analytics/sessionTracker";

const reactions = [
  { key: "loved", label: "Loved it" },
  { key: "useful", label: "Useful" },
  { key: "confusing", label: "Confusing" },
  { key: "too_hard", label: "Too hard" },
  { key: "boring", label: "Boring" },
] as const;

export function ResourceFeedback({ resourceId, resourceSlug, resourceType }: { resourceId?: number; resourceSlug?: string; resourceType?: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function submit(reaction: string) {
    setSelected(reaction);
    setSent(true);
    void learningApi.submitResourceFeedback({
      resource_id: resourceId,
      resource_slug: resourceSlug,
      resource_type: resourceType,
      reaction,
      rating: reaction === "loved" ? 5 : reaction === "useful" ? 4 : reaction === "confusing" ? 2 : 3,
      anonymous_id: getLearningAnonymousId(),
    });
  }

  return (
    <Card className="bg-gradient-to-br from-white via-lime-50 to-amber-50">
      <h2 className="text-xl font-black text-slate-950">How did this feel?</h2>
      <p className="mt-2 text-sm font-semibold text-slate-600">Your feedback helps chemlearning improve this resource.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {reactions.map((reaction) => (
          <Button key={reaction.key} variant={selected === reaction.key ? "primary" : "secondary"} size="sm" onClick={() => submit(reaction.key)}>
            {reaction.label}
          </Button>
        ))}
      </div>
      {sent ? <p className="mt-3 text-sm font-black text-emerald-700">Thanks. Saved as a learning signal.</p> : null}
    </Card>
  );
}
