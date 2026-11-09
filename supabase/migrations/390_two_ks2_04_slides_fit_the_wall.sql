-- 390: two ks2-04 slides fit the wall again.
--
-- 389 (PR 1452, applied 9 November in PR 1462) rewrote the KS2 "Screen
-- routines" cool down lap from warn, finish, swap to agree, finish, swap. Two
-- slides grew past what a projector and a teacher laptop show at once, and
-- check-wall-fit turned main red:
--
--   slide 17, the squad chat scenario: the teacher's script, which the wall
--     shows in teacher mode, now clipped at 1920x1080. Tightened, same three
--     beats (willpower has lost, the routine decided it hours ago, "on at 5,
--     save me a spot"), 496 to 426 characters.
--   slide 9, the first quiz: the question clipped at 1366x768. "The level is
--     nearly done ... say to do?" becomes "It is nearly done ... say?".
--
-- Nothing a child is taught changes. content/modules/ks2-04-screen-routines.json
-- carries the same two edits, so the deck and its file still match.
--
-- GUARDED PER VALUE. Each edit runs only when the live string is exactly the
-- one 389 wrote. Already the new string: nothing to do. Anything else: a hand
-- edit, and the migration aborts rather than overwrite it. Idempotent.

begin;

do $$
declare
  cur text;
begin

  select slides->16->>'script' into cur from schools.school_lessons where module_id = 'ks2-04-screen-routines';
  if not found then
    raise exception '390: ks2-04-screen-routines is missing from schools.school_lessons';
  end if;
  if cur is distinct from $gc390$Read it like a real message, pace and all, then ask the prompt. The point to land: at two minutes to kickoff, willpower has already lost. A designed routine decided this hours ago: homework first with the phone in another room, the finishing line agreed, and the squad session as the SWAP, the reward at the finish line. Ask the class what that pupil could message back. Best answer: on at 5, save me a spot. Not a no. A when.$gc390$ then
    if cur is distinct from $gc390$Read it like a real message, pace and all, then ask the prompt. The point to land: in this moment, willpower has already lost, the pull is too strong at two minutes to kickoff. But a designed routine decided this hours ago: homework first with the phone in another room, the finishing line agreed, and the squad session is the SWAP, the reward waiting at the finish line. Ask the class to say what that pupil could message back. Best answer sounds like: on at 5, save me a spot. Not a no. A when.$gc390$ then
      raise exception '390: ks2-04 slide 17 script has been edited since 389, refusing to overwrite it';
    end if;
    update schools.school_lessons
       set slides = jsonb_set(slides, '{16,script}', to_jsonb($gc390$Read it like a real message, pace and all, then ask the prompt. The point to land: at two minutes to kickoff, willpower has already lost. A designed routine decided this hours ago: homework first with the phone in another room, the finishing line agreed, and the squad session as the SWAP, the reward at the finish line. Ask the class what that pupil could message back. Best answer: on at 5, save me a spot. Not a no. A when.$gc390$::text))
     where module_id = 'ks2-04-screen-routines';
  end if;

  select slides->8->>'question' into cur from schools.school_lessons where module_id = 'ks2-04-screen-routines';
  if not found then
    raise exception '390: ks2-04-screen-routines is missing from schools.school_lessons';
  end if;
  if cur is distinct from $gc390$You agreed to stop at the end of this level, then tea. It is nearly done. What does the cool down lap say?$gc390$ then
    if cur is distinct from $gc390$You agreed to stop at the end of this level, then tea. The level is nearly done. What does the cool down lap say to do?$gc390$ then
      raise exception '390: ks2-04 slide 9 question has been edited since 389, refusing to overwrite it';
    end if;
    update schools.school_lessons
       set slides = jsonb_set(slides, '{8,question}', to_jsonb($gc390$You agreed to stop at the end of this level, then tea. It is nearly done. What does the cool down lap say?$gc390$::text))
     where module_id = 'ks2-04-screen-routines';
  end if;

end $$;

-- Proof: both values are now the new ones, or nothing commits.
do $$
begin

  if (select slides->16->>'script' from schools.school_lessons where module_id = 'ks2-04-screen-routines') is distinct from $gc390$Read it like a real message, pace and all, then ask the prompt. The point to land: at two minutes to kickoff, willpower has already lost. A designed routine decided this hours ago: homework first with the phone in another room, the finishing line agreed, and the squad session as the SWAP, the reward at the finish line. Ask the class what that pupil could message back. Best answer: on at 5, save me a spot. Not a no. A when.$gc390$ then
    raise exception '390 proof: ks2-04 slide 17 script is not the new text';
  end if;

  if (select slides->8->>'question' from schools.school_lessons where module_id = 'ks2-04-screen-routines') is distinct from $gc390$You agreed to stop at the end of this level, then tea. It is nearly done. What does the cool down lap say?$gc390$ then
    raise exception '390 proof: ks2-04 slide 9 question is not the new text';
  end if;

end $$;

commit;
