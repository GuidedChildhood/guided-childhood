-- 273_the_teacher_learns_the_subject.sql
-- Phase 2 of the perfect lesson standard: the four fields that were missing.
--
-- Plan:    plans/2026-09-08-the-perfect-lesson-standard.md, section 2
-- Worked:  content/lesson-standard/ks3-14-worked-example.md
--
-- THE GAP THIS CLOSES. The teacher pack was already strong: all 21 modules
-- carry 20 teacher notes keys plus hooks, strands, assessment, parent note
-- and DSL note. What it never carried was the thing Justin named, which is
-- the difference between a lesson plan and a teacher who understands the
-- subject:
--
--   subject_knowledge  what the teacher needs to understand BEFORE teaching,
--                      which Oak ships per lesson and we did not
--   hard_questions     what a pupil may ask, with an answer that does not
--                      wing it, each one {question, answer}
--   parent_questions   what a parent asks after the lesson goes home, with
--                      an answer a teacher can send, each one {question, answer}
--   evidence_base      where each claim comes from, each one
--                      {claim, source, status}, replacing a single
--                      evidence_anchor string that gave a challenged teacher
--                      nothing to stand on
--
-- ONE MODULE ONLY. This is the pilot, on ks3-14 bodies, image and pressure,
-- chosen because it is DSL flagged, carries the pornography topic and is where
-- a non specialist is most likely to be out of their depth. The pattern runs
-- across the other twenty after Justin has seen this one working in the
-- product rather than in a document.
--
-- EVIDENCE CARRIES ITS OWN STATUS, and that is the point of the field. Every
-- row says whether it is verified, or whether the number still has to pass the
-- citation verifier before it appears anywhere public. Three of the five rows
-- deliberately carry no figure at all: the mechanism is defensible without
-- one, and a claim with no verified source does not go on a slide. A field
-- that quietly mixed checked and unchecked claims would be worse than the
-- single string it replaces.
--
-- Non destructive: merged onto teacher_notes, nothing else touched.
-- Idempotent. Backed up first.

begin;

create table if not exists schools.school_lessons_backup_273 as
  select id, module_id, teacher_notes, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_273 enable row level security;

