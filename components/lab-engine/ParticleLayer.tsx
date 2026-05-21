"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ParticleLayer({ count = 18 }: { count?: number }) {
  const reduced = useReducedMotion();
  const particleCount = reduced ? Math.min(8, count) : count;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: particleCount }, (_, index) => (
        <motion.span
          key={index}
          className="absolute h-2 w-2 rounded-full bg-cyan-200/70 shadow-[0_0_18px_rgba(103,232,249,0.8)]"
          style={{
            left: `${(index * 37) % 96}%`,
            top: `${12 + ((index * 29) % 74)}%`,
          }}
          animate={reduced ? undefined : { y: [0, -16, 0], opacity: [0.32, 0.82, 0.32] }}
          transition={{ duration: 3.8 + (index % 5) * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
