export function BeakerHalfCell({ side, ready, active }: { side: "zinc" | "copper"; ready: boolean; active: boolean }) {
  const isZinc = side === "zinc";
  return (
    <div className={`relative h-72 rounded-b-[3rem] rounded-t-2xl border-4 border-white/65 bg-white/20 shadow-2xl backdrop-blur ${ready ? "opacity-100" : "opacity-35"}`}>
      <div className={`absolute bottom-0 left-4 right-4 h-44 rounded-b-[2.4rem] rounded-t-3xl ${isZinc ? "bg-gradient-to-t from-sky-400/75 to-sky-200/50" : "bg-gradient-to-t from-blue-700/75 to-cyan-300/55"}`} />
      <div className="absolute left-5 right-5 top-8 h-8 rounded-full bg-white/45" />
      {active ? (
        <div className={`absolute inset-x-7 bottom-16 h-16 rounded-full blur-xl ${isZinc ? "bg-slate-100/40" : "bg-orange-300/55"}`} />
      ) : null}
      <div className="absolute bottom-5 left-0 right-0 text-center text-sm font-black text-white drop-shadow">
        {isZinc ? "Zn | Zn2+" : "Cu2+ | Cu"}
      </div>
    </div>
  );
}
