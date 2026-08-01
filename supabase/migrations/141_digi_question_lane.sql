-- Guided Childhood — Migration 141
--
-- Record which lane a question was answered in, so widening what DiGi will talk
-- about does not quietly poison what it learns.
--
-- Justin: "I want to be able to use Claude though but with the guardrails so it
-- can answer anything."
--
-- DiGi never had a topic gate, so it always could. What changes is the shape:
-- a message about the child gets the coaching format, a message about anything
-- else gets a straight answer. The risk that comes with that is downstream, not
-- in the reply.
--
-- digi_questions is read by two agents that both assume every row is a parent
-- asking about their child:
--
--   /api/cron/digi-insights reads it to find what parents need that we are not
--   serving. General questions in that pile become phantom product demand.
--
--   /api/cron/knowledge-refresh reads it to find GAPS IN THE RESEARCH BANK and
--   then goes searching the web to fill them. That one actually matters: a
--   parent asking DiGi about a holiday booking could send the research updater
--   hunting for studies about holidays and put the candidates in front of Justin
--   to approve. The bank is the thing DiGi cites by name, so anything that can
--   put noise into it is a correctness problem, not a tidiness one.
--
-- So the lane is stored and both readers filter on it. Existing rows are null
-- and null is treated as parenting, which is true of every row written before
-- today because there was only one shape.
--
-- Not an enum: a check constraint is easier to widen later than a type is, and
-- lanes are a product judgement that will move.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

alter table public.digi_questions
  add column if not exists lane text;

alter table public.digi_questions
  drop constraint if exists digi_questions_lane_check;

alter table public.digi_questions
  add constraint digi_questions_lane_check
  check (lane is null or lane in ('parenting', 'family', 'general'));

-- The insight and research agents both scan a date window and then filter the
-- lane, so the index leads on created_at.
create index if not exists idx_digi_questions_lane
  on public.digi_questions (created_at desc, lane);

comment on column public.digi_questions.lane is
  'Which shape answered this: parenting (about the child and their digital life), family (family life around the child), general (anything else). Null means it predates lanes and is treated as parenting. The insights and knowledge refresh agents read parenting and family only, so a general question never becomes phantom product demand or sends the research updater looking for studies that do not belong in the bank.';
