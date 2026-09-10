-- 280_fifteen_places_a_class_stopped_being_asked.sql
--
-- THE ENGAGEMENT CADENCE, PART TWO: the mid lesson gaps.
--
-- 279 fixed the twenty openings, which were the same stretch twenty times, and
-- took engagement from 6.96 to 8.89. Fifteen stretches were left and none of
-- them is the same as any other. They are runs of concept, diagram and stat
-- where the teaching is good and nothing is asked for five to eight minutes.
--
-- Sixteen beats, not fifteen: ks4-17 runs eight minutes across three slides and
-- no single insert splits that under the four minute ceiling, so it gets two.
--
-- WHERE EACH ONE GOES is computed, not chosen. Walk the stretch accumulating
-- minutes and cut as late as the ceiling allows. That is the fewest beats and
-- every one lands on a slide boundary the lesson already has.
--
-- THE PHASE IS NOT AUTHORED. Each beat takes the phase of the slide it sits in
-- front of, so a beat can never announce a phase the lesson is not in at that
-- moment. Fourteen land in teach, one in the eyfs-01 starter, one in the ks3-12
-- close.
--
-- WHAT THEY ARE. Mostly a `choice`, because a run of teaching is exactly where
-- Rosenshine puts a check for understanding, and the question is written to
-- catch the misconception the next slide is about to correct rather than to
-- reward listening. Where there is no right answer to check, a `discussion`:
-- ks2-09 asks who made an AI picture, which real judges are still arguing
-- about, and the slide straight after it says so. ks3-12 closes on a `quote`,
-- which the player renders under Say this, because the last thing a class does
-- in that lesson should be to say the outcome out loud.
--
-- SAFEGUARDING. The two heaviest are ks4-17 and ks3-14. ks4-17 asks who has
-- done something wrong when someone is blackmailed, and the correct answer is
-- the blackmailer and only the blackmailer; the wrong answers are the two the
-- room will actually be thinking, and each is answered rather than dismissed.
-- ks3-14 asks what follows from content being produced, performed and edited,
-- and its script says out loud that nobody will be asked what they have seen.
--
-- Measured after: engagement 8.89 to 10.00, 151 of 151 stretches inside four
-- minutes, prose held at 9.78, blocks 9.53 to 9.55.

begin;

create temporary table _beat_plan (
  module_id text not null,
  at        int  not null,   -- 0 based index to insert BEFORE, pre migration
  final_at  int  not null,   -- where it lands once this module's inserts are done
  expected  text not null,   -- the slide type currently at `at`
  slide     jsonb not null,
  primary key (module_id, at)
) on commit drop;

