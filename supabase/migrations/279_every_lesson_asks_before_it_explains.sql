-- 279_every_lesson_asks_before_it_explains.sql
--
-- THE ENGAGEMENT CADENCE, PART ONE: the opening.
--
-- The lesson quality council scores engagement 6.96 out of ten. 35 of 115
-- stretches run past four minutes, which is the longest we think a child should
-- sit without being asked to do anything.
--
-- Twenty of those 35 are the SAME stretch. Every module except eyfs-01 opens
-- title, then sometimes a video, then objective, then keywords, and only then a
-- choice. That is five to seven minutes of a class watching, and it is the
-- first five to seven minutes of the hour, when a room decides whether this
-- lesson is a thing that happens to them or a thing they are in.
--
-- WHERE THE SLIDE GOES, which is not where I first put it.
--
-- The obvious move is a beat at the very top. Simulated against the council's
-- own check, that changes NOTHING: the passive run is title plus objective plus
-- keywords, and an action in front of it only moves where the run starts. The
-- score came back 6.96 to 6.96. The insert has to land INSIDE the run.
--
-- Trying every position, one slot works for all twenty: after the objective,
-- before the keywords. The opening becomes title (and its video where there is
-- one) at one to two minutes, then the class talks, then objective and keywords
-- at four. Both sides are inside the ceiling.
--
-- It is also the better lesson. The class names its own experience of the thing
-- BEFORE it is given the vocabulary for it, so the keywords land on a room that
-- already has something at stake instead of a room waiting to be told.
--
-- WHY starter AND NOT connect. `connect` is the phase we borrowed from Jigsaw
-- for Connect us and Calm me, and it belongs at the top of a lesson. This slot
-- is not the top, and a connect slide sitting third would put Connect after
-- Recall on the phase strip and march the marker backwards mid lesson. These
-- are starter beats: activating what a child already has, which is what a
-- starter is for. eyfs-01 keeps the only genuine connect slide in the scheme.
--
-- WHAT THEY ASK. Every prompt is answerable with no prior knowledge, is about
-- the child's own week, and never asks anybody to disclose something that
-- happened to them. The three heaviest modules are worded hardest:
--   ks4-17 (sextortion)  asks what makes ANYBODY in trouble stay silent
--   ks3-14 (bodies)      asks about the TOOLS an app has, not about any body
--   ks4-16 (consent)     asks who SHOULD decide, not what anyone has done
--
-- Measured after: engagement 6.96 to 8.89, 120 of 135 stretches inside four
-- minutes, and the 15 that remain are genuine mid lesson gaps that each need
-- their own answer rather than this one repeated.

begin;

create temporary table _connect_plan (
  module_id text primary key,
  at        int  not null,   -- 0 based index to insert BEFORE
  slide     jsonb not null
) on commit drop;

