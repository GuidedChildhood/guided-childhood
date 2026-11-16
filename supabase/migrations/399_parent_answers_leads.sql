-- 399: a parent who did the stage check and never made an account can answer
-- too (Justin, 16 November 2026, "Yes, two short emails").
--
-- parent_answers (397) was keyed on an account. A lead has none, so each row
-- now names either an account (user_id) or a lead (lead_id, a starter_leads
-- row), never neither. The lead's link is signed on this id, never on the
-- email, so no address ever sits in a URL. Erasing the lead erases its answers.
--
-- Supabase editor rules: idempotent, flat statements, no DO blocks.

alter table public.parent_answers
  add column if not exists lead_id uuid references public.starter_leads(id) on delete cascade;

alter table public.parent_answers alter column user_id drop not null;

alter table public.parent_answers drop constraint if exists parent_answers_who;
alter table public.parent_answers
  add constraint parent_answers_who check (user_id is not null or lead_id is not null);

-- A plain unique constraint, not a partial index, so the answer route can
-- upsert on (lead_id, question). Account rows carry a null lead_id, and nulls
-- never collide, so they are untouched by it.
alter table public.parent_answers drop constraint if exists parent_answers_lead_question;
alter table public.parent_answers
  add constraint parent_answers_lead_question unique (lead_id, question);