insert into _beat_plan (module_id, at, final_at, expected, slide) values
  ('eyfs-01-screens-kindness', 3, 3, 'keywords', '{"type": "discussion", "minutes": 1, "mode": "pairs", "seconds": 60, "prompt": "Tell your partner something you have seen on a screen.", "lookFor": "Everybody has one. Nobody is stuck.", "script": "Turn to the person next to you. Tell them one thing you have seen on a screen. Anything at all. Then we will learn our three special words.", "phase": "starter"}'::jsonb),
  ('ks2-05-gaming-time-spend', 6, 6, 'diagram', '{"type": "discussion", "minutes": 2, "mode": "pairs", "seconds": 60, "prompt": "Tell your partner about a time you meant to play for ten minutes and played for a lot longer.", "lookFor": "Nobody is in trouble for this and it should not sound like a telling off. You want them noticing the pull, because the next slide names the tools that made it.", "script": "Sixty seconds. A time you meant to play for ten minutes and it was not ten minutes. It happens to me too. Then I am going to show you the tools that did it.", "phase": "teach"}'::jsonb),
  ('ks2-05-gaming-time-spend', 11, 12, 'diagram', '{"type": "choice", "minutes": 2, "question": "A game sells gems and coins instead of pounds. Why do you think it does that?", "options": [{"text": "So your brain stops counting real money.", "correct": true, "feedback": "Exactly. Nobody feels three pounds fifty when it says two hundred gems. That is the whole trick, and turning gems back into pounds beats it."}, {"text": "Because pounds do not work inside games.", "correct": false, "feedback": "They do. The game could show you the price in pounds any time it wanted. It chooses not to."}, {"text": "To make it fairer for everybody.", "correct": false, "feedback": "It is not about fairness. Ask yourself who it is easier for, the player or the shop."}], "script": "Hands down, think first. Why gems and not pounds. There is a good reason and it is not a kind one.", "phase": "teach"}'::jsonb),
  ('ks2-06-how-algorithms-work', 11, 11, 'diagram', '{"type": "choice", "minutes": 2, "question": "You skip a video after two seconds. What has the feed just learned about you?", "options": [{"text": "That you did not want that one, so it will try something different.", "correct": true, "feedback": "Yes. A skip is a signal too. You are teaching it every second, whether you mean to or not."}, {"text": "Nothing. Skipping does not count.", "correct": false, "feedback": "It counts. The feed reads what you skip just as carefully as what you finish."}, {"text": "That you want more of exactly that one.", "correct": false, "feedback": "The opposite. Finishing says more please, skipping says try again."}], "script": "Quick check before the loop. You skip something after two seconds. What did you just tell it. Everyone thinks, then I will take hands.", "phase": "teach"}'::jsonb),
  ('ks2-07-privacy-reputation', 7, 7, 'diagram', '{"type": "choice", "minutes": 2, "question": "You are the editor of your own story. What does an editor actually do?", "options": [{"text": "Chooses what goes in and what stays out.", "correct": true, "feedback": "That is it. Not a person who says no to everything, a person who decides. And nobody else gets that job."}, {"text": "Says no to everything.", "correct": false, "feedback": "That is not editing, that is hiding. An editor picks, and picking means some things go in."}, {"text": "Lets everything through and sorts it out later.", "correct": false, "feedback": "Online there often is no later. The choosing has to happen before it goes out."}], "script": "Quick one. What does an editor do. I want the word chooses in the room before we look at the private list.", "phase": "teach"}'::jsonb),
  ('ks2-08-kind-safe-online', 14, 14, 'concept', '{"type": "discussion", "minutes": 2, "mode": "pairs", "seconds": 60, "prompt": "Tell your partner the three moves in order, without looking at the board.", "lookFor": "In order is the part that matters. If a pair gets two, say the third one together before you move on.", "script": "Sixty seconds. Three moves, in order, no looking. I will pick two pairs to say them back to me.", "phase": "teach"}'::jsonb),
  ('ks2-09-copyright-ownership', 14, 14, 'diagram', '{"type": "discussion", "minutes": 2, "mode": "pairs", "seconds": 60, "prompt": "You typed castle in space and a picture appeared. Tell your partner who you think actually made it.", "lookFor": "You want disagreement here, not a right answer. Real judges are still arguing about this one, and the next slide says so out loud.", "script": "Sixty seconds and I want you to disagree with each other. Who made that picture. You. The tool. The people whose drawings it learned from. There is no answer at the back of the book for this one.", "phase": "teach"}'::jsonb),
  ('ks3-11-social-workarounds', 7, 7, 'diagram', '{"type": "choice", "minutes": 2, "question": "Someone sets their age to 22 to get past a sign up screen. What else have they just changed?", "options": [{"text": "Who is allowed to message them, and how strictly the filters run.", "correct": true, "feedback": "That is the part nobody is told. The box is not a door, it is a switch wired to a lot of other things."}, {"text": "Nothing else. It is one box on a form.", "correct": false, "feedback": "It looks like one box. It is the setting a lot of the protections are wired to, which is what the next slide shows you."}, {"text": "Only which adverts they see.", "correct": false, "feedback": "Adverts change too, and that is the least of it. Contact and filtering are the ones that matter here."}], "script": "Think on your own for a moment. Not whether anyone does this, we have already agreed people do. What else does it change.", "phase": "teach"}'::jsonb),
  ('ks3-12-misinfo-deepfakes', 27, 27, 'digi', '{"type": "quote", "minutes": 2, "label": "Say it together", "text": "I check before I share, because I cannot tell by looking.", "script": "Everybody, out loud, together. I check before I share, because I cannot tell by looking. Once more, and mean the second half, because that is the bit that took a whole hour to earn.", "phase": "close"}'::jsonb),
  ('ks3-13-scams-fraud-money', 16, 16, 'diagram', '{"type": "choice", "minutes": 2, "question": "Scammers know most teenagers think scams only catch older people. Why is that useful to a scammer?", "options": [{"text": "Somebody who is sure they cannot be caught stops checking.", "correct": true, "feedback": "That is the whole thing. Being certain is the vulnerability, and it is the one you can fix in the next ten minutes."}, {"text": "It means teenagers have more money.", "correct": false, "feedback": "They are not after your savings. They are after your accounts, which are worth real money to somebody else."}, {"text": "It makes the scam cheaper to run.", "correct": false, "feedback": "Cost is not the point. Confidence is. A careful person is a hard target and a certain one is not."}], "script": "Last check before we take one apart. Why is it useful to them that you think this does not happen to people your age.", "phase": "teach"}'::jsonb),
  ('ks3-14-bodies-image-pressure', 14, 14, 'stat', '{"type": "choice", "minutes": 2, "question": "You have just heard that this is produced content: performed, directed and edited. What follows from that?", "options": [{"text": "It is not a guide to what real people or real bodies are like.", "correct": true, "feedback": "That is the whole point. Comparing yourself to a production is comparing yourself to something nobody is, including the people in it."}, {"text": "It means none of it is real at all.", "correct": false, "feedback": "Not quite. Real people made it, and it can still affect you. Produced means built to a brief, not imaginary."}, {"text": "It means it does not affect anybody.", "correct": false, "feedback": "No. Knowing how something was made does not switch off how it lands. Naming it is a start, not a cure."}], "script": "Think on your own. This is about how the thing was made, not about anybody in this room, and I am not going to ask anyone what they have seen.", "phase": "teach"}'::jsonb),
  ('ks4-17-sextortion', 6, 6, 'stat', '{"type": "choice", "minutes": 2, "question": "Someone is being blackmailed over an image. Who has done something wrong here?", "options": [{"text": "The person doing the blackmailing. Only them.", "correct": true, "feedback": "Only them. Blackmail is a crime, and being targeted by a crime is not a mistake you made."}, {"text": "Both of them, a bit.", "correct": false, "feedback": "No. One person is committing a crime and the other is being targeted by it. Splitting the blame is exactly what a blackmailer is counting on."}, {"text": "The person who sent the image.", "correct": false, "feedback": "No. Whatever happened before it, the crime is the blackmail. That is where the police start, and it is where we start too."}], "script": "Hands down, think on your own first. I want this landed before we go any further, because every single thing left in this hour rests on it.", "phase": "teach"}'::jsonb),
  ('ks4-17-sextortion', 7, 8, 'diagram', '{"type": "choice", "minutes": 2, "question": "This happens in every school in the country. What does that tell you about the people doing it?", "options": [{"text": "They are running the same script on thousands of people at once.", "correct": true, "feedback": "Exactly. It is a business, not a person who picked you. That is why the approach feels like luck and never is."}, {"text": "They picked that one person specially.", "correct": false, "feedback": "Almost never. It feels personal because it is written to feel personal, and it is being sent to thousands of people at the same time."}, {"text": "It only catches people who are careless.", "correct": false, "feedback": "No. It catches careful people every week, which is precisely why nobody in this room should ever feel too silly to tell someone."}], "script": "One more before the diagram. If it is happening everywhere, what does that make it. I am steering you towards the word business.", "phase": "teach"}'::jsonb),
  ('ks4-19-readiness-at-16', 6, 6, 'diagram', '{"type": "discussion", "minutes": 2, "mode": "pairs", "seconds": 60, "prompt": "You will hear this law called protection and called delay. Tell your partner which it has been for you, and why.", "lookFor": "Both answers are allowed. What you want attached is a reason, because the reason is the thing they still have on their sixteenth birthday.", "script": "Sixty seconds, and I genuinely do not mind which way you land. Protection or delay, and then the important word: why. I am not marking your answer, I am listening for the reason.", "phase": "teach"}'::jsonb),
  ('ks5-20-ai-mastery-data-rights', 7, 7, 'concept', '{"type": "discussion", "minutes": 2, "mode": "pairs", "seconds": 60, "prompt": "Most people stop at the first of those four. Tell your partner which one you actually stop at, and be honest.", "lookFor": "Nearly everyone stops at using it. The gap between using and checking is the whole lesson, and it lands harder when they hear themselves say it.", "script": "Sixty seconds, and be honest with each other rather than with me. Which of those four do you actually get to. The next two slides explain why the answer matters more than it used to.", "phase": "teach"}'::jsonb),
  ('ks5-21-digital-identity-future-work', 12, 12, 'diagram', '{"type": "discussion", "minutes": 2, "mode": "pairs", "seconds": 60, "prompt": "Before you see the answer: name one part of a job you think AI compresses, and one part it makes worth more.", "lookFor": "Push past job titles to the layer of the work. Routine output compresses. Judgement, trust and the awkward conversation expand.", "script": "Sixty seconds. One thing that shrinks, one thing that gets more valuable. Then we will see how close you were.", "phase": "teach"}'::jsonb);

