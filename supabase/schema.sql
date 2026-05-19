create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text check (role in ('student','teacher','admin')) default 'student',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subject text not null default 'chemistry',
  class_level text,
  difficulty text,
  summary text,
  estimated_minutes int,
  order_index int default 0,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id) on delete cascade,
  slug text not null,
  title text not null,
  content_md text,
  order_index int default 0,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists simulations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  chapter_slug text,
  difficulty text,
  component_key text,
  is_published boolean default true,
  created_at timestamptz default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  chapter_slug text not null,
  type text not null,
  difficulty text,
  question_text text not null,
  options jsonb,
  correct_answer jsonb,
  explanation text,
  tags text[],
  is_published boolean default true,
  created_at timestamptz default now()
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  chapter_slug text not null,
  score int default 0,
  total int default 0,
  percentage numeric,
  created_at timestamptz default now()
);

create table if not exists quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references quiz_attempts(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  user_answer jsonb,
  is_correct boolean,
  created_at timestamptz default now()
);

create table if not exists student_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  chapter_slug text not null,
  mastery numeric default 0,
  lessons_completed int default 0,
  quizzes_completed int default 0,
  last_activity_at timestamptz default now(),
  unique(user_id, chapter_slug)
);

create table if not exists mistake_notebook (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  chapter_slug text,
  note text,
  resolved boolean default false,
  created_at timestamptz default now()
);

create table if not exists ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  anonymous_id text,
  title text,
  mode text,
  chapter_slug text,
  created_at timestamptz default now()
);

create table if not exists ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references ai_conversations(id) on delete cascade,
  role text check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz default now()
);

create table if not exists ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  anonymous_id text,
  provider text,
  model text,
  input_tokens int default 0,
  output_tokens int default 0,
  estimated_cost numeric default 0,
  mode text,
  created_at timestamptz default now()
);

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  item_type text,
  item_slug text,
  created_at timestamptz default now(),
  unique(user_id, item_type, item_slug)
);

create table if not exists admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at
before update on profiles
for each row execute function set_updated_at();

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table profiles enable row level security;
alter table chapters enable row level security;
alter table lessons enable row level security;
alter table simulations enable row level security;
alter table questions enable row level security;
alter table quiz_attempts enable row level security;
alter table quiz_answers enable row level security;
alter table student_progress enable row level security;
alter table mistake_notebook enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table ai_usage_logs enable row level security;
alter table bookmarks enable row level security;
alter table admin_audit_logs enable row level security;

drop policy if exists "profiles read own" on profiles;
create policy "profiles read own"
on profiles for select
using (auth.uid() = id or is_admin());

drop policy if exists "profiles update own" on profiles;
create policy "profiles update own"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "published chapters readable" on chapters;
create policy "published chapters readable"
on chapters for select
using (is_published = true or is_admin());

drop policy if exists "admin manage chapters" on chapters;
create policy "admin manage chapters"
on chapters for all
using (is_admin())
with check (is_admin());

drop policy if exists "published lessons readable" on lessons;
create policy "published lessons readable"
on lessons for select
using (is_published = true or is_admin());

drop policy if exists "admin manage lessons" on lessons;
create policy "admin manage lessons"
on lessons for all
using (is_admin())
with check (is_admin());

drop policy if exists "published simulations readable" on simulations;
create policy "published simulations readable"
on simulations for select
using (is_published = true or is_admin());

drop policy if exists "admin manage simulations" on simulations;
create policy "admin manage simulations"
on simulations for all
using (is_admin())
with check (is_admin());

drop policy if exists "published questions readable" on questions;
create policy "published questions readable"
on questions for select
using (is_published = true or is_admin());

drop policy if exists "admin manage questions" on questions;
create policy "admin manage questions"
on questions for all
using (is_admin())
with check (is_admin());

drop policy if exists "quiz attempts own read" on quiz_attempts;
create policy "quiz attempts own read"
on quiz_attempts for select
using (auth.uid() = user_id or is_admin());

drop policy if exists "quiz attempts own write" on quiz_attempts;
create policy "quiz attempts own write"
on quiz_attempts for insert
with check (auth.uid() = user_id);

drop policy if exists "quiz answers own read" on quiz_answers;
create policy "quiz answers own read"
on quiz_answers for select
using (
  is_admin()
  or exists (
    select 1 from quiz_attempts
    where quiz_attempts.id = quiz_answers.attempt_id
      and quiz_attempts.user_id = auth.uid()
  )
);

drop policy if exists "quiz answers own write" on quiz_answers;
create policy "quiz answers own write"
on quiz_answers for insert
with check (
  exists (
    select 1 from quiz_attempts
    where quiz_attempts.id = quiz_answers.attempt_id
      and quiz_attempts.user_id = auth.uid()
  )
);

drop policy if exists "student progress own" on student_progress;
create policy "student progress own"
on student_progress for all
using (auth.uid() = user_id or is_admin())
with check (auth.uid() = user_id);

drop policy if exists "mistake notebook own" on mistake_notebook;
create policy "mistake notebook own"
on mistake_notebook for all
using (auth.uid() = user_id or is_admin())
with check (auth.uid() = user_id);

drop policy if exists "bookmarks own" on bookmarks;
create policy "bookmarks own"
on bookmarks for all
using (auth.uid() = user_id or is_admin())
with check (auth.uid() = user_id);

drop policy if exists "ai conversations own" on ai_conversations;
create policy "ai conversations own"
on ai_conversations for select
using (auth.uid() = user_id or is_admin());

drop policy if exists "ai conversations own write" on ai_conversations;
create policy "ai conversations own write"
on ai_conversations for insert
with check (auth.uid() = user_id or user_id is null);

drop policy if exists "ai messages own" on ai_messages;
create policy "ai messages own"
on ai_messages for select
using (
  is_admin()
  or exists (
    select 1 from ai_conversations
    where ai_conversations.id = ai_messages.conversation_id
      and ai_conversations.user_id = auth.uid()
  )
);

drop policy if exists "ai usage own read" on ai_usage_logs;
create policy "ai usage own read"
on ai_usage_logs for select
using (auth.uid() = user_id or is_admin());

drop policy if exists "admin audit read" on admin_audit_logs;
create policy "admin audit read"
on admin_audit_logs for select
using (is_admin());

drop policy if exists "admin audit write" on admin_audit_logs;
create policy "admin audit write"
on admin_audit_logs for insert
with check (is_admin());
