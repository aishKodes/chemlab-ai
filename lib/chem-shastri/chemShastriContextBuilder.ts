import type { ChemShastriContext, ChemShastriLanguage, ChemShastriRequest, ChemShastriRole } from "./chemShastriTypes";

function normalizeLanguage(value?: string): ChemShastriLanguage {
  if (value === "hi" || value === "bn" || value === "or") return value;
  return "en";
}

function normalizeRole(value?: string): ChemShastriRole {
  if (value === "student" || value === "teacher" || value === "admin") return value;
  return "anonymous";
}

function pageType(path?: string): ChemShastriContext["pageType"] {
  if (!path) return "other";
  if (path === "/") return "home";
  if (path.startsWith("/learn")) return "learn";
  if (path.startsWith("/labs")) return "lab";
  if (path.startsWith("/simulations")) return "simulation";
  if (path.startsWith("/dashboard") || path.startsWith("/student") || path.startsWith("/teacher")) return "dashboard";
  if (path.startsWith("/resources") || path.startsWith("/classes")) return "resource";
  if (path.startsWith("/admin")) return "admin";
  return "other";
}

export function buildChemShastriContext(request: ChemShastriRequest): ChemShastriContext {
  const role = normalizeRole(request.role);
  const preferredLanguage = normalizeLanguage(request.preferredLanguage);
  const usePageContext = request.usePageContext !== false;
  const type = pageType(request.currentPage);
  const chips = [
    role !== "anonymous" ? role : "guest",
    request.classLevel ? `Class ${request.classLevel}` : undefined,
    preferredLanguage !== "en" ? preferredLanguage : "English",
    type && type !== "other" ? type : undefined,
    request.simulationSlug,
    request.resourceSlug,
  ].filter(Boolean) as string[];

  const learningSignals: string[] = [];
  if (type === "lab" && request.simulationSlug) {
    learningSignals.push(`The learner is inside the ${request.simulationSlug.replaceAll("-", " ")} lab.`);
  }
  if (request.simulationSlug === "redox-transfer-kitchen" || request.currentPage?.includes("redox-transfer-kitchen")) {
    learningSignals.push("Use Redox Transfer Kitchen context: redox is one electron transaction; zinc gives electrons, copper ion receives them, sulphate is spectator.");
  }
  if (request.simulationSlug === "hydrocarbon-naming-quest" || request.currentPage?.includes("hydrocarbon-naming-quest")) {
    learningSignals.push("Use Hydrocarbon Naming Quest context: longest chain, lowest locant, branch prefix, root word, and bond suffix.");
  }
  if (
    request.resourceSlug === "some-basic-concepts-of-chemistry" ||
    request.simulationSlug === "basic-concepts-chemistry-universe" ||
    request.chapterSlug === "some-basic-concepts-of-chemistry"
  ) {
    learningSignals.push(
      "Use Class 11 Unit 1 context: matter classification, SI units, scientific notation, significant figures, mole concept, formulas, stoichiometry, and limiting reagent.",
    );
  }
  if (request.simulationSlug === "molecule-shapes-3d" || request.currentPage?.includes("molecule-shapes-3d")) {
    learningSignals.push("Use Molecule Shapes 3D context: school-level VSEPR, geometry, bond angles, lone pairs, and shape comparisons.");
  }
  if (request.simulationSlug === "electrochemistry-power-grid" || request.currentPage?.includes("electrochemistry-power-grid")) {
    learningSignals.push(
      "Use Electrochemistry Power Grid context: Daniell cell, zinc anode, copper cathode, electron flow through wire, ion flow through salt bridge, cell notation, Ecell about 1.10 V, and Nernst concentration effect.",
    );
  }
  if (request.currentPage?.startsWith("/memory-cards")) {
    learningSignals.push("The learner is reviewing memory cards; answer briefly and include one recall check.");
  }
  if (request.currentPage?.startsWith("/quick-drills")) {
    learningSignals.push("The learner is in a quick drill; explain the misconception and the next move.");
  }
  if (request.currentPage?.startsWith("/concept-maps")) {
    learningSignals.push("The learner is using a concept map; connect ideas instead of giving isolated facts.");
  }
  if (request.currentPage?.includes("/resources/open-visualizations")) {
    learningSignals.push("The learner is viewing external resource curation; explain attribution and reviewed-resource safety clearly.");
  }
  if (role === "teacher") {
    learningSignals.push("The user is a teacher, so give classroom-ready wording when useful.");
  }
  if (request.classLevel) {
    learningSignals.push(`Keep the answer appropriate for Class ${request.classLevel}.`);
  }
  if (preferredLanguage !== "en") {
    learningSignals.push(`Prefer ${preferredLanguage} support if the student uses it; otherwise keep English clear.`);
  }

  return {
    role,
    classLevel: request.classLevel,
    preferredLanguage,
    currentPage: request.currentPage,
    pageType: type,
    resourceSlug: request.resourceSlug,
    simulationSlug: request.simulationSlug,
    chapterSlug: request.chapterSlug,
    topicSlug: request.topicSlug,
    usePageContext,
    chips,
    learningSignals,
  };
}

export function contextSummary(context: ChemShastriContext) {
  const lines = [
    `Role: ${context.role}`,
    context.classLevel ? `Class: ${context.classLevel}` : null,
    `Language preference: ${context.preferredLanguage}`,
    context.currentPage && context.usePageContext ? `Current page: ${context.currentPage}` : null,
    context.resourceSlug ? `Resource: ${context.resourceSlug}` : null,
    context.simulationSlug ? `Simulation: ${context.simulationSlug}` : null,
    context.learningSignals.length ? `Signals: ${context.learningSignals.join(" ")}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}
