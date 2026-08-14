import { BackendApiError } from "@/lib/api/apiErrors";
import { backendClient, getBackendBaseUrl } from "@/lib/api/backendClient";
import type {
  BackendAdminAnalyticsSummary,
  BackendBook,
  BackendChapter,
  BackendClass,
  BackendConceptMap,
  BackendContentBlock,
  BackendEmailLog,
  BackendEmailTemplate,
  BackendEnvelope,
  BackendLearningEvent,
  BackendMediaAsset,
  BackendMemoryCard,
  BackendMemoryDeck,
  BackendMistakePattern,
  BackendNotification,
  BackendQuizQuestion,
  BackendQuickDrill,
  BackendResource,
  BackendSiteSetting,
  BackendSubject,
  BackendTopic,
  BackendTranslation,
  BackendUser,
} from "@/lib/api/backendTypes";
import { clearAuthStorage, getStoredToken } from "@/lib/auth/tokenStorage";

export type AdminQuery = Record<string, string | number | boolean | null | undefined>;

type ListPayload<K extends string, T> = Record<K, T[]>;

function list<T, K extends string>(path: string, query?: AdminQuery) {
  return backendClient.get<ListPayload<K, T> | T[]>(path, { query });
}

function create<T>(path: string, payload: Partial<T> | Record<string, unknown>) {
  return backendClient.post<{ id?: number; created?: boolean; item?: T } | T>(path, payload);
}

function update<T>(path: string, payload: Partial<T> | Record<string, unknown>) {
  return backendClient.put<{ updated?: boolean; item?: T } | T>(path, payload);
}

async function uploadMultipart<T>(path: string, body: FormData): Promise<T> {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    throw new BackendApiError(
      "chemlearning account services are not connected yet. Media upload needs the Hostinger backend.",
      "BACKEND_NOT_CONFIGURED",
    );
  }

  const token = getStoredToken();
  const response = await fetch(new URL(path, baseUrl).toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  const payload = (await response.json().catch(() => null)) as BackendEnvelope<T> | null;
  if (response.status === 401) {
    clearAuthStorage();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("chemlab-auth-cleared"));
    }
  }

  if (!response.ok || !payload?.ok) {
    throw new BackendApiError(
      payload && !payload.ok ? payload.error.message : "The backend could not complete this upload.",
      payload && !payload.ok ? payload.error.code : "UPLOAD_FAILED",
      response.status,
    );
  }

  return payload.data;
}

