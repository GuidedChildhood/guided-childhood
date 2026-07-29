-- Guided Childhood — Migration 121
-- The legal watch queue.
--
-- This product sits on top of law that moves: UK GDPR, the ICO Children's Code,
-- the Online Safety Act and its phased duties, age assurance rules, and the
-- MHRA line between a guide and a medical device. Every one of those can change
-- what we are allowed to say, keep or show, and none of them sends us a letter.
--
-- The failure mode is not a dramatic breach. It is drifting quietly out of
-- compliance because a duty commenced in March and nobody was watching, then
-- finding out from a school procurement questionnaire or a journalist.
--
-- So this is a queue, not an oracle. Quarterly, a cron reports what may have
-- changed and files it here as pending. It never edits a policy, never changes
-- a setting, and never tells anyone they are compliant. Every row is a prompt
-- for a human to go and check a primary source, which is why url is effectively
-- required and why the rationale must carry the uncertainty rather than hide it.
--
-- Same human gate as expert_knowledge_candidates (068) and
-- device_guide_candidates (119). Stronger reason: nothing here is safe to act
-- on automatically, because being confidently wrong about the law is worse than
-- knowing you have not looked.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

create table if not exists public.legal_watch_items (
  id            uuid        primary key default gen_random_uuid(),
  /** Which body of law. GDPR, Children's Code, Online Safety Act, MHRA, other. */
  area          text        not null,
  /** One line a founder can scan. */
  headline      text        not null,
  /** What appears to have changed, plainly. */
  summary       text        not null,
  /** What it might mean for THIS product, which is the part worth reading. */
  impact        text,
  /**
   * How sure the model is. Low is not a failure, it is the honest majority, and
   * a low confidence row that turns out to matter is the whole point of this.
   */
  confidence    text        not null default 'low' check (confidence in ('low', 'medium', 'high')),
  /** When the change takes effect, if it is known. Often it is not. */
  effective_on  date,
  /** The primary source. A row without one cannot be checked and is not filed. */
  url           text,
  status        text        not null default 'pending' check (status in ('pending', 'actioned', 'dismissed')),
  /** What the founder decided, so a later reader knows why it was closed. */
  note          text,
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz
);

create index if not exists idx_legal_watch_status
  on public.legal_watch_items (status, created_at desc);

alter table public.legal_watch_items enable row level security;

-- Service role only. This sits between the cron and the founder's insights
-- board; no parent or child ever touches it.
drop policy if exists "legal_watch_none" on public.legal_watch_items;
