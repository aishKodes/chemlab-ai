"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { elementCategories, periodicTable } from "@/data/periodic-table";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MasterAlchemPointer } from "@/components/master-alchem/MasterAlchemPointer";
import type { PeriodicElement } from "@/types";
import { cn } from "@/lib/utils";

const categoryClasses: Record<string, string> = {
  "alkali metal": "border-rose-200 bg-rose-100 text-rose-800",
  "alkaline earth metal": "border-amber-200 bg-amber-100 text-amber-900",
  "transition metal": "border-blue-200 bg-blue-100 text-blue-800",
  "post-transition metal": "border-teal-200 bg-teal-100 text-teal-800",
  metalloid: "border-emerald-200 bg-emerald-100 text-emerald-800",
  "reactive nonmetal": "border-cyan-200 bg-cyan-100 text-cyan-800",
  halogen: "border-violet-200 bg-violet-100 text-violet-800",
  "noble gas": "border-indigo-200 bg-indigo-100 text-indigo-800",
};

function ElementButton({
  element,
  selected,
  onClick,
}: {
  element: PeriodicElement;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "focus-ring min-h-20 rounded-2xl border-2 p-2 text-left font-bold shadow-sm transition hover:-translate-y-1 hover:rotate-1",
        categoryClasses[element.category],
        selected && "ring-2 ring-cyan-200",
      )}
      style={{ gridColumn: element.group, gridRow: element.period }}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="block text-[11px] opacity-80">{element.atomicNumber}</span>
      <span className="block text-xl font-semibold">{element.symbol}</span>
      <span className="block truncate text-[11px] opacity-85">{element.name}</span>
    </button>
  );
}

export function PeriodicTableExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<PeriodicElement>(periodicTable[5]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return periodicTable.filter((element) => {
      const matchesQuery =
        !normalized ||
        element.name.toLowerCase().includes(normalized) ||
        element.symbol.toLowerCase().includes(normalized) ||
        String(element.atomicNumber) === normalized;
      const matchesCategory = category === "all" || element.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card className="overflow-hidden bg-gradient-to-br from-white via-sky-50 to-lime-50">
        <div className="grid gap-3 md:grid-cols-[1fr_260px]">
          <label className="relative block">
            <span className="sr-only">Search elements</span>
            <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-500" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, symbol, or atomic number"
              className="focus-ring h-11 w-full rounded-2xl border border-blue-100 bg-white/90 pl-10 pr-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400"
            />
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="focus-ring h-11 w-full rounded-2xl border border-blue-100 bg-white/90 px-3 text-sm font-semibold text-slate-800"
            >
              <option value="all">All categories</option>
              {elementCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 overflow-x-auto pb-2">
          <div className="grid min-w-[980px] grid-cols-[repeat(18,minmax(48px,1fr))] grid-rows-4 gap-2 rounded-[2rem] bg-white/60 p-3">
            {filtered.map((element) => (
              <ElementButton
                key={element.symbol}
                element={element}
                selected={selected.symbol === element.symbol}
                onClick={() => setSelected(element)}
              />
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="glass-panel-strong">
          <Badge tone="cyan">{selected.category}</Badge>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-500">Atomic number {selected.atomicNumber}</p>
              <h2 className="mt-1 text-5xl font-black text-slate-950">{selected.symbol}</h2>
              <p className="text-xl font-black text-slate-700">{selected.name}</p>
            </div>
            <p className="rounded-full bg-cyan-100 px-4 py-2 font-mono text-lg font-black text-cyan-800">{selected.atomicMass}</p>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/75 p-3 shadow-sm">
              <dt className="font-bold text-slate-500">Group</dt>
              <dd className="mt-1 font-black text-slate-950">{selected.group}</dd>
            </div>
            <div className="rounded-2xl bg-white/75 p-3 shadow-sm">
              <dt className="font-bold text-slate-500">Period</dt>
              <dd className="mt-1 font-black text-slate-950">{selected.period}</dd>
            </div>
            <div className="rounded-2xl bg-white/75 p-3 shadow-sm">
              <dt className="font-bold text-slate-500">Electronegativity</dt>
              <dd className="mt-1 font-black text-slate-950">{selected.electronegativity ?? "n/a"}</dd>
            </div>
            <div className="rounded-2xl bg-white/75 p-3 shadow-sm">
              <dt className="font-bold text-slate-500">Shells</dt>
              <dd className="mt-1 font-black text-slate-950">{selected.electronConfiguration}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm font-medium leading-6 text-slate-600">
            Common oxidation states: {selected.commonOxidationStates.map((state) => (state > 0 ? `+${state}` : state)).join(", ")}
          </p>
          <button className="focus-ring mt-5 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5">
            Ask Master Alchem why this element behaves this way
          </button>
        </Card>

        <MasterAlchemPointer
          mood="excited"
          title="Read the table like a map"
          message="Pick two neighbors and compare shells, group, and electronegativity. Trends become easier when you compare, not memorize."
          href="/ai-tutor"
          cta="Ask for a trend hint"
        />

        {[
          ["Across a period", "Nuclear charge increases, so atoms usually hold bonding electrons more strongly."],
          ["Down a group", "New shells are added, so atoms often become larger and shielding increases."],
          ["Family behavior", "Shared valence patterns explain why groups behave like chemical neighborhoods."],
        ].map(([title, text]) => (
          <Card key={title}>
            <h3 className="font-black text-slate-950">{title}</h3>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
