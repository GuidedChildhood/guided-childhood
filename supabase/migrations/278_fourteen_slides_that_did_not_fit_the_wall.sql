-- THE FOURTEEN SLIDES THAT DID NOT FIT THE WALL.
--
-- Measured, not asserted: all 78 KS2 to KS5 prose slides were rendered through
-- the real player at 1920x1080 and 1366x768 and checked for the two failures a
-- class sees, text clipped inside the scrolling area and the Continue control
-- pushed off screen. After the decoration fix (WALL.emoji), six still overflow,
-- at 106 to 131 words. Below 106, nothing fails.
--
-- FOURTEEN ARE SPLIT, NOT SIX, and the ceiling guard is why. Six slides clip
-- today. Another eight sit between 106 and 113 words, the band where fitting
-- depends on how long the heading happens to be, so they fit by luck rather
-- than by design. The first draft of this migration split only the six and its
-- own guard rejected it, which was the guard doing its job: a ceiling that
-- means "stay out of the coin flip band" cannot make an exception for the
-- slides that won the toss.
--
-- SPLIT, NOT CUT, AND SPLIT BY MARKER RATHER THAN BY RETYPING.
--
-- Three of the fourteen are the most safeguarding sensitive slides in the
-- scheme: pornography exposure, coercion and threats, and what to do when an
-- image is already out there. Their scripts say "read this slide almost word
-- for word" and "slow right down, this is the most important slide of the
-- hour". The body IS the script there, so a non specialist teacher has exact
-- words for the hardest minutes of the lesson.
--
-- Cutting those words to hit a number would strip the wording a teacher is told
-- to read aloud. Leaving them is worse: a teacher reading word for word from a
-- slide whose last third is off the bottom of the wall.
--
-- So each slide is cut at a marker that already exists in its body, and the two
-- halves are the text either side of it. No copy is retyped, which means no
-- safeguarding sentence can be altered by a transcription slip. The three
-- places where the second half needed a new opening word are the only
-- overrides, and each is named below. A guard reassembles every non overridden
-- split and asserts it matches the original body exactly.
--
-- Beat order is load bearing on ks4-16 slide 15. It must land "not your fault"
-- and "you will not be in trouble" BEFORE the fix, which is how the split
-- falls: truths on the first, Report Remove on the second, and the third truth
-- "something can be done" carried in the second slide's heading so it is not
-- lost.
--
-- Minutes are halved, so every module total is unchanged and the cycle map,
-- which the player derives from minutes, still lands where it did.

begin;

create temporary table _split_plan (
  module_id text, slide_no int,
  split_after text,   -- the last words of the first half, already in the body
  head_a text, head_b text,
  script_a text, script_b text,
  body_b_override text  -- only where the second half needs a new opening
) on commit drop;

insert into _split_plan values
('ks2-04-screen-routines', 14, 'each other''s day.',
 'The table', 'And the desk',
 'Keep this warm and completely unpreachy, Bloop''s rule is that we never make anyone feel bad about loving screens, he loves them too. Ask: who has ever watched something at the table and realised they cannot remember eating? Laugh with them.',
 'Then the desk point, which surprises people: a phone face down next to your homework still costs you focus, because your brain spends effort ignoring it. Not a guilt trip, a design fact, and designers fix design problems.', null),

('ks3-11-social-workarounds', 5, 'keep you there longer.',
 'How the machine sees you', 'Your age is the biggest lever',
 'Build the profile concretely: the age you typed in, what you watch, what you pause on, what you search late at night. Then let the last line sit, its only job is to keep you there longer.',
 'Land the last two lines hard: the platform does not know you, it knows the age you typed in, and it builds your world from that. Then plant the question without answering it: so what changes if that age is wrong? Hold the silence for a moment. The next slide answers it.', null),

('ks3-14-bodies-image-pressure', 12, 'you are not in trouble.',
 'Some made content distorts more than others', 'What it is, and what it is not',
 'Read this slide almost word for word and keep your tone level, the same voice you used for retouching. Do not ask for hands, do not invite stories, do not ask who has seen what, and do not describe any content yourself.',
 'Same level tone, still word for word. Close down any pupil who starts to share specifics in front of the class, kindly: that sounds like something worth talking about properly, come and find me after. If a pupil discloses exposure or distress, during or after the lesson, follow your school safeguarding policy and speak to your DSL, and reassure them first that they are not in trouble. Nothing said in this lesson is recorded by the platform, so your own note to the DSL is the record. Then move on without lingering, the calm brevity is the message.', null),

