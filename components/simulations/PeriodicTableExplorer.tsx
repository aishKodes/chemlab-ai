"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { elementCategories, periodicTable } from "@/data/periodic-table";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { PeriodicElement } from "@/types";
import { cn } from "@/lib/utils";

const categoryClasses: Record<string, string> = {
  "alkali metal": "border-rose-200/30 bg-rose-300/12 text-rose-50",
  "alkaline earth metal": "border-amber-200/30 bg-amber-300/12 text-amber-50",
  "transition metal": "border-blue-200/30 bg-blue-300/12 text-blue-50",
  "post-transition metal": "border-teal-200/30 bg-teal-300/12 text-teal-50",
  metalloid: "border-emerald-200/30 bg-emerald-300/12 text-emerald-50",
  "reactive nonmetal": "border-cyan-200/30 bg-cyan-300/12 text-cyan-50",
  halogen: "border-violet-200/30 bg-violet-300/12 text-violet-50",
  "noble gas": "border-indigo-200/30 bg-indigo-300/12 text-indigo-50",
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
        "focus-ring min-h-20 rounded-lg border p-2 text-left transition hover:-translate-y-0.5",
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
      <Card className="overflow-hidden">
        <div className="grid gap-3 md:grid-cols-[1fr_260px]">
          <label className="relative block">
            <span className="sr-only">Search elements</span>
            <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-500" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, symbol, or atomic number"
              className="focus-ring h-11 w-full rounded-lg border border-white/12 bg-slate-950/70 pl-10 pr-3 text-sm text-white placeholder:text-slate-500"
            />
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="focus-ring h-11 w-full rounded-lg border border-white/12 bg-slate-950/70 px-3 text-sm text-white"
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
          <div className="grid min-w-[980px] grid-cols-[repeat(18,minmax(48px,1fr))] grid-rows-4 gap-2">
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
              <p className="text-sm text-slate-400">Atomic number {selected.atomicNumber}</p>
              <h2 className="mt-1 text-4xl font-semibold text-white">{selected.symbol}</h2>
              <p className="text-xl text-slate-200">{selected.name}</p>
            </div>
            <p className="font-mono text-lg text-cyan-100">{selected.atomicMass}</p>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-white/[0.05] p-3">
              <dt className="text-slate-400">Group</dt>
              <dd className="mt-1 font-semibold text-white">{selected.group}</dd>
            </div>
            <div className="rounded-lg bg-white/[0.05] p-3">
              <dt className="text-slate-400">Period</dt>
              <dd className="mt-1 font-semibold text-white">{selected.period}</dd>
            </div>
            <div className="rounded-lg bg-white/[0.05] p-3">
              <dt className="text-slate-400">Electronegativity</dt>
              <dd className="mt-1 font-semibold text-white">{selected.electronegativity ?? "n/a"}</dd>
            </div>
            <div className="rounded-lg bg-white/[0.05] p-3">
              <dt className="text-slate-400">Shells</dt>
              <dd className="mt-1 font-semibold text-white">{selected.electronConfiguration}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            Common oxidation states: {selected.commonOxidationStates.map((state) => (state > 0 ? `+${state}` : state)).join(", ")}
          </p>
        </Card>

        {[
          ["Across a period", "Nuclear charge increases, so atoms usually hold bonding electrons more strongly."],
          ["Down a group", "New shells are added, so atoms often become larger and shielding increases."],
          ["Family behavior", "Shared valence patterns explain why groups behave like chemical neighborhoods."],
        ].map(([title, text]) => (
          <Card key={title}>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
