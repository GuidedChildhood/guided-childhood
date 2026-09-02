-- The curriculum matrix lessons get their own order.
--
-- Migration 018 seeded nine lessons per stage (the matrix: identity,
-- relationships, footprint, kindness, truth, wellbeing, privacy, creativity,
-- AI) all at sort_order 500. Every reader that sorts by sort_order then had
-- a nine way tie at the top of every stage, broken by whatever order the
-- rows happened to come back in. The child's list and the child's lesson
-- page broke it differently, so on the free tier the list unlocked one
-- lesson and the lesson page unlocked another and bounced the child back
-- (Justin, 2 September 2026, "does not run when clicked"). The code now ties
-- break on id as well; this spreads the nine out so "do them in order" means
-- one order everywhere, and it is the order 018 wrote them in, strand by
-- strand, identity first.
--
-- Parent and teacher rows move together (018 inserted both). Only rows still
-- at 500 move, so reapplying is a no op and a lesson someone has already
-- reordered by hand keeps its place.

update public.lessons l
set sort_order = v.new_order
from (values
  ('foundation', 'Me on a screen and me in real life', 500),
  ('foundation', 'Kind words on screens', 510),
  ('foundation', 'The internet remembers', 520),
  ('foundation', 'When screens make you sad', 530),
  ('foundation', 'Real or pretend?', 540),
  ('foundation', 'Screens, sleep and growing bodies', 550),
  ('foundation', 'My privacy shield', 560),
  ('foundation', 'Someone made that', 570),
  ('foundation', 'Some voices are not people', 580),
  ('builder', 'Your first avatar', 500),
  ('builder', 'Friends you know and friends you do not', 510),
  ('builder', 'Think before you post', 520),
  ('builder', 'Mean messages', 530),
  ('builder', 'Adverts are everywhere', 540),
  ('builder', 'The cool down lap', 550),
  ('builder', 'Passwords are secrets', 560),
  ('builder', 'Copying and creating', 570),
  ('builder', 'What is a robot brain?', 580),
  ('explorer', 'Filters are not faces', 500),
  ('explorer', 'Group chats without the drama', 510),
  ('explorer', 'Your digital footprint is already real', 520),
  ('explorer', 'Bystander or upstander', 530),
  ('explorer', 'Mood and the scroll', 550),
  ('explorer', 'Location, cameras and microphones', 560),
  ('explorer', 'Remix culture', 570),
  ('explorer', 'AI companions and real friends', 580),
  ('shaper', 'Who are you online?', 500),
  ('shaper', 'Relationships, pressure and phones', 510),
  ('shaper', 'Reputation and the long game', 520),
  ('shaper', 'Screenshots, shame and standing firm', 530),
  ('shaper', 'Deepfakes and doctored truth', 540),
  ('shaper', 'Sleep is not optional', 550),
  ('shaper', 'Scams aimed at teenagers', 560),
  ('shaper', 'Your work has value', 570),
  ('shaper', 'Using AI to learn, not to skip learning', 580),
  ('independent', 'Your identity is yours to write', 500),
  ('independent', 'Meeting people from the internet', 510),
  ('independent', 'Owning your online record', 520),
  ('independent', 'Calling it out safely', 530),
  ('independent', 'Your news diet', 540),
  ('independent', 'Designing your own digital life', 550),
  ('independent', 'Your data, your accounts, your money', 560),
  ('independent', 'Creating and getting paid', 570),
  ('independent', 'Building with AI', 580)
) as v(stage_id, title, new_order)
where l.stage_id = v.stage_id
  and l.title = v.title
  and l.sort_order = 500;
