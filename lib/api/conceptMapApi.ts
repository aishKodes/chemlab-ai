import type { BackendConceptMap } from "@/lib/api/backendTypes";

export const fallbackConceptMaps: BackendConceptMap[] = [
  {
    id: 1,
    title: "Redox Transaction Map",
    slug: "redox-transaction-map",
    description: "Connect electron transfer, oxidation, reduction, and redox agents.",
    status: "published",
    map_json: {
      nodes: ["Electron transfer", "Oxidation", "Reduction", "Reducing agent", "Oxidizing agent"],
      edges: [
        { from: "Electron transfer", to: "Oxidation", label: "giver loses electrons" },
        { from: "Electron transfer", to: "Reduction", label: "receiver gains electrons" },
      ],
    },
  },
];