update schools.school_lessons
   set teacher_notes = teacher_notes || jsonb_build_object(

  'subject_knowledge', jsonb_build_array(
    jsonb_build_object('heading', 'Retouching is invisible by design',
      'body', 'The edit that matters is not the obvious filter, it is the small one: a jawline nudged, skin smoothed, a waist narrowed by two percent. Retouching that announces itself has failed commercially. This is why "you can tell when a photo is edited" is the misconception the lesson attacks. Pupils believe they can spot it, they cannot, and neither can you.'),
    jsonb_build_object('heading', 'Selection does more work than editing',
      'body', 'A creator shoots two hundred frames and posts one. Before any software touches it, the image is already the best of two hundred moments. Pupils find this more persuasive than editing, because it requires no villain.'),
    jsonb_build_object('heading', 'Why insecurity has a market',
      'body', 'Attention is sold. A feed is optimised for time on app, and content that makes a viewer feel slightly worse about themselves reliably increases time on app and purchase intent. Nobody has to be evil for this to happen: the system selects for it. Teach the mechanism, not a conspiracy, because the mechanism is defensible and the conspiracy is not.'),
    jsonb_build_object('heading', 'Social comparison, and which direction hurts',
      'body', 'Comparing upward, against someone perceived as better off, is the move that lowers mood. Feeds are almost entirely upward comparison by construction. The lesson framing, your ordinary day against someone else''s chosen highlight, is this idea in pupil language.'),
    jsonb_build_object('heading', 'What the evidence supports, and what it does not',
      'body', 'This is the claim a sceptical parent or a hostile expert will test. The honest position: the association between heavy social media use and body dissatisfaction is real and repeatedly observed, the effect sizes are modest, and the direction of causation is genuinely contested. Do not say social media causes eating disorders. Say that feeds are built in a way that makes unfair comparison constant, and that pupils can name and interrupt that. That claim survives scrutiny. The stronger one does not.'),
    jsonb_build_object('heading', 'Why pornography is named at all',
      'body', 'RSHE 2026 names the harms of pornography as statutory content. The teaching move is a brief, calm, non graphic acknowledgement that it exists and that it distorts what real bodies and real relationships look like, followed immediately by a route to a trusted adult. Brief is the whole skill: one sentence, no detail, move on.'),
    jsonb_build_object('heading', 'Disordered eating is not yours to diagnose',
      'body', 'You are watching for a disclosure, not making an assessment. Restriction talk, body checking, a pupil who cannot let the topic go, or a written answer that goes somewhere private are all DSL referrals, not conversations to have alone at the end of the lesson.')
  ),

  'hard_questions', jsonb_build_array(
    jsonb_build_object('question', 'What if I have already seen it?',
      'answer', 'Nothing is wrong with you and you are not in trouble. Lots of people see things they did not go looking for. If it is still in your head, that is worth telling someone, and I can help you do that. Then follow up privately, and tell the DSL that day.'),
    jsonb_build_object('question', 'My sister uses filters. Is she lying?',
      'answer', 'No. Using a filter is normal and it is not a lie. What the lesson is about is what happens when we forget that everyone is doing it, and start measuring ourselves against pictures that had help.'),
    jsonb_build_object('question', 'Do you use filters, Miss?',
      'answer', 'Answer honestly and briefly, then hand it back to the class. A teacher who deflects this loses the room. A teacher who says sometimes yes, and I still compare myself to people, wins it.'),
    jsonb_build_object('question', 'Is it true that social media causes eating disorders?',
      'answer', 'It is more complicated than that, and I am not going to tell you something that is not true. What we know is that feeds are built so you are always comparing yourself with someone else''s best moment, and that constant comparison makes a lot of people feel worse. Whether it causes an illness is something researchers still disagree about.'),
    jsonb_build_object('question', 'So should I just delete everything?',
      'answer', 'That is one option and it works for some people. It is not the only one, and it is not what this lesson is asking. The check is smaller: notice the feeling, ask who profits from it, and decide what you want to do about that one account. Never allow or deny, always the pathway.')
  ),

  'parent_questions', jsonb_build_array(
    jsonb_build_object('question', 'Why are you discussing pornography with my twelve year old?',
      'answer', 'Because the revised RSHE guidance makes the harms of pornography statutory content, and because most children encounter it before anyone chooses to talk to them about it. What happened in the lesson was one sentence, no detail: that it exists, that it does not show what real bodies or real relationships look like, and that a trusted adult is the right place to take it. We can send you exactly what was said.'),
    jsonb_build_object('question', 'Will this not make her more self conscious than she already is?',
      'answer', 'It is a fair worry and it is why the lesson is built the way it is. We do not show pupils idealised images and critique them. We teach the mechanism behind the images, and the finding pupils take away is that the bad feeling is manufactured and is not about them. That reframe tends to reduce self consciousness rather than raise it.'),
    jsonb_build_object('question', 'My son is fine. Is this not scaremongering?',
      'answer', 'Most children are fine, and we say so. There is no claim in this lesson that screens are damaging your son. What we teach is a check he can run when something online makes him feel worse, which is a skill whether or not he ever needs it.'),
    jsonb_build_object('question', 'What should I do at home?',
      'answer', 'The note that went home has it: scroll a feed together for two minutes, each pick one image, and run the check. Then ask the family question, which is whether there is an account that reliably makes you feel worse after you look at it.')
  ),

  'evidence_base', jsonb_build_array(
    jsonb_build_object('claim', 'Children encounter pornography younger than parents expect, often without looking for it',
      'source', 'Children''s Commissioner for England, research on children and pornography',
      'status', 'verify'),
    jsonb_build_object('claim', 'Heavy social media use is associated with body dissatisfaction. Effect sizes are modest and causation is contested',
      'source', 'The published literature on social media and body image, and the critiques of it',
      'status', 'verify'),
    jsonb_build_object('claim', 'Feeds are optimised for time on app',
      'source', 'Platform design and company disclosure',
      'status', 'mechanism'),
    jsonb_build_object('claim', 'Upward social comparison lowers mood',
      'source', 'Social comparison research',
      'status', 'mechanism'),
    jsonb_build_object('claim', 'Retouching is usually undetectable to a viewer',
      'source', 'Editing practice',
      'status', 'mechanism')
  )
)
 where module_id = 'ks3-14-bodies-image-pressure';

-- Guards. The shapes have to hold or the lesson page renders nonsense, and a
-- status outside the three is the one that matters: it is how an unverified
-- number would sneak onto a slide.
do $$
declare bad int;
begin
  select count(*) into bad from schools.school_lessons
   where module_id = 'ks3-14-bodies-image-pressure'
     and not (teacher_notes ?& array['subject_knowledge','hard_questions','parent_questions','evidence_base']);
  if bad > 0 then
    raise exception 'Migration 273: ks3-14 is missing one of the four new fields';
  end if;

  select count(*) into bad
    from schools.school_lessons l, jsonb_array_elements(l.teacher_notes->'subject_knowledge') s
   where l.module_id = 'ks3-14-bodies-image-pressure'
     and not (s ?& array['heading','body']);
  if bad > 0 then
    raise exception 'Migration 273: % subject knowledge item(s) missing heading or body', bad;
  end if;

  select count(*) into bad
    from schools.school_lessons l,
         lateral (select q from jsonb_array_elements(l.teacher_notes->'hard_questions') q
                  union all
                  select q from jsonb_array_elements(l.teacher_notes->'parent_questions') q) x(q)
   where l.module_id = 'ks3-14-bodies-image-pressure'
     and not (x.q ?& array['question','answer']);
  if bad > 0 then
    raise exception 'Migration 273: % question(s) missing question or answer', bad;
  end if;

  select count(*) into bad
    from schools.school_lessons l, jsonb_array_elements(l.teacher_notes->'evidence_base') e
   where l.module_id = 'ks3-14-bodies-image-pressure'
     and (not (e ?& array['claim','source','status'])
          or e->>'status' not in ('verified','verify','mechanism'));
  if bad > 0 then
    raise exception 'Migration 273: % evidence row(s) malformed or with a status outside verified, verify, mechanism', bad;
  end if;
end $$;

commit;