export const adminApi = {
  getUsers: (params?: AdminQuery) => list<BackendUser, "users">("/api/admin/users", params),
  getUser: (id: number | string) => backendClient.get<{ user: BackendUser } | BackendUser>(`/api/admin/users/${id}`),
  updateUserStatus: (id: number | string, status: BackendUser["status"]) =>
    backendClient.put<{ updated: boolean }>(`/api/admin/users/${id}/status`, { status }),
  updateUserRole: (id: number | string, role: BackendUser["role"]) =>
    backendClient.put<{ updated: boolean; role: BackendUser["role"] }>(`/api/admin/users/${id}/role`, { role }),
  verifyTeacher: (id: number | string, verification_status: "unverified" | "pending" | "verified" = "verified") =>
    backendClient.post<{ updated: boolean; verification_status: string }>(`/api/admin/teachers/${id}/verify`, {
      verification_status,
    }),
  getTeacherProfile: (id: number | string) =>
    backendClient.get<{ profile: Partial<BackendUser> }>(`/api/admin/users/${id}/teacher-profile`),
  getStudentProfile: (id: number | string) =>
    backendClient.get<{ profile: Partial<BackendUser> }>(`/api/admin/users/${id}/student-profile`),

  getAdminClasses: (params?: AdminQuery) => list<BackendClass, "classes">("/api/admin/classes", params),
  createClass: (payload: Partial<BackendClass>) => create<BackendClass>("/api/admin/classes", payload),
  updateClass: (id: number | string, payload: Partial<BackendClass>) => update<BackendClass>(`/api/admin/classes/${id}`, payload),
  getSubjects: (params?: AdminQuery) => list<BackendSubject, "subjects">("/api/admin/subjects", params),
  createSubject: (payload: Partial<BackendSubject>) => create<BackendSubject>("/api/admin/subjects", payload),
  updateSubject: (id: number | string, payload: Partial<BackendSubject>) =>
    update<BackendSubject>(`/api/admin/subjects/${id}`, payload),
  getBooks: (params?: AdminQuery) => list<BackendBook, "books">("/api/admin/books", params),
  createBook: (payload: Partial<BackendBook>) => create<BackendBook>("/api/admin/books", payload),
  updateBook: (id: number | string, payload: Partial<BackendBook>) => update<BackendBook>(`/api/admin/books/${id}`, payload),
  getChapters: (params?: AdminQuery) => list<BackendChapter, "chapters">("/api/admin/chapters", params),
  createChapter: (payload: Partial<BackendChapter>) => create<BackendChapter>("/api/admin/chapters", payload),
  updateChapter: (id: number | string, payload: Partial<BackendChapter>) =>
    update<BackendChapter>(`/api/admin/chapters/${id}`, payload),
  getTopics: (params?: AdminQuery) => list<BackendTopic, "topics">("/api/admin/topics", params),
  createTopic: (payload: Partial<BackendTopic>) => create<BackendTopic>("/api/admin/topics", payload),
  updateTopic: (id: number | string, payload: Partial<BackendTopic>) => update<BackendTopic>(`/api/admin/topics/${id}`, payload),

  getResources: (params?: AdminQuery) => list<BackendResource, "resources">("/api/admin/resources", params),
  getResource: (id: number | string) =>
    backendClient.get<{ resource: BackendResource } | BackendResource>(`/api/admin/resources/${id}`),
  createResource: (payload: Partial<BackendResource>) => create<BackendResource>("/api/admin/resources", payload),
  updateResource: (id: number | string, payload: Partial<BackendResource>) =>
    update<BackendResource>(`/api/admin/resources/${id}`, payload),
  publishResource: (id: number | string) => backendClient.post<{ updated: boolean; status: string }>(`/api/admin/resources/${id}/publish`),
  archiveResource: (id: number | string) => backendClient.post<{ updated: boolean; status: string }>(`/api/admin/resources/${id}/archive`),
  attachResourceToTopic: (resourceId: number | string, payload: Pick<BackendResource, "chapter_id" | "topic_id" | "class_id" | "subject_id">) =>
    update<BackendResource>(`/api/admin/resources/${resourceId}`, payload),

  getMemoryDecks: (params?: AdminQuery) => list<BackendMemoryDeck, "decks">("/api/admin/memory-decks", params),
  createMemoryDeck: (payload: Partial<BackendMemoryDeck>) => create<BackendMemoryDeck>("/api/admin/memory-decks", payload),
  updateMemoryDeck: (id: number | string, payload: Partial<BackendMemoryDeck>) =>
    update<BackendMemoryDeck>(`/api/admin/memory-decks/${id}`, payload),
  getMemoryCards: (deckId?: number | string) =>
    list<BackendMemoryCard, "cards">("/api/admin/memory-cards", deckId ? { deck_id: deckId } : undefined),
  createMemoryCard: (payload: Partial<BackendMemoryCard>) => create<BackendMemoryCard>("/api/admin/memory-cards", payload),
  updateMemoryCard: (id: number | string, payload: Partial<BackendMemoryCard>) =>
    update<BackendMemoryCard>(`/api/admin/memory-cards/${id}`, payload),
  deleteMemoryCard: (id: number | string) => backendClient.delete<{ deleted: boolean }>(`/api/admin/memory-cards/${id}`),

  getQuickDrills: (params?: AdminQuery) => list<BackendQuickDrill, "drills">("/api/admin/quick-drills", params),
  createQuickDrill: (payload: Partial<BackendQuickDrill>) => create<BackendQuickDrill>("/api/admin/quick-drills", payload),
  updateQuickDrill: (id: number | string, payload: Partial<BackendQuickDrill>) =>
    update<BackendQuickDrill>(`/api/admin/quick-drills/${id}`, payload),
  getQuizQuestions: (drillId?: number | string) =>
    list<BackendQuizQuestion, "questions">("/api/admin/quiz-questions", drillId ? { drill_id: drillId } : undefined),
  createQuizQuestion: (payload: Partial<BackendQuizQuestion>) => create<BackendQuizQuestion>("/api/admin/quiz-questions", payload),
  updateQuizQuestion: (id: number | string, payload: Partial<BackendQuizQuestion>) =>
    update<BackendQuizQuestion>(`/api/admin/quiz-questions/${id}`, payload),
  deleteQuizQuestion: (id: number | string) => backendClient.delete<{ deleted: boolean }>(`/api/admin/quiz-questions/${id}`),

  getConceptMaps: (params?: AdminQuery) => list<BackendConceptMap, "concept_maps">("/api/admin/concept-maps", params),
  createConceptMap: (payload: Partial<BackendConceptMap>) => create<BackendConceptMap>("/api/admin/concept-maps", payload),
  updateConceptMap: (id: number | string, payload: Partial<BackendConceptMap>) =>
    update<BackendConceptMap>(`/api/admin/concept-maps/${id}`, payload),
  getMistakePatterns: (params?: AdminQuery) => list<BackendMistakePattern, "mistake_patterns">("/api/admin/mistake-patterns", params),
  createMistakePattern: (payload: Partial<BackendMistakePattern>) =>
    create<BackendMistakePattern>("/api/admin/mistake-patterns", payload),
  updateMistakePattern: (id: number | string, payload: Partial<BackendMistakePattern>) =>
    update<BackendMistakePattern>(`/api/admin/mistake-patterns/${id}`, payload),

  getContentBlocks: (params?: AdminQuery) => list<BackendContentBlock, "content">("/api/admin/content", params),
  createContentBlock: (payload: Partial<BackendContentBlock>) => create<BackendContentBlock>("/api/admin/content", payload),
  updateContentBlock: (id: number | string, payload: Partial<BackendContentBlock>) =>
    update<BackendContentBlock>(`/api/admin/content/${id}`, payload),
  getTranslations: (params?: AdminQuery) => list<BackendTranslation, "translations">("/api/admin/translations", params),
  updateTranslation: (id: number | string, payload: Partial<BackendTranslation>) =>
    update<BackendTranslation>(`/api/admin/translations/${id}`, payload),

  getMediaAssets: (params?: AdminQuery) => list<BackendMediaAsset, "media">("/api/admin/media", params),
  uploadMedia: (file: File, metadata: Partial<BackendMediaAsset> = {}) => {
    const body = new FormData();
    body.set("file", file);
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) body.set(key, String(value));
    });
    return uploadMultipart<{ id: number; file_url: string }>("/api/admin/media/upload", body);
  },
  updateMedia: (id: number | string, payload: Partial<BackendMediaAsset>) => update<BackendMediaAsset>(`/api/admin/media/${id}`, payload),
  archiveMedia: (id: number | string) => backendClient.post<{ archived: boolean }>(`/api/admin/media/${id}/archive`),

  getEmailTemplates: (params?: AdminQuery) => list<BackendEmailTemplate, "templates">("/api/admin/email-templates", params),
  updateEmailTemplate: (id: number | string, payload: Partial<BackendEmailTemplate>) =>
    update<BackendEmailTemplate>(`/api/admin/email-templates/${id}`, payload),
  sendTestEmail: (payload: { to?: string; to_email?: string }) =>
    backendClient.post<{ mail?: unknown }>("/api/admin/email/test", { to_email: payload.to_email ?? payload.to }),
  getEmailLogs: (params?: AdminQuery) => list<BackendEmailLog, "logs">("/api/admin/email-logs", params),

  getNotifications: (params?: AdminQuery) => list<BackendNotification, "notifications">("/api/admin/notifications", params),
  sendNotification: (payload: Partial<BackendNotification> & { role_target?: BackendUser["role"] | "all" }) =>
    backendClient.post<{ id: number }>("/api/admin/notifications/send", payload),

  getSettings: (params?: AdminQuery) => list<BackendSiteSetting, "settings">("/api/admin/settings", params),
  updateSetting: (key: string, payload: Partial<BackendSiteSetting>) =>
    backendClient.put<{ updated: boolean }>(`/api/admin/settings/${key}`, payload),

  getAdminAnalyticsSummary: () => backendClient.get<BackendAdminAnalyticsSummary>("/api/admin/analytics/summary"),
  getLearningEvents: (params?: AdminQuery) => list<BackendLearningEvent, "events">("/api/admin/analytics/events", params),
  getChemShastriSummary: () => backendClient.get<Record<string, unknown>>("/api/admin/chem-shastri/summary"),
  getChemShastriQuestions: (params?: AdminQuery) =>
    backendClient.get<{ questions: Record<string, unknown>[] }>("/api/admin/chem-shastri/questions", { query: params }),
  getChemShastriUsage: (params?: AdminQuery) =>
    backendClient.get<{ usage: Record<string, unknown>[] }>("/api/admin/chem-shastri/usage", { query: params }),
  testChemShastri: (payload: { message: string; classLevel?: string }) =>
    backendClient.post<Record<string, unknown>>("/api/admin/chem-shastri/test", payload),
  testChemShastriRetrieval: (payload: { query: string; classLevel?: string }) =>
    backendClient.post<{ resources: BackendResource[] }>("/api/admin/chem-shastri/retrieval-test", payload),
};

export function unwrapAdminList<T, K extends string>(payload: ListPayload<K, T> | T[], key: K): T[] {
  return Array.isArray(payload) ? payload : payload[key] ?? [];
}
