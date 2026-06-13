create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists ncert_books (
  id uuid primary key default gen_random_uuid(),
  class_level text,
  subject text default 'chemistry',
  book_title text not null,
  book_code text unique,
  language text default 'en',
  source_url text,
  local_file_path text,
  academic_year text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ncert_chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references ncert_books(id) on delete cascade,
  chapter_number int,
  chapter_title text,
  chapter_slug text,
  class_level text,
  subject text default 'chemistry',
  page_start int,
  page_end int,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  source_type text check (source_type in ('ncert','chemlab_note','faq','simulation_script','teacher_verified')) default 'ncert',
  source_id uuid,
  class_level text,
  subject text default 'chemistry',
  chapter_id uuid references ncert_chapters(id) on delete set null,
  chapter_slug text,
  topic_slug text,
  title text,
  raw_text text,
  metadata jsonb default '{}'::jsonb,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references knowledge_documents(id) on delete cascade,
  chunk_index int,
  class_level text,
  subject text default 'chemistry',
  chapter_slug text,
  topic_slug text,
  title text,
  chunk_text text not null,
  clean_text text,
  token_count int,
  page_start int,
  page_end int,
  source_citation text,
  metadata jsonb default '{}'::jsonb,
  content_hash text unique,
  embedding_provider text,
  embedding_model text,
  embedding_dimension int,
  embedding vector(768),
  embedding_json jsonb,
  status text default 'active',
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists knowledge_chunks_lookup_idx on knowledge_chunks(subject, class_level, chapter_slug, status);
create index if not exists knowledge_chunks_embedding_model_idx on knowledge_chunks(embedding_provider, embedding_model);

create table if not exists master_alchem_faqs (
  id uuid primary key default gen_random_uuid(),
  status text default 'draft',
  subject text default 'chemistry',
  class_level text,
  chapter_slug text,
  topic_slug text,
  question text not null,
  normalized_question text not null,
  alternate_questions jsonb default '[]'::jsonb,
  short_answer text,
  full_answer text,
  master_alchem_style_answer text,
  key_points jsonb default '[]'::jsonb,
  equations jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  difficulty text,
  verified_by uuid,
  last_reviewed_at timestamptz,
  usage_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists master_alchem_faqs_normalized_idx on master_alchem_faqs(normalized_question, coalesce(class_level, ''), coalesce(chapter_slug, ''));

create table if not exists faq_embeddings (
  id uuid primary key default gen_random_uuid(),
  faq_id uuid references master_alchem_faqs(id) on delete cascade,
  question_text text,
  normalized_question text,
  embedding_provider text,
  embedding_model text,
  embedding_dimension int,
  embedding vector(768),
  embedding_json jsonb,
  created_at timestamptz default now()
);

create table if not exists misconceptions (
  id uuid primary key default gen_random_uuid(),
  subject text default 'chemistry',
  class_level text,
  chapter_slug text,
  topic_slug text,
  misconception_key text unique,
  misconception_text text,
  correct_idea text,
  detection_phrases jsonb default '[]'::jsonb,
  gentle_correction text,
  related_faq_ids jsonb default '[]'::jsonb,
  related_chunk_ids jsonb default '[]'::jsonb,
  severity text default 'medium',
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists master_alchem_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  anonymous_id text,
  session_id text,
  title text,
  class_level text,
  subject text default 'chemistry',
  chapter_slug text,
  topic_slug text,
  simulation_slug text,
  mode text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists master_alchem_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references master_alchem_conversations(id) on delete cascade,
  role text check (role in ('user','assistant','system','tool')),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists ai_requests (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid,
  user_id uuid,
  anonymous_id text,
  endpoint text,
  intent text,
  mode text,
  provider text,
  model text,
  embedding_provider text,
  embedding_model text,
  prompt_hash text,
  input_chars int,
  output_chars int,
  estimated_input_tokens int,
  estimated_output_tokens int,
  actual_input_tokens int,
  actual_output_tokens int,
  estimated_cost_usd numeric default 0,
  latency_ms int,
  cache_hit boolean default false,
  rag_used boolean default false,
  safety_status text,
  status text,
  error_message text,
  created_at timestamptz default now()
);

create table if not exists ai_answer_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key text unique not null,
  normalized_question text,
  question_hash text,
  class_level text,
  subject text default 'chemistry',
  chapter_slug text,
  topic_slug text,
  mode text,
  answer text,
  citations jsonb default '[]'::jsonb,
  provider text,
  model text,
  rag_chunk_ids jsonb default '[]'::jsonb,
  hit_count int default 0,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists embedding_cache (
  id uuid primary key default gen_random_uuid(),
  text_hash text not null,
  text_preview text,
  provider text,
  model text,
  dimension int,
  embedding vector(768),
  embedding_json jsonb,
  created_at timestamptz default now(),
  unique(text_hash, provider, model)
);

create table if not exists rag_retrieval_logs (
  id uuid primary key default gen_random_uuid(),
  ai_request_id uuid references ai_requests(id) on delete set null,
  query text,
  normalized_query text,
  class_level text,
  subject text default 'chemistry',
  chapter_slug text,
  topic_slug text,
  retrieval_method text,
  top_k int,
  returned_chunk_ids jsonb default '[]'::jsonb,
  scores jsonb default '[]'::jsonb,
  selected_chunk_ids jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists unanswered_questions (
  id uuid primary key default gen_random_uuid(),
  question text,
  normalized_question text,
  class_level text,
  subject text default 'chemistry',
  chapter_slug text,
  topic_slug text,
  frequency int default 1,
  last_asked_at timestamptz default now(),
  sample_conversation_id uuid,
  status text default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists learning_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  anonymous_id text,
  session_id text,
  event_type text,
  event_name text,
  page_path text,
  lab_slug text,
  simulation_slug text,
  class_level text,
  subject text,
  chapter_slug text,
  topic_slug text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table student_progress add column if not exists class_level text;
alter table student_progress add column if not exists subject text default 'chemistry';
alter table student_progress add column if not exists topic_slug text;
alter table student_progress add column if not exists progress_percent numeric default 0;
alter table student_progress add column if not exists xp int default 0;
alter table student_progress add column if not exists current_level int default 1;
alter table student_progress add column if not exists completed_lessons jsonb default '[]'::jsonb;
alter table student_progress add column if not exists completed_labs jsonb default '[]'::jsonb;
alter table student_progress add column if not exists completed_quizzes jsonb default '[]'::jsonb;
alter table student_progress add column if not exists updated_at timestamptz default now();

create table if not exists student_misconceptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  anonymous_id text,
  class_level text,
  subject text default 'chemistry',
  chapter_slug text,
  topic_slug text,
  misconception_key text,
  detected_from text,
  confidence numeric,
  resolved boolean default false,
  resolved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table quiz_attempts add column if not exists class_level text;
alter table quiz_attempts add column if not exists subject text default 'chemistry';
alter table quiz_attempts add column if not exists topic_slug text;
alter table quiz_attempts add column if not exists quiz_id text;
alter table quiz_attempts add column if not exists total_questions int;
alter table quiz_attempts add column if not exists time_taken_seconds int;
alter table quiz_attempts add column if not exists answers jsonb default '[]'::jsonb;

create table if not exists simulation_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  anonymous_id text,
  simulation_slug text,
  class_level text,
  subject text default 'chemistry',
  chapter_slug text,
  started_at timestamptz default now(),
  completed_at timestamptz,
  completion_percent numeric default 0,
  score int,
  mistakes jsonb default '[]'::jsonb,
  events jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  anonymous_id text,
  session_id text,
  path text,
  referrer text,
  user_agent_hash text,
  device_type text,
  country text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists feature_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  anonymous_id text,
  session_id text,
  feature text,
  action text,
  label text,
  value numeric,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists daily_analytics_rollups (
  id uuid primary key default gen_random_uuid(),
  date date unique,
  total_page_views int default 0,
  unique_sessions int default 0,
  ai_messages int default 0,
  ai_cost_usd numeric default 0,
  cache_hit_rate numeric default 0,
  rag_usage_count int default 0,
  top_chapters jsonb default '[]'::jsonb,
  top_questions jsonb default '[]'::jsonb,
  top_simulations jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table ncert_books enable row level security;
alter table ncert_chapters enable row level security;
alter table knowledge_documents enable row level security;
alter table knowledge_chunks enable row level security;
alter table master_alchem_faqs enable row level security;
alter table faq_embeddings enable row level security;
alter table misconceptions enable row level security;
alter table master_alchem_conversations enable row level security;
alter table master_alchem_messages enable row level security;
alter table ai_requests enable row level security;
alter table ai_answer_cache enable row level security;
alter table embedding_cache enable row level security;
alter table rag_retrieval_logs enable row level security;
alter table unanswered_questions enable row level security;
alter table learning_events enable row level security;
alter table student_misconceptions enable row level security;
alter table simulation_runs enable row level security;
alter table page_views enable row level security;
alter table feature_events enable row level security;
alter table daily_analytics_rollups enable row level security;

drop policy if exists "public active knowledge read" on knowledge_chunks;
create policy "public active knowledge read" on knowledge_chunks for select using (status = 'active');

drop policy if exists "admin manage knowledge chunks" on knowledge_chunks;
create policy "admin manage knowledge chunks" on knowledge_chunks for all using (is_admin()) with check (is_admin());

drop policy if exists "public verified faq read" on master_alchem_faqs;
create policy "public verified faq read" on master_alchem_faqs for select using (status = 'verified');

drop policy if exists "admin manage faqs" on master_alchem_faqs;
create policy "admin manage faqs" on master_alchem_faqs for all using (is_admin()) with check (is_admin());