('ks4-15-manipulation-persuasion', 14, 'level of trust.',
 'Parasocial trust', 'And why it sells',
 'Keep this respectful, most of the class will have creators they genuinely like, and the goal is not to poison that. Let the first half land as recognition rather than warning: this is what it feels like, and the feeling is real.',
 'One clean distinction: enjoying a creator is fine, forgetting that their recommendations can be paid for is where it costs you. Ask: how would you even tell? Answers you want: the ad label, a discount code, a sudden product they never mentioned before. Then the honest kicker: the law requires the label exactly because this technique works so well without it.', null),

('ks4-16-consent-images-law', 8, 'even if both people agreed.',
 'What the law says', 'Why it is written that bluntly',
 'This is the factual core of the lesson, so deliver it word for word and let it breathe. Expect and welcome the obvious question: how can it be illegal to have a picture of yourself? Hold it for the next slide, which answers it.',
 'Answer the question honestly now: the law is written to make images of under 18s untouchable with no loopholes, and that blanket rule catches this situation too. Then say the reassurance clearly, because it is true and it matters: police guidance treats young people in these situations as children to protect first, not criminals to charge. The law exists to protect you, not to trap you. Do not let the room leave with fear and no options.', null),

-- OVERRIDE 1. The remainder opens "And a hard line for the serious end:",
-- which needs to start a slide rather than continue a sentence.
('ks4-16-consent-images-law', 12, 'a yes it produces is not consent.',
 'Everyone is not sending them', 'A threat is never your fault',
 'Kill the everyone does it myth flatly: it is a pressure technique, not a fact, and the evidence consistently shows most young people do not send images. Then widen what pupils count as pressure, because most expect threats and miss guilt, sulking and persistence, which are far more common.',
 'Say this one twice: the person threatening has done the wrong thing, not the person threatened. If a pupil discloses pressure or threats, in the room or afterwards, follow your safeguarding policy and pass it to your DSL the same day.',
 'For the serious end, a hard line: anyone who threatens you, including threatening to share something, has committed the wrong, not you. Threats are never your fault and always a reason to get an adult involved immediately.'),

-- OVERRIDE 2. The remainder opens "And something can actually be done:", which
-- is the third of the three truths. It moves into the heading of the second
-- slide so the promise survives the split rather than being swallowed by it.
('ks4-16-consent-images-law', 15, 'as people to protect.',
 'If an image is already out there', 'And something can be done',
 'Slow right down, this is the most important moment of the hour. Read it fully and evenly. Land the two truths in order: not your fault, and not in trouble for asking. Do not rush to the fix before the reassurance has landed.',
 'Spell out how Report Remove works: childline.org.uk, search Report Remove, prove your age, report the image confidentially, and the IWF works to remove it. Say plainly that asking for help is the strong move, not the embarrassing one. Then say: if this applies to you or a friend, come and talk to me after the lesson, or any adult you trust, today. If a pupil does, follow your safeguarding policy, do not promise secrecy, and involve your DSL the same day.',
 'Report Remove, run by Childline and the Internet Watch Foundation, lets anyone under 18 report an image of themselves confidentially and have it taken down from the open web, without needing a parent present and without going to the police themselves. Alongside it, a trusted adult, your school DSL or Childline on 0800 1111 can help you carry it, because nobody should carry this alone.'),

('ks4-18-radicalisation-misogyny', 9, 'contempt for women and girls.',
 'Misogyny is the most common on ramp', 'You are the target, not the accused',
 'Name it plainly and without apology, the naming is the respectful part. Keep your tone level and do not editorialise about any individual.',
 'Read the last two sentences word for word, do not improvise them and do not skip them. Expect the room to tense slightly, that is normal and it passes. Two handling notes. If a pupil defends a named influencer, do not debate the man, redirect to the machinery: fine, run him through the pipeline check when we get to it, who wants you angry, what happens if you keep watching. If a pupil voices views that genuinely concern you, stay calm, do not shame them in front of the room, note it and follow your school''s Prevent and safeguarding routes afterwards.', null),

('ks4-19-readiness-at-16', 10, 'runs on a false adult age.',
 'The workaround trap, revisited', 'Not early access, a different world',
 'This is the revisit of a rule they have heard since primary school, so name that: you have known skip the rule, lose the protection since you were small. Today it grows up.',
 'The key move is the last sentence, deliver it slowly: the cost of a workaround is not getting caught, it is being alone if something goes wrong inside it. Safeguarding note: if any pupil discloses that something has already gone wrong on an account like this, stay calm, thank them, and follow your school safeguarding policy. They are not in trouble.', null),

('ks4-19-readiness-at-16', 18, 'police it or report on it.',
 'Their call', 'Your plan',
 'This slide defuses the social fallout, so keep the register warm and completely unjudgemental in both directions. No superiority for the ones waiting, no pity or admiration for the ones with workarounds. If a pupil asks so are the ones with accounts being harmed, do not confirm or deny individuals, return to the frame: different families make different calls.',
 'Then the half they need: the only plan you control is yours. The phrase to leave hanging in the air: their call, your plan.', null),

