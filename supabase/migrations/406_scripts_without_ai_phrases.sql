-- Guided Childhood, Migration 406
-- The AI phrases come out of the scripts and the lessons hub (Justin, 25
-- November 2026: "remove AI phrases from everything we do").
--
-- The site and app copy was swept in the same PR and is held by
-- `check-ai-tells.mjs --site`. This is the copy that lives in the database:
-- the "not X, it is Y" contrast and "the timer is the rule, not you", in the
-- why lines, the tonight lines and the few Say lines where a parent would not
-- talk that way.
--
-- NOT TOUCHED, on purpose:
--   The sextortion script's "you are not in trouble, and this is not your
--   fault" (migration 153). That is the safeguarding wording and it stays word
--   for word.
--   "It is not broken. It is just slow" (migration 180). It answers the child's
--   own feeling in two short sentences, which is how Justin talks.
--   The curriculum lessons. They are reviewed once a term (CLAUDE.md, REVIEW
--   STANDARD), and a sweep through them now would be churn.
--
-- Every change is replace() on the exact old words. If a later migration or an
-- edit has already changed a row, the old words are not there and nothing
-- happens. Title, situation and category are unchanged, so script embeddings
-- (migration 131) stay valid. Idempotent.

create or replace function pg_temp.swap(old_text text, new_text text) returns void
language sql as $fn$
  update public.scripts
  set say_this     = replace(say_this, old_text, new_text),
      why_it_works = replace(why_it_works, old_text, new_text),
      tonight      = replace(tonight, old_text, new_text)
  where strpos(coalesce(say_this, '') || coalesce(why_it_works, '') || coalesce(tonight, ''), old_text) > 0;
$fn$;

select pg_temp.swap(
  $o$Snapchat says thirteen and up, so it is not you, it is the rule.$o$,
  $n$Snapchat's own rule says thirteen and up.$n$);

select pg_temp.swap(
  $o$That is not me not trusting you, it is what the numbers say.$o$,
  $n$I do trust you. I am going on what the numbers say.$n$);

select pg_temp.swap(
  $o$you are not the same person. That is not a warning, it is just true.$o$,
  $n$you are not the same person. That is true for everyone.$n$);

select pg_temp.swap(
  $o$deleting what does not sound like you is not panic, it is just tidying.$o$,
  $n$deleting what does not sound like you is just tidying.$n$);

select pg_temp.swap(
  $o$That is not weakness, that is the design working.$o$,
  $n$That is the design working.$n$);

select pg_temp.swap(
  $o$in the heat of it is not a neutral act, it is the trigger.$o$,
  $n$in the heat of it is often the trigger.$n$);

select pg_temp.swap(
  $o$So the conversation is not about whether, it is about what they make of it,$o$,
  $n$So the conversation to have is about what they make of it,$n$);

select pg_temp.swap(
  $o$That is not bad behaviour at the gate, it is trust,$o$,
  $n$The meltdown at the gate is a sign of trust,$n$);

select pg_temp.swap(
  $o$It is not a negotiation. It is a predictable signal that reduces the crash.$o$,
  $n$Same warning, same words, every time, so they can see the end coming and the crash gets smaller.$n$);

-- The lessons hub's parent lessons (migration 013). The timer line takes
-- Justin's own approved wording from 25 November.
update public.lessons
set try_this = replace(try_this,
      'so the timer is the rule, not you.',
      'so screen time ends because the timer says so, not because you are the bad guy.')
where audience = 'parent' and strpos(try_this, 'so the timer is the rule, not you.') > 0;

update public.lessons
set key_message = replace(key_message,
      'The routine is the boundary. You are not the referee, the timer is.',
      'The routine sets the boundary, so you do not have to referee.')
where audience = 'parent' and strpos(key_message, 'You are not the referee, the timer is.') > 0;

update public.lessons
set why_it_matters = replace(why_it_matters,
      'Supervision at this stage is not about trust, it is about developmental readiness.',
      'Supervision at this stage is about developmental readiness.')
where audience = 'parent' and strpos(why_it_matters, 'is not about trust, it is about developmental readiness.') > 0;
