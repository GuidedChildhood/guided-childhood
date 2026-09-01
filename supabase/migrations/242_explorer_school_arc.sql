-- The school arc, Explorer. (Lesson excellence plan, steps 4 to 6.)
--
-- Same shape and reasons as migrations 240 and 241: keywords after the
-- objective, questions to four per deck, recap, try it, character on the
-- title slide. Register is ages 11 to 13, spoken straight to the reader.
-- One deck here ("How the algorithm decides what your child sees") is
-- parent facing and carried a single question, so it gains three. Additive
-- only, guarded on keywords, reapply is a no op. Uses
-- public.gc_add_school_arc from migration 240.

-- ── How the algorithm decides what your child sees (parent facing) ──────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"signal","meaning":"Anything your child does that the app measures: a pause, a replay, a finished video."},
  {"word":"sensitivity window","meaning":"Ages 11 to 13, when the feed's pull lands hardest."}],
  "script":"Two terms carry this lesson. Signal is the one to keep using at home: it turns the mysterious algorithm into a machine your family can talk about."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Your child says the app just shows me what I like. What is more accurate?","options":[
  {"text":"They are right, that is exactly what it does","correct":false,"feedback":"Close, and the gap matters: it shows what makes them STAY. Upsetting, enraging and worrying all hold attention too."},
  {"text":"It shows what makes them stay, which is not always what they like or need","correct":true,"feedback":"That is the correction worth making at the dinner table. Staying is the metric. Liking is incidental."},
  {"text":"The feed is random, nobody controls it","correct":false,"feedback":"Nothing in a feed is random. Every item is a guess about what holds this particular child one minute longer."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Why is watching an upsetting video to the end such a strong signal?","options":[
  {"text":"It is not. The app knows upsetting from fun","correct":false,"feedback":"The app reads no feelings at all. It reads watch time, and a video watched to the end is a loud yes, whatever it did to them."},
  {"text":"The machine reads finishing as wanting more of the same","correct":true,"feedback":"Exactly, and that is how one hard video becomes a feed full of them. Finishing is the strongest yes a viewer can send."},
  {"text":"Because upsetting videos are longer","correct":false,"feedback":"Length is not the issue. Completion is. A finished video of any length teaches the feed to bring more like it."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What is the most useful thing a parent can do with all of this?","options":[
  {"text":"Ban the apps until 16","correct":false,"feedback":"The pull returns the day the ban ends, with no judgement built. The machine needs to be understood, not just avoided."},
  {"text":"Talk about the feed as a machine together, so your child sees the test being run on them","correct":true,"feedback":"A child who can see the test stops being only its subject. That seeing is the protection, and it survives every new app."},
  {"text":"Nothing. Algorithms cannot be understood","correct":false,"feedback":"This one can, at the level that matters: it reads signals and optimises staying. That much fits in one chat on the sofa."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Every scroll is a test: what makes them stay.",
  "Ages 11 to 13 are the highest sensitivity window.",
  "A child who can see the machine holds the controls."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Watch the machine together","body":"Sit beside them for ten minutes of their feed this week and ask one question, kindly: why do you think it showed you that? The question does the teaching.",
  "script":"Curiosity beside them beats surveillance over them. One shared session of naming signals changes how they scroll alone."}
] $ex$::jsonb, 'football')
where stage_id = 'explorer' and status = 'live' and title = 'How the algorithm decides what your child sees'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Group chats without the drama ───────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the pings","meaning":"The pull of two hundred messages about nothing."},
  {"word":"the three levers","meaning":"Mute, leave, or one kind line."}],
  "script":"Say each phrase and let them say it back. The levers exist so nobody is ever stuck between suffering a chat and causing a drama."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does a group chat reward fast replies?","options":[
  {"text":"Fast replies are funnier","correct":false,"feedback":"Speed is not wit. The chat moves on fast, so speed keeps you in the joke, and that training is the whole trap."},
  {"text":"Speed keeps you in the joke, so the chat trains you to stay","correct":true,"feedback":"That is the mechanism. Once you can see the training, you can decide how much of your evening it deserves."},
  {"text":"It does not. Slow replies are fine for everyone","correct":false,"feedback":"Slow replies ARE fine, but the chat does not feel that way, and that pressure is worth naming out loud."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Leaving a chat that makes you miserable is what?","options":[
  {"text":"Rude. You have to stay once added","correct":false,"feedback":"Nobody owes a chat their evenings. Misery is a good enough reason, and one kind line smooths the exit."},
  {"text":"Allowed, and smoothest with one kind line first","correct":true,"feedback":"Exactly. Off for a bit, see you at school covers it. Your calm is worth more than their notification."},
  {"text":"Only possible with a really good excuse","correct":false,"feedback":"No excuse needed. The kind line is a courtesy, not a permission slip."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "A group chat should not run your evening.",
  "Three levers: mute it, leave it, or say one kind line.",
  "Muting is invisible, and your calm is not rude."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Mute one tonight","body":"Pick the noisiest chat and mute it for 24 hours. Tomorrow, ask what you actually missed. The honest answer is usually: nothing that could not wait.",
  "script":"One day of evidence beats any amount of advice. The chat surviving without them is the lesson."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'explorer' and status = 'live' and title = 'Group chats without the drama'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Filters are not faces ───────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the pipeline","meaning":"Lighting, angles, filters and edits between a real face and a posted one."},
  {"word":"polish check","meaning":"Naming three edits before you let yourself compare."}],
  "script":"Say each phrase and let them say it back. The pipeline is the fact, the polish check is the habit built on it."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does your own mirror feel worse after twenty minutes of feed faces?","options":[
  {"text":"Because your face changed in twenty minutes","correct":false,"feedback":"Your face is the same one that was fine this morning. What changed is what you just compared it against."},
  {"text":"You compared a real face with polished ones. The game was rigged","correct":true,"feedback":"That is it exactly. Mirror versus pipeline is not a fair fight, and losing a rigged game says nothing about you."},
  {"text":"Because mirrors are less accurate than cameras","correct":false,"feedback":"The mirror is the honest one in this story. The feed faces are the ones that went through the pipeline."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"The person who posted the polished photo looks in their own mirror. What is true?","options":[
  {"text":"They see the polished version. That is their real face","correct":false,"feedback":"The pipeline does not follow anyone into their bathroom. Their mirror shows the same kind of real face yours shows you."},
  {"text":"Their mirror shows a real face too, just like yours does","correct":true,"feedback":"Worth sitting with. Everyone on the feed is a real face competing against everyone else's pipeline, including their own."},
  {"text":"They do not have mirrors, only cameras","correct":false,"feedback":"They have mirrors, and the gap between their mirror and their posts is often why they keep polishing."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Nearly every face in your feed has been through the pipeline.",
  "Run the polish check: name three edits before you compare.",
  "Your mirror is honest. Your feed is an advert."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Run the pipeline yourselves","body":"Take one honest selfie, then spend five minutes on the same shot with lighting, an angle and a filter. Put them side by side. That gap is on every feed you scroll.",
  "script":"Making the gap with your own hands beats being told about it. Ten minutes, two photos, permanent immunity boost."}
] $ex$::jsonb, 'dance')
where stage_id = 'explorer' and status = 'live' and title = 'Filters are not faces'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Remix culture ───────────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"remix","meaning":"Building on someone else's work: sounds, memes, edits."},
  {"word":"credit line","meaning":"The maker's name. One line, five seconds."}],
  "script":"Say each word and let them say it back. Remixing is celebrated in this lesson, never scolded. The credit line is what keeps it fair."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A creator finds their drawing inside your edit, no credit anywhere. What did the missing line cost them?","options":[
  {"text":"Nothing, exposure is free advertising","correct":false,"feedback":"Exposure without a name advertises nobody. Every viewer saw their work and none of them learnt who made it."},
  {"text":"Their name on their own work, in front of everyone who saw yours","correct":true,"feedback":"That is exactly the cost. The credit line is cheap for you and priceless for them, which is why it is simply owed."},
  {"text":"Money, credit lines are about payment","correct":false,"feedback":"No invoice involved. The credit line costs nothing and pays in the one currency makers live on: their name travelling with their work."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Does crediting make your edit less yours?","options":[
  {"text":"Yes, it admits you did not do it all","correct":false,"feedback":"Every maker builds on makers. Admitting it is not weakness, it is literacy. Your edit is still your edit."},
  {"text":"No. The edit is your work, and the credit shows you know where it grew from","correct":true,"feedback":"That is the confident version of creating. The best artists credit hardest, because they know what it is worth."},
  {"text":"Yes, so never use anyone's work","correct":false,"feedback":"That would end remix culture entirely. Use, build, transform, and carry the name forward. That is the deal."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Everything you love online was made by someone.",
  "The credit line: their name, one line, five seconds.",
  "Post the credit you would want on your own work."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Trace one trend to its maker","body":"Take a sound or meme you love and trace it back to the original creator together. It is a genuine detective game, and the answer is often a surprise.",
  "script":"Tracing one trend turns faceless content into a chain of real makers. Credit becomes obvious once the chain is visible."}
] $ex$::jsonb, 'dance')
where stage_id = 'explorer' and status = 'live' and title = 'Remix culture'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Location, cameras and microphones ───────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"permission","meaning":"A door an app asks you to open once, then keeps using."},
  {"word":"the one question","meaning":"Does it need this to work, or does it just want it?"}],
  "script":"Say each phrase and let them say it back. Doors that stay open is the picture that makes the sweep feel urgent instead of boring."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A drawing app asks for your microphone. Run the one question.","options":[
  {"text":"Allow it, apps know what they need","correct":false,"feedback":"Apps know what they WANT. Drawing needs no microphone, so this one fails the question, and no is the answer."},
  {"text":"It does not need a microphone to draw. It just wants it. No","correct":true,"feedback":"Clean run of the one question. Need gets a yes, want gets a no, and drawing has never needed to hear you."},
  {"text":"Allow it once to be polite","correct":false,"feedback":"Permissions are not manners. Once is a door that stays open until you close it in settings."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"You tapped allow on everything the day you got the phone. Is that permanent?","options":[
  {"text":"Yes, permissions are locked at install","correct":false,"feedback":"Nothing is locked. The settings page lists every door, and any of them closes today with one tap."},
  {"text":"No. The settings page can close any door today","correct":true,"feedback":"That is the good news of this whole lesson. Five minutes in settings undoes years of day one taps."},
  {"text":"Only a parent can change permissions","correct":false,"feedback":"You can open the settings yourself, and doing the sweep together is exactly what tonight is for."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Asked once, shared until you close the door.",
  "One question per permission: need, or just want?",
  "The sweep takes five minutes and is yours to run."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"The permission sweep tonight","body":"Settings, apps, permissions: check location, camera and microphone together tonight. Ask the one question of every open door, and close the ones that fail.",
  "script":"Doing the sweep once together makes it a habit they will rerun alone with every new phone and every new app."}
] $ex$::jsonb, 'football')
where stage_id = 'explorer' and status = 'live' and title = 'Location, cameras and microphones'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── AI companions and real friends ──────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the mirror","meaning":"A chat built to agree with you so you stay."},
  {"word":"disagree test","meaning":"Would this friend ever tell me I am wrong?"}],
  "script":"Say each phrase and let them say it back. The mirror is not evil, it is a product. The test is how you see the glass."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does agreeing with you keep you chatting?","options":[
  {"text":"It does not. People love being disagreed with","correct":false,"feedback":"Being agreed with feels lovely, which is exactly the point. Comfort keeps you in the chat, and the chat is the product."},
  {"text":"Being agreed with feels good, and feeling good keeps you there. That is its job","correct":true,"feedback":"That is the business model in one sentence. Nothing sinister, just a mirror doing what mirrors are paid to do."},
  {"text":"Because the AI genuinely thinks you are always right","correct":false,"feedback":"It does not think anything. It patterns towards whatever keeps this conversation going, and agreement usually does."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What belongs with your people rather than the bot?","options":[
  {"text":"Nothing. A bot can handle all of it","correct":false,"feedback":"Ideas and fun, sure. But a mirror cannot hug you, notice you at school tomorrow, or tell you a hard truth kindly."},
  {"text":"Big feelings and hard days","correct":true,"feedback":"That is the line this lesson exists to draw. The bot gets the brainstorms. Your people get the heavy stuff."},
  {"text":"Homework questions only","correct":false,"feedback":"Homework is fine bot territory! The line is about weight: the heavier the feeling, the more it needs a real person."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "An AI that always agrees is a mirror, not a mate.",
  "Run the disagree test on any chat.",
  "Ideas can go to the bot. Big feelings go to your people."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Run the disagree test live","body":"Ask an AI companion to disagree with you about something you know you are wrong about. Watch how hard it wriggles to stay agreeable. That wriggle is the lesson.",
  "script":"Seeing the wriggle once inoculates better than any warning. Make it a game: who can get the bot to hold a firm no?"}
] $ex$::jsonb, 'celebrate')
where stage_id = 'explorer' and status = 'live' and title = 'AI companions and real friends'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Your digital footprint is already real ──────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"footprint","meaning":"Two halves: what you made, and what others posted about you."},
  {"word":"self search","meaning":"Searching your own name, calmly, together."}],
  "script":"Say each phrase and let them say it back. The second half of the footprint, the part they never chose, is the surprise to land gently."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why search your own name BEFORE anyone else does?","options":[
  {"text":"To enjoy how famous you are","correct":false,"feedback":"Fun, but not the reason. The reason is control: the first person to read your story should be you."},
  {"text":"What you find first, you can usually fix first","correct":true,"feedback":"That is the whole strategy. Old tags, dead accounts, wrong photos: findable is fixable, and early is easy."},
  {"text":"There is no point, nothing can be changed","correct":false,"feedback":"Most of what a self search turns up CAN be changed: untagged, deleted, made private. Doing nothing is the only unfixable move."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What is a good footprint worth to future you?","options":[
  {"text":"Nothing, nobody searches names any more","correct":false,"feedback":"Coaches, schools and employers all do it, routinely. The search is coming. The only question is what it finds."},
  {"text":"A coach or school will search this name one day. Planted things speak for you","correct":true,"feedback":"Exactly. A footprint is not only a risk to manage. The project you posted, the club page, the thing you made: those answer for you."},
  {"text":"Money, footprints are sold","correct":false,"feedback":"Not directly! The value is reputation: what the search says about you when you are not in the room."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Your name already has a story online. Read it first.",
  "The self search: name, town, usernames, together, calmly.",
  "Fix what you find. Choose what you plant next."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"The self search, tonight","body":"Run it together: full name, then name plus town or club, then usernames. Sort what you find into keep, fix and remove. Calm sorting, no telling off, whatever turns up.",
  "script":"The no telling off promise is what makes this work. One shamed discovery and they will never search beside you again."}
] $ex$::jsonb, 'dance')
where stage_id = 'explorer' and status = 'live' and title = 'Your digital footprint is already real'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Mood and the scroll ─────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"before and after","meaning":"One mood word and a number, either side of the scroll."},
  {"word":"the drop","meaning":"When the number falls, and something in the feed did it."}],
  "script":"Say each phrase and let them say it back. This lesson hands them an instrument, not a rule: the check measures, they decide."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"The check costs ten seconds, twice. What does it buy?","options":[
  {"text":"Nothing, moods cannot be measured","correct":false,"feedback":"A word and a number is rough, and rough is enough. Seven before, four after tells you something real happened."},
  {"text":"Your own data on which feeds cost you, in your own numbers","correct":true,"feedback":"That is the buy. Nobody can argue with your own sevens and fours, including the part of you that wants one more scroll."},
  {"text":"Extra screen time as a reward","correct":false,"feedback":"No prizes involved. The reward is knowing, and knowing is what lets you change the feed instead of blaming yourself."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"The number drops every time after one account's posts. What is the move?","options":[
  {"text":"Toughen up until it stops bothering you","correct":false,"feedback":"The feed is the adjustable one here, not you. Tools exist for exactly this: mute, unfollow, not interested."},
  {"text":"Mute or unfollow. Change the feed, not yourself","correct":true,"feedback":"That is acting on the answer. The check found the cause, the tools remove it, and your evenings get their number back."},
  {"text":"Delete the whole app forever","correct":false,"feedback":"Sometimes right, usually oversized. One draining account rarely needs the whole app gone. Precision first."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Your feed is watching you. The check is you watching back.",
  "Before and after: one word, one number, every time.",
  "If the number drops, change the feed, not yourself."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Seven days of numbers","body":"Run the before and after check for one week and keep the numbers in notes. At the end, read them together. Your own data beats any lecture ever given.",
  "script":"A week of their own numbers turns an argument about screen time into a conversation about evidence. Let the data do the parenting."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'explorer' and status = 'live' and title = 'Mood and the scroll'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Bystander or upstander ──────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the pile on","meaning":"One mean message plus everyone's fuel."},
  {"word":"lifeline move","meaning":"Add nothing, message them privately, tell an adult if it goes on."}],
  "script":"Say each phrase and let them say it back. The lifeline move exists because doing the right thing needs to be as concrete as the wrong thing is easy."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does even a laughing face count as fuel?","options":[
  {"text":"It does not. A reaction is not a message","correct":false,"feedback":"To the chat, every reaction is a vote. Each laugh tells everyone watching that mocking this person works."},
  {"text":"Every reaction tells the chat that mocking works","correct":true,"feedback":"That is how pile ons grow: not through cruelty, through applause. Withholding the laugh is genuinely doing something."},
  {"text":"Because laughing faces are the meanest emoji","correct":false,"feedback":"The emoji is not the problem. The signal is: laughter is fuel, whoever throws it and however small it feels."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"You privately message the person being piled on: you ok? What did that actually do?","options":[
  {"text":"Nothing, it did not stop the pile on","correct":false,"feedback":"It did something the pile cannot see: it told them they are not alone. Ask anyone who has been in the middle which message they remember."},
  {"text":"Showed them one person outside the pile. It can outweigh thirty laughs","correct":true,"feedback":"That is the lifeline working. The pile shouts, your message lands. It is remembered for years, truly."},
  {"text":"Made you part of the drama","correct":false,"feedback":"A private kind message joins nothing. It is invisible to the pile and priceless to the person."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Silence looks like agreement to the person in the middle.",
  "The lifeline move: add nothing, message privately, tell an adult if it goes on.",
  "One kind message can outweigh thirty laughing faces."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Write the lifeline draft","body":"Write the you ok? message tonight and save it in notes. On the day a pile on actually happens, the hard part is already done: open, paste, send.",
  "script":"Pre writing removes the hesitation that stops most kind messages. A saved draft is a decision already made."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'explorer' and status = 'live' and title = 'Bystander or upstander'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The feed is built to hold you ───────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"watch time","meaning":"The one number the feed is built to grow."},
  {"word":"signals","meaning":"Pauses, replays, likes: everything the machine reads about you."}],
  "script":"Say each word and let them say it back. Watch time is the answer to every why does it show me this question they will ever have."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Does the feed know or care how a video makes you feel?","options":[
  {"text":"Yes, it only shows things that make people happy","correct":false,"feedback":"If that were true, no feed would ever make anyone miserable. It reads staying, and misery can hold a stare too."},
  {"text":"No. It reads staying, not feeling. That is why bad feeling videos can fill a feed","correct":true,"feedback":"That is the uncomfortable core of it. The machine is not cruel, it is indifferent, and indifference optimises anything that holds you."},
  {"text":"Yes, there is a feelings sensor in the phone","correct":false,"feedback":"No sensor needed or wanted. Your watch time tells it everything it cares about, which is exactly one thing."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What changes once you can actually see the machine?","options":[
  {"text":"Nothing. Seeing it does not switch it off","correct":false,"feedback":"True that it keeps running, and yet everything changes: you can now feed it different signals on purpose."},
  {"text":"You can feed it different signals, on purpose","correct":true,"feedback":"That is holding the controls. Pause on what you want more of, skip what you want gone, and the machine obeys the new you."},
  {"text":"The feed shuts down out of embarrassment","correct":false,"feedback":"It has no shame to trigger. But it does have inputs, and the inputs are yours."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The feed has one job: your watch time.",
  "It reads signals, not feelings.",
  "See the machine, and you hold the controls."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Retrain one feed this week","body":"Pick a topic you actually want more of. Spend ten minutes deliberately pausing on, liking and finishing only that. Watch the feed obey you over the week.",
  "script":"Retraining a feed on purpose is the most convincing proof that the signals were always theirs to send."}
] $ex$::jsonb, 'football')
where stage_id = 'explorer' and status = 'live' and title = 'The feed is built to hold you'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── When the group chat turns ───────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the third door","meaning":"Not joining, not just watching: no fuel, private support, tell."},
  {"word":"screenshot and tell","meaning":"Keeping proof before it disappears, then telling an adult."}],
  "script":"Say each phrase and let them say it back. The third door matters because everyone thinks the only choices are pile on or stay silent."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does the pile on need the audience more than it needs the first joke?","options":[
  {"text":"It does not. The first joke is everything","correct":false,"feedback":"First jokes die quietly all the time. The ones that become pile ons are the ones the audience feeds."},
  {"text":"Without reactions the joke dies. The audience is the fuel","correct":true,"feedback":"That is why your non reaction is power, not passivity. A pile on is a fire, and you are holding some of the oxygen."},
  {"text":"Because audiences write better jokes","correct":false,"feedback":"The audience mostly adds laughing faces, and those are fuel enough. Withholding yours is a real act."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Maya says please do not tell anyone, it will only make it worse. What is true?","options":[
  {"text":"She is right, telling always makes it worse","correct":false,"feedback":"Untold, a pile on runs until it is bored. Told, with proof, it meets someone with the power to end it."},
  {"text":"Telling an adult, with proof, is how it actually stops. Secret suffering never stops it","correct":true,"feedback":"That is the hard truth to hold while being kind to Maya. You can honour her feelings and still get her help."},
  {"text":"Deleting the chat fixes it for her","correct":false,"feedback":"Deleting destroys the evidence and changes nothing in the chat. Screenshot, then tell: proof plus power."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Silence in a pile on reads as applause.",
  "Take the third door: no fuel, private support, tell an adult.",
  "Screenshot, do not reply, come and tell."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Name your adult tonight","body":"Decide together, tonight: which adult gets told if a chat ever turns, at home and at school. Named in advance, telling becomes twice as easy on the day.",
  "script":"The naming is the safeguard. A child with a pre agreed adult skips the worst step, deciding who to trust while scared."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'explorer' and status = 'live' and title = 'When the group chat turns'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Built to be bottomless ──────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the full stop","meaning":"The ending books and films have, and feeds deleted."},
  {"word":"your own endings","meaning":"The finish lines you install before you start."}],
  "script":"Say each phrase and let them say it back. Deleted on purpose is the fact that moves this from my weakness to their design."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why did designers remove endings?","options":[
  {"text":"Endings are old fashioned","correct":false,"feedback":"Nothing to do with fashion. An ending is a decision point, and decision points are where viewers leave."},
  {"text":"An ending is a moment you might leave","correct":true,"feedback":"That is the design brief in one line. No full stop, no natural exit, no moment where leaving feels normal."},
  {"text":"To save money on making endings","correct":false,"feedback":"Endings are free. What is expensive to them is you leaving, and that is exactly what an ending permits."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Which of these is an ending you install?","options":[
  {"text":"I will stop when I feel tired","correct":false,"feedback":"Tired arrives long after too late, and the feed is very good at postponing the feeling. Feelings are not finish lines."},
  {"text":"After this episode I am done, said before pressing play","correct":true,"feedback":"That is an installed ending: decided by calm you, in advance, out loud. The bottomless feed just met a bottom."},
  {"text":"There is no such thing, autoplay cannot be beaten","correct":false,"feedback":"Autoplay has an off switch and your plans beat its defaults. The machine is strong, not unbeatable."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Feeds have no full stops. That is a choice they made.",
  "Install your own endings before you start.",
  "It was never your weakness. It was always their design."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Turn autoplay off tonight","body":"Find the autoplay switch in one app tonight and turn it off together. One less machine deciding your endings, starting now.",
  "script":"The switch itself matters less than the act: choosing an ending on purpose, once, makes every future ending easier to choose."}
] $ex$::jsonb, 'football')
where stage_id = 'explorer' and status = 'live' and title = 'Built to be bottomless'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Followers are not friends ───────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"highlight reel","meaning":"Thousands of best moments stitched together."},
  {"word":"reach","meaning":"What a follower count measures. Not worth."}],
  "script":"Say each word and let them say it back. Reach versus worth is the distinction the whole lesson defends."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does nobody post their ordinary Tuesday?","options":[
  {"text":"Ordinary Tuesdays are secret","correct":false,"feedback":"Not secret, just unrewarded. Feeds pay in likes, and likes go to highlights, so the reel is all anyone shows."},
  {"text":"Feeds reward highlights, so the reel is all you ever see","correct":true,"feedback":"Exactly. Everyone else has ordinary Tuesdays too. They are just filmed less, which is worth remembering at 11pm."},
  {"text":"Because other people do not have ordinary days","correct":false,"feedback":"Everyone has them, in roughly the same proportion as you. The feed filters them out, which is the trick."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Who counts for more than any follower number?","options":[
  {"text":"Nobody, followers are the truest measure","correct":false,"feedback":"A follower tapped once, maybe by accident. The truer measure is who turns up when something actually happens."},
  {"text":"The people who would show up when it matters","correct":true,"feedback":"That list is short for everyone, including the famous. Its shortness is what makes it the real number."},
  {"text":"Whoever has the most followers themselves","correct":false,"feedback":"Big accounts measure reach, and reach is real. It is just a different thing from having people."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Highlights against your whole life is a rigged game.",
  "A follower count measures reach, not worth.",
  "Count the people who would show up, not the ones who tapped."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Write the show up list","body":"Write the list of people who would actually show up for you, tonight. Notice how little it overlaps with any follower count, and how much more it matters.",
  "script":"The list is usually five to ten names, and seeing it written down recalibrates what a thousand followers weighs."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'explorer' and status = 'live' and title = 'Followers are not friends'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Finding news you can trust ──────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"sideways check","meaning":"Leaving the post to see who else reports it."},
  {"word":"verify","meaning":"Finding a real newsroom saying it too."}],
  "script":"Say each word and let them say it back. Sideways, not deeper, is the counterintuitive move professionals actually use."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why can a fake post survive the closest inspection?","options":[
  {"text":"It cannot. Fakes always have a visible flaw","correct":false,"feedback":"The good ones do not. Looking real is a fake's entire job, and the tools for faking get better every month."},
  {"text":"Looking real is its whole job. The proof lives outside the post","correct":true,"feedback":"That is why staring harder fails and going sideways works. The post cannot testify about itself."},
  {"text":"Because nobody inspects posts closely","correct":false,"feedback":"People do inspect, and inspection of a well made fake still comes up clean. The check has to leave the post."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"You cannot verify the story anywhere. What happens to it?","options":[
  {"text":"Share it with maybe not true written on it","correct":false,"feedback":"The maybe falls off in the first reshare and the story travels on alone. Unverified means it stops with you."},
  {"text":"It stops with you. Unverified does not travel through you","correct":true,"feedback":"That is the personal standard that starves fakes. If everyone held it, misinformation would have no legs at all."},
  {"text":"Wait an hour and share it anyway","correct":false,"feedback":"Time does not verify anything. Who else is reporting this is the question, and silence is an answer."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The post cannot prove itself. Go sideways.",
  "Who else is reporting this? Silence is an answer.",
  "If you could not verify it, it does not travel through you."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"One sideways check today","body":"Take the most surprising thing in your feed today and check it sideways together. Time it. It is almost always under a minute, which kills the too much effort excuse forever.",
  "script":"Timing the check is the persuasive part: sixty seconds is cheaper than being the person who shared the fake."}
] $ex$::jsonb, 'dance')
where stage_id = 'explorer' and status = 'live' and title = 'Finding news you can trust'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The bait message ────────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"phishing","meaning":"Fishing for the keys to your accounts."},
  {"word":"go direct","meaning":"Closing the message and opening the real app yourself."}],
  "script":"Say each word and let them say it back. Go direct is the move that beats every bait ever written, so it earns the board."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does bait almost always carry urgency, like DELETED IN 24 HOURS?","options":[
  {"text":"Because accounts really do get deleted that fast","correct":false,"feedback":"Real companies move slowly and email boringly. The countdown is the fisher's, not the company's."},
  {"text":"Panic taps before it thinks. Urgency is the hook","correct":true,"feedback":"That is the anatomy of bait. The scarier the countdown, the more certain you can be that a hook is in it."},
  {"text":"To be helpful about deadlines","correct":false,"feedback":"Helpful deadlines come inside the real app. Deadlines that arrive in messages with links are hooks wearing helpful."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What makes go direct beat clicking the link, every single time?","options":[
  {"text":"Nothing, the link is faster","correct":false,"feedback":"Faster to the fisher's copy of the login page, yes. Speed is what bait sells and exactly what you should not buy."},
  {"text":"The real app shows the truth. The link shows the fisher's copy","correct":true,"feedback":"That is the whole defence. If your account really has a problem, the real app will say so. It almost never does."},
  {"text":"Clicking links is rude","correct":false,"feedback":"Not rude, just risky here. A link in an urgent message is the one door you always decline to use."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The costume changes weekly. The hook never does.",
  "Nobody real asks for your password or code in a message.",
  "Never reply, go direct, tell someone."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Go bait spotting tonight","body":"Open the spam folder together tonight and find one real bait message. Name its hook and its costume out loud. Real specimens beat made up examples.",
  "script":"The spam folder is a free museum of live bait. Ten minutes in it and the patterns become impossible to unsee."}
] $ex$::jsonb, 'football')
where stage_id = 'explorer' and status = 'live' and title = 'The bait message'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── What the app knows about you ────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the trade","meaning":"Free apps are paid in attention and information."},
  {"word":"the collectors","meaning":"The taps, watch times and searches an app quietly notices."}],
  "script":"Say each phrase and let them say it back. Naming the trade removes the mystery: free was never free, it was a price they could not see."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does a free wallpaper app want your contacts?","options":[
  {"text":"To send wallpapers to your friends","correct":false,"feedback":"It has never once done that. Wallpapers need no friends list, which is exactly how you know this is a want, not a need."},
  {"text":"Your friends list is worth money, and the app does not need it to work","correct":true,"feedback":"That is the trade laid bare. The wallpapers are the bait, the contacts are the catch, and the one question catches it."},
  {"text":"All apps legally need contacts","correct":false,"feedback":"No law says that. Most apps run perfectly with no contacts at all, and the ones that insist deserve the question."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Who actually reads their privacy settings?","options":[
  {"text":"Everyone, it is the normal thing to do","correct":false,"feedback":"Almost nobody does, and the collectors count on it. Settings pages are built to be skipped."},
  {"text":"Almost nobody, and that is exactly why checking puts you ahead","correct":true,"feedback":"Being the rare one who looks is a genuine superpower, and it costs five minutes per app."},
  {"text":"Only lawyers can understand them","correct":false,"feedback":"The permission toggles are plain: location on or off, contacts on or off. The important part reads in a minute."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Free apps are paid in attention and information.",
  "One test: does it need this to do its job?",
  "Most people never look at the settings. You do."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Open the settings, actually","body":"Pick the most used app in the house tonight and read its privacy settings together for five minutes. Find one collector you did not know about, and close it.",
  "script":"The first closed collector is the habit forming one. After tonight, new apps get the settings look on day one."}
] $ex$::jsonb, 'football')
where stage_id = 'explorer' and status = 'live' and title = 'What the app knows about you'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- The algorithm deck has no objective and no DiGi close, so the generic
-- placement above leaves it without keywords and with the extras dangling
-- after its own recap. This rebuild puts keywords after the title, the new
-- questions before the deck's own tryit and recap, and drops the duplicated
-- generic pair. Guarded on the exact 13 slide shape the first update leaves.
update public.lessons set slides =
  jsonb_build_array(slides->0)
  || $kw$[{"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
    {"word":"signal","meaning":"Anything your child does that the app measures: a pause, a replay, a finished video."},
    {"word":"sensitivity window","meaning":"Ages 11 to 13, when the feed's pull lands hardest."}],
    "script":"Two terms carry this lesson. Signal is the one to keep using at home: it turns the mysterious algorithm into a machine your family can talk about."}]$kw$::jsonb
  || jsonb_build_array(slides->1, slides->2, slides->3, slides->4, slides->5)
  || jsonb_build_array(slides->8, slides->9, slides->10)
  || jsonb_build_array(slides->6, slides->7)
where stage_id = 'explorer' and status = 'live' and title = 'How the algorithm decides what your child sees'
  and jsonb_array_length(slides) = 13
  and slides->6->>'type' = 'tryit' and slides->7->>'type' = 'recap'
  and slides->11->>'type' = 'recap' and slides->12->>'type' = 'tryit';
