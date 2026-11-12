create table if not exists public.traveler_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stage text not null check (stage in ('future','active','retired')),
  profile_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.baseline_checkins (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  check_in_date date not null, resting_heart_rate numeric, sleep_hours numeric, sleep_quality text,
  mood smallint check (mood between 1 and 5), stress smallint check (stress between 1 and 5),
  exercise_completed boolean not null default false, note text not null default '', is_synthetic boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id, check_in_date)
);

create table if not exists public.preparation_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  session_id text not null, session_type text not null check (session_type in ('fitness','breathing','grounding','reflection')),
  status text not null check (status in ('completed','skipped','saved')), completed_at timestamptz, is_synthetic boolean not null default true,
  created_at timestamptz not null default now(), unique(user_id, session_id)
);

create table if not exists public.adaptation_progress (
  user_id uuid not null references auth.users(id) on delete cascade, day smallint not null check (day between 1 and 14),
  completed boolean not null default false, experience_note text not null default '', is_synthetic boolean not null default true,
  updated_at timestamptz not null default now(), primary key(user_id, day)
);

create table if not exists public.privacy_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade, mood boolean not null default true,
  notes boolean not null default false, trends boolean not null default true, updated_at timestamptz not null default now()
);

alter table public.traveler_preferences enable row level security;
alter table public.baseline_checkins enable row level security;
alter table public.preparation_sessions enable row level security;
alter table public.adaptation_progress enable row level security;
alter table public.privacy_preferences enable row level security;

create policy "own traveler preferences" on public.traveler_preferences for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own baseline checkins" on public.baseline_checkins for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own preparation sessions" on public.preparation_sessions for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own adaptation progress" on public.adaptation_progress for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own privacy preferences" on public.privacy_preferences for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.traveler_preferences, public.baseline_checkins, public.preparation_sessions, public.adaptation_progress, public.privacy_preferences to authenticated;
