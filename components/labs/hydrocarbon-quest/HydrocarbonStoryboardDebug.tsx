/* eslint-disable @next/next/no-img-element */

import { hydrocarbonStoryboardFrames } from "@/components/labs/hydrocarbon-quest/assetManifest";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export function HydrocarbonStoryboardDebug() {
  return (
    <Container className="py-10">
      <Badge tone="amber">Development only</Badge>
      <h1 className="mt-3 text-4xl font-black text-slate-950">Hydrocarbon Storyboard</h1>
      <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-700">
        This page shows every selected cinematic frame in the order Chemlab uses it. Baked image text is treated as visual texture only; student-facing lesson text is rendered by code.
      </p>

      <div className="mt-8 grid gap-5">
        {storyboardSequence.map((frame, index) => (
          <Card key={frame.id} className="bg-white">
            <div className="grid gap-4 lg:grid-cols-[24rem_1fr]">
              <img src={frame.src} alt={frame.id} className="aspect-video w-full rounded-3xl object-cover shadow-lg" />
              <div>
                <Badge tone="cyan">Story frame {index + 1}</Badge>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{frame.id}</h2>
                <p className="mt-3 text-sm font-black text-blue-700">{frame.speaker}</p>
                <p className="mt-2 text-lg font-bold leading-7 text-slate-700">{frame.text}</p>
              </div>
            </div>
          </Card>
        ))}

        {hydrocarbonStoryboardFrames.map((asset) => (
          <Card key={asset.role} className="bg-white">
            <div className="grid gap-4 lg:grid-cols-[24rem_1fr]">
              <img src={asset.src} alt={asset.label} className="aspect-video w-full rounded-3xl object-cover shadow-lg" />
              <div>
                <Badge tone={asset.status === "ok" ? "green" : "amber"}>{asset.use}</Badge>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{asset.label}</h2>
                <p className="mt-2 break-all text-xs font-bold text-slate-500">{asset.rawPath}</p>
                <p className="mt-4 text-sm font-bold leading-6 text-slate-700">{asset.note}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}

const storyboardSequence = [
  {
    id: "classroom intro",
    src: hydrocarbonStoryboardFrames[0].src,
    speaker: "Kabir",
    text: "Aparna ma'am, IUPAC nomenclature feels like a foreign language. Why can't we just call everything gas?",
  },
  {
    id: "naming analogy",
    src: hydrocarbonStoryboardFrames[1].src,
    speaker: "Aparna",
    text: "If someone asks for Sharma ji in a big neighbourhood, which Sharma ji? We need the exact full name.",
  },
  {
    id: "transition to futuristic lab",
    src: hydrocarbonStoryboardFrames[2].src,
    speaker: "Aparna",
    text: "Now let's turn naming into a quest.",
  },
  {
    id: "level 1 intro",
    src: hydrocarbonStoryboardFrames[3].src,
    speaker: "Aparna",
    text: "Straight-chain families begin with carbon counting.",
  },
  {
    id: "level 2 intro",
    src: hydrocarbonStoryboardFrames[4].src,
    speaker: "Aparna",
    text: "Branches are side cousins. Rank them carefully.",
  },
  {
    id: "level 3 intro",
    src: hydrocarbonStoryboardFrames[5].src,
    speaker: "Aparna",
    text: "Double bonds are VIP guests. Give them low numbers.",
  },
  {
    id: "quest map",
    src: hydrocarbonStoryboardFrames[6].src,
    speaker: "Chemlab",
    text: "The roadmap continues toward senior-secondary mastery.",
  },
  {
    id: "completion celebration",
    src: hydrocarbonStoryboardFrames[7].src,
    speaker: "Chemlab",
    text: "Hydrocarbon Name Master.",
  },
];
