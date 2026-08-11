-- Guided Childhood — Migration 186
-- Five free scripts, for the five holes a free family actually falls down.
--
-- Justin, 11 August 2026, having asked why the recommender kept offering him a
-- script about a child coming out: "but we have over 100 scripts?"
--
-- ── The count that matters is not 312 ────────────────────────────────────────
--
-- The library is 312 scripts. The recommender narrows twice before it ranks
-- anything: to the child's stage, then to free if the parent has not paid. Read
-- as free scripts per category per stage, the library looks like this, and the
-- zeros are the story:
--
--                     foundation  builder  explorer  shaper  independent
--   screen time            6         2         2       0         0
--   gaming                 1         0         0       0         1
--   everyday routines      9         1         0       0         1
--   school and AI          2         2         0       0         0
--   staying safe           2         2         1       0         1
--   mood and confidence    4         5         4       3         1
--
-- Read the bottom row against the rest. Mood and confidence is the ONLY
-- category with free scripts at every stage, so on the free plan it wins by
-- default at the older stages, and it is also where the heaviest scripts in the
-- library live. That is the mechanism behind the screenshot: a free family with
-- a teenager was being funnelled into mood scripts because there was nothing
-- else free to give them, and three of the five free shaper scripts were self
-- harm, a low mood that will not lift, and a child coming out.
--
-- Migration 185 stopped those three being offered unprompted. This one gives
-- the recommender something honest to offer instead. Five scripts, chosen to
-- fill the five zeros where a family's commonest signals actually land: devices
-- map to screen time and gaming, and so do most concerns.
--
--   builder      gaming        8 to 10
--   explorer     gaming        11 to 12
--   shaper       screen time   13 to 15
--   shaper       gaming        13 to 15
--   independent  screen time   16 plus
--
-- ── The evidence they are built on ───────────────────────────────────────────
--
-- Justin: "make sure all Dr Becky level with researchers we follow, and super
-- intuitive, and fits pattern and beliefs research." So the canon in
-- plans/social-media-literacy-curriculum-map.md, used at the strength it
-- actually supports and no further:
--
--   Candice Odgers    preparation over fear. Effects are small on average and
--                     causation is unproven, so prepare and support rather than
--                     ban. Never overstated into "screens are harmless".
--   Andrew Przybylski the Goldilocks amount. Moderate use beats both zero and
--                     heavy, so the target is a sensible middle rather than
--                     abstinence. This is why not one of these five ends in a
--                     confiscation.
--   Amy Orben         small effects with real windows of sensitivity, roughly
--                     girls 11 to 13 and boys 14 to 15. Sensitivity is
--                     developmental, which is why these are staged.
--   Catherine Knibbs  do not take the device away when a child tells you
--                     something. It teaches them that telling makes things
--                     worse.
--   Deci and Ryan     autonomy, competence and relatedness. Games are engineered
--                     to deliver all three, which is why "it is just a game" is
--                     the least useful sentence a parent can say.
--   Dr Becky Kennedy  a good kid having a hard time, and the most generous
--                     interpretation. Connection before correction. Two things
--                     are true at once.
--   Ofcom             cited only where a number is genuinely theirs, and the
--                     scripts lean on the mechanism rather than the statistic,
--                     because a parent at half past six needs the reason, not
--                     the citation.
--
-- No stat is quoted that these scripts do not need. The reasoning is in
-- WHY_IT_WORKS in plain words, which is the house style and also the safer
-- choice: a number ages, a mechanism does not.
--
-- Sort orders 9620 to 9624, clear of the 9615 high water mark set by 180.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements. Dollar
-- quoted bodies so an apostrophe never has to be doubled. Idempotent BY TITLE,
-- because the scripts table has no unique constraint and a re run of a seed has
-- silently doubled this library once already.

