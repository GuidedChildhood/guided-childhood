-- Guided Childhood — Migration 156
-- A lesson's one line for the child, separate from the one for the grown up.
--
-- key_message is shown in two places to two different readers. On the parent
-- hub it is the Remember panel, and on the child's own lessons list at
-- /k/[token]/lessons it is the line under every lesson title. One column, both
-- audiences, and the fifteen lessons of the social media 13 plus series were
-- written for the grown up:
--
--   "Your child holds the keys to four doors ... Your job is not to lock
--    everything down for them, it is to hand them the keys"
--
-- A thirteen year old opens their lessons list and reads that about themselves.
-- It is not a small thing. It tells them, in the app built to walk them into
-- independence, that the page is about them rather than for them.
--
-- The child page is not showing them the wrong rows. It queries
-- audience = 'parent' ON PURPOSE, because on this table audience separates the
-- family library from the school one, not the grown up from the child. Every
-- family lesson is meant to reach both. So the fix is not a filter, it is the
-- missing second line.
--
-- The grown up copy stays exactly as it is. It is good, it is Justin's voice,
-- and DiGi reads it for context in app/api/digi/route.ts. child_key_message is
-- additive and nullable, so every lesson that has not needed one yet simply
-- falls back to key_message and nothing changes for it.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

alter table public.lessons add column if not exists child_key_message text;

-- ── The social media 13 plus series (migrations 103 to 106) ──────────────────
-- Same idea as the grown up line, said to the young person who is living it.
-- Second person throughout, warm and plain, never a warning. No dashes.

update public.lessons set child_key_message =
  'The app is built to hold your attention, not to look after you. See how it is designed and you can steer it.'
  where title = 'How the machine works' and child_key_message is null;

update public.lessons set child_key_message =
  'Making an account is signing a deal. Thirteen is the age you can sign it, not the age you are ready for it.'
  where title = 'The deal you signed' and child_key_message is null;

update public.lessons set child_key_message =
  'You hold the keys to four doors: who sees you, who reaches you, your location, and blocking and reporting. Blocking is normal, not rude.'
  where title = 'Locking your doors' and child_key_message is null;

update public.lessons set child_key_message =
  'You are comparing your whole self to other people''s best frames. That contest is rigged, and seeing it is how you step out of it.'
  where title = 'The highlight reel' and child_key_message is null;

update public.lessons set child_key_message =
  'The images you measure yourself against are edited, so the bar is impossible. Cutting back on that content genuinely helps.'
  where title = 'Bodies and filters' and child_key_message is null;

update public.lessons set child_key_message =
  'Loving a creator is fine. The skill is spotting the advert when it arrives with a friendly face.'
  where title = 'Influencers and the sell' and child_key_message is null;

update public.lessons set child_key_message =
  'Unkindness online follows you home, so keep the evidence and tell someone. None of it is yours to carry alone.'
  where title = 'How people treat each other' and child_key_message is null;

update public.lessons set child_key_message =
  'It is the pattern that tells you, not one nice message. If an adult crosses a line, that is on them, never on you.'
  where title = 'Strangers, DMs and grooming' and child_key_message is null;

update public.lessons set child_key_message =
  'If this ever happens you are the victim, not the culprit, and the law is on your side. Telling someone is what stops it.'
  where title = 'Nudes, the law and sextortion' and child_key_message is null;

update public.lessons set child_key_message =
  'Extreme content is engineered to provoke you, not because it is true. Spot the pull and you can climb back out.'
  where title = 'Rabbit holes and radicalisation' and child_key_message is null;

update public.lessons set child_key_message =
  'The feed can move your mood without telling you. An honest look at how it left you puts you back in charge.'
  where title = 'The inner life' and child_key_message is null;

update public.lessons set child_key_message =
  'Your phone reaches your sleep and your focus, mostly at night. Guard the night and the rest of it gets easier.'
  where title = 'Sleep, attention and the body' and child_key_message is null;

update public.lessons set child_key_message =
  'The good side of social media is real and worth saying out loud. Every good thing on there just comes with a catch.'
  where title = 'The good side held honestly' and child_key_message is null;

update public.lessons set child_key_message =
  'The protections thin out as you grow up, so the judgement has to become yours. That is the goal, not the danger.'
  where title = 'Taking the wheel' and child_key_message is null;

update public.lessons set child_key_message =
  'A chatbot can be genuinely useful, but it is a tool, not a friend. It is built to agree, so it can be confidently wrong.'
  where title = 'AI companions and chatbots' and child_key_message is null;
