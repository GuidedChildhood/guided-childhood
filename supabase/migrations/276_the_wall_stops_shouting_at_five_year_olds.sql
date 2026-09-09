-- THE YOUNGEST CHILDREN'S SLIDES.
--
-- The council's appearance check (scripts/council.mjs) counts the words a
-- child has to decode off the wall: heading, body, text, caption. Not the
-- question and not the prompt, because those are the teacher's, read aloud.
-- Against an age ceiling of twelve words for EYFS and KS1 the scheme scored
-- 7.81 out of 10, and six slides for four to seven year olds carried 87, 72,
-- 72, 55, 47 and 43 words of prose.
--
-- Reading them showed the same thing every time: the body was the script
-- printed on the wall. Every idea in those paragraphs was already in the
-- teacher's word for word script underneath, so the child was being asked to
-- read what the teacher was about to say. That is Mayer's redundancy effect,
-- the second largest effect in the coherence work we cite in
-- research/2026-09-09-lesson-quality-council.md, and it makes learning worse,
-- not better. A Reception child cannot read seventy two words off a wall at
-- all, so the paragraph was decoration that pushed the heading small.
--
-- So this migration does not delete teaching. For each of the six it cuts the
-- body to what the child needs in front of them while they think, and moves
-- anything that was ONLY in the body into the script, where a human says it.
-- Three scripts get longer here. That is the point.
--
-- It also fixes an eyebrow that has been wrong on every practice slide in the
-- scheme. The player prints "Try it tonight" above a tryit slide because in
-- the parents app a tryit IS homework. In school it never is: all 21 of them
-- sit in the practise phase, mid lesson, worksheets already out. The wall was
-- telling a class to do tonight the thing they were doing now. The player
-- gains an optional label (the same shape quote and scenario slides already
-- have) and every school practice slide sets it.

begin;

-- ── The six ─────────────────────────────────────────────────────────
-- Patches merge over the existing slide object, so every other field on the
-- slide (type, phase, emoji, minutes) survives untouched.
do $$
declare
  patch record;
  idx int;
