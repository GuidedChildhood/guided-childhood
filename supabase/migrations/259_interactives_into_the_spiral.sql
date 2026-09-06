-- 259: an interactive in every module.
--
-- The master audit's sharpest content finding (Report 14, item 6): six
-- interactive components built, two slides in one module using them, and
-- twenty modules teaching persuasion, algorithms and spread with the
-- components sitting unused. This migration puts one matched interactive
-- into each of the twenty, inserted immediately before the module's tryit
-- slide so the shipped teaching order becomes: learn it, play it together,
-- then prove it on paper. That is the eyfs-01 pattern (migration 199) made
-- whole scheme.
--
-- Casting (plans/2026-09-06-p1-interactives-plan.md): verdict-sort for the
-- ten casework modules, and its posts are DERIVED from each module's own
-- worksheet_items, so the on screen game and the printed answer key can
-- never disagree; class-tally for the four whole class vote moments;
-- star-breath for the two calm pause lessons (ks1-02 where calm bodies is
-- the lesson, ks4-17 where the pause is the lifeline and a game would be
-- the wrong register); spread-race for the two spread mechanics lessons;
-- feed-loop for ks2-06 whose tool is literally the feed loop; signal-meter
-- for ks3-14, why a feed narrows toward comparison bodies.
--
-- Idempotent: every insert is guarded by "this module has no interactive
-- slide yet", which also keeps eyfs-01 untouched, and the timing bump is
-- guarded by its own marker text. Snapshot first, RLS on the backup, the
-- 230/231/233 pattern.

create table if not exists schools._backup_lesson_259 as
  select id, module_id, slides, teacher_notes
  from schools.school_lessons
  where module_id in (
    'ks1-02-kind-screens-calm-bodies', 'ks1-03-real-pretend-computer',
    'ks2-04-screen-routines', 'ks2-05-gaming-time-spend',
    'ks2-06-how-algorithms-work', 'ks2-07-privacy-reputation',
    'ks2-08-kind-safe-online', 'ks2-09-copyright-ownership',
    'ks3-10-mood-and-screens', 'ks3-11-social-workarounds',
    'ks3-12-misinfo-deepfakes', 'ks3-13-scams-fraud-money',
    'ks3-14-bodies-image-pressure', 'ks4-15-manipulation-persuasion',
    'ks4-16-consent-images-law', 'ks4-17-sextortion',
    'ks4-18-radicalisation-misogyny', 'ks4-19-readiness-at-16',
    'ks5-20-ai-mastery-data-rights', 'ks5-21-digital-identity-future-work'
  );

alter table schools._backup_lesson_259 enable row level security;

-- ── The ten verdict-sort modules ─────────────────────────────────────
-- The slide is built from the row's own teacher notes: verdicts from
-- worksheet.verdict_options, six posts from worksheet_items (the item is
-- the card, the teaching point is the why, the expected verdict's position
-- is the answer). Migration 257 verified every expected_verdict matches
-- its options exactly, and this file was dry run as a SELECT against
-- production before shipping.

