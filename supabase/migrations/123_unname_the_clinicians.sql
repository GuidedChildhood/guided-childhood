-- Guided Childhood — Migration 123
--
-- Take the living clinicians' names off the advice a parent reads.
--
-- Justin: "I'd rather not name them, other than we have built a team of
-- researchers in the field to draw upon that follow our philosophy."
--
-- The reason this matters, and why it is worth doing before launch rather than
-- after: naming a real, practising clinician next to advice inside a paid
-- product reads as endorsement whether or not it is meant to. A parent who
-- chooses to pay partly because a name they trust appears on the guidance has
-- relied on something we never had permission to imply. Cheap to fix now,
-- expensive and reputationally ugly to fix later.
--
-- Scope is deliberately narrow, and the distinction is the whole point:
--
--   IN: text a parent sees. daily_moments.expert_note is printed on the moment
--       page. lessons.slides carries the "say this tonight" script the parent
--       reads out, and several of those scripts attribute the framing to a
--       person by name.
--
--   OUT: names inside AI system prompts (lib/digi, the rehearsal engine). A
--       parent never sees those. They steer the model toward connection before
--       correction and the nervous system framing, and stripping them would
--       quietly make the output worse in exchange for no protection at all.
--
--   OUT: expert_knowledge.source_name, which is the internal provenance of a
--       finding and shows only on Justin's own insights board. A record of
--       where something came from is the opposite of a problem: it is what lets
--       us answer a hard question later. Removing it would make the product
--       LESS accountable while looking more careful.
--
--   OUT: published academic citations (Odgers, Orben, Przybylski, Livingstone)
--       on the homepage and the lessons hub. Those are citations of public
--       research, not clinicians attached to our advice, and the marketing brief
--       is explicit that every one of them is defensible.
--
-- The ideas all stay. It is only the names coming off, because the idea is what
-- helps a parent and the name was only ever borrowed authority.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements. Every
-- statement here is a plain replace, so running it twice changes nothing the
-- second time.

-- The hard moments. Each note opened with "Dr Becky Kennedy:" or
-- "Catherine Knibbs:" and then said the useful thing, so dropping the prefix
-- leaves the sentence intact and reading naturally.
update public.daily_moments
set expert_note = replace(replace(replace(replace(
      expert_note,
      'Dr Becky Kennedy: ', ''),
      'Catherine Knibbs: ', ''),
      'Dr Becky Kennedy, ', ''),
      'Catherine Knibbs, ', '')
where expert_note like '%Becky%' or expert_note like '%Knibbs%';

-- The lesson scripts. Cast the whole slides document to text, swap the phrases,
-- cast back. None of the replacements introduce a quote or a backslash, so the
-- JSON cannot be broken by this.
--
-- Each one is rewritten to keep the sentence doing its job rather than leaving a
-- gap where a name was. "Knibbs is clear that fear shuts learning down" becomes
-- "The evidence is clear that fear shuts learning down", capitalised because that
-- phrase follows a full stop, which is the same
-- instruction to the parent and no longer a claim about a person.
-- Nested replace evaluates innermost first, so the MOST SPECIFIC phrase has to
-- sit innermost. Written the other way round, "Knibbs puts the nervous system at
-- the centre" fires first and leaves "Catherine The research puts the nervous
-- system at the centre", which is worse than the thing being fixed. The order
-- below is longest match first, deliberately.
-- Two of these carry the surrounding words with them, because dropping the name
-- alone leaves broken English. "This is Knibbs made practical" became "This is
-- Made practical", and "Knibbs would say children learn regulation" became a
-- sentence starting with a lower case c. Both were caught by running the chain
-- over the real strings and reading the output rather than trusting the pattern,
-- which is the only way that kind of mistake shows up.
update public.lessons
set slides = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
      slides::text,
      'Catherine Knibbs puts the nervous system at the centre: ', 'The research puts the nervous system at the centre: '),
      'Knibbs puts the nervous system at the centre: ', 'The research puts the nervous system at the centre: '),
      'Knibbs names what happens in the moment: ', 'What happens in the moment: '),
      'This is Knibbs made practical: ', 'Made practical: '),
      'Knibbs would say children', 'Children'),
      'This is the Dr Becky framing: ', 'The framing here: '),
      'The Dr Becky move here is ', 'The move here is '),
      'Dr Becky style: ', ''),
      'Knibbs is clear that ', 'The evidence is clear that '),
      'Knibbs made practical: ', 'Made practical: ')::jsonb
where slides::text like '%Becky%' or slides::text like '%Knibbs%';

-- The same two fields on the lesson body, which are shown above the slides.
update public.lessons
set why_it_matters = replace(replace(replace(
      why_it_matters,
      'Catherine Knibbs puts the nervous system at the centre: ', 'The research puts the nervous system at the centre: '),
      'Catherine Knibbs: ', ''),
      'Dr Becky Kennedy: ', '')
where why_it_matters like '%Becky%' or why_it_matters like '%Knibbs%';

update public.lessons
set the_idea = replace(replace(the_idea, 'Catherine Knibbs: ', ''), 'Dr Becky Kennedy: ', '')
where the_idea like '%Becky%' or the_idea like '%Knibbs%';
