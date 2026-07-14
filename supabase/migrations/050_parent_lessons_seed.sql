-- 050_parent_lessons_seed.sql
-- Seed for the watch together lessons (Stage 1, ages 4 to 7): the ten
-- validated parent and child co view lessons, their CDN video segments
-- (cdn-urls-v3.json, all ten rendered) and the pause and quiz cards.
-- Written copy comes from the validated script docs (July 2026 validation
-- audit). Content in the database, never hardcoded (non negotiable 6).
--
-- Rendered video overrides applied per the audit: 1.7 catchphrase is
-- "Check with your grown up first!"; 1.9 copy never mentions "mum";
-- no dashes in any copy string.
--
-- Quiz cards exist for 1.1, 1.2 and 1.10 (the v3 validated docs). The
-- other lessons complete at the end of segment C until the content lane
-- authors their What would DiGi do scenarios.
--
-- Idempotent-ish: deletes the seed rows for these lesson codes first,
-- then inserts fresh. Runs as a single transaction.

begin;

delete from public.parent_lesson_cards
where lesson_id in (
  select id from public.parent_lessons
  where lesson_code in ('1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','1.9','1.10'));

delete from public.parent_lesson_segments
where lesson_id in (
  select id from public.parent_lessons
  where lesson_code in ('1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','1.9','1.10'));

delete from public.parent_lessons
where lesson_code in ('1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','1.9','1.10');

-- ── Lessons ─────────────────────────────────────────────────────────────────

insert into public.parent_lessons
  (lesson_code, stage_id, journey_step, title, strand, keyword, catchphrase, knowledge_intention, emotional_intention, misconception, parent_note, active)