update schools.school_lessons l
set slides = (
  select jsonb_agg(x.slide order by x.ord)
  from (
    select s as slide, idx * 2 as ord
    from jsonb_array_elements(l.slides) with ordinality t(s, idx)
    union all
    select
      jsonb_build_object(
        'type', 'interactive',
        'phase', 'practise',
        'component', 'verdict-sort',
        'minutes', 4,
        'caption', 'Sort the six cases together before the sheet.',
        'script', m.script,
        'config', jsonb_build_object(
          'label', (l.teacher_notes->'tool'->>'heading') || ' · tap the class verdict',
          'verdicts', l.teacher_notes->'worksheet'->'verdict_options',
          'doneTitle', 'All six sorted',
          'doneEmoji', '⭐',
          'doneBody', 'Same six cases on the sheet now. This time every verdict needs its reason written down.',
          'posts', (
            select jsonb_agg(jsonb_build_object(
              'handle', 'Case ' || (w->>'n'),
              'avatar', m.avatar,
              'text', w->>'item',
              'why', w->>'teaching_point',
              'answer', (
                select o.ord - 1
                from jsonb_array_elements_text(l.teacher_notes->'worksheet'->'verdict_options')
                  with ordinality o(v, ord)
                where o.v = w->>'expected_verdict'
              )
            ) order by (w->>'n')::int)
            from jsonb_array_elements(l.teacher_notes->'worksheet_items') w
          )
        )
      ),
      (
        select min(idx) * 2 - 1
        from jsonb_array_elements(l.slides) with ordinality t2(s2, idx)
        where s2->>'type' = 'tryit'
      )
  ) x
)
from (values
  ('ks1-03-real-pretend-computer', '🎨',
   'Now we play detective together before the sheet. Read each card aloud with plenty of drama, take hands up for real, pretend or computer made, then tap the class answer and read the reason that appears. If the class picks wrong, do not correct them flatly, read the reason and ask what they think now.'),
  ('ks2-05-gaming-time-spend', '🎮',
   'The spend spotters go to work together before the sheet. Read each card, hands up for the verdict, tap the class answer, read the reason. Draw out the middle verdict every time it fires: ask first is not a lesser answer, it is the spotter working.'),
  ('ks2-07-privacy-reputation', '🔒',
   'Run the share test on all six together before the paper. Read the card, take the vote, tap the class verdict, read the reason. Where the class splits, that is the gold: let two children argue it for thirty seconds before you tap.'),
  ('ks2-08-kind-safe-online', '💬',
   'Sort the six situations together, and keep the register warm: we are naming what is happening, never who it sounds like. Read each card, hands up, tap the class verdict, read the reason. Land the difference every time: one unkind moment and bullying are not the same word, and knowing which is which is what makes the three moves work.'),
  ('ks2-09-copyright-ownership', '🖌️',
   'Make it, credit it, ask first, now on six real cases together before the sheet. Read the card, take the vote, tap the class answer, read the reason. Celebrate the ask first verdicts out loud: asking is what professionals do every day.'),
  ('ks3-11-social-workarounds', '🧭',
   'Run Orbit''s rule on the six files together before the paper. Read the card, ask what protection is wired behind the rule it skips, take the vote, tap, read the reason. Street smart is knowing the price, so praise precise answers about WHICH protection is lost over fast ones.'),
  ('ks3-13-scams-fraud-money', '💷',
   'The three tells, live, before the paper casework. Read each card, ask which tell fires, take the vote, tap the class verdict, read the reason. Keep saying it: scams beat attention, not intelligence, and the verify first verdict is the professional one.'),
  ('ks4-15-manipulation-persuasion', '🎯',
   'Name the technique together before the sheet: four verdicts this time, so make the vote explicit for each. Read the card, take hands for urgency, outrage, flattery and FOMO, tap the class answer, read the reason. The win is speed of recognition: these six are on their phones tonight.'),
  ('ks4-16-consent-images-law', '⚖️',
   'Keep the room steady for this one. The cases stay on the screen and nobody''s story is invited or needed. Read each card evenly, take the vote without commentary, tap the class verdict, read the reason. Every time get help now fires, repeat the line that carries the lesson: asking for help means you are safe, not in trouble.'),
  ('ks5-20-ai-mastery-data-rights', '🤖',
   'Use it, check it, own it, applied to six real submissions before the paper. Read the card, take the vote, tap the class verdict, read the reason. Push for the professional standard in the discussion: do not submit is not anti AI, it is what owning your work means.')
) as m(module_id, avatar, script)
where l.module_id = m.module_id
  and not exists (
    select 1 from jsonb_array_elements(l.slides) e where e->>'type' = 'interactive'
  );

-- ── The ten hand cast modules ────────────────────────────────────────

