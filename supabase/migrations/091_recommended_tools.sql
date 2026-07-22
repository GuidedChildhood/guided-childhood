-- Guided Childhood — Migration 091
-- DiGi's vetted toolbox. A small, evidence graded set of outside services DiGi
-- can point a parent to at the moment they hit the matching problem, always in
-- the same honest shape: the problem, the fix and the science behind it, and
-- the benefit of signing up. Tied to the concern a family actually flagged, so
-- it is the right tool at the right moment, never a directory nobody browses.
--
-- This is global content, not user data, so it reads like device_guides: any
-- signed in parent can read it, nobody writes it from the app. A tool goes live
-- only when it has a real url set, so no unvetted brand name is ever shown; the
-- seeds below are category level with the honest problem/fix/benefit already
-- written, waiting for Justin to attach the specific service he has vetted.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons inside string
-- literals, flat statements only.

create table if not exists public.recommended_tools (
  id             uuid primary key default gen_random_uuid(),
  concern_slug   text,                                   -- maps to a flagged concern, null = general
  category       text not null,
  name           text not null,
  problem        text not null,                          -- in a parent's words
  fix            text not null,                          -- what it does
  science        text not null,                          -- why it works, honest about the evidence
  benefit        text not null,                          -- what changes at home
  url            text,                                   -- null until a vetted service is attached
  cost_note      text,
  evidence_grade text not null default 'emerging',       -- strong | moderate | emerging
  affiliate      boolean not null default false,
  sort_order     int not null default 0,
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  unique (category, name)
);

alter table public.recommended_tools enable row level security;

drop policy if exists "recommended_tools_read" on public.recommended_tools;

create policy "recommended_tools_read" on public.recommended_tools
  for select using (auth.uid() is not null);

-- Seed the categories where the evidence is strongest, honest problem to
-- benefit written, url left blank so nothing unvetted shows until Justin
-- attaches the specific service. Idempotent on (category, name).
insert into public.recommended_tools (concern_slug, category, name, problem, fix, science, benefit, cost_note, evidence_grade, sort_order)
values
  ('online_safety', 'Network filtering', 'Whole home filtering',
   'The internet is everywhere in the house and I cannot watch every screen at once.',
   'A filter set once on your home broadband or through a DNS service covers every device on the network at the same time.',
   'The research is clear that changing the environment protects better than watching a child. One setting on the network is the strongest single move because it does not rely on catching anything in the moment.',
   'Every screen in the house follows one age matched rule, so protection stops being a job you have to keep doing.',
   'Many routers do this free; dedicated services are a few pounds a month.', 'strong', 10),
  ('mood_changes', 'Child wellbeing', 'Evidence based worry and mood app for children',
   'Their mood has dipped and I do not know how to help them with worry or low feelings.',
   'A structured app built on cognitive behavioural methods gives a child small daily exercises for naming and managing worry, at their level.',
   'Cognitive behavioural techniques have the strongest evidence base of any self help approach for childhood anxiety and low mood. This is the one area where a proper tool adds something parenting alone cannot.',
   'Your child gets a calm, private way to practise the skills, and you get a shared language for the hard feelings.',
   'Look for one with clinical backing; some are free through the NHS.', 'strong', 20),
  ('screens_takeover', 'Sleep', 'Sleep and wind down help',
   'Screens have taken over the evening and bedtime is a battle.',
   'A wind down routine, and a tool that dims and cuts screens before sleep, protects the last hour of the day.',
   'Sleep is one of the strongest measurable protective factors for a child, and the hour before bed is when screens do the most damage to it. Protecting sleep pays back across mood, focus and behaviour.',
   'Calmer evenings, an easier bedtime, and a child who sleeps and copes better the next day.',
   'Built into most phones and tablets free; some standalone tools are paid.', 'moderate', 30),
  ('asking_for_phone', 'Money skills', 'Kids money and pocket money app',
   'They are asking for a phone and I want them to learn to handle money and responsibility first.',
   'A supervised kids money app lets them earn, save and spend with you able to see and set limits, a first taste of independence with a safety rail.',
   'Responsibility grows through supervised practice, not a sudden handover. A money app is a low stakes way to build the judgement a phone will later need.',
   'Your child learns to manage something real, and you get evidence of the responsibility that makes the phone conversation easier.',
   'Typically a few pounds a month per child.', 'emerging', 40),
  ('start_conversation', 'Reading', 'Reading and audiobook app',
   'They have stopped reading for pleasure and it is always a screen instead.',
   'A reading or audiobook app that lets a child choose what they love pulls time back towards reading, and gives you something to talk about together.',
   'Reading for pleasure is one of the most reliable predictors of wellbeing and school outcomes, and choice is what keeps a reluctant reader reading.',
   'More real reading, a calmer alternative to the feed, and a shared story to talk about.',
   'Library apps are free; subscription services are a few pounds a month.', 'moderate', 50)
on conflict (category, name) do nothing;
