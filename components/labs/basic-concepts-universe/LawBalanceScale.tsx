"use client";

export function LawBalanceScale() {
  return (
    <div className="relative mx-auto mt-6 aspect-[16/8] max-w-xl rounded-[2rem] bg-gradient-to-br from-amber-100 to-cyan-100 p-8">
      <div className="absolute left-1/2 top-12 h-40 w-2 -translate-x-1/2 rounded-full bg-slate-800" />
      <div className="absolute left-1/2 top-20 h-2 w-72 -translate-x-1/2 rotate-[-3deg] rounded-full bg-slate-800" />
      <div className="absolute left-24 top-28 grid h-24 w-32 place-items-center rounded-b-full border-4 border-amber-500 bg-white/80 text-sm font-black text-amber-900 shadow-lg">
        Reactants
      </div>
      <div className="absolute right-24 top-24 grid h-24 w-32 place-items-center rounded-b-full border-4 border-cyan-500 bg-white/80 text-sm font-black text-cyan-900 shadow-lg">
        Products
      </div>
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-2xl bg-slate-950 px-4 py-2 text-xs font-black text-white">
        Conservation of mass keeps the scale honest.
      </p>
    </div>
  );
}
