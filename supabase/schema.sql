-- Run this entire file once in Supabase: Dashboard → SQL Editor → New query → paste → Run

create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  due_date date,
  is_completed boolean not null default false,
  category text,
  notifications_enabled boolean not null default false,
  notify_at timestamptz,
  repeat_frequency text not null default 'none',
  created_at timestamptz not null default now()
);

create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  notifications_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references habits on delete cascade not null,
  user_id uuid references auth.users not null,
  completed_date date not null,
  unique (habit_id, completed_date)
);

create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  entry_date date not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  saved_amount numeric not null default 0,
  target_amount numeric,
  created_at timestamptz not null default now()
);

-- Row Level Security: each user can only see and edit their own data
alter table tasks enable row level security;
alter table habits enable row level security;
alter table habit_logs enable row level security;
alter table journal_entries enable row level security;
alter table savings_goals enable row level security;

create policy "Users manage their own tasks" on tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own habits" on habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own habit logs" on habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own journal entries" on journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own savings goals" on savings_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
