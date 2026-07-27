-- Migration 109: 13 plus Social Media Literacy, school lessons 1 to 4
--
-- Seeds four public.school_lessons rows (the classroom and kid via missions
-- version) of the KS3 curriculum, built from the Version A "schools in depth"
-- seven beat lessons in content/curriculum/social-media-13plus. Host Orbit,
-- DiGi is the through line guide who closes each deck. Mirrors the row shape
-- of 033_full_curriculum.sql exactly. British English, no dashes in copy.
--
--   sm13-01-how-the-machine-works   sort 101   efcw {5,6,7}
--   sm13-02-the-deal-you-signed     sort 102   efcw {7,3}
--   sm13-03-locking-your-doors      sort 103   efcw {7,2}
--   sm13-04-the-highlight-reel      sort 104   efcw {1,6}

-- Module 1: How the machine works
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-01-how-the-machine-works', 'How the machine works', 'KS3', 'Years 7 to 9', 'teacher',
  '{5,6,7}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'Attention economy and addictive design research',
  'I can name how social media is designed to keep me scrolling, and one thing I do about it.',
  'Orbit', 101,
  $sm1$[
 {
  "type": "title",
  "eyebrow": "KS3 · Years 7 to 9 · Module 1",
  "title": "How the machine works",
  "body": "One hour on the design behind your feed: why a quick check turns into an hour, and how you take the wheel back.",
  "script": "Settle the room, then the opener: hands up if you have ever opened an app to do one thing and looked up half an hour later, still not having done it. Take the laughs. Today we find out exactly why that happens, and it is not because anyone here is weak willed. There is a design behind it, and by the end you will be able to name every part.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can name how social media is designed to keep me scrolling, and one thing I do about it.",
  "why": "Every feed you open is built to hold your attention, because your attention is what the app sells. That is not a conspiracy, it is just the business. Once you can see the design working on you, it loses half its grip, and you get to steer instead of being steered.",
  "gains": [
   "Say in one sentence why a free app is free",
   "Name the six design tools that hold your attention",
   "Spot which tool is working on you in a real moment",
   "Choose one setting or habit that takes control back"
  ],
  "script": "Read the mission and the why aloud. Set the ground rules now: we talk about the design and the scenarios, never about each other, and no personal disclosures. If anything today worries you about yourself or a friend, the last slide shows exactly where to go.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Squad words for today",
  "words": [
   {
    "word": "attention economy",
    "meaning": "The business where your watching time is the product. The app is free because advertisers pay for your attention."
   },
   {
    "word": "algorithm",
    "meaning": "The recipe that decides what your feed shows next. It picks what keeps you watching, not what is true or good for you."
   },
   {
    "word": "infinite scroll",
    "meaning": "A page with no end, where the next thing plays itself, so there is no natural place to stop."
   },
   {
    "word": "dark pattern",
    "meaning": "A design built to trick you, like hiding the off switch. The ICO Children's Code bans the worst of these for under 18s."
   }
  ],
  "script": "Say each word, class repeats it. Take the fear out of algorithm early: it is just a recipe. Dark pattern is the one to linger on, because the fact the law bans them tells you they are real and deliberate, not an accident.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Do now. Apps like TikTok and Snapchat cost nothing to download. Why are they really free to use?",
  "options": [
   {
    "text": "Because you are not the customer, your attention and your data are the product being sold to advertisers",
    "correct": true,
    "feedback": "Exactly. If you are not paying, you are not the customer. Your attention is what the app sells, so its whole design is built to keep you giving it."
   },
   {
    "text": "Because the companies are being generous and just want you to have fun",
    "correct": false,
    "feedback": "A company that size does not run on kindness. The app is free because there is something valuable it collects from you: your attention and your data."
   },
   {
    "text": "Because a few adverts cover the cost and they collect nothing else from you",
    "correct": false,
    "feedback": "Adverts are part of it, but the reason they can charge for those adverts is the profile they build from what you watch, tap and skip."
   }
  ],
  "script": "Retrieval starter. Thirty seconds of thinking time, then hands up, then cold call two pupils for the reasoning. Collect three answers on the board and tell the class we will come back to them at the end.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🎯",
  "heading": "The whole thing in one sentence",
  "body": "Here it is in a line. The app is designed to hold your attention, because your attention is what it sells. It is not built to look after you. That does not make it evil, it makes it a business doing its job. And once you can see the design, you get to be the one steering it.",
  "script": "Say the sentence slowly, twice. The reframe to land: nobody in this room is weak for struggling to put it down. The machine is very good at holding on. Seeing how it works is the first move back to control.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "stat",
  "figure": "Almost all",
  "claim": "Almost all UK teenagers use social media or video sharing platforms, so nearly everyone in this room meets these design tools most days.",
  "source": "Ofcom Children and Parents: Media Use and Attitudes, 2024",
  "script": "Let it land, then reframe: this is not a lesson about some other kid's problem. Almost all of us step into this design daily, which is exactly why knowing it matters. Equipment, not a telling off.",
  "phase": "teach",
  "minutes": 1
 },
 {
  "type": "concept",
  "emoji": "🧰",
  "heading": "The six tools it uses",
  "body": "The app holds you with six tools. One, the algorithm, it shows what keeps you watching, not what is true. Two, infinite scroll and autoplay, the page never ends and the next thing plays itself. Three, notifications, timed to tap you on the shoulder and pull you back. Four, streaks, they turn using the app into a duty you feel bad breaking. Five, the business model, you are the product, not the customer. Six, dark patterns, the off switch is hard to find on purpose.",
  "script": "Reveal them one at a time so working memory can keep up. Ask which one pupils recognise most. The point to hold: none of these is an accident, all of it is designed, and naming a tool as it happens is the whole skill.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "diagram",
  "heading": "The just one more spiral",
  "caption": "Watch how four tools work together in a single ordinary evening. Nobody did anything wrong here.",
  "steps": [
   {
    "emoji": "🔔",
    "title": "A notification pulls you in",
    "text": "Someone you follow just posted. You only meant to check one message."
   },
   {
    "emoji": "▶️",
    "title": "Autoplay starts the next one",
    "text": "The next video plays before you decide to watch it. No stop was offered."
   },
   {
    "emoji": "🎯",
    "title": "The algorithm serves your thing",
    "text": "It learned what holds you, so every clip is exactly tuned to keep you there."
   },
   {
    "emoji": "🕘",
    "title": "Twenty minutes vanish",
    "text": "You look up, the time is gone, and you never sent the message you came for."
   }
  ],
  "script": "Walk the spiral as it builds. The line to land: I did nothing wrong, four design tools did their job. Naming them as they happen is how you break the spiral. Trace it once more with the class.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "choice",
  "question": "Hinge question. An app shows you a video you never searched for, on a topic you once paused on for three seconds. Which tool is that?",
  "options": [
   {
    "text": "The algorithm, learning from what held your eyes and serving more of it",
    "correct": true,
    "feedback": "That is the algorithm. It read your pause, not your mind. Even the tiny clue of stopping for three seconds is enough to teach it what to serve."
   },
   {
    "text": "Notifications, tapping you on the shoulder",
    "correct": false,
    "feedback": "Notifications pull you back into the app. This is about what you see once you are inside, and that is chosen by the algorithm."
   },
   {
    "text": "Dark patterns, hiding the off switch",
    "correct": false,
    "feedback": "Dark patterns hide the exit. Choosing which video appears next from your behaviour is the algorithm's job."
   }
  ],
  "script": "Whole class check, hold up your answer. Do not move on below about 80 percent. If they miss it, back to the diagram, the algorithm is the tool that chooses what appears.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item",
  "platform": "message",
  "handle": "Teo ⚽",
  "avatar": "⚽",
  "meta": "Squad chat · 21:47",
  "text": "swear i opened it to reply to you and that was it. one video. now its nearly ten and i havent even started the maths. how does that keep happening",
  "prompt": "Use the six tools to explain to Teo exactly what happened. Which tools were working on him, and what is one move that takes control back?",
  "script": "Pair talk, thirty seconds, then take answers. The class should narrate it now: a notification pulled him in, autoplay served the next, the algorithm kept him there. The point: Teo is not weak and not in trouble. He was up against a design he could not see. Now he can see it.",
  "phase": "practise",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "practise",
  "minutes": 3,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "Three quick scenarios. A broken streak ruins someone's morning. An advert seems to know a private conversation. A two hour session that started as one message. For each, name the design tool, and name one move that takes control back.",
  "lookFor": "Pupils naming the tool correctly (streaks, the business model and data, autoplay) and pairing it with a real move: notifications off during homework, autoplay off, a stop set before you start. The win is tool plus countermove, not just spotting the trap.",
  "script": "Guided practice. Model the first scenario with the class, then let pairs do the other two. Two minutes on the timer. Circulate and grab one strong tool plus move pairing from each side of the room to share back."
 },
 {
  "type": "tryit",
  "heading": "Write your own how it held me",
  "body": "On your own, no names and nothing personal you do not want to write. Think of a real recent session. Which of the six tools were working on you? Then write one setting or habit you will change: notifications off during homework, autoplay off, or a stop you set before you start rather than during. Ten minutes. I am collecting the analysis, not the personal detail.",
  "script": "Independent application. Six tools stay on the board. Support pupils get sentence starters, the tool working on me was, my move is. Stretch question for early finishers: why can moderate use still be perfectly fine? Circulate and collect one brilliant analysis to read out.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Exit check. This is the lesson outcome, so show what stuck. Which answer names the design AND a real countermove?",
  "options": [
   {
    "text": "The app is built to hold my attention, and my move is to turn autoplay off so the next video does not choose itself",
    "correct": true,
    "feedback": "That is it, said like someone who can see the design. You named why it holds you and one move that takes the wheel back."
   },
   {
    "text": "The app is just fun and there is no design behind it, so there is nothing to change",
    "correct": false,
    "feedback": "There is a design, and you can name six parts of it now. Seeing it is exactly what lets you choose one thing to change."
   },
   {
    "text": "The app is evil so I should delete everything and never go back on",
    "correct": false,
    "feedback": "The app is a machine doing its job, not a monster, and plenty of what it holds is good. The skill is steering it, not fearing it."
   }
  ],
  "script": "Silent, independent exit check, and this is your evidence for the register. A pupil who picks the first answer has met the outcome. Anyone tempted by the third needs the calibration point again: seeing the design, not fearing the device.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "The app is free because your attention is the product it sells to advertisers.",
   "Six tools hold you: the algorithm, infinite scroll and autoplay, notifications, streaks, the business model and dark patterns.",
   "There is no stop built in on purpose, so the stop has to come from you.",
   "The app is built to hold my attention, not to look after me. Now I can see the design, so I can steer it."
  ],
  "script": "Return to the three entry answers on why the app is free. Ask which one holds up now. Recap read by pupils, one point each. Finish with the headline said back to you as a class.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi wraps it up",
  "lines": [
   "Squad, you just saw the whole machine! ⭐",
   "The app is built to hold your attention, not to look after you. Six tools, and now you can name every one.",
   "Your mission this week: catch one tool working on you, autoplay or a notification, and name it out loud. It loses half its grip the second you do.",
   "Next time Orbit opens the settings and locks the doors, so the machine reaches you less in the first place. Shine on!"
  ],
  "script": "Let DiGi close it, the bubbles appear on their own. While it plays, pupils write their commitment line: one setting or habit they will change this week. If anything today worried them, remind them of a trusted adult here, or Childline on 0800 1111.",
  "phase": "close",
  "minutes": 2
 }
]$sm1$::jsonb,
  '[]'::jsonb,
  $sm1${
 "retrieval_starter": {"questions": 1, "auto_marked": true},
 "in_lesson_checks": {"count": 1, "auto_marked": true},
 "exit_quiz": {"questions": 1, "auto_marked": true},
 "teacher_judgement": {"scale": ["working_towards", "met", "exceeded"], "one_tap": true, "default": "met"},
 "action_commitment": {"captured": true, "revisited_next_lesson": true}
}$sm1$::jsonb,
  $sm1${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned that a free app is free because their attention is the product, and named the six design tools that hold it: the algorithm, infinite scroll and autoplay, notifications, streaks, the business model and dark patterns. They pulled apart a just one more spiral and chose one setting or habit to take control back.",
 "try_this": "Sit together for five minutes of a feed, yours or theirs, and name the design tools out loud as a team, not a telling off. That is autoplay. That is a notification. Then let your child explain why the app is free. They know the whole thing now.",
 "family_question": "Which design tool holds you the most, and what is one small thing you could change about it?",
 "no_login_required": true
}$sm1$::jsonb,
  $sm1${
 "learning_objective": "Pupils can name how social media is designed to hold their attention (the six tools) and name one countermove they will use.",
 "timing": "About 55 minutes: starter 8, cycle one (one sentence and the six tools) 6, cycle two (the spiral, worked and checked) 6, practise 15, prove 2, close 4.",
 "misconceptions": [
  "The app is free out of kindness (it is free because your attention and data are the product sold to advertisers).",
  "I have no design working on me if I do not click anything (watch time and even a three second pause are enough for the algorithm to learn from).",
  "The app is evil and I should quit entirely (it is a machine optimised for attention, and moderate, eyes open use is fine: the skill is seeing the design, not fearing the device)."
 ],
 "differentiation": {
  "support": "Keep the six tool cards visible and give pairs sentence starters: the tool working on me was, my move is. Model the first guided scenario fully before pairs take the other two.",
  "stretch": "Ask why moderate use can still be perfectly healthy (Przybylski Goldilocks) so the lesson never tips into abstinence, or ask pupils to explain which tool would be hardest to give up and why."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Reveal the six tools as cards on the board, draw the spiral as four arrows and narrate it, and run the choices as read aloud questions with corner voting. The independent how it held me task needs no screen.",
 "keywords": [
  {"word": "attention economy", "definition": "The business where your watching time is the product. The app is free because advertisers pay for your attention."},
  {"word": "algorithm", "definition": "The recipe that decides what your feed shows next. It picks what keeps you watching, not what is true or good for you."},
  {"word": "infinite scroll", "definition": "A page with no end, where the next thing plays itself, so there is no natural place to stop."},
  {"word": "dark pattern", "definition": "A design built to trick you, like hiding the off switch. The ICO Children's Code bans the worst of these for under 18s."}
 ],
 "commitment_stem": "My move this week: I will..."
}$sm1$::jsonb,
  $sm1${
 "required": false,
 "note": "Not a sensitive module, but if a pupil's independent work discloses compulsive use affecting sleep or mood, follow the school's normal pastoral route."
}$sm1$::jsonb
)
on conflict (module_id) do nothing;

