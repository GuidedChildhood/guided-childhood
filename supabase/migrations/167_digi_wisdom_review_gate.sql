-- Guided Childhood — Migration 167
--
-- Renumbered from 165 on 6 August 2026. It landed the same evening as
-- 165_clear_age_rule_friends.sql from another session, and two files sharing a
-- number leaves their order undefined, which is what the wiring check calls
-- BROKEN. This one committed later so this one moved. Every statement in it is
-- an idempotent create or a guarded update, so a re-run under the new name
-- changes nothing.
--
-- Nothing reaches a parent's DiGi until somebody has read it.
--
-- THE HOLE THIS CLOSES
--
-- rebuildWisdom runs every Sunday at 06:00 on a cron. Until now it switched off
-- every active row and inserted its new set live in the same breath, so whatever
-- the model distilled at six on a Sunday morning was what DiGi told every parent
-- for the following week. Nobody read it first. There was no approval step, no
-- preview, and no way to see what had changed except by querying the table.
--
-- That was tolerable while the corpus was seeded by hand and the signals were
-- thin. It stops being tolerable the moment the rebuild gets sharper, because a
-- better loop is also a more influential one. This is the guide a frightened
-- parent is leaning on at ten at night, and the distance between "the model had
-- an off run" and "DiGi spent a week confidently telling people the wrong thing"
-- was one unattended cron.
--
-- HOW IT WORKS NOW
--
-- `active` keeps its exact meaning: the set DiGi is serving. Nothing about
-- retrieval changes, so getProvenSolutions and getAggregateWisdom are untouched.
--
-- A rebuild no longer writes there. It clears the holding pen and inserts its
-- candidates with pending = true, active = false. DiGi carries on serving the
-- last approved set, however old, because a known good corpus beats an unread
-- new one every time.
--
-- Approving promotes the pen: the live set goes inactive, the pending set goes
-- active and stamps approved_at. Discarding empties the pen and changes nothing.
--
-- The failure mode this leaves is a stale corpus rather than a wrong one, and
-- between those two that is the right way round.
--
-- Supabase editor rules: idempotent, flat statements.

alter table public.digi_wisdom
  add column if not exists pending boolean not null default false;

alter table public.digi_wisdom
  add column if not exists approved_at timestamptz;

-- The review page reads the pen, and the promote step writes the whole set at
-- once, so both go through this.
create index if not exists idx_digi_wisdom_pending
  on public.digi_wisdom (pending, updated_at desc);

-- Everything that predates this migration was, by definition, live without ever
-- having been reviewed. Stamping the currently active set as approved is not a
-- claim that anyone read it. It records that it is the set in service at the
-- moment the gate went up, so the first real approval has something to replace
-- and the page does not open with the live corpus sitting in the pen.
update public.digi_wisdom
  set approved_at = coalesce(approved_at, updated_at, created_at)
  where active = true and approved_at is null;