-- ── 1. builder, gaming, 8 to 10 ─────────────────────────────────────────────
--
-- The most common gaming row in the house at this age is not addiction, it is
-- the stop. A child mid match cannot leave without letting four other children
-- down, and the parent reads the refusal as defiance. Both are right, which is
-- the whole script.

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'builder', 'gaming',
  'They cannot stop in the middle of a match',
  $st$You have said it is time to come off and they have gone from fine to furious in about four seconds. They are mid game, other children are relying on them, and leaving now costs them something real.$st$,
  $sy$I know you cannot just walk out of a match, that is not me not listening. So here is what we are going to do from now on. I will give you the warning at the end, not in the middle. You tell me how long this one has left, and I will hold you to it.$sy$,
  $nt$It is a game. Turn it off now or it goes in the bin.$nt$,
  $wy$The refusal is usually not about you. In a team game, leaving mid match takes the other players down with you, and at eight to ten the fear of being the one who let everyone down is enormous and completely real. Punishing that teaches them you do not understand the thing they care about, and the next time it happens they will simply hide the console.

Asking how long is left does three things at once. It treats them as the person who knows, which is true. It gives them something to be competent at, which is most of why the game has them in the first place. And it turns a demand into an agreement they had a hand in, which is the difference between compliance and cooperation.

The reason this holds up is that the target is a sensible middle rather than zero. The research on this is consistent that moderate play beats both extremes, so a house rule that never asks a child to abandon a team is not a soft rule, it is a workable one, and a workable rule gets followed for years.$wy$,
  $tn$Tonight, ask them to show you where the match timer is on their screen. Once you can both see the same number, the argument stops being about trust.$tn$,
  $ip$If they say every match runs over, agree a limit on how many more, out loud, before they start. Two is a number. Just one more is not.$ip$,
  $cb$In a week, ask whether the end of match warning is working. If they are the one telling you the timer without being asked, it is working.$cb$,
  $fy$Your grown up is not trying to make you let your team down. Show them where the timer is, and tell them how long is left. If you say it, they will hold you to it, which is a lot better than being told to stop right now.$fy$,
  'none', true, 9620
where not exists (select 1 from public.scripts where title = 'They cannot stop in the middle of a match');

-- ── 2. explorer, gaming, 11 to 12 ───────────────────────────────────────────
--
-- The age the spending starts. Skins, battle passes, loot boxes, and a child who
-- has genuinely not understood that the money was real.

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'explorer', 'gaming',
  'They have spent real money on the game',
  $st$Money has gone out on skins, coins, a battle pass or a loot box. It might be a few pounds or it might be a lot, and it may have happened over weeks without either of you noticing.$st$,
  $sy$I am not cross, and I want to understand it before we sort it. Show me what you bought and what it does. Then show me what it cost, because I think the game made that quite hard to see, and I want to know whether you knew.$sy$,
  $nt$That is my money you have stolen. You are never playing this again.$nt$,
  $wy$Start with what it does rather than what it cost, and you will find out whether this was a decision or a design. Most of the time it is design. The prices are in a currency the game invented, the amounts never divide neatly into what you buy, and the offer arrives at the moment you have just lost. A child who cannot tell you the real price in pounds did not make an informed choice, and treating them as a thief for it teaches them to hide the next one.

The word stolen is the one to leave out even when it is technically fair, because it turns a solvable problem into a verdict about who they are. They are a child who got caught by something built by adults to catch them.

There is a version of this that helps rather than punishes: make them the one who can see the machinery. A child who can explain to you why the offer appeared right after they lost is a child who is much harder to sell to at fifteen, and that is worth more than the money.

Paying it back matters too, in a way they can actually manage. The point is that the money was real, not that they are in debt to you.$wy$,
  $tn$Tonight, turn off in app purchases on the device together, and put a password on the store that they do not have. Then work out one repayment they can genuinely make.$tn$,
  $ip$If they say everyone buys skins, that is probably true and it is not the argument. Ask what the last one actually cost in pounds. Most children do not know, and the not knowing is the point.$ip$,
  $cb$Check the store settings again after the next big game update. Updates reset more settings than anyone expects.$cb$,
  $fy$Games are built by people whose job is to make you buy things, and they are extremely good at it. That is why the price is in coins and not pounds. Working out what something really cost, before you buy it, is a skill that will save you a fortune later.$fy$,
  'none', true, 9621