-- Module 2: The deal you signed
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-02-the-deal-you-signed', 'The deal you signed', 'KS3', 'Years 7 to 9', 'teacher',
  '{7,3}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'UK GDPR Article 8 and digital footprint permanence',
  'I can explain what I am really agreeing to when I make an account, and one thing I do to protect my future self.',
  'Orbit', 102,
  $sm2$[
 {
  "type": "title",
  "eyebrow": "KS3 · Years 7 to 9 · Module 2",
  "title": "The deal you signed",
  "body": "One hour on the small print behind that I agree button: what you hand over, what really lasts, and how you protect your future self.",
  "script": "Opener: hands up, who has ever tapped I agree without reading a word of it? Everyone. Nobody reads it, and that is fine, but today we read it together, because that tap is you signing a deal, and it is worth knowing your side of it.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can explain what I am really agreeing to when I make an account, and one thing I do to protect my future self.",
  "why": "Making an account is signing a contract. You hand over your data and your attention, and the platform keeps a record of you. Knowing what is really in that deal, and that nothing is guaranteed gone or fully private, hands the choice back to you. You post on purpose, not by accident.",
  "gains": [
   "Explain why making an account is signing a contract",
   "Say why 13 is a data line, not the age you are ready",
   "Explain permanence and context collapse with a real example",
   "Name one habit or setting that protects your future self"
  ],
  "script": "Read the mission and the why. Set the ground rules: we talk about the deal and the scenarios, not about each other, and nobody has to share anything they have posted. Point to the last slide for where to go if anything worries them.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Squad words for today",
  "words": [
   {
    "word": "contract",
    "meaning": "An agreement with two sides. When you tap I agree, you are signing one, even if you never read it."
   },
   {
    "word": "UK GDPR Article 8",
    "meaning": "The data protection law that sets 13 as the age you can agree to your own data being collected and used."
   },
   {
    "word": "permanence",
    "meaning": "Once something is out, you cannot fully guarantee it is gone. Screenshots and copies outlive the delete button."
   },
   {
    "word": "context collapse",
    "meaning": "When one post is seen by every part of your life at once: family, school and strangers, an audience you never pictured."
   }
  ],
  "script": "Say each word, class repeats it. Article 8 sounds dry, so make it plain: 13 is a data line, not a maturity line. Context collapse is the one they will not have a word for yet, so give them a picture, one photo seen by nan, a teacher and a stranger in the same minute.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Recall from last time. Why is a free app free to use?",
  "options": [
   {
    "text": "Because you are not the customer, your attention and your data are what it sells",
    "correct": true,
    "feedback": "Exactly, and that is the doorway into today. If the app is collecting your data to sell, it is worth knowing what you agreed to hand over."
   },
   {
    "text": "Because the company is being generous",
    "correct": false,
    "feedback": "Not generosity. The app is free because your attention and data are valuable, which is exactly why the deal you sign matters."
   },
   {
    "text": "Because there is no cost to running an app",
    "correct": false,
    "feedback": "Running an app that size costs a fortune. It is paid for by what they collect from you, and that is the deal we read today."
   }
  ],
  "script": "Retrieval starter, links straight to Module 1. Thirty seconds thinking, hands up, cold call the reasoning. Then the pivot: so if they are collecting your data, what exactly did you agree to give them? Hold that thought.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "✍️",
  "heading": "Making an account is signing a contract",
  "body": "That I agree button is not just a login. It is you signing a contract. You agree to terms almost nobody reads, and in return the platform collects what you do: how long you watch, what you tap, who you talk to. It builds a profile of you from all of it. Not scary. Just true, and worth knowing before you sign.",
  "script": "Kill the idea that an account is just a username and password. It is an agreement with two sides. Ask: what do you think is on your side of the deal? Take a few, then reveal it is your data and your attention.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🎂",
  "heading": "Why 13, really",
  "body": "Here is the bit almost everyone gets wrong. Thirteen is not the law saying you are ready or mature. It is UK GDPR Article 8. Thirteen is simply the age you are allowed to agree to your own data being collected and used. It is a data protection line, not a maturity judgement. The House of Commons Library sets it out plainly.",
  "script": "This is the core correction of the lesson. Say it slowly: 13 is your call on your data, not a badge that says you are ready. It reframes the whole birthday. Ask the class why they think people mix these two up.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🗂️",
  "heading": "What they quietly collect",
  "body": "Beyond what you post, the app collects the quiet stuff: how long you watch each thing, what you skip, what you rewatch, who you message, when you are online. It builds a profile from all of it. The law, through the ICO Children's Code, says services should be clear with children and put your interests first, but a lot of what is collected is still hard to see.",
  "script": "The point to land: you are not only handing over the photo you posted, you are handing over the pattern of everything you do. Ask which of those clues surprises them most. The hidden watch time usually lands hardest.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item",
  "platform": "feed",
  "handle": "someone.you.know",
  "avatar": "📸",
  "meta": "Story · disappears in 24 hours",
  "text": "posted this to my story, itll be gone by tomorrow anyway so it doesnt matter 🤷",
  "image": "🖼️",
  "prompt": "They think this photo vanishes in 24 hours. Vote: is it really temporary? What could happen to it after the story disappears?",
  "script": "Run the vote, temporary or not. Then the reveal: a friend screenshots it, so now there is a copy the poster does not control. The story vanished, the photo did not. That is permanence, and it is the hinge of the whole lesson.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "What actually happens to a post",
  "caption": "The poster did nothing wrong and broke no rule. They just did not know the deal.",
  "steps": [
   {
    "emoji": "📤",
    "title": "You post it",
    "text": "You picture your mates seeing it, and only for a day."
   },
   {
    "emoji": "📸",
    "title": "A friend screenshots it",
    "text": "Now there is a copy you do not control. That is permanence."
   },
   {
    "emoji": "👀",
    "title": "The whole audience sees it",
    "text": "Your nan, your form tutor and a stranger, all in the same minute. That is context collapse."
   },
   {
    "emoji": "⏳",
    "title": "Two years later it resurfaces",
    "text": "It turns up in a group chat, long after you forgot it. The deal never expired."
   }
  ],
  "script": "Walk the four steps. The line to land: the photo was never really temporary, and the audience was never really just your mates. Naming that before you post is the skill. Trace it once more with the class.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "choice",
  "question": "Hinge question. Under UK law, why is 13 the age you can make your own account?",
  "options": [
   {
    "text": "Because it is the age you can consent to your own data being processed",
    "correct": true,
    "feedback": "Exactly. UK GDPR Article 8. It is a data protection line, not a judgement that you are suddenly mature."
   },
   {
    "text": "Because you are mature enough at 13",
    "correct": false,
    "feedback": "This is the common mix up. Thirteen is not about being ready, it is the age the law lets you agree to your own data being used."
   },
   {
    "text": "Because the apps themselves decided it",
    "correct": false,
    "feedback": "The apps did not pick it, the law did. It comes from UK GDPR Article 8, about consent to your own data."
   }
  ],
  "script": "Whole class check on the core correction. Hold up your answer. Do not move on below about 80 percent, this one matters. If they miss it, back to the why 13 slide.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "practise",
  "minutes": 3,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "Three scenarios. A disappearing photo that did not disappear. An old post from Year 7 read by a college years later. A free app, and the question, if I am not paying, what is it collecting from me? For each, name what is really going on: the contract, permanence or context collapse, and name one move that protects the person.",
  "lookFor": "Pupils naming the right idea (permanence, context collapse, the contract and data collection) and pairing it with a protective move: a private account, thinking before tapping I agree, or a future self test. The win is the correct name plus a real move.",
  "script": "Guided practice. Model the first scenario with the class, then pairs do two and three. Two minutes on the timer. Circulate and collect one strong pairing from each side of the room to share back."
 },
 {
  "type": "tryit",
  "heading": "Build your future self test",
  "body": "On your own, nothing personal you do not want to write. Design a test you could run before posting anything. Write three questions you would ask yourself, for example, who could end up seeing this, would I mind it being screenshotted, would I be fine with it turning up in two years. Then write one setting or habit that protects your data: a private account, reading what an app asks to access, or thinking before you tap I agree. Ten minutes. I am collecting the thinking, not anything you have posted.",
  "script": "Independent application. Four cards stay on the board. Support pupils get the three question stems ready made and just explain them. Stretch: does the age 13 rule actually protect children well, or just move the problem? Circulate and collect one brilliant future self test to read out.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Exit check. This is the lesson outcome. Which answer explains the deal AND names a real protective move?",
  "options": [
   {
    "text": "Making an account hands over my data and a post can last, so I will run a future self test before I post anything",
    "correct": true,
    "feedback": "That is it. You explained the deal, permanence and all, and named one move that protects the you of two years from now."
   },
   {
    "text": "Once I press delete it is completely gone, so there is nothing to protect",
    "correct": false,
    "feedback": "Delete does not guarantee gone. Screenshots and copies outlive it, which is exactly why a protective habit is worth having."
   },
   {
    "text": "The deal is so risky I should never post anything ever again",
    "correct": false,
    "feedback": "Plenty of what you share is fine and good. The point is not to post nothing, it is to post on purpose, knowing the deal."
   }
  ],
  "script": "Silent, independent exit check, your evidence for the register. The first answer meets the outcome. Anyone on the third needs the Goldilocks note again: this is about posting with your eyes open, not never posting.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "Making an account is signing a contract. You hand over your data and the app keeps a record of you.",
   "Thirteen is a data line, not a maturity line. It is the age you can consent to your own data being used.",
   "Nothing is guaranteed truly gone or truly private. Permanence and context collapse are real.",
   "Making an account is signing a deal, and now I can read it before I sign."
  ],
  "script": "Return to the entry answers on what you agree to. Ask which holds up now. Recap read by pupils, one point each. Finish with the headline said back to you, and remind them this is not a reason to fear posting.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi wraps it up",
  "lines": [
   "Squad, you read the small print nobody reads! ⭐",
   "Making an account is signing a deal, and 13 is the age you can sign it, not the age you are ready.",
   "Your mission this week: run the future self test on one thing before you post it. Would I mind this in two years?",
   "You still get to post and enjoy it, just with your eyes open. Next time Orbit shows you the settings that lock your doors. Shine on!"
  ],
  "script": "Let DiGi close it. While it plays, pupils write their commitment line: the one protective habit they will use. Remind them a trusted adult here, or Childline on 0800 1111, is always there if something already posted is worrying them.",
  "phase": "close",
  "minutes": 2
 }
]$sm2$::jsonb,
  '[]'::jsonb,
  $sm2${
 "retrieval_starter": {"questions": 1, "auto_marked": true},
 "in_lesson_checks": {"count": 1, "auto_marked": true},
 "exit_quiz": {"questions": 1, "auto_marked": true},
 "teacher_judgement": {"scale": ["working_towards", "met", "exceeded"], "one_tap": true, "default": "met"},
 "action_commitment": {"captured": true, "revisited_next_lesson": true}
}$sm2$::jsonb,
  $sm2${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned that making an account is signing a contract, and that 13 is a data protection line under UK GDPR, not the age they are ready. They learned why nothing online is guaranteed gone or fully private, through permanence and context collapse, and built a future self test to run before they post.",
 "try_this": "Sit together and ask them to walk you through what an app actually collects, no test, just curiosity. Then try the future self test together on a real post: who could end up seeing this, and would you be fine with it turning up in two years? Make it a team habit, not a telling off.",
 "family_question": "Before you post something, what is one question worth asking yourself first, and why?",
 "no_login_required": true
}$sm2$::jsonb,
  $sm2${
 "learning_objective": "Pupils can explain that making an account is a contract, that 13 is a data consent line not a maturity line, and can name one protective habit for their future self.",
 "timing": "About 55 minutes: starter 8, cycle one (the contract and why 13) 6, cycle two (what they collect, permanence and context collapse) 6, practise 15, prove 2, close 4.",
 "misconceptions": [
  "Thirteen means I am mature enough for social media (it is UK GDPR Article 8, the age you can consent to your own data being processed, a data line not a maturity line).",
  "A disappearing photo really disappears (screenshots and copies mean nothing is guaranteed gone: that is permanence).",
  "The deal is so risky I should post nothing (the aim is posting on purpose with your eyes open, not abstinence: plenty of sharing is fine and good)."
 ],
 "differentiation": {
  "support": "Keep the four cards visible and give pairs sentence starters: what is really happening here is, one move is. Provide the three future self test questions ready made so pupils explain rather than invent them.",
  "stretch": "Ask whether the age 13 rule protects children well or just moves the problem, and why thoughtful, moderate posting is still healthy (Przybylski Goldilocks) so the lesson never tips into never post anything."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Reveal the four cards on the board, draw the post journey as four arrows and narrate it, and run the choices as read aloud questions with corner voting. The future self test is already a paper task and needs no screen.",
 "keywords": [
  {"word": "contract", "definition": "An agreement with two sides. When you tap I agree, you are signing one, even if you never read it."},
  {"word": "UK GDPR Article 8", "definition": "The data protection law that sets 13 as the age you can agree to your own data being collected and used."},
  {"word": "permanence", "definition": "Once something is out, you cannot fully guarantee it is gone. Screenshots and copies outlive the delete button."},
  {"word": "context collapse", "definition": "When one post is seen by every part of your life at once: family, school and strangers, an audience you never pictured."}
 ],
 "commitment_stem": "To protect my future self, I will..."
}$sm2$::jsonb,
  $sm2${
 "required": false,
 "note": "Not a sensitive module, but if a pupil's independent work discloses distress about something already posted, an image shared without consent, or pressure to post, follow the school's normal safeguarding route to the DSL."
}$sm2$::jsonb
)
on conflict (module_id) do nothing;

