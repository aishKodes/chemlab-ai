"use client";

import { useEffect, useRef } from "react";

export function PixiStage({
  tone = "cyan",
  density = 26,
}: {
  tone?: "cyan" | "gold" | "violet";
  density?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let destroyApp: (() => void) | undefined;

    async function mountPixiLayer() {
      const host = hostRef.current;
      if (!host) return;
      const { Application, Graphics } = await import("pixi.js");
      if (cancelled || !hostRef.current) return;

      const app = new Application();
      await app.init({
        resizeTo: host,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
      });
      host.appendChild(app.canvas);
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";
      app.canvas.style.display = "block";

      const particles = Array.from({ length: density }, (_, index) => {
        const dot = new Graphics();
        const palette = getPalette(tone);
        dot.circle(0, 0, 2 + Math.random() * 3);
        dot.fill({ color: palette[index % palette.length], alpha: 0.45 + Math.random() * 0.35 });
        dot.position.set(Math.random() * app.screen.width, Math.random() * app.screen.height);
        app.stage.addChild(dot);
        return {
          dot,
          speed: 0.18 + Math.random() * 0.42,
          drift: -0.18 + Math.random() * 0.36,
          pulse: Math.random() * Math.PI * 2,
        };
      });

      const tickerCallback = () => {
        for (const particle of particles) {
          particle.dot.y -= particle.speed;
          particle.dot.x += particle.drift;
          particle.pulse += 0.035;
          particle.dot.alpha = 0.28 + Math.sin(particle.pulse) * 0.16 + 0.28;
          if (particle.dot.y < -20) {
            particle.dot.y = app.screen.height + 20;
            particle.dot.x = Math.random() * app.screen.width;
          }
          if (particle.dot.x < -30) particle.dot.x = app.screen.width + 20;
          if (particle.dot.x > app.screen.width + 30) particle.dot.x = -20;
        }
      };

      app.ticker.add(tickerCallback);
      destroyApp = () => {
        app.ticker.remove(tickerCallback);
        app.destroy(true, { children: true, texture: false });
      };
    }

    mountPixiLayer();

    return () => {
      cancelled = true;
      destroyApp?.();
    };
  }, [density, tone]);

  return <div ref={hostRef} className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden="true" />;
}

function getPalette(tone: "cyan" | "gold" | "violet") {
  if (tone === "gold") return [0xfacc15, 0xffffff, 0x38bdf8, 0xf97316];
  if (tone === "violet") return [0xc084fc, 0x38bdf8, 0xffffff, 0xf0abfc];
  return [0x67e8f9, 0xffffff, 0x93c5fd, 0xa7f3d0];
}