('ks5-20-ai-mastery-data-rights', 7, 'same confident tone as a real one.',
 'Hallucination is a feature, not a bug', 'So checking is permanent',
 'This is the most important two minutes of the hour, so slow down. The key sentence to repeat: the model is not lying to you, it is predicting, and prediction produces truth and fiction through the identical process.',
 'Ask: if the tone of the output tells you nothing about its accuracy, what does that mean for how you read it? Fish for the answer that confidence must be ignored entirely and checking becomes the only signal. Someone may say newer models hallucinate less, and that is true. Less is not never, and your name is on the work either way.', null),

-- OVERRIDE 3. The remainder opens "But this trade is not one sided", and the
-- "But" is answering a sentence that is now on the previous slide.
('ks5-20-ai-mastery-data-rights', 15, 'a bigger decision than it feels.',
 'Free tools, and what they cost', 'The rights you already have',
 'Make the trade concrete before the rights land. Ask what they have pasted into a free tool this week, take two answers, and do not moralise about them.',
 'The last line is the one to land: rights you do not know about are rights you do not have. Name the UK GDPR subject access right in plain words and say that a request is an email, not a lawsuit.',
 'This trade is not one sided, because you have legal rights over your own data. In the UK you can ask any company what it holds on you, demand corrections, and in many cases require deletion. Rights you do not know about are rights you do not have.'),

('ks5-21-digital-identity-future-work', 9, 'what is worth making expands.',
 'What AI actually does to work', 'Your job description rewrites itself',
 'Give the two examples slowly and ask for a third from the room, ideally from a career somebody is actually considering. Task by task is the phrase to repeat.',
 'End on the last sentence and let it sit. Both stories are excuses not to prepare, which is the bridge into the skills that endure.', null),

('ks5-21-digital-identity-future-work', 13, 'stake their own reputation on.',
 'The skills that endure', 'And how they are built',
 'Take these three slowly and give one concrete example of each from a job in the room. Judgement, taste and trust building are abstract until somebody names a person who has them.',
 'The last two sentences are the point of the whole module: none of these are innate, all of them are built by reps, feedback and time. Say it and do not soften it.', null);

do $$
declare
  p record;
  cur jsonb;
  rebuilt jsonb;
  el jsonb;
  idx int;
  m int;
  body text;
  cut int;
  body_a text;
  body_b text;
begin
  -- Highest index first so an earlier insert never shifts a later target.
  for p in select * from _split_plan order by module_id, slide_no desc loop
    select slides into cur from schools.school_lessons where module_id = p.module_id;
    idx := p.slide_no - 1;

    if cur->idx is null then
      raise exception 'no slide % on %', p.slide_no, p.module_id;
    end if;
    if cur->idx->>'type' <> 'concept' then
      raise exception '% slide % is a %, not a concept', p.module_id, p.slide_no, cur->idx->>'type';
    end if;

    body := cur->idx->>'body';
    cut := position(p.split_after in body);
    if cut = 0 then
      raise exception 'split marker not found in % slide %: %', p.module_id, p.slide_no, p.split_after;
    end if;
    if position(p.split_after in substr(body, cut + 1)) > 0 then
      raise exception 'split marker is not unique in % slide %', p.module_id, p.slide_no;
    end if;

    body_a := btrim(left(body, cut + length(p.split_after) - 1));
    body_b := coalesce(p.body_b_override, btrim(substr(body, cut + length(p.split_after))));

    if body_b = '' then
      raise exception 'split of % slide % left an empty second half', p.module_id, p.slide_no;
    end if;

    m := greatest(1, coalesce((cur->idx->>'minutes')::int, 2));
    rebuilt := '[]'::jsonb;

    for i in 0 .. jsonb_array_length(cur) - 1 loop
      el := cur->i;
      if i = idx then
        -- The emoji stays on the first half. A second big glyph would read as a
        -- new topic rather than the same one continuing.
        rebuilt := rebuilt || jsonb_build_array(
          el || jsonb_build_object('heading', p.head_a, 'body', body_a,
                                   'script', p.script_a, 'minutes', greatest(1, m / 2)),
          (el - 'emoji') || jsonb_build_object('heading', p.head_b, 'body', body_b,
                                   'script', p.script_b, 'minutes', greatest(1, m - (m / 2)))
        );
      else
        rebuilt := rebuilt || jsonb_build_array(el);
      end if;
    end loop;

    update schools.school_lessons set slides = rebuilt where module_id = p.module_id;
  end loop;
end $$;

-- ── Guards ──────────────────────────────────────────────────────────
do $$
declare
  n int;
  bad text[] := '{}';
  r record;
