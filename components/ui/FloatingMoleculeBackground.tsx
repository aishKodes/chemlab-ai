const molecules = [
  { left: "8%", top: "18%", color: "bg-cyan-300", delay: "0s" },
  { left: "82%", top: "12%", color: "bg-fuchsia-300", delay: "0.8s" },
  { left: "72%", top: "66%", color: "bg-lime-300", delay: "1.3s" },
  { left: "15%", top: "72%", color: "bg-orange-300", delay: "1.8s" },
  { left: "48%", top: "20%", color: "bg-violet-300", delay: "2.2s" },
];

export function FloatingMoleculeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {molecules.map((molecule, index) => (
        <div
          key={`${molecule.left}-${molecule.top}`}
          className="animate-floaty absolute"
          style={{ left: molecule.left, top: molecule.top, animationDelay: molecule.delay }}
        >
          <span className={`absolute h-5 w-5 rounded-full ${molecule.color} shadow-lg`} />
          <span className={`absolute left-8 top-5 h-3.5 w-3.5 rounded-full ${molecule.color} opacity-75`} />
          <span className={`absolute left-4 top-10 h-4 w-4 rounded-full ${molecule.color} opacity-80`} />
          <span className="absolute left-4 top-3 h-0.5 w-9 rotate-[35deg] bg-slate-300/70" />
          <span className="absolute left-3 top-8 h-0.5 w-8 -rotate-45 bg-slate-300/70" />
          <span className="absolute left-12 top-1 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-black text-slate-500">
            {index + 1}XP
          </span>
        </div>
      ))}
    </div>
  );
}
