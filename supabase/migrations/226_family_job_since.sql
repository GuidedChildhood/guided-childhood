-- Family jobs go star free FORWARD from the day they became family jobs,
-- never backward.
--
-- Migration 223's is_family_job flag zeroed every tick a quest had ever
-- earned, including ticks from before the parent flipped the toggle. Mark an
-- old three star job as a family job and the child's lifetime earned quietly
-- dropped by every star that job ever paid, which reads as the app taking
-- stars away for a decision the child never made.
--
-- family_job_since records WHEN the job became a family job. The bank keeps
-- paying ticks from before that moment at the job's old rate and pays nothing
-- from that moment on. Null on a flagged job means "always was one" and keeps
-- the old zero everything behaviour, which is also the safe reading on a
-- database where this migration has not landed yet.

alter table public.family_quests
  add column if not exists family_job_since timestamptz;

-- Jobs already flagged were created as family jobs during the same build that
-- added the flag, so their creation moment is the honest backfill. Anything
-- ticked before creation does not exist, so this changes no bank balance.
update public.family_quests
  set family_job_since = coalesce(created_at, now())
  where is_family_job = true and family_job_since is null;
