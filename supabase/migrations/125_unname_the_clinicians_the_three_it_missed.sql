-- Guided Childhood — Migration 125
--
-- Finish what 123 started. Three lesson scripts still named a clinician.
--
-- 123 is right about everything except its own completeness. Its replace chain
-- covers ten phrasings, and there were thirteen in the data. Running it left
-- three lessons still reading a living clinician's name out to a parent:
--
--   The stop and tell rule                        "This is the Dr Becky line, say it slowly: ..."
--   Why stopping feels hard, and how to win at it  "Knibbs framing, child sized: ..."
--   The footprint test                             "This is Knibbs territory: ..."
--
-- That is a worse state than not having run it, and it is worth being precise
-- about why. Before 123, the problem was visible: search for the name and there
-- it is. After 123, eleven of fourteen are clean, every check reads as done, and
-- nobody looks again. A partial fix to a compliance problem is the version that
-- ships, because it removes the evidence of itself.
--
-- Found by running 123's chain over the real rows and counting what still
-- matched BEFORE applying it, which is the check 123's own comments recommend
-- ("caught by running the chain over the real strings and reading the output
-- rather than trusting the pattern") and the one thing that catches this class
-- of miss. daily_moments was checked the same way and is genuinely complete at
-- fourteen of fourteen; the gap is only in lessons.slides.
--
-- Same rule as 123 for the rewrites: keep the sentence doing its job rather
-- than leaving a hole where a name was. Each of these is an instruction to a
-- parent about how to say something, so the instruction survives and only the
-- borrowed authority goes.
--
--   "This is the Dr Becky line, say it slowly:"  ->  "Say this slowly:"
--   "Knibbs framing, child sized:"               ->  "Child sized:"
--   "This is Knibbs territory:"                  ->  "This is the heart of it:"
--
-- No nesting order problem here: the three patterns share no prefix with each
-- other or with any of 123's ten, so they cannot interfere whichever way round
-- they run.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements. Plain
-- replaces, so a second run changes nothing.

update public.lessons
set slides = replace(replace(replace(
      slides::text,
      'This is the Dr Becky line, say it slowly: ', 'Say this slowly: '),
      'Knibbs framing, child sized: ', 'Child sized: '),
      'This is Knibbs territory: ', 'This is the heart of it: ')::jsonb
where slides::text like '%Becky%' or slides::text like '%Knibbs%';

-- The other two text columns on lessons, and daily_moments, were already clean
-- after 123. They are re-checked here rather than assumed, because this whole
-- migration exists because something was assumed once already. Both are no ops
-- on current data and cost nothing.

update public.lessons
set why_it_matters = replace(replace(replace(
      why_it_matters,
      'This is the Dr Becky line, say it slowly: ', 'Say this slowly: '),
      'Knibbs framing, child sized: ', 'Child sized: '),
      'This is Knibbs territory: ', 'This is the heart of it: ')
where why_it_matters like '%Becky%' or why_it_matters like '%Knibbs%';

update public.daily_moments
set expert_note = replace(replace(replace(
      expert_note,
      'This is the Dr Becky line, say it slowly: ', 'Say this slowly: '),
      'Knibbs framing, child sized: ', 'Child sized: '),
      'This is Knibbs territory: ', 'This is the heart of it: ')
where expert_note like '%Becky%' or expert_note like '%Knibbs%';
