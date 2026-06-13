create extension if not exists pgcrypto;

create table if not exists ai_daily_budget (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  budget_inr numeric default 50,
  used_inr numeric default 0,
  used_usd numeric default 0,
  ai_requests_count int default 0,
  voice_requests_count int default 0,
  cache_hits int default 0,
  rag_only_answers int default 0,
  blocked_requests int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table ai_requests add column if not exists session_id text;
alter table ai_requests add column if not exists question_hash text;
alter table ai_requests add column if not exists input_tokens_est int;
alter table ai_requests add column if not exists output_tokens_est int;
alter table ai_requests add column if not exists cost_usd_est numeric default 0;
alter table ai_requests add column if not exists cost_inr_est numeric default 0;
alter table ai_requests add column if not exists fallback_used boolean default false;
alter table ai_requests add column if not exists blocked_by_budget boolean default false;

alter table knowledge_documents add column if not exists book_title text;
alter table knowledge_documents add column if not exists chapter_title text;
alter table knowledge_documents add column if not exists source_reference text;

alter table knowledge_chunks add column if not exists keywords jsonb default '[]'::jsonb;
alter table knowledge_chunks add column if not exists source_reference text;

create table if not exists voice_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key text unique not null,
  text_hash text,
  provider text,
  voice_name text,
  language text,
  audio_url text,
  hit_count int default 0,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists voice_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  anonymous_id text,
  provider text,
  voice_name text,
  language text,
  text_hash text,
  estimated_cost_inr numeric default 0,
  cache_hit boolean default false,
  blocked_by_budget boolean default false,
  audio_url text,
  status text,
  error_message text,
  created_at timestamptz default now()
);

create index if not exists ai_daily_budget_date_idx on ai_daily_budget(date);
create index if not exists ai_requests_cost_day_idx on ai_requests(created_at, provider, status);
create index if not exists knowledge_chunks_keywords_idx on knowledge_chunks using gin(keywords);
create index if not exists voice_cache_key_idx on voice_cache(cache_key);
