-- Guided Childhood — Migration 172
-- The streak screen is a weekly reminder, not a daily one.
--
-- Justin, 8 August 2026: "only ever once for both, as would be annoying if
-- every time they go in. So only animations once when achieved family planet
-- with correct animation, then the streaks achieved come up once per week so
-- reminds them once per week what they have achieved, as we show streaks in
-- other places."
--
-- It fired on every completed day, which for a child doing their five a day is
-- every single day. The flame, the week dots and the same sentence, seven times
-- a week, over a number that is already on their home screen. That is how a
-- celebration turns into a dialog you learn to dismiss without reading.
--
-- So it is remembered per child, per star week. The star week is the right unit
-- rather than a rolling seven days: it is the Monday to Monday London week the
-- child's earned minutes already reset on, so the reminder lands on a boundary
-- they live by rather than on a private anniversary of whenever they last saw
-- it.
--
-- Held on the child rather than in localStorage, which is what it used before
-- and which celebrated once per DEVICE: twice for a child with a tablet and a
-- phone, and never again once an in app browser cleared its storage. That is
-- exactly the fault behind the replays Justin saw.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons inside string
-- literals, flat statements only.

alter table public.children
  add column if not exists streak_week_seen text;
