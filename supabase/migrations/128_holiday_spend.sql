-- Guided Childhood — Migration 128
--
-- Spending the holiday bank.
--
-- Migration 127 built the bank and the child app now shows it, saying "90
-- holiday minutes, ready now" during a school holiday. Nothing could spend
-- them. The timer gate reads the star bank only, so a child with an empty week
-- and a full holiday bank was told the minutes were theirs to use and then
-- refused. A promise the app cannot keep is worse than no promise, so this is
-- the half that makes the card honest.
--
-- ── One column, because the refund needs to know ────────────────────────────
--
-- A block is paid stars first, holiday minutes second, so the holiday bank only
-- ever covers what the week could not. When a child hands the device back
-- early, the unused minutes have to go back to the right place, and by then the
-- split is gone: star_spends records what the star bank paid and holiday_
-- allowance records what it paid, but neither says which block they belonged
-- to. So the session carries the number it drew.
--
-- Refunds go to the holiday bank FIRST, which is not arbitrary. Holiday minutes
-- were the last thing added to the block, and more importantly they never
-- expire while ordinary stars reset every Monday. Refunding the perishable
-- currency first would quietly destroy value the child had already earned.
--
-- Zero on every existing row is exactly right: nothing before this could draw
-- from the bank, so every session already recorded was paid entirely in stars.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

alter table public.device_sessions
  add column if not exists holiday_minutes int not null default 0;

comment on column public.device_sessions.holiday_minutes is
  'Minutes of this block paid from the holiday bank rather than the weekly star balance. Stars pay first and this covers only the shortfall, so it is zero outside a school holiday and zero whenever the week had enough. Stopping early refunds this before trimming the star spend, because holiday minutes never expire and weekly stars do.';
