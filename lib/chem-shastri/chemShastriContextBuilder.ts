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
