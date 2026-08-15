-- Guided Childhood — Migration 199
-- Lesson 1 rebuilt to the Lesson Standard (plans/lesson-standard-plan.md).
--
-- WHY. Justin, 15 August: "the level of lesson is just our own slides, these
-- need to be the level of Kapow and other competitors." Going through this
-- lesson field by field showed the writing was already there: objective,
-- scripts on all 12 slides, three keywords, three misconceptions,
-- differentiation both ways, a six item worksheet with an expected verdict
-- and a teaching point on every item. What was missing was that the lesson
-- was ONLY slides. We built six interactive components and not one lesson
-- called a single one, across all 21.
--
-- So this adds three slides and changes nothing else. The scripts are
-- untouched: they are good, they are in Justin's voice, and they are pitched
-- correctly for Reception. Rewriting them would fix nothing that was wrong.
--
-- WHAT CHANGES. 12 slides to 15, 30 minutes to 32.
--   * a star-breath settle at the very front, in the new `connect` phase
--   * a verdict-sort in Practise, whose six cards are the SAME six items as
--     the paper worksheet, so the board and the sheet teach one thing twice
--     rather than two things once
--   * a recap in Reflect, the three things we learned, which is Rosenshine's
--     tenth principle finally getting a slide
--
-- The title slide moves from `starter` to `connect`. Every other slide keeps
-- the phase it already had, which is exactly why `connect` was added at the
-- front of the enum rather than by renumbering.
--
-- Supabase editor rules: idempotent, flat statements. Safe to re-run: it
-- rebuilds the three slides from scratch each time rather than appending.

-- Strip any previously inserted standard slides so a re-run cannot duplicate
-- them. Identified by their component keys and the recap heading, none of
-- which the original 12 slides used.
update schools.school_lessons
set slides = (
  select coalesce(jsonb_agg(s order by ord), '[]'::jsonb)
  from jsonb_array_elements(slides) with ordinality t(s, ord)
  where not (
    (s->>'type' = 'interactive' and s->>'component' in ('star-breath', 'verdict-sort'))
    or (s->>'type' = 'recap' and s->>'heading' = 'Three things we know now')
  )
)
where module_id = 'eyfs-01-screens-kindness';

-- The title slide is the Connect moment, not the starter.
update schools.school_lessons
set slides = jsonb_set(slides, '{0,phase}', '"connect"')
where module_id = 'eyfs-01-screens-kindness'
  and slides->0->>'type' = 'title';

-- 1. CONNECT: the settle, before any content.
-- Jigsaw's Calm me, run by the star so it is the same length and the same
-- shape every single week. A Reception class cannot be asked whether
-- anything on a screen frightened them until it has settled, so this is
-- part of the teaching rather than a warm up to it.
update schools.school_lessons
set slides = jsonb_build_array(jsonb_build_object(
  'type', 'interactive',
  'component', 'star-breath',
  'phase', 'connect',
  'minutes', 2,
  'config', jsonb_build_object('seconds', 4),
  'caption', 'Follow the star. In as it grows, out as it shrinks.',
  'script', 'Before we meet anyone, we settle. Sit criss cross on the carpet with hands on tummies. Say: this is our star breath, and we do it at the start of every screen lesson. Watch the star grow, and breathe in with it. Watch it shrink, and breathe out. Do four together without talking. Then say: lovely. Our bodies are calm and our brains are ready. If a child cannot sit still, let them do it standing with arms rising and falling, that counts too.'
)) || slides
where module_id = 'eyfs-01-screens-kindness';