values
  ('1.1', 1, 1, 'Me on a screen and me in real life', 'Self-image and identity', 'TELL', 'Real me is the whole me!',
   'I can say that people and things on a screen can look different from how they really are.',
   'I know my feelings about things on screens always matter, and I can say no and tell my grown up about anything, without ever being in trouble.',
   'Children often think screens show things exactly as they are, that a friendly looking face IS a friendly person, and that a photo holds all of someone. Tonight''s Mirror Game breaks the photo half; the say no and tell beat covers the rest.',
   'Children often think screens show things exactly as they are, so tonight gently shows that a photo is only a slice and the real, whole you is always more. If you say you will never be in trouble for telling, keep the promise: respond calmly even when a rule was broken.',
   true),
  ('1.5', 1, 2, 'Real or pretend?', 'Managing online information', 'PRETEND', 'Is this real?',
   'I can say that some things on screens are pretend (made up), and use the magic question "Is this real?"',
   'I don''t have to know the answer by myself, asking my grown up is the clever thing to do.',
   'Children often think everything with real people or real footage in it is real, and that made up only means cartoons. Tonight''s Real or Pretend game exists to break exactly that.',
   'Children often think anything with real people in it must be real, so tonight hands them the magic question and a grown up to ask it with. If you say you will never be in trouble for telling, keep the promise: respond calmly even when a rule was broken.',
   true),
  ('1.2', 1, 3, 'Kind words on screens', 'Online relationships and online bullying', 'KIND', 'Real person on the other side!',
   'I can say that words I send on a screen reach a real person''s feelings, and I know that most people online are kind, but some can be unkind, and some pretend to be someone they are not. If that happens, I go and tell.',
   'I know my kind words make real people feel warm, being the kind one feels good, and if someone is ever unkind, it is never my fault and telling is never naughty.',
   'Children often think screen words don''t reach real feelings, and the kind message send breaks exactly that. This lesson also adds the balancing truth, gently and without fear: most planes land warm, but not all senders are kind, and not everyone is who they say they are. If anything unkind happens: never their fault, telling is never naughty.',
   'Children often think words on a screen don''t reach real feelings, so tonight shows every message landing on a real person''s heart, with the gentle truth that not every sender is kind. If you say you will never be in trouble for telling, keep the promise: respond calmly even when a rule was broken.',
   true),
  ('1.4', 1, 4, 'When screens make you sad', 'Health, wellbeing and lifestyle', 'FEELING', 'Turn it over. Go and tell!',
   'I can notice the uh oh feeling in my body, turn the screen over, and go and tell a grown up.',
   'All feelings are okay; telling is never naughty.',
   'Children often think a bad feeling means THEY did something naughty, so they hide it. This lesson exists to break exactly that: the modelled never in trouble script and tonight''s High Five Game make telling feel safe and fun.',
   'Children often think a bad feeling means they did something naughty, so tonight makes telling feel safe, quick and even fun. If you say you will never be in trouble for telling, keep the promise: respond calmly even when a rule was broken.',
   true),
  ('1.3', 1, 5, 'The internet remembers', 'Online reputation', 'REMEMBER', 'Stop. Ask. Then share!',
   'I can say that things we send on the internet can stay and be seen later, so I stop and ask a grown up before sharing.',
   'Asking a grown up first feels good, it is a clever, kind thing to do, never a telling off.',
   'Children often think a sent picture disappears when the app closes. Ellie exists to break exactly that: the internet keeps it, even when the screen goes dark.',
   'Children often think a sent picture disappears when the app closes, so tonight Ellie the elephant shows, warmly and without fear, that the internet remembers what we send to someone we love. If you say you will never be in trouble for telling, keep the promise: respond calmly even when a rule was broken.',
   true),
  ('1.7', 1, 6, 'My privacy shield', 'Privacy and security', 'PRIVATE', 'Check with your grown up first!',
   'I can name my special private things (my whole name, my home, my school, my photos) and I check with my grown up before sharing them.',
   'I know my private things are precious, not shameful, and I''ll never be in trouble for checking.',
   'Children often think private means naughty or secret, something you''d get told off about. Private things are precious, not shameful. Tonight''s shield drawing turns them into treasures, not secrets.',
   'Children often think private means naughty or secret, so tonight turns their private things into treasures kept safe behind a shield. If you say you will never be in trouble for telling, keep the promise: respond calmly even when a rule was broken.',
   true),
  ('1.8', 1, 7, 'Someone made that', 'Copyright and ownership', 'MAKER', 'Ask first. Say their name!',
   'I can say that things on screens were made by real people, and I know the two kind steps: ask first, say who made it.',
   'I feel proud that I am a maker too, what I make matters and belongs to me.',
   'Children often think things on screens appear by magic, so nobody made them and nobody owns them. Tonight''s Make It and Name It game exists to break exactly that.',
   'Children often think things on screens appear by magic, so tonight reveals the real people who make them and celebrates your child as a maker too. If you say you will never be in trouble for telling, keep the promise: respond calmly even when a rule was broken.',
   true),
  ('1.6', 1, 8, 'Screens, sleep and growing bodies', 'Health, wellbeing and lifestyle', 'SLEEP', 'Screens go to bed first!',
   'I can say that sleep is when my body grows, and that bright screens before bed make it harder to feel sleepy.',
   'Bedtime feels cosy and safe, winding down together is a treat, not a punishment.',
   'Children often think sleep is wasted boring time when nothing happens. Sleep is when the body grows.',
   'Children often think sleep is boring time when nothing happens, so tonight shows sleep as the busiest growing time of the whole day. If you say you will never be in trouble for telling, keep the promise: respond calmly even when a rule was broken.',
   true),
  ('1.9', 1, 9, 'Some voices are not people', 'AI safety', 'VOICE', 'Some voices are not people!',
   'I can say that some voices that talk to me are not people, they are machines, and machines can be wrong.',
   'A talking machine is nothing to worry about, if a voice ever says something odd, I know exactly who to tell, and telling feels good.',
   'Children often think a friendly voice must belong to a real person who knows and loves them. Tonight''s Meet the Machine game exists to break exactly that, playfully, with zero fear.',
   'Children often think a friendly voice must belong to a real person who knows and loves them, so tonight introduces talking machines playfully and with zero fear. If you say you will never be in trouble for telling, keep the promise: respond calmly even when a rule was broken.',
   true),
  ('1.10', 1, 10, 'The Yes No Button', 'Online relationships and consent', 'PERMISSION', 'Ask before you press yes!',
   'I can stop and ask a grown up before I press YES, AGREE, ACCEPT or OK, I know I am allowed to say no online, and I know to ask my friend before sharing anything that belongs to them.',
   'I feel safe saying no and asking first, I will never be in trouble for either.',
   'Children often think YES buttons are just how you make things work, press to continue. Tonight''s Pop Up Game exists to break exactly that: the yes button is a promise button, not a go button.',
   'Children often think yes buttons are just how you make things work, so tonight teaches that a yes button is a promise button we only press with a grown up. If you say you will never be in trouble for telling, keep the promise: respond calmly even when a rule was broken.',
   true);

