-- Guided Childhood: slide based lessons
-- Run AFTER 016_lesson_completions.sql.
-- This is the format 013 promised: teaching modules delivered as slides,
-- matching the planned schools build. A lesson with a non null slides column
-- renders in the interactive player; lessons without slides keep the four
-- section text layout, so existing seed content keeps working untouched.
--
-- Slide shapes (validated in the app, lib/content/lesson-slides.ts):
--   { "type": "title",   "eyebrow": text, "title": text, "body": text }
--   { "type": "concept", "heading": text, "body": text, "emoji": text }
--   { "type": "quote",   "label": text, "text": text }
--   { "type": "choice",  "question": text, "options": [{ "text", "correct", "feedback" }] }
--   { "type": "tryit",   "heading": text, "body": text }
--   { "type": "recap",   "heading": text, "points": [text] }

alter table public.lessons    add column if not exists slides jsonb;
alter table public.ai_lessons add column if not exists slides jsonb;

-- ─────────────────────────────────────────────
-- Exemplar: the flagship slide lesson, proving the format end to end.
-- Explorer stage, the algorithm lesson, because it is the conversation
-- every parent of an 11 to 13 year old is about to have.
-- ─────────────────────────────────────────────
insert into public.lessons (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, slides) values
('explorer', 'parent', 'online_risks', 'How the algorithm decides what your child sees',
 'The feed is not a window, it is a test. Every video your child finishes teaches the app what to show next.',
 'Understanding the mechanic is more protective than removing the app. A child who knows they are being tested watches differently.',
 'Sit together and deliberately like three videos about a hobby. Watch how fast the feed changes. Ten minutes, and the algorithm goes from invisible to obvious.',
 'The app shows you things to keep you watching, not because they are true or normal.',
 'How do I explain to my 12 year old how the TikTok algorithm works?',
 5,
 '[
   {
     "type": "title",
     "eyebrow": "Explorer · Ages 11 to 13",
     "title": "How the algorithm decides what your child sees",
     "body": "Two minutes, one experiment to run together tonight. What every parent should know before the TikTok conversation."
   },
   {
     "type": "video",
     "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_205017_2052451b-a1d7-4932-9839-fd875b134903.mp4",
     "caption": "DiGi explains the algorithm to the class"
   },
   {
     "type": "concept",
     "emoji": "🔬",
     "heading": "It is not a feed. It is a test.",
     "body": "Every scroll is a question the app asks your child: what makes you stay? Every pause, replay and finished video is an answer. The feed your child sees tomorrow is built from the answers they gave today."
   },
   {
     "type": "choice",
     "question": "Your child watches one upsetting video all the way to the end. What does the app learn?",
     "options": [
       { "text": "Nothing. One video is not a pattern.", "correct": false, "feedback": "It learns instantly. Watching to the end is the strongest signal a viewer can send, stronger than a like." },
       { "text": "That this content holds their attention, so show more of it.", "correct": true, "feedback": "Exactly. The app does not know the video was upsetting. It only knows it worked. More arrives within minutes." },
       { "text": "It only learns from videos they like or share.", "correct": false, "feedback": "Likes are the weakest signal. Watch time is the vote that counts, and it is cast silently." }
     ]
   },
   {
     "type": "concept",
     "emoji": "🪞",
     "heading": "Why this matters at 11 to 13",
     "body": "Research at Cambridge identifies ages 11 to 13 as the highest sensitivity window, particularly for girls. A feed that quietly doubles down on body image or sadness content lands exactly when it does the most damage. The protection is not deleting the app. It is a child who can see the test happening."
   },
   {
     "type": "quote",
     "label": "Say this, not a lecture",
     "text": "The app shows you things to keep you watching, not because they are true or normal. Want to see how fast we can change what it shows you?"
   },
   {
     "type": "tryit",
     "heading": "The ten minute reset, together",
     "body": "Open the app side by side. Deliberately search and like three videos about something your child actually loves, football skills, baking, a game. Then scroll. Watch the feed bend toward it in real time. Once a child has steered the algorithm on purpose, they never unsee it."
   },
   {
     "type": "recap",
     "heading": "What to remember",
     "points": [
       "Watch time is the vote. Finishing a video tells the app to send more, even when the video felt bad.",
       "Ages 11 to 13 are the sensitivity window. The feed conversation belongs now, not at 16.",
       "Steering the feed together once teaches more than any lecture about it."
     ]
   }
 ]'::jsonb)
on conflict do nothing;
