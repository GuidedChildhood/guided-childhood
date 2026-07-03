-- Guided Childhood Schools: Phase 1 (reference lesson end to end)
-- Run AFTER 022_email_log.sql. (Renumbered from 018: main took 018 to 022.)
-- Spec: plans/schools-lesson-build-spec.md (sections 6, 10, 12, 16).
--
-- Design decisions locked in the spec:
--  - Class codes, not pupil accounts. Pupils are display_name only
--    (first name + initial). No emails, no dates of birth, no logins.
--  - Curriculum product, not a safeguarding recording system: no
--    disclosure storage anywhere in this schema. DSL notes signpost to
--    the school's own systems.
--  - RLS separates school data from parent platform data completely.
--    School DiGi never reads pupil rows (aggregate views only, later).

-- Educator preview completes through the existing completion endpoint.
alter table public.lesson_completions drop constraint if exists lesson_completions_lesson_source_check;
alter table public.lesson_completions
  add constraint lesson_completions_lesson_source_check
  check (lesson_source in ('lesson', 'ai_lesson', 'school_lesson'));

-- ─────────────────────────────────────────────
-- Core school tables (Phase 1 creates them all so Phase 2 builds on a
-- stable schema; only school_lessons is populated today).
-- ─────────────────────────────────────────────

create table if not exists public.school_accounts (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  urn          text,                       -- DfE unique reference number, optional at signup
  phase        text check (phase in ('primary','secondary','all_through','special','other')),
  licence_tier text not null default 'pilot' check (licence_tier in ('pilot','primary','secondary','mat')),
  pilot_until  date,
  created_at   timestamptz not null default now()
);

