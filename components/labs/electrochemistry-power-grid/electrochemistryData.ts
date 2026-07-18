import type { CellPart, ElectrochemistryLevel } from "./electrochemistryTypes";

export const electrochemistryLevels: ElectrochemistryLevel[] = [
  {
    id: "build_cell",
    title: "Build the Cell",
    objective: "Assemble the Daniell cell so the circuit has two half-cells, a salt bridge, wire, and voltmeter.",
    xp: 80,
  },
  {
    id: "find_electrodes",
    title: "Find Anode and Cathode",
    objective: "Identify where oxidation and reduction happen.",
    xp: 90,
  },
  {
    id: "electron_flow",
    title: "Trace Electron Flow",
    objective: "Run the reaction and watch electrons travel from zinc to copper.",
    xp: 90,
  },
  {
    id: "ion_flow",
    title: "Balance Ion Flow",
    objective: "Use the salt bridge to keep both half-cells electrically neutral.",
    xp: 90,
  },
  {
    id: "nernst_lab",
    title: "Nernst Voltage Lab",
    objective: "Change Zn2+ and Cu2+ concentrations and watch the voltage respond.",
    xp: 140,
  },
];

export const cellParts: Array<{ id: CellPart; label: string; side: "left" | "right" | "bridge" | "top" }> = [
  { id: "zn_solution", label: "ZnSO4 solution", side: "left" },
  { id: "zn_electrode", label: "Zn electrode", side: "left" },
  { id: "cu_solution", label: "CuSO4 solution", side: "right" },
  { id: "cu_electrode", label: "Cu electrode", side: "right" },
  { id: "salt_bridge", label: "Salt bridge", side: "bridge" },
  { id: "wire", label: "External wire", side: "top" },
  { id: "voltmeter", label: "Voltmeter", side: "top" },
];

export const electrochemistryFacts = {
  reaction: "Zn(s) + Cu2+(aq) -> Zn2+(aq) + Cu(s)",
  anode: "Zn(s) -> Zn2+(aq) + 2e-",
  cathode: "Cu2+(aq) + 2e- -> Cu(s)",
  notation: "Zn | Zn2+ || Cu2+ | Cu",
  nernst: "Ecell = E°cell - (0.0591 / 2) log([Zn2+] / [Cu2+])",
};
