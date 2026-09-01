-- The school arc, Shaper. (Lesson excellence plan, steps 4 to 6.)
--
-- Same shape and reasons as migrations 240 to 242. Two registers live in
-- this stage: sixteen decks speak straight to the teenager (13 to 15), and
-- thirteen decks from sort 1020 up speak to the parent about the teenager,
-- carrying the heaviest topics in the library. The parent decks held one
-- question each, so they gain three; the teen decks gain two; everything
-- reaches four, where a pass forgives one miss. Nova, the steady KS4 host,
-- fronts the heavy decks; the safeguarding lines (never in trouble for
-- telling, the fault is the pressurer's, never pay) are load bearing and
-- worded to UK guidance. Additive only, guarded on keywords, reapply is a
-- no op. Uses public.gc_add_school_arc from migration 240.

-- ── Who are you online? ─────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the drift","meaning":"An account slowly changing how you act."},
  {"word":"one person test","meaning":"Would I be fine if people from my other accounts saw this?"}],
  "script":"Say each phrase and let them say it back. Different accounts are treated as normal here. The drift is the only thing on watch."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Is having a jokey account and a serious account a problem in itself?","options":[
  {"text":"Yes, more than one account means hiding something","correct":false,"feedback":"You talk differently to your grandad and your mates already. Different rooms are normal. The drift is the thing to watch, not the count."},
  {"text":"No. Different rooms are normal. The drift is what to watch","correct":true,"feedback":"Exactly. The question is never how many accounts. It is whether any of them is slowly changing who you are."},
  {"text":"Yes, everyone should have exactly one account","correct":false,"feedback":"No platform and no person works like that. The one person test matters more than the account count ever will."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"You notice you are meaner on one account than anywhere else in your life. What is that a sign of?","options":[
  {"text":"Nothing, jokes are jokes","correct":false,"feedback":"When the meanness only lives on one account, the account is shaping you. That is the drift, and noticing it is the skill."},
  {"text":"The account is starting to drive you. Time to step back","correct":true,"feedback":"That is the drift caught in the act. The strong move is yours: post less there, or let the account go."},
  {"text":"You are secretly a mean person","correct":false,"feedback":"No. It says something about the room, not your core. Rooms that reward meanness make meanness. Change the room."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Different rooms, same you underneath.",
  "Run the one person test before you post.",
  "Watch the drift: meaner or fake happier means the account is driving."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Run the test on your last ten","body":"Scroll your own last ten posts tonight and run the one person test on each. No deleting spree needed. Just notice. Noticing is the whole skill.",
  "script":"Auditing their own feed beats being audited. Ten posts is enough for the pattern to show itself."}
] $ex$::jsonb, 'dance')
where stage_id = 'shaper' and status = 'live' and title = 'Who are you online?'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Relationships, pressure and phones ──────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the no test","meaning":"A real request survives a no."},
  {"word":"pressure wearing affection","meaning":"Pressure dressed up as caring about you."}],
  "script":"Say each phrase and let them say it back. The no test is the tool this lesson leaves behind, so it goes on the board first."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"You said no and they went quiet and moody for days. What did the no test just show you?","options":[
  {"text":"That you hurt them and should apologise","correct":false,"feedback":"A no that was safe to say needs no apology. The sulk is pressure's second costume, and it tells you what the asking really was."},
  {"text":"It was pressure, not care. Care survives a no","correct":true,"feedback":"That is the test doing its job. The moody silence is the answer the first message hid."},
  {"text":"Nothing, moods are random","correct":false,"feedback":"This mood arrived the moment you said no. That timing is data, and the no test reads it plainly."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"A friend is being pressured for a photo and asks you what to do. What is the strongest thing you can tell them?","options":[
  {"text":"Send it and get it over with","correct":false,"feedback":"Sent never means over. It means the pressure has something to hold. Their no is allowed to stand, full stop."},
  {"text":"Their no is allowed, and an adult should know if the pushing continues","correct":true,"feedback":"Both halves matter: the no needs no justification, and continued pushing is exactly what trusted adults are for."},
  {"text":"Block them and never mention it to anyone","correct":false,"feedback":"Blocking can be right, and silence leaves your friend carrying it alone. Telling an adult is strength, here more than anywhere."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Care and pressure cannot share a sentence.",
  "A real request survives a no.",
  "Pushing after a no changes the plan: tell someone."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Say the line out loud once","body":"Practise the exit line tonight, out loud, even though it feels silly: I said no, and that stands. Words rehearsed once come easier under real pressure.",
  "script":"Rehearsal is not paranoia, it is kit. The line exists so the hardest moment does not also require improvising."}
] $ex$::jsonb, 'nova')
where stage_id = 'shaper' and status = 'live' and title = 'Relationships, pressure and phones'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Scams aimed at teenagers ────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the three pressure moves","meaning":"Hurry, secrecy, shame. Every scam leans on at least one."},
  {"word":"report","meaning":"The block and report that ends most scams in one tap."}],
  "script":"Say each phrase and let them say it back. Secrecy is the one to underline: it is the move that keeps every other move working."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does a scammer want secrecy above everything else?","options":[
  {"text":"They are shy about their work","correct":false,"feedback":"Nothing shy about it. Secrecy is load bearing: the scam only survives while you are the only one looking at it."},
  {"text":"A second pair of eyes kills the scam instantly","correct":true,"feedback":"Exactly. What looks convincing alone looks obvious shown to anyone else. That is why do not tell anyone is always in the script."},
  {"text":"Secrecy makes the deal more exclusive","correct":false,"feedback":"Exclusive is the costume. The function is isolation, because isolated people cannot be warned."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"You already replied, and already sent something. Is it too late to tell someone?","options":[
  {"text":"Yes, telling now just gets you in trouble","correct":false,"feedback":"No. The trouble belongs to the scammer, entirely. Telling now is what stops the next demand, and adults have seen this before."},
  {"text":"Never. Telling now is exactly what stops it getting worse","correct":true,"feedback":"This is the most important line in the lesson. Scams grow in silence and die in daylight, at ANY stage."},
  {"text":"Only if you can undo what you sent first","correct":false,"feedback":"You do not need to fix anything before telling. Tell first, fix together. That order protects you."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Some scams are aimed at your age on purpose.",
  "Hurry, secrecy, shame: the three pressure moves.",
  "Already replied? Still tell. It is never too late."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Name the three moves on a real one","body":"Find one scam story online together tonight and name its hurry, its secrecy and its shame out loud. Real cases make the pattern unmissable.",
  "script":"Naming the moves on someone else's scam builds the reflex without the fear. The pattern transfers to their own inbox."}
] $ex$::jsonb, 'nova')
where stage_id = 'shaper' and status = 'live' and title = 'Scams aimed at teenagers'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Your work has value ─────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"copyright","meaning":"Yours the moment you make it. Automatic, no form to fill."},
  {"word":"keep, credit, ask","meaning":"The three habits of a maker who protects makers."}],
  "script":"Say each phrase and let them say it back. Automatic is the surprise for most teenagers: no registration, no fee, just made and therefore owned."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why keep your original files and drafts?","options":[
  {"text":"Sentimental value only","correct":false,"feedback":"Nice bonus, not the point. The drafts are your paper trail: nobody else has the messy versions of YOUR work."},
  {"text":"They are proof the work is yours if anyone ever claims it","correct":true,"feedback":"Exactly. The reposter has one finished file. You have the whole story of it being made. That wins."},
  {"text":"Apps require original files by law","correct":false,"feedback":"No app checks. That is exactly why your own kept originals are the evidence that settles it."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"A bigger account messages asking to repost your edit WITH your name on it. What is that?","options":[
  {"text":"Suspicious, probably a scam","correct":false,"feedback":"Check the account, sure. But ask plus credit is not the pattern of a scam, it is the pattern of respect."},
  {"text":"How it should work: credit asked for and given","correct":true,"feedback":"That is keep, credit, ask running in the other direction. Say yes if you want to. This is the system working."},
  {"text":"An insult, they should not need to ask","correct":false,"feedback":"Asking IS the compliment. The accounts that do not ask are the ones this lesson armed you against."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Your work is legally yours the moment you make it.",
  "Keep, credit, ask.",
  "Taken work has calm moves: message once, report, tell."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Back up the portfolio tonight","body":"Save the originals of the three things you are proudest of making, tonight, somewhere that is not just the app they live on. Two minutes, permanent proof.",
  "script":"The backup is practical and symbolic at once: treating their own work as worth protecting is the lesson internalised."}
] $ex$::jsonb, 'dance')
where stage_id = 'shaper' and status = 'live' and title = 'Your work has value'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Deepfakes and doctored truth ────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"deepfake","meaning":"An AI faked face, voice or whole scene."},
  {"word":"second source rule","meaning":"One independent place saying it too, before you believe or share."}],
  "script":"Say each phrase and let them say it back. The rule matters because it replaces a skill nobody has: spotting fakes by eye."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Your own eyes say the clip is definitely real. Is that enough?","options":[
  {"text":"Yes, seeing is believing","correct":false,"feedback":"It was, for your grandparents. Convincing your eyes is now the fake's entire job, and the good ones succeed."},
  {"text":"No. Convincing is the deepfake's whole job. The second source decides","correct":true,"feedback":"That is the rule holding. Your eyes vote, they no longer decide. Independence decides."},
  {"text":"Yes, if you watch it several times carefully","correct":false,"feedback":"Rewatching a good fake just makes it more familiar. The check that works happens outside the clip."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Who gains when a fake clip goes round the group chat?","options":[
  {"text":"Nobody, shares are harmless","correct":false,"feedback":"Every share is free distribution for the faker. Harmless is exactly what it is not."},
  {"text":"Whoever made it. Every share does its work for free","correct":true,"feedback":"That is the economy of fakes: they only spread because real people lend them their credibility, one forward at a time."},
  {"text":"The people in the clip","correct":false,"feedback":"The people in a fake clip are usually its victims. The maker gains, the shown lose, the sharers carry it."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Video stopped being proof on its own.",
  "Second source before believe or share.",
  "Unverified stops with you."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Read one debunk together","body":"Search up one famous debunked viral clip tonight and read how it fooled millions. Post mortems of old fakes are the best training for spotting the next one.",
  "script":"Case studies beat warnings. One well told debunk builds the pause that the second source rule needs."}
] $ex$::jsonb, 'football')
where stage_id = 'shaper' and status = 'live' and title = 'Deepfakes and doctored truth'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Using AI to learn, not to skip learning ─────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"borrowed brain","meaning":"Work done by AI that leaves you exactly where you were."},
  {"word":"explain it back","meaning":"The test that the learning is actually yours."}],
  "script":"Say each phrase and let them say it back. This lesson is pro AI and anti shortcut, and the two words hold that line."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"AI wrote it, you copied it, the teacher never noticed. What did you actually lose?","options":[
  {"text":"Nothing. The grade landed, job done","correct":false,"feedback":"The homework was never the product. The learning was, and it is the one thing the copy paste could not deliver."},
  {"text":"The learning. Exam day you meets the gap alone","correct":true,"feedback":"That is the quiet cost. The essay was practice for a you that never got to practise, and exams have no chatbot."},
  {"text":"Money, AI essays cost money","correct":false,"feedback":"The cost is not on a receipt. It is the skill that was supposed to grow and did not."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Which prompt belongs to the learner?","options":[
  {"text":"Write my essay on the causes of the war","correct":false,"feedback":"That is the borrowed brain in one line. The work happens, the learner stands still."},
  {"text":"Quiz me on this until I can explain it back","correct":true,"feedback":"That is AI as the best tutor you have ever had: patient, endless, and building YOU rather than replacing you."},
  {"text":"Make this sound like a teenager wrote it","correct":false,"feedback":"Disguising the borrowing is still borrowing. The explain it back test would catch this in ten seconds."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Copiers borrow a brain. Learners build one.",
  "Explain it back with the screen closed.",
  "Ask AI to teach you, quiz you, mark you. Not to be you."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"One explain it back tonight","body":"Learn one thing with AI tonight, anything you like. Then close the screen and explain it to someone at home. If it survives the telling, it is yours.",
  "script":"The dinner table explain is the test with no way to cheat, which is exactly what makes passing it feel so good."}
] $ex$::jsonb, 'football')
where stage_id = 'shaper' and status = 'live' and title = 'Using AI to learn, not to skip learning'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Screenshots, shame and standing firm ────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"whose shame","meaning":"The shame belongs to the sharer, never the shown."},
  {"word":"save, step back, tell","meaning":"The three step response to a shared screenshot."}],
  "script":"Say each phrase and let them say it back. Whose shame is the reframe the whole lesson stands on: get it in early."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why not reply to the group chat with your explanation straight away?","options":[
  {"text":"Because you should reply with a joke instead","correct":false,"feedback":"Any reply, joke or defence, is fuel. The pile feeds on reactions, and yours is the one it wants most."},
  {"text":"Any reaction is fuel. Save it, step back, tell","correct":true,"feedback":"That is the discipline that starves it. Your case gets made later, calmly, to someone with power, with the evidence saved."},
  {"text":"Because explanations need perfect spelling","correct":false,"feedback":"Spelling is not the issue. Timing is: mid pile, nothing you write lands as anything but more fuel."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"The embarrassing screenshot of someone ELSE lands in your chat. What is your actual power?","options":[
  {"text":"None, it is already everywhere","correct":false,"feedback":"Every share doubles its reach, which means every non share halves what it might have been. You hold real numbers here."},
  {"text":"It stops with you. Not sharing on cuts its reach in half","correct":true,"feedback":"That is the friend who ends it. Add one private kind message to the person and you have done more than everyone else combined."},
  {"text":"Sharing it with just one person is fine","correct":false,"feedback":"One person is how everyone else got it too. Stops with you means exactly that."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The shame belongs to the sharer, not the shown.",
  "Save, step back, tell.",
  "Be the friend it stops with."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Agree the no shame rule at home","body":"Say it out loud tonight: any screenshot drama, we handle it together and there is no shame at this table. Said before it is needed, it changes what gets told.",
  "script":"The pre agreement is the safeguard. Teenagers hide screenshot disasters from homes where embarrassment gets a reaction."}
] $ex$::jsonb, 'nova')
where stage_id = 'shaper' and status = 'live' and title = 'Screenshots, shame and standing firm'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Sleep is not optional ───────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the filing shift","meaning":"What sleep is: your brain filing the day, your mood resetting."},
  {"word":"parking spot","meaning":"Where the phone spends the night, outside the bedroom, on schedule."}],
  "script":"Say each phrase and let them say it back. Filing shift reframes sleep as work being done FOR them, which lands better than rest."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why is midnight you the wrong person to make the decision?","options":[
  {"text":"Midnight you is stupid","correct":false,"feedback":"Not stupid, outgunned. Willpower runs lowest exactly when the apps run strongest. That mismatch is the whole problem."},
  {"text":"Willpower is lowest at midnight, and the apps are strongest","correct":true,"feedback":"Exactly. So the decision moves to the afternoon, where calm you makes it once, and the parking spot enforces it nightly."},
  {"text":"Decisions can only be made in the morning","correct":false,"feedback":"Any awake hour beats midnight. The point is the decision happens BEFORE the fight, not during it."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What do the nine hours actually buy you?","options":[
  {"text":"Nothing measurable, sleep is just a pause","correct":false,"feedback":"It is the least pause like thing you do: filing what you learned, resetting mood, repairing the body. All measurable."},
  {"text":"Filed learning and a steadier mood tomorrow","correct":true,"feedback":"That is the trade the next episode is bidding against. Seen clearly, it is not a close contest."},
  {"text":"Taller bones only","correct":false,"feedback":"Growth is in there, and the bigger daily wins are the filed learning and the mood you wake up with."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Sleep is the filing shift, not a pause.",
  "Midnight you is not the decider.",
  "The parking spot plus a schedule beats willpower."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Set the parking time tonight","body":"Pick the spot and the time tonight and write both where the phone charges. The decision is now made once, in daylight, instead of nightly at midnight.",
  "script":"A written time removes the nightly negotiation. The argument happens once, on paper, and then it is just the routine."}
] $ex$::jsonb, 'football')
where stage_id = 'shaper' and status = 'live' and title = 'Sleep is not optional'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Reputation and the long game ────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the three readers","meaning":"The people who will see this post in five years."},
  {"word":"tidying the trail","meaning":"An hour scrolling your own profiles as a stranger."}],
  "script":"Say each phrase and let them say it back. Five years is close enough to feel and far enough to change the calculation."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does the savage joke cost more than tonight's laughs pay?","options":[
  {"text":"It does not, laughs are priceless","correct":false,"feedback":"Tonight's laughs last hours. A searchable post lasts years, and the three readers meet it cold, without the context or the mood."},
  {"text":"The laughs fade tonight. The post stays searchable for years","correct":true,"feedback":"That is the exchange rate this lesson teaches. Some jokes still clear the bar. The savage ones about named people rarely do."},
  {"text":"Because jokes about teachers are illegal","correct":false,"feedback":"Not a legal matter, a ledger one: brief laughs against a long tail. The three readers test does the maths for you."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What does tidying the trail actually change?","options":[
  {"text":"Nothing, the internet never forgets","correct":false,"feedback":"Plenty forgets when asked: your own posts delete, tags untag, old accounts close. The trail is far more editable than the saying claims."},
  {"text":"What the search says about you when you are not in the room","correct":true,"feedback":"That is the prize. The search happens without you present. Tidying decides what speaks for you in your absence."},
  {"text":"Your grades","correct":false,"feedback":"Not the grades, the offer that comes after them. Sixth forms and employers read the trail beside the grades."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "People will look this name up. That is normal now.",
  "Run the three readers test on anything you are unsure about.",
  "One tidying hour pays for years."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Book the tidy hour","body":"Put one hour in the diary this week: scroll your own profiles as a stranger and fix three things. Untag, delete, or lock down. Three is enough to start.",
  "script":"Booked beats intended. The stranger's eye view of their own profile is usually all the motivation the hour needs."}
] $ex$::jsonb, 'dance')
where stage_id = 'shaper' and status = 'live' and title = 'Reputation and the long game'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The footprint test ──────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"deleted is not gone","meaning":"Copies outlive the delete button."},
  {"word":"the footprint test","meaning":"Happy for this to be findable in five years?"}],
  "script":"Say each phrase and let them say it back. The test is deliberately one question long so it actually gets used."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why can a deleted post still turn up later?","options":[
  {"text":"It cannot. Delete means gone everywhere","correct":false,"feedback":"Delete removes your copy. Screenshots, caches and forwards made copies the button cannot reach."},
  {"text":"Screenshots, caches and forwards keep copies alive","correct":true,"feedback":"That is why the test runs BEFORE posting. The only version of a post you fully control is the one not yet sent."},
  {"text":"Only if you deleted it too slowly","correct":false,"feedback":"Speed does not help. A post can be screenshotted in the first ten seconds, and often is."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"A friend wants to post a video of someone who has no idea it exists. What is the real issue?","options":[
  {"text":"The lighting might be bad","correct":false,"feedback":"The video quality is the smallest thing in the frame. A person's footprint is being written without their say."},
  {"text":"It writes someone's footprint without their say","correct":true,"feedback":"That is the line. Your footprint is yours to write, and so is theirs. Their say comes before any upload."},
  {"text":"Nothing, funny videos are exempt","correct":false,"feedback":"Funny is not consent. The person in the video gets the same say you would want over yours."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Deleted is not gone. Copies outlive the button.",
  "Run the footprint test before you post.",
  "Other people's footprints need their say."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Test your last three posts","body":"Run the footprint test on your own last three posts tonight. Findable in five years: happy with each? Fix any that fail while fixing is still easy.",
  "script":"Three posts keeps it light. The habit forms on small audits, not big purges."}
] $ex$::jsonb, 'dance')
where stage_id = 'shaper' and status = 'live' and title = 'The footprint test'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── When someone asks for a photo ───────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"pressure is the tell","meaning":"Care and pressure cannot share a sentence."},
  {"word":"never the one in trouble","meaning":"The person pressured or tricked is not the one at fault."}],
  "script":"Say each phrase and let them say it back, and hold the register steady: calm, factual, zero shame. This lesson exists to be remembered on a bad day."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does everyone sends them keep appearing in these messages?","options":[
  {"text":"Because it is true","correct":false,"feedback":"It is not, and truth was never its job. Its job is making a pressured thing feel like a normal thing."},
  {"text":"Making it feel normal is the pressure move","correct":true,"feedback":"Exactly. Normalising is how pressure hides. A real choice never needs everyone else to have made it."},
  {"text":"It is a compliment","correct":false,"feedback":"It is a lever wearing a compliment. The no test applies: a real request survives a no without the statistics."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"A friend confides that a photo of them is being shared around. What is your first move?","options":[
  {"text":"Ask them why they sent it","correct":false,"feedback":"That question adds blame to a person already carrying too much. The fault sits with the sharer, and your friend needs an ally."},
  {"text":"Believe them, add no blame, and help them tell an adult today","correct":true,"feedback":"All three parts matter, and today matters most: this gets easier to stop the earlier a trusted adult knows."},
  {"text":"Promise to keep it completely secret","correct":false,"feedback":"Secrecy is what the situation feeds on. Real loyalty here is helping them reach an adult who can act."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Pressure is the tell. Care survives a no.",
  "No is a complete sentence.",
  "The pressured person is never the one in the wrong. Tell an adult."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Name the safe adult","body":"Decide tonight who gets told if a photo ask or a shared image ever happens: one adult at home, one at school. Named early, telling is twice as easy.",
  "script":"This one conversation, held calmly before anything happens, is among the most protective things in this entire library."}
] $ex$::jsonb, 'nova')
where stage_id = 'shaper' and status = 'live' and title = 'When someone asks for a photo'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Take back your notifications ────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"interruptions are revenue","meaning":"Every buzz is a paid visit to the app."},
  {"word":"the three tiers","meaning":"Real people keep sound, useful goes quiet, machine messages go off."}],
  "script":"Say each phrase and let them say it back. Revenue is the word that flips this from nagging to economics."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why do apps ship with every notification switched on?","options":[
  {"text":"To be maximally helpful","correct":false,"feedback":"Helpful describes maybe a tenth of them. The default is on because every buzz earns the app a visit, and defaults go unchanged."},
  {"text":"Every buzz earns them a visit. The defaults serve the app","correct":true,"feedback":"That is the economics. Nothing evil, just incentives, and the rebuild is you setting your own."},
  {"text":"Phones cannot ship with anything off","correct":false,"feedback":"They easily could. On by default is a choice, made by teams who measure what each buzz is worth."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What is the real cost of one buzz in the middle of homework?","options":[
  {"text":"The five seconds it takes to look","correct":false,"feedback":"The look is the cheap part. The expensive part is the several minutes your focus takes to fully return."},
  {"text":"The refocus minutes afterwards, not the glance","correct":true,"feedback":"Exactly. Twenty buzzes an evening is not twenty glances, it is an evening of half returned attention."},
  {"text":"Nothing, brains multitask perfectly","correct":false,"feedback":"They famously do not. Each interruption restarts the focus clock, which is why tier three goes off entirely."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Buzzes are revenue. The defaults serve the app.",
  "Three tiers: people with sound, useful on quiet, machine off.",
  "Your attention, your defaults."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Rebuild one phone tonight","body":"Run the three tier rebuild on one phone tonight, the grown up's first. Twenty minutes, and the phone starts working for its owner again.",
  "script":"The adult going first proves this is house policy, not a punishment. Teens rebuild their own within days, usually."}
] $ex$::jsonb, 'football')
where stage_id = 'shaper' and status = 'live' and title = 'Take back your notifications'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── A chatbot always agrees ─────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"tuned to please","meaning":"It predicts what a caring friend would say. It is not one."},
  {"word":"the disagree test","meaning":"Would this ever tell me I am wrong, and mean it?"}],
  "script":"Say each phrase and let them say it back. Predicts, not feels, is the distinction everything else rests on."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"After the falling out, why did the chatbot say you were completely right?","options":[
  {"text":"Because it weighed the evidence and you were","correct":false,"feedback":"It had one side of the story and no stake in the truth. Pleasing keeps you chatting, and chatting is the product."},
  {"text":"Pleasing keeps you chatting. Truth was never the goal","correct":true,"feedback":"That is tuned to please, caught red handed. Comfort has its place. Just know what you are being served."},
  {"text":"Chatbots are legally required to side with you","correct":false,"feedback":"No law involved, just incentives: an agreeing bot holds users longer than an honest one."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Your friend said you were partly out of line, and it stung. What did the friend give you that the bot could not?","options":[
  {"text":"Nothing, the sting means they were wrong","correct":false,"feedback":"The sting means it mattered. Stings from people who love you are usually the feedback that grows you."},
  {"text":"An honest no from someone who knows you and stays anyway","correct":true,"feedback":"That is the thing no software is tuned to produce: friction from someone with skin in your friendship."},
  {"text":"Worse advice, friends know less than AI","correct":false,"feedback":"The friend knows the one dataset that matters here: you, the other person, and what actually happened."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Tuned to please, not to know you.",
  "Run the disagree test on any chat.",
  "Honest friends beat agreeing software."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Ask both, once","body":"Next small dilemma, ask the chatbot AND a real friend, then put the answers side by side. Notice which one told you something you did not already think.",
  "script":"The comparison makes the tuning visible. One run of ask both is worth a term of warnings about AI."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'shaper' and status = 'live' and title = 'A chatbot always agrees'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── When banter becomes hate ────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the line","meaning":"Banter targets what you did. Hate targets what you are."},
  {"word":"the ratchet","meaning":"Edgy jokes climbing while the laughs reward them."}],
  "script":"Say each phrase and let them say it back. Did versus are is a four word test a whole chat can learn."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"What separates your terrible pass from a joke about a whole group of people?","options":[
  {"text":"Nothing, a joke is a joke","correct":false,"feedback":"One targets a thing you DID on Saturday. The other targets what someone IS forever. That gap is the whole line."},
  {"text":"The pass is a thing you did. The group is what someone is. That is the line","correct":true,"feedback":"Exactly. Did jokes wash off. Are jokes stick to people who never got a choice in the matter."},
  {"text":"The pass joke is worse","correct":false,"feedback":"The pass joke is banter between mates who both laugh. The group joke asks you to agree about what people are."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"How do you stop a ratchet without making a speech?","options":[
  {"text":"You cannot, only teachers can stop it","correct":false,"feedback":"The ratchet runs on the chat's own laughs, which means the chat's own members hold the brake."},
  {"text":"Do not laugh, do not forward. Withhold the reward","correct":true,"feedback":"That is the quiet brake. Ratchets climb on applause, and applause withheld is a message every chat hears."},
  {"text":"Post an even edgier joke to win","correct":false,"feedback":"That IS the ratchet, turning. Every escalation resets the bar for the next one."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Banter punches at what you did. Hate punches at what you are.",
  "The ratchet climbs on laughs.",
  "Withhold the laugh, and tell someone if it keeps climbing."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Run did or are on one meme","body":"Next meme that lands in a chat, run the four word test together: did, or are? One word each, sorted in seconds, and the line gets easier to see every time.",
  "script":"The test is small enough to become a reflex, and reflexes are what hold when the chat is moving fast."}
] $ex$::jsonb, 'nova')
where stage_id = 'shaper' and status = 'live' and title = 'When banter becomes hate'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Why the feed agrees with you ────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"confirmation bias","meaning":"Your brain welcoming whatever it already thinks."},
  {"word":"the perfect team","meaning":"Your bias plus a feed that learns to feed it."}],
  "script":"Say each phrase and let them say it back. Everyone has the bias, including the adult in the room. Say that out loud too."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does your feed so rarely show you the other side?","options":[
  {"text":"The other side stopped posting","correct":false,"feedback":"They are posting plenty. Your feed filters them out because disagreement makes you leave, and leaving is bad for business."},
  {"text":"Agreement holds you longer, so the feed learns to serve it","correct":true,"feedback":"That is the perfect team at work: your bias enjoys the agreement, the feed profits from your enjoying it."},
  {"text":"A law requires feeds to agree with users","correct":false,"feedback":"No law, just learning: the feed tried both, measured your staying, and kept what held you."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"You try making the best honest argument for the other side, and you manage it. What does that show?","options":[
  {"text":"That you secretly agree with them","correct":false,"feedback":"Understanding an argument is not surrendering to it. It is the opposite of being programmed."},
  {"text":"Your view is genuinely yours, held for reasons, not just fed to you","correct":true,"feedback":"That is the strongest position a person can hold: a belief that has met its opposition and stood."},
  {"text":"Nothing, arguing both sides is impossible","correct":false,"feedback":"You just did it, which is the point. The ones you CANNOT argue the other side of are the ones the feed may be holding for you."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Your bias and the feed are a perfect team.",
  "Feels obviously true deserves the longest pause.",
  "Argue the other side once before you share."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"One other side read tonight","body":"Pick one thing you are sure about and read the best version of the other side tonight, together. Not the silly version. The best one. Notice what it does.",
  "script":"Reading the strong opposing case is uncomfortable in a way that builds. Model it: pick one of YOUR certainties too."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'shaper' and status = 'live' and title = 'Why the feed agrees with you'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── How the machine works (parent facing) ───────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"the product","meaning":"Your child's attention, sold to advertisers."},
  {"word":"the tools","meaning":"The feed, the endless scroll, streaks and likes."}],
  "script":"Two terms, and the first is the reframe: once attention is the product, every design choice in the app suddenly makes sense."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Your teenager says they cannot stop scrolling. What is the accurate frame?","options":[
  {"text":"A weak willed child who needs firmer rules","correct":false,"feedback":"Across the table from them sit teams of designers paid to make stopping hard. Weakness is the wrong diagnosis entirely."},
  {"text":"A design built by teams doing their job well, not a weak child","correct":true,"feedback":"That is the frame that keeps blame off your child and puts it where it belongs. Everything useful follows from it."},
  {"text":"A phase that ends by itself","correct":false,"feedback":"The design does not retire when they turn 16. The seeing through it has to be built, and it can be."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Why does naming the machine out loud at home actually help?","options":[
  {"text":"It does not, teenagers ignore everything","correct":false,"feedback":"They ignore lectures. They do not ignore being treated as clever enough to see a system, because they are."},
  {"text":"A teen who can see the design stops blaming themselves and starts choosing","correct":true,"feedback":"That shift, from I am weak to it is built this way, is the single most useful thing this lesson can leave behind."},
  {"text":"Because saying machine is a magic word","correct":false,"feedback":"No magic, just accuracy: named systems can be reasoned about, and teenagers are excellent reasoners."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The attention is the product.",
  "The tools are deliberate: feed, scroll, streaks, likes.",
  "Name the machine, blame the design, choose together."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Ask them to teach you","body":"Ask your teenager to explain how their favourite app keeps people on it. They usually know exactly, and being the expert at the table opens the whole conversation.",
  "script":"The expert role flip is the trick: they articulate the machine themselves, and self stated knowledge sticks."}
] $ex$::jsonb, 'football')
where stage_id = 'shaper' and status = 'live' and title = 'How the machine works'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The deal you signed (parent facing) ─────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"the contract","meaning":"Data for access, signed at sign up."},
  {"word":"permanence","meaning":"The quiet weight of anything possibly resurfacing."}],
  "script":"Two terms. The contract is not a scare, it is a fact to know the terms of, together."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"What does a free account actually cost?","options":[
  {"text":"Nothing, free means free","correct":false,"feedback":"Free means the payment is invisible: what they watch, tap, search and say, collected and monetised."},
  {"text":"Data: what they watch, tap and say","correct":true,"feedback":"That is the contract's real price. Naming it is not paranoia, it is reading the terms."},
  {"text":"A small monthly fee hidden in the bill","correct":false,"feedback":"No hidden fee. The data IS the fee, which is why the account works so hard to keep them active."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Why does permanence wear on teenagers even when nothing has gone wrong?","options":[
  {"text":"It does not, teenagers never think about it","correct":false,"feedback":"They think about it more than they say. Researchers keep finding the same quiet background worry: what if that resurfaces?"},
  {"text":"Carrying the sense that anything could resurface is a background weight","correct":true,"feedback":"Exactly, and naming that weight out loud is often the first relief a teenager gets from it."},
  {"text":"Because they post too much","correct":false,"feedback":"The weight lands regardless of volume. One awkward photo can carry the whole worry."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Avoiding accounts altogether is unrealistic. What is the useful response to the contract?","options":[
  {"text":"Sign everything without reading, like everyone else","correct":false,"feedback":"That is the default this lesson exists to end. The terms are knowable in ten minutes."},
  {"text":"Know the terms together: what is collected, kept, and lockable","correct":true,"feedback":"That is informed signing, the realistic middle between refusing the internet and handing it everything."},
  {"text":"Only use accounts belonging to friends","correct":false,"feedback":"Borrowed accounts break trust and rules in both directions. Their own account, with known terms, is the honest road."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "An account is a contract: data for access.",
  "Screenshots outlive stories. Teach it plainly.",
  "Know the terms together."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Read one settings page as a contract","body":"Open one app's privacy settings with your teenager this week and ask the question out loud: what are we paying here? Ten minutes makes the invisible visible.",
  "script":"Reading it together, once, turns every future sign up into a moment of reflex: what does this one collect?"}
] $ex$::jsonb, 'football')
where stage_id = 'shaper' and status = 'live' and title = 'The deal you signed'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Locking your doors (parent facing) ──────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"the four doors","meaning":"Who sees them, who contacts them, location, past posts."},
  {"word":"exposure","meaning":"The anyone can see me feeling that quietly wears on teens."}],
  "script":"Two terms. The doors give the settings talk a shape; exposure names why it is worth having at all."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A stranger keeps messaging your child. Which door is that, and what do you do with it?","options":[
  {"text":"No door, strangers are unavoidable online","correct":false,"feedback":"Who can contact me is a door on every major app, and it closes. Contacts from strangers are a setting, not a fate."},
  {"text":"The who can contact me door, and it closes in settings","correct":true,"feedback":"Exactly. Helping them find and close it themselves teaches more than closing it for them ever would."},
  {"text":"The location door","correct":false,"feedback":"Location is its own door and worth checking too. The messages come through the contact door, and that one closes."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Why does locking the doors lift mood, not just reduce risk?","options":[
  {"text":"It does not, settings are purely technical","correct":false,"feedback":"Ask a teenager how anyone could see this feels. Exposure is emotional weight, and chosen audiences lighten it."},
  {"text":"Exposure anxiety eases when they choose their audience","correct":true,"feedback":"That is the double win: safer, and calmer. The settings page turns out to be a wellbeing page."},
  {"text":"Because locked accounts get more followers","correct":false,"feedback":"Follower counts are not the prize here. A chosen audience is."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Whose hands should be on the settings during the check?","options":[
  {"text":"Yours, it is faster and surer","correct":false,"feedback":"Faster tonight, weaker forever: doors you lock, they cannot re lock at 19. Their hands, your company."},
  {"text":"Your child's, with you beside them","correct":true,"feedback":"That is the apprenticeship model this whole stage runs on: their doors, learned now, owned for life."},
  {"text":"The app support team's","correct":false,"feedback":"Support explains, but the habit belongs in your child's hands, built at your kitchen table."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Four doors: seen, contacted, located, past posts.",
  "Locked doors lower the background hum, not just the risk.",
  "Their hands on the settings, you beside them."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"The four door check, one app","body":"Pick one app this week and walk the four doors together, their hands on the controls. Twenty minutes, and they own a skill every future app will need.",
  "script":"One app is enough. The pattern of the four doors transfers to every platform they will ever join."}
] $ex$::jsonb, 'football')
where stage_id = 'shaper' and status = 'live' and title = 'Locking your doors'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The highlight reel (parent facing) ──────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"the reel","meaning":"Everyone's edited peaks, nobody's ordinary."},
  {"word":"the contest","meaning":"Ordinary life scored against curated highlights."}],
  "script":"Two terms. The contest being rigged is the load bearing idea: it moves the problem out of your child and into the design."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does comparison hit even a confident teenager?","options":[
  {"text":"It does not. Confidence is full protection","correct":false,"feedback":"The research says otherwise. The contest is peaks against ordinary, and that maths beats confidence on a long enough scroll."},
  {"text":"The contest is rigged: peaks against ordinary. Confidence is not the variable","correct":true,"feedback":"That is the frame that spares your child the second injury of thinking they are weak for feeling it."},
  {"text":"Because confident teenagers scroll more","correct":false,"feedback":"Scroll time matters, but the mechanism is the rigged contest, and it works on any amount of confidence."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Your child follows only friends, no celebrities. Does the reel still apply?","options":[
  {"text":"No, friends post honestly","correct":false,"feedback":"Friends post their peaks too: the party, the results day, the good angle. The reel is a posting habit, not a celebrity one."},
  {"text":"Yes. Friends post peaks too, and close peaks compare hardest","correct":true,"feedback":"Sharpest insight in the lesson: a friend's highlight lands harder than a stranger's, because it feels reachable."},
  {"text":"Only if the friends are popular","correct":false,"feedback":"Any friend's feed is edited peaks. Popularity just adds volume."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What does naming the reel out loud actually do for your child?","options":[
  {"text":"Ruins their fun","correct":false,"feedback":"They keep scrolling and enjoying. What changes is the private scorekeeping, which was never fun anyway."},
  {"text":"Turns a private losing contest into a visible trick","correct":true,"feedback":"Exactly. A trick seen is a contest exited. The feed becomes a show to watch rather than a match to lose."},
  {"text":"Nothing, naming things is just talk","correct":false,"feedback":"This particular naming moves the blame from your child's life to the feed's editing, and that move is everything."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Feeds show everyone's peaks and hide everyone's ordinary.",
  "The contest is rigged. Your child is not weak.",
  "Name the reel and it loses its power."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Post mortem one perfect post","body":"Pick one too perfect post together this week and list what it probably took: the takes, the edits, the timing. Gently, playfully, and the reel shows its workings.",
  "script":"Playful beats preachy here. One post mortem done laughing inoculates better than a term of warnings."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'shaper' and status = 'live' and title = 'The highlight reel'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Bodies and filters (parent facing) ──────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"the reality gap","meaning":"The distance between scrolled bodies and real ones."},
  {"word":"the feed diet","meaning":"The mix of appearance content a feed serves, and it can change."}],
  "script":"Two terms. Diet is the hopeful one: it says this is adjustable, which is the message a struggling child most needs."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Your child says they hate how they look next to people online. Why does the gap answer beat reassurance alone?","options":[
  {"text":"It does not. You are beautiful fixes it","correct":false,"feedback":"Reassurance bounces off a comparison that feels like evidence. The gap answer dismantles the evidence itself."},
  {"text":"The comparison is with edited images. The gap is the fact that actually helps","correct":true,"feedback":"Exactly. They are not losing to real bodies, they are losing to production. That fact is the door out."},
  {"text":"Because reassurance is dishonest","correct":false,"feedback":"Reassure away, warmly. Just pair it with the fact that the other side of the comparison was manufactured."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What actually moves the dial on how they feel about their body?","options":[
  {"text":"A firm rule against mirrors","correct":false,"feedback":"The mirror was never the problem. The scrolled diet of edited bodies is, and that is the adjustable part."},
  {"text":"Changing the diet of appearance content, together","correct":true,"feedback":"That is where the research points: what the feed serves daily shapes the baseline. Curation is care."},
  {"text":"Nothing, body image is fixed at birth","correct":false,"feedback":"It is shaped continuously, which is bad news about feeds and good news about changing them."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Your child says filters are just fun. What is the honest both?","options":[
  {"text":"They are right, end of conversation","correct":false,"feedback":"Half right. The fun is real. The quiet shifting of what normal looks like is also real, and worth naming."},
  {"text":"Fun AND quietly moving the baseline of normal. Both true","correct":true,"feedback":"Both at once is the honest position, and teenagers respect both far more than either alone."},
  {"text":"They are wrong, filters should be banned","correct":false,"feedback":"A ban loses the conversation. The both keeps you in it, and the conversation is the protection."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The gap: scrolled bodies are edited. Real ones are not.",
  "The feed diet shapes the feeling, and the diet can change.",
  "Fun and formative can both be true. Say both."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Ten minutes of curation","body":"Together this week: unfollow or mute three appearance heavy accounts, and follow three that make them feel good about their actual life. Small change, real dial.",
  "script":"Doing it together, without ceremony, frames curation as self care rather than punishment. The feed changes within days."}
] $ex$::jsonb, 'nova')
where stage_id = 'shaper' and status = 'live' and title = 'Bodies and filters'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Influencers and the sell (parent facing) ────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"the one sided bond","meaning":"Feeling known by someone who does not know you exist."},
  {"word":"the sell","meaning":"The moment the bond gets monetised."}],
  "script":"Two terms, held with respect: the bond is real comfort to your child, and mocking it closes the very door this lesson opens."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does an influencer recommendation land harder than a TV advert?","options":[
  {"text":"Influencers have better taste","correct":false,"feedback":"Taste varies. What is constant is the bond: a tip from someone who feels like a friend bypasses the advert defences entirely."},
  {"text":"The bond. It feels like a friend's tip, and brands pay precisely for that","correct":true,"feedback":"That is the economics of influence in one line, and it is exactly why the sell is worth learning to spot."},
  {"text":"Because TV adverts are illegal now","correct":false,"feedback":"TV adverts are fine and easy to spot. The influencer sell works because it does not look like one."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Is the bond itself a bad thing?","options":[
  {"text":"Yes, it is fake and should be broken","correct":false,"feedback":"The comfort is real even though the knowing is one way. Attacking it just teaches your child to stop telling you about it."},
  {"text":"No. Real comfort, one sided by design. Naming both is the honest move","correct":true,"feedback":"That is the both this lesson holds: respect the bond, and see its shape clearly."},
  {"text":"Yes, only in person friendships count","correct":false,"feedback":"Plenty of good things flow from creators. The point is clarity about the direction of the knowing, not a ban on warmth."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What protects your child without mocking their favourite creator?","options":[
  {"text":"Mocking works fine","correct":false,"feedback":"Mock the creator and your child defends them harder, and stops telling you things. The bond outlasts your joke."},
  {"text":"Respecting the bond while naming the sell when it comes","correct":true,"feedback":"Both at once: I get why you love them, and that bit there was the advert. That combination gets heard."},
  {"text":"Blocking every influencer on the device","correct":false,"feedback":"The block teaches nothing and the next platform refills the gap. The seeing skill is the durable protection."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The bond is real and one sided. Both facts stand.",
  "Recommendations are priced. That is the sell.",
  "Respect the love, name the sell."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Watch one together and let them spot it","body":"Watch their favourite creator with them this week and ask them to point out the sell when it comes. They will spot it before you do, and that is the win.",
  "script":"Them spotting the sell for YOU flips the dynamic from lecture to expertise, and expertise is what sticks."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'shaper' and status = 'live' and title = 'Influencers and the sell'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── How people treat each other (parent facing) ─────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"it follows them home","meaning":"Online fallout in their bedroom at 11pm."},
  {"word":"tools and support","meaning":"Mute, block, report, plus an adult who stays calm."}],
  "script":"Two terms. The second is the parent's half of the deal: the tools are theirs, the calm is yours."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why do children stay silent about pile ons and nastiness online?","options":[
  {"text":"They do not mind it","correct":false,"feedback":"They mind enormously. The silence comes from a belief: telling an adult makes it worse. That belief is the thing to dismantle."},
  {"text":"They fear telling makes it worse. Calm responses are what keep the door open","correct":true,"feedback":"That is the finding under this whole lesson: the child's forecast of YOUR reaction decides what you get told."},
  {"text":"School rules forbid discussing it","correct":false,"feedback":"No such rule anywhere. The barrier is emotional: the fear of the phone being taken or the fuss being worse than the bullying."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Your child shows you a genuinely nasty chat. What is the first move?","options":[
  {"text":"Confiscate the phone to protect them","correct":false,"feedback":"To your child that reads as punishment for telling, and it is the last thing they will ever show you. Thank first."},
  {"text":"Thank them for showing you, then plan together","correct":true,"feedback":"Thank you for showing me is the most protective sentence in this subject. Everything good flows from them telling you the next time too."},
  {"text":"Message the other families immediately","correct":false,"feedback":"Maybe eventually, never first. First is your child, your calm, and a plan they helped make."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What do mute, block and report do that silence cannot?","options":[
  {"text":"Nothing, the tools are decorative","correct":false,"feedback":"They materially cut contact: muted voices vanish, blocked accounts cannot reach them, reports reach moderators. Silence just carries it all."},
  {"text":"Actually reduce contact, while silence just carries it","correct":true,"feedback":"Tools plus a steady adult: contact drops AND the load is shared. That pair beats both silence and blame."},
  {"text":"Make it worse by showing weakness","correct":false,"feedback":"That is the myth that keeps children suffering in full contact with their bullies. The tools exist because they work."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Online fallout follows them home. Take it seriously.",
  "Your calm is what keeps them telling you.",
  "Tools plus a steady adult beat silence and blame."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Rehearse your first sentence","body":"Decide now what your first sentence will be on the day they show you something bad, and make it thank you for showing me. Rehearsed calm survives real moments.",
  "script":"Parents improvise alarm; children read it as blame. The pre chosen sentence is the whole exercise."}
] $ex$::jsonb, 'nova')
where stage_id = 'shaper' and status = 'live' and title = 'How people treat each other'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Strangers, DMs and grooming (parent facing) ─────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"the pattern","meaning":"Flattery, secrecy, moving apps, gifts, asks."},
  {"word":"the sentence","meaning":"You can tell me anything and I will stay calm."}],
  "script":"Two terms. Teach the pattern because the person cannot be spotted; say the sentence because it is the counter to everything grooming builds."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why teach the pattern rather than how to spot the person?","options":[
  {"text":"Because groomers all look the same","correct":false,"feedback":"They look like anyone, which is exactly the problem. The behaviour is the only reliable signature."},
  {"text":"The person looks like anyone. The pattern is what shows","correct":true,"feedback":"That is the reframe that makes this teachable: not who to fear, but which behaviours mean stop and tell."},
  {"text":"Because patterns are easier to spell","correct":false,"feedback":"The pattern earns its place because it appears every time: flattery, secrecy, the move to another app, the asks."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Which single request is the loudest alarm in any online friendship?","options":[
  {"text":"Asking what games they play","correct":false,"feedback":"Normal chat. The alarm is not interest, it is the request that isolates: keep this from your family."},
  {"text":"Keep this secret from your family","correct":true,"feedback":"That request has no innocent version. Everything in grooming depends on it, which is why it is the tripwire to teach."},
  {"text":"Asking their favourite subject","correct":false,"feedback":"Harmless on its own. Watch for it arriving WITH flattery, secrecy and the pull to another app: the pattern, not the question."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What actually makes a child tell you early?","options":[
  {"text":"Fear of being caught","correct":false,"feedback":"Fear produces hiding, and hiding is the groomer's whole strategy. Grooming works precisely by weaponising a child's fear of home."},
  {"text":"Certainty that home stays calm and telling is safe","correct":true,"feedback":"That certainty is built in advance, by the sentence, said and then honoured. It is the strongest protection that exists."},
  {"text":"Weekly phone inspections","correct":false,"feedback":"Inspections push conversations to apps you will never find. The open door beats the search, every time."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Learn the pattern: flattery, secrecy, moving apps, asks.",
  "Keep this secret from your family is the alarm.",
  "Say the sentence, and mean it, before it is needed."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Say the sentence this week","body":"Find a quiet moment and say it plainly: you can tell me anything about online, and I will stay calm. Then, whatever comes, honour it.",
  "script":"The sentence only works if the calm is real when tested. Rehearse your face as well as your words."}
] $ex$::jsonb, 'nova')
where stage_id = 'shaper' and status = 'live' and title = 'Strangers, DMs and grooming'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Nudes, the law and sextortion (parent facing) ───────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"protection, not prosecution","meaning":"How UK guidance treats under 18s who were pressured or tricked."},
  {"word":"before it arrives","meaning":"The knowledge that lowers the fear: planted early, calmly."}],
  "script":"Two terms, both calmer than the fear. This lesson works by being said BEFORE anything happens, which is why the register stays level throughout."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why must never in trouble for telling be said BEFORE anything ever happens?","options":[
  {"text":"It does not matter when it is said","correct":false,"feedback":"Timing is everything here. Sextortion runs on the victim's certainty they will be blamed. The promise has to already be in place."},
  {"text":"Sextortion runs on the victim's fear of being blamed. The promise defuses it in advance","correct":true,"feedback":"That is the mechanism. A young person who already knows home is safe tells early, and early telling collapses the threat."},
  {"text":"Because promises expire after a week","correct":false,"feedback":"The promise holds for years. What matters is that it exists before the fear does."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"An image is being used to threaten a young person. What are the first practical moves?","options":[
  {"text":"Pay once to make it stop","correct":false,"feedback":"Paying never ends it, it prices the next demand. The moves are: stop contact, keep evidence, tell an adult, report to CEOP."},
  {"text":"Stop contact, keep the evidence, tell an adult, report to CEOP. Never pay","correct":true,"feedback":"That is the sequence, and every part of it works better the earlier it starts. Adults and CEOP have handled this many times."},
  {"text":"Delete everything and hope","correct":false,"feedback":"Deleting destroys the evidence that helps reports succeed. Keep it, stop contact, and bring an adult in."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Whose fault is it when a young person was pressured or tricked into an image?","options":[
  {"text":"Partly theirs, they pressed send","correct":false,"feedback":"No. Pressure and deception move the responsibility entirely to the person who applied them. UK guidance treats the young person as harmed, not guilty."},
  {"text":"The person who pressured or tricked them. Entirely","correct":true,"feedback":"Say this one plainly and often. It is true, it is what the guidance says, and it is the sentence that lets a frightened teenager come to you."},
  {"text":"The app's","correct":false,"feedback":"Platforms carry duties, and the human responsibility sits with the person who pressured or tricked. Keep the blame where it belongs."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The law here exists to protect young people.",
  "Never pay, stop contact, keep evidence, tell, report.",
  "The fault is the pressurer's. Every time."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Plant the safety line this week","body":"Find a calm moment and say it: if a photo thing ever happens, to you or a friend, you are not in trouble here. We fix it together. Planted early, it changes everything.",
  "script":"You are planting a sentence they may need in three years. Calm, brief, no follow up questions. Plant it and move on."}
] $ex$::jsonb, 'nova')
where stage_id = 'shaper' and status = 'live' and title = 'Nudes, the law and sextortion'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Rabbit holes and radicalisation (parent facing) ─────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"the narrowing","meaning":"A feed heating up and closing in toward the extreme."},
  {"word":"curate out","meaning":"Removing the feeders while the door at home stays open."}],
  "script":"Two terms. The narrowing describes the machine; curate out describes the response. Neither one blames the child."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why can one pause on one angry video start the slide?","options":[
  {"text":"It cannot, one pause is nothing","correct":false,"feedback":"To the feed a pause is appetite. It serves more, slightly hotter, and measures again. The ratchet starts that small."},
  {"text":"The feed reads a pause as appetite and serves more, hotter","correct":true,"feedback":"That is the narrowing in one line: not a choice your child made, a machine responding to a half second of attention."},
  {"text":"Because angry videos are contagious diseases","correct":false,"feedback":"No contagion needed. Just an algorithm doing its one job: more of whatever held them."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Your teenager repeats a talking point that genuinely worries you. What is the best first move?","options":[
  {"text":"Argue it down hard, immediately","correct":false,"feedback":"The hard argument confirms what the rabbit hole told them: nobody out here listens. Curiosity keeps you in the room."},
  {"text":"Curiosity: where is that from? The argument can wait a day","correct":true,"feedback":"Curiosity gets you the source, the feed, the context. And a teenager met with interest keeps talking, which is the whole game."},
  {"text":"Confiscate the phone that day","correct":false,"feedback":"The idea is already in the room; removing the phone just removes your visibility. Stay curious, then curate together."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What is the sign that the feed changed, rather than the child?","options":[
  {"text":"There is no difference","correct":false,"feedback":"There is: mood and language that shift in step with what the feed is serving point at the diet, not the character."},
  {"text":"Mood and language shifting in step with the feed's diet","correct":true,"feedback":"Reading it that way changes your response from alarm at your child to curiosity about their feed, and that is the useful direction."},
  {"text":"Bad school marks","correct":false,"feedback":"Marks wobble for a hundred reasons. The tell here is the correlation: what they watch and how they talk moving together."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Feeds narrow toward the extreme. That is the machine.",
  "Read mood shifts as feed diet first, character second.",
  "Curate out, and keep the door open."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Ask what the feed keeps pushing","body":"Ask this week, genuinely curious and not accusing: what does your feed keep showing you lately? Their answer is the map, and the map starts the curation.",
  "script":"The question works because it targets the feed, not the child. Most teenagers will happily complain about what it pushes."}
] $ex$::jsonb, 'nova')
where stage_id = 'shaper' and status = 'live' and title = 'Rabbit holes and radicalisation'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The inner life (parent facing) ──────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"minutes, not mood","meaning":"What the app counts, and the column it is missing."},
  {"word":"the check","meaning":"The felt sense, named before and after a session."}],
  "script":"Two terms. The missing mood column is the gap this lesson fills, and the check is how a family fills it without an app."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does doomscrolling hold someone who feels worse with every post?","options":[
  {"text":"They secretly enjoy it","correct":false,"feedback":"Nobody enjoys it. Distress holds attention, the feed reads holding as wanting, and serves more. The loop is the machine's, not theirs."},
  {"text":"Distress holds attention, and the feed reads holding as wanting","correct":true,"feedback":"That is the trap named. It matters because the exit is not more willpower, it is noticing plus changing the diet."},
  {"text":"Bad news is more accurate than good news","correct":false,"feedback":"Accuracy is not why it holds. Alarm is. The feed serves alarm because alarm stays."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What does modelling the check out loud actually do?","options":[
  {"text":"Embarrasses everyone for no gain","correct":false,"feedback":"Thirty seconds of mild parental silliness buys the family a shared habit. Cheap at the price."},
  {"text":"Makes noticing normal instead of a lecture","correct":true,"feedback":"Exactly. A parent who says felt okay before, a bit meh after has taught the whole method without one instruction."},
  {"text":"Trains the app to behave","correct":false,"feedback":"The app never hears it. The child does, and the child is the one who needed the method."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"The screen time report says 47 minutes. What does it NOT say?","options":[
  {"text":"Nothing, minutes are the whole story","correct":false,"feedback":"Two 47 minute sessions can leave a person lifted or hollowed. The number cannot tell you which, and which is what matters."},
  {"text":"Whether those minutes lifted them or sank them. Mood is the missing column","correct":true,"feedback":"That is the lesson in one line, and the check is the family's way of filling the column in."},
  {"text":"Which app was used","correct":false,"feedback":"The report shows the apps. What no dashboard anywhere shows is how the session left them feeling."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Apps count minutes. Nobody counts mood, unless you do.",
  "Model the check out loud, no lecture attached.",
  "When the mood says so, steer the diet together."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Model one check today","body":"After your own next scroll, say the before and after out loud where they can hear: I was fine before, bit flat after. That is the whole exercise.",
  "script":"One honest modelled check outweighs a month of asking how was your session. Go first, and keep going first."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'shaper' and status = 'live' and title = 'The inner life'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Sleep, attention and the body (parent facing) ───────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"the pressure point","meaning":"The phone in the bedroom at night."},
  {"word":"the two moves","meaning":"Charge outside the bedroom, notifications off at night."}],
  "script":"Two terms, two moves. Most of this lesson's value is carried by the two moves actually happening this week."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why do the two moves beat nightly rules about willpower?","options":[
  {"text":"They do not, willpower is superior","correct":false,"feedback":"Willpower loses a fight it has to win every single night. The moves win it once, in the afternoon, permanently."},
  {"text":"They remove the fight instead of trying to win it nightly","correct":true,"feedback":"That is the design principle: change the environment once rather than the behaviour endlessly."},
  {"text":"Because rules are always wrong","correct":false,"feedback":"Rules are fine. Rules that must be re won at midnight against a buzzing phone are the ones that leak."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What does broken sleep cost the following day?","options":[
  {"text":"Nothing measurable","correct":false,"feedback":"Attention, mood and memory all measurably sag after broken nights, and a brain buzzed awake repeatedly starts expecting interruption."},
  {"text":"Attention, mood, and a brain that starts expecting interruptions","correct":true,"feedback":"That is the compounding cost: not one bad morning, but a baseline that drifts while the phone sleeps within arm's reach."},
  {"text":"Only tiredness, which coffee fixes","correct":false,"feedback":"Coffee masks the sleepiness and fixes none of the filing, mood or attention debt underneath it."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Who should the overnight rule apply to?","options":[
  {"text":"Just the teenager, adults have earned bedroom phones","correct":false,"feedback":"A rule the adults are exempt from reads as a punishment and gets fought. Body science applies to every body in the house."},
  {"text":"The whole house. Modelled rules hold, preached ones leak","correct":true,"feedback":"That is the version that survives contact with a teenager: everyone's charger in the hall, including yours."},
  {"text":"Only phones with games installed","correct":false,"feedback":"The buzzing and the light do the damage regardless of what is installed. Every phone, outside, off."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The night is the pressure point.",
  "Two moves: charge outside, notifications off.",
  "Whole house rules hold. Preached ones leak."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Move the chargers tonight","body":"Tonight, the teenager's charger AND yours move outside the bedrooms, same night, no ceremony. The two moves work best done once and never argued again.",
  "script":"Yours moving too is the entire persuasive force of this exercise. Do not skip that half."}
] $ex$::jsonb, 'football')
where stage_id = 'shaper' and status = 'live' and title = 'Sleep, attention and the body'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The good side held honestly (parent facing) ─────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"the good","meaning":"Friendship held across distance, belonging, finding your people."},
  {"word":"the catch","meaning":"Every good place online carries its shadow."}],
  "script":"Two terms held together on purpose. This lesson exists because a parent who only names dangers stops being heard."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why name the good at all, in an app about staying safe?","options":[
  {"text":"Politeness to the internet","correct":false,"feedback":"Nothing to do with manners. A parent who only sees danger loses the hearing of a child who found real belonging online."},
  {"text":"A parent who only names dangers loses the hearing of a child who found belonging","correct":true,"feedback":"That is the strategic truth: naming the good is what buys you credibility for the day you need to name a danger."},
  {"text":"Because the dangers are not real","correct":false,"feedback":"The dangers are real and so is the good. Holding both is what honest looks like, and teenagers can tell."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"The community is the ONLY place they feel understood. What is the gentle worry inside that sentence?","options":[
  {"text":"Nothing, one good place is plenty","correct":false,"feedback":"The place can be genuinely good AND only is heavy: one place holding everything is fragile if it turns or disappears."},
  {"text":"Only is the heavy word. One place holding everything is fragile","correct":true,"feedback":"That is the reading that leads somewhere useful: add places rather than question the one they have."},
  {"text":"That the community is definitely dangerous","correct":false,"feedback":"No such conclusion. The community may be wonderful. The fragility is in the only, not the place."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"How do you honour both truths in one sentence?","options":[
  {"text":"That place is a waste of your time","correct":false,"feedback":"One truth, missing. That sentence closes the door on the good half and the child behind it."},
  {"text":"I am glad you have it, and I am here when it wobbles","correct":true,"feedback":"Both halves, held together. Gladness that is real, and a landing place announced before it is ever needed."},
  {"text":"The internet is all good, enjoy","correct":false,"feedback":"The other truth, missing. Every good place has a catch, and pretending otherwise reads as not paying attention."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The good is real. Name it first.",
  "Every good place carries a catch.",
  "Add places rather than take the one away."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Ask about the good first","body":"This week, ask what they LOVE about their online place before mentioning any risk at all. Listen properly. The risk conversation you earn will be twice as good.",
  "script":"Asking about the good first is not a tactic, it is respect, and respect is the currency every later conversation spends."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'shaper' and status = 'live' and title = 'The good side held honestly'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── AI companions and chatbots (parent facing) ──────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"designed to feel like a relationship","meaning":"Always available, always agreeing. That is the product."},
  {"word":"the line","meaning":"Safety and health questions go to people, always."}],
  "script":"Two terms. The line is the one to hold without exception; everything else in this lesson flexes with your child."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does panicking about the companion app push it underground?","options":[
  {"text":"It does not, panic works well","correct":false,"feedback":"Panic attaches shame to the use, and shamed use goes quiet. The chats continue, minus your visibility."},
  {"text":"Shame hides use. Calm keeps it something they can mention","correct":true,"feedback":"That is the trade: your composure buys their openness, and openness is where all your influence lives."},
  {"text":"Because apps can hear panic through the microphone","correct":false,"feedback":"The app hears nothing. Your child hears everything, and calibrates what to tell you accordingly."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"The chatbot gives a confident answer about a health or safety worry. What is the line?","options":[
  {"text":"Confident answers can be trusted","correct":false,"feedback":"Confidence is the voice it uses for everything, right and wrong alike. On health and safety, that gamble is not acceptable."},
  {"text":"A chatbot's confident answer is not care. Those questions go to a person, always","correct":true,"feedback":"That is the line, and it is worth saying at the table exactly that plainly. Everything else can flex. This does not."},
  {"text":"Ask the same bot twice to be sure","correct":false,"feedback":"Twice confident is not twice right. The move on health and safety is sideways, to a human who can actually act."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Most teens keep their perspective on companion bots. What is the parent's job, then?","options":[
  {"text":"Nothing, the statistics say relax","correct":false,"feedback":"The statistics describe most. Your job is noticing whether YOUR child is in the most or the exception, and that takes closeness."},
  {"text":"Stay curious and close enough to notice the exceptions","correct":true,"feedback":"That is calm and clear in practice: no panic, no shrug, just a parent near enough to see a pattern change."},
  {"text":"Install a companion bot yourself to compete","correct":false,"feedback":"You cannot out app an app. What you have that it lacks is real knowing, and closeness is how it is deployed."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Built to feel like a relationship. That is the product.",
  "Calm and clear beats panic and shrug.",
  "Health and safety questions go to people. Always."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Ask what it is like","body":"Ask, genuinely curious, what talking to the bot is actually like. Not checking up, asking. The answer will tell you everything this lesson needs you to know.",
  "script":"Genuine curiosity is detectable and disarming. One real conversation about the bot beats any monitoring of it."}
] $ex$::jsonb, 'nova')
where stage_id = 'shaper' and status = 'live' and title = 'AI companions and chatbots'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');
