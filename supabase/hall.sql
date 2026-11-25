-- Hall of Heroes – run once in Supabase: SQL Editor → New query → paste → Run
create table if not exists public.hall (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  team jsonb not null,
  score int not null,
  time_ms int not null,
  stars int not null check (stars between 1 and 3),
  rank text
);

alter table public.hall enable row level security;

-- the game (anon key) may only add and read entries – no update / delete
drop policy if exists "hall insert" on public.hall;
create policy "hall insert" on public.hall for insert to anon with check (true);
drop policy if exists "hall read" on public.hall;
create policy "hall read" on public.hall for select to anon using (true);

-- live updates for the big screen
alter publication supabase_realtime add table public.hall;

-- after the open day you can delete everything with:
-- delete from public.hall;
