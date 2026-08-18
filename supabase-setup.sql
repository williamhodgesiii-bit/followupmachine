-- ============================================================
--  Follow-Up Machine — Supabase setup (shared team workspace)
-- ============================================================
--  Run once: Supabase Dashboard → SQL Editor → New query → paste → Run.
--
--  This creates ONE shared row that every staff account reads & writes, so
--  the whole team sees the same patients & messages, live. Row-Level Security
--  requires a signed-in account to touch it.
--
--  ⚠️ TWO THINGS YOU MUST ALSO DO IN THE DASHBOARD:
--   1) DISABLE public sign-ups so randoms can't make an account and read your
--      data:  Authentication → Sign In / Providers → Email → turn OFF
--      "Allow new users to sign up".
--   2) CREATE each staff login yourself:  Authentication → Users → Add user
--      (set an email + password; give it to that staff member).
--
--  ⚠️ HIPAA: compliant only when this project is on Supabase's paid HIPAA plan
--  WITH a signed BAA. Until then, use TEST/FAKE data only.
-- ============================================================

create table if not exists public.workspace (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- the single shared row
insert into public.workspace (id) values ('default') on conflict (id) do nothing;

alter table public.workspace enable row level security;

-- any signed-in (authenticated) staff account may read & write the shared row
drop policy if exists "ws_read"  on public.workspace;
create policy "ws_read"  on public.workspace for select to authenticated using (true);

drop policy if exists "ws_write" on public.workspace;
create policy "ws_write" on public.workspace for update to authenticated using (true) with check (true);

drop policy if exists "ws_insert" on public.workspace;
create policy "ws_insert" on public.workspace for insert to authenticated with check (true);

-- live cross-device updates
-- (if it says the table is already in the publication, that's fine — ignore it)
alter publication supabase_realtime add table public.workspace;