-- 2. PRACTISE: the sorting game, inserted before the paper worksheet slide.
-- Six cards, the same six items as the printed sheet. The child meets each
-- one on the board with the whole class first, then again on paper. Note
-- item 4 and item 5 both answer "Ask a grown up": one because a computer
-- could have made it, one because it made a tummy feel wobbly. Both are
-- reasons to ask, and a four year old needs to meet both.
-- Position is a numeric, so a new slide slots in at "half a step before"
-- the one it must precede without renumbering anything around it.
update schools.school_lessons
set slides = (
  select jsonb_agg(s order by pos)
  from (
    select s, ord::numeric as pos
    from jsonb_array_elements(slides) with ordinality t(s, ord)
    union all
    select jsonb_build_object(
      'type', 'interactive',
      'component', 'verdict-sort',
      'phase', 'practise',
      'minutes', 4,
      'caption', 'Real, made up, or ask a grown up?',
      'config', jsonb_build_object(
        'label', 'Real or made up? · tap your answer',
        'doneEmoji', '⭐',
        'doneTitle', 'You sorted them all!',
        'doneBody', 'Real, made up, and the ones where the answer is to ask. Asking is the clever one.',
        'verdicts', jsonb_build_array('Real', 'Made up', 'Ask a grown up'),
        'posts', jsonb_build_array(
          jsonb_build_object('avatar', '📷', 'handle', 'A photo', 'text', 'A photo of your class on a school trip, with your teacher in it.', 'answer', 0, 'why', 'We were there, so it really happened.'),
          jsonb_build_object('avatar', '🐉', 'handle', 'A cartoon', 'text', 'A cartoon dragon breathing rainbow fire over a castle.', 'answer', 1, 'why', 'Cartoons are made up on purpose, and that is lovely.'),
          jsonb_build_object('avatar', '🐘', 'handle', 'A picture', 'text', 'An elephant wearing pyjamas and jumping on a bed.', 'answer', 1, 'why', 'A computer can make a picture of something that never happened.'),
          jsonb_build_object('avatar', '🎹', 'handle', 'A video', 'text', 'A cat playing the piano and singing a song with your name in it.', 'answer', 2, 'why', 'Our eyes cannot tell. When we are not sure, we ask.'),
          jsonb_build_object('avatar', '🕷️', 'handle', 'A picture', 'text', 'A great big spider that looks very real and makes your tummy feel wobbly.', 'answer', 2, 'why', 'A wobbly tummy is exactly the moment to find a grown up.'),
          jsonb_build_object('avatar', '⛄', 'handle', 'DiGi Junior', 'text', 'I saw a snowman on a sunny hot beach. It must be real, because I saw it on the screen!', 'answer', 1, 'why', 'Seeing it on a screen does not make it real.')
        )
      ),
      'script', 'Now we play it together before we do it on paper. Tap the first card and read it out with plenty of drama. Take hands up for each of the three answers, then tap the one the class chose. Read the reason that appears. Do all six. Two of them have the answer ask a grown up, and they are the important pair: the singing cat, because a computer could have made it, and the big spider, because it made a tummy feel wobbly. Say out loud: both of those are asking, and asking is clever. If the class picks wrong, do not correct them flatly, read the reason and ask them what they think now.'
    ),
    (
      select min(ord) - 0.5
      from jsonb_array_elements(slides) with ordinality t2(s2, ord)
      where s2->>'type' = 'tryit' and s2->>'phase' = 'practise'
    )
  ) z
)
where module_id = 'eyfs-01-screens-kindness';

-- 3. REFLECT: the recap, before the chant.
-- Rosenshine's tenth principle is weekly and monthly review, and until now
-- no slide in any lesson has carried it.
update schools.school_lessons
set slides = (
  select jsonb_agg(s order by pos)
  from (
    select s, ord::numeric as pos
    from jsonb_array_elements(slides) with ordinality t(s, ord)
    union all
    select jsonb_build_object(
      'type', 'recap',
      'phase', 'close',
      'minutes', 1,
      'heading', 'Three things we know now',
      'points', jsonb_build_array(
        'Some things on a screen are real, and some are made up.',
        'A computer can make a picture of something that never happened.',
        'When we are not sure, we stop, we look, and we ask a grown up.'
      ),
      'script', 'Hold up one finger, then two, then three, and have the class hold them up with you. Read each line and let them say the last word of it with you. Then say: next time we meet, I am going to ask you these three again, so keep them safe in your brain. Say it warmly, it is a promise not a threat, and it is why they will remember.'
    ),
    (
      select min(ord) - 0.5
      from jsonb_array_elements(slides) with ordinality t2(s2, ord)
      where s2->>'type' = 'quote' and s2->>'phase' = 'close'
    )
  ) z
)
where module_id = 'eyfs-01-screens-kindness';

-- The timing line the teacher pack prints has to match what is now there.
update schools.school_lessons
set teacher_notes = jsonb_set(
  teacher_notes,
  '{timing}',
  '"32 minutes: connect 2, starter 8, teaching 10, sorting game 4, circle time practice 6, prove 4, close 3"'
)
where module_id = 'eyfs-01-screens-kindness';
