-- Guided Childhood — Migration 053
-- Making DiGi's brain visibly a learning brain. Two things:
--
-- 1. digi_insights: the daily insight agent used to mine every parent
--    question, theme it, and email the founder, then throw the result away.
--    Now each run is kept, so the themes, gaps and recommendations build a
--    history the founder can look back over and DiGi's growth is a record,
--    not a disposable email.
--
-- 2. Seed digi_wisdom: the aggregate "what works across families" corpus had
--    no seed, so it stayed empty and silent until a Sunday cron had real
--    wins to distil. That made the learning look dead on a fresh install.
--    Seed it with a small set of evergreen, philosophy aligned patterns so
--    DiGi leans on the wider track record from the first conversation, and
--    the weekly rebuild replaces these with genuinely learned patterns as
--    real wins accumulate.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals, flat statements only.

create table if not exists public.digi_insights (
  id             uuid        primary key default gen_random_uuid(),
  generated_at   timestamptz not null default now(),
  days           int         not null,
  question_count int         not null default 0,
  summary        text,
  report         jsonb       not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

create index if not exists idx_digi_insights_created on public.digi_insights (created_at desc);

alter table public.digi_insights enable row level security;

-- Founder analytics only: no user policy, so the table is reachable only
-- through the service role (the admin client the cron and founder endpoint
-- use), never from a browser session.

-- Seed the aggregate wisdom, once. Guarded on a sentinel topic so a re-run
-- never double inserts, and skipped entirely once the weekly rebuild has
-- written real learned patterns.
insert into public.digi_wisdom (topic, age_band, what_works, evidence_count, active, updated_at)
select topic, age_band, what_works, evidence_count, true, now()
from (values
  ('Structure over willpower', null, 'When screens are a battle, changing the setup does the work that nagging cannot. One clear, calm boundary in place beats ten reminders, because it takes the fight off the child and puts it on the routine.', 4),
  ('The bedroom rule', null, 'Screens charging outside the bedroom overnight is the single most protective habit at every stage. Families who hold this one line see sleep and mood settle first, and it opens far fewer arguments than it closes.', 6),
  ('Curiosity before control', '11-13', 'With older children, an open question about what they are seeing online reaches further than a new rule. Interest keeps the door open so they still come to you with the next thing.', 5),
  ('Watch it together', '4-7', 'Sitting alongside a young child for the show or the game, and talking about it, turns screen time into shared time. It is the calm handover that a hard cut off rarely is.', 4),
  ('The weekly check in', null, 'A short, same time each week catch up, not about screens, is the relationship maintenance that makes the harder conversations land later. Consistency matters more than length.', 4),
  ('Name the feeling first', null, 'When a device comes off and the mood drops, naming what the child feels before explaining the reason lowers the heat. The upset is real even when the boundary is right.', 3),
  ('Repair after a rough moment', null, 'Coming back after a screen time blow up to say what you would do differently teaches more than getting it perfect. Children trust the parent who repairs, not the one who never slips.', 3),
  ('The algorithm conversation', '13-15', 'Explaining that the feed is built to hold attention, not to be fair, hands a teenager a lens rather than a rule. It reframes the phone as something to see clearly, not something to hide.', 4)
) as seed(topic, age_band, what_works, evidence_count)
where not exists (select 1 from public.digi_wisdom);
