-- StudyPilot AI Supabase schema
-- Goal: separate PII from learning analytics while keeping RLS simple for a prototype.

create extension if not exists "uuid-ossp";

create table if not exists student_identity (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  university text,
  created_at timestamptz not null default now()
);

create table if not exists student_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  degree text,
  year_level text,
  learning_goal text,
  preferred_study_style text,
  created_at timestamptz not null default now()
);

create table if not exists project_briefs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  brief_text text not null,
  deadline date,
  course_code text,
  created_at timestamptz not null default now()
);

create table if not exists project_requirements (
  id uuid primary key default uuid_generate_v4(),
  brief_id uuid not null references project_briefs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  requirement_type text not null,
  requirement_text text not null,
  priority text not null default 'medium',
  created_at timestamptz not null default now()
);

create table if not exists skill_gap_scores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references project_briefs(id) on delete cascade,
  skill_name text not null,
  current_level int not null check (current_level between 0 and 100),
  required_level int not null check (required_level between 0 and 100),
  gap_score int generated always as (greatest(required_level - current_level, 0)) stored,
  priority text not null default 'medium',
  created_at timestamptz not null default now()
);

create table if not exists risk_assessments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references project_briefs(id) on delete cascade,
  risk_score int not null check (risk_score between 0 and 100),
  risk_level text not null,
  risk_reasons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists learning_clusters (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cluster_label text not null,
  cluster_confidence numeric not null check (cluster_confidence between 0 and 1),
  insight text,
  created_at timestamptz not null default now()
);

create table if not exists weekly_checkins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references project_briefs(id) on delete cascade,
  progress_summary text not null,
  blockers text,
  next_steps text,
  created_at timestamptz not null default now()
);

alter table student_identity enable row level security;
alter table student_profiles enable row level security;
alter table project_briefs enable row level security;
alter table project_requirements enable row level security;
alter table skill_gap_scores enable row level security;
alter table risk_assessments enable row level security;
alter table learning_clusters enable row level security;
alter table weekly_checkins enable row level security;

create policy "Users can read own identity" on student_identity for select using (auth.uid() = user_id);
create policy "Users can insert own identity" on student_identity for insert with check (auth.uid() = user_id);
create policy "Users can update own identity" on student_identity for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can read own profile" on student_profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on student_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on student_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own briefs" on project_briefs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own requirements" on project_requirements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own skill gaps" on skill_gap_scores for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own risk assessments" on risk_assessments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own learning clusters" on learning_clusters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own checkins" on weekly_checkins for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