-- ── Segments (cdn-urls-v3.json) ─────────────────────────────────────────────

insert into public.parent_lesson_segments (lesson_id, segment, video_url, duration_seconds, sort)
select l.id, v.segment, v.video_url, v.duration_seconds, v.sort
from (values
  ('1.1', 'full', 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/0f7a2017-7f6c-4181-9ff9-f976eea49cd7.mp4', 314.97, 0),
  ('1.1', 'A',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/f73fc62f-eba9-4e2e-870e-f40e59a0d76d.mp4', 130.60, 1),
  ('1.1', 'B',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/fb8acb47-6bad-43f0-bdd4-680d99799335.mp4', 131.13, 2),
  ('1.1', 'C',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/678cde09-3775-40a4-ba58-caa01a912b24.mp4', 53.31, 3),
  ('1.2', 'full', 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/11f40043-7f83-448a-bcf3-b5cde1c19d48.mp4', 300.20, 0),
  ('1.2', 'A',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/b2cb6f56-b168-4964-926b-db34a4014bab.mp4', 130.50, 1),
  ('1.2', 'B',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/487deb39-1589-4093-82e7-911592ac3df2.mp4', 86.00, 2),
  ('1.2', 'C',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/8acd3dc1-3d8b-4973-b367-9a73b968a679.mp4', 83.75, 3),
  ('1.3', 'full', 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/28e9c969-8012-4149-946d-14a33b262c18.mp4', 241.60, 0),
  ('1.3', 'A',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/9bb7fee1-1a6a-4405-bfb7-268b198782cf.mp4', 130.37, 1),
  ('1.3', 'B',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/7c689877-9460-49ba-ac2e-4a1d586f7d30.mp4', 60.43, 2),
  ('1.3', 'C',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/af23855d-9556-4861-b4e8-3efd717509e1.mp4', 50.85, 3),
  ('1.4', 'full', 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/dc59fa10-926a-4a26-b1a3-d6b971f528a4.mp4', 307.57, 0),
  ('1.4', 'A',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/5ead9241-6ce1-4cfd-9bb1-5f90e9229b25.mp4', 130.70, 1),
  ('1.4', 'B',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/c251768e-1084-4456-9301-67455650363f.mp4', 130.73, 2),
  ('1.4', 'C',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/0ada8bb8-e69e-483e-9304-f29f54473d10.mp4', 46.17, 3),
  ('1.5', 'full', 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/b8c92f0a-281b-459a-96bb-5717d93f37e6.mp4', 256.00, 0),
  ('1.5', 'A',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/c5af3f7f-c927-4dbc-9e08-d62bccfc9777.mp4', 130.27, 1),
  ('1.5', 'B',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/a256bf29-5702-4ed5-922e-9ece84a3781e.mp4', 78.30, 2),
  ('1.5', 'C',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/3af09b21-cdc6-49cc-9e84-636ad234a95b.mp4', 47.44, 3),
  ('1.6', 'full', 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/6ec54643-9c52-4911-82fe-24f8b8a3ee1d.mp4', 276.97, 0),
  ('1.6', 'A',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/60d7945f-df7e-4b40-bd82-28be44d0a2d5.mp4', 140.00, 1),
  ('1.6', 'B',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/c115fb96-e95f-4f51-bae1-6d31aa2c5922.mp4', 82.20, 2),
  ('1.6', 'C',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/7839ca1b-b74c-4f87-bd4b-5fcd97be6129.mp4', 54.77, 3),
  ('1.7', 'full', 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/de568f63-6490-40d8-bc00-d85ea68fae44.mp4', 291.92, 0),
  ('1.7', 'A',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/a6e4bd6d-2865-40f7-bad0-01ebb04a283c.mp4', 129.37, 1),
  ('1.7', 'B',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/e95c4286-394c-4ee5-b15b-810f3ca70c20.mp4', 102.93, 2),
  ('1.7', 'C',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/7d2b4fd1-b71a-4d3b-be17-b06a648d537c.mp4', 59.68, 3),
  ('1.8', 'full', 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/7462b632-4403-4dbc-8f45-be12598d5980.mp4', 281.60, 0),
  ('1.8', 'A',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/ad133631-eeac-40b0-a148-6851265c3033.mp4', 130.50, 1),
  ('1.8', 'B',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/caf762a4-75b1-430c-bb12-3946d44f1f64.mp4', 108.47, 2),
  ('1.8', 'C',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/5d5b514c-0d12-47ba-94b1-de3db6f42196.mp4', 42.68, 3),
  ('1.9', 'full', 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/cc3ea663-e732-4ff3-9ed5-6223fbb456f6.mp4', 309.43, 0),
  ('1.9', 'A',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/7eab6c77-3ce1-41ab-b49b-049e4ca1e431.mp4', 130.60, 1),
  ('1.9', 'B',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/35a547bd-6291-4d4c-9c7e-366bd71a8fd6.mp4', 103.97, 2),
  ('1.9', 'C',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/87e683e1-bd77-4357-a03a-6651898eed07.mp4', 74.91, 3),
  ('1.10', 'full', 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/5e05f7e6-6a56-419d-8da0-510634b2048e.mp4', 288.33, 0),
  ('1.10', 'A',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/9729054b-608d-4b95-99fc-1cb1761a2ca3.mp4', 128.93, 1),
  ('1.10', 'B',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/83ed64d9-f0a0-41b9-a8c4-b40d557c61f2.mp4', 88.95, 2),
  ('1.10', 'C',    'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/c983b068-a01c-4c6d-99a6-c8d7b923a1c4.mp4', 70.46, 3)
) as v(lesson_code, segment, video_url, duration_seconds, sort)
join public.parent_lessons l on l.lesson_code = v.lesson_code;

-- ── Cards (pause prompts and quizzes, verbatim from the script docs) ────────

insert into public.parent_lesson_cards (lesson_id, position, card_type, prompt, older_variant, options)
select l.id, v.position, v.card_type, v.prompt, v.older_variant, v.options::jsonb
from (values
  ('1.1', 1, 'ask', 'What can the real YOU do that a photo can''t?',
   'Can you think of a time something on a screen looked different from real life?', null),
  ('1.1', 2, 'say', 'You can tell me about ANYTHING you see on a screen. How you feel always matters to me.',
   'What would you do if something on a screen made you feel funny inside?', null),
  ('1.1', 3, 'quiz', 'Milo is playing on a tablet. A game pops up with a big smiley face and says: "Hello friend! Tell me your name!" Milo feels a little funny inside. What would DiGi do?',
   null,
   '[{"text": "Type his name. The smiley face looks so friendly, so it must be friendly.", "correct": false, "reaction": "Hmm, not quite! Remember our big secret: things on screens can LOOK friendly and be different from real life. A screen only shows a slice, never the whole thing. What could Milo do instead?"}, {"text": "Say no, put the tablet down, and tell his grown up.", "correct": true, "reaction": "YES! That funny feeling inside is a little helper. Milo says no, puts the screen down, and tells his grown up. Telling is always a good idea, and you are never in trouble for telling. Real me is the whole me!"}, {"text": "Keep playing and try to forget the funny feeling.", "correct": false, "reaction": "Your feelings matter, every single one! When something makes you feel funny or wobbly inside, that is exactly the time to say no and tell your grown up. They love it when you tell."}]'),
  ('1.2', 1, 'ask', 'When someone says something kind to YOU, how does it feel in your tummy?',
   'Has a message on a screen ever made you feel warm? And if words ever felt wobbly instead, who would you tell?', null),
  ('1.2', 2, 'ask', 'Who could WE send a kind message to right now? Pick one person together.',
   'If someone in a game was unkind to your friend, what TWO helper things could you do? (Tell a grown up. Send the friend something kind.)', null),
  ('1.2', 3, 'quiz', 'You and your friend Sami are playing a game. Someone in the game says something unkind to Sami: "You''re rubbish at this!" Sami looks sad. What would DiGi do?',
   null,
   '[{"text": "Say something unkind back to them, so they stop.", "correct": false, "reaction": "Hmm, not this one. Unkind planes back just means MORE cold planes flying about. You can be the helper a better way. Try again!"}, {"text": "Tell a grown up, and send Sami a kind message.", "correct": true, "reaction": "YES! That''s the helper way. Tell a grown up, then send Sami a warm plane so the kind words outnumber the unkind one. Helpers are heroes!"}, {"text": "Do nothing. It''s only the screen, so it doesn''t really hurt Sami''s feelings.", "correct": false, "reaction": "Careful! Remember our special sentence: real person on the other side! Screen words land right on Sami''s REAL feelings. Sami needs a helper, and that helper can be you."}]'),
  ('1.3', 1, 'ask', 'What is something YOU have sent to someone, a photo, a voice message, a drawing? Where do you think it is now?', null, null),
  ('1.3', 2, 'say', 'Say it together three times, like a little song: Stop. Ask. Then share.', null, null),
  ('1.4', 1, 'ask', 'Where do YOU feel a wobbly feeling? Point to it.', null, null),
  ('1.4', 2, 'say', 'If a screen ever gives you the uh oh feeling, you can always come to me. You will never be in trouble.', null, null),
  ('1.5', 1, 'ask', 'Can you think of something on a screen that is PRETEND? And something that is REAL?', null, null),
  ('1.5', 2, 'say', 'Say together: "When we are not sure… we ASK." Then give each other a high five.', null, null),
  ('1.6', 1, 'ask', 'What do YOU think grows while we''re asleep?', null, null),
  ('1.6', 2, 'ask', 'What are our cosy, calm things before bed?', null, null),
  ('1.7', 1, 'ask', 'What goes behind our privacy shield? Help them find all four: our whole name, our home, our school, our photos.', null, null),
  ('1.7', 2, 'say', 'You''ll never be in trouble for checking. Then ask: who are your check first grown ups? Name them together, so they always know where to run.', null, null),
  ('1.8', 1, 'ask', 'What''s your favourite thing on a screen, and who do you think made it?', null, null),
  ('1.8', 2, 'ask', 'If someone wanted to use YOUR drawing, what would you want them to say to you first?', null, null),
  ('1.9', 1, 'ask', 'Can you point to something in OUR house that talks but is NOT a person?', null, null),
  ('1.9', 2, 'ask', 'If a voice on a screen said something odd, who would you come and tell?', null, null),
  ('1.10', 1, 'ask', 'What do we do before we press a yes button?',
   'Why do you think a pop up wants you to press yes quickly?', null),
  ('1.10', 2, 'say', 'You will never be in trouble for saying no or asking first.',
   'Even if you already pressed something, come and tell me. Telling always makes it better.', null),
  ('1.10', 3, 'quiz', 'DiGi is playing a drawing game when a big shiny pop up bounces in: "PRESS YES FOR 100 FREE COINS!" What would DiGi do?',
   null,
   '[{"text": "Press yes. That''s just how you make the game keep going.", "correct": false, "reaction": "Ooh, careful! Yes buttons aren''t go buttons, they''re PROMISE buttons. We check before we promise. Try again!"}, {"text": "Stop, hands off, and ask a grown up before pressing anything.", "correct": true, "reaction": "YES! That''s exactly it! Stop, hands off, ask first. You''re brilliant at doors!"}, {"text": "Ask a friend who is also little to press it instead.", "correct": false, "reaction": "Friends are lovely, but this is a grown up job! Little friends can''t see behind the yes door either. Fetch a grown up, then decide together."}]')
) as v(lesson_code, position, card_type, prompt, older_variant, options)
join public.parent_lessons l on l.lesson_code = v.lesson_code;

commit;
