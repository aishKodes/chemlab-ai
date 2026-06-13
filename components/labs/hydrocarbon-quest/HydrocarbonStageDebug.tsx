"use client";

import { useMemo, useState } from "react";
import { CinematicStage } from "@/components/labs/hydrocarbon-quest/CinematicStage";
import { sceneLayouts } from "@/components/labs/hydrocarbon-quest/sceneLayouts";
import type { HydrocarbonSceneLayout } from "@/components/labs/hydrocarbon-quest/sceneLayouts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

type SceneId = keyof typeof sceneLayouts;

export function HydrocarbonStageDebug() {
  const [sceneId, setSceneId] = useState<SceneId>("classroom");
  const baseLayout = sceneLayouts[sceneId];
  const [groundOffset, setGroundOffset] = useState(0);
  const [kabirScaleOffset, setKabirScaleOffset] = useState(0);
  const [aparnaScaleOffset, setAparnaScaleOffset] = useState(0);

  const layout = useMemo<HydrocarbonSceneLayout>(() => ({
    ...baseLayout,
    groundY: baseLayout.groundY + groundOffset,
    kabir: { ...baseLayout.kabir, scale: Math.max(0.2, baseLayout.kabir.scale + kabirScaleOffset) },
    aparna: { ...baseLayout.aparna, scale: Math.max(0.2, baseLayout.aparna.scale + aparnaScaleOffset) },
  }), [aparnaScaleOffset, baseLayout, groundOffset, kabirScaleOffset]);

  return (
    <Container className="space-y-6 py-8">
      <div>
        <Badge tone="amber">Development staging</Badge>
        <h1 className="mt-3 text-4xl font-black text-slate-950">Hydrocarbon Cinematic Stage</h1>
        <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-700">
          Use this page to tune feet anchoring, ground line, facing direction, character scale, shadows, dialogue safe area, and board area.
          Press G, B, and C inside the page to toggle ground, board, and camera overlays.
        </p>
      </div>

      <Card className="bg-white/85">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(sceneLayouts) as SceneId[]).map((id) => (
            <Button key={id} size="sm" variant={sceneId === id ? "primary" : "secondary"} onClick={() => setSceneId(id)}>
              {id}
            </Button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <TuningSlider label="Ground Y offset" value={groundOffset} min={-80} max={80} step={5} onChange={setGroundOffset} />
          <TuningSlider label="Kabir scale offset" value={kabirScaleOffset} min={-0.18} max={0.18} step={0.01} onChange={setKabirScaleOffset} />
          <TuningSlider label="Aparna scale offset" value={aparnaScaleOffset} min={-0.18} max={0.18} step={0.01} onChange={setAparnaScaleOffset} />
        </div>
        <div className="mt-5 grid gap-2 rounded-3xl bg-slate-50 p-4 text-sm font-bold text-slate-700 md:grid-cols-3">
          <p>GroundY: {layout.groundY}</p>
          <p>Kabir: footX {layout.kabir.footX}, scale {layout.kabir.scale.toFixed(2)}, flipX {String(layout.kabir.flipX)}</p>
          <p>Aparna: footX {layout.aparna.footX}, scale {layout.aparna.scale.toFixed(2)}, flipX {String(layout.aparna.flipX)}</p>
        </div>
      </Card>

      <CinematicStage
        layout={layout}
        kabirPose={sceneId === "classroom" || sceneId === "rule" ? "confused" : "thinking"}
        aparnaPose={sceneId === "portal" || sceneId === "final" ? "celebrating" : "explaining"}
        activeSpeaker="Aparna"
        particleTone={sceneId === "portal" || sceneId === "final" ? "gold" : sceneId === "puzzle" ? "violet" : "cyan"}
        hud={
          <div className="rounded-2xl border border-white/25 bg-slate-950/45 px-4 py-3 text-white shadow-xl backdrop-blur-md">
            <Badge tone="cyan">{sceneId} preview</Badge>
            <h2 className="mt-2 text-2xl font-black">Feet anchor and dialogue safe area</h2>
          </div>
        }
        dialogue={
          <div className="rounded-[1.35rem] border-2 border-white bg-white/92 p-4 text-slate-950 shadow-2xl backdrop-blur-md">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Dialogue safe area</p>
            <p className="mt-2 text-lg font-black">Characters should stand on the same ground line and face the conversation or board.</p>
          </div>
        }
      >
        {layout.boardArea ? (
          <div
            className="absolute z-30 grid place-items-center rounded-[2rem] border-2 border-dashed border-cyan-300 bg-white/70 text-center text-2xl font-black text-slate-800 shadow-2xl backdrop-blur-md"
            style={{
              left: `${(layout.boardArea.x / 1920) * 100}%`,
              top: `${(layout.boardArea.y / 1080) * 100}%`,
              width: `${(layout.boardArea.width / 1920) * 100}%`,
              height: `${(layout.boardArea.height / 1080) * 100}%`,
            }}
          >
            Molecule board safe area
          </div>
        ) : null}
      </CinematicStage>
    </Container>
  );
}

function TuningSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 rounded-3xl bg-slate-50 p-4 text-sm font-black text-slate-700">
      <span>{label}: {typeof value === "number" && Math.abs(value) < 1 ? value.toFixed(2) : value}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-blue-600"
      />
    </label>
  );
}