-- Every planned module has to exist.
do $$
declare missing text;
begin
  select string_agg(distinct p.module_id, ', ') into missing
  from _beat_plan p left join schools.school_lessons l on l.module_id = p.module_id
  where l.module_id is null;
  if missing is not null then raise exception 'unknown module_id in plan: %', missing; end if;
end $$;

-- The deck must still be the deck this was computed against. A reordered lesson
-- fails here rather than taking a beat somewhere it makes no sense.
do $$
declare wrong text;
begin
  select string_agg(p.module_id || ' at ' || p.at || ' (expected ' || p.expected ||
                    ', found ' || coalesce(l.slides -> p.at ->> 'type', 'nothing') || ')', '; ')
    into wrong
  from _beat_plan p join schools.school_lessons l on l.module_id = p.module_id
  where l.slides -> p.at ->> 'type' is distinct from p.expected;
  if wrong is not null then raise exception 'deck has moved since this was planned: %', wrong; end if;
end $$;

-- Highest index first, so an earlier insert never shifts a later one.
do $$
declare r record;
begin
  for r in select * from _beat_plan order by module_id, at desc loop
    update schools.school_lessons l
    set slides = (
      select coalesce(jsonb_agg(t.e order by t.n) filter (where t.n <= r.at), '[]'::jsonb)
           || jsonb_build_array(r.slide)
           || coalesce(jsonb_agg(t.e order by t.n) filter (where t.n > r.at), '[]'::jsonb)
      from jsonb_array_elements(l.slides) with ordinality t(e, n)
    )
    where l.module_id = r.module_id;
  end loop;
