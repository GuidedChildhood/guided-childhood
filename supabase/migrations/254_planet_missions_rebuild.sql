-- Planet Friends slice 3: the twelve missions that build the planet.
--
-- Migration 253 made the planet_codes table and seeded nine grown up prompts
-- for the garden flavoured missions. Those nine never reached a child: Justin
-- steered the game towards building on 2 September ("seems to be plant
-- missions still? How is this like Toca Boca?"), so the catalogue in
-- lib/planet/missions.ts is now twelve space and adventure missions, each
-- paying a part for the child's parts box. This replaces the whole block from
-- 9630, so the rows are right whether 253 ran before it or not. The hidden
-- code card is the Comet card (it was the Moonflower card). Free, because the
-- planet is on the child link for every family. Stage by the youngest tier
-- the mission serves. No dashes anywhere.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements only.

delete from public.scripts where sort_order between 9630 and 9641;

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight,
   if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
values
('foundation', 'everyday-routines',
 'They launched a rocket and built it onto their planet',
 'A rocket made from a box or a bottle, a countdown out loud together, arms up for blast off. Your yes put a rocket in their parts box, and they will have put it somewhere on their planet by now.',
 'Where would your rocket fly, if it was real? Who would you take?',
 'That is not a real rocket. Of course it is not. Everything on the planet is built from something they did.',
 'A child who has built the rocket, counted the launch and then placed it themselves owns the whole thing. Nothing was handed over, and the planet only ever shows what the real world put there.',
 'Ask them to show you where the rocket went on their planet, and why there.',
 'It did not really fly. No. Ask what it would need to. Bigger fins, a better countdown, a braver crew.',
 'A week on, ask whether the rocket is still where they put it, or whether they moved it. Both are the point.',
 'You counted down, you launched, and a rocket went in your box. Your planet, your spot.',
 'none', true, 9630),

('foundation', 'everyday-routines',
 'Twenty moon jumps, and a trampoline to show for it',
 'Twenty jumps outside or on a soft spot, as high as they go, with you counting. A trampoline went in their parts box for it, and a Friend dropped on it boings.',
 'Which jump was the highest? Show me the landing.',
 'Was that really twenty? You counted. Doubting it out loud undoes the win.',
 'Jumping is the fastest way to a body that feels alive, and the planet gives it back as a thing to bounce on. The reward is a picture of the effort, not a prize for it.',
 'Do twenty yourself, badly, and let them count.',
 'My legs are tired. Good sign. That is your legs telling you they did something.',
 'Next time they are wound tight after a screen, offer twenty moon jumps before anything else.',
 'Twenty jumps, one trampoline. Drop a Friend on it and see.',
 'none', true, 9631),

('foundation', 'everyday-routines',
 'An explorer walk, and a rover for the planet',
 'A walk somewhere they had never been, one thing worth remembering, brought home or drawn. A moon rover went in their parts box.',
 'What would you name that place? What was the best thing about it?',
 'It was only the next street. New is new. The size of the trip is not the point.',
 'Naming a place makes it theirs, and a child who has named a real place has a story to tell that no screen gave them. The rover is the story on the planet.',
 'Put the thing they brought home somewhere you will both see it at breakfast.',
 'It was boring. Ask what they would change to make it better, and go there next time.',
 'Next walk, let them choose the direction at every corner.',
 'You explored somewhere new. A rover for that. Vroom.',
 'none', true, 9632),

('foundation', 'everyday-routines',
 'Five minutes of stretching, with the ring to prove it',
 'They stretched for five real minutes while the ring filled, and a swing went in their parts box. The timer is the server''s, not the phone''s, so five minutes was five minutes.',
 'Five minutes is longer than it sounds, isn''t it? Which bit did you feel most?',
 'Was that really five minutes? The clock already said yes.',
 'A child who feels time pass in their body is building the sense that screens are so good at switching off. Naming the feeling makes it a thing they own.',
 'Do the next one with them. A grown up reaching for the sky beside them turns a timer into a game.',
 'My legs hurt. That is your legs telling you they did something. They will thank you tomorrow.',
 'Ask, a few days on, whether they put the swing on the planet, and whether a Friend has had a go.',
 'Five minutes, a full ring, a swing for your planet. Your legs did that.',
 'none', true, 9633),

('foundation', 'everyday-routines',
 'Helping hands, and a robot helper',
 'One job at home nobody asked them to do, done properly. A robot helper went in their parts box.',
 'What made you pick that one? Did anyone notice?',
 'You missed a bit. Say thank you first. Say the bit later, or never.',
 'A job nobody asked for is the first time a child helps because they chose to, and being noticed for it is what makes them choose it again. The robot is the noticing, kept.',
 'Notice out loud, at tea, in front of somebody else.',
 'Nobody noticed. You did. Say so, and ask what they would like noticed next.',
 'A week on, see whether a second unasked job turns up. Do not ask for it.',
 'You did a job nobody asked for. A robot helper for that. Beep boop.',
 'none', true, 9634),

('builder', 'everyday-routines',
 'The star hunt, and a telescope for the planet',
 'After dark, at a window or outside with you, they counted the real stars. A telescope went in their parts box.',
 'How many did you find? Which one was the brightest?',
 'You cannot see any from here. Then find the one you can. One counts.',
 'Looking up is the oldest offline activity there is, and a child who has counted real stars has a reason to look up again. The telescope on the planet is a promise to.',
 'Look up together again tomorrow, for one minute, and see if the count changed.',
 'It is too cold. Two minutes. Coats on. The stars are worth two minutes.',
 'The next clear night, ask if they want to beat the count.',
 'You counted real stars in the real sky. A telescope for that. Point it anywhere.',
 'none', true, 9635),

('builder', 'everyday-routines',
 'Ten minutes with a real book, and a story tent',
 'They read a paper book for ten minutes while the ring filled, and a story tent went in their parts box. Paper on purpose: no notifications live inside a book.',
 'What happened in the bit you just read? Tell me like I have not read it.',
 'Only ten minutes? Ten real minutes is the mission. Longer comes later, by itself.',
 'Retelling is how reading turns into thinking. And a child who is asked about their book, not their screen, learns which one you find interesting.',
 'Read your own book in the same room for the same ten minutes. Modelling beats monitoring every time.',
 'I would rather watch it. Say fine, after the ring. The book first, the film as the treat.',
 'Ask what the character did next. If they do not know yet, that is the next mission.',
 'Ten minutes, one story tent. The story is still waiting where you left it.',
 'none', true, 9636),

('builder', 'everyday-routines',
 'The counting hunt',
 'They found a spider, outside or in a book, counted its legs and tapped the number on their planet. A pale moon went in their parts box for it. The answer was checked by the server, so guessing does not work and there was no telling off for a wrong tap.',
 'Where did you find it? Was it scary or interesting, or both?',
 'You are not scared of spiders, are you? Feelings about spiders are allowed. Curiosity grows out of them.',
 'A hunt with one right answer that has to be found in the real world is the opposite of a feed. Nothing was handed to them, and the moon means more for it.',
 'Ask what else has eight legs, and what has six. Let them look it up in a book if there is one.',
 'I got it wrong twice. So did everyone. The planet did not count. It just waited for you to look again.',
 'Next spider you both see, let them count out loud.',
 'Eight legs, one moon. You looked properly. That is the whole trick.',
 'none', true, 9637),

('builder', 'screen-time',
 'A screens off dinner, the whole family',
 'Every screen went on the charger, grown ups included, and the family ate together and told each other one good thing about today. A campfire went in their parts box. You pressed yes, so you were there.',
 'Which good thing did you pick? Mine was this.',
 'Reaching for your own phone while asking. They will notice before you do.',
 'The rule that binds grown ups too is the only rule a child believes. One meal with no screens is small. One meal where a parent went first is not.',
 'Same again tomorrow, no mission needed. The campfire is already theirs.',
 'But you always have yours. Own it. You are right, and tonight mine is on the charger too. Catch me if I slip.',
 'A week on, ask if they would like the screens off dinner to be a Tuesday thing. Let them name the day.',
 'Everyone''s screen went to bed, even the grown ups''. A campfire for that.',
 'none', true, 9638),

('builder', 'school-and-ai',
 'They passed a lesson and a satellite dish arrived',
 'They passed a lesson you sent them on their own link, and a satellite dish went in their parts box. Online learning, made visible in the toy.',
 'Teach me the one thing you remember from it. Pretend I know nothing.',
 'What score did you get? The lesson passed. What stuck is the interesting part.',
 'Teaching it back is the fastest test of whether a lesson landed, and it puts the child in charge of the knowledge for once.',
 'Send the next lesson from your board while they can see you doing it. Then leave it alone.',
 'I forgot. Give them one word from the lesson title and wait. It usually comes back.',
 'Ask them to spot the lesson''s idea somewhere real this week: an advert, a game, a message.',
 'A lesson passed, a dish pointed at space. Now teach it to someone bigger than you.',
 'none', true, 9639),

('builder', 'screen-time',
 'Phone to bed, unasked, and a night light for it',
 'At bedtime they put their device on the charger before anyone asked, and told you. A night light went in their parts box, and it glows when the planet goes dark.',
 'Thank you. I noticed. What made tonight the night?',
 'About time. The first unasked time is the one that decides whether there is a second.',
 'The habit the whole product is built around, done by the child without a prompt, is worth more than a hundred reminders. Thanking it, plainly, is what makes it stick.',
 'Put yours on the charger next to theirs, and say so.',
 'I forgot last night. Last night is gone. Tonight counts.',
 'A week on, count the unasked nights together. No chart, just the number.',
 'You put your device to bed before anyone asked. A night light for that. It glows.',
 'none', true, 9640),

('builder', 'everyday-routines',
 'The Comet card: hide it well',
 'You printed the Comet card, hid it, and they hunted for it, then tapped the pictures or letters from it on their planet. A comet went in their parts box for their sky. The code was made for your child only, so the card is theirs.',
 'How did you work out where it was? What was your first guess?',
 'Giving the hiding place away when they ask. A hint is fine. The finding is the mission.',
 'A real world search with a real answer at the end is a small adventure a screen cannot give. The planet only asked for the code; the hunt is the reward.',
 'Let them hide the card for you. Then they tap nothing, because you are the one who has to find it.',
 'I cannot find it anywhere. Warmer, colder. The old game works because it keeps them in charge of the looking.',
 'Ask, a few days later, where the comet went in their sky.',
 'You found the card, you tapped the code, and a comet is yours. Hang it anywhere.',
 'none', true, 9641);
