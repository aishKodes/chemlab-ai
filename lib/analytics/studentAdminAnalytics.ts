import { analyticsAdminApi } from "@/lib/api/analyticsAdminApi";

export type AnalyticsRow = Record<string, unknown> & { id?: number | string };

export type StudentAnalyticsSources = {
  students: AnalyticsRow[];
  events: AnalyticsRow[];
  resourceSessions: AnalyticsRow[];
  simulationSessions: AnalyticsRow[];
  mistakes: AnalyticsRow[];
  questions: AnalyticsRow[];
  activeStudents: number;
};

export type StudentAnalyticsProfile = {
  student: AnalyticsRow;
  events: AnalyticsRow[];
  resourceSessions: AnalyticsRow[];
  simulationSessions: AnalyticsRow[];
  mistakes: AnalyticsRow[];
  questions: AnalyticsRow[];
  feedback: AnalyticsRow[];
  activeDays: number;
  activityCount: number;
  completedSimulations: number;
  totalSimulationMinutes: number;
  lastActiveAt?: string;
  engagementScore: number;
  topEvents: Array<{ label: string; total: number }>;
  topSimulations: Array<{ label: string; total: number }>;
};

export async function loadStudentAnalyticsSources(): Promise<StudentAnalyticsSources> {
  const [studentsPayload, eventsPayload, resourcesPayload, simulationsPayload, mistakesPayload, questionsPayload] =
    await Promise.all([
      analyticsAdminApi.students(),
      analyticsAdminApi.events(),
      analyticsAdminApi.resources(),
      analyticsAdminApi.simulations(),
      analyticsAdminApi.mistakes(),
      analyticsAdminApi.chemShastri(),
    ]);

  return {
    students: asRows(studentsPayload.students),
    events: asRows(eventsPayload.events),
    resourceSessions: asRows(resourcesPayload.sessions),
    simulationSessions: asRows(simulationsPayload.sessions),
    mistakes: asRows(mistakesPayload.mistakes),
    questions: asRows(questionsPayload.questions),
    activeStudents: numberValue(studentsPayload.active_students),
  };
}

export function buildStudentAnalyticsProfile(
  sources: StudentAnalyticsSources,
  studentId: number | string,
): StudentAnalyticsProfile | null {
  const normalizedId = String(studentId);
  const student = sources.students.find((row) => String(row.id) === normalizedId);
  if (!student) return null;

  const events = forUser(sources.events, normalizedId);
  const resourceSessions = forUser(sources.resourceSessions, normalizedId);
  const simulationSessions = forUser(sources.simulationSessions, normalizedId);
  const mistakes = forUser(sources.mistakes, normalizedId);
  const questions = forUser(sources.questions, normalizedId);
  const feedback = events.filter((row) => row.event_name === "student_feedback_submitted");
  const allActivity = [...events, ...resourceSessions, ...simulationSessions, ...mistakes, ...questions];
  const activityDates = allActivity.map((row) => dateValue(row.created_at)).filter(Boolean) as string[];
  const activeDays = new Set(activityDates.map((value) => value.slice(0, 10))).size;
  const completedSimulations = simulationSessions.filter((row) => booleanValue(row.completed)).length;
  const totalSimulationMinutes = Math.round(
    simulationSessions.reduce((sum, row) => sum + numberValue(row.duration_seconds), 0) / 60,
  );
  const activityCount = allActivity.length;

  return {
    student,
    events: sortNewest(events),
    resourceSessions: sortNewest(resourceSessions),
    simulationSessions: sortNewest(simulationSessions),
    mistakes: sortNewest(mistakes),
    questions: sortNewest(questions),
    feedback: sortNewest(feedback),
    activeDays,
    activityCount,
    completedSimulations,
    totalSimulationMinutes,
    lastActiveAt: [...activityDates].sort((a, b) => b.localeCompare(a))[0],
    engagementScore: Math.min(
      100,
      activityCount * 2 + activeDays * 5 + completedSimulations * 8 + Math.min(questions.length * 3, 15),
    ),
    topEvents: groupRows(events, "event_name"),
    topSimulations: groupRows(simulationSessions, "simulation_slug"),
  } satisfies StudentAnalyticsProfile;
}

export function buildAllStudentProfiles(sources: StudentAnalyticsSources): StudentAnalyticsProfile[] {
  return sources.students.flatMap((student) => {
    const profile = buildStudentAnalyticsProfile(sources, student.id ?? "");
    return profile ? [profile] : [];
  });
}

export function metadataFromRow(row: AnalyticsRow) {
  const value = row.metadata;
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export function displayDate(value: unknown) {
  if (typeof value !== "string" || !value) return "No activity yet";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function studentNameForRow(students: AnalyticsRow[], row: AnalyticsRow) {
  const id = String(row.user_id ?? "");
  return String(students.find((student) => String(student.id) === id)?.name ?? (id ? `Student #${id}` : "Anonymous learner"));
}

export function dedupeQuestionRows(rows: AnalyticsRow[]) {
  const kept: AnalyticsRow[] = [];
  for (const row of sortNewest(rows)) {
    const duplicateIndex = kept.findIndex((candidate) => isPairedQuestionLog(candidate, row));
    if (duplicateIndex < 0) {
      kept.push(row);
      continue;
    }
    if (!kept[duplicateIndex].user_id && row.user_id) kept[duplicateIndex] = row;
  }
  return kept;
}

function forUser(rows: AnalyticsRow[], id: string) {
  return rows.filter((row) => String(row.user_id ?? "") === id);
}

function groupRows(rows: AnalyticsRow[], key: string) {
  const groups = new Map<string, number>();
  rows.forEach((row) => {
    const label = String(row[key] ?? "").trim();
    if (label) groups.set(label, (groups.get(label) ?? 0) + 1);
  });
  return [...groups.entries()]
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
}

function sortNewest(rows: AnalyticsRow[]) {
  return [...rows].sort((a, b) => dateValue(b.created_at).localeCompare(dateValue(a.created_at)));
}

function asRows(value: unknown): AnalyticsRow[] {
  return Array.isArray(value) ? (value.filter((row) => row && typeof row === "object") as AnalyticsRow[]) : [];
}

function dateValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function booleanValue(value: unknown) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function isPairedQuestionLog(left: AnalyticsRow, right: AnalyticsRow) {
  const sameQuestion = left.normalized_question_hash && right.normalized_question_hash
    ? left.normalized_question_hash === right.normalized_question_hash
    : String(left.question_text ?? "").trim().toLowerCase() === String(right.question_text ?? "").trim().toLowerCase();
  if (!sameQuestion) return false;
  if (left.anonymous_id && right.anonymous_id && left.anonymous_id !== right.anonymous_id) return false;

  const leftTime = new Date(String(left.created_at ?? "").replace(" ", "T")).getTime();
  const rightTime = new Date(String(right.created_at ?? "").replace(" ", "T")).getTime();
  return Number.isFinite(leftTime) && Number.isFinite(rightTime) && Math.abs(leftTime - rightTime) <= 30_000;
}
