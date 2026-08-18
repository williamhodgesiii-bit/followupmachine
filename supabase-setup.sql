-- ============================================================
--  Follow-Up Machine — Supabase setup
-- ============================================================
--  Run once in your Supabase project:
--    Dashboard → SQL Editor → New query → paste this → Run.
--
--  It creates ONE row per user that holds your whole dataset as an
--  encrypted blob, locks it down with Row-Level Security so each account
--  can only touch its own row, and turns on realtime so your devices stay
--  in sync. Supabase only ever stores ciphertext — it can't read your data.
--
--  ⚠ HIPAA: This makes the app *work*. It is compliant only when your
--  Supabase project is on the paid HIPAA plan WITH a signed BAA. Until then,
--  use test/fake data only.
-- ============================================================

create table if not exists public.vault (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  salt       text not null,
  iv         text not null,
  ciphertext text not null,
  updated_at timestamptz not null default now()
);

alter table public.vault enable row level security;

drop policy if exists "vault_select_own" on public.vault;
create policy "vault_select_own" on public.vault
  for select using (auth.uid() = user_id);

drop policy if exists "vault_insert_own" on public.vault;
create policy "vault_insert_own" on public.vault
  for insert with check (auth.uid() = user_id);

drop policy if exists "vault_update_own" on public.vault;
create policy "vault_update_own" on public.vault
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Turn on realtime for live cross-device sync.
-- (If it says the table is already in the publication, that's fine — ignore it.)
alter publication supabase_realtime add table public.vault;
