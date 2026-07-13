import { backendClient } from "@/lib/api/backendClient";
import type { BackendClass, BackendConceptMap, BackendMemoryCard, BackendMemoryDeck, BackendQuickDrill, BackendQuizQuestion, BackendResource } from "@/lib/api/backendTypes";

export const fallbackClasses: BackendClass[] = [
  { class_level: "9", display_name: "Class 9 Science", subjects: [{ name: "Science", subject_type: "science" }] },
  { class_level: "10", display_name: "Class 10 Science", subjects: [{ name: "Science", subject_type: "science" }] },
  { class_level: "11", display_name: "Class 11 Chemistry", subjects: [{ name: "Chemistry", subject_type: "chemistry" }] },
  { class_level: "12", display_name: "Class 12 Chemistry", subjects: [{ name: "Chemistry", subject_type: "chemistry" }] },
];

export const fallbackResources: BackendResource[] = [
  {
    type: "explanation",
    title: "Some Basic Concepts of Chemistry",
    slug: "some-basic-concepts-of-chemistry",
    description:
      "Class 11 Unit 1 learning pack for matter, measurement, mole concept, formula work, and stoichiometry.",
    route_url: null,
    class_level: "11",
    source_type: "NCERT",
    source_reference: "NCERT Class 11 Chemistry Unit 1, Some Basic Concepts of Chemistry",
    status: "published",
    quality_status: "needs_review",
    student_level: "intermediate",
    estimated_minutes: 35,
    content_json: {
      summary:
        "Use the Chemistry Scale Universe lab, memory decks, quick drills, and concept map to build a clean foundation for Class 11 chemistry.",
      topics:
        "Matter, measurement, scientific notation, significant figures, laws of combination, mole concept, empirical formula, stoichiometry, limiting reagent.",
    },
  },
  {
    type: "visualization",
    title: "Molecule Shapes 3D",
    slug: "molecule-shapes-3d",
    description: "Rotate school-level molecules and compare geometry, bond angles, and lone-pair effects.",
    route_url: "/labs/molecule-shapes-3d",
    class_level: "11",
    source_type: "SIMULATION",
    source_reference: "NCERT Class 11 Chemistry Chemical Bonding and Molecular Structure",
    status: "published",
    quality_status: "needs_review",
    student_level: "intermediate",
    estimated_minutes: 9,
  },
  {
    type: "simulation",
    title: "Chemistry Scale Universe",
    slug: "basic-concepts-chemistry-universe",
    description: "Explore matter, measurement, mole concept, and stoichiometry as a multi-zone Class 11 universe.",
    route_url: "/labs/basic-concepts-chemistry-universe",
    class_level: "11",
    source_type: "SIMULATION",
    source_reference: "NCERT Class 11 Chemistry Unit 1, Some Basic Concepts of Chemistry",
    status: "published",
    quality_status: "needs_review",
    student_level: "intermediate",
    estimated_minutes: 22,
  },
  {
    type: "simulation",
    title: "Redox Transfer Kitchen",
    slug: "redox-transfer-kitchen",
    description: "Learn oxidation and reduction through Paati's murukku story and an electron-transfer game.",
    route_url: "/labs/redox-transfer-kitchen",
    class_level: "10",
    source_type: "SIMULATION",
    status: "published",
  },
  {
    type: "simulation",
    title: "Hydrocarbon Naming Quest",
    slug: "hydrocarbon-naming-quest",
    description: "Learn IUPAC naming through an interactive carbon-chain naming game.",
    route_url: "/labs/hydrocarbon-naming-quest",
    class_level: "11",
    source_type: "SIMULATION",
    status: "published",
  },
];

export const publicApi = {
  getPublicSettings: () => backendClient.get<Record<string, unknown>>("/api/public/settings"),
  getClasses: () => backendClient.get<{ classes: BackendClass[] } | BackendClass[]>("/api/public/classes"),
  getClass: (classLevel: string) =>
    backendClient.get<{ class: BackendClass; resources?: BackendResource[] } | BackendClass>(
      `/api/public/classes/${classLevel}`,
    ),
  getResources: (params?: Record<string, string | number | boolean | null | undefined>) =>
    backendClient.get<{ resources: BackendResource[] } | BackendResource[]>("/api/public/resources", { query: params }),
  getResource: (slug: string) =>
    backendClient.get<{ resource: BackendResource } | BackendResource>(`/api/public/resources/${slug}`),
  getMemoryDecks: () => backendClient.get<{ decks: BackendMemoryDeck[] }>("/api/public/memory-decks"),
  getMemoryCards: (idOrSlug: string | number) =>
    backendClient.get<{ deck: BackendMemoryDeck; cards: BackendMemoryCard[] }>(`/api/public/memory-decks/${idOrSlug}/cards`),
  getQuickDrills: () => backendClient.get<{ drills: BackendQuickDrill[] }>("/api/public/quick-drills"),
  getQuickDrillQuestions: (idOrSlug: string | number) =>
    backendClient.get<{ drill: BackendQuickDrill; questions: BackendQuizQuestion[] }>(
      `/api/public/quick-drills/${idOrSlug}/questions`,
    ),
  getConceptMaps: () => backendClient.get<{ concept_maps: BackendConceptMap[] }>("/api/public/concept-maps"),
  getConceptMap: (idOrSlug: string | number) =>
    backendClient.get<{ concept_map: BackendConceptMap }>(`/api/public/concept-maps/${idOrSlug}`),
};

export function unwrapClasses(payload: Awaited<ReturnType<typeof publicApi.getClasses>>) {
  return Array.isArray(payload) ? payload : payload.classes;
}

export function unwrapResources(payload: Awaited<ReturnType<typeof publicApi.getResources>>) {
  return Array.isArray(payload) ? payload : payload.resources;
}