insert into _connect_plan (module_id, at, slide) values
  ('ks1-02-kind-screens-calm-bodies', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner how your body feels right now.", "mode": "pairs", "seconds": 60, "lookFor": "Wiggly, sleepy, fine. Every answer is right.", "script": "Before we start, turn to the person next to you. Tell them how your body feels right now. Wiggly, sleepy, fine, anything. There is no wrong answer to this one, and I want to hear a few before we go on."}'::jsonb),
  ('ks1-03-real-pretend-computer', 3, '{"type": "discussion", "phase": "starter", "minutes": 2, "mode": "pairs", "seconds": 60, "prompt": "Tell your partner about a cartoon you like.", "lookFor": "Every child has one, and every one of them is made up.", "script": "Sixty seconds. Tell the person next to you about a cartoon you like. Then keep it in your head, because every single one of those was made up by somebody, and that is exactly what we are talking about today."}'::jsonb),
  ('ks2-04-screen-routines', 3, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner one thing you always do before you go to sleep. Anything at all, screens or not.", "mode": "pairs", "seconds": 60, "lookFor": "Everybody already has a routine, even the ones who have never called it that. That is the hook for the whole hour.", "script": "Sixty seconds with the person next to you. One thing you always do before bed. Not what you should do, what you actually do. I will take three of them."}'::jsonb),
  ('ks2-05-gaming-time-spend', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner about a game you like, and one thing in it that costs money.", "mode": "pairs", "seconds": 60, "lookFor": "Skins, coins, chests, battle passes. They know the shop is there. Starting from what they already know is what keeps them with you.", "script": "Sixty seconds. A game you like, and one thing in it you can pay for. I am not going to tell you gaming is bad, because it is not. I want to know what you already notice."}'::jsonb),
  ('ks2-06-how-algorithms-work', 3, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner the last video an app showed you that you had not gone looking for.", "mode": "pairs", "seconds": 60, "lookFor": "Everybody has one, and nobody chose it. That is the whole lesson, and they got there before we started.", "script": "Sixty seconds. The last thing an app put in front of you that you never searched for. Hold that in your head, because by the end of today you will know exactly why you got it."}'::jsonb),
  ('ks2-07-privacy-reputation', 3, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner one thing about you that is fine for anyone to know. Then think of one thing you would keep to yourself, and do not say it.", "mode": "pairs", "seconds": 60, "lookFor": "They sort information into public and private without being taught. Today we give that instinct a name and a bit of muscle.", "script": "Sixty seconds. One thing about you that anyone could know, out loud. Then one thing you would keep to yourself, and that one stays in your head. You already know the difference. Today we get better at it."}'::jsonb),
  ('ks2-08-kind-safe-online', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner what you would want a friend to do if somebody was being unkind to you.", "mode": "pairs", "seconds": 60, "lookFor": "Nearly every answer is a version of tell someone or stand with me. That is the lesson, in their words, before it is taught.", "script": "Sixty seconds with your partner. Not what you would do. What you would want a friend to do for you. I will take a few of those, and then I am going to show you that you have just written the lesson."}'::jsonb),
  ('ks2-09-copyright-ownership', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner about something you made that you were proud of. A drawing, a build, a story, anything.", "mode": "pairs", "seconds": 60, "lookFor": "Pride in your own work is the feeling this whole lesson rests on. Get it into the room before anything else.", "script": "Sixty seconds. Something you made that you were proud of. Keep that feeling, because in a minute I am going to ask you how you would feel if somebody put their name on it."}'::jsonb),
  ('ks3-10-mood-and-screens', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner one thing you do on a screen that leaves you feeling good, and one that leaves you flat.", "mode": "pairs", "seconds": 60, "lookFor": "The interesting answers are the ones where the same app turns up in both halves. That is the finding, and the class gets there on its own.", "script": "Sixty seconds. One thing that leaves you feeling good, one that leaves you flat. If the same app ends up in both, say so, because that is the most interesting answer in the room."}'::jsonb),
  ('ks3-11-social-workarounds', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner one rule an app has that people your age get around. You do not have to say whether you have.", "mode": "pairs", "seconds": 60, "lookFor": "Age gates, second accounts, borrowed logins, a VPN. Letting them name it openly is what buys you the rest of the hour.", "script": "Sixty seconds, and I want you to be straight with me. One rule an app has that people your age get around. Nobody is in trouble and nobody has to say whether they have done it. I already know these exist. Pretending otherwise would waste your time and mine."}'::jsonb),
  ('ks3-12-misinfo-deepfakes', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner about something you saw online that turned out not to be true.", "mode": "pairs", "seconds": 60, "lookFor": "Ask how they found out. Almost always somebody else told them, not that it looked fake. That is the point the lesson turns on.", "script": "Sixty seconds. Something you saw that turned out to be false. Then tell your partner how you found out. That second bit is the one I am really asking about."}'::jsonb),
  ('ks3-13-scams-fraud-money', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner about a message somebody has had that was trying to trick them.", "mode": "pairs", "seconds": 60, "lookFor": "Somebody rather than you, on purpose. Everybody has a story to bring and nobody has to make it their own.", "script": "Sixty seconds. A message somebody has had that was trying to trick them. It can be you, it can be your mum, it can be a mate. Notice I said somebody, and I meant it."}'::jsonb),
  ('ks3-14-bodies-image-pressure', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner one thing an app can do to a photo before it gets posted.", "mode": "pairs", "seconds": 60, "lookFor": "Filters, cropping, smoothing, lighting, the hundred takes nobody sees. They know the tools. Today is about what the tools are for.", "script": "Sixty seconds, and this one is about the tools, not about anybody in this room. One thing an app can do to a photo before it goes up. You know more about this than you think you do."}'::jsonb),
  ('ks4-15-manipulation-persuasion', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner about a time an app or a shop got you to do something you had not planned to do.", "mode": "pairs", "seconds": 60, "lookFor": "Autoplay, a countdown, one more episode, a free trial. Every answer is a technique with a name, and naming them is the hour.", "script": "Sixty seconds. A time something got you to do what you had not planned. Buying, watching, staying up. Every single one of those has a name and a designer, and by the end of today you will be able to name them out loud."}'::jsonb),
  ('ks4-16-consent-images-law', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner what you think should happen before a photo of you goes anywhere. Who gets to decide?", "mode": "pairs", "seconds": 60, "lookFor": "Nearly everyone says they should. Hold onto that, because the law agrees with them more than they expect it to.", "script": "Sixty seconds. Who should get to decide whether a photo of you goes anywhere. Say what you think should happen, not what you think the rule is. We will get to the actual law in a minute, and it is closer to your answer than you would guess."}'::jsonb),
  ('ks4-17-sextortion', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner what makes anybody in trouble decide to keep it to themselves. Not you. Anybody.", "mode": "pairs", "seconds": 60, "lookFor": "Shame, fear of the reaction, thinking they brought it on themselves. Naming those out loud is what the whole hour works against.", "script": "Sixty seconds, and listen to how I have asked this. Not you. Anybody. What makes a person in trouble keep it to themselves. Everything you say in the next minute is the thing this lesson exists to beat."}'::jsonb),
  ('ks4-18-radicalisation-misogyny', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner about someone online that a lot of people your age listen to. Then say why you think people listen.", "mode": "pairs", "seconds": 60, "lookFor": "Push for the mechanism, not the names. He says what nobody else will, he is funny, he sounds like he is on my side.", "script": "Sixty seconds. Someone online who people your age actually listen to, and then the important half: why do you think they listen. I am not asking you to defend anybody or attack anybody. I want the reason."}'::jsonb),
  ('ks4-19-readiness-at-16', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner one thing you expect to be different about your phone the day you turn sixteen.", "mode": "pairs", "seconds": 60, "lookFor": "Most expect everything to change and have planned nothing. That gap is the reason this hour exists.", "script": "Sixty seconds. One thing you expect to be different on your sixteenth birthday. Then keep hold of it, because I am going to ask you what your plan for it is, and most people have not got one."}'::jsonb),
  ('ks5-20-ai-mastery-data-rights', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner the last thing you used an AI tool for, and how you checked whether it was right.", "mode": "pairs", "seconds": 60, "lookFor": "The room goes quiet on the second half. That silence is exactly the skill this lesson builds.", "script": "Sixty seconds, two parts. What you last used it for, and how you checked it. If the second half is harder to answer than the first, that is not a criticism. That is the reason you are here."}'::jsonb),
  ('ks5-21-digital-identity-future-work', 2, '{"type": "discussion", "phase": "starter", "minutes": 2, "prompt": "Tell your partner one thing you can do that you would not want a computer doing instead.", "mode": "pairs", "seconds": 60, "lookFor": "Push past job titles to the actual skill: reading a room, making a judgement call, persuading someone face to face.", "script": "Sixty seconds. One thing you can do that you would not hand to a computer. Try to get past the job title to the actual skill underneath it, because the skill is the part that keeps its value."}'::jsonb);

-- Every planned module has to exist, or a typo silently does nothing.
do $$
declare missing text;
begin
  select string_agg(p.module_id, ', ') into missing
  from _connect_plan p
  left join schools.school_lessons l on l.module_id = p.module_id
  where l.module_id is null;
  if missing is not null then
    raise exception 'unknown module_id in plan: %', missing;
  end if;
end $$;

-- The slide the plan expects to insert after must be the objective, so a deck
-- that has been reordered since this was written fails loudly instead of
-- landing the beat somewhere it makes no sense.
do $$
declare wrong text;
begin
  select string_agg(p.module_id || ' (found ' || coalesce(l.slides -> (p.at - 1) ->> 'type', 'nothing') || ')', ', ')
    into wrong
  from _connect_plan p
  join schools.school_lessons l on l.module_id = p.module_id
  where l.slides -> (p.at - 1) ->> 'type' is distinct from 'objective';
  if wrong is not null then
    raise exception 'expected an objective slide immediately before the insert: %', wrong;
  end if;
end $$;

update schools.school_lessons l
set slides = (
  select coalesce(jsonb_agg(t.e order by t.n) filter (where t.n <= p.at), '[]'::jsonb)
       || jsonb_build_array(p.slide)
       || coalesce(jsonb_agg(t.e order by t.n) filter (where t.n > p.at), '[]'::jsonb)
  from jsonb_array_elements(l.slides) with ordinality t(e, n)
)
from _connect_plan p
where l.module_id = p.module_id;

-- ── Guards ──────────────────────────────────────────────────────────

-- 1. Twenty modules, each carrying its new slide at the planned index.
do $$
declare n int;
begin
  select count(*) into n
  from _connect_plan p
  join schools.school_lessons l on l.module_id = p.module_id
  where l.slides -> p.at ->> 'type' = 'discussion'
    and l.slides -> p.at ->> 'phase' = 'starter'
    and l.slides -> p.at ->> 'prompt' = p.slide ->> 'prompt';
  if n <> 20 then
    raise exception 'expected 20 modules to carry their new starter beat, found %', n;
  end if;
end $$;

-- 2. The objective is still immediately before it, and the keywords slide
--    immediately after: the beat sits between them, which is the whole point.
do $$
declare wrong text;
begin
  select string_agg(p.module_id, ', ') into wrong
  from _connect_plan p
  join schools.school_lessons l on l.module_id = p.module_id
  where l.slides -> (p.at - 1) ->> 'type' is distinct from 'objective'
     or l.slides -> (p.at + 1) ->> 'type' is distinct from 'keywords';
  if wrong is not null then
    raise exception 'the new beat is not between the objective and the keywords: %', wrong;
  end if;
end $$;

-- 3. Every new slide carries a prompt, a lookFor and a script. A discussion
--    with no lookFor is a minute of noise with nothing to hear in it.
do $$
declare thin text;
begin
  select string_agg(p.module_id, ', ') into thin
  from _connect_plan p
  join schools.school_lessons l on l.module_id = p.module_id
  where coalesce(l.slides -> p.at ->> 'prompt', '') = ''
     or coalesce(l.slides -> p.at ->> 'lookFor', '') = ''
     or coalesce(l.slides -> p.at ->> 'script', '') = '';
  if thin is not null then
    raise exception 'new beat missing prompt, lookFor or script: %', thin;
  end if;
end $$;

-- 4. No dashes in any of the new copy. Justin, standing rule.
do $$
declare dashed text;
begin
  select string_agg(p.module_id, ', ') into dashed
  from _connect_plan p
  where (p.slide ->> 'prompt') like '%-%'
     or (p.slide ->> 'lookFor') like '%-%'
     or (p.slide ->> 'script') like '%-%';
  if dashed is not null then
    raise exception 'dash in new copy: %', dashed;
  end if;
end $$;

-- 5. The scheme grew by exactly twenty slides and nothing else moved.
do $$
declare total int;
begin
  select sum(jsonb_array_length(slides)) into total from schools.school_lessons;
  if total <> 513 then
    raise exception 'expected 513 slides across the scheme after this, found %', total;
  end if;
end $$;

-- 6. eyfs-01 is untouched: it already opens with the one real connect slide in
--    the scheme, and its remaining stretch is a mid lesson gap, not this one.
do $$
declare n int;
begin
  select count(*) into n from schools.school_lessons
  where module_id = 'eyfs-01-screens-kindness'
    and slides -> 0 ->> 'phase' = 'connect'
    and slides -> 0 ->> 'component' = 'star-breath';
  if n <> 1 then
    raise exception 'eyfs-01 no longer opens with its connect slide';
  end if;
end $$;

commit;
