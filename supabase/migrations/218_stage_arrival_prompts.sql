-- Guided Childhood — Migration 218
-- "This is the age": DiGi speaks BEFORE the problem, once, at each arrival.
--
-- Justin, 19 August 2026, commissioning the gap the DiGi audit named: "do the
-- audit on this is the age, social media, school peers talking about WhatsApp,
-- base it on the research, and feel free to add more data if available."
--
-- The platform guides have always known WHERE things become real
-- (first_seen_stage, migration 093). Nothing watched for a child CROSSING into
-- that stage, so the product's best moment, advice arriving before the problem
-- rather than after it, never fired. A parent heard about WhatsApp from us the
-- day it went wrong, not the term the class chat started.
--
-- ── THE MARK ────────────────────────────────────────────────────────────────
-- One row per child per stage, so an arrival fires exactly once. A child's
-- FIRST scan writes their current stage silently, because telling a parent
-- about the stage their child is already mid way through is not an arrival, it
-- is a lecture. From then on, a stage they have no mark for is a genuine
-- crossing.

create table if not exists public.stage_arrivals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  child_id   uuid not null references public.children(id) on delete cascade,
  stage_id   int  not null check (stage_id between 1 and 5),
  -- Null on the silent baseline mark; set when an arrival prompt was written.
  prompted_at timestamptz,
  created_at  timestamptz not null default now(),
  unique (child_id, stage_id)
);

alter table public.stage_arrivals enable row level security;
create policy "stage_arrivals_own" on public.stage_arrivals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The prompt kind, so the card can wear its own frame and the router can rank
-- it above the routine drumbeat.
alter table public.digi_prompts drop constraint if exists digi_prompts_kind_check;
alter table public.digi_prompts add constraint digi_prompts_kind_check
  -- 'follow_up' is live in the data from the digi_followups feature and was
-- missing from the list this migration first shipped with, which the live
-- database rejected. The constraint must carry every kind that exists.
  check (kind in ('watch_for','tip','parent_care','new_research','celebration','school','follow_up','stage_arrival'));

-- ── THE RESEARCH, stamped in ────────────────────────────────────────────────
-- What actually happens at each arrival, from the sources this bank already
-- cites. Every claim is the well replicated shape of the evidence rather than
-- a headline number, because numbers drift year to year and a stale statistic
-- read out with confidence is worse than the durable pattern.
-- Topic 'stage_arrival' is what the prompt writer retrieves by.

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics) values
('report', 'Ofcom Children and Parents Media Use', 'YouTube is the platform young children actually use, typically on a shared family device, and autoplay is the mechanism that turns one video into an hour. The protective moves at this age are watching alongside, turning autoplay off, and keeping screens in shared rooms.', '{4-7}', '{stage_arrival,screen_time,routines}'),
('report', 'Ofcom Children and Parents Media Use', 'Phone ownership climbs steeply across the last years of primary school, and by the end of primary almost every child has one. The first phone conversation goes best a term BEFORE the phone, when it is still a plan rather than a negotiation.', '{8-10}', '{stage_arrival,phones}'),
('association', 'Internet Matters', 'The first group chat usually arrives in the last years of primary, often a class WhatsApp chat, and the first problems are social rather than technical: being left out of the chat, pile ons, and screenshots travelling. WhatsApp''s own minimum age is 13, so a primary age child in a class chat is there early, which is exactly why it needs a parent nearby.', '{8-10,11-13}', '{stage_arrival,social_media,friendships}'),
('association', 'NSPCC', 'The move to secondary school is the single biggest jump in a child''s digital independence: new phone, new peers, group chats that form in week one. Agreeing the rules BEFORE the first term starts, while it is abstract, is far easier than imposing them in October, when it is personal.', '{11-13}', '{stage_arrival,phones,social_media}'),
('researcher', 'Dr Amy Orben', 'Developmental sensitivity windows exist: roughly ages 11 to 13 for girls and 14 to 15 for boys, when social media use and lower life satisfaction are most linked. An arrival into this window is the moment for watchfulness, not for panic.', '{11-13,13-15}', '{stage_arrival,social_media,mood}'),
('report', 'JAMA Pediatrics meta analysis (Carter et al)', 'Across studies, a device in the bedroom at night is associated with less sleep and poorer sleep quality, and the association holds even when the device is not used. The overnight charging spot outside the bedroom is the single highest value house rule at every age it is set.', '{8-10,11-13,13-15}', '{stage_arrival,sleep}'),
('association', 'National Crime Agency', 'Financially motivated sextortion rose sharply against teenage boys, and the pattern is consistent: contact on one platform, moved quickly to private messages, then threats. Teenagers who know the pattern in advance, and know that paying makes it worse and telling an adult ends it, are measurably safer than teenagers warned only in general terms.', '{13-15,16+}', '{stage_arrival,safety,social_media}'),
('association', 'Childnet', 'By mid adolescence the effective parental control is the relationship, not the settings: teenagers route around technical blocks in minutes but keep talking to parents who stayed calm the last time something went wrong. The arrival conversation at this age is about being tellable, not about locks.', '{13-15,16+}', '{stage_arrival,safety,friendships}');
