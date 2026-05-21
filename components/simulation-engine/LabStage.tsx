"use client";

import { useEffect, useRef, useState } from "react";
import type { Application, Graphics, Text } from "pixi.js";
import type { CinematicPhase } from "@/components/simulation-engine/simulationTypes";

export function LabStage({
  phase,
  active,
  label,
}: {
  phase: CinematicPhase;
  active: boolean;
  label?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(phase);
  const activeRef = useRef(active);
  const labelRef = useRef(label);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    phaseRef.current = phase;
    activeRef.current = active;
    labelRef.current = label;
  }, [active, label, phase]);

  useEffect(() => {
    let app: Application | null = null;
    let graphics: Graphics | null = null;
    let titleText: Text | null = null;
    let disposed = false;
    let elapsed = 0;

    async function start() {
      const host = hostRef.current;
      if (!host) return;

      try {
        const { Application, Graphics, Text } = await import("pixi.js");
        if (disposed || !hostRef.current) return;

        app = new Application();
        await app.init({
          resizeTo: host,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
        });

        if (disposed || !hostRef.current) {
          app.destroy(true);
          return;
        }

        app.canvas.className = "h-full w-full";
        host.appendChild(app.canvas);
        graphics = new Graphics();
        titleText = new Text({
          text: "",
          style: {
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "700",
            fill: "#e0f2fe",
            align: "center",
          },
        });
        titleText.anchor.set(0.5);
        app.stage.addChild(graphics);
        app.stage.addChild(titleText);

        app.ticker.add((ticker) => {
          if (!app || !graphics || !titleText) return;
          elapsed += ticker.deltaTime / 60;
          drawStage(graphics, titleText, {
            width: app.screen.width,
            height: app.screen.height,
            elapsed,
            phase: phaseRef.current,
            active: activeRef.current,
            label: labelRef.current,
          });
        });
      } catch {
        setFailed(true);
      }
    }

    void start();

    return () => {
      disposed = true;
      if (app) app.destroy(true);
      if (hostRef.current) hostRef.current.replaceChildren();
    };
  }, []);

  if (failed) {
    return (
      <div className="grid min-h-[28rem] place-items-center rounded-[2rem] bg-gradient-to-br from-blue-950 via-slate-900 to-violet-950 p-6 text-center text-white">
        <p className="max-w-sm text-sm font-bold leading-6">
          The animated stage needs a refresh. Reload the page to restart the lab scene.
        </p>
      </div>
    );
  }

  return <div ref={hostRef} className="min-h-[28rem] w-full overflow-hidden rounded-[2rem]" />;
}

function drawStage(
  g: Graphics,
  titleText: Text,
  state: {
    width: number;
    height: number;
    elapsed: number;
    phase: CinematicPhase;
    active: boolean;
    label?: string;
  },
) {
  const width = Math.max(state.width, 520);
  const height = Math.max(state.height, 430);
  const scale = Math.min(width / 980, height / 560);
  const cx = width / 2;
  const benchY = height * 0.76;
  const vesselX = cx;
  const vesselY = height * 0.44;
  const glow = state.active || state.phase === "reward" ? 1 : state.phase === "challenge" ? 0.75 : 0.36;
  const pulse = 0.5 + Math.sin(state.elapsed * 2.2) * 0.5;

  g.clear();
  g.rect(0, 0, width, height).fill({ color: 0x06162f, alpha: 1 });
  g.rect(0, 0, width, height).fill({ color: 0x0ea5e9, alpha: 0.08 });

  for (let i = 0; i < 28; i += 1) {
    const x = (i * 83 + state.elapsed * 10 * (i % 3)) % width;
    const y = 30 + ((i * 47 + Math.sin(state.elapsed + i) * 18) % (height * 0.6));
    g.circle(x, y, 1.4 + (i % 4) * 0.8).fill({ color: i % 2 ? 0x67e8f9 : 0xc4b5fd, alpha: 0.22 });
  }

  g.roundRect(width * 0.08, benchY, width * 0.84, height * 0.16, 34 * scale).fill({ color: 0x16345f, alpha: 0.96 });
  g.roundRect(width * 0.08, benchY, width * 0.84, height * 0.04, 24 * scale).fill({ color: 0x7dd3fc, alpha: 0.16 });
  g.roundRect(width * 0.08, benchY, width * 0.84, height * 0.16, 34 * scale).stroke({ color: 0xffffff, alpha: 0.22, width: 3 });

  g.circle(vesselX, vesselY + 84 * scale, 168 * scale + pulse * 18 * scale).fill({
    color: state.phase === "reward" ? 0xfacc15 : 0x22d3ee,
    alpha: 0.08 + glow * 0.12,
  });

  g.roundRect(vesselX - 105 * scale, vesselY - 70 * scale, 210 * scale, 245 * scale, 28 * scale).fill({
    color: 0xffffff,
    alpha: 0.1,
  });
  g.roundRect(vesselX - 105 * scale, vesselY - 70 * scale, 210 * scale, 245 * scale, 28 * scale).stroke({
    color: 0xe0f7ff,
    alpha: 0.72,
    width: 4 * scale,
  });
  g.ellipse(vesselX, vesselY - 50 * scale, 108 * scale, 22 * scale).stroke({
    color: 0xffffff,
    alpha: 0.58,
    width: 3 * scale,
  });
  g.roundRect(vesselX - 82 * scale, vesselY + 28 * scale, 164 * scale, 128 * scale, 22 * scale).fill({
    color: state.phase === "reward" ? 0xfde68a : state.phase === "challenge" ? 0xa78bfa : 0x38bdf8,
    alpha: 0.55 + glow * 0.2,
  });
  g.ellipse(vesselX, vesselY + 34 * scale, 82 * scale, 18 * scale).fill({ color: 0xffffff, alpha: 0.16 });

  for (let i = 0; i < 16; i += 1) {
    const angle = state.elapsed * (0.7 + (i % 3) * 0.18) + i * 0.67;
    const radius = (56 + (i % 5) * 17) * scale;
    const x = vesselX + Math.cos(angle) * radius;
    const y = vesselY + 86 * scale + Math.sin(angle * 1.4) * radius * 0.5;
    g.circle(x, y, (4 + (i % 3)) * scale).fill({
      color: i % 2 ? 0xf0abfc : 0x99f6e4,
      alpha: 0.32 + glow * 0.46,
    });
  }

  if (state.phase === "challenge" || state.phase === "reward") {
    g.moveTo(vesselX - 170 * scale, vesselY + 25 * scale);
    g.lineTo(vesselX - 105 * scale, vesselY + 82 * scale);
    g.stroke({ color: 0xfacc15, alpha: 0.8, width: 5 * scale, cap: "round" });
    g.moveTo(vesselX + 170 * scale, vesselY + 25 * scale);
    g.lineTo(vesselX + 105 * scale, vesselY + 82 * scale);
    g.stroke({ color: 0x86efac, alpha: 0.8, width: 5 * scale, cap: "round" });
  }

  titleText.text = state.label ?? "Virtual lab stage";
  titleText.x = cx;
  titleText.y = height * 0.12;
}
