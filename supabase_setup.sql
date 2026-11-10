-- BioLab Dynamics: execute este script no SQL Editor do Supabase.
create table if not exists public.player_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Jogador',
  points integer not null default 0 check (points >= 0),
  answered integer not null default 0 check (answered >= 0),
  correct integer not null default 0 check (correct >= 0 and correct <= answered),
  favorites text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.player_progress enable row level security;

-- Cada jogador só pode ler e alterar seu próprio progresso.
drop policy if exists "Jogador pode ler seu progresso" on public.player_progress;
create policy "Jogador pode ler seu progresso"
  on public.player_progress for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Jogador pode inserir seu progresso" on public.player_progress;
create policy "Jogador pode inserir seu progresso"
  on public.player_progress for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Jogador pode atualizar seu progresso" on public.player_progress;
create policy "Jogador pode atualizar seu progresso"
  on public.player_progress for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- View pública expõe somente os campos necessários para o ranking.
create or replace view public.leaderboard as
select user_id, display_name, points, answered, correct
from public.player_progress;

grant select on public.leaderboard to anon, authenticated;
grant select, insert, update on public.player_progress to authenticated;
