-- Guided Childhood — Migration 041
-- The Stage 5 script titled "University or job and social media" did not read
-- well: it stacked two nouns and an "or" into something that scanned like a
-- form field. The script itself is good (going through your public profiles
-- together, deciding what a stranger should see). This just gives it a title
-- that reads like Justin wrote it, plain and clear, and tightens the setup
-- line to match. Scripts live in the database, so we update the live row here
-- rather than only the seed.

update public.scripts
set
  title = 'Your online footprint and your future',
  situation = 'Your 16 or 17 year old is starting to think about what their online life says about them, as sixth form, apprenticeships and jobs come into view.'
where stage_id = 'independent'
  and title = 'University or job and social media';
