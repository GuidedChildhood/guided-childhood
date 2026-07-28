-- Guided Childhood — Migration 119
-- Keep the device guides current, on a schedule, with a human gate.
--
-- The guides tell a parent which settings to change to make a screen safer.
-- They are the most perishable content we hold: Apple, Google, Meta and the
-- rest move menus, rename toggles and add controls constantly, and WhatsApp and
-- the social apps change fastest of all. A device guide that has quietly gone
-- stale is worse than no guide, because a parent follows it, cannot find the
-- setting or finds it does nothing, and concludes the house is covered.
--
-- Nothing tracked when a guide was last checked, so there was no way to know
-- which ones had drifted. last_reviewed_at is that record, and the monthly cron
-- reads it to review the oldest first.
--
-- device_guide_candidates is the review queue, the same shape and the same rule
-- as expert_knowledge_candidates (migration 068): a model drafts, a human
-- approves, nothing reaches a parent unreviewed. That gate matters more here
-- than anywhere else in the product. These are safety instructions, and a
-- confidently wrong step is the failure mode that actually hurts a family.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

alter table public.device_guides
  add column if not exists last_reviewed_at timestamptz;

-- Everything currently in the bank is treated as reviewed today, so the first
-- monthly run has a starting line rather than 25 overdue guides at once.
update public.device_guides set last_reviewed_at = now() where last_reviewed_at is null;

create index if not exists idx_device_guides_review
  on public.device_guides (last_reviewed_at asc nulls first);

create table if not exists public.device_guide_candidates (
  id           uuid        primary key default gen_random_uuid(),
  -- The guide this is about. Null means a device or app we do not cover yet
  -- and probably should, which is the other half of staying current.
  device_key   text,
  -- 'update' for a changed step on a guide we have, 'new' for one we lack.
  kind         text        not null default 'update' check (kind in ('update', 'new')),
  name         text,
  /** What the model believes has changed, in one or two plain sentences. */
  summary      text        not null,
  /** The proposed replacement steps, same shape as device_guides.steps. */
  steps        jsonb,
  /** Age specific guidance, where the right setting genuinely differs by age. */
  age_notes    jsonb       not null default '{}',
  /** Where it got this. A candidate with no source is not reviewable. */
  url          text,
  rationale    text,
  status       text        not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at   timestamptz not null default now(),
  reviewed_at  timestamptz
);

create index if not exists idx_device_guide_candidates_status
  on public.device_guide_candidates (status, created_at desc);

alter table public.device_guide_candidates enable row level security;

-- Service role only, like the other review queues. No parent ever reads or
-- writes this table; it exists between the cron and the founder.
drop policy if exists "device_guide_candidates_none" on public.device_guide_candidates;
