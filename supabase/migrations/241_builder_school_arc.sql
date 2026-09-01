-- The school arc, Builder. (Lesson excellence plan, steps 4 to 6.)
--
-- Same shape as migration 240 and the same reasons: keywords on the board
-- after the objective, two more questions so every deck carries four and a
-- pass forgives one miss, a recap, a try it tonight, and the title slide
-- naming its Planet Friend. Register is ages 8 to 10: more world, fewer
-- tummies, and the trusted adult starts sharing the work with the child's
-- own judgement. Additive only, guarded on keywords, reapply is a no op.
-- Uses public.gc_add_school_arc from migration 240.

-- ── Mean messages ───────────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"stop, save, tell","meaning":"The three step move for any mean message, in that order."},
  {"word":"the fire","meaning":"The hot feeling that wants you to reply fast."}],
  "script":"Say each word and let them say it back. The order matters all lesson: stop first, save second, tell same day."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does replying fast hand the sender a win?","options":[
  {"text":"It does not. Fast replies win arguments","correct":false,"feedback":"Online, the fast reply is the prize they were fishing for. Not replying is what leaves them with nothing."},
  {"text":"They wanted a reaction, and a fast reply is exactly that","correct":true,"feedback":"That is the whole game. A mean message is a hook, and the fire in you is the tug on the line. Stop beats bite."},
  {"text":"Because typing fast makes spelling mistakes","correct":false,"feedback":"Spelling is not the problem. The reaction is. Any reply while the fire is hot gives them what they wanted."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Your friend gets the mean message, not you. What is the strong move?","options":[
  {"text":"Forward it around so everyone knows what happened","correct":false,"feedback":"Forwarding spreads the meanness further, even on your friend's side. Help them run the move instead."},
  {"text":"Stand with them: help them stop, save and tell","correct":true,"feedback":"That is what a good friend does. The move works the same for them, and standing together makes telling easier."},
  {"text":"Tell them to delete it and forget it","correct":false,"feedback":"Deleting destroys the proof a trusted adult needs. Save first, then tell. The message is the evidence."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "A mean message says something about them, never about you.",
  "Stop, save, tell. In that order, same day.",
  "Telling a trusted adult is strength, and it works for friends too."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Get the save move ready tonight","body":"Practise taking a screenshot together on their device, right now, on something silly. The save step should be muscle memory before anyone ever needs it for real.",
  "script":"Rehearsing the screenshot on a happy day means the hardest step of stop, save, tell is already easy on a bad one."}
] $ex$::jsonb, 'dance')
where stage_id = 'builder' and status = 'live' and title = 'Mean messages'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Think before you post ───────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"sent means sent","meaning":"A copy leaves your hands, and delete cannot chase it."},
  {"word":"five second check","meaning":"The pause and three questions before anything goes out."}],
  "script":"Say each phrase and let them say it back. Five seconds is short enough to always afford and long enough to save you."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Which of these passes the five second check?","options":[
  {"text":"A photo of your own drawing you are proud of","correct":true,"feedback":"Happy for the class to see it, hurts nobody, gives away no private clues. That is a clean pass."},
  {"text":"A hilarious photo of your friend mid sneeze","correct":false,"feedback":"Funny to you is not the test. Would THEY be happy? People in a photo get asked before it goes anywhere."},
  {"text":"A great photo of your whole class in school uniform","correct":false,"feedback":"The uniform names your school to every stranger who sees it. That is a private list clue in disguise."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Who else is in charge of what you post about THEM?","options":[
  {"text":"Nobody. My phone, my rules","correct":false,"feedback":"Your phone, their face. A post about someone else carries their name into sent means sent territory too."},
  {"text":"They are. People in a photo get asked first","correct":true,"feedback":"Exactly the rule you would want pointing the other way. Their photo, their say, every time."},
  {"text":"Only teachers and parents","correct":false,"feedback":"Everyone in the photo gets a say, not just adults. Your little cousin counts too."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Sent means sent. Copies can outlive the delete button.",
  "Five seconds, three questions, then send.",
  "People in the photo get asked first."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Run the check out loud","body":"Next time anyone in the family posts anything, run the five second check out loud together. Grown ups included, and the child gets to be the referee.",
  "script":"Hearing an adult pass and occasionally fail the check teaches more than any lecture about posting ever will."}
] $ex$::jsonb, 'dance')
where stage_id = 'builder' and status = 'live' and title = 'Think before you post'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── What is a robot brain? ──────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"pattern","meaning":"What AI learns from millions of examples."},
  {"word":"double check","meaning":"Checking an AI answer somewhere real before you use it."}],
  "script":"Say each word and let them say it back. Patterns, not thoughts, is the idea everything else in this lesson stands on."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"The chatbot answers in a super confident voice. What does that tell you about whether it is right?","options":[
  {"text":"Confident voice means a confident fact","correct":false,"feedback":"That is the trap. The voice is identical when it is completely wrong. Confidence is the costume, not the proof."},
  {"text":"Nothing. It sounds exactly the same when it is wrong","correct":true,"feedback":"That is the single most useful thing to know about AI. The tone carries no information. The double check does."},
  {"text":"It is showing off, so it is probably lying","correct":false,"feedback":"Not lying, guessing. It is often right! You just cannot tell from the voice, which is why we check."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What is AI actually doing when it answers you?","options":[
  {"text":"Thinking it through like a person would","correct":false,"feedback":"No thoughts in there. It is pattern matching against millions of examples, very fast and very smoothly."},
  {"text":"Guessing the next words from patterns in its examples","correct":true,"feedback":"That is the robot brain in one line. Brilliant guesser, no knower. Treat every answer accordingly."},
  {"text":"Looking up the one true answer in a big book","correct":false,"feedback":"There is no big book of answers inside. There are patterns, and patterns can point the wrong way."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "AI learns patterns from examples. It guesses, it does not know.",
  "It sounds the same whether right or wrong.",
  "If it matters, run the double check."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Catch the robot out tonight","body":"Together, ask a chatbot about something your family knows better than anyone: your street, your club, your pet's breed. Spot what it gets wrong, and enjoy it.",
  "script":"One confident wrong answer about their own street teaches the double check better than a hundred warnings."}
] $ex$::jsonb, 'football')
where stage_id = 'builder' and status = 'live' and title = 'What is a robot brain?'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Your first avatar ───────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"show box","meaning":"The fun made up things anyone can see."},
  {"word":"keep box","meaning":"Your real details, kept for family."}],
  "script":"Say each word and let them say it back. Every detail in the lesson sorts into one of these two boxes."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Your avatar name idea is your real name plus your birth year. What is wrong with it?","options":[
  {"text":"Nothing, it is easy to remember","correct":false,"feedback":"Easy for you AND for strangers. Your real name and your age are keep box treasure, and this hands over both."},
  {"text":"It puts keep box treasure in the show box","correct":true,"feedback":"Exactly. A username is show box territory, so build it from made up things: dragon, comet, biscuit. Not you."},
  {"text":"It is too boring for a game","correct":false,"feedback":"Boring is allowed! The problem is what it reveals: your real name and age, on show to everyone."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Is a made up avatar lying?","options":[
  {"text":"Yes. You should always be your real self online","correct":false,"feedback":"Being your real SELF is about how you treat people, not what your character looks like. Wings are fine."},
  {"text":"No. It is a costume, like dressing up","correct":true,"feedback":"That is it. Purple hair and dragon wings are play. The two box sort is what keeps the play safe."},
  {"text":"Only if the avatar looks nothing like you","correct":false,"feedback":"Looking different is the fun bit and completely fair. What matters is which box your real details stay in."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Your avatar is a costume, and you choose it.",
  "Run the two box sort: fun on show, real details kept.",
  "The real you is the treasure. That is why we keep it."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Design the dream avatar","body":"Draw or build the wildest avatar you can tonight, together. Then run the two box sort on every detail of it: which parts are show, which parts stay in the keep box?",
  "script":"Designing one for fun makes the sort automatic when the next real game asks them to build one."}
] $ex$::jsonb, 'football')
where stage_id = 'builder' and status = 'live' and title = 'Your first avatar'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Adverts are everywhere ──────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the sell","meaning":"The moment something wants your money or your wanting."},
  {"word":"costume","meaning":"The fun disguise an advert wears: a video, a game, a prize."}],
  "script":"Say each word and let them say it back. The lesson is one skill: seeing the sell through the costume."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Your favourite YouTuber says a new drink is amazing and shows a code for money off. What is happening?","options":[
  {"text":"They just really love the drink","correct":false,"feedback":"Maybe they do! But the money off code is the tell: this is a sell in a costume, and they are likely paid."},
  {"text":"The sell, in a costume. They are probably paid, so spot it and choose","correct":true,"feedback":"That is spot the sell at full power. You can still buy the drink. The point is that YOU chose, eyes open."},
  {"text":"A trick that should be reported","correct":false,"feedback":"Not a trick, a sell. Adverts are allowed, even dressed up. Your job is only ever to see the costume."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Does spotting the sell ruin the fun of videos and games?","options":[
  {"text":"Yes, now everything is secretly an advert","correct":false,"feedback":"Not everything, and spotting does not spoil, it sharpens. You enjoy the show AND keep your pocket money."},
  {"text":"No. Spot it, enjoy it anyway, and choose with open eyes","correct":true,"feedback":"Exactly. The sell only has power while it is invisible. Seen, it becomes a choice that belongs to you."},
  {"text":"Yes, so we should stop watching videos","correct":false,"feedback":"No need. The skill is seeing, not avoiding. A spotted sell is a beaten sell."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Adverts wear costumes now: videos, games, prize wheels.",
  "One question: is this after my money?",
  "When you spot the sell, you get to choose. That is the win."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Count the sells tonight","body":"Pick one favourite video or one game session tonight and count the sells together, out loud. The final number usually surprises everyone at the table.",
  "script":"Counting turns the invisible into a game. After one counting night, they start spotting sells without you."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'builder' and status = 'live' and title = 'Adverts are everywhere'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Copying and creating ────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"maker","meaning":"The person or team behind anything on a screen."},
  {"word":"credit","meaning":"Naming the maker when you use their work."}],
  "script":"Say each word and let them say it back. Ask what they have made this week, because the lesson lands hardest on fellow makers."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"You learnt a whole amazing build from one video and your friends are stunned. What is the fair move?","options":[
  {"text":"Enjoy the glory quietly","correct":false,"feedback":"The build is yours, the idea had a maker. Sharing where you learnt it costs you nothing and is simply fair."},
  {"text":"Say where you learnt it: name the maker","correct":true,"feedback":"That is credit, done right. Your skill still shines, and the maker gets their name on their idea."},
  {"text":"Say you invented it yourself","correct":false,"feedback":"That is the fridge drawing problem from the other side. Claiming someone's idea as yours is the unfair bit."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Why does naming the maker matter to YOU as a maker?","options":[
  {"text":"It does not, credit is only for famous people","correct":false,"feedback":"Credit is for every maker, including the one reading this. Fair runs in both directions or not at all."},
  {"text":"Because you want your name on your work too. Fair goes both ways","correct":true,"feedback":"Exactly. The rule you keep for others is the rule that protects your own work tomorrow."},
  {"text":"Because you get in trouble otherwise","correct":false,"feedback":"It is not about trouble. It is about being the kind of maker you would want using YOUR work."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Everything on a screen was made by someone.",
  "Name the maker. It costs nothing and it is fair.",
  "You are a maker too. Your name belongs on your work."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Credit one thing at dinner","body":"Find one thing you used or loved this week, a song, a game, a video, and find out together who actually made it. Say the maker's name at the dinner table.",
  "script":"Makers become real people the moment they have names. One named maker changes how a child copies forever."}
] $ex$::jsonb, 'dance')
where stage_id = 'builder' and status = 'live' and title = 'Copying and creating'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Passwords are secrets ───────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"three word trick","meaning":"Three random words that do not belong together."},
  {"word":"the one exception","meaning":"The grown up who helps look after your accounts."}],
  "script":"Say each word and let them say it back. Secrets with exactly one exception is the shape of every good password rule."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Which password is strongest?","options":[
  {"text":"Your pet's name","correct":false,"feedback":"Half your friends know your pet's name, and your posts probably tell the other half. Guessable is weak."},
  {"text":"cloud biscuit dragon","correct":true,"feedback":"Three random words that do not belong together: long, strange and yours. That is the trick at work."},
  {"text":"1234 plus your birth year","correct":false,"feedback":"Numbers people try first, plus a number lots of people know. A guessing machine gets this one in seconds."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"A message says: we are the game team, send your password so we can fix your account. What do you know?","options":[
  {"text":"The real team never asks for your password. Trick: stop and tell","correct":true,"feedback":"That is the rule that beats every version of this trick. Real teams fix accounts without ever needing your secret."},
  {"text":"It must be real, it knows the game's name","correct":false,"feedback":"Anyone can type a game's name. Knowing the name proves nothing. Asking for the password proves trick."},
  {"text":"Send it quickly so the account gets fixed","correct":false,"feedback":"Quickly is exactly what they want. A password asked for is a password about to be stolen."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Three random words. Long, strange, yours.",
  "A password is a secret with one grown up exception.",
  "Anyone who asks for it is a red flag."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Make one together tonight","body":"Pick three silly words at bedtime, the sillier the better, and upgrade one real password with them tonight. Laughing at the combination is allowed and encouraged.",
  "script":"A password they invented laughing is one they remember, and the trick becomes theirs for every account after."}
] $ex$::jsonb, 'football')
where stage_id = 'builder' and status = 'live' and title = 'Passwords are secrets'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Friends you know and friends you do not ─────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"real life check","meaning":"Met them in real life, and does my family know them?"},
  {"word":"too friendly too fast","meaning":"The warning sign of a stranger pushing close."}],
  "script":"Say each phrase and let them say it back. Most people online are lovely, which is exactly why the check has to be a habit, not a mood."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"An online player you like says: do not tell your parents about our chats, they would not get it. What is that?","options":[
  {"text":"Proof they really understand you","correct":false,"feedback":"It is designed to feel that way. A safe person never needs your family kept in the dark. This is the opposite of safe."},
  {"text":"The biggest warning sign there is. Stop and tell now","correct":true,"feedback":"Exactly. Keep it secret is the loudest alarm in this whole subject. Safe people never ask for secrecy from your family."},
  {"text":"Normal, lots of chats are private","correct":false,"feedback":"Private from the group is one thing. Secret from your parents, on request, is the red line. Tell today."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Most people online are exactly who they say they are. So why run the real life check on everyone?","options":[
  {"text":"Because everyone online is dangerous","correct":false,"feedback":"They are not, and that is not the reason. The check exists because the rare ones who lie look identical to the rest."},
  {"text":"Because you cannot tell which ones are not, just by looking","correct":true,"feedback":"That is it exactly. The check is not suspicion, it is a seatbelt: worn every trip because you cannot pick the crash."},
  {"text":"You do not need to if someone seems nice","correct":false,"feedback":"Seeming nice is the one thing every pretender gets right. The check works because it ignores charm completely."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Friendly is easy to fake. The screen hides who is typing.",
  "Real life check: met them, and family knows them?",
  "Keep it secret is the loudest warning sign there is."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Sort one friends list tonight","body":"Open one game's friend list together and run the real life check down it, name by name. No telling off, no deleting panic. Just sorting: know, or do not know.",
  "script":"Doing the sort calmly once makes it normal. The child who has sorted a list will tell you when a stranger lands in it."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'builder' and status = 'live' and title = 'Friends you know and friends you do not'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The cool down lap ───────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"scratchy minutes","meaning":"The cross, flat feeling just after screens stop."},
  {"word":"cool down lap","meaning":"Move, water, hands: your three step landing."}],
  "script":"Say each phrase and let them say it back. Naming the scratchy minutes takes half their power away before the lap takes the rest."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does a racer take a cool down lap instead of stopping dead?","options":[
  {"text":"To show off one more lap","correct":false,"feedback":"Nothing to do with showing off. Bodies handle endings better slowly, and that is as true after screens as after races."},
  {"text":"Bodies handle endings better slowly, and yours does too","correct":true,"feedback":"That is the whole idea. The lap gives your body a ramp down instead of a cliff, and the scratchiness fades on the ramp."},
  {"text":"Because the brakes do not work at full speed","correct":false,"feedback":"Racing brakes are fine! The slow lap is for the BODY, and your body wants the same after a fast bright screen."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Which of these is a real cool down lap?","options":[
  {"text":"Star jumps, a glass of water, ten minutes of building","correct":true,"feedback":"Move, water, hands. All three steps, in order, and the scratchy minutes do not stand a chance."},
  {"text":"Lying on the sofa scrolling a different screen","correct":false,"feedback":"That is not a landing, it is a second flight. The lap only works away from screens: move, water, hands."},
  {"text":"Arguing for more time","correct":false,"feedback":"Arguing keeps the engine revving. The lap is how the engine cools: move your body, drink, make something."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "The scratchy minutes after a screen are normal, and they pass.",
  "Run your cool down lap: move, water, hands.",
  "Soft landings today make tomorrow easy to say yes to."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Run one lap tonight","body":"After the last screen tonight, run the lap together: move, water, hands. Time how fast the scratchiness fades, and compare notes. It is usually quicker than anyone guessed.",
  "script":"Timing it turns the lap into an experiment they own, and the result argues for the routine better than you can."}
] $ex$::jsonb, 'football')
where stage_id = 'builder' and status = 'live' and title = 'The cool down lap'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Why stopping feels hard, and how to win at it ───────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"reward drip","meaning":"The little wins games hand your brain, over and over."},
  {"word":"finish point","meaning":"The ending you choose before you start."}],
  "script":"Say each phrase and let them say it back. Knowing the drip exists is what makes choosing the finish point feel fair instead of bossy."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does choosing the finish point BEFORE you start work better than deciding at the end?","options":[
  {"text":"Before you start, your brain is calm. At the end, it is mid reward drip","correct":true,"feedback":"Exactly. You make the deal while the calm you is in charge, so the drippy you just has to keep it."},
  {"text":"It does not matter when you decide","correct":false,"feedback":"It is almost the whole game. A choice made mid drip nearly always chooses one more level."},
  {"text":"Because grown ups say so","correct":false,"feedback":"Not a says so rule. It is brain chemistry: the calm version of you is simply better at choosing endings."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"You stopped at your finish point and it still felt a bit bad. Did the plan fail?","options":[
  {"text":"Yes, stopping should feel fine if you did it right","correct":false,"feedback":"The feeling is chemistry, not failure. The drip stopped, the brain grumbles, and then it passes. The plan worked."},
  {"text":"No. The feeling is chemistry, and stopping anyway is the win","correct":true,"feedback":"That is winning at stopping: not feeling nothing, but keeping the deal while the feeling passes through."},
  {"text":"Yes, so next time do not stop","correct":false,"feedback":"Backwards! Every kept finish point makes the next one easier. Skipping one makes them all harder."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "The cross feeling after a screen is chemistry, and it passes.",
  "Pick the finish point before you start.",
  "Stopping is a skill, and every kept ending trains it."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Call the finish point out loud","body":"Before the next screen session, say the finish point out loud to each other: this level, that episode, this time. Then keep it. One kept finish point beats ten arguments.",
  "script":"Saying it out loud makes it a deal between you rather than a rule over them, and deals get kept."}
] $ex$::jsonb, 'football')
where stage_id = 'builder' and status = 'live' and title = 'Why stopping feels hard, and how to win at it'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── What we keep private online ─────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the jigsaw","meaning":"Small safe looking clues that add up to find you."},
  {"word":"the private list","meaning":"Full name, school, address, phone, passwords, home photos."}],
  "script":"Say each phrase and let them say it back. The jigsaw is the idea that upgrades this from a list to remember into a way of seeing."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A photo of you in your school jumper outside your front door. How many jigsaw pieces is that?","options":[
  {"text":"None, it is just a nice photo","correct":false,"feedback":"To you it is a photo. To a stranger it is a map: the jumper names your school, the door shows your street."},
  {"text":"Two big ones: your school and where you live","correct":true,"feedback":"Spotted like a pro. Neither piece looks private on its own, and together they answer the worst question: where to find you."},
  {"text":"One small one, the jumper","correct":false,"feedback":"The jumper is one, and the front door is the bigger one. Backgrounds carry pieces as often as faces do."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Why is your address private even from nice people online?","options":[
  {"text":"It is not, nice people can know it","correct":false,"feedback":"Online, a message to one nice person can be seen, shared or stolen. The list stays private from everyone."},
  {"text":"Because online you cannot tell who else is reading","correct":true,"feedback":"That is the reason behind the whole list. You are never writing to one person online, even when it feels like it."},
  {"text":"Because addresses are embarrassing","correct":false,"feedback":"Nothing embarrassing about it. It is the piece that turns every other clue into a knock on your door."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Private information never goes into a screen.",
  "Small clues make a big jigsaw.",
  "When anything asks for the list, the answer is no, then tell."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"The jigsaw hunt tonight","body":"Look through a few family photos together tonight and hunt the hidden clues: jumpers, street signs, front doors, club badges. Sharpest eyes wins the game.",
  "script":"Hunting their own photos flips the skill from theory to reflex. They will spot jigsaw pieces in every photo after this."}
] $ex$::jsonb, 'dance')
where stage_id = 'builder' and status = 'live' and title = 'What we keep private online'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Spot the trick ──────────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the three tells","meaning":"Rushing, promising, asking. Every trick wears at least one."},
  {"word":"stop and check","meaning":"Your whole job when you spot a tell. Deciding is not your job."}],
  "script":"Say each phrase and let them say it back. The division of labour is the lesson: they spot, you decide, together."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why do tricks almost always rush you?","options":[
  {"text":"Because the offer really is about to run out","correct":false,"feedback":"The countdown is theatre. The same only 30 seconds left has been running for months. Rushing is the costume."},
  {"text":"Because thinking time is the trick's enemy","correct":true,"feedback":"Exactly. Every trick dies when you slow down, so every trick tries to stop you slowing down. Rush is the tell."},
  {"text":"Because trick makers are always in a hurry","correct":false,"feedback":"They are patient, actually. The hurry is aimed at YOU, because a rushed brain taps before it thinks."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"A calm, polite message with no countdown asks you to confirm your password. Trick?","options":[
  {"text":"No, tricks always rush and this one is calm","correct":false,"feedback":"Rushing is only one tell of three. Asking is a tell all by itself, and passwords are the thing real teams never ask for."},
  {"text":"Yes. Asking is a tell, even without rushing","correct":true,"feedback":"Spotted. One tell is enough to stop and check. The calmest, politest message in the world does not get your password."},
  {"text":"Only if it also promises a prize","correct":false,"feedback":"No prize needed. Rushing, promising, asking: any ONE of the three is your signal to stop and check."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Rushing, promising, asking. Know the three tells.",
  "One tell is enough to stop.",
  "You spot, a grown up decides, together."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Build a trick for the trick museum","body":"Invent the most ridiculous trick message you can together tonight, all three tells included. HURRY! FREE DRAGONS! JUST TYPE YOUR PASSWORD! Making one is the fastest way to spot one.",
  "script":"A child who has built a trick from parts recognises the parts anywhere. Laughter is the best memory glue there is."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'builder' and status = 'live' and title = 'Spot the trick'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Screens and sleep ───────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"melatonin","meaning":"The sleepiness helper your brain makes when it gets dark."},
  {"word":"charging spot","meaning":"Where every screen in the house sleeps, outside bedrooms."}],
  "script":"Say each word and let them say it back. Melatonin is a proper science word and children love owning it."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"What does bright screen light do to melatonin?","options":[
  {"text":"Nothing, light and sleep are separate","correct":false,"feedback":"They are wired together. Light is exactly how your brain decides whether to release the sleepiness helper."},
  {"text":"Holds it back, so sleep comes later","correct":true,"feedback":"That is the mechanism in one line. Bright light close to your face reads as daytime, and daytime brains stay awake."},
  {"text":"Makes more of it, which is why screens feel cosy","correct":false,"feedback":"Cosy is the show, not the chemistry. The light is quietly holding your sleepiness helper back the whole time."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Whose screens follow the charging spot rule?","options":[
  {"text":"Just the children's","correct":false,"feedback":"A rule only for children reads as a punishment. This one is body science, and every body in the house has the same wiring."},
  {"text":"Everyone's, grown ups included","correct":true,"feedback":"That is what makes it a family rule instead of a telling off. Every screen, every night, every person."},
  {"text":"Only screens that have games on them","correct":false,"feedback":"The light does not care what is playing. Any bright screen near a face at night pushes sleep later."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Dark switches the sleepiness helper on. Screens hold it off.",
  "Screens live at the charging spot overnight, all of them.",
  "The last hour before bed belongs to winding down."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"The whole family plugs in","body":"Tonight, every screen in the house goes to the charging spot at the same time, grown ups first. The last hour gets a book, a bath or a board game instead.",
  "script":"One night of everyone doing it is worth a month of reminders. The grown up phones going first is the part they will remember."}
] $ex$::jsonb, 'football')
where stage_id = 'builder' and status = 'live' and title = 'Screens and sleep'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Is seeing believing? ────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"claim","meaning":"What a photo really is: something saying believe me."},
  {"word":"truth benders","meaning":"Cropped, staged, filtered, faked. The four to know."}],
  "script":"Say each word and let them say it back. Calling a photo a claim, out loud, is the reframe the whole lesson turns on."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does treating a photo as a claim make you smarter, not just more suspicious?","options":[
  {"text":"It does not, it just spoils photos","correct":false,"feedback":"Checking takes ten seconds and spoils nothing true. Only the benders lose when you ask the two questions."},
  {"text":"Claims get checked, and checking is quick: who made this, and why?","correct":true,"feedback":"That is the skill. Suspicion doubts everything; checking sorts it. Two questions do most of the work."},
  {"text":"Because all photos are fake now","correct":false,"feedback":"Most photos are honest! The point is you cannot tell WHICH by looking, so every surprising one earns the two questions."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"A holiday photo looks perfect: blue sky, empty beach, glowing sea. Which benders could be at work?","options":[
  {"text":"None, holiday photos are always honest","correct":false,"feedback":"Holiday photos are where the benders work hardest. Someone is often selling that beach."},
  {"text":"Cropped and filtered, easily both at once","correct":true,"feedback":"Crop out the crowds, warm up the colours, and an ordinary Tuesday beach becomes paradise. Two benders, one photo."},
  {"text":"Faked, it must be completely invented","correct":false,"feedback":"No need to invent! A real photo, cropped and filtered, bends far enough. The gentle benders are the busy ones."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "A photo is a claim, not a fact.",
  "Four benders: cropped, staged, filtered, faked.",
  "Two questions: who made this, and why?"]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Bend the truth yourselves tonight","body":"Take one photo of tonight's dinner table making it look amazing, and one making it look tragic. Same table, two minutes apart. That gap is the whole lesson.",
  "script":"A child who has bent the truth with their own camera never again believes a beach photo without asking who made it."}
] $ex$::jsonb, 'dance')
where stage_id = 'builder' and status = 'live' and title = 'Is seeing believing?'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Reading news online ─────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the three coats","meaning":"News, opinion, advert. Everything online wears one."},
  {"word":"checked","meaning":"What real news is: somebody's job to get it right."}],
  "script":"Say each word and let them say it back. Which coat is this wearing becomes the family question after this lesson."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Your cousin shares a story that made them really angry. Before you share it on, what do you ask?","options":[
  {"text":"How angry did it make me too?","correct":false,"feedback":"Anger is the sharing fuel, and it is exactly when the coat check matters most. Angry stories skip checking."},
  {"text":"Which coat is this wearing, and who checked it?","correct":true,"feedback":"That is the pause that stops most rubbish spreading. Strong feelings first, coat check second, share third, maybe."},
  {"text":"How many people shared it already?","correct":false,"feedback":"Share counts measure spread, not truth. A million shares of an unchecked story is just a bigger unchecked story."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Opinion is not a bad coat. What is the one rule for it?","options":[
  {"text":"Opinions should never be shared","correct":false,"feedback":"Opinions are half the fun of the internet. The rule is only that they must not dress up as news."},
  {"text":"Know it is opinion, and do not let it dress as news","correct":true,"feedback":"That is the rule. What someone thinks is worth hearing. It just must not be filed as what happened."},
  {"text":"Only grown ups may have opinions","correct":false,"feedback":"Everyone gets opinions, you included. The skill is telling the coat apart, not banning it."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "News, opinion, advert. Three coats.",
  "Ask which coat before you believe or share.",
  "Real news is checked by people whose job it is."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Coat check at breakfast","body":"Tomorrow morning, pick three things from a feed or a front page and coat check them together: news, opinion or advert? Disagreements welcome, that is the point.",
  "script":"The breakfast argument about whether something is opinion or advert IS the media literacy. Enjoy it."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'builder' and status = 'live' and title = 'Reading news online'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Keeping games fun ───────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"rematch test","meaning":"Would everyone want to play you again?"},
  {"word":"mute, leave, tell","meaning":"The ladder for when chat turns nasty."}],
  "script":"Say each phrase and let them say it back. The rematch test covers winning AND losing, which is why it works."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"You lost three in a row and the winner is gloating. What passes the rematch test from YOUR side?","options":[
  {"text":"Quit without a word","correct":false,"feedback":"Silent quitting fails the test too. Steady losing is a real skill, and good game, one more? is what it sounds like."},
  {"text":"Good game, one more? Losing steadily is a skill","correct":true,"feedback":"That is it. Their gloating fails THEIR test. Your steady answer passes yours, and everyone still wants you in the lobby."},
  {"text":"Tell everyone the winner cheated","correct":false,"feedback":"Calling cheat because you lost is the fastest rematch test fail there is. Steady beats salty, every time."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"When does mute become leave?","options":[
  {"text":"Never, muting always fixes it","correct":false,"feedback":"Mute fixes one nasty voice. When the whole lobby has turned, leaving is the strong move, not the weak one."},
  {"text":"When muting one person is not enough to make it fun again","correct":true,"feedback":"That is the ladder working. Each rung is for a bigger problem, and tell waits at the top for the worst ones."},
  {"text":"The moment anyone annoys you slightly","correct":false,"feedback":"Save the ladder for nasty, not for annoying. Most games have a bit of both, and fun survives annoying."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Play so everyone wants a rematch.",
  "Rage lands in the body first. Feel it, breathe, step back.",
  "Mute, leave, tell. You never have to fight back."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Find the buttons before you need them","body":"Open the favourite game together tonight and find mute, leave and report. Actually press mute on something harmless so the fingers know the way.",
  "script":"Buttons found calmly tonight are buttons found instantly on the night chat turns nasty. That speed is the protection."}
] $ex$::jsonb, 'football')
where stage_id = 'builder' and status = 'live' and title = 'Keeping games fun'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Boys, girls and the screen ──────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"stereotype","meaning":"A shortcut that pretends all boys or all girls are the same."},
  {"word":"shortcut","meaning":"The quick, lazy choice a maker made. Choices can be different."}],
  "script":"Say each word and let them say it back. Somebody CHOSE that is the sentence to keep landing all lesson."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A game only offers boy heroes, rescuing girl characters. Who decided that?","options":[
  {"text":"Nobody, games just come out that way","correct":false,"feedback":"Games are built line by line by people. Every hero on the menu is a decision somebody made and could have made differently."},
  {"text":"The makers. A stereotype is a choice, not a rule","correct":true,"feedback":"Exactly. And once you see it as a choice, you can disagree with it and still enjoy the game, eyes open."},
  {"text":"The players voted for it","correct":false,"feedback":"Players rarely get a vote. The shortcut came from the makers' desk, which is why different makers make different games."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Your friend, a boy, loves baking videos and hides it from the class. What is true?","options":[
  {"text":"He should switch to football videos","correct":false,"feedback":"Switching to fit a shortcut hands the shortcut the win. The shortcut is wrong, not him."},
  {"text":"Real people are bigger than shortcuts. He gets to like what he likes","correct":true,"feedback":"That is the whole rule. Real boys bake, real girls box, and every screen shortcut is smaller than every real person."},
  {"text":"Baking videos are for girls","correct":false,"feedback":"That is the shortcut talking, word for word. Say it out loud and you can hear how silly it is: it is a whisk, not a badge."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "A stereotype is a shortcut somebody chose.",
  "Real people are always bigger than shortcuts.",
  "You get to like what you like. That is the whole rule."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Shortcut spotting tonight","body":"Watch two adverts together tonight and spot the shortcuts: who is shown doing what, and who is missing from the picture? Sharpest spotter wins.",
  "script":"Once they can name a shortcut in an advert, they can name it in a playground comment. That transfer is the point."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'builder' and status = 'live' and title = 'Boys, girls and the screen'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');
