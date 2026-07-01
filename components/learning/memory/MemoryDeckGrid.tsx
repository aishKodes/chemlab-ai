"use client";

import { Brain, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { BackendMemoryDeck } from "@/lib/api/backendTypes";

export function MemoryDeckGrid({ decks }: { decks: BackendMemoryDeck[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {decks.map((deck) => (
        <Card key={deck.slug} interactive className="bg-gradient-to-br from-white via-amber-50 to-cyan-50">
          <div className="flex items-start justify-between gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm">
              <Brain className="h-6 w-6" aria-hidden="true" />
            </div>
            <Badge tone={deck.difficulty === "advanced" ? "rose" : deck.difficulty === "intermediate" ? "amber" : "green"}>
              {deck.difficulty ?? "beginner"}
            </Badge>
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-950">{deck.title}</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{deck.description}</p>
          <Button href={`/memory-cards/${deck.slug}`} className="mt-5" icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}>
            Start review
          </Button>
        </Card>
      ))}
    </div>
  );
}