begin
  -- 1. Every KS2 to KS5 prose slide is inside the MEASURED ceiling of 105.
  --    Whole population, so a fifteenth long slide arriving later fails too.
  for r in
    select l.module_id, i.ord as slide_no,
      (select coalesce(sum(case when v = '' then 0 else array_length(regexp_split_to_array(v, '\s+'), 1) end), 0)
       from unnest(array[btrim(coalesce(i.s->>'heading', '')), btrim(coalesce(i.s->>'body', '')),
                         btrim(coalesce(i.s->>'caption', ''))]) as v) as words
    from schools.school_lessons l,
         lateral (select ord, s from jsonb_array_elements(l.slides) with ordinality x(s, ord)) i(ord, s)
    where l.key_stage in ('KS2', 'KS3', 'KS4', 'KS5') and i.s->>'type' in ('concept', 'tryit')
  loop
    if r.words > 105 then
      bad := bad || format('%s slide %s has %s words', r.module_id, r.slide_no, r.words)::text;
    end if;
  end loop;
  if array_length(bad, 1) > 0 then
    raise exception 'still over the measured ceiling: %', array_to_string(bad, '; ');
  end if;

  -- 2. Nothing was lost. Every load bearing safeguarding phrase is still in the
  --    scheme, on one half or the other. Splitting is only safe if the words
  --    survive it.
  for r in
    select phrase from unnest(array[
      'you are not unusual and you are not in trouble',
      'not a guide to what real bodies look like',
      'a yes it produces is not consent',
      'has committed the wrong, not you',
      'It is not your fault, whatever anyone says',
      'You will not be in trouble for asking for help',
      'Report Remove, run by Childline and the Internet Watch Foundation',
      'Childline on 0800 1111',
      'illegal to make, hold or share a sexual image of anyone under 18',
      'the target, not the accused',
      'Rights you do not know about are rights you do not have',
      'reps, feedback, and time'
    ]) as phrase
  loop
    select count(*) into n from schools.school_lessons l, lateral jsonb_array_elements(l.slides) e(s)
    where e.s->>'body' like '%' || r.phrase || '%';
    if n = 0 then raise exception 'a phrase was lost in the split: %', r.phrase; end if;
  end loop;

  -- 3. Every DSL instruction survived. A split that drops "speak to your DSL"
  --    is worse than a long slide.
  select count(*) into n from schools.school_lessons l, lateral jsonb_array_elements(l.slides) e(s)
  where e.s->>'script' ilike '%DSL%';
  if n < 6 then raise exception 'only % DSL instructions left in the scheme', n; end if;

  -- 4. The nine modules are at their new slide counts.
  select count(*) into n from schools.school_lessons
  where (module_id = 'ks2-04-screen-routines'               and jsonb_array_length(slides) = 25)
     or (module_id = 'ks3-11-social-workarounds'            and jsonb_array_length(slides) = 25)
     or (module_id = 'ks3-14-bodies-image-pressure'         and jsonb_array_length(slides) = 24)
     or (module_id = 'ks4-15-manipulation-persuasion'       and jsonb_array_length(slides) = 25)
     or (module_id = 'ks4-16-consent-images-law'            and jsonb_array_length(slides) = 27)
     or (module_id = 'ks4-18-radicalisation-misogyny'       and jsonb_array_length(slides) = 25)
     or (module_id = 'ks4-19-readiness-at-16'               and jsonb_array_length(slides) = 28)
     or (module_id = 'ks5-20-ai-mastery-data-rights'        and jsonb_array_length(slides) = 25)
     or (module_id = 'ks5-21-digital-identity-future-work'  and jsonb_array_length(slides) = 24);
  if n <> 9 then raise exception 'expected nine modules at their new slide counts, got %', n; end if;

  -- 5. Total minutes per module are exactly what they were, which is what keeps
  --    the cycle map honest: the player derives cycles from minutes, so a split
  --    that quietly added time would move where every cycle starts.
  select count(*) into n from (
    select module_id, (select sum(coalesce((e.s->>'minutes')::int, 0)) from jsonb_array_elements(slides) e(s)) as mins
    from schools.school_lessons
  ) t where (module_id = 'ks2-04-screen-routines' and mins = 65)
        or (module_id = 'ks3-11-social-workarounds' and mins = 64)
        or (module_id = 'ks3-14-bodies-image-pressure' and mins = 64)
        or (module_id = 'ks4-15-manipulation-persuasion' and mins = 64)
        or (module_id = 'ks4-16-consent-images-law' and mins = 64)
        or (module_id = 'ks4-18-radicalisation-misogyny' and mins = 64)
        or (module_id = 'ks4-19-readiness-at-16' and mins = 64)
        or (module_id = 'ks5-20-ai-mastery-data-rights' and mins = 59)
        or (module_id = 'ks5-21-digital-identity-future-work' and mins = 59);
  if n <> 9 then raise exception 'a split changed a module total, only % of 9 unchanged', n; end if;
end $$;

commit;
