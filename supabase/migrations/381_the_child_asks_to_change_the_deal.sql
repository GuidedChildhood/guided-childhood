-- 381: the child asks to change the deal.
--
-- Justin, 16 October 2026: yes to the child asking to change a promise in the
-- family deal from their own app, with a reason, and the parent deciding.
-- Plan: plans/2026-10-16-ask-to-change-the-deal-plan.md.
--
-- Until now the child read the deal in Our family deal, tapped I agree, and
-- the deal was then the parent's alone to change. One row here is one ask:
-- which promise, what the child would like instead, and why. The parent
-- answers it, and the child sees the answer on their own app.
--
--   status 'pending'   waiting on the grown up
--          'yes'       the grown up will change it, in the agreement editor
--          'not_now'   not this time, with an optional kind line back
--          'talk'      the grown up wants to talk it through first
--
-- The promise is stored as the title the child saw rather than an index into
-- family_agreements.clauses, because the parent can edit the deal while the
-- ask waits and an index would then point at a different promise.
--
-- The child never writes here directly: their ask comes through the token
-- scoped /api/kid/deal-change route with the service role, exactly like
-- quest_requests (047). So the parent's policy reads and answers, and has no
-- insert. Additive and idempotent. Supabase editor rules: flat statements, no
-- DO blocks, no semicolons inside string literals.

create table if not exists public.deal_change_requests (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  child_id      uuid        not null references public.children(id) on delete cascade,
  promise_title text        not null check (char_length(promise_title) between 1 and 120),
  wish          text        not null check (char_length(wish) between 3 and 200),
  reason        text        not null check (char_length(reason) between 3 and 200),
  status        text        not null default 'pending' check (status in ('pending', 'yes', 'not_now', 'talk')),
  parent_reply  text        check (parent_reply is null or char_length(parent_reply) <= 200),
  decided_at    timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists idx_deal_change_requests_user  on public.deal_change_requests (user_id, status, created_at desc);
create index if not exists idx_deal_change_requests_child on public.deal_change_requests (child_id, created_at desc);

alter table public.deal_change_requests enable row level security;

drop policy if exists "deal_change_requests_read_own"   on public.deal_change_requests;
drop policy if exists "deal_change_requests_answer_own" on public.deal_change_requests;

create policy "deal_change_requests_read_own" on public.deal_change_requests
  for select using (auth.uid() = user_id);

create policy "deal_change_requests_answer_own" on public.deal_change_requests
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Who may reach the table at all (scripts/check-migration-grants.mjs). The
-- parent reads and answers; the child's ask is inserted by the service role,
-- which needs no grant. No anon: nothing public reads an ask.
grant select, update on public.deal_change_requests to authenticated;
grant select, insert, update, delete on public.deal_change_requests to service_role;
