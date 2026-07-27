-- Guided Childhood — Migration 103
-- Social Media Literacy 13+ curriculum, Module 1 (How the machine works),
-- PARENT co view version, wired into public.lessons.
--
-- This is the tested worked example. It mirrors the exact pattern of
-- migration 092 (the Social Media Ready spine) and 074 (the Rosenshine
-- family lessons): public.lessons, audience parent, category social media,
-- the five co view fields plus a slides deck in the same shape. Once this
-- renders clean on a preview, modules 2 to 15 follow the identical pattern.
--
-- Source content: content/curriculum/social-media-13plus/module-01-how-the-machine-works.md
-- (Version C, the approved template). The schools in depth version belongs
-- in public.school_lessons (033 pattern) and the kid interactive version in
-- the pupil facing surface, both to be seeded by a session that can render
-- check the player, per non negotiable 5.
--
-- Idempotent: guarded by title. Dollar quoted JSON. No DO blocks. No dashes
-- in any copy. Claims verified in the 26 Jul verification pass.

insert into public.lessons (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select 'shaper', 'parent', 'social media', 'How the machine works',
  'Social media apps are free because your child''s attention is the product being sold. The app is designed, deliberately, to be hard to put down. The feed, the endless scroll, the notifications, the streaks, none of it is an accident, and none of it is your child being weak.',
  'Knowing the app is engineered to hold attention changes two things. You stop blaming your child for struggling to stop, which keeps them talking to you. And you can teach them to see the design, which protects them far more than a time limit they resent.',
  'Ask your child to teach you. Show me how your For You page works, and why do you think it shows you that. Then gently, the app is free, so how does it make its money. Let them reach the answer, their attention. Watch one just one more moment together and name the trick as a team, not a telling off. Then agree one small thing together, notifications off at homework or bedtime, autoplay off, or a stop set before they start.',
  'The app is built to hold their attention, not to look after them. Your job is not to police the minutes, it is to help them see the design so they can steer it themselves.',
  'My teenager says they cannot stop scrolling. How do I help without just taking the phone away?',
  1010, 'live',
  $s1$[
    {"type":"title","phase":"starter","minutes":1,"eyebrow":"Shaper · Ages 13 to 15 · Social media ready","title":"How the machine works","body":"A short lesson for you and your teenager together, on why the apps are so hard to put down, and how to see the design instead of fighting about it.","script":"Starter recall: last time, why does stopping a screen feel so hard? The rewards stop suddenly. Today: which parts of the app are built, on purpose, to keep you looking?"},
    {"type":"objective","phase":"starter","minutes":1,"outcome":"We can both name how the app is built to hold attention, and one thing we do about it.","why":"When you can see the design, you stop blaming each other for the pull, and you can steer it together instead.","gains":["I can say the app is built to hold attention","I know free to use means my attention is the product","I can name one move that takes control back"]},
    {"type":"concept","phase":"teach","minutes":2,"emoji":"📱","heading":"You are the product","body":"The app is free because your attention is what it sells. Every part, the feed, the endless scroll, the notifications, the streaks, is designed to keep you looking a little longer. None of it is an accident, and none of it is your teenager being weak.","script":"Small step check before moving on: ask why a free app would want you to look for longer. Money from attention. Let that land, it is the idea under everything else."},
    {"type":"concept","phase":"teach","minutes":2,"emoji":"🔁","heading":"The tools it uses","body":"The feed shows what keeps you watching, not what is true. The scroll never ends and the next thing plays itself. Notifications tap you back. Streaks make it feel like a duty. Naming these out loud, together, is what takes their power away.","script":"Try naming them live together the next time you are both on a phone. That is autoplay. That is a notification. It turns a fight into a shared game of spot the trick."},
    {"type":"choice","phase":"practise","minutes":2,"question":"The app is free to download. So how does the company actually make its money?","options":[{"text":"From your attention and the time you spend on it","correct":true,"feedback":"Yes. Free to you means your attention is what pays, which is exactly why it is built to hold you."},{"text":"It does not really make money, it is just for fun","correct":false,"feedback":"A big app costs a lot to run. If you are not paying with money, your attention is what pays."}]},
    {"type":"choice","phase":"prove","minutes":2,"question":"Your teenager says they cannot stop scrolling. What is the calm, useful thing to do?","options":[{"text":"Take the phone away and tell them off","correct":false,"feedback":"That teaches them to hide it, and it treats the pull as a character flaw when it is really the design."},{"text":"Name the design together and agree one small move, like autoplay off","correct":true,"feedback":"Exactly. Seeing the trick, plus one small change they helped choose, beats a lecture or a ban every time."}]},
    {"type":"digi","phase":"close","minutes":1,"heading":"DiGi says","lines":["The app is built to hold attention, not to look after you.","Free to you means your attention is what pays.","See the design together, then pick one small move."]}
  ]$s1$::jsonb
where not exists (select 1 from public.lessons where title = 'How the machine works');