create table if not exists public.school_educators (
  id         uuid primary key default uuid_generate_v4(),
  school_id  uuid not null references public.school_accounts(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'teacher' check (role in ('teacher','lead','dsl','head')),
  created_at timestamptz not null default now(),
  unique (school_id, user_id)
);

create table if not exists public.school_classes (
  id         uuid primary key default uuid_generate_v4(),
  school_id  uuid not null references public.school_accounts(id) on delete cascade,
  year_group text not null,                -- 'Year 8', 'Reception', ...
  name       text not null,
  class_code text not null unique,         -- join code; pupils never authenticate
  created_at timestamptz not null default now()
);

-- Data minimisation by design: display_name is first name + initial (or a
-- school chosen alias). Nothing else about a pupil is ever stored.
create table if not exists public.pupils (
  id           uuid primary key default uuid_generate_v4(),
  class_id     uuid not null references public.school_classes(id) on delete cascade,
  display_name text not null,
  created_at   timestamptz not null default now()
);

-- The 21 modules. Slides reuse the exact player contract from migration 017
-- so the existing interactive player renders school lessons unchanged.
create table if not exists public.school_lessons (
  id                    uuid primary key default uuid_generate_v4(),
  module_id             text not null unique,      -- 'ks3-12-misinfo-deepfakes'
  title                 text not null,
  key_stage             text not null check (key_stage in ('EYFS','KS1','KS2','KS3','KS4','KS5')),
  year_band             text not null,
  audience              text not null default 'teacher' check (audience in ('teacher','parent')),
  efcw_strands          int[] not null default '{}',
  statutory_hooks       text[] not null default '{}',
  ailit_domains         text[] not null default '{}',
  evidence_anchor       text,
  single_action_outcome text not null,
  character_cast        text,                      -- per spec 9.4 casting table
  slides                jsonb,                     -- migration 017 slide contract
  video_beats           jsonb,                     -- beat metadata incl. higgsfield job ids
  assessment            jsonb,                     -- retrieval/checks/exit/judgement shape
  parent_note           jsonb,
  teacher_notes         jsonb,
  dsl_note              jsonb,
  sort_order            int not null default 0,
  created_at            timestamptz not null default now()
);

create table if not exists public.lesson_deliveries (
  id         uuid primary key default uuid_generate_v4(),
  class_id   uuid not null references public.school_classes(id) on delete cascade,
  lesson_id  uuid not null references public.school_lessons(id) on delete cascade,
  teacher_id uuid not null references auth.users(id),
  mode       text not null default 'class' check (mode in ('class','pupil_paced')),
  taught_at  timestamptz not null default now()
);

create table if not exists public.check_responses (
  id          uuid primary key default uuid_generate_v4(),
  delivery_id uuid not null references public.lesson_deliveries(id) on delete cascade,
  pupil_id    uuid references public.pupils(id) on delete cascade,  -- null in whole class tally mode
  check_id    text not null,               -- slide index or named check from lesson JSON
  response    text not null,
  correct     boolean,
  auto        boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.teacher_judgements (
  id          uuid primary key default uuid_generate_v4(),
  delivery_id uuid not null references public.lesson_deliveries(id) on delete cascade,
  pupil_id    uuid not null references public.pupils(id) on delete cascade,
  level       text not null default 'met' check (level in ('working_towards','met','exceeded')),
  created_at  timestamptz not null default now(),
  unique (delivery_id, pupil_id)
);

create table if not exists public.action_commitments (
  id          uuid primary key default uuid_generate_v4(),
  delivery_id uuid not null references public.lesson_deliveries(id) on delete cascade,
  pupil_id    uuid references public.pupils(id) on delete cascade,
  text        text not null,
  followed_up boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.evidence_items (
  id          uuid primary key default uuid_generate_v4(),
  delivery_id uuid not null references public.lesson_deliveries(id) on delete cascade,
  kind        text not null check (kind in ('photo','quote','note')),
  storage_ref text,
  caption     text,
  created_at  timestamptz not null default now()
);

create table if not exists public.generated_reports (
  id           uuid primary key default uuid_generate_v4(),
  school_id    uuid not null references public.school_accounts(id) on delete cascade,
  kind         text not null check (kind in ('coverage','progress','governor_pack','evidence_pack','impact_report','dsl_summary')),
  period       text,
  storage_ref  text,
  generated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- RLS: educators see only their school. Lesson content is public
-- educational material (same pattern as lessons/scripts).
-- ─────────────────────────────────────────────

alter table public.school_accounts    enable row level security;
alter table public.school_educators   enable row level security;
alter table public.school_classes    enable row level security;
alter table public.pupils            enable row level security;
alter table public.school_lessons    enable row level security;
alter table public.lesson_deliveries enable row level security;
alter table public.check_responses   enable row level security;
alter table public.teacher_judgements enable row level security;
alter table public.action_commitments enable row level security;
alter table public.evidence_items    enable row level security;
alter table public.generated_reports enable row level security;

create policy "School lessons are public" on public.school_lessons for select using (true);

create policy "Educators read own school" on public.school_accounts for select
  using (exists (select 1 from public.school_educators e where e.school_id = id and e.user_id = auth.uid()));

create policy "Educators read own membership" on public.school_educators for select
  using (user_id = auth.uid()
     or exists (select 1 from public.school_educators e where e.school_id = school_id and e.user_id = auth.uid()));

create policy "Educators manage own school classes" on public.school_classes for all
  using (exists (select 1 from public.school_educators e where e.school_id = school_id and e.user_id = auth.uid()));

create policy "Educators manage own school pupils" on public.pupils for all
  using (exists (
    select 1 from public.school_classes c
    join public.school_educators e on e.school_id = c.school_id
    where c.id = class_id and e.user_id = auth.uid()));

create policy "Educators manage own deliveries" on public.lesson_deliveries for all
  using (exists (
    select 1 from public.school_classes c
    join public.school_educators e on e.school_id = c.school_id
    where c.id = class_id and e.user_id = auth.uid()));

create policy "Educators manage delivery children: checks" on public.check_responses for all
  using (exists (
    select 1 from public.lesson_deliveries d
    join public.school_classes c on c.id = d.class_id
    join public.school_educators e on e.school_id = c.school_id
    where d.id = delivery_id and e.user_id = auth.uid()));

create policy "Educators manage delivery children: judgements" on public.teacher_judgements for all
  using (exists (
    select 1 from public.lesson_deliveries d
    join public.school_classes c on c.id = d.class_id
    join public.school_educators e on e.school_id = c.school_id
    where d.id = delivery_id and e.user_id = auth.uid()));

create policy "Educators manage delivery children: commitments" on public.action_commitments for all
  using (exists (
    select 1 from public.lesson_deliveries d
    join public.school_classes c on c.id = d.class_id
    join public.school_educators e on e.school_id = c.school_id
    where d.id = delivery_id and e.user_id = auth.uid()));

create policy "Educators manage delivery children: evidence" on public.evidence_items for all
  using (exists (
    select 1 from public.lesson_deliveries d
    join public.school_classes c on c.id = d.class_id
    join public.school_educators e on e.school_id = c.school_id
    where d.id = delivery_id and e.user_id = auth.uid()));

create policy "Educators read own school reports" on public.generated_reports for select
  using (exists (select 1 from public.school_educators e where e.school_id = school_id and e.user_id = auth.uid()));

do $$
declare t text;
begin
  foreach t in array array['school_accounts','school_educators','school_classes','pupils','school_lessons',
                           'lesson_deliveries','check_responses','teacher_judgements','action_commitments',
                           'evidence_items','generated_reports'] loop
    execute format('create policy "Service role full access %s" on public.%I for all using (auth.role() = ''service_role'')', t, t);
  end loop;
end $$;

create index if not exists school_lessons_stage_idx on public.school_lessons (key_stage, sort_order);
create index if not exists deliveries_class_idx on public.lesson_deliveries (class_id, taught_at);
create index if not exists check_responses_delivery_idx on public.check_responses (delivery_id);

-- ─────────────────────────────────────────────
-- Seed: THE REFERENCE LESSON (KS3 Module 12), fully scripted in
-- plans/schools-lesson-build-spec.md section 10. JP approves this
-- lesson before the full 21 module build.
-- ─────────────────────────────────────────────

insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'ks3-12-misinfo-deepfakes',
  'Misinformation, deepfakes and AI content',
  'KS3', 'Years 7 to 9', 'teacher',
  '{5}',
  '{"KCSIE 2025 content risks","Citizenship media literacy","DfE AI in education","RSHE 2026 (deepfakes statutory at KS3/4 from Sep 2026)"}',
  '{"Engage with AI","Manage AI"}',
  'KCSIE 2025 content risk expansion; Orben 2025 review',
  'I can run three checks before I believe or share something.',
  'Zara (Y7 to Y8 register)',
  12,
  '[
    { "type": "title",
      "eyebrow": "KS3 · Years 7 to 9 · Module 12",
      "title": "Misinformation, deepfakes and AI content",
      "body": "One hour, one skill: three checks that catch a fake before you believe it or share it." },
    { "type": "video",
      "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061752_459b1662-1742-4e83-97af-e26c2b0e1688.mp4",
      "caption": "Zara opens the case: real or made?" },
    { "type": "choice",
      "question": "Warm up from last lesson. A friend offers you a workaround to get past an age check. What matters most before you decide anything?",
      "options": [
        { "text": "Whether you would get caught", "correct": false, "feedback": "Getting caught is not the real risk. The real risk is what the workaround takes you into: unregulated spaces with none of the protections." },
        { "text": "What the workaround actually exposes you to", "correct": true, "feedback": "Exactly. A workaround does not just skip a rule, it skips every protection behind the rule. That is the risk to weigh." },
        { "text": "Whether everyone else is doing it", "correct": false, "feedback": "Everyone else doing it changes nothing about what it exposes you to. That is the check that matters." }
      ] },
    { "type": "concept",
      "emoji": "🎭",
      "heading": "Content can be manufactured",
      "body": "Some of what you see online is real. Some is edited. And some is made entirely by a computer: faces, voices, whole events that never happened. The three look identical at first glance. That is not a reason to panic. It is a reason to check, and checking takes under a minute once you know the three questions." },
    { "type": "choice",
      "question": "A video shows a famous footballer saying something shocking. It looks completely real. What is the honest position before you check?",
      "options": [
        { "text": "It is probably real, videos are hard to fake", "correct": false, "feedback": "Videos stopped being hard to fake. A voice and a face can now be generated convincingly by widely available tools." },
        { "text": "You cannot tell yet, and that is exactly why you check", "correct": true, "feedback": "Right. Not paranoia, not blind trust. You simply cannot tell by looking anymore, so the checks do the work your eyes cannot." },
        { "text": "It is probably fake, most things online are lies", "correct": false, "feedback": "Most things online are not lies. Assuming everything is fake is as lazy as believing everything. The checks tell you which is which." }
      ] },
    { "type": "video",
      "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061754_66e88fe5-67c2-47ef-aa10-ebbf022ea96a.mp4",
      "caption": "Zara teaches the three checks" },
    { "type": "concept",
      "emoji": "🔍",
      "heading": "The three checks",
      "body": "One: who made this, and how do they know? Two: what do other places say? Three: how is it trying to make me feel? The third is the deepfake tell. Fakes aim for your feelings, because feelings share fast and check slowly." },
    { "type": "choice",
      "question": "A post makes you furious the second you see it. Which check does that feeling trigger?",
      "options": [
        { "text": "Check three: how is it trying to make me feel", "correct": true, "feedback": "Yes. A big instant feeling is not proof something is false, but it is exactly when the other two checks matter most, because you are least likely to run them." },
        { "text": "No check, feelings are not evidence either way", "correct": false, "feedback": "The feeling itself IS the signal to check. Content built to enrage is content built to spread, true or not." },
        { "text": "Check one only", "correct": false, "feedback": "Check one matters too, but the fury is check three firing. That feeling is the tap on the shoulder." }
      ] },
    { "type": "choice",
      "question": "A post says scientists confirm a shocking finding. No name, no link, no source. Which check fails first?",
      "options": [
        { "text": "Check one: who made this, and how do they know", "correct": true, "feedback": "Exactly. Scientists confirm, with no scientist named and nothing to follow, fails the first check before you even reach the second." },
        { "text": "Check two: what do other places say", "correct": false, "feedback": "Check two would catch it eventually, but the missing source fails check one immediately. Fastest check first." },
        { "text": "None, it might still be true", "correct": false, "feedback": "It might be true. But a claim with no source has failed a check, and that means pause, not share." }
      ] },
    { "type": "video",
      "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_123550_bc3337b7-0b24-4d82-b1e3-965955dd3d1c.mp4",
      "caption": "DiGi Junior half time check in" },
    { "type": "tryit",
      "heading": "Detective practice, on paper",
      "body": "Your teacher has six items on the worksheet: posts, a screenshot chain, and a described video. Run the three checks on each and give a verdict: believe, pause, or do not share. You have fifteen minutes. Verdicts need reasons, a verdict without a reason does not count." },
    { "type": "choice",
      "question": "Exit check. Your neighbour shares a voice message that sounds exactly like a celebrity confessing to something. What do you now know that most people do not?",
      "options": [
        { "text": "Voices can be generated too, so it faces the same three checks as any post", "correct": true, "feedback": "Right. A voice is now just another thing a computer can make. Same checks, same verdicts." },
        { "text": "Voice messages are more trustworthy than video", "correct": false, "feedback": "Voices are now among the easiest things to fake. The checks do not care what format the claim arrives in." },
        { "text": "If it sounds real it probably is", "correct": false, "feedback": "Sounding real stopped being evidence. That is the whole lesson." }
      ] },
    { "type": "choice",
      "question": "True or false: if a picture was made by AI, it is always a lie.",
      "options": [
        { "text": "False. Made by AI tells you how it was made, not whether it is honest", "correct": true, "feedback": "Exactly right, and this is the honest nuance. AI made content can be labelled, harmless or art. The problem is manufactured content pretending to be real. The checks catch the pretending." },
        { "text": "True. AI content is fake by definition", "correct": false, "feedback": "AI made is a method, not a verdict. The lie is in the pretending, not the making. The checks target the pretending." }
      ] },
    { "type": "quote",
      "label": "Say it like Zara",
      "text": "Who made it. What do other places say. How is it trying to make me FEEL? Three checks, under a minute, case closed." },
    { "type": "video",
      "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260703_061806_129f9d14-d174-4444-8de3-e080bdbd52cb.mp4",
      "caption": "Your mission: check before you share" },
    { "type": "recap",
      "heading": "What to remember",
      "points": [
        "You cannot tell real from made by looking anymore. The checks do what your eyes cannot.",
        "The three checks: who made this and how do they know, what do other places say, how is it trying to make me feel.",
        "A big instant feeling is the signal to check, because content built for feelings spreads fastest.",
        "Made by AI is a method, not a verdict. The lie is the pretending, and the checks catch it."
      ] }
  ]'::jsonb,
  '[
    { "beat": "intro",   "character": "zara",        "seconds": 12, "board_text": "REAL OR MADE?",         "model": "kling3_0", "job_id": "459b1662-1742-4e83-97af-e26c2b0e1688" },
    { "beat": "concept", "character": "zara",        "seconds": 10, "board_text": "THE THREE CHECKS",      "model": "kling3_0", "job_id": "66e88fe5-67c2-47ef-aa10-ebbf022ea96a" },
    { "beat": "pause",   "character": "digi_junior", "seconds": 8,  "reuse_library": true,                  "model": "kling3_0", "job_id": "bc3337b7-0b24-4d82-b1e3-965955dd3d1c" },
    { "beat": "mission", "character": "zara",        "seconds": 8,  "board_text": "CHECK BEFORE YOU SHARE", "model": "kling3_0", "job_id": "129f9d14-d174-4444-8de3-e080bdbd52cb" }
  ]'::jsonb,
  '{
    "retrieval_starter": { "questions": 1, "auto_marked": true },
    "in_lesson_checks":  { "count": 3, "auto_marked": true },
    "exit_quiz":         { "questions": 2, "auto_marked": true },
    "teacher_judgement": { "scale": ["working_towards","met","exceeded"], "one_tap": true, "default": "met" },
    "action_commitment": { "captured": true, "revisited_next_lesson": true }
  }'::jsonb,
  '{
    "headline": "What we taught today, and one thing to try at home",
    "taught": "Your child learned that photos, videos and voices can now be manufactured convincingly, and practised three checks: who made this and how do they know, what do other places say, and how is it trying to make me feel.",
    "try_this": "Ask your child to run the three checks on one thing in your own feed this week. Let them be the detective, you be the client.",
    "family_question": "What is the most convincing fake you have ever seen, and how did you find out?",
    "no_login_required": true
  }'::jsonb,
  '{
    "learning_objective": "Pupils can apply three verification checks to online content and justify a believe, pause, or do not share verdict.",
    "timing": "60 minutes: starter 5, cycle one 8, beat and checks 5, cycle two 10, pause 1, independent practice 15, corrections 5, mission and exit 6, plenary 5.",
    "misconceptions": [
      "Videos and voices cannot be faked convincingly (they can, cheaply).",
      "AI made means false (method, not verdict; the lie is the pretending).",
      "Checking means distrusting everything (the checks end in believe verdicts too)."
    ],
    "differentiation": {
      "support": "Pre sorted verdict cards; run checks as a group with the three questions printed as a bookmark.",
      "stretch": "Who benefits when this spreads? Follow the incentive, then connect to how feeds reward reaction."
    },
    "paper_fallback": "The full lesson runs from the printed pack: retrieval card, three checks bookmark, six item worksheet, exit card. Beats are described in the teacher script if no screen is available."
  }'::jsonb,
  '{
    "required": true,
    "note": "KCSIE 2025 names misinformation, disinformation and conspiracy theories as content harms. A pupil may disclose distress about something they have seen or shared. Follow your school safeguarding policy and record in your school system. This platform does not record disclosures.",
    "concern_form_linked": true
  }'::jsonb
)
on conflict (module_id) do nothing;