update schools.school_lessons l
set slides = (
  select jsonb_agg(x.slide order by x.ord)
  from (
    select s as slide, idx * 2 as ord
    from jsonb_array_elements(l.slides) with ordinality t(s, idx)
    union all
    select m.slide::jsonb,
      (
        select min(idx) * 2 - 1
        from jsonb_array_elements(l.slides) with ordinality t2(s2, idx)
        where s2->>'type' = 'tryit'
      )
  ) x
)
from (values
  ('ks1-02-kind-screens-calm-bodies', '{
    "type": "interactive", "phase": "practise", "component": "star-breath",
    "minutes": 4, "config": {"seconds": 4},
    "caption": "Follow the star. In as it grows, out as it shrinks.",
    "script": "This is the lesson made real: calm bodies, practised together. Say: when a screen has to go off, our bodies sometimes feel cross, and this is what we do about it. Everyone sits tall, hands on tummies, and we follow the star for six slow breaths without talking. Then ask: who can feel their body going quieter? That feeling is take a break working. Practise it now so it is there at home when the telly goes off tonight."
  }'),
  ('ks2-04-screen-routines', '{
    "type": "interactive", "phase": "practise", "component": "class-tally",
    "minutes": 4,
    "config": {"question": "Think of your own after school screen habit, honestly. What is it right now?", "options": ["Routine ready", "Needs a lap", "Willpower trap"]},
    "caption": "The honest hands up. No wrong answers, only true ones.",
    "script": "The whole class check, and honesty is the only rule. Read the question, give ten seconds of silent thinking, then count hands for each answer and tap the bars up. Say it before anyone votes: willpower trap is not a confession, it is the smartest thing in the room to notice, because the whole lesson says routines beat willpower every time. When the bars land, ask one volunteer per bar to say why they voted that way."
  }'),
  ('ks2-06-how-algorithms-work', '{
    "type": "interactive", "phase": "practise", "component": "feed-loop",
    "minutes": 4, "config": {"laps": 4},
    "caption": "Watch the loop close. Each lap is faster than the last.",
    "script": "The lesson''s own tool, drawn live. Press start and narrate the laps as the dot speeds up: you watch, the feed learns, more of the same, you watch more. When the bubble closes, ask the class where the weakest link in the loop is. The answer is step one: the only part the feed cannot control is whether you notice and choose. Run it again and have the class call out each station as the dot passes it."
  }'),
  ('ks3-10-mood-and-screens', '{
    "type": "interactive", "phase": "practise", "component": "class-tally",
    "minutes": 4,
    "config": {"question": "The mood audit, live. Think of the last thing you scrolled or watched last night. Did it leave you better, worse, or nothing?", "options": ["Better", "Worse", "Nothing"]},
    "caption": "One honest data point each. The class chart is the evidence.",
    "script": "The mood audit run as a whole class experiment. Ten seconds of silent recall first, no naming of apps or people, then count hands and tap the bars. Read the finished chart back like a scientist: this is our class data, and it will not match anyone''s guess exactly. The nothing bar deserves its own moment, because nothing is the most common answer in real studies and nobody expects it. Close with: the audit is not for judging, it is for noticing, and you can run it on yourself any night in five seconds."
  }'),
  ('ks3-12-misinfo-deepfakes', '{
    "type": "interactive", "phase": "practise", "component": "spread-race",
    "minutes": 4, "config": {},
    "caption": "Same day, two posts. Watch what reactions are worth.",
    "script": "The diagram of how a fake travels, now run as a race. Run it once and let the outrage post win by miles. Ask why: not because it is true, because reactions are the fuel. Then press calm the reactions and run it again, and watch the race tighten. Land the line the whole lesson has been building to: your pause is not nothing, it is the brake, and you are no longer most people."
  }'),
  ('ks3-14-bodies-image-pressure', '{
    "type": "interactive", "phase": "practise", "component": "signal-meter",
    "minutes": 4,
    "config": {"caption": "Every tap on a body post tells the feed more like this. That is why a feed narrows, and it is maths, not truth."},
    "caption": "Tap what you would do. Watch which taps shout loudest.",
    "script": "Why does a feed fill with one kind of body? Not because that is what bodies look like, because of this meter. Invite taps: a like, a comment, watching to the end, watching again, and watch the signal bar climb fastest for the watches. Say the quiet part: you do not even have to like a post to teach the feed you want more of it, lingering is a signal too. Connect it straight back to the image check: the feed is not a mirror, it is a maths lesson about your taps."
  }'),
  ('ks4-17-sextortion', '{
    "type": "interactive", "phase": "practise", "component": "star-breath",
    "minutes": 4, "config": {"seconds": 4},
    "caption": "The pause. Practised now so it is there if it is ever needed.",
    "script": "Keep this slow and completely unremarkable. Say: panic is the lever this crime pulls, every single time, because a person in panic pays and hides. So the first lifeline is not a phone number, it is a pause. We practise it now, together, for four breaths, so the body knows the way back to steady before it is ever needed. Then repeat the three lifelines quietly with the class: do not pay, do not keep it secret, report it. No drama, no scenario, just the skill."
  }'),
  ('ks4-18-radicalisation-misogyny', '{
    "type": "interactive", "phase": "practise", "component": "spread-race",
    "minutes": 4, "config": {},
    "caption": "Outrage against honesty, raced. The pipeline runs on the winner.",
    "script": "The pipeline check needs one more piece of evidence: why this content finds people at all. Race the two posts once and let the outrage post win by miles, then ask what that means for a feed that learns from reactions: the angriest voice gets the megaphone, not the truest one. Run the calm rerun and watch the gap close. Connect it to the pipeline: nobody chooses to walk down it, the feed escorts them, one engineered reaction at a time, and stepping back is the brake."
  }'),
  ('ks4-19-readiness-at-16', '{
    "type": "interactive", "phase": "practise", "component": "class-tally",
    "minutes": 4,
    "config": {"question": "The arrival plan has three pieces. Hands up: which one is already written in your head?", "options": ["My defaults", "My first week audit", "My exit rule"]},
    "caption": "The class readiness picture, in three bars.",
    "script": "A quick census before the written plan. Read the three pieces back so everyone knows what they are voting for: defaults are the settings you will change on day one, the first week audit is the check you will run after seven days, the exit rule is the line that tells you a platform no longer deserves you. Count hands, tap the bars, then read the room: the shortest bar is what the class writes first on the sheet, because the piece nobody has thought about is the piece that matters."
  }'),
  ('ks5-21-digital-identity-future-work', '{
    "type": "interactive", "phase": "practise", "component": "class-tally",
    "minutes": 4,
    "config": {"question": "Your digital identity, ten years out. Does what you post this year become more valuable, less valuable, or change shape entirely?", "options": ["More valuable", "Less valuable", "Changes shape"]},
    "caption": "Every answer is defensible. The reasons are the lesson.",
    "script": "The endurance test as a class vote, and this one has no answer key. Take the vote, tap the bars, then make the case for each bar out loud or hand each bar to a volunteer: more valuable, because a long honest record is proof no CV can fake; less valuable, because platforms die and feeds bury; changes shape, because the you of 28 will be read by tools that do not exist yet. The point lands in the disagreement: whatever you believe, you are building the record either way."
  }')
) as m(module_id, slide)
where l.module_id = m.module_id
  and not exists (
    select 1 from jsonb_array_elements(l.slides) e where e->>'type' = 'interactive'
  );

