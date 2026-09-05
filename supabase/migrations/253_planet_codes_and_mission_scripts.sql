-- Planet Friends slice 2b: the hidden code cards and the grown up prompts.
--
-- Two things, one migration, both from plans/planet-friends-architecture.md
-- (sections 3.2 and 5.2) and plans/week-of-2026-08-31-planet-friends-slice-2b-plan.md.
--
-- THE CODE CARDS. The Moonflower card is a mission with a hidden card: the
-- grown up prints it, hides it, the child hunts, and taps what is on it on
-- their planet. The code is made by the server for one child, at 6 and 7 as
-- three pictures tapped in order and from 8 as a four letter word, stored
-- here and checked here. It never travels to the child's device: the planet
-- learns only that a card exists and what shape its pad should be. A lost
-- card prints again with the same code. Cascades from children, so an erased
-- family takes its cards with it. RLS scopes parents to their own children
-- through children.parent_id; the child routes use the service role.
--
-- THE GROWN UP PROMPTS. Every mission carries one thing to talk about, and
-- the design says it is a scripts row so it updates without a deploy. Nine
-- rows in a fresh block from 9630, clear of the 9624 high water mark, one per
-- mission in lib/planet/missions.ts (scriptOrder). Free, because the planet
-- is on the child link for every family. Stage by the youngest tier the
-- mission serves. No dashes anywhere.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements only.

-- ── The code cards ──────────────────────────────────────────────────────────

create table if not exists public.planet_codes (
  child_id uuid not null references public.children(id) on delete cascade,
  mission_key text not null,
  code text[] not null,
  mode text not null check (mode in ('pictures', 'letters')),
  made_at timestamptz not null default now(),
  printed_at timestamptz,
  primary key (child_id, mission_key)
);

alter table public.planet_codes enable row level security;

drop policy if exists "Own planet codes" on public.planet_codes;
create policy "Own planet codes" on public.planet_codes
  for all
  using (exists (select 1 from public.children c where c.id = planet_codes.child_id and c.parent_id = auth.uid()))
  with check (exists (select 1 from public.children c where c.id = planet_codes.child_id and c.parent_id = auth.uid()));

-- ── The grown up prompts ────────────────────────────────────────────────────

delete from public.scripts where sort_order between 9630 and 9638;

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight,
   if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
values
('foundation', 'everyday-routines',
 'They planted a real seed for their planet',
 'Your child planted a seed with you for a Planet Friends mission, and their planet grew a little garden dome for it. The seed is real, the dome is pretend, and the gap between the two is the whole lesson.',
 'The dome landed the moment we pressed yes. The seed is going to take a lot longer. What do you think it needs first: water, light or time?',
 'See, that was easy. The seed was the easy bit. Waiting is the mission.',
 'A screen answers instantly and a seed does not. Naming that difference out loud, in their words, is how a child starts to feel the shape of slow things without being lectured about screens.',
 'Put the pot where they will see it every morning. Tomorrow, ask whether anything changed. Nothing will have, and that is the point.',
 'It is boring. Agree with them. Yes, seeds are boring for about a week. Then one morning they are not. Shall we guess which day?',
 'In a week, ask what the seed did while the planet was doing its growing. Same idea, two speeds.',
 'You planted something real. Your planet got a dome. Now watch which one takes longer.',
 'none', true, 9630),

('foundation', 'everyday-routines',
 'They found three leaves for a flag',
 'A walk for three different leaves, done together, and a leaf flag went up on their planet. Ten minutes outside, no screen, a small win they can hold.',
 'Which leaf was hardest to find? What made it hard?',
 'Right, done, back inside. The walk was the mission, not the flag.',
 'Asking about the hunt, not the prize, tells a child the real world was the point. It also gives them a story to tell, and children who can tell a story about being outside ask to go again.',
 'Put the three leaves on the table at tea. Ask everyone to guess which tree each came from. Wrong guesses are fine.',
 'Can I do the next mission now? Say the board fills up again tomorrow, and the flag is already flying. One at a time is how planets grow.',
 'Next time you walk anywhere, ask if they can spot one of the three again.',
 'Three leaves, one flag. The walk was the mission. Well found.',
 'none', true, 9631),

('foundation', 'everyday-routines',
 'Five minutes of stretching, with the ring to prove it',
 'They stretched for five real minutes while the ring on their planet filled, and a ring went round their planet. The timer is the server''s, not the phone''s, so five minutes was five minutes.',
 'Five minutes is longer than it sounds, isn''t it? Which bit did you feel most?',
 'Was that really five minutes? The clock already said yes. Doubting it out loud undoes the win.',
 'A child who feels time pass in their body is building the sense that screens are so good at switching off. Naming the feeling makes it a thing they own.',
 'Do the next one with them. A grown up reaching for the sky beside them turns a timer into a game.',
 'My legs hurt. Good sign. That is your legs telling you they did something. They will thank you tomorrow.',
 'Ask, a few days on, whether the ring is still there. It is. Things you earn on the planet stay.',
 'Five minutes, a full ring, a whole ring round your planet. Your legs did that.',
 'none', true, 9632),

