-- Guided Childhood: the Evening Reset
-- Run AFTER 020_school_link.sql.
-- Validated by Conversation 1 (plans/parent-conversations.md): the morning
-- is lost or won the night before, and every system this family tried
-- failed because nothing prompted at the moment of action. Each child gets
-- a weekly kit timetable; every evening DiGi composes tomorrow's checklist
-- (kit per child, school email actions due, the standing items: bags
-- emptied, water bottles filled, lunches booked, clothes out) and pushes it.

alter table public.children add column if not exists kit_schedule jsonb not null default '{}';
-- Shape: {"mon": ["Swimming kit"], "wed": ["Cubs uniform"], "thu": ["Hockey kit"]}

alter table public.digi_prompts drop constraint if exists digi_prompts_kind_check;
alter table public.digi_prompts add constraint digi_prompts_kind_check
  check (kind in ('watch_for','tip','parent_care','new_research','celebration','school','evening'));
