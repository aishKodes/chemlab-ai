"use client";

export function EmpiricalFormulaSolver() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-4">
      {[
        ["Percent clue", "C 40.0%, H 6.7%, O 53.3%"],
        ["Convert to moles", "Divide by atomic mass"],
        ["Smallest ratio", "C : H : O = 1 : 2 : 1"],
        ["Unlock formula", "CH2O"],
      ].map(([title, body], index) => (
        <div key={title} className="rounded-[1.5rem] border border-violet-100 bg-violet-50 p-4 text-center shadow-sm">
          <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-violet-700 text-sm font-black text-white">{index + 1}</span>
          <h3 className="mt-3 text-sm font-black text-slate-950">{title}</h3>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{body}</p>
        </div>
      ))}
    </div>
  );
}