-- Module 3: Locking your doors
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-03-locking-your-doors', 'Locking your doors', 'KS3', 'Years 7 to 9', 'teacher',
  '{7,2}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'ICO Children''s Code privacy and contact defaults',
  'I can explain the four doors I control, who sees me, who can contact me, my location, and how to block and report, and set at least one of them myself.',
  'Orbit', 103,
  $sm3$[
 {
  "type": "title",
  "eyebrow": "KS3 · Years 7 to 9 · Module 3",
  "title": "Locking your doors",
  "body": "One hour on the four doors on every account: who sees you, who can reach you, your location, and how to block and report, all set by you.",
  "script": "Opener: your house has a front door, and you decide who comes in. Your accounts have doors too, but most people never touch them, they just leave them on whatever the app set. Today we find them and you decide.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can explain the four doors I control, who sees me, who can contact me, my location, and how to block and report, and set at least one of them myself.",
  "why": "A lot of low level worry online comes from feeling watched, that anyone can see you or reach you at any time. When you set the doors yourself, that worry turns into control. You decide who is in and who is out, and that feels a lot lighter than being watched.",
  "gains": [
   "Name the four doors you control on any account",
   "Explain the safe setting for each door and why",
   "Know that blocking and reporting is normal, not rude",
   "Set at least one door yourself using the live settings walk"
  ],
  "script": "Read the mission and the why. Set the ground rules: we talk about the settings and the scenarios, not about each other, and nobody has to share who has messaged them. Point to the last slide for where to go if anything worries them.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Squad words for today",
  "words": [
   {
    "word": "private account",
    "meaning": "An account where you approve who follows you, so strangers cannot just watch you. The opposite of public."
   },
   {
    "word": "contact controls",
    "meaning": "The settings for who is allowed to message you. The safe default is that strangers cannot slide into your messages."
   },
   {
    "word": "location and metadata",
    "meaning": "The quiet extra info a photo or post can carry, including where you are. The safe setting is location off."
   },
   {
    "word": "block and report",
    "meaning": "Block stops someone reaching you. Report flags them to the app. Using them is normal, like locking a door."
   }
  ],
  "script": "Say each word, class repeats it. Location and metadata is the sneaky one, because a photo can broadcast where you are without you meaning to. Block and report is the one to normalise now: it is a tool, not making a fuss.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Recall from last time. When you tap I agree and make an account, what are you really agreeing to?",
  "options": [
   {
    "text": "To hand over my data and to a record of me that can last",
    "correct": true,
    "feedback": "Exactly. And today is the natural next step: if the app keeps a record of you, you get to decide who can see you and who can reach you."
   },
   {
    "text": "Just to a username and a password, nothing more",
    "correct": false,
    "feedback": "An account is more than a login. You agreed to hand over data, which is why setting your own doors today matters so much."
   },
   {
    "text": "Nothing important, it is only a formality",
    "correct": false,
    "feedback": "It is a real contract. You agreed to hand over data and to a record that can last, so controlling your doors is how you protect yourself."
   }
  ],
  "script": "Retrieval starter, links to Module 2. Thirty seconds, hands up, cold call the reasoning. Then the pivot: so if the app keeps a record of you, who currently gets to see you and reach you? Hold that thought.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🔑",
  "heading": "You hold four keys",
  "body": "Every account has four doors, and you hold the keys to all of them. Who can see you. Who can contact you. Whether your posts share your location. And how you block and report. Apps often leave these doors open by default, because open means more reach for the platform. Nobody comes and sets them for you. That is your job, and it takes about two minutes.",
  "script": "The reframe to land: that feeling of being watched by everyone eases a lot when you realise you hold the keys. Ask the class why they think apps leave the doors open by default. Steer them to who benefits from open.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The four doors",
  "caption": "Learn the principle for each, because the exact taps change with every app update.",
  "steps": [
   {
    "emoji": "👁️",
    "title": "Who can see you",
    "text": "Public means anyone. Private means you approve who follows you. Private is the safe door."
   },
   {
    "emoji": "💬",
    "title": "Who can contact you",
    "text": "Set it so strangers cannot just message you. Regulators pushed apps to tighten this for under 18s."
   },
   {
    "emoji": "📍",
    "title": "Your location",
    "text": "Posts can quietly show where you are. The ICO Children's Code says location off by default for children."
   },
   {
    "emoji": "🛡️",
    "title": "Block and report",
    "text": "Block stops someone reaching you. Report flags them. Both are normal tools, not making a fuss."
   }
  ],
  "script": "Walk the four doors one at a time. For each, teach the principle, not a menu path, because the taps date fastest. Point out the live settings walk in the database has the current steps for each app. Trace the four once more with the class.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "concept",
  "emoji": "🤝",
  "heading": "Blocking is not rude",
  "body": "Here is the honest bit. Plenty of people never block or report, because it feels awkward, like making a fuss. So they just put up with it. But blocking a stranger is not rude, it is you locking your own door. You do not owe anyone access to you. If someone you do not know keeps messaging, you do not argue and you do not stew. You block, and if it is dodgy, you report. Calm and done.",
  "script": "This is the beat that changes behaviour, so slow down. Ask why people feel rude blocking. Then say the line plainly: you do not owe a stranger access to you. Normalise it as a two second, no drama move.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "scenario",
  "label": "Evidence item",
  "platform": "message",
  "handle": "unknown account",
  "avatar": "❓",
  "meta": "Message request · you do not follow this account",
  "text": "hey youve got such a cool page, we should chat more, whereabouts are you based? 😊",
  "prompt": "Which door is open here, and what is the calm move? Remember, you do not owe this person a reply or an explanation.",
  "script": "Pair talk, thirty seconds, then take answers. The class should name it: the contact door is open, and there is a location fish in the message. The move is block, and report if it feels dodgy. No reply owed, no argument, no stewing. Calm and done.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Hinge question. According to the ICO Children's Code, for a child's account, location sharing should be:",
  "options": [
   {
    "text": "Off by default",
    "correct": true,
    "feedback": "Exactly. The Children's Code sets location off by default for children. So the safe principle is location off unless you have a real reason."
   },
   {
    "text": "On by default, so friends can find you",
    "correct": false,
    "feedback": "The Code says the opposite. Location should be off by default for children, because a photo does not need to broadcast where you are."
   },
   {
    "text": "Decided by the app, however it likes",
    "correct": false,
    "feedback": "The Children's Code sets the standard here: location off by default for children, not left to whatever the app prefers."
   }
  ],
  "script": "Whole class check on the default principle. Hold up your answer, do not move on below about 80 percent. If they miss it, back to the four doors diagram, the location door.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "practise",
  "minutes": 3,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "Three scenarios. Someone realises their account is public and strangers are watching. A photo posted from a bedroom that quietly shows the location. A person who keeps getting messages from someone they do not know and feels rude blocking them. For each, name which door is open, and name the move that closes it.",
  "lookFor": "Pupils naming the right door (who can see you, location, contact controls) and the move that closes it (go private, location off, block and report), plus the point that blocking is never rude. The win is the open door plus the calm move.",
  "script": "Guided practice. Model the first scenario with the class, then pairs do two and three. Two minutes on the timer. Circulate, and make sure every pair lands the point that blocking is not rude."
 },
 {
  "type": "tryit",
  "heading": "Build your doors checklist",
  "body": "On your own, nothing personal you do not want to write. Make a doors checklist: the four doors, what you would set each one to, and why. Public or private. Who can message me. Location on or off. And one line on when I would block or report, and why that is not rude. If you want, use the live settings walk to actually set one door tonight. Ten minutes. I am collecting your checklist and your reasoning, not who has contacted you.",
  "script": "Independent application. Four doors stay on the board, with a pointer to the live settings walk. Support pupils get the four doors listed with a blank next to each. Stretch: why do apps set the doors open by default, and who benefits? Circulate and collect one clear checklist to read out.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Exit check. This is the lesson outcome. Which answer names the doors AND a real move you can make?",
  "options": [
   {
    "text": "I control four doors, and I will go private so I choose who sees me instead of leaving it open",
    "correct": true,
    "feedback": "That is it. You named that you hold the keys and picked one door to set. That is control, not hiding."
   },
   {
    "text": "The app sets my doors, so there is nothing I can do about who sees me",
    "correct": false,
    "feedback": "The app sets the default, but you hold the keys. You can change any of the four doors yourself, starting with one tonight."
   },
   {
    "text": "I should block everyone and come off completely to be safe",
    "correct": false,
    "feedback": "The aim is sensible control, not locking yourself away. Staying connected is good, you just choose the doors instead of the app."
   }
  ],
  "script": "Silent, independent exit check, your evidence for the register. The first answer meets the outcome. Anyone on the third needs the Goldilocks note: this is about setting your doors, not coming off everything.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "You control four doors: who sees you, who can contact you, your location, and block and report.",
   "The safe settings are private, strangers cannot message you, location off, and knowing how to block and report.",
   "Apps leave the doors open by default because open is better for them. Setting them is your two minute job.",
   "I decide who sees me and who reaches me, and I can set those doors myself."
  ],
  "script": "Return to the entry answers on who can see and reach them. Ask if they would change them now. Recap read by pupils, one point each. Finish with the headline said back, and the reminder that blocking and reporting is never rude.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi wraps it up",
  "lines": [
   "Squad, you just picked up your keys! ⭐",
   "Four doors: who sees you, who can reach you, your location, and block and report. All yours to set.",
   "Your mission this week: set one door using the live settings walk. Go private, lock your messages, or turn location off.",
   "And remember, blocking a stranger is never rude, it is locking your own door. Next time Orbit looks at the highlight reel. Shine on!"
  ],
  "script": "Let DiGi close it. While it plays, pupils write their commitment line: the one door they will set this week. Remind them that if someone is reaching them in a way that worries them, tell a trusted adult here, or Childline on 0800 1111.",
  "phase": "close",
  "minutes": 2
 }
]$sm3$::jsonb,
  '[]'::jsonb,
  $sm3${
 "retrieval_starter": {"questions": 1, "auto_marked": true},
 "in_lesson_checks": {"count": 1, "auto_marked": true},
 "exit_quiz": {"questions": 1, "auto_marked": true},
 "teacher_judgement": {"scale": ["working_towards", "met", "exceeded"], "one_tap": true, "default": "met"},
 "action_commitment": {"captured": true, "revisited_next_lesson": true}
}$sm3$::jsonb,
  $sm3${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned the four doors they control on every account: who can see them, who can contact them, whether posts share their location, and how to block and report. They learned the safe setting for each (private, strangers cannot message, location off) and that blocking and reporting is normal, not rude.",
 "try_this": "Do a two minute doors check together, as a team, not an inspection. Walk the four doors and set one tonight using the live settings walk in the app, since the exact taps change constantly. Make one point clearly: blocking or reporting someone is never rude, it is locking your own door.",
 "family_question": "Which of your four doors would you set first, and why is blocking a stranger never rude?",
 "no_login_required": true
}$sm3$::jsonb,
  $sm3${
 "learning_objective": "Pupils can name the four doors they control, explain the safe setting for each, know that blocking and reporting is not rude, and set at least one door themselves.",
 "timing": "About 55 minutes: starter 8, cycle one (the four doors) 6, cycle two (blocking is not rude, worked and checked) 6, practise 15, prove 2, close 4.",
 "misconceptions": [
  "The default settings are always safe (apps often leave the doors open by default because open means more reach for them: nobody sets them for you).",
  "Blocking or reporting is rude, like making a fuss (it is a normal tool, like locking a door: you do not owe a stranger access to you).",
  "Being safe means coming off everything (the aim is sensible control, not hiding: you set the doors, staying connected is good)."
 ],
 "differentiation": {
  "support": "Keep the four door cards visible and give pairs sentence starters: the open door here is, the move is. List the four doors with a blank beside each for the checklist task.",
  "stretch": "Ask why apps set the doors open by default and who benefits, and why the aim is sensible control rather than locking everything down (Przybylski Goldilocks) so the lesson never tips into come off social media."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Draw the four doors on the board and narrate closing each, run the choices as read aloud questions with corner voting, and do the doors checklist on paper. Per non negotiable 6, the click by click settings walk lives in the database, so teach the principle here and point to the live settings walk for current taps.",
 "keywords": [
  {"word": "private account", "definition": "An account where you approve who follows you, so strangers cannot just watch you. The opposite of public."},
  {"word": "contact controls", "definition": "The settings for who is allowed to message you. The safe default is that strangers cannot slide into your messages."},
  {"word": "location and metadata", "definition": "The quiet extra info a photo or post can carry, including where you are. The safe setting is location off."},
  {"word": "block and report", "definition": "Block stops someone reaching you. Report flags them to the app. Using them is normal, like locking a door."}
 ],
 "commitment_stem": "The door I will set this week is..."
}$sm3$::jsonb,
  $sm3${
 "required": false,
 "note": "Not a sensitive module, but blocking and reporting scenarios can surface real contact concerns. If a pupil discloses unwanted contact, grooming signs, or that someone will not leave them alone, follow the school's normal safeguarding route to the DSL straight away."
}$sm3$::jsonb
)
on conflict (module_id) do nothing;

