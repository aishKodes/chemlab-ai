"use client";

import { useEffect, useRef } from "react";

type NodePoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
};

const labels = ["H", "O", "C", "Na", "Cl", "N", "Ca", "Mg", "Fe"];

export function HeroLabScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const activeCanvas = canvas;
    const activeContext = context;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let animation = 0;
    let width = 0;
    let height = 0;
    let nodes: NodePoint[] = [];

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      width = activeCanvas.clientWidth;
      height = activeCanvas.clientHeight;
      activeCanvas.width = width * ratio;
      activeCanvas.height = height * ratio;
      activeContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      nodes = Array.from({ length: width < 760 ? 28 : 44 }, (_, index) => ({
        x: ((index * 97) % Math.max(width, 1)) + 12,
        y: ((index * 151) % Math.max(height, 1)) + 12,
        vx: ((index % 5) - 2) * 0.08,
        vy: (((index + 2) % 5) - 2) * 0.08,
        radius: 3 + (index % 3),
        label: labels[index % labels.length] ?? "C",
      }));
    }

    function draw() {
      frame += 1;
      activeContext.clearRect(0, 0, width, height);
      const gradient = activeContext.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(59, 231, 200, 0.13)");
      gradient.addColorStop(0.48, "rgba(8, 13, 30, 0.2)");
      gradient.addColorStop(1, "rgba(138, 180, 255, 0.14)");
      activeContext.fillStyle = gradient;
      activeContext.fillRect(0, 0, width, height);

      const pointerX = pointerRef.current.x * width;
      const pointerY = pointerRef.current.y * height;

      for (const node of nodes) {
        if (!prefersReducedMotion) {
          node.x += node.vx + (pointerX - node.x) * 0.00015;
          node.y += node.vy + (pointerY - node.y) * 0.00015;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          if (!a || !b) continue;
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 150) {
            activeContext.strokeStyle = `rgba(125, 230, 255, ${0.18 - distance / 1000})`;
            activeContext.lineWidth = 1;
            activeContext.beginPath();
            activeContext.moveTo(a.x, a.y);
            activeContext.lineTo(b.x, b.y);
            activeContext.stroke();
          }
        }
      }

      for (const node of nodes) {
        const pulse = prefersReducedMotion ? 0 : Math.sin(frame * 0.025 + node.x * 0.01) * 0.8;
        activeContext.beginPath();
        activeContext.fillStyle = "rgba(190, 252, 240, 0.88)";
        activeContext.arc(node.x, node.y, node.radius + pulse, 0, Math.PI * 2);
        activeContext.fill();
        activeContext.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
        activeContext.fillStyle = "rgba(241, 245, 249, 0.7)";
        activeContext.fillText(node.label, node.x + 7, node.y - 7);
      }

      if (!prefersReducedMotion) {
        animation = window.requestAnimationFrame(draw);
      }
    }

    function onPointerMove(event: PointerEvent) {
      pointerRef.current = {
        x: event.clientX / Math.max(window.innerWidth, 1),
        y: event.clientY / Math.max(window.innerHeight, 1),
      };
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      if (animation) window.cancelAnimationFrame(animation);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