where not exists (select 1 from public.scripts where title = 'They have spent real money on the game');

-- ── 3. shaper, screen time, 13 to 15 ────────────────────────────────────────
--
-- The single most common evening in a house with a teenager, and until now
-- there was not one free screen time script at this stage.

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'shaper', 'screen-time',
  'The phone is in their room all night',
  $st$Your teenager takes their phone to bed. They are tired in the mornings, hard to wake, and flat by the afternoon, and every conversation about it so far has ended in a row.$st$,
  $sy$I want to talk about sleep, not about your phone, and I know those sound like the same conversation. You have been shattered all week and I do not think that is you being lazy. Can we try something for a fortnight and then decide together whether it helped? I am not making this permanent tonight.$sy$,
  $nt$Phones out of bedrooms from now on. End of discussion.$nt$,
  $wy$Lead with sleep and you are on their side. Lead with the phone and you are the opposition, and at this age the opposition loses.

The permanent rule announced at the door is the version that fails, because it gives a teenager nothing to do except resist it. A fortnight with a review at the end gives them something they badly need at this age, which is a say. It also happens to be honest: you genuinely do not know yet whether it will help this particular child, and saying so is not weakness.

Two things worth knowing while you have the conversation. The first is that at thirteen to fifteen the pull is very often social rather than the screen itself. Being the one who goes quiet at ten has a cost among their friends, and a rule that ignores that will be broken quietly rather than argued with. Say out loud that they can tell people, and help them find the words.

The second is that the evidence here does not support fear. Average effects are small and causation is genuinely unsettled, which is exactly why the right move is preparing and supporting rather than banning. What is not in doubt is that a phone in the bed shortens sleep, and short sleep does the rest. Keep the claim to the bit that is solid and you will not be arguing about a headline neither of you has read.$wy$,
  $tn$Tonight, put a charger somewhere that is not their bedroom and use it yourself first. A rule that applies to you is a different rule.$tn$,
  $ip$If they say they use it as an alarm, that is a fair point and it has a five pound answer. Buy the alarm clock rather than winning the argument.$ip$,
  $cb$At the end of the fortnight, actually hold the review you promised. Ask them whether mornings felt different. If you skip it, the next thing you propose will not be believed.$cb$,
  $fy$Nobody is trying to cut you off from your friends. The thing being asked is that your phone sleeps somewhere else, because a phone next to your bed takes about an hour off your night and you feel it the next day. Tell your friends you go quiet after ten. Most of them will be relieved someone said it first.$fy$,
  'none', true, 9622
where not exists (select 1 from public.scripts where title = 'The phone is in their room all night');

-- ── 4. shaper, gaming, 13 to 15 ─────────────────────────────────────────────
--
-- The row that is really about friendship, which is the part most parents miss
-- and the part that makes the confiscation backfire.

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'shaper', 'gaming',
  'Gaming has taken over everything else',
  $st$They come in, they go straight on, and they are on until you make them stop. Things they used to do have quietly fallen away, and you are starting to wonder whether this is a problem or just what fourteen looks like now.$st$,
  $sy$I am not going to tell you to play less tonight. I want to ask you something else. If you did not play for a week, who would you actually miss? Not what, who. Because I think a lot of what is happening in there is your mates, and if I am right then me taking it off you would just make you lonely.$sy$,
  $nt$You are addicted to that thing. Look at the state of you.$nt$,
  $wy$Who rather than what is the question that changes this conversation, because for most teenagers the game is where their friends are. Take the console away and you have not removed a habit, you have removed the friendships, and a lonely fourteen year old is a worse problem than a busy one.