('foundation', 'everyday-routines',
 'They watered a real plant',
 'A real plant in your house got a drink, not a flood, and a crater on their planet filled with water. The mission is noticing that living things need looking after.',
 'How can you tell when a plant is thirsty? What does it look like?',
 'Careful, you will drown it. If it was too much, mop up together and ask what a drink looks like next time.',
 'Looking after something that cannot ask for help is the same muscle as looking after yourself later. Plants are the safest place to practise it.',
 'Give them the plant. Their plant now. Ask them to check it every morning and report back.',
 'Plants are boring. Ask them what happens if nobody waters it for a month. Then ask what happens to a person nobody looks after.',
 'A fortnight on, ask how their plant is doing. If it wilted, that is a lesson too, and a kind one.',
 'A drink, not a flood. Your plant noticed. So did your planet.',
 'none', true, 9633),

('builder', 'everyday-routines',
 'Ten minutes with a real book',
 'They read a paper book for ten minutes while the ring filled, and a story lamp lit on their planet. Paper on purpose: no notifications live inside a book.',
 'What happened in the bit you just read? Tell me like I have not read it.',
 'Only ten minutes? Ten real minutes is the mission. Longer comes later, by itself.',
 'Retelling is how reading turns into thinking. And a child who is asked about their book, not their screen, learns which one you find interesting.',
 'Read your own book in the same room for the same ten minutes. Modelling beats monitoring every time.',
 'I would rather watch it. Say fine, after the ring. The book first, the film as the treat, and the lamp is already lit.',
 'Ask what the character did next. If they do not know yet, that is the next mission.',
 'Ten minutes, one lamp. The story is still waiting where you left it.',
 'none', true, 9634),

('builder', 'everyday-routines',
 'The counting hunt',
 'They found a spider, outside or in a book, counted its legs and tapped the number on their planet. A pale moon rose for it. The answer was checked by the server, so guessing does not work and there was no telling off for a wrong tap.',
 'Where did you find it? Was it scary or interesting, or both?',
 'You are not scared of spiders, are you? Feelings about spiders are allowed. Curiosity grows out of them.',
 'A hunt with one right answer that has to be found in the real world is the opposite of a feed. Nothing was handed to them, and the moon means more for it.',
 'Ask what else has eight legs, and what has six. Let them look it up in a book if there is one.',
 'I got it wrong twice. So did everyone. The planet did not count. It just waited for you to look again.',
 'Next spider you both see, let them count out loud.',
 'Eight legs, one moon. You looked properly. That is the whole trick.',
 'none', true, 9635),

('builder', 'screen-time',
 'A screens off dinner, the whole family',
 'Every screen went on the charger, grown ups included, and the family ate together and told each other one good thing about today. A picnic blanket landed on their planet. You pressed yes, so you were there.',
 'Which good thing did you pick? Mine was this.',
 'Reaching for your own phone while asking. They will notice before you do.',
 'The rule that binds grown ups too is the only rule a child believes. One meal with no screens is small. One meal where a parent went first is not.',
 'Same again tomorrow, no mission needed. The blanket is already on the planet.',
 'But you always have yours. Own it. You are right, and tonight mine is on the charger too. Catch me if I slip.',
 'A week on, ask if they would like the screens off dinner to be a Tuesday thing. Let them name the day.',
 'Everyone''s screen went to bed, even the grown ups''. A blanket under the stars for that.',
 'none', true, 9636),

('builder', 'school-and-ai',
 'They passed a lesson and a star appeared',
 'They passed a lesson you sent them on their own link, and a bright new star appeared on their planet. Online learning, made visible in the toy.',
 'Teach me the one thing you remember from it. Pretend I know nothing.',
 'What score did you get? The lesson passed. What stuck is the interesting part.',
 'Teaching it back is the fastest test of whether a lesson landed, and it puts the child in charge of the knowledge for once.',
 'Send the next lesson from your board while they can see you doing it. Then leave it alone.',
 'I forgot. Give them one word from the lesson title and wait. It usually comes back.',
 'Ask them to spot the lesson''s idea somewhere real this week: an advert, a game, a message.',
 'A lesson passed, a star lit. Now teach it to someone bigger than you.',
 'none', true, 9637),

('builder', 'everyday-routines',
 'The Moonflower card: hide it well',
 'You printed the Moonflower card, hid it, and they hunted for it, then tapped the pictures or letters from it on their planet. A moonflower opened for it, and it glows at night. The code was made for your child only, so the card is theirs.',
 'How did you work out where it was? What was your first guess?',
 'Giving the hiding place away when they ask. A hint is fine. The finding is the mission.',
 'A real world search with a real answer at the end is a small adventure a screen cannot give. The planet only asked for the code; the hunt is the reward.',
 'Let them hide the card for you. Then they tap nothing, because you are the one who has to find it.',
 'I cannot find it anywhere. Warmer, colder. The old game works because it keeps them in charge of the looking.',
 'Ask, a few days later, whether the moonflower opened at bedtime. It does, every night.',
 'You found the card, you tapped the code, and a moonflower opened on your planet. It glows when it is dark.',
 'none', true, 9638);
