export type BackendOk<T> = {
  ok: true;
  data: T;
};

export type BackendErrorPayload = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};

export type BackendEnvelope<T> = BackendOk<T> | BackendErrorPayload;

export type UserRole = "student" | "teacher" | "admin";

export type BackendUser = {
  id?: number;
  uuid?: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  preferred_language?: string | null;
  status?: "pending" | "active" | "blocked" | "deleted";
  email_verified_at?: string | null;
  last_login_at?: string | null;
  class_level?: "9" | "10" | "11" | "12" | null;
  board?: string | null;
  school_name?: string | null;
  learning_goal?: string | null;
  school_or_institute?: string | null;
  subject?: string | null;
  classes_taught?: string[] | string | null;
  verification_status?: "unverified" | "pending" | "verified" | null;
  created_at?: string;
  updated_at?: string;
};

export type AuthSession = {
  user: BackendUser;
  token: string;
  expires_at?: string;
};

export type BackendClass = {
  id?: number;
  class_level: "9" | "10" | "11" | "12";
  display_name: string;
  status?: "active" | "hidden";
  subjects?: BackendSubject[];
};

export type BackendSubject = {
  id?: number;
  class_id?: number;
  name: string;
  subject_type: "science" | "chemistry";
  status?: "active" | "hidden";
};

export type BackendBook = {
  id?: number;
  class_id: number;
  subject_id: number;
  title: string;
  source?: "NCERT" | "CUSTOM";
  language?: string;
  status?: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
};

export type BackendChapter = {
  id?: number;
  book_id: number;
  class_id: number;
  subject_id: number;
  chapter_number?: number | null;
  title: string;
  slug: string;
  status?: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
};

export type BackendTopic = {
  id?: number;
  chapter_id: number;
  class_id: number;
  subject_id: number;
  title: string;
  slug: string;
  order_index?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  status?: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
};

