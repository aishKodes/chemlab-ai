"use client";

import { hydrocarbonAssetRoles } from "@/components/labs/hydrocarbon-quest/assetManifest";
import { fullNameAnalogy } from "@/components/labs/hydrocarbon-quest/iupacRules";
import { StoryFramePlayer } from "@/components/labs/hydrocarbon-quest/StoryFramePlayer";
import type { StoryFrame } from "@/components/labs/hydrocarbon-quest/StoryFramePlayer";

const storyFrames: StoryFrame[] = [
  {
    id: "confusion",
    backgroundSrc: hydrocarbonAssetRoles.story_classroom_intro.src,
    speaker: "Kabir",
    text: "Aparna ma'am, IUPAC nomenclature feels like a foreign language. Why can't we just call everything gas?",
  },
  {
    id: "exact-name",
    backgroundSrc: hydrocarbonAssetRoles.story_classroom_intro.src,
    speaker: "Aparna",
    text: "If someone asks for Sharma ji in a big neighbourhood, which Sharma ji? We need the exact full name.",
  },
  {
    id: "iupac-purpose",
    backgroundSrc: hydrocarbonAssetRoles.story_full_name_analogy.src,
    speaker: "Aparna",
    text: "IUPAC does the same for molecules. It gives every chemical a precise full name.",
  },
  {
    id: "formula",
    backgroundSrc: hydrocarbonAssetRoles.story_full_name_analogy.src,
    speaker: "Aparna",
    text: "Every hydrocarbon name has a family structure. Branch first, chain middle, bond surname last.",
    board: <AnalogyBoard />,
  },
  {
    id: "transition",
    backgroundSrc: hydrocarbonAssetRoles.story_transition_to_lab.src,
    speaker: "Aparna",
    text: "Now let's turn naming into a quest.",
  },
];

export function HydrocarbonStoryIntro({
  index,
  onNext,
  onSkip,
}: {
  index: number;
  onNext: () => void;
  onSkip: () => void;
}) {
  return <StoryFramePlayer frames={storyFrames} index={index} onNext={onNext} onSkip={onSkip} />;
}

export const hydrocarbonStoryFrames = storyFrames;

function AnalogyBoard() {
  return (
    <div className="grid gap-3 rounded-[1.6rem] border border-white/25 bg-slate-950/48 p-4 shadow-2xl backdrop-blur-xl md:grid-cols-3">
      {fullNameAnalogy.map((item) => (
        <div key={item.title} className="rounded-[1.2rem] border border-white/20 bg-white/92 p-4 text-slate-950 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: item.color }}>
            {item.title}
          </p>
          <p className="mt-2 text-xl font-black">{item.chemistry}</p>
          <p className="mt-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">{item.example}</p>
        </div>
      ))}
    </div>
  );
}
