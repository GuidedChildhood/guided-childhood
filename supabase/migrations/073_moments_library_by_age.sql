-- Guided Childhood — Migration 073
-- A comprehensive moment library, by age, to sit alongside what we already have.
-- Every row is a real daily moment a parent meets, grounded in mainstream child
-- development and child mental health practice, and in the spirit of Dr Becky
-- Kennedy (connection before correction, the child is good inside), Sue Atkins
-- (calm routines and confident, warm authority) and Catherine Knibbs (the
-- online world through a nervous system and safety lens). No allow or deny, ever:
-- each opener leads a parent toward a calibrated pathway, never a verdict.
--
-- Age bands use the app's canonical vocabulary: 4-7, 8-10, 11-13, 13-15, 16+.
-- Categories are the seven the table allows. No dashes anywhere in the copy.
-- Idempotent: a row is inserted only if its title is not already present, so
-- this can run twice with no harm and never duplicates an existing moment.

set lock_timeout = '3s';

with incoming (title, category, age_bands, icon, science_brief, digi_opener, solutions, expert_note, sort_order) as (
  values
  -- ── MORNING ──────────────────────────────────────────────────────────
  ('Slow to get ready',
   'Morning', ARRAY['4-7','8-10']::text[], '🐢',
   'A young child has a small working memory, so a list of steps like wash, dress, shoes, bag can overload them long before it looks like defiance. One step at a time is a brain need, not a stall.',
   'When mornings snag, is it one particular step they get stuck on, or is it the whole run of things asked at once?',
   ARRAY['Name one step at a time and wait for it to land before the next, so their memory is never carrying more than one thing.','Turn it into the same short sequence every day, so the order becomes a habit the child owns rather than a fresh set of orders.','Get the visible things ready the night before, so the morning is doing, not deciding.']::text[],
   'Sue Atkins: a calm, predictable routine does the parenting so you do not have to nag.',
   300),

  ('Wants the tablet first thing',
   'Morning', ARRAY['4-7','8-10','11-13']::text[], '📱',
   'A screen first thing floods a young brain with fast reward, and everything slower after it, dressing, breakfast, the walk out, then feels flat by comparison, which is why the handover is where the storm lands.',
   'What is the tablet standing in for in the morning, a bit of comfort before a big day, or just the first habit their hand reaches for?',
   ARRAY['Move the first nice thing of the day to before the screen, music, a cuddle, a chat about something they like, so the good feeling is not tied to the device.','If the screen does happen, let a timer end it, not you, so the shutdown is the timer''s job and you stay the calm one.','Agree the night before what the morning holds, so it is a plan you made together, not a rule sprung on them.']::text[],
   'Dr Becky Kennedy: name the want out loud before you hold the limit, the child feels understood even when the answer is not yet.',
   301),

  ('Hard to wake, late night before',
   'Morning', ARRAY['11-13','13-15','16+']::text[], '😴',
   'Around puberty the body clock shifts later, so a teen genuinely cannot fall asleep as early and cannot wake as easily. The morning fog is biology catching up, not laziness.',
   'Is the struggle falling asleep at night, or the waking itself, because the two need very different help?',
   ARRAY['Protect the hour before sleep from bright screens, since the light itself pushes their body clock even later.','Wake them with light rather than your voice, opening the curtains signals morning to the brain more gently than being told again.','Keep the charging point outside the bedroom, so the late night scroll is not sitting on the pillow.']::text[],
   'The UK Chief Medical Officers put sleep first: protect it, and keep screens out of the bedroom.',
   302),

  -- ── FOOD ─────────────────────────────────────────────────────────────
  ('Only wants the same few foods',
   'Food', ARRAY['4-7','8-10']::text[], '🍝',
   'Fussy eating peaks in early childhood and is usually a normal, passing stage tied to a wariness of new tastes. Pressure at the table tends to make a food less liked, not more.',
   'Is a new food met with a flat no, or will they let it sit on the plate untouched, because those are two different starting points?',
   ARRAY['Serve one small piece of the new food beside the safe ones, with zero pressure to eat it, so it becomes familiar by sight before taste.','Eat the food yourself, calmly and with enjoyment, since children copy far more than they are told.','Keep mealtimes warm and short, so the table is a nice place to be, not a standoff.']::text[],
   'Feeding specialists agree: the parent decides what and when, the child decides whether and how much.',
   310),

  ('Phones at the dinner table',
   'Food', ARRAY['8-10','11-13','13-15','16+']::text[], '🍽️',
   'Shared meals without screens are one of the strongest simple predictors of family wellbeing and of children feeling able to talk. The phone on the table quietly pulls attention away from each other.',
   'Is the phone at the table a family wide habit right now, or one person''s, because the fix is easier when everyone is in it together?',
   ARRAY['Make it a rule for every adult too, a basket by the table, so no one feels singled out.','Give the meal a job beyond food, a high and low of the day each, so there is a reason to look up.','Keep it short and light to start, ten minutes screen free is a real win, not a battle for the whole meal.']::text[],
   'Sue Atkins: children learn connection by living it at the table, not by being lectured about it.',
   311),

  ('Skipping meals or eating alone',
   'Food', ARRAY['13-15','16+']::text[], '🚪',
   'A teen pulling away from the table can be ordinary independence, but a sudden shift in eating, alongside mood or withdrawal, is worth gentle attention rather than a fight over the food itself.',
   'Has this crept in slowly as they have got older, or did it change quite suddenly, because a sudden change is the one to lean in on?',
   ARRAY['Keep the invitation open and warm without making the table a test, come and sit even if you are not hungry.','Notice the pattern without commentary on the body or the plate, which keeps food from becoming a battleground.','If the change is sudden or paired with low mood, open a quiet door to talk, and to their GP if it holds.']::text[],
   'Child mental health guidance: watch the whole picture, mood, sleep and eating together, not one meal.',
   312),

  -- ── SCHOOL ───────────────────────────────────────────────────────────
  ('Will not talk about their day',
   'School', ARRAY['4-7','8-10','11-13']::text[], '🤐',
   'How was school is a huge, vague question to a tired child, and it often gets a shrug because they cannot hold the whole day at once. Small, specific questions unlock far more than open ones.',
   'When you ask about the day, is it a flat nothing, or do they open up later once they have had a bit of down time?',
   ARRAY['Trade the big question for a tiny one, who did you sit with at lunch, so there is one easy thing to answer.','Give them a landing hour first, a snack and no questions, since many children need to decompress before they can talk.','Talk side by side, in the car or on a walk, because eye to eye can feel like an interview.']::text[],
   'Dr Becky Kennedy: connection comes first, the talking follows once a child feels safe, not pressed.',
   320),

  ('Does not want to go to school',
   'School', ARRAY['4-7','8-10','11-13','13-15']::text[], '🎒',
   'School reluctance is a feeling, worry, tiredness, a friendship or a lesson they dread, wearing the coat of a behaviour. Finding the feeling underneath matters more than winning the morning.',
   'Is it every day or certain days, because a pattern often points straight at the real worry, a subject, a person, a moment?',
   ARRAY['Get curious about the specific dread rather than the whole of school, is it a lesson, a person, lunchtime, so you are solving the real thing.','Keep your own morning calm and sure, since your steadiness tells their nervous system it is safe to go.','If the refusal grows or comes with tummy aches and dread, loop in the school early, as a team, not a last resort.']::text[],
   'Catherine Knibbs: behaviour is the tip, the nervous system underneath is where the help goes.',
   321),

  ('Homework becomes a standoff',
   'School', ARRAY['8-10','11-13','13-15']::text[], '📚',
   'After a full school day a child''s self control is already spent, so the homework fight is often an empty tank, not a bad attitude. A short reset first gets more done than pushing through.',
   'Is it starting that is the wall, or keeping going once they have begun, because those need different footholds?',
   ARRAY['Let the tank refill first, food, movement, a bit of quiet, before anything academic is asked.','Shrink the first step to something almost too easy, just get the books out, so starting stops being the mountain.','Sit near without taking over, your calm presence steadies them more than corrections do.']::text[],
   'Sue Atkins: break the task down and stay warm, the calm adult is the strategy.',
   322),

  ('Exam and test stress',
   'School', ARRAY['11-13','13-15','16+']::text[], '📝',
   'A moderate amount of stress sharpens focus, but past a point it floods thinking and memory. A teen who looks like they are not trying may be frozen by how much they care.',
   'Does the pressure show as avoiding the work, or as spiralling into worry about it, because each pulls a different way?',
   ARRAY['Separate the feeling from the task, name that the nerves make sense, then make the next step small and concrete.','Protect sleep and breaks as part of revising, not a reward after, since a rested brain remembers more.','Aim their eyes at effort and habit rather than the grade, which is the part they can actually steer.']::text[],
   'Child mental health practice: name it to tame it, a feeling put into words loses some of its grip.',
   323),

  -- ── DIGITAL ──────────────────────────────────────────────────────────
  ('Turning the screen off ends in tears',
   'Digital', ARRAY['4-7','8-10']::text[], '📺',
   'A young child inside a game or show is fully absorbed, and being pulled out with no warning feels like a loss. The meltdown is grief for the fun ending, not manipulation.',
   'Is the storm at the very moment it goes off, or does it build for a while before, because a warning lands best in the calm before?',
   ARRAY['Give the ending a shape they can see, a two minute warning and a natural stopping point, the end of the episode, not mid scene.','Have the next thing ready and inviting, so they are moving toward something, not just losing this.','Let the timer be the one that says stop, so you can be the one who helps them through it.']::text[],
   'Dr Becky Kennedy: two things are true, the fun was real and the limit holds, you can hold both with warmth.',
   330),

  ('Everyone else has a phone',
   'Digital', ARRAY['8-10','11-13']::text[], '📲',
   'The wish to fit in is a real developmental drive, not spoilt wanting, and a child who feels left out is telling you something true. The device and the belonging underneath it are separate questions.',
   'Is the pull about a specific thing their friends do, a group chat, a game, or the general feeling of being the only one without?',
   ARRAY['Hear the feeling first and out loud, it is hard to be the only one, before any talk of yes or not yet.','Separate the belonging from the phone, is there another way in, a shared game on the family device, a meet up, so they are not left out while you wait.','Decide on your family''s timing with reasons they can understand, so it is a considered plan, not a flat no.']::text[],
   'Catherine Knibbs: readiness is about the child and the safety around them, not the birthday or the peer group.',
   331),

  ('Cannot come off the game',
   'Digital', ARRAY['8-10','11-13','13-15']::text[], '🎮',
   'Games are built to hold attention, with rewards timed to keep you playing and a real cost to stopping mid match. A child who cannot stop is often caught by the design, not just their own will.',
   'Is the fight about stopping at all, or about stopping right now in the middle of something, because a natural break changes everything?',
   ARRAY['Agree the finish line before they start, one more match, not one more hour, so the end is known and fair.','Give the warning tied to the game''s own rhythm, after this round, since being yanked mid match is a genuine loss.','Build in something to move toward next, so coming off is a change of activity, not just the end of the good bit.']::text[],
   'Child mental health practice: predictable, agreed limits calm the nervous system more than surprise ones.',
   332),

  ('Comparing themselves on social media',
   'Digital', ARRAY['11-13','13-15','16+']::text[], '💔',
   'Feeds show the edited best of everyone at once, and a developing teenage brain reads it as the real, ordinary standard. Feeling worse after scrolling is the machine working as designed, not a flaw in them.',
   'Do they scroll and go quiet, or do they talk about what they see, because an open door is easier when they are already talking?',
   ARRAY['Name how the feed is built, the highlights, the filters, the paid for perfect, so they can see the trick even while it pulls.','Keep your own reactions steady when they share, so they keep sharing rather than bracing for a lecture.','Notice what lifts them versus flattens them online, and help them curate toward the first, more of what makes them feel real.']::text[],
   'Catherine Knibbs: the online world acts on a young nervous system, teach them to notice how it leaves them feeling.',
   333),

  ('Saw something upsetting online',
   'Digital', ARRAY['8-10','11-13','13-15']::text[], '🫥',
   'A child who meets something frightening or unsuitable online needs, first, to know they are not in trouble for telling you. Shame is what keeps the next thing hidden, so the calm reception is the safety.',
   'Have they told you what they saw, or are you piecing it together, because how you first react sets whether they come back next time?',
   ARRAY['Lead with calm and thank you for telling me, so telling you is always safe, whatever it was.','Get the facts gently and without alarm, what they saw and where, so you can steady them and act.','Put the practical safety in place together, the settings, the block, who to tell, so they feel more in control, not more watched.']::text[],
   'Catherine Knibbs: the response to disclosure is the whole thing, safety is built by being safe to tell.',
   334),

  -- ── TRANSITIONS ──────────────────────────────────────────────────────
  ('Leaving the house takes forever',
   'Transitions', ARRAY['4-7','8-10']::text[], '🚪',
   'Switching from one thing to the next is genuinely effortful for a developing brain, and stopping a nice thing to go somewhere costs even more. The dawdle is a transition, not disobedience.',
   'Is getting out the door slow every time, or worse when they are leaving something they are enjoying?',
   ARRAY['Warn the change before it lands, we leave after this, so their brain can begin to shift gear.','Make leaving itself a small ritual, the same coat, shoes, door song, so it runs on habit not willpower.','Carry the good thing with them where you can, finish the drawing in the car, so it is paused, not lost.']::text[],
   'Sue Atkins: signpost the change and keep it the same each time, predictability removes the fight.',
   340),

  ('Ending a playdate or fun thing',
   'Transitions', ARRAY['4-7','8-10','11-13']::text[], '👋',
   'The end of something joyful brings a real drop, and young children have little practice softening that landing themselves. Big feelings at the end are a sign it mattered, not that it went wrong.',
   'Does the upset come at the goodbye itself, or on the way home once it has sunk in?',
   ARRAY['Give the ending a countdown, ten more minutes, then five, so the finish is seen coming, not sprung.','Name the feeling as you go, it is sad when a good thing ends, which helps more than talking them out of it.','Bridge to what is next at home, so there is something to head toward, not just something to leave.']::text[],
   'Dr Becky Kennedy: the feeling is allowed and the limit holds, you can validate the sadness and still go home.',
   341),

  ('Settling into a new school or class',
   'Transitions', ARRAY['4-7','8-10','11-13']::text[], '🏫',
   'A new setting asks a child to be brave all day and hold it together, so the wobble often shows at home, where it is safe, not at school. The evening meltdown can be the cost of a brave day.',
   'Is the hard part the going in each morning, or the coming home wrung out at the end?',
   ARRAY['Keep home extra predictable while the new thing is new, same tea, same bedtime, so one part of life is solid.','Expect the after school collapse and meet it with calm, they held it together all day, home is where it lands.','Give the newness time and name the wins, one friend, one thing they liked, so the picture is not all worry.']::text[],
   'Child mental health practice: the after school meltdown is restraint collapse, safety at home releasing a hard day.',
   342),

  -- ── EMOTIONS ─────────────────────────────────────────────────────────
  ('Big tantrums and meltdowns',
   'Emotions', ARRAY['4-7']::text[], '🌋',
   'In a full meltdown the thinking part of a young brain has gone offline, so reasoning, bargaining or consequences cannot reach them in the moment. They need a calm adult to borrow, then the words come after.',
   'In the heat of it, does closeness help them settle, or do they need a little space first before they can come back?',
   ARRAY['Be the calm they can borrow, low voice, steady body, fewer words, since your regulated state is the tool.','Save the talking for after, once the storm passes, name what happened together, that is when learning can land.','Look for the pattern behind the meltdowns, hunger, tiredness, too much, so you can head the next one off earlier.']::text[],
   'Dr Becky Kennedy: your child is good inside even mid meltdown, the behaviour is a hard feeling, not a bad kid.',
   350),

  ('Worry and anxiety',
   'Emotions', ARRAY['8-10','11-13','13-15']::text[], '😰',
   'Reassurance feels kind but can quietly feed worry, because it teaches the child the fear needed answering. Naming the worry and staying beside them builds the muscle to carry it themselves.',
   'Does the worry fix on one thing right now, or does it hop from thing to thing across the week?',
   ARRAY['Name it as worry rather than fact, that is your worry talking, so they learn to see it as a visitor, not the truth.','Stay warm without endless reassuring, sit with the feeling instead of rushing to fix it, which shows it is survivable.','Keep life moving gently toward the worried about thing in small steps, since avoiding it makes it grow.']::text[],
   'Child mental health practice: sit alongside the anxiety, do not feed it with reassurance, and it loosens.',
   351),

  ('Seeming low or flat',
   'Emotions', ARRAY['11-13','13-15','16+']::text[], '🌧️',
   'A stretch of low mood in a teen deserves a gentle door rather than a fix. Presence, without pressure to cheer up, is what tells them it is safe to say how heavy it feels.',
   'Is this a passing dip after a hard week, or has the flatness held for a while and pulled them out of things they used to like?',
   ARRAY['Open a quiet, no fix door, you seem a bit heavy lately, I am here, so talking is invited, never forced.','Keep the ordinary anchors going, sleep, food, a little movement, daylight, since these steady mood more than talk alone.','If the low holds for weeks or they lose interest in what they loved, walk with them to their GP, together, early.']::text[],
   'Child mental health guidance: a low mood that lasts, with lost interest, is worth professional help, sooner not later.',
   352),

  ('Anger that boils over',
   'Emotions', ARRAY['8-10','11-13','13-15']::text[], '🔥',
   'Anger is nearly always the outer layer of something softer underneath, hurt, fear, shame or feeling unheard. Meeting only the anger misses the feeling that is actually driving it.',
   'When the anger flares, what tends to sit just under it, feeling wronged, embarrassed, or not listened to?',
   ARRAY['Let the heat pass before any talk, nothing useful lands while the brain is flooded, so wait for calm.','Look under the anger for the softer feeling and name that, it sounds like that felt really unfair, which is what they needed heard.','Agree a way to cool down that is theirs, a place, a pause, a signal, planned in the calm, not the storm.']::text[],
   'Dr Becky Kennedy: behind the hardest behaviour is a good kid having a hard time, look for the feeling.',
   353),

  ('Siblings fighting',
   'Emotions', ARRAY['4-7','8-10','11-13']::text[], '⚡',
   'Some sibling conflict is how children practise sharing, fairness and repair, and a parent who jumps in as judge often gets cast as the unfair one. Coaching beats refereeing over time.',
   'Is it the same flashpoint each time, a toy, a turn, a space, or does it flare up over anything when they are tired?',
   ARRAY['Where it is safe, coach rather than judge, you both want a turn, how can we sort it, so they build the skill.','Name each child''s side out loud without ranking them, which cools the fight for who is right.','Head off the known flashpoints, turns on a timer, a bit of separate space, since prevention beats refereeing.']::text[],
   'Sue Atkins: coach the skills of sharing and repair, do not just settle the score, so they learn to do it themselves.',
   354),

  ('The after school meltdown',
   'Emotions', ARRAY['4-7','8-10','11-13']::text[], '💥',
   'Many children hold themselves together all day at school and let the feelings out the moment they reach the safe person. The home meltdown is a sign of trust and a full day, not a home problem.',
   'Does the crash come the second they see you, or a bit later once they are home and the day catches up?',
   ARRAY['Meet them with calm and low demands, a snack, quiet, no barrage of questions, since the tank is empty.','Read the meltdown as release, not defiance, they saved it for the safest place, which is you.','Build a soft landing hour into the day, so decompressing is expected, not a daily surprise to manage.']::text[],
   'Child mental health practice: this is restraint collapse, a day of holding it together finally let go where it is safe.',
   355),

  ('Evening wind down and screens before bed',
   'Evening', ARRAY['8-10','11-13','13-15','16+']::text[], '🌙',
   'Bright screens late in the evening delay the body clock and push sleep later, and a busy, stimulating feed keeps the brain switched on when it needs to be powering down. The wind down is a physical process, not just a habit.',
   'Is the sticking point putting the screen away, or settling once it is away, because the fix sits in different places?',
   ARRAY['Set a screens away time that is the same each night, so the body clock has a reliable cue to wind down.','Keep the charging point outside the bedroom, which removes the late night pull without a nightly battle.','Fill the last stretch with something calm and offline, a book, a chat, a shower, so there is a gentle path into sleep.']::text[],
   'The UK Chief Medical Officers: protect sleep, keep screens out of the bedroom, and guard the wind down.',
   360),

  ('Bedtime stalling and one more thing',
   'Evening', ARRAY['4-7','8-10']::text[], '🛏️',
   'The drip of one more drink, one more story, one more question is usually a bid for a bit more connection at the end of the day, not pure delay. A little planned closeness up front satisfies the real need.',
   'Do the extra requests come from a worry about being alone, or is it more the pull to stretch the nice time with you?',
   ARRAY['Front load the connection, an unhurried few minutes of cuddle and chat built into the routine, so the tank is filled before lights out.','Keep the same steps in the same order every night, so bedtime runs on rails and there is less to negotiate.','Answer the extras with a warm, steady same each time, one more and then sleep, which is kinder than a nightly renegotiation.']::text[],
   'Sue Atkins: a warm, consistent bedtime routine gives a child security, the sameness is the comfort.',
   361)
)
insert into public.daily_moments (title, category, age_bands, icon, science_brief, digi_opener, solutions, expert_note, sort_order, active)
select i.title, i.category, i.age_bands, i.icon, i.science_brief, i.digi_opener, to_jsonb(i.solutions), i.expert_note, i.sort_order, true
from incoming i
where not exists (select 1 from public.daily_moments d where d.title = i.title);