export type BackendResource = {
  id?: number;
  uuid?: string;
  class_id?: number | null;
  class_level?: string | null;
  subject_id?: number | null;
  chapter_id?: number | null;
  topic_id?: number | null;
  type: string;
  title: string;
  slug: string;
  description?: string | null;
  route_url?: string | null;
  content_json?: Record<string, unknown> | string | null;
  source_type?: string | null;
  source_reference?: string | null;
  status?: "draft" | "published" | "archived";
  topic?: string | null;
  approved_by?: number | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BackendContentBlock = {
  id?: number;
  block_key: string;
  page_slug: string;
  section?: string | null;
  type: "text" | "rich_text" | "image" | "json" | "link" | "cta" | "seo";
  status?: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
};

export type BackendTranslation = {
  id?: number;
  block_id: number;
  language: string;
  title?: string | null;
  body?: string | null;
  value_json?: Record<string, unknown> | string | null;
  created_at?: string;
  updated_at?: string;
};

export type BackendMediaAsset = {
  id?: number;
  uuid?: string;
  title?: string | null;
  alt_text?: string | null;
  file_url: string;
  file_path?: string;
  mime_type?: string;
  size_bytes?: number;
  width?: number | null;
  height?: number | null;
  uploaded_by?: number | null;
  usage_context?: string | null;
  status?: "active" | "archived" | "deleted";
  created_at?: string;
  updated_at?: string;
};

export type BackendEmailTemplate = {
  id?: number;
  template_key: string;
  subject: string;
  body_html: string;
  body_text?: string | null;
  language?: string;
  status?: "active" | "draft" | "archived";
  created_at?: string;
  updated_at?: string;
};

export type BackendEmailLog = {
  id?: number;
  user_id?: number | null;
  to_email: string;
  subject: string;
  template_key?: string | null;
  status?: "queued" | "sent" | "failed";
  provider?: string;
  error_message?: string | null;
  sent_at?: string | null;
  created_at?: string;
};

export type BackendMemoryDeck = {
  id?: number;
  uuid?: string;
  class_id?: number | null;
  subject_id?: number | null;
  chapter_id?: number | null;
  topic_id?: number | null;
  resource_id?: number | null;
  title: string;
  slug: string;
  description?: string | null;
  language?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  status?: "draft" | "published" | "archived";
  source_type?: string;
  source_reference?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BackendMemoryCard = {
  id?: number;
  deck_id: number;
  front: string;
  back: string;
  hint?: string | null;
  explanation?: string | null;
  difficulty?: "beginner" | "intermediate" | "advanced";
  card_type?: "concept" | "formula" | "definition" | "mistake" | "application";
  mistake_type?: string | null;
  source_reference?: string | null;
  order_index?: number;
  status?: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
};

export type BackendQuickDrill = {
  id?: number;
  uuid?: string;
  class_id?: number | null;
  subject_id?: number | null;
  chapter_id?: number | null;
  topic_id?: number | null;
  resource_id?: number | null;
  title: string;
  slug: string;
  description?: string | null;
  language?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimated_minutes?: number;
  status?: "draft" | "published" | "archived";
  source_type?: string;
  source_reference?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BackendQuizQuestion = {
  id?: number;
  drill_id?: number | null;
  class_id?: number | null;
  subject_id?: number | null;
  chapter_id?: number | null;
  topic_id?: number | null;
  question_text: string;
  question_type?: "mcq" | "multi_select" | "true_false" | "short_answer";
  options_json?: string[] | Record<string, unknown> | string | null;
  correct_answer_json?: string[] | Record<string, unknown> | string | null;
  explanation?: string | null;
  hint?: string | null;
  difficulty?: "beginner" | "intermediate" | "advanced";
  mistake_type?: string | null;
  source_reference?: string | null;
  order_index?: number;
  status?: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
};

export type BackendConceptMap = {
  id?: number;
  uuid?: string;
  class_id?: number | null;
  subject_id?: number | null;
  chapter_id?: number | null;
  topic_id?: number | null;
  title: string;
  slug: string;
  description?: string | null;
  map_json?: Record<string, unknown> | string | null;
  status?: "draft" | "published" | "archived";
  source_reference?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BackendMistakePattern = {
  id?: number;
  class_id?: number | null;
  subject_id?: number | null;
  chapter_id?: number | null;
  topic_id?: number | null;
  resource_id?: number | null;
  mistake_key: string;
  title: string;
  description?: string | null;
  correction?: string | null;
  example?: string | null;
  severity?: "low" | "medium" | "high";
  status?: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
};

export type BackendSiteSetting = {
  id?: number;
  setting_key: string;
  setting_value?: string | null;
  setting_json?: Record<string, unknown> | string | null;
  type?: "string" | "number" | "boolean" | "json" | "image" | "secret_ref";
  is_public?: 0 | 1 | boolean;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type BackendLearningEvent = LearningEventPayload & {
  id?: number;
  user_id?: number | null;
  created_at?: string;
};

export type BackendAdminAnalyticsSummary = {
  summary?: Record<string, number>;
  top_events?: Array<{ event_name: string; total: number | string }>;
  recent_events?: BackendLearningEvent[];
  recent_rollups?: BackendDailyLearningRollup[];
};

export type BackendNotification = {
  id: number;
  user_id?: number | null;
  role_target?: UserRole | "all" | null;
  title: string;
  body: string;
  type?: string;
  read_at?: string | null;
  action_url?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
};

export type LearningEventPayload = {
  event_type: "learning" | "simulation" | "resource" | "ai" | "auth" | "page";
  event_name: string;
  anonymous_id?: string;
  session_id?: string;
  class_id?: number;
  subject_id?: number;
  chapter_id?: number;
  topic_id?: number;
  resource_id?: number;
  page_path?: string;
  metadata?: Record<string, unknown>;
};

export type BackendMemoryProgress = {
  id?: number;
  user_id?: number | null;
  anonymous_id?: string | null;
  deck_id: number;
  card_id: number;
  ease_score?: number | string;
  review_count?: number;
  forgot_count?: number;
  hard_count?: number;
  last_rating?: string | null;
  last_reviewed_at?: string | null;
  next_review_at?: string | null;
  mastered?: 0 | 1 | boolean;
};

export type BackendQuizAttempt = {
  id?: number;
  uuid?: string;
  user_id?: number | null;
  anonymous_id?: string | null;
  drill_id: number;
  started_at?: string;
  completed_at?: string | null;
  duration_seconds?: number;
  score?: number;
  total_questions?: number;
  correct_count?: number;
  wrong_count?: number;
  completed?: 0 | 1 | boolean;
  answers?: BackendQuizAnswer[];
};

export type BackendQuizAnswer = {
  id?: number;
  attempt_id: number;
  question_id: number;
  selected_answer_json?: unknown;
  correct_answer_json?: unknown;
  is_correct?: 0 | 1 | boolean;
  explanation_shown?: string | null;
};

export type BackendResourceSession = {
  resource_session_id?: number;
  uuid?: string;
};

export type BackendSimulationSession = {
  simulation_session_id?: number;
  uuid?: string;
};

export type BackendDailyLearningRollup = {
  id?: number;
  rollup_date: string;
  user_id?: number | null;
  class_id?: number | null;
  chapter_id?: number | null;
  topic_id?: number | null;
  resource_id?: number | null;
  events_count?: number;
  resources_viewed?: number;
  simulations_started?: number;
  simulations_completed?: number;
  mistakes_count?: number;
  memory_reviews_count?: number;
  quick_drill_attempts_count?: number;
  chem_shastri_questions_count?: number;
  total_time_seconds?: number;
  enjoyment_score_avg?: number | string | null;
  created_at?: string;
  updated_at?: string;
};

export type BackendClassroom = {
  id?: number;
  uuid?: string;
  teacher_user_id?: number;
  name: string;
  class_level?: "9" | "10" | "11" | "12" | null;
  subject?: string;
  join_code?: string | null;
  status?: "active" | "archived";
  student_count?: number | string;
  created_at?: string;
  updated_at?: string;
};

export type BackendTeacherAssignment = {
  id?: number;
  uuid?: string;
  teacher_user_id?: number;
  classroom_id?: number | null;
  classroom_name?: string | null;
  resource_id?: number | null;
  deck_id?: number | null;
  drill_id?: number | null;
  title: string;
  instructions?: string | null;
  due_at?: string | null;
  status?: "draft" | "assigned" | "archived";
  progress_status?: "not_started" | "in_progress" | "completed" | null;
  score?: number | string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};