end $$;

-- ── Guards ──────────────────────────────────────────────────────────

-- 1. All sixteen landed where they were planned to land.
do $$
declare n int;
begin
  select count(*) into n
  from _beat_plan p join schools.school_lessons l on l.module_id = p.module_id
  where l.slides -> p.final_at ->> 'type' = p.slide ->> 'type'
    and l.slides -> p.final_at ->> 'script' = p.slide ->> 'script';
  if n <> 16 then raise exception 'expected 16 beats in place, found %', n; end if;
end $$;

-- 2. Each beat carries the phase of the slide now after it. A beat that names a
--    phase the lesson is not in would walk the phase strip backwards.
do $$
declare wrong text;
begin
  select string_agg(p.module_id || ' at ' || p.final_at, ', ') into wrong
  from _beat_plan p join schools.school_lessons l on l.module_id = p.module_id
  where l.slides -> p.final_at ->> 'phase'
        is distinct from l.slides -> (p.final_at + 1) ->> 'phase';
  if wrong is not null then raise exception 'beat phase does not match the slide it precedes: %', wrong; end if;
end $$;

-- 3. Every choice has exactly one correct option, and every option has feedback.
--    A choice with two right answers or a silent wrong answer teaches nothing.
do $$
declare wrong text;
begin
  select string_agg(p.module_id || ' at ' || p.final_at, ', ') into wrong
  from _beat_plan p
  where p.slide ->> 'type' = 'choice'
    and ( (select count(*) from jsonb_array_elements(p.slide -> 'options') o
           where (o ->> 'correct')::boolean) <> 1
       or (select count(*) from jsonb_array_elements(p.slide -> 'options') o
           where coalesce(o ->> 'feedback', '') = '') > 0 );
  if wrong is not null then raise exception 'choice needs exactly one correct option and feedback on all: %', wrong; end if;
