-- Guided Childhood — Migration 062
-- The lead magnets (Five Questions, The Evidence) capture an email in
-- exchange for a printable download. Those leads join the same list the
-- starter quiz already fills, so the founder sees one stream of leads,
-- not two. This adds a source tag so we can tell where a lead came from
-- (starter quiz vs which magnet) without a second table. The magnet
-- capture upserts on email and only ever writes email, source and
-- updated_at, so it never clobbers a quiz lead's saved answers.

alter table public.starter_leads
  add column if not exists source text;

-- Backfill existing rows so the founder view is not full of blanks: any
-- lead already here came through the starter quiz.
update public.starter_leads set source = 'starter' where source is null;
