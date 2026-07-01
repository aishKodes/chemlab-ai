"use client";

type MatterState = "solid" | "liquid" | "gas";

const particlePositions = {
  solid: [
    [28, 35],
    [42, 35],
    [56, 35],
    [70, 35],
    [28, 50],
    [42, 50],
    [56, 50],
    [70, 50],
    [28, 65],
    [42, 65],
    [56, 65],
    [70, 65],
  ],
  liquid: [
    [22, 62],
    [34, 68],
    [48, 58],
    [62, 70],
    [74, 60],
    [28, 78],
    [44, 78],
    [60, 82],
    [76, 78],
    [52, 66],
    [38, 54],
    [68, 50],
  ],
  gas: [
    [15, 22],
    [35, 16],
    [62, 18],
    [82, 30],
    [22, 48],
    [48, 42],
    [76, 55],
    [18, 76],
    [38, 84],
    [64, 78],
    [86, 82],
    [55, 62],
  ],
} satisfies Record<MatterState, number[][]>;

export function ParticleStateSimulator({
  state,
  temperature,
}: {
  state: MatterState;
  temperature: number;
}) {
  const intensity = Math.max(0.4, temperature / 100);
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 shadow-inner">
      <div className="absolute inset-x-8 bottom-8 h-36 rounded-b-[2rem] border-2 border-cyan-200/70 bg-cyan-200/10 shadow-[inset_0_0_35px_rgba(34,211,238,0.22)]" />
      <div className="absolute left-8 top-8 rounded-2xl bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
        {state} particles
      </div>
      <div className="absolute inset-0">
        {particlePositions[state].map(([x, y], index) => (
          <span
            key={`${state}-${index}`}
            className="absolute h-4 w-4 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.88)] transition-all duration-700"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) scale(${0.9 + intensity * 0.18})`,
              animation: state === "solid" ? "particle-vibrate 1.4s ease-in-out infinite" : state === "liquid" ? "particle-drift 2s ease-in-out infinite" : "particle-float 1.45s ease-in-out infinite",
              animationDelay: `${index * 90}ms`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 h-2 w-40 -translate-x-1/2 rounded-full bg-cyan-300/35 blur-md" aria-hidden="true" />
      <style jsx>{`
        @keyframes particle-vibrate {
          0%, 100% { margin-left: 0; margin-top: 0; }
          50% { margin-left: 2px; margin-top: -2px; }
        }
        @keyframes particle-drift {
          0%, 100% { margin-left: -3px; margin-top: 1px; }
          50% { margin-left: 4px; margin-top: -3px; }
        }
        @keyframes particle-float {
          0%, 100% { margin-left: -7px; margin-top: -5px; }
          50% { margin-left: 8px; margin-top: 6px; }
        }
      `}</style>
    </div>
  );
}