end $$;

-- 4. Every discussion has a prompt and a lookFor, and every beat has a script.
do $$
declare thin text;
begin
  select string_agg(p.module_id || ' at ' || p.final_at, ', ') into thin
  from _beat_plan p
  where coalesce(p.slide ->> 'script', '') = ''
     or (p.slide ->> 'type' = 'discussion'
         and (coalesce(p.slide ->> 'prompt', '') = '' or coalesce(p.slide ->> 'lookFor', '') = ''));
  if thin is not null then raise exception 'beat missing script, prompt or lookFor: %', thin; end if;
end $$;

-- 5. No dashes in any of the new copy, options and feedback included.
do $$
declare dashed text;
begin
  select string_agg(p.module_id || ' at ' || p.final_at, ', ') into dashed
  from _beat_plan p
  where coalesce(p.slide ->> 'script', '') like '%-%'
     or coalesce(p.slide ->> 'prompt', '') like '%-%'
     or coalesce(p.slide ->> 'lookFor', '') like '%-%'
     or coalesce(p.slide ->> 'question', '') like '%-%'
     or coalesce(p.slide ->> 'text', '') like '%-%'
     or exists (select 1 from jsonb_array_elements(coalesce(p.slide -> 'options', '[]'::jsonb)) o
                where (o ->> 'text') like '%-%' or (o ->> 'feedback') like '%-%');
  if dashed is not null then raise exception 'dash in new copy: %', dashed; end if;
end $$;

-- 6. THE CYCLE MAP. The player derives cycles from teach phase slides that
--    carry a heading, and cycle one always opens on the first teach slide. So
--    a beat can unanchor a lesson's map in exactly two ways: by carrying a
--    heading a cycle title could match, or by becoming the first teach slide
--    and putting a question where the map expects the teaching to start.
--
--    Both are checked here rather than argued in a comment, because this
--    session cannot read teacher_notes.cycles (no execute_sql permission) and a
--    cycle check against a copy with no cycles in it passes while proving
--    nothing. These two hold whatever the cycles turn out to say.
do $$
declare wrong text;
begin
  select string_agg(p.module_id || ' at ' || p.final_at, ', ') into wrong
  from _beat_plan p where p.slide ? 'heading';
  if wrong is not null then
    raise exception 'a beat carries a heading, which a cycle title could anchor to: %', wrong;
  end if;

  select string_agg(l.module_id, ', ') into wrong
  from schools.school_lessons l
  join lateral (
    select e ->> 'type' as t, e ->> 'script' as sc
    from jsonb_array_elements(l.slides) e
    where e ->> 'phase' = 'teach'
    limit 1
  ) first on true
  where first.t in ('choice', 'discussion', 'quote')
    and exists (select 1 from _beat_plan p where p.module_id = l.module_id and p.slide ->> 'script' = first.sc);
  if wrong is not null then
    raise exception 'a beat is now the first teach slide, which cycle one opens on: %', wrong;
  end if;
end $$;

-- 7. The scheme is 529 slides: 513 after 279, plus these sixteen.
do $$
declare total int;
begin
  select sum(jsonb_array_length(slides)) into total from schools.school_lessons;
  if total <> 529 then raise exception 'expected 529 slides across the scheme, found %', total; end if;
end $$;

commit;