The word addicted is worth avoiding even when you feel it. It makes the child the fault. Games are engineered by very good designers to deliver three things that adolescents need badly: something to be good at, some control over their own time, and people who want them there. That is not weakness, that is the design working. Naming the design out loud is far more useful than naming the child.

What to watch instead of the hours: whether they can stop when something they want more comes along, whether they are sleeping, and whether anything they used to enjoy has gone completely. Hours alone tell you very little, and a moderate amount of play is not the thing to be frightened of. A child who has stopped doing everything else is.

If two or three of those are going wrong, that is worth a proper conversation and possibly your GP. If none of them are, you may be looking at a teenager with a hobby you do not share, which has been happening to parents for a very long time.$wy$,
  $tn$Tonight, ask them to teach you one thing about the game and mean it. Ten minutes of genuine interest buys you more influence here than a month of rules.$tn$,
  $ip$If they say you do not understand, agree with them, because you probably do not, and then ask them to fix that. Being asked to explain something you are good at is very hard to stay angry through.$ip$,
  $cb$In a month, ask yourself the three questions again: can they stop, are they sleeping, is anything they loved gone. Compare it with today rather than with your memory of them at ten.$cb$,
  $fy$Your grown up is not trying to take your friends away. If most of the people you play with are people you actually know, say so, because that changes the conversation completely. And if you have noticed yourself that something you used to love has dropped off, that is worth saying out loud too.$fy$,
  'none', true, 9623
where not exists (select 1 from public.scripts where title = 'Gaming has taken over everything else');

-- ── 5. independent, screen time, 16 plus ────────────────────────────────────
--
-- The stage where rules stop working and most parenting advice runs out. The
-- job here is handing it over on purpose rather than losing it by attrition.

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'independent', 'screen-time',
  'They are sixteen and you have run out of rules',
  $st$They are old enough that screen time rules have stopped meaning anything, and you can see the phone costing them sleep, coursework or mood. You have no lever left and you are not sure you should have one.$st$,
  $sy$You are sixteen, so this is yours now and I am not going to pretend otherwise. That means I am asking rather than telling. Is your phone working for you at the moment, honestly? Because from out here it looks like it is winning, and if you think so too I will help with whatever you want to try. If you think I am wrong, tell me and I will drop it.$sy$,
  $nt$While you live under my roof you will do what I say.$nt$,
  $wy$At sixteen the lever really has gone, and pretending otherwise costs you the only thing you have left, which is being someone they will talk to. Saying it out loud, that this is theirs now, is not surrender. It is the thing that makes the next sentence land.

The offer to drop it is not a bluff and has to be real. A young person who knows you will actually stop is a young person who can afford to think about the question rather than defend against it. If you press on after they say no, you have taught them the question was never genuine, and you will not get another one.

There is a version of this that works better than any rule ever did, which is doing it alongside them. Someone in their twenties trying to get their own phone use down is not a lecture, it is company. Compare notes. Let them see you fail at it.

Worth holding onto: the goal is not zero. A sensible middle beats both extremes, and a sixteen year old who takes their phone off themselves for two hours to revise has learned something that a confiscated phone could never have taught them, because they did it and it was theirs to do.$wy$,
  $tn$Tonight, ask the question and then genuinely let it go if the answer is no. That restraint is the whole script.$tn$,
  $ip$If they say it is fine, believe them out loud and leave the door open. Something like: fair enough, you know where I am if it changes. That sentence is what they come back to in a month.$ip$,
  $cb$Do not chase it. Wait until they raise it, or until something changes, like exams or a bad week. Then ask once.$cb$,
  $fy$At sixteen this is genuinely your call, and that is not a trick. Worth asking yourself honestly though: is your phone working for you, or is it winning? Nobody can answer that for you, and nobody can fix it for you either. Two hours you took off yourself are worth more than two hours somebody took off you.$fy$,
  'none', true, 9624
where not exists (select 1 from public.scripts where title = 'They are sixteen and you have run out of rules');
