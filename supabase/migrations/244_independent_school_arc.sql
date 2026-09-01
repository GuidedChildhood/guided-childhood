-- The school arc, Independent. (Lesson excellence plan, steps 4 to 6.)
--
-- The final stage of the run started in migration 240. Register is 16 plus,
-- spoken adult to near adult; one deck ("Taking the wheel") is parent
-- facing and held one question, so it gains three. Cosmo, the KS5 host,
-- fronts the AI, data and money decks; Nova takes the meeting people deck.
-- Additive only, guarded on keywords, reapply is a no op. Uses
-- public.gc_add_school_arc from migration 240.

-- ── Calling it out safely ───────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"private first","meaning":"Message the person, not the thread."},
  {"word":"the reply game","meaning":"Attention pushing the pile higher, whoever sends it."}],
  "script":"Say each phrase and let them settle. Private first is the counterintuitive one: doing the most good where nobody sees it."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does even a DEFENDING reply push the pile higher?","options":[
  {"text":"It does not, defences calm things down","correct":false,"feedback":"The algorithm cannot read sides. It reads engagement, and a heated defence is premium engagement, shown to more people."},
  {"text":"The algorithm reads replies as engagement and shows the pile to more people","correct":true,"feedback":"That is the reply game in one line. Your defence recruits the pile a bigger audience. Private first exists because of exactly this."},
  {"text":"Because defenders always type in capitals","correct":false,"feedback":"Typing style is irrelevant. Any reply is fuel, which is why the strong moves happen off the thread."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What does the private message do that the public defence cannot?","options":[
  {"text":"Nothing, public support is worth more","correct":false,"feedback":"Public support feeds the thread that is hurting them. The private message reaches the person clean, with no algorithmic side effects."},
  {"text":"Reaches the person without feeding the pile","correct":true,"feedback":"Exactly. Saw it, it is not okay, I am around. Three clauses, zero fuel, remembered for years."},
  {"text":"It is quicker to type","correct":false,"feedback":"Speed is not the point. Direction is: at the person, not at the audience."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The pile on runs on attention, including yours.",
  "Private first: message the person, not the thread.",
  "Report beats reply when rules are being broken."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Draft the private first message","body":"Write your version tonight and keep it in notes: saw it, it is not okay, I am around. On the day it is needed, the hard part is already written.",
  "script":"A saved draft converts good intentions into a two tap action, which is the difference between meaning to and doing."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'independent' and status = 'live' and title = 'Calling it out safely'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Your news diet ──────────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the chosen three","meaning":"Three sources picked on purpose, by name."},
  {"word":"kept, not informed","meaning":"What the default feed is actually for."}],
  "script":"Say each phrase and let them settle. Kept, not informed is the diagnosis; the chosen three is the prescription."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does outrage travel faster than accuracy?","options":[
  {"text":"Angry people type faster","correct":false,"feedback":"Typing speed is not the mechanism. Outrage HOLDS attention, and the feed promotes whatever holds."},
  {"text":"Outrage holds attention, and the feed serves what holds","correct":true,"feedback":"That is the whole economics of the angry feed. Accuracy has no such advantage, so it needs choosing on purpose."},
  {"text":"Accurate news is illegal to promote","correct":false,"feedback":"Nothing illegal anywhere. Just incentives: the feed profits from holding you, and fury holds."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"A big story is one hour old. What do you know about most of what you are seeing?","options":[
  {"text":"The first hour is the most accurate hour","correct":false,"feedback":"The first hour is the fastest hour, which is nearly the opposite. Verification takes time that virality does not wait for."},
  {"text":"It is the fastest take, not the checked one. Waiting beats being first and wrong","correct":true,"feedback":"That is the discipline of a good news diet: let the chosen three catch up before you believe or post."},
  {"text":"Everything with high views is confirmed","correct":false,"feedback":"Views measure spread. In hour one, spread mostly measures how dramatic the claim is."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The default feed keeps you. It does not inform you.",
  "The chosen three, picked by name, one you disagree with.",
  "First hour news is fast, not checked."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Name your three tonight","body":"Actually pick them tonight and follow or bookmark all three: one solid newsroom, one specialist in what you care about, one thoughtful source you disagree with.",
  "script":"Named and followed is the whole difference between a plan and a preference. Ten minutes, done once."}
] $ex$::jsonb, 'dance')
where stage_id = 'independent' and status = 'live' and title = 'Your news diet'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Creating and getting paid ───────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"licence","meaning":"Permission you grant while keeping ownership."},
  {"word":"in writing","meaning":"The deal, agreed before the work starts."}],
  "script":"Say each word and let them settle. Licence is the professional word this lesson gifts them: use it in every deal from now on."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Exposure to eighty thousand followers: what is it actually worth as payment?","options":[
  {"text":"A lot, exposure builds careers","correct":false,"feedback":"Careers are built on paid work and owned rights. Exposure is a hope with no terms: unenforceable, unmeasurable, and usually unfulfilled."},
  {"text":"Nothing enforceable. Exposure is a hope. A licence and a fee are terms","correct":true,"feedback":"That is the professional read. Happy to license it, here is my rate turns the DM into a deal or reveals there never was one."},
  {"text":"Exactly £80","correct":false,"feedback":"There is no exchange rate because there is no obligation. Terms in writing are what turn promises into payment."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"A competition's terms say all entries become their property. What is that?","options":[
  {"text":"Standard, all competitions work that way","correct":false,"feedback":"Good ones license entries and hand them back. All entries become ours is a rights grab wearing a prize."},
  {"text":"A rights grab, exactly what the rights check exists to catch","correct":true,"feedback":"Caught before entering, it is a choice. Discovered after, your work is gone for the price of a maybe."},
  {"text":"Illegal and impossible","correct":false,"feedback":"Entirely legal if you agree to it. That is why the check happens before the upload, not after."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Copyright is automatic and yours.",
  "Licence. Never hand over ownership by accident.",
  "Money agreed in writing, before the work."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Run the rights check on one real thing","body":"Read the terms of one platform or competition you actually use tonight and find the sentence that says who owns what you upload. It is always in there.",
  "script":"Finding the ownership clause once, in the wild, makes the rights check a reflex for every deal after."}
] $ex$::jsonb, 'cosmo')
where stage_id = 'independent' and status = 'live' and title = 'Creating and getting paid'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Your data, your accounts, your money ────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the master key","meaning":"Your email account. Everything else resets through it."},
  {"word":"urgency plus authority","meaning":"The engine inside nearly every money scam."}],
  "script":"Say each phrase and let them settle. The master key reframes email from boring to critical, which it is."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why is move your balance to a safe account ALWAYS a scam?","options":[
  {"text":"It is not, banks do this in emergencies","correct":false,"feedback":"No bank, ever, asks you to move money to safety. The safe account is the thief's account. This one rule has no exceptions."},
  {"text":"Banks never ask that. The safe account is the thief's","correct":true,"feedback":"Word for word the rule to keep. The entire scam is that sentence, and knowing it makes you immune."},
  {"text":"Because texts cannot come from banks","correct":false,"feedback":"Banks do text. What they never do is ask you to move your balance. The content is the tell, not the channel."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What breaks the urgency plus authority engine every time?","options":[
  {"text":"Arguing with the caller","correct":false,"feedback":"Arguing keeps you on their line, inside their urgency. The break is putting the phone down entirely."},
  {"text":"Hanging up and calling the real number you find yourself","correct":true,"feedback":"That is go direct for money: their channel dies, the real organisation answers, and the truth takes two minutes."},
  {"text":"Asking them to prove they are the bank","correct":false,"feedback":"They will pass your test: name, card digits, confident voice. The only test that works is the number YOU dialled."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Your email is the master key. Secure it first.",
  "Urgency plus authority is the engine of every money scam.",
  "Hang up. Go direct on the number you find yourself."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Secure the master key tonight","body":"Tonight: a long unique password on your email and two step verification switched on. Twenty minutes, and the most protective single act in this whole stage is done.",
  "script":"Everything else in digital security is easier once the master key is safe. Do it tonight, not someday."}
] $ex$::jsonb, 'cosmo')
where stage_id = 'independent' and status = 'live' and title = 'Your data, your accounts, your money'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Meeting people from the internet ────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the first meet plan","meaning":"Public place, someone told, your own way home."},
  {"word":"a feeling is reason enough","meaning":"Leaving needs no evidence and no apology."}],
  "script":"Say each phrase and let them settle. The plan is not suspicion of anyone. It is a seatbelt worn for everyone."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"You are completely sure about this person. Why does the plan still hold?","options":[
  {"text":"It does not, certainty earns exceptions","correct":false,"feedback":"Everyone who was ever wrong felt certain first. That is precisely what makes certainty a bad exemption test."},
  {"text":"You cannot tell which few are not real, and the plan costs nothing when they are","correct":true,"feedback":"That is the seatbelt logic. Real people are never offended by a cafe, and the plan only ever inconveniences the wrong ones."},
  {"text":"Because meeting anyone is a mistake","correct":false,"feedback":"Meeting people from the internet goes well constantly. The plan is what lets it keep going well."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Who gets told about the meet, and when?","options":[
  {"text":"Nobody, you are an adult now","correct":false,"feedback":"Adults with good judgement tell someone. It is not permission, it is a tether: place, time, person, told before."},
  {"text":"Someone you trust, with the place and time, told before, not after","correct":true,"feedback":"That is the middle part of the plan, and the part that costs the least and covers the most."},
  {"text":"The person you are meeting, so they know you are careful","correct":false,"feedback":"They can know you are careful. The TOLD person has to be on your side of the table: a mate, a flatmate, family."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Public place, someone told, your own way home.",
  "Your own transport, both directions.",
  "Leaving is allowed. A feeling is reason enough."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Save the plan template","body":"Write the three part plan into notes tonight: where public, who told, how home. Any future first meet starts from the template instead of from scratch.",
  "script":"Templated safety is safety that actually happens. The plan written calmly today runs itself on an exciting day later."}
] $ex$::jsonb, 'nova')
where stage_id = 'independent' and status = 'live' and title = 'Meeting people from the internet'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Owning your online record ───────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the logged out look","meaning":"Your name searched in a private window, seeing what strangers see."},
  {"word":"clean, then build","meaning":"The two halves of owning the record."}],
  "script":"Say each phrase and let them settle. Build is the half most people forget, and it is the half that pays."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why lock or delete selectively rather than panic deleting everything?","options":[
  {"text":"Panic deleting is faster and safer","correct":false,"feedback":"An empty record answers no questions and raises a few. The goal is a record that is YOURS, not one that is blank."},
  {"text":"The record should end up yours, not empty. Build follows clean","correct":true,"feedback":"That is the whole audit: remove what you would not defend, then plant what speaks for you."},
  {"text":"Deleting anything is impossible","correct":false,"feedback":"Your own posts and accounts delete fine. Selectivity, not impossibility, is the reason to keep some."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What is actually worth building on the record, on purpose?","options":[
  {"text":"Nothing, the safest record is silence","correct":false,"feedback":"Silence leaves your name to be defined by whatever else is out there. Planted work answers for you."},
  {"text":"Work you would defend out loud: projects, skills, things you made","correct":true,"feedback":"That is the record as an asset. The search is coming either way. Build what it should find."},
  {"text":"Daily updates about everything","correct":false,"feedback":"Volume is not the strategy. A few solid, defensible things beat a stream of everything."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Audit logged out. Your own searches flatter you.",
  "Clean what you would not defend out loud.",
  "Then build what speaks for you."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"The logged out look, tonight","body":"Private window, your full name, first two pages of results. Twenty minutes, then a list of three fixes: one delete, one lock, one thing to build.",
  "script":"The three fix list keeps it from becoming a purge or a spiral. Small, concrete, done this week."}
] $ex$::jsonb, 'dance')
where stage_id = 'independent' and status = 'live' and title = 'Owning your online record'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Designing your own digital life ─────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"default or decision","meaning":"The only question that matters about any habit."},
  {"word":"design","meaning":"Choosing your setup before it chooses you."}],
  "script":"Say each phrase and let them settle. Every screen habit they have will sort into one of the two words."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"The 1am video habit nobody chose: default or decision?","options":[
  {"text":"Decision, watching is always a choice","correct":false,"feedback":"Nobody sat down and decided on 1am. Autoplay, the bedside phone and the bottomless feed decided, night after night."},
  {"text":"Default. Autoplay and the bedside phone decided it, not you","correct":true,"feedback":"That is the sort done correctly, and it points straight at the fix: change the setup, not the self talk."},
  {"text":"Neither, it is fate","correct":false,"feedback":"It is the most designable thing in this lesson. Move the phone, kill autoplay, and 1am stops choosing itself."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Why does design matter MORE at university than it does at home?","options":[
  {"text":"It matters less, university has rules","correct":false,"feedback":"University hands you freedom and removes structure in the same week. Nobody is watching, which is exactly when defaults take over."},
  {"text":"Freedom arrives as structure leaves. Your defaults become the only structure","correct":true,"feedback":"That is why this lesson sits in the Independent stage: the design you build now is the structure you take with you."},
  {"text":"Because university wifi is faster","correct":false,"feedback":"The wifi is not the variable. The missing bedtime, the missing dinner table, the missing eyes: those are."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Defaults run most lives.",
  "Ask default or decision, one habit at a time.",
  "Design now for the freedom that is coming."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Redesign one default tonight","body":"Pick the habit that annoys you most and change its environment tonight: the charger location, the autoplay switch, the app on the first screen. Setup, not willpower.",
  "script":"One redesigned default that works is the proof of concept for designing the rest of the digital life."}
] $ex$::jsonb, 'football')
where stage_id = 'independent' and status = 'live' and title = 'Designing your own digital life'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Building with AI ────────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"the brief","meaning":"Context, constraints and examples. What makes AI useful."},
  {"word":"the editor's pass","meaning":"Truth, tone and judgement, before your name goes on it."}],
  "script":"Say each phrase and let them settle. Both are professional skills wearing simple names, and both transfer to any job."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"The AI cover letter reads beautifully, and one line stretches your experience beyond the truth. Ship it?","options":[
  {"text":"Ship it, everyone embellishes","correct":false,"feedback":"The letter carries your name into a room you then have to walk into. The stretched line is the one they will ask about."},
  {"text":"No. Your name, your claim. The editor's pass exists exactly for this","correct":true,"feedback":"That is the pass doing its first job: truth. Fix the line, keep the polish, and the letter is genuinely yours."},
  {"text":"Ship it but apologise at the interview","correct":false,"feedback":"Walking in already explaining is the worst opening there is. The edit costs one minute now."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"When AI gets cheap at producing work, what stays paid?","options":[
  {"text":"Nothing, all work disappears","correct":false,"feedback":"Production gets cheap. Knowing what GOOD looks like, and catching what is wrong, gets more valuable, not less."},
  {"text":"The judgement: knowing what good looks like and catching what is wrong","correct":true,"feedback":"That is the career advice hidden in this lesson: build the judgement, because the judgement is the job."},
  {"text":"Only jobs with no computers","correct":false,"feedback":"Every field keeps its editors, checkers and deciders. The tool changed. The need for judgement did not."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Brief it like a colleague: context, constraints, examples.",
  "Nothing ships without the editor's pass.",
  "Judgement is the job."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"One brief, one pass","body":"Brief AI properly on one real task tonight, then run the editor's pass out loud on what comes back: is it true, is it my voice, would I defend it?",
  "script":"Doing both halves once, deliberately, turns them into the default way of working with the tools."}
] $ex$::jsonb, 'cosmo')
where stage_id = 'independent' and status = 'live' and title = 'Building with AI'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Your identity is yours to write ─────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"already published","meaning":"Screenshots, tags and old accounts. The record exists either way."},
  {"word":"the byline test","meaning":"Your full name under it, in your head, before it goes out."}],
  "script":"Say each phrase and let them settle. The byline test works because it borrows a professional habit: journalists sign their work."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"You talk one way with your mates and another way in interviews. Is that fake?","options":[
  {"text":"Yes, one of them must be the real you","correct":false,"feedback":"Both are the real you, in different rooms. Register is a skill, not a disguise. The byline test is about content, never tone."},
  {"text":"No. Register is normal. The byline test is about content, not tone","correct":true,"feedback":"Exactly. Relaxed with mates, sharp in interviews, same person signing both. What matters is whether you would sign it."},
  {"text":"Yes, always speak formally everywhere","correct":false,"feedback":"Nobody lives like that, and nobody should. Different rooms, same person is the whole model."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Why run the byline test on comments too, not just posts?","options":[
  {"text":"No need, comments disappear","correct":false,"feedback":"Comments are searchable, screenshotable and attached to your name exactly like posts. Smaller box, same byline."},
  {"text":"Comments are searchable and screenshot the same. Everything carries the byline","correct":true,"feedback":"That is the habit at full strength: every box you type into is publishing, and the test costs three seconds."},
  {"text":"Because comments have a word limit","correct":false,"feedback":"Length is irrelevant. Six words under your name can outlive six paragraphs."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "You are already published. Write it on purpose.",
  "Different rooms, same person.",
  "The byline test, before anything goes out."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Byline your last five","body":"Run the test on your last five comments tonight: your full name under each, in your head. Just notice which ones you would happily sign. No purge required.",
  "script":"Noticing without purging keeps this reflective rather than fearful, and the reflex builds either way."}
] $ex$::jsonb, 'dance')
where stage_id = 'independent' and status = 'live' and title = 'Your identity is yours to write'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Real, fake and AI made ──────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"method over instinct","meaning":"The checks beat squinting at pixels, and always will."},
  {"word":"the three checks","meaning":"Source, second source, and does anyone credible confirm."}],
  "script":"Say each phrase and let them settle. Conceding that instinct lost is the honest start; the method is what replaces it."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why is squinting at pixels a losing game?","options":[
  {"text":"Screens are too small to squint at","correct":false,"feedback":"Screen size is not the problem. The fakes improve monthly, and your eyes do not. The method never depended on the fake's quality."},
  {"text":"Fakes improve monthly. The method does not depend on the fake's quality","correct":true,"feedback":"That is why method wins: source, second source, credible confirmation work identically on a clumsy fake and a perfect one."},
  {"text":"Squinting is bad for your eyes","correct":false,"feedback":"Your optician might agree, but the real cost is false confidence: a fake that passes your squint is still a fake."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What does verified actually mean for a shocking voice clip?","options":[
  {"text":"It sounds exactly like the person","correct":false,"feedback":"Sounding right is the one thing AI guarantees. Verification lives outside the clip entirely."},
  {"text":"A credible independent source confirms it happened, not that it sounds right","correct":true,"feedback":"That is the standard. The clip testifies about its own audio. Only the world outside it can testify about the truth."},
  {"text":"It has over a million plays","correct":false,"feedback":"Plays measure how shocking it is, which for fakes is the design spec. Confirmation, not circulation."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Instinct lost. Method wins.",
  "Run the checks outside the clip: source, second source, confirmation.",
  "Unverified stops with you."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Verify one thing today","body":"Take the most shared clip in your feed today and run the three checks. Time it: with practice it is under two minutes, which is cheaper than being wrong in public.",
  "script":"Timing the method proves it is affordable, and affordable methods are the ones that get used."}
] $ex$::jsonb, 'cosmo')
where stage_id = 'independent' and status = 'live' and title = 'Real, fake and AI made'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Your accounts, your locks ───────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"one lock, one door","meaning":"A different strong password for every account."},
  {"word":"the second factor","meaning":"The lock that still holds when a password leaks."}],
  "script":"Say each phrase and let them settle. Locks are the least glamorous topic in this stage and the highest value per minute."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A password leaks from some small forum you forgot you joined. Where does it get tried next?","options":[
  {"text":"Nowhere, small leaks stay small","correct":false,"feedback":"Leaked lists get run against every major service automatically, within hours. That is exactly why reuse is the real risk."},
  {"text":"Everywhere. Leaked passwords are tried against every big service automatically","correct":true,"feedback":"That is the machinery one lock, one door defends against: the forum leak stays a forum problem."},
  {"text":"Only back on the same forum","correct":false,"feedback":"The forum is the least interesting door your password opens. Your email and bank are what the automated tries are for."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What does two step verification actually buy you?","options":[
  {"text":"Nothing, it is security theatre","correct":false,"feedback":"It is the opposite: the single highest value setting in consumer security. A stolen password alone stops working."},
  {"text":"A stolen password alone stops being enough to get in","correct":true,"feedback":"Exactly. The thief needs the thing in your pocket as well as the thing in the leak, and they do not have it."},
  {"text":"Faster logins","correct":false,"feedback":"Marginally slower, honestly. The trade is seconds for the strongest lock available, and it is a bargain."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "One lock per door. Reuse is the real risk.",
  "Two step on everything that matters, email first.",
  "A threat demanding secrecy is the tell. Tell someone."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Two locks tonight","body":"Turn on two step verification for your email and your most used account tonight. Ten minutes, and the two most important doors in your life get the strong lock.",
  "script":"Email first, always: it is the master key. The second account makes it a habit rather than a one off."}
] $ex$::jsonb, 'football')
where stage_id = 'independent' and status = 'live' and title = 'Your accounts, your locks'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Design your own defaults ────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"environment beats willpower","meaning":"The setup wins most days. So design the setup."},
  {"word":"the drift check","meaning":"The monthly look at what crept back."}],
  "script":"Say each phrase and let them settle. Drift is the honest admission that no design lasts unwatched, and it keeps this practical."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Losing an hour to the phone at 1am: what is the design move, as opposed to the discipline move?","options":[
  {"text":"Promising yourself to stop earlier","correct":false,"feedback":"That is discipline, and it fights the same fight every night against a machine that never tires. Design fights once."},
  {"text":"The phone charges outside the room. The fight is won once, in the afternoon","correct":true,"feedback":"That is environment beating willpower: the 1am decision stops existing because the phone is not there to make it."},
  {"text":"A louder alarm in the morning","correct":false,"feedback":"That punishes the symptom. The design move removes the cause: the device within arm's reach at midnight."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Why schedule the drift check at all, if the design works?","options":[
  {"text":"No reason, good designs are permanent","correct":false,"feedback":"Apps update, defaults reset, life changes, and the phone quietly migrates back to the bedside. Drift is the rule, not the exception."},
  {"text":"Apps update and defaults creep back. No design lasts unwatched","correct":true,"feedback":"That is why the check is monthly and fifteen minutes: cheap maintenance on a system that pays daily."},
  {"text":"To have something to feel guilty about","correct":false,"feedback":"No guilt involved. The check asks one operator question per habit: did I choose this? Then it fixes the drifted ones."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Environment beats willpower. Design the setup.",
  "Ask the operator question: did I choose this?",
  "Drift check monthly. No design lasts unwatched."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Calendar the drift check","body":"Put a monthly fifteen minute drift check in your actual calendar tonight, repeating. The design from this lesson survives exactly as long as that appointment does.",
  "script":"An appointment beats an intention. Recurring, named, fifteen minutes: that is the whole maintenance plan."}
] $ex$::jsonb, 'football')
where stage_id = 'independent' and status = 'live' and title = 'Design your own defaults'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The money machine behind the feed ───────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"follow the money","meaning":"The question that explains every feed."},
  {"word":"money mule","meaning":"Letting someone's cash pass through your clean account. A crime with your name on it."}],
  "script":"Say each phrase and let them settle. Money mule needs its real name said out loud, because the offer never uses it."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does follow the money explain a free app better than its own description does?","options":[
  {"text":"It does not, descriptions are accurate","correct":false,"feedback":"Descriptions list features. The money names whose interests the app actually serves, which explains every design choice in it."},
  {"text":"Descriptions list features. The money names whose interests the app serves","correct":true,"feedback":"That is the analyst's question, and it works on every app, platform and offer you will ever meet."},
  {"text":"Because money is the root of all evil","correct":false,"feedback":"No moral judgement needed. Just clarity: paid by advertisers means built for attention. Follow it and the design explains itself."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What does the word GUARANTEED tell you about an investment offer, all by itself?","options":[
  {"text":"That it is safe, guarantees are legally binding","correct":false,"feedback":"Real investments legally CANNOT promise returns. The word appears precisely because the offer is not an investment."},
  {"text":"Real investments cannot guarantee returns. The word itself is the tell","correct":true,"feedback":"One word, full verdict. Anything guaranteeing money multiplication is taking money, not making it."},
  {"text":"That the returns are merely likely","correct":false,"feedback":"It does not soften to likely. In this context the word reliably means scam, and it saves you reading the rest."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Everything on a feed is paid for by someone.",
  "Follow the money before you trust.",
  "Guaranteed returns and account lending are the two tells."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Follow one app's money","body":"Pick one app you use free and work out where its money actually comes from. Ten minutes of searching answers it, and the answer explains the whole app.",
  "script":"One followed trail builds the reflex. After this, free will never read as free again, which is the point."}
] $ex$::jsonb, 'cosmo')
where stage_id = 'independent' and status = 'live' and title = 'The money machine behind the feed'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The privacy line ────────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Words on the board","words":[
  {"word":"two true things","meaning":"Encryption protects everyone. It also shields some harm. Both stand."},
  {"word":"the backdoor problem","meaning":"A way in for the good guys is a way in."}],
  "script":"Say each phrase and let them settle. This lesson refuses a side on purpose: holding both truths IS the position."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why is nothing to hide the weakest position in the whole debate?","options":[
  {"text":"Because everyone has something to hide","correct":false,"feedback":"Closer than it sounds, but the stronger point is about others: privacy protects the vulnerable most, whatever you personally have."},
  {"text":"Privacy protects the vulnerable most: victims, journalists, dissidents. Your comfort is not the measure","correct":true,"feedback":"That is the strongest honest reply: the line is set for everyone it protects, not for the most comfortable person in the room."},
  {"text":"Because hiding things is good","correct":false,"feedback":"Not about hiding being good. About protection being unevenly needed, and rules being set for those who need it most."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What is technically wrong with a backdoor built only for the good guys?","options":[
  {"text":"Nothing, keys can check credentials","correct":false,"feedback":"A door has no idea who is walking through it. Once the way in exists, it exists for everyone clever enough to find it."},
  {"text":"Doors do not check credentials. Any way in exists for everyone who finds it","correct":true,"feedback":"That is the backdoor problem, and it is engineering, not politics: the same maths protects everyone or no one."},
  {"text":"It would be too expensive to build","correct":false,"feedback":"Cost is not the objection. The objection is that built once, it cannot be kept to its intended users."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "Hold two true things at once. Both are real.",
  "The backdoor problem is engineering, not politics.",
  "Argue where the line sits, not which side always wins."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Argue the other end of the line","body":"Take the side you agree with less for ten minutes tonight, with someone at home, properly. The line looks different from both ends, and seeing that is the skill.",
  "script":"Steel manning the other side of a live civic debate is sixth form citizenship at its best. Enjoy the argument."}
] $ex$::jsonb, 'cosmo')
where stage_id = 'independent' and status = 'live' and title = 'The privacy line'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Taking the wheel (parent facing) ────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"The words that matter","words":[
  {"word":"the passenger seat","meaning":"Available, watching the road, never gripping the dashboard."},
  {"word":"four levers","meaning":"Breaks, curation, platform choices, and asking for help. Now theirs."}],
  "script":"Two terms for the last handover of the pathway. The passenger seat is a real place: still in the car, no longer driving."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does the built in protection stepping back at this age matter?","options":[
  {"text":"It does not, the safeguards continue forever","correct":false,"feedback":"The Children's Code protections are strongest for younger children by design. What replaces them is the judgement you spent five stages building."},
  {"text":"The safeguards fade by design. Their own judgement is the replacement, and it needs handing over","correct":true,"feedback":"That is the whole logic of the pathway landing at once: the training wheels come off because the balance was built."},
  {"text":"Because 17 year olds cannot be protected","correct":false,"feedback":"They can be, and increasingly by themselves: that is what the four levers in their hands are for."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What does gripping the dashboard look like, from the passenger seat?","options":[
  {"text":"Being available when asked","correct":false,"feedback":"That is the passenger seat done right. The grip looks different: checking, quizzing, hovering."},
  {"text":"Checking their feeds and quizzing every choice: control wearing concern","correct":true,"feedback":"Named honestly so it can be resisted. The grip feels like love from the front seat and reads as distrust from the driver's."},
  {"text":"Sitting in the back seat instead","correct":false,"feedback":"The back seat is disengagement, the other failure mode. Passenger seat: present, watching the road, hands off the wheel."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What is the one thing to make unmissably clear as you hand over the wheel?","options":[
  {"text":"That you will be checking up regularly","correct":false,"feedback":"That undoes the handover in the same breath. The message that matters is about what happens when something goes wrong."},
  {"text":"Coming to you with a problem will always be met with help, not I told you so","correct":true,"feedback":"That is the sentence that keeps a 19 year old calling home when it matters. It is the last and best safeguard you install."},
  {"text":"That the wifi password changes weekly","correct":false,"feedback":"The wifi was never the relationship. The open door is, and it is the thing to say out loud."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three lines","points":[
  "The built in safeguards step back by design.",
  "Four levers, now theirs: breaks, curation, choices, asking for help.",
  "Passenger seat: available, never gripping."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Offer the wheel out loud","body":"Say it this week, in these words or yours: it is yours to run now, and if anything ever goes wrong, coming to me gets help, never a lecture. Then let go.",
  "script":"The letting go is the lesson. Everything the pathway built was for this handover, and saying it out loud completes it."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'independent' and status = 'live' and title = 'Taking the wheel'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');
