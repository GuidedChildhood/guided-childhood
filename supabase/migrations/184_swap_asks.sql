-- A child's ask to SWAP one of today's jobs for a different task.
--
-- Justin, 11 August 2026: "should we give child ability to click negotiate
-- job so can change it to different task as gives them more control?" Yes,
-- built as an ask rather than a self serve change, because the first
-- non-negotiable is a calibrated pathway with the parent's yes in the loop,
-- never the app letting a child rewrite their own board.
--
-- The ask reuses quest_requests wholesale (the pitch pipeline the child
-- already has: caps, the parent's yes/no, the child's status list). This one
-- column is the only new fact: WHICH job they want to swap out. Null means
-- an ordinary pitch, exactly as before, so nothing existing changes shape.
--
-- on delete set null: if the parent deletes the old job while the ask is
-- open, the ask degrades to an ordinary pitch instead of dangling.

alter table public.quest_requests
  add column if not exists swap_quest_id uuid references public.family_quests(id) on delete set null;
