-- Run this in Supabase SQL Editor to set up the database

create table if not exists user_stats (
  user_id uuid references auth.users(id) on delete cascade,
  game_id text not null,
  stats jsonb not null default '{}',
  progress jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, game_id)
);

-- Enable Row Level Security
alter table user_stats enable row level security;

-- Users can only read/write their own stats
create policy "Users read own stats"
  on user_stats for select
  using (auth.uid() = user_id);

create policy "Users insert own stats"
  on user_stats for insert
  with check (auth.uid() = user_id);

create policy "Users update own stats"
  on user_stats for update
  using (auth.uid() = user_id);
