"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { memoryApi } from "@/lib/api/memoryApi";
import type { BackendMemoryCard, BackendMemoryDeck } from "@/lib/api/backendTypes";
import { getLearningAnonymousId } from "@/lib/analytics/sessionTracker";
import { useTimeOnTask } from "@/hooks/useTimeOnTask";

const ratings = [
  { key: "forgot", label: "Forgot", tone: "rose" },
  { key: "hard", label: "Hard", tone: "amber" },
  { key: "good", label: "Good", tone: "blue" },
  { key: "easy", label: "Easy", tone: "green" },
] as const;

export function MemoryCardPlayer({ deck, cards }: { deck: BackendMemoryDeck; cards: BackendMemoryCard[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const { getElapsedSeconds } = useTimeOnTask(!done);
  const card = cards[index];
  const progress = useMemo(() => (cards.length ? Math.round((index / cards.length) * 100) : 0), [cards.length, index]);

  function rate(rating: (typeof ratings)[number]["key"]) {
    if (!card?.id || !deck.id) return;
    void memoryApi.review({
      deck_id: deck.id,
      card_id: card.id,
      rating,
      anonymous_id: getLearningAnonymousId(),
      response_time_ms: getElapsedSeconds() * 1000,
      metadata: { deckSlug: deck.slug },
    });
    if (index + 1 >= cards.length) {
      setDone(true);
      return;
    }
    setIndex((current) => current + 1);
    setRevealed(false);
  }

  if (!cards.length) {
    return (
      <Card>
        <h2 className="text-xl font-black text-slate-950">No cards yet</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">This deck is waiting for cards from the Chemlab backend.</p>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="mx-auto max-w-3xl bg-gradient-to-br from-white via-emerald-50 to-cyan-50 text-center">
        <Sparkles className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-black text-slate-950">Review complete</h2>
        <p className="mt-3 text-sm font-bold leading-6 text-slate-600">Nice work. Your brain just got a cleaner pathway through this concept.</p>
        <Button
          className="mt-6"
          icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
          onClick={() => {
            setIndex(0);
            setRevealed(false);
            setDone(false);
          }}
        >
          Replay deck
        </Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Progress value={progress} label={`Card ${index + 1} of ${cards.length}`} />
      <Card className="min-h-[21rem] bg-gradient-to-br from-white via-blue-50 to-violet-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="blue">{deck.title}</Badge>
          <Badge tone="amber">{card.card_type ?? "concept"}</Badge>
        </div>
        <div className="mt-8 grid min-h-48 place-items-center rounded-[1.5rem] border border-white bg-white/70 p-6 text-center shadow-inner">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">{revealed ? "Answer" : "Prompt"}</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950">{revealed ? card.back : card.front}</h2>
            {revealed && card.explanation ? <p className="mt-4 text-sm font-bold leading-6 text-slate-600">{card.explanation}</p> : null}
            {!revealed && card.hint ? <p className="mt-4 text-sm font-bold text-amber-800">Hint: {card.hint}</p> : null}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!revealed ? (
            <Button onClick={() => setRevealed(true)}>Reveal answer</Button>
          ) : (
            ratings.map((rating) => (
              <Button key={rating.key} variant="secondary" onClick={() => rate(rating.key)}>
                {rating.label}
              </Button>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