-- Module 4: The highlight reel
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-04-the-highlight-reel', 'The highlight reel', 'KS3', 'Years 7 to 9', 'teacher',
  '{1,6}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'Social comparison and adolescent wellbeing research',
  'I can explain why comparing myself to a feed is unfair to me, and one thing I do about it.',
  'Orbit', 104,
  $sm4$[
 {
  "type": "title",
  "eyebrow": "KS3 · Years 7 to 9 · Module 4",
  "title": "The highlight reel",
  "body": "One hour on why everyone else's life looks better than yours online, why that contest is rigged, and how you step out of it.",
  "script": "Opener: you are scrolling, and it hits you, everyone is having a better time than you. You put the phone down feeling a bit smaller than when you picked it up. Today we find out why that happens, and that you just lost a contest that was completely rigged.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can explain why comparing myself to a feed is unfair to me, and one thing I do about it.",
  "why": "A feed shows you everyone else's edited peaks and hides everyone's ordinary bits. Comparing your whole messy self to their single best frame is a contest that was never fair. Seeing that is the first move out of it, and it protects your mood far more than quitting the app.",
  "gains": [
   "Explain what a highlight reel is and why it is not the full story",
   "Name lifestyle envy, FOMO and likes as worth",
   "Explain why comparing yourself to a feed is unfair to you",
   "Choose one honest reframe or move for next time"
  ],
  "script": "Read the mission and the why. Set the ground rules: we talk about feeds and scenarios, not about each other, and no naming anyone's account. Point to the last slide for where to go if any of this touches a nerve.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "keywords",
  "heading": "Squad words for today",
  "words": [
   {
    "word": "highlight reel",
    "meaning": "The wall of everybody's best five seconds, stitched together, with all the ordinary bits in between left out."
   },
   {
    "word": "social comparison",
    "meaning": "Measuring your own life against other people's. Online it is rigged, because you only see their edited best."
   },
   {
    "word": "FOMO",
    "meaning": "Fear of missing out. That tug when you see something you were not part of, like life is happening somewhere else."
   },
   {
    "word": "likes as worth",
    "meaning": "The mistake of reading a like count as a score of how much you are worth. It is not. It is set by a machine."
   }
  ],
  "script": "Say each word, class repeats it. Highlight reel is the anchor idea, so give the picture now: your best five seconds against their best five seconds, never the boring middle. FOMO is the one they will feel in their bodies, so name it kindly.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "choice",
  "question": "Recall from Module 1. Which of these is a design trick that keeps you scrolling?",
  "options": [
   {
    "text": "Autoplay, which starts the next video before you decide to watch it",
    "correct": true,
    "feedback": "Exactly. Autoplay removes the natural stop. Today is about what you are scrolling past, and why it can quietly make you feel worse."
   },
   {
    "text": "A clear THE END screen after every few videos",
    "correct": false,
    "feedback": "There is no end screen, and that is the point. The scroll is built with no natural stop, which is why you keep going past the peaks."
   },
   {
    "text": "The app reminding you to take a break every ten minutes",
    "correct": false,
    "feedback": "The design does the opposite of reminding you to stop. A real trick is autoplay, starting the next video before you choose to."
   }
  ],
  "script": "Retrieval starter, links to Module 1. Thirty seconds, hands up, cold call the reasoning. Then the pivot: today is not about the design that keeps you scrolling, it is about what you are scrolling past. Hold that thought.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "concept",
  "emoji": "🎬",
  "heading": "The best five seconds",
  "body": "What you post is your best five seconds out of a whole day. So is everyone else's. The feed is a wall of everybody's best five seconds, stitched together, and never the boring, normal, human bits in between. So you end up comparing your whole messy day to their single best frame. That is the highlight reel, and it is why other lives look shinier than yours.",
  "script": "Land the core idea slowly. Ask the class how many photos they think someone deletes to get the one they post. Take guesses. The point: you never see the ninety they binned, only the one that survived.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "😔",
  "heading": "Envy, FOMO and the like counter",
  "body": "Three things follow. Lifestyle envy, because you only see the peaks, their life looks shiny and yours looks flat. FOMO, that tug when you see a party or a trip you were not part of, the feeling that life is happening somewhere else without you. And likes as worth, the app turns you into a number and dares you to believe the number is you. It is not. It is a score set by a machine that makes money every time you check it.",
  "script": "Three quick ideas, one at a time. Research finds that as FOMO goes up, how good young people feel about their own lives tends to go down. Land the like counter last: your worth was never in that number, a machine set it.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "scenario",
  "label": "Evidence item",
  "platform": "feed",
  "handle": "someone.on.holiday",
  "avatar": "🏖️",
  "meta": "2h · Recommended for you",
  "text": "best day everrr never coming home 🌅✨ living my best life",
  "image": "🌴",
  "stats": "❤ 4,812   💬 233",
  "prompt": "Your first thought is their life is better than yours. Slow it down. What is this perfect frame NOT showing you?",
  "script": "Run it as a class. First take the honest gut reaction, their life is better. Then slow it down together: the eight hour flight, the argument in the car, the ninety photos deleted to get this one, the ordinary Tuesday last week that looked exactly like yours. You compared your whole day to their one frame.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "The rigged contest",
  "caption": "You compared your uncut version to their edit, and lost a contest that was never fair.",
  "steps": [
   {
    "emoji": "📱",
    "title": "What you see",
    "text": "One perfect frame, best day ever, posted for everyone to admire."
   },
   {
    "emoji": "✂️",
    "title": "What was cut",
    "text": "The ninety deleted photos, the flight delay, the argument in the car."
   },
   {
    "emoji": "📆",
    "title": "What is hidden",
    "text": "The ordinary Tuesday they had last week that looked exactly like yours."
   },
   {
    "emoji": "⚖️",
    "title": "The unfair swap",
    "text": "You put your whole messy day up against their single best frame. Nobody could win that."
   }
  ],
  "script": "Walk the four steps. The line to land: my life is not worse, I am just seeing their edit and living my uncut version. The move is one question, what am I not seeing? Trace it once more with the class.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "choice",
  "question": "Hinge question. You feel low after scrolling through a friend's amazing weekend. What is the unfair part of the comparison?",
  "options": [
   {
    "text": "You compared your ordinary week to their edited highlights",
    "correct": true,
    "feedback": "Exactly. You put your whole uncut week against their single best frame. That contest was rigged before you started."
   },
   {
    "text": "You did fewer fun things than them this week",
    "correct": false,
    "feedback": "You are not seeing their whole week, only the peak they chose to post. The unfair part is comparing your everything to their edit."
   },
   {
    "text": "You do not have enough followers",
    "correct": false,
    "feedback": "Followers are not the issue. The unfair part is comparing your ordinary, uncut week to somebody's edited highlights."
   }
  ],
  "script": "Whole class check. Hold up your answer, do not move on below about 80 percent. If they miss it, back to the rigged contest diagram, the unfair swap step.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "practise",
  "minutes": 3,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "Three scenarios. Someone posts every good moment and privately feels their real life is dull. A person keeps refreshing to see if a post got enough likes and feels flat when it does not. Someone sees a group hang out they were not invited to and spirals. For each, name what is really going on, highlight reel, likes as worth or FOMO, and name one move that takes control back.",
  "lookFor": "Pupils naming the right mechanism and pairing it with a real move: unfollowing accounts that make you feel small, following ones that show real life, muting during revision, or deciding likes are not the score of your day. The win is the name plus the countermove.",
  "script": "Guided practice. Model the first scenario with the class, then pairs do two and three. Two minutes on the timer. Keep it warm and shame free: everyone feels this, sharing your own example first gives the room permission."
 },
 {
  "type": "stat",
  "figure": "Comparison",
  "claim": "Social comparison is one of the core mechanisms linking heavy scrolling to lower mood, anxiety and loneliness in teenagers. As fear of missing out rises, how good young people feel about their own lives tends to fall.",
  "source": "Child Mind Institute on comparison and teen mental health",
  "script": "Let it land, then reframe: this is not you being shallow or weak. It is an unfair contest running quietly in the background, and seeing it is the first move out. Keep the tone calm, never a scare.",
  "phase": "practise",
  "minutes": 1
 },
 {
  "type": "tryit",
  "heading": "Write your reframe",
  "body": "On your own, and this stays yours. Think of a recent scroll that left you feeling a bit worse. No names, no detail I would collect. Which of the four was at work, the highlight reel, lifestyle envy, FOMO or likes as worth? Then write one honest reframe you could say to yourself next time, and one small move: unfollowing accounts that make you feel small, following ones that show real life, muting during revision, or deciding likes are not the score of your day. Ten minutes. I am collecting the analysis, not the personal detail.",
  "script": "Independent application. Four cards stay on the board. Support pupils get the sentence frame: what I saw, what I did not see, so my move is. Stretch: why can moderate, eyes open use still be healthy, and why is curating a feed better than quitting it? Collect one honest reframe to read out.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Exit check. This is the lesson outcome. Which answer explains why the comparison is unfair AND names a real move?",
  "options": [
   {
    "text": "I compare my whole self to somebody's highlight reel, so I will unfollow the accounts that always make me feel small",
    "correct": true,
    "feedback": "That is it. You named why the contest is rigged and chose one move that curates your feed instead of quitting it."
   },
   {
    "text": "Other people's lives really are just better than mine and there is nothing to do",
    "correct": false,
    "feedback": "You are seeing their edit, not their whole life. Once you remember that, you can step out of the contest and curate what you see."
   },
   {
    "text": "Social media is all bad so I should delete it and never scroll again",
    "correct": false,
    "feedback": "Staying close to your people is real and good. The trouble is only the comparing, and the fix is curating your feed, not quitting."
   }
  ],
  "script": "Silent, independent exit check, your evidence for the register. The first answer meets the outcome. Anyone on the third needs the Goldilocks note: the aim is scrolling with your eyes open, not abstinence.",
  "phase": "prove",
  "minutes": 2
 },
 {
  "type": "recap",
  "heading": "What to remember",
  "points": [
   "A feed shows everyone's edited peaks and hides everyone's ordinary bits.",
   "You compare your whole messy day to their single best frame, and that contest is rigged.",
   "Likes and follows are a score set by a machine, not a measure of your worth.",
   "I am comparing my whole self to somebody's highlight reel, so I can step out of it."
  ],
  "script": "Return to the entry answers on what the feed is really showing you. Ask which holds up now. Recap read by pupils, one point each. Finish with the headline said back, and the honest note that the trouble is only the comparing.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "DiGi wraps it up",
  "lines": [
   "Squad, you spotted the rigged contest! ⭐",
   "What you post is your best five seconds. So is everyone else's. You were comparing your whole day to their one frame.",
   "Your mission this week: catch one perfect post and ask, what is this not showing me? Then unfollow one account that always makes you feel small.",
   "Your worth was never in a like count. Next time Nova opens up bodies and filters. Shine on!"
  ],
  "script": "Let DiGi close it. While it plays, pupils write their commitment line: the one move they will make this week. Remind them that if the comparing ever gets heavy, tell a trusted adult here, or Childline on 0800 1111, they are good at this.",
  "phase": "close",
  "minutes": 2
 }
]$sm4$::jsonb,
  '[]'::jsonb,
  $sm4${
 "retrieval_starter": {"questions": 1, "auto_marked": true},
 "in_lesson_checks": {"count": 1, "auto_marked": true},
 "exit_quiz": {"questions": 1, "auto_marked": true},
 "teacher_judgement": {"scale": ["working_towards", "met", "exceeded"], "one_tap": true, "default": "met"},
 "action_commitment": {"captured": true, "revisited_next_lesson": true}
}$sm4$::jsonb,
  $sm4${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned that a feed shows everyone's edited peaks and hides the ordinary bits, so comparing themselves to it is a rigged contest. They learned to name lifestyle envy, FOMO and the mistake of reading likes as worth, and chose one honest reframe and move for next time.",
 "try_this": "Scroll alongside your child, no phone grab, no lecture. When a too perfect post comes up, ask lightly, what do you reckon they left out of this one? Then say the true thing out loud, that adults compare too, so they know it is human, not a failing.",
 "family_question": "When a post makes you feel a bit worse, what is one thing it is probably not showing you?",
 "no_login_required": true
}$sm4$::jsonb,
  $sm4${
 "learning_objective": "Pupils can explain why comparing themselves to a feed is unfair (the highlight reel), name lifestyle envy, FOMO and likes as worth, and name one countermove.",
 "timing": "About 55 minutes: starter 8, cycle one (the highlight reel, envy, FOMO and likes) 6, cycle two (the rigged contest, worked and checked) 6, practise 15, prove 2, close 4.",
 "misconceptions": [
  "Other people's lives really are just better than mine (you are seeing their edited best five seconds, not their ordinary, uncut life).",
  "Likes and follows measure how much I am worth (they are a score set by a machine that profits when you keep checking, never a measure of you).",
  "Social media is all bad so I should quit (the trouble is only the comparing: staying close to your people is good, and the fix is curating the feed, not abstinence)."
 ],
 "differentiation": {
  "support": "Keep the four cards visible and give pairs the sentence frame: what I saw, what I did not see, so my move is. Model the first guided scenario fully before pairs take the other two.",
  "stretch": "Ask why moderate, eyes open use can still be healthy (Przybylski Goldilocks) and why the answer is curating a feed rather than quitting it, so the lesson never tips into abstinence messaging."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Reveal the four cards on the board, draw the rigged contest as four steps and narrate it, and run the choices as read aloud questions with corner voting. The reframe task is already a paper task and needs no screen.",
 "keywords": [
  {"word": "highlight reel", "definition": "The wall of everybody's best five seconds, stitched together, with all the ordinary bits in between left out."},
  {"word": "social comparison", "definition": "Measuring your own life against other people's. Online it is rigged, because you only see their edited best."},
  {"word": "FOMO", "definition": "Fear of missing out. That tug when you see something you were not part of, like life is happening somewhere else."},
  {"word": "likes as worth", "definition": "The mistake of reading a like count as a score of how much you are worth. It is not. It is set by a machine."}
 ],
 "commitment_stem": "Next time a post makes me feel worse, I will..."
}$sm4$::jsonb,
  $sm4${
 "required": false,
 "note": "Not a formally sensitive module, but comparison and low mood sit close to the surface. If a pupil's independent work discloses persistent low mood, self worth tied hard to likes, or distress, follow the school's normal pastoral route."
}$sm4$::jsonb
)
on conflict (module_id) do nothing;
