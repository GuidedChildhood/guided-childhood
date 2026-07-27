-- Guided Childhood — Migration 079
-- The lesson test: the prove phase choice slides become a scored check, and
-- the completion records how it went. score is the number of choice questions
-- answered correctly on the finishing run; passed is whether that run met the
-- pass mark (70 percent, or automatically true for a lesson with no choice
-- slides). passed defaults to true so every existing completion keeps counting
-- toward the literacy ticks and nothing regresses.

alter table public.lesson_completions add column if not exists score int;

alter table public.lesson_completions add column if not exists passed boolean not null default true;