-- ── Timing strings keep telling the truth ────────────────────────────
-- Each updated module gains 4 minutes and names the interactive, so the
-- run sheet's total matches the deck. Guarded by the marker text so a
-- rerun cannot double count, and by the format check so an unusual timing
-- string is left alone rather than mangled.

update schools.school_lessons
set teacher_notes = jsonb_set(
  teacher_notes, '{timing}',
  to_jsonb(
    ((substring(teacher_notes->>'timing' from '^[0-9]+'))::int + 4)::text
    || ' minutes: '
    || rtrim(split_part(teacher_notes->>'timing', ' minutes: ', 2), '.')
    || ', class interactive 4'
  )
)
where module_id in (
    'ks1-02-kind-screens-calm-bodies', 'ks1-03-real-pretend-computer',
    'ks2-04-screen-routines', 'ks2-05-gaming-time-spend',
    'ks2-06-how-algorithms-work', 'ks2-07-privacy-reputation',
    'ks2-08-kind-safe-online', 'ks2-09-copyright-ownership',
    'ks3-10-mood-and-screens', 'ks3-11-social-workarounds',
    'ks3-12-misinfo-deepfakes', 'ks3-13-scams-fraud-money',
    'ks3-14-bodies-image-pressure', 'ks4-15-manipulation-persuasion',
    'ks4-16-consent-images-law', 'ks4-17-sextortion',
    'ks4-18-radicalisation-misogyny', 'ks4-19-readiness-at-16',
    'ks5-20-ai-mastery-data-rights', 'ks5-21-digital-identity-future-work'
  )
  and teacher_notes->>'timing' ~ '^[0-9]+ minutes: '
  and teacher_notes->>'timing' not like '%class interactive%'
  and exists (
    select 1 from jsonb_array_elements(slides) e where e->>'type' = 'interactive'
  );