begin
  for patch in
    select * from (values
      -- EYFS 01, slide 6, concept. Was 72 words. The photo and the dragon are
      -- the two examples the script already gives; the elephant in pyjamas,
      -- "made up is not naughty" and "we have grown ups to help us" were all
      -- in the script already too. Only "a photo of our class is real, it
      -- truly happened" is new to the script, which is why it is added.
      ('eyfs-01-screens-kindness', 6, jsonb_build_object(
        'heading', 'Real and made up',
        'body', 'A photo is real. Dragons are made up.',
        'script', 'Read the slide slowly. Point at each half. Say: a photo of our class is real, it truly happened. A dragon in a cartoon is made up, somebody drew it. Then pause and say: imagine a picture of an elephant wearing pyjamas and jumping on a bed. Did that really happen? No! But a computer could make a picture of it that looks ever so real. Let the giggles happen, the giggle is the learning. Then land the warm bit: made up things are not bad. Cartoons are made up and we love them. We just like to know what is real and what is made up, and we have grown ups to help us.'
      )),

      -- EYFS 01, slide 10, practise. Was 43 words of worksheet mechanics that
      -- the script already carries in full. The wall now shows the three
      -- answers the child is choosing between, in the module's own words, and
      -- the star pause cue. "Asking is always a good answer" moves to the
      -- script so it is said out loud rather than read.
      ('eyfs-01-screens-kindness', 10, jsonb_build_object(
        'heading', 'Circle time practice',
        'body', 'Star pause. Then circle: real, made up, or ask.',
        'script', 'Hand out the circle sheets and chunky crayons, or run it fully on the carpet with hands up if that suits your class better. Read each of the six items from the teacher notes slowly, twice. Before each answer, do the star pause together: stop, look, ask. Children circle the smiley face under Real, Made up, or Ask a grown up. Finish by saying it together: asking is always a good answer. Support: sit alongside children who need help and let them point instead of circle. Stretch: ask early finishers to tell you one real thing and one made up thing they have seen on a screen.'
      )),

      -- KS1 02, slide 5, concept. Was 72 words. The three body words are the
      -- ones the class has just acted out, and the reassurance is the sentence
      -- the script lands. The opening warmth ("screens can be lovely, a funny
      -- video makes us giggle") was ONLY in the body, and without it the slide
      -- reads as screens are bad, which is the opposite of our position. It
      -- moves to the front of the script.
      ('ks1-02-kind-screens-calm-bodies', 5, jsonb_build_object(
        'heading', 'Screens change how bodies feel',
        'body', 'Wiggly. Tired. Grumpy. None are naughty.',
        'script', 'Start warm, because the slide is only the second half of the idea. Say: screens can be lovely. A funny video makes us giggle and feel happy. Then teach the three words slowly and act them out. Sometimes after lots of tablet time my body feels wiggly, show me your best wiggly body. Sometimes it feels tired, show me tired. Sometimes when the screen goes off, whoosh, a grumpy feeling arrives, show me grumpy faces. Then the key sentence, say it warmly: none of those feelings are naughty. Your body is just talking to you. Our job is to listen to it.'
      )),

      -- KS1 02, slide 10, practise. Was 55 words. The wall now holds the three
      -- choices while the child decides, which is the only thing they need to
      -- see. The thinking cue ("how does that child's body feel") was in the
      -- body and not the script, so it moves.
      ('ks1-02-kind-screens-calm-bodies', 10, jsonb_build_object(
        'heading', 'Feelings detective time',
        'body', 'Keep enjoying. Take a break. Tell a grown up.',
        'script', 'Hand out the worksheets. Read each story aloud to the class one at a time, that is how this age group works best. After each one ask the thinking question: how does that child''s body feel right now? Give thinking time before they circle one of the three answers on the slide. Support table works with you and just circles. Everyone finishes by drawing their telling grown up in the box and writing or copying their name. Early finishers add a speech bubble showing what they would say to their grown up. Circulate and collect one lovely answer to share.'
      )),

      -- KS1 03, slide 6, concept. Was 87 words, the worst slide in the scheme
      -- for its age. The three category words plus the hook now create the
      -- question instead of answering it. The definitions and the load bearing
      -- point of the whole lesson, that a computer made picture can look
      -- exactly like a real photo, were only in the body. They move into the
      -- script, which is why it grows the most of the six.
      ('ks1-03-real-pretend-computer', 6, jsonb_build_object(
        'heading', 'Three kinds of pictures',
        'body', 'Real. Pretend. Computer made. One can trick you.',
        'script', 'Teach the three words with the three actions from the keywords: thumbs up for real, jazz hands for pretend, robot arms for computer made. Real means it truly happened, like a photo of our class trip. Pretend is made up for fun, like a cartoon mouse driving a racing car. Computer made means a computer invented it, and here is the tricky bit: it can look exactly like a real photo. A computer can make a picture of a dog on the moon, and no dog has ever been to the moon. Then keep it light. Ask: is a computer made picture naughty? No! It can be brilliant fun. I could ask a computer for a picture of our whole class riding dinosaurs and we would all laugh. The only trick is knowing it might not be real. Fun is fine, being tricked is not.'
      )),

      -- KS1 03, slide 11, practise. Was 47 words. The detective question and
      -- the three answers stay on the wall because that is what the child is
      -- holding in their head. The permission not to be certain moves to the
      -- script, where a teacher can give it warmly.
      ('ks1-03-real-pretend-computer', 11, jsonb_build_object(
        'heading', 'Detective practice',
        'body', 'Real, pretend, or computer made? Not sure? Question mark.',
        'script', 'Hand out the worksheets. Read each of the six items aloud, one at a time, giving thinking time before pupils circle. Bookmark strips with the detective question go on every table. Nobody has to be certain: if a child is not sure they put a question mark, and we investigate those together at the end. Support table works with you and does items one to three together out loud. Early finishers get the stretch: draw your own computer made picture idea, the sillier the better. Circulate and collect one brilliant clue to share with the class.'
      ))
    ) as v(module_id, slide_no, patch)
  loop
    idx := patch.slide_no - 1;  -- jsonb arrays are zero based, slide numbers are not

    if not exists (
      select 1 from schools.school_lessons
      where module_id = patch.module_id and jsonb_array_length(slides) > idx
    ) then
      raise exception 'no slide % on %', patch.slide_no, patch.module_id;
    end if;

    update schools.school_lessons
    set slides = jsonb_set(slides, array[idx::text], slides->idx || patch.patch)
    where module_id = patch.module_id;
  end loop;
end $$;

-- ── The eyebrow on every practice slide ─────────────────────────────
-- In the parents app a tryit slide really is "try it tonight". In school it is
-- always now, so the eyebrow is set per slide rather than by changing a shared
-- default the parents app still needs.
update schools.school_lessons l
set slides = (
  select jsonb_agg(
    case when s->>'type' = 'tryit' then s || jsonb_build_object('label', 'Your turn') else s end
    order by ord
  )
  from jsonb_array_elements(l.slides) with ordinality t(s, ord)
)
where exists (
  select 1 from jsonb_array_elements(l.slides) e(s)
  where e.s->>'type' = 'tryit' and coalesce(e.s->>'label', '') <> 'Your turn'
);

-- ── Guards ──────────────────────────────────────────────────────────
do $$
declare
  bad text[] := '{}';
  r record;
  n int;
begin
  -- 1. Every EYFS and KS1 concept and tryit slide is now inside the twelve
  --    word ceiling. Stated as the whole population, not the six, so a
  --    seventh dense slide arriving later fails this migration's own test.
  for r in
    select l.module_id, i.ord as slide_no, i.s->>'type' as type,
      (select coalesce(sum(case when v = '' then 0 else array_length(regexp_split_to_array(v, '\s+'), 1) end), 0)
       from unnest(array[
         btrim(coalesce(i.s->>'heading', '')), btrim(coalesce(i.s->>'body', '')),
         btrim(coalesce(i.s->>'text', '')),    btrim(coalesce(i.s->>'caption', ''))
       ]) as v) as words
    from schools.school_lessons l,
         lateral (select ord, s from jsonb_array_elements(l.slides) with ordinality x(s, ord)) i(ord, s)
    where l.key_stage in ('EYFS', 'KS1') and i.s->>'type' in ('concept', 'tryit')
  loop
    if r.words > 12 then
      bad := bad || format('%s slide %s (%s) has %s words', r.module_id, r.slide_no, r.type, r.words)::text;
    end if;
  end loop;
  if array_length(bad, 1) > 0 then
    raise exception 'slides still over the age ceiling: %', array_to_string(bad, '; ');
  end if;

  -- 2. Nothing was lost. Each of the three ideas that lived ONLY in a body is
  --    now findable in the script that replaced it. This is the guard that
  --    matters: cutting words is easy, cutting words without dropping teaching
  --    is the actual job.
  if not exists (
    select 1 from schools.school_lessons l, lateral jsonb_array_elements(l.slides) e(s)
    where l.module_id = 'ks1-03-real-pretend-computer'
      and e.s->>'script' like '%look exactly like a real photo%'
  ) then
    raise exception 'the load bearing point of ks1-03 is not in any script';
  end if;
  if not exists (
    select 1 from schools.school_lessons l, lateral jsonb_array_elements(l.slides) e(s)
    where l.module_id = 'ks1-02-kind-screens-calm-bodies'
      and e.s->>'script' like '%screens can be lovely%'
  ) then
    raise exception 'the warmth that stops ks1-02 reading as screens are bad is gone';
  end if;
  if not exists (
    select 1 from schools.school_lessons l, lateral jsonb_array_elements(l.slides) e(s)
    where l.module_id = 'eyfs-01-screens-kindness'
      and e.s->>'script' like '%asking is always a good answer%'
  ) then
    raise exception 'the eyfs safety line is gone';
  end if;

  -- 3. Structure untouched: the six modules keep their slide counts and every
  --    patched slide keeps the type it had.
  select count(*) into n from schools.school_lessons
  where (module_id = 'eyfs-01-screens-kindness'         and jsonb_array_length(slides) = 16)
     or (module_id = 'ks1-02-kind-screens-calm-bodies'  and jsonb_array_length(slides) = 15)
     or (module_id = 'ks1-03-real-pretend-computer'     and jsonb_array_length(slides) = 16);
  if n <> 3 then raise exception 'a patched module gained or lost slides'; end if;

  for r in
    select module_id, slide_no, expected from (values
      ('eyfs-01-screens-kindness', 6, 'concept'), ('eyfs-01-screens-kindness', 10, 'tryit'),
      ('ks1-02-kind-screens-calm-bodies', 5, 'concept'), ('ks1-02-kind-screens-calm-bodies', 10, 'tryit'),
      ('ks1-03-real-pretend-computer', 6, 'concept'), ('ks1-03-real-pretend-computer', 11, 'tryit')
    ) as v(module_id, slide_no, expected)
  loop
    if not exists (
      select 1 from schools.school_lessons
      where module_id = r.module_id and slides->(r.slide_no - 1)->>'type' = r.expected
    ) then
      raise exception '% slide % is no longer a %', r.module_id, r.slide_no, r.expected;
    end if;
  end loop;

  -- 4. Every practice slide in the scheme now says "Your turn", and none of
  --    them tells a class in the middle of a lesson to do it tonight.
  select count(*) into n
  from schools.school_lessons l, lateral jsonb_array_elements(l.slides) e(s)
  where e.s->>'type' = 'tryit' and e.s->>'label' is distinct from 'Your turn';
  if n > 0 then raise exception '% practice slides still carry the wrong eyebrow', n; end if;
end $$;

commit;
