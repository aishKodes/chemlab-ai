"use client";

import { useEffect, useRef, useState } from "react";
import type { Application, Graphics, Text } from "pixi.js";
import type { DaniellSceneSnapshot } from "@/components/labs/daniell-cell/daniellCellTypes";

type TransitionState = {
  zincAt: number;
  copperAt: number;
  wireAt: number;
  saltAt: number;
  startAt: number;
  prevZinc: boolean;
  prevCopper: boolean;
  prevWire: boolean;
  prevSalt: boolean;
  prevStarted: boolean;
};

export function DaniellCellPixiScene({ snapshot }: { snapshot: DaniellSceneSnapshot }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const snapshotRef = useRef(snapshot);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const hostElement = host;
    let app: Application | null = null;
    let graphics: Graphics | null = null;
    let voltageText: Text | null = null;
    let disposed = false;
    let elapsed = 0;
    const transitions: TransitionState = {
      zincAt: -1,
      copperAt: -1,
      wireAt: -1,
      saltAt: -1,
      startAt: -1,
      prevZinc: false,
      prevCopper: false,
      prevWire: false,
      prevSalt: false,
      prevStarted: false,
    };

    async function start() {
      try {
        const { Application, Graphics, Text } = await import("pixi.js");
        if (disposed) return;

        app = new Application();
        await app.init({
          resizeTo: hostElement,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
        });

        if (disposed) {
          app.destroy(true);
          return;
        }

        app.canvas.className = "h-full w-full";
        hostElement.appendChild(app.canvas);

        graphics = new Graphics();
        voltageText = new Text({
          text: "0.00 V",
          style: {
            fontFamily: "Arial",
            fontSize: 26,
            fontWeight: "900",
            fill: "#bbf7d0",
            align: "center",
          },
        });
        voltageText.anchor.set(0.5);

        app.stage.addChild(graphics);
        app.stage.addChild(voltageText);

        app.ticker.add((ticker) => {
          if (!app || !graphics || !voltageText) return;
          elapsed += snapshotRef.current.reducedMotion ? ticker.deltaTime / 160 : ticker.deltaTime / 60;
          drawScene(graphics, voltageText, {
            width: app.screen.width,
            height: app.screen.height,
            elapsed,
            transitions,
            snapshot: snapshotRef.current,
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
      hostElement.replaceChildren();
    };
  }, []);

  if (failed) {
    return (
      <div className="grid h-full min-h-[34rem] place-items-center rounded-[2rem] bg-gradient-to-br from-blue-950 via-slate-900 to-violet-950 p-8 text-center text-white">
        <p className="max-w-sm text-sm font-bold leading-6">
          The lab scene needs a refresh. Reload the page to restart the animated bench.
        </p>
      </div>
    );
  }

  return <div ref={hostRef} className="h-full min-h-[34rem] w-full overflow-hidden rounded-[2rem]" />;
}

function drawScene(
  g: Graphics,
  voltageText: Text,
  state: {
    width: number;
    height: number;
    elapsed: number;
    transitions: TransitionState;
    snapshot: DaniellSceneSnapshot;
  },
) {
  const { snapshot, transitions } = state;
  const width = Math.max(state.width, 320);
  const height = Math.max(state.height, 520);
  const scale = Math.min(width / 1120, height / 680);
  const cx = width / 2;
  const benchY = height * 0.72;
  const left = { x: cx - 250 * scale, y: height * 0.42 };
  const right = { x: cx + 250 * scale, y: height * 0.42 };
  const beakerW = 210 * scale;
  const beakerH = 260 * scale;
  const topY = height * 0.13;
  const voltage = snapshot.voltage;
  const active = snapshot.buildState.cellStarted;

  updateTransitions(transitions, snapshot, state.elapsed);

  const zincIn = transitionProgress(transitions.zincAt, state.elapsed, 0.72);
  const copperIn = transitionProgress(transitions.copperAt, state.elapsed, 0.72);
  const wireIn = transitionProgress(transitions.wireAt, state.elapsed, 0.8);
  const saltIn = transitionProgress(transitions.saltAt, state.elapsed, 0.82);
  const startGlow = transitionProgress(transitions.startAt, state.elapsed, 0.9);

  g.clear();
  drawBackground(g, width, height, state.elapsed, active, snapshot.reducedMotion);
  drawBench(g, width, height, benchY, scale);

  drawVoltmeter(g, cx, topY, scale, active, startGlow, snapshot.reactionProgress);
  voltageText.text = `${voltage.toFixed(2)} V`;
  voltageText.x = cx;
  voltageText.y = topY + 18 * scale;
  voltageText.alpha = active ? 1 : 0.82;
  voltageText.scale.set(Math.max(0.72, scale));

  drawWire(g, left, right, topY, scale, wireIn, active, state.elapsed, snapshot.reactionProgress);
  drawSaltBridge(g, left, right, scale, saltIn, active, state.elapsed, snapshot.reducedMotion);
  drawBeaker(g, left.x, left.y, beakerW, beakerH, 0x94a3b8, 0x60a5fa, scale, snapshot.buildState.zincPlaced, zincIn, "zinc", active, state.elapsed, snapshot.reactionProgress);
  drawBeaker(g, right.x, right.y, beakerW, beakerH, 0x0ea5e9, 0x38bdf8, scale, snapshot.buildState.copperPlaced, copperIn, "copper", active, state.elapsed, snapshot.reactionProgress);

  if (active) {
    drawReactionGlow(g, left, right, scale, state.elapsed, snapshot.reactionProgress);
  }
}

function drawBackground(g: Graphics, width: number, height: number, elapsed: number, active: boolean, reducedMotion: boolean) {
  g.rect(0, 0, width, height).fill({ color: 0x061531, alpha: 1 });
  g.rect(0, 0, width, height).fill({ color: active ? 0x0ea5e9 : 0x7c3aed, alpha: active ? 0.12 : 0.08 });

  const particleCount = reducedMotion ? 14 : 38;
  for (let i = 0; i < particleCount; i += 1) {
    const drift = reducedMotion ? 0 : elapsed * (6 + (i % 5));
    const x = (i * 97 + drift) % width;
    const y = 36 + ((i * 61 + Math.sin(elapsed * 0.8 + i) * 22) % (height * 0.58));
    g.circle(x, y, 1.4 + (i % 4) * 0.65).fill({
      color: i % 3 === 0 ? 0x67e8f9 : i % 3 === 1 ? 0xc4b5fd : 0xfde68a,
      alpha: active ? 0.34 : 0.2,
    });
  }

  g.roundRect(width * 0.08, height * 0.1, width * 0.84, height * 0.52, 36).stroke({
    color: 0xffffff,
    alpha: 0.08,
    width: 2,
  });
}

function drawBench(g: Graphics, width: number, height: number, benchY: number, scale: number) {
  g.roundRect(width * 0.06, benchY, width * 0.88, height * 0.17, 34 * scale).fill({ color: 0x244b7d, alpha: 0.95 });
  g.roundRect(width * 0.06, benchY, width * 0.88, height * 0.045, 24 * scale).fill({ color: 0x7dd3fc, alpha: 0.22 });
  g.roundRect(width * 0.06, benchY, width * 0.88, height * 0.17, 34 * scale).stroke({ color: 0xffffff, alpha: 0.24, width: 3 * scale });
  g.rect(width * 0.11, benchY + height * 0.17, width * 0.045, height * 0.11).fill({ color: 0x17345f, alpha: 0.95 });
  g.rect(width * 0.845, benchY + height * 0.17, width * 0.045, height * 0.11).fill({ color: 0x17345f, alpha: 0.95 });
}

function drawVoltmeter(g: Graphics, cx: number, topY: number, scale: number, active: boolean, startGlow: number, progress: number) {
  const meterW = 210 * scale;
  const meterH = 86 * scale;
  const glow = active ? 0.18 + progress * 0.22 : 0.06;
  g.circle(cx, topY + 28 * scale, (120 + startGlow * 26) * scale).fill({ color: 0x22c55e, alpha: glow });
  g.roundRect(cx - meterW / 2, topY - meterH / 2, meterW, meterH, 22 * scale).fill({ color: 0x101827, alpha: 0.98 });
  g.roundRect(cx - meterW / 2, topY - meterH / 2, meterW, meterH, 22 * scale).stroke({ color: active ? 0x86efac : 0x93c5fd, alpha: 0.76, width: 3 * scale });
  g.roundRect(cx - 78 * scale, topY - 8 * scale, 156 * scale, 52 * scale, 12 * scale).fill({ color: 0x052e16, alpha: 0.95 });
  g.roundRect(cx - 78 * scale, topY - 8 * scale, 156 * scale, 52 * scale, 12 * scale).stroke({ color: 0xbbf7d0, alpha: active ? 0.7 : 0.3, width: 2 * scale });
}

function drawWire(
  g: Graphics,
  left: { x: number; y: number },
  right: { x: number; y: number },
  topY: number,
  scale: number,
  wireIn: number,
  active: boolean,
  elapsed: number,
  reactionProgress: number,
) {
  if (wireIn <= 0) return;
  const path = [
    { x: left.x - 38 * scale, y: left.y - 114 * scale },
    { x: left.x - 38 * scale, y: topY + 58 * scale },
    { x: right.x + 38 * scale, y: topY + 58 * scale },
    { x: right.x + 38 * scale, y: right.y - 114 * scale },
  ];
  drawPartialPath(g, path, wireIn, { color: 0x111827, alpha: 0.95, width: 9 * scale });
  drawPartialPath(g, path, wireIn, { color: 0x7dd3fc, alpha: active ? 0.48 : 0.2, width: 3 * scale });

  if (!active) return;
  const dots = 13;
  for (let i = 0; i < dots; i += 1) {
    const t = ((elapsed * (0.22 + reactionProgress * 0.2) + i / dots) % 1);
    const point = pointOnPath(path, t);
    g.circle(point.x, point.y, (4.2 + reactionProgress * 2) * scale).fill({ color: 0xe0f2fe, alpha: 0.92 });
    g.circle(point.x, point.y, (8 + reactionProgress * 4) * scale).fill({ color: 0x38bdf8, alpha: 0.18 });
  }
}

function drawSaltBridge(
  g: Graphics,
  left: { x: number; y: number },
  right: { x: number; y: number },
  scale: number,
  saltIn: number,
  active: boolean,
  elapsed: number,
  reducedMotion: boolean,
) {
  if (saltIn <= 0) return;
  const top = left.y - 76 * scale;
  const leftX = left.x + 84 * scale;
  const rightX = right.x - 84 * scale;
  const bridgePath = [
    { x: leftX, y: left.y + 18 * scale },
    { x: leftX, y: top },
    { x: rightX, y: top },
    { x: rightX, y: right.y + 18 * scale },
  ];
  drawPartialPath(g, bridgePath, saltIn, { color: 0xf8fafc, alpha: 0.34, width: 34 * scale });
  drawPartialPath(g, bridgePath, saltIn, { color: 0xffffff, alpha: 0.72, width: 6 * scale });
  drawPartialPath(g, bridgePath, saltIn, { color: 0x93c5fd, alpha: 0.38, width: 2 * scale });

  if (!active) return;
  const ionCount = reducedMotion ? 7 : 16;
  for (let i = 0; i < ionCount; i += 1) {
    const direction = i % 2 === 0 ? 1 : -1;
    const t = direction === 1 ? (elapsed * 0.12 + i / ionCount) % 1 : 1 - ((elapsed * 0.11 + i / ionCount) % 1);
    const p = pointOnPath(bridgePath, t);
    g.circle(p.x, p.y, 4.5 * scale).fill({ color: i % 2 === 0 ? 0xa7f3d0 : 0xfde68a, alpha: 0.88 });
  }
}

function drawBeaker(
  g: Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  metalColor: number,
  solutionColor: number,
  scale: number,
  electrodePlaced: boolean,
  electrodeIn: number,
  kind: "zinc" | "copper",
  active: boolean,
  elapsed: number,
  reactionProgress: number,
) {
  const left = x - width / 2;
  const top = y - height / 2;
  const liquidTop = top + height * 0.38;
  const liquidH = height * 0.48;

  g.roundRect(left, top, width, height, 24 * scale).fill({ color: 0xffffff, alpha: 0.09 });
  g.roundRect(left, top, width, height, 24 * scale).stroke({ color: 0xe0f2fe, alpha: 0.68, width: 4 * scale });
  g.ellipse(x, top + 22 * scale, width * 0.5, 22 * scale).stroke({ color: 0xffffff, alpha: 0.54, width: 3 * scale });
  g.roundRect(left + 20 * scale, liquidTop, width - 40 * scale, liquidH, 18 * scale).fill({ color: solutionColor, alpha: kind === "copper" ? 0.55 : 0.36 });
  g.ellipse(x, liquidTop + 8 * scale, width * 0.39, 14 * scale).fill({ color: 0xffffff, alpha: 0.13 });
  g.ellipse(x, liquidTop + liquidH, width * 0.39, 16 * scale).fill({ color: solutionColor, alpha: 0.22 });

  drawSolutionParticles(g, x, y, width, height, scale, kind, active, elapsed, reactionProgress);

  if (electrodePlaced) {
    const slide = 1 - electrodeIn;
    const electrodeX = kind === "zinc" ? x - 35 * scale : x + 35 * scale;
    const electrodeTop = top + 40 * scale - slide * 180 * scale;
    const electrodeH = height * 0.68;
    const thinning = kind === "zinc" && active ? reactionProgress * 8 * scale : 0;
    const coating = kind === "copper" && active ? reactionProgress * 10 * scale : 0;
    g.roundRect(electrodeX - 13 * scale + thinning / 2, electrodeTop, 26 * scale - thinning, electrodeH, 8 * scale).fill({ color: metalColor, alpha: 0.96 });
    g.roundRect(electrodeX - 13 * scale + thinning / 2, electrodeTop, 26 * scale - thinning, electrodeH, 8 * scale).stroke({ color: 0xffffff, alpha: 0.42, width: 2 * scale });
    if (kind === "copper") {
      g.roundRect(electrodeX - (13 + coating) * scale, electrodeTop + 38 * scale, (26 + coating * 2) * scale, electrodeH - 52 * scale, 8 * scale).fill({ color: 0xf97316, alpha: 0.24 + reactionProgress * 0.38 });
    }
  }
}

function drawSolutionParticles(
  g: Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number,
  kind: "zinc" | "copper",
  active: boolean,
  elapsed: number,
  progress: number,
) {
  const count = active ? 22 : 12;
  for (let i = 0; i < count; i += 1) {
    const baseX = x - width * 0.34 + ((i * 39) % Math.max(1, width * 0.68));
    const baseY = y - height * 0.03 + ((i * 31) % Math.max(1, height * 0.38));
    const driftX = Math.sin(elapsed * (0.55 + (i % 3) * 0.1) + i) * 11 * scale;
    const driftY = Math.cos(elapsed * (0.62 + (i % 4) * 0.08) + i) * 9 * scale;
    const towardsElectrode = kind === "copper" && active ? progress * 24 * scale : 0;
    const fromElectrode = kind === "zinc" && active ? progress * 18 * scale : 0;
    const color = kind === "copper" ? 0x38bdf8 : 0xcbd5e1;
    g.circle(baseX + driftX - towardsElectrode + fromElectrode, baseY + driftY, (2.8 + (i % 3)) * scale).fill({
      color,
      alpha: active ? 0.46 + progress * 0.28 : 0.3,
    });
  }
}

function drawReactionGlow(
  g: Graphics,
  left: { x: number; y: number },
  right: { x: number; y: number },
  scale: number,
  elapsed: number,
  progress: number,
) {
  const pulse = 0.5 + Math.sin(elapsed * 3) * 0.5;
  g.circle(left.x - 38 * scale, left.y + 8 * scale, (44 + pulse * 14) * scale).fill({ color: 0x93c5fd, alpha: 0.05 + progress * 0.08 });
  g.circle(right.x + 38 * scale, right.y + 8 * scale, (48 + pulse * 16) * scale).fill({ color: 0xfb923c, alpha: 0.06 + progress * 0.1 });

  for (let i = 0; i < 10; i += 1) {
    const theta = elapsed * 1.3 + i * 0.63;
    g.circle(left.x - 42 * scale + Math.cos(theta) * 38 * scale, left.y + 35 * scale + Math.sin(theta) * 22 * scale, 3.3 * scale).fill({
      color: 0xbfdbfe,
      alpha: 0.42 * progress,
    });
    g.circle(right.x + 40 * scale + Math.cos(-theta) * 42 * scale, right.y + 35 * scale + Math.sin(-theta) * 24 * scale, 3.6 * scale).fill({
      color: 0xfdba74,
      alpha: 0.46 * progress,
    });
  }
}

function updateTransitions(transitions: TransitionState, snapshot: DaniellSceneSnapshot, elapsed: number) {
  const { buildState } = snapshot;
  if (buildState.zincPlaced && !transitions.prevZinc) transitions.zincAt = elapsed;
  if (buildState.copperPlaced && !transitions.prevCopper) transitions.copperAt = elapsed;
  if (buildState.wireConnected && !transitions.prevWire) transitions.wireAt = elapsed;
  if (buildState.saltBridgeAdded && !transitions.prevSalt) transitions.saltAt = elapsed;
  if (buildState.cellStarted && !transitions.prevStarted) transitions.startAt = elapsed;
  transitions.prevZinc = buildState.zincPlaced;
  transitions.prevCopper = buildState.copperPlaced;
  transitions.prevWire = buildState.wireConnected;
  transitions.prevSalt = buildState.saltBridgeAdded;
  transitions.prevStarted = buildState.cellStarted;
}

function transitionProgress(startedAt: number, elapsed: number, duration: number) {
  if (startedAt < 0) return 0;
  return Math.min(1, Math.max(0, (elapsed - startedAt) / duration));
}

function drawPartialPath(
  g: Graphics,
  path: Array<{ x: number; y: number }>,
  progress: number,
  style: { color: number; alpha: number; width: number },
) {
  if (path.length < 2 || progress <= 0) return;
  const total = pathLength(path);
  let remaining = total * Math.min(1, progress);
  g.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i += 1) {
    const a = path[i - 1];
    const b = path[i];
    const segment = distance(a, b);
    if (remaining >= segment) {
      g.lineTo(b.x, b.y);
      remaining -= segment;
    } else {
      const t = segment === 0 ? 0 : remaining / segment;
      g.lineTo(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
      break;
    }
  }
  g.stroke(style);
}

function pointOnPath(path: Array<{ x: number; y: number }>, progress: number) {
  const total = pathLength(path);
  let target = total * Math.min(1, Math.max(0, progress));
  for (let i = 1; i < path.length; i += 1) {
    const a = path[i - 1];
    const b = path[i];
    const segment = distance(a, b);
    if (target <= segment) {
      const t = segment === 0 ? 0 : target / segment;
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    target -= segment;
  }
  return path[path.length - 1];
}

function pathLength(path: Array<{ x: number; y: number }>) {
  return path.reduce((sum, point, index) => {
    if (index === 0) return 0;
    return sum + distance(path[index - 1], point);
  }, 0);
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
