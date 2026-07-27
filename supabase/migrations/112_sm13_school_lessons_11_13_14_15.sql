-- Migration 112: 13+ social media curriculum, school_lessons for modules 11, 13, 14, 15
-- Four teacher facing school_lessons rows (Version A schools in depth) for the
-- 13+ Social Media Literacy curriculum: the inner life (11), the good side held
-- honestly (13), taking the wheel (14), and AI companions and chatbots (15).
-- Mirrors the 033 school_lessons insert shape exactly. British English, no dashes.

-- Module 11: The inner life
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-11-the-inner-life', 'The inner life', 'KS4', 'Years 10 to 11', 'teacher',
  '{1,6}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'APA 2023 advisory and doomscrolling research (Sharma and colleagues, 2022)', 'I can honestly check how a session leaves me feeling, and I can name one habit that protects my mood.', 'Nova', 111,
  $sm11$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 11",
  "title": "The inner life",
  "body": "One hour on the quiet thing the feed never tells you: how a session actually leaves you feeling, and how you take back the wheel on your own mood.",
  "script": "Ground rules first, every lesson in this curriculum: we talk about the design and the scenarios, not about each other, and no personal disclosures. Then open big. Most of this course has been about what the app does to your attention. Today we go one layer in, to your mood. By the end you will have a tool for exactly the moment you close an app and feel a bit off without knowing why.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can honestly check how a session leaves me feeling, and I can name one habit that protects my mood.",
  "why": "Every feed you scroll counts your minutes, not your mood. It can move how you feel without ever telling you it is doing it. The honest mood check is the tool that puts you back in the room, so you notice how a session actually left you, not how you hoped it would, and you decide from there.",
  "gains": [
   "Run an honest mood check, before you open and after you close",
   "Name doomscrolling and why it winds you up past the point it helps",
   "Explain why likes can start to feel like a score for you as a person",
   "Name one habit that protects your mood, and steer instead of quit"
  ],
  "script": "Read the mission and the why out loud. Set the frame gently: this is not a lesson about social media wrecking your mood, the research is clear that moderate use is fine and connection is good for you. This is a skill for steering, and it works.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "discussion",
  "prompt": "On your whiteboard, name one feeling you have had at the end of a long scroll. Flat, wired, low, restless, fine, anything goes.",
  "mode": "class",
  "seconds": 120,
  "lookFor": "Honest single words, no story attached. You are collecting the real feeling into the room without anyone having to disclose anything personal.",
  "script": "Baseline check, Rosenshine, start where they are. Take three answers on the board, no comment yet. Note them, you will return to them at the end. We are about to give you a tool for exactly that moment.",
  "phase": "starter",
  "minutes": 5
 },
 {
  "type": "keywords",
  "heading": "Four words for today",
  "words": [
   {
    "word": "honest mood check",
    "meaning": "Clocking how you feel before you open and after you close. The gap between the two is the data."
   },
   {
    "word": "doomscrolling",
    "meaning": "Compulsively feeding on bad or upsetting news long past the point it tells you anything useful."
   },
   {
    "word": "validation",
    "meaning": "The feeling that likes and follower counts are a score for you as a person."
   },
   {
    "word": "the online self",
    "meaning": "The polished, edited version you post. The main account, the finsta, the highlight, never the whole of you."
   }
  ],
  "script": "Tier two and three vocabulary. Say each once, keep the definitions short. Doomscrolling and validation are the two most pupils half know, so pin them down clearly here.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "heading": "The honest mood check",
  "body": "Before you open, clock how you feel. After you close, clock it again. Not how you hoped it would go, how it actually landed. That gap is the truth the app never gives you, because the app counts your time, not your mood.",
  "emoji": "🪞",
  "script": "First of four ideas, one card at a time, respecting working memory. The move is tiny: two readings, before and after. Model the phrasing, hoped for a lift, got a dip.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "heading": "Doomscrolling",
  "body": "When you keep feeding on bad news you can do nothing about, feeling worse with every post but unable to stop. The feed makes it easy, because alarming content travels furthest. Research links the habit to higher anxiety and stress (Sharma and colleagues, 2022).",
  "emoji": "🌀",
  "script": "Keep it plain and evidence based, not a scare. Name the design reason it happens: alarming content is served because it holds attention, not because it helps you.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "heading": "Likes as worth",
  "body": "Likes and follower counts feel like a score for you as a person. The research is blunt that tying your worth to those numbers is one of the real soft spots the design leans on. Noticing that is not being fragile, it is seeing the trick.",
  "emoji": "👍",
  "script": "Careful framing here. Never suggest a pupil is weak for feeling this. The design is built to make a number feel personal, that is the point being taught.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "heading": "The online self and the real one",
  "body": "The main account versus the finsta, the polished self versus the real one. Everyone is showing an edit. Forgetting that is what makes the comparison hurt, because you compare your whole messy inside to somebody else's best bits.",
  "emoji": "🪞",
  "script": "Last of the four. Land the line: everyone is showing an edit. Comparison hurts because it is never a fair one.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "diagram",
  "heading": "The honest check, run live",
  "caption": "Watch the teacher run it, then you will run your own.",
  "steps": [
   {
    "emoji": "📱",
    "title": "Open a bit low",
    "text": "You open the app hoping it will pick you up."
   },
   {
    "emoji": "🌀",
    "title": "Twenty minutes in",
    "text": "Third video about something upsetting you can do nothing about. That is doomscrolling. You keep going because the feed keeps serving it."
   },
   {
    "emoji": "❌",
    "title": "Close it",
    "text": "You put the phone down."
   },
   {
    "emoji": "🧭",
    "title": "Honest check",
    "text": "Am I lifted? No. Flatter, a bit anxious. The app did not warn me it would go this way. The check did."
   }
  ],
  "verdicts": [
   "Hoped for a lift",
   "Got a dip",
   "Name the gap"
  ],
  "script": "Worked example, model the reflective thinking aloud before pupils try it. Narrate your own mood dial dropping. Land the whole skill: naming the gap, hoped for a lift, got a dip, is the stop for next time.",
  "phase": "teach",
  "minutes": 8
 },
 {
  "type": "choice",
  "question": "Someone keeps scrolling upsetting news they can do nothing about, feeling worse with every post but unable to stop. Which idea is that?",
  "options": [
   {
    "text": "Doomscrolling",
    "correct": true,
    "feedback": "Yes. Bad news you cannot act on, feeling worse but unable to stop. That is the pattern, and naming it is the first step to breaking it."
   },
   {
    "text": "The honest mood check",
    "correct": false,
    "feedback": "Not quite. The honest check is the tool that catches this, it is not the trap itself. Look again."
   },
   {
    "text": "Likes as worth",
    "correct": false,
    "feedback": "Not this one. This is about a number feeling like a score for you, not about a spiral of bad news."
   },
   {
    "text": "A finsta",
    "correct": false,
    "feedback": "Not this one. A finsta is about the online self versus the real one. Try again."
   }
  ],
  "script": "Hinge question, hold up A, B, C or D. Do not proceed below about 80 percent. If most say doomscrolling, move on. If not, reteach cycle two.",
  "phase": "teach",
  "minutes": 5
 },
 {
  "type": "discussion",
  "prompt": "In pairs, three scenario cards. One, someone whose whole day sours when a post gets fewer likes than expected. Two, someone who cannot put down a feed of bad news and feels wound up. Three, someone who feels like a fraud because their real life looks nothing like their main account. For each: what is going on, and one move that protects the mood.",
  "mode": "pairs",
  "seconds": 120,
  "lookFor": "The right idea named for each card, plus a concrete move: a doomscroll limit, muting accounts that leave you flat, or a rule that a like count never decides your day.",
  "script": "Guided practice, we do. Take the first card with the class, then pairs do two and three. Use the two column frame, what is going on, my move. Circulate and collect strong moves.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "tryit",
  "heading": "Design your own honest mood check",
  "body": "On your own. Write the two questions you will ask, one before you open and one after you close. Then write one habit you will try for a week: a doomscroll limit on one app, muting accounts that leave you flat, or a rule that a like count never gets to decide your day. This is yours. I am collecting the plan, not personal detail.",
  "script": "Independent practice, you do. Reassure the room you are not collecting anything private, only the plan. This is where the skill transfers to their own life.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Before you finish, show what stuck. What is the big idea of this lesson?",
  "options": [
   {
    "text": "The feed can move my mood without telling me, and the honest check puts me back in charge of it.",
    "correct": true,
    "feedback": "Yes. That is exactly it. The check comes from you, because the app only measures time, not mood."
   },
   {
    "text": "Social media wrecks your mood, so the healthy thing is to quit it completely.",
    "correct": false,
    "feedback": "Not this one. The research says easing off heavy use helps, but moderate use is fine and connection is good for you. This is about steering, not quitting."
   },
   {
    "text": "If you never like or comment, the feed cannot affect how you feel at all.",
    "correct": false,
    "feedback": "Not this one. Watch time alone can pull your mood, silence is not protection. Look again."
   }
  ],
  "script": "Exit check, auto marked. The right answer is the headline of the whole lesson, sat between two plausible misreadings.",
  "phase": "prove",
  "minutes": 4
 },
 {
  "type": "recap",
  "heading": "What we carry out",
  "points": [
   "The feed counts my minutes, not my mood. The honest check is mine to run.",
   "Doomscrolling, likes as worth, and the online self are the three that pull the mood down quietly.",
   "Easing off heavy use tends to lift mood (APA 2023), so this is steering, not quitting.",
   "If the honest check keeps coming back low, that is worth saying out loud to someone I trust."
  ],
  "script": "Spaced review. Return to the entry answers on the board and ask what changes now. Signpost help plainly: a trusted adult here, or Childline on 0800 1111, and YoungMinds for support.",
  "phase": "close",
  "minutes": 5
 },
 {
  "type": "digi",
  "heading": "Remember",
  "lines": [
   "The feed can move your mood without telling you.",
   "The honest check, before and after, puts you back in charge.",
   "If it keeps coming back low, tell a trusted adult, or Childline on 0800 1111."
  ],
  "phase": "close",
  "minutes": 2
 }
]$sm11$::jsonb,
  '[]'::jsonb,
  $sm11${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
  "auto_marked": true
 },
 "teacher_judgement": {
  "scale": [
   "working_towards",
   "met",
   "exceeded"
  ],
  "one_tap": true,
  "default": "met"
 },
 "action_commitment": {
  "captured": true,
  "revisited_next_lesson": true
 }
}$sm11$::jsonb,
  $sm11${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned that social media can shift how they feel without either of you clocking it, because the app counts minutes, not mood. They met the honest mood check, before you open and after you close, and named the three habits that pull mood down quietly: doomscrolling, treating likes as a score for their worth, and comparing their real self to everyone else's edited highlight reel.",
 "try_this": "Model the check yourself first, out loud, no lecture. I felt okay before that, a bit meh after, funny how that happens. Then ask gently, when you come off an app, do you ever notice how it left you? Agree one small thing together, a mood check when they close an app, or a rule that likes never get to run the day.",
 "family_question": "When you close an app, do you ever notice how it actually left you feeling?",
 "no_login_required": true
}$sm11$::jsonb,
  $sm11${
 "learning_objective": "Pupils can run an honest mood check (before and after a session), name doomscrolling, likes as worth and the online self, and name one habit that protects their mood.",
 "timing": "55 minutes: starter and baseline 9, cycle one to four (the four ideas) 12, worked example 8, hinge 5, guided practice 10, independent 10, prove and close 6",
 "misconceptions": [
  "Social media always wrecks your mood (the research says easing off heavy use helps and moderate use is fine, connection is genuinely good for you, this is steering not quitting)",
  "If I never like or comment the feed learns nothing and cannot move my mood (watch time alone can pull the mood, silence is not protection)",
  "Feeling low after a scroll means I am weak or fragile (it means the design is working as built, the honest check is a skill, not a sign of a problem)"
 ],
 "differentiation": {
  "support": "The four idea cards stay visible throughout and pairs get sentence starters and a ready made mood dial to circle before and after. Scenario cards can be read aloud.",
  "stretch": "Ask why moderate use can still lift mood and connection (Przybylski Goldilocks, APA 2023 notes benefits alongside risks), so the lesson never tips into social media wrecks your mood."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Draw two mood dials on the board, a before and an after, and model the honest check aloud. The four ideas become four read aloud cards. Choice slides become corner voting or hands up. The independent task is a written plan, no screen needed. Exit check runs from the printed quiz.",
 "keywords": [
  {
   "word": "honest mood check",
   "definition": "Clocking how you feel before you open and after you close. The gap is the data."
  },
  {
   "word": "doomscrolling",
   "definition": "Compulsively feeding on bad news past the point it helps, linked to more anxiety and stress."
  },
  {
   "word": "validation",
   "definition": "The feeling that likes and follower counts are a score for you as a person."
  },
  {
   "word": "the online self",
   "definition": "The edited version you post, never the whole of you. The gap that makes comparison hurt."
  }
 ],
 "tool": {
  "heading": "The honest mood check",
  "lines": [
   "Clock it before",
   "Clock it after",
   "Name the gap"
  ],
  "strapline": "The honest check: before and after, name the gap, steer from there."
 },
 "worksheet": {
  "title": "What is going on, my move",
  "directions": "For each scenario, name what is going on (doomscrolling, likes as worth, or the online self versus the real one), then name one move that protects the mood.",
  "verdict_options": [
   "Doomscrolling",
   "Likes as worth",
   "The online self"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Someone whose whole day sours when a post gets fewer likes than they expected.",
   "expected_verdict": "Likes as worth",
   "teaching_point": "A number has become a score for their worth. The move is a rule that a like count never gets to decide the day."
  },
  {
   "n": 2,
   "item": "Someone who cannot put down a feed of bad news and feels wound up with every post.",
   "expected_verdict": "Doomscrolling",
   "teaching_point": "Bad news they cannot act on, feeling worse but unable to stop. The move is a doomscroll limit or muting the accounts that feed it."
  },
  {
   "n": 3,
   "item": "Someone who feels like a fraud because their real life looks nothing like their main account.",
   "expected_verdict": "The online self",
   "teaching_point": "They are comparing their whole real self to their own edit. The move is naming that everyone posts an edit, so the comparison is never fair."
  },
  {
   "n": 4,
   "item": "Someone opens an app a bit low hoping for a lift, and closes it flatter and more anxious than before.",
   "expected_verdict": "Doomscrolling",
   "teaching_point": "The honest check catches exactly this: hoped for a lift, got a dip. Naming the gap is the stop for next time."
  }
 ],
 "commitment_stem": "My commitment: next time I close an app feeling off, I will..."
}$sm11$::jsonb,
  $sm11${
 "required": false,
 "note": "Wellbeing content, handled calmly. This lesson invites pupils to name how a session leaves them feeling. That framing can surface disclosures about persistent low mood, anxiety or compulsive use affecting daily life. If a pupil's independent work discloses this, do not judge it in the moment, follow the school's normal pastoral and safeguarding route and log any concern on the school concern form.",
 "concern_form_linked": true
}$sm11$::jsonb
)
on conflict (module_id) do nothing;

-- Module 13: The good side, held honestly
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-13-the-good-side-held-honestly', 'The good side, held honestly', 'KS4', 'Years 10 to 11', 'teacher',
  '{2,6,1}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'Digital Wellness Lab on belonging, and Ofcom Children and Parents 2025 on content creation', 'I can name a real way social media is good for me, the risk that sits alongside it, and how I keep the good without getting caught by the catch.', 'Nova', 113,
  $sm13$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 13",
  "title": "The good side, held honestly",
  "body": "One hour on the part most people skip: the real good social media does, and the catch that comes with every bit of it. We keep the good and see the catch, together, every time.",
  "script": "Ground rules first: we talk about the design and the scenarios, not about each other, and belonging is personal, so if a scenario is close to your own life you never have to share it. Then flip the course: today is not about what the machine does to you, it is about what it genuinely gives you, held honestly.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can name a real way social media is good for me, the risk that sits alongside it, and how I keep the good without getting caught by the catch.",
  "why": "If you only ever hear the dangers, you switch off, because you know the good is real. Social media keeps friendships alive, helps you find your people, gives you a voice, and lets you make things. Every one of those is genuinely good for you, and every one comes with a catch. The skill is holding both at once.",
  "gains": [
   "Name real goods: connection, belonging, voice, creativity, support",
   "Name the catch that sits alongside each good, honestly",
   "Hold the good and the risk together, without picking one",
   "Name one move that keeps a good thing without getting caught"
  ],
  "script": "Read the mission and the why. Set the frame: this is not permission to switch off the critical guard, and it is not a lecture that the good is all fake. Both are true at once, that is the whole module.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "discussion",
  "prompt": "On your whiteboard, name one thing social media does for you that you would genuinely miss if it vanished tomorrow.",
  "mode": "class",
  "seconds": 120,
  "lookFor": "Honest, specific goods, a friend kept close across distance, a group that gets them, a thing they make. You will return to these and add the catch to each at the end.",
  "script": "Baseline check, start where they are. Take three on the board, no comment yet. We are about to hold each one up to the light and add its catch.",
  "phase": "starter",
  "minutes": 5
 },
 {
  "type": "keywords",
  "heading": "Five goods, and the idea that holds them",
  "words": [
   {
    "word": "connection",
    "meaning": "Friendships kept alive across distance. The catch: always reachable can start to feel like you can never log off."
   },
   {
    "word": "belonging",
    "meaning": "Finding your people, most of all if you feel on the edge of things. The catch: the same community can turn or pile on."
   },
   {
    "word": "voice",
    "meaning": "Standing for something and being heard. The catch: being visible online also means being a target."
   },
   {
    "word": "double edged",
    "meaning": "The place you belong is the same place that can pull you down. Good and catch, held together."
   }
  ],
  "script": "Vocabulary and the spine of the module in one slide. Double edged is the key term, everything else hangs off it. Say each good with its catch attached, never clean.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "heading": "Connection and belonging",
  "body": "It keeps friendships alive across distance, the mate who moved, the cousin abroad. And it helps you find your people, which matters most if you feel a bit on the edge of things. The catch: staying reachable all the time can wear you out, and the same community that holds you can turn or pile on.",
  "emoji": "🤝",
  "script": "First pair of goods, each split into good and catch. For belonging, note it matters most for teens who lack that at home or at school, this is protective and worth saying plainly.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "heading": "Voice and creativity",
  "body": "You can stand for something and be heard. And you can make things, edit, draw, write, build, instead of only scrolling past everyone else. Ofcom finds a large share of UK young people create their own content, not just watch. The catch: being visible makes you a target, and chasing numbers turns making into performing.",
  "emoji": "🎨",
  "script": "Second pair. Celebrate creativity genuinely, most of the room already makes more than they watch. Name the catch honestly: the pressure to perform and chase numbers.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "heading": "Support and help",
  "body": "You can find people who get exactly what you are going through, and that is real. The catch: a stranger who is warm is still a stranger, and online advice is not the same as a trained adult. Keep the support and keep a trusted adult too, they are not rivals.",
  "emoji": "💛",
  "script": "Fifth good. This is the one that points forward to help routes. Land it: a good online community and a real adult are not rivals, you can have both.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "diagram",
  "heading": "Holding one up properly",
  "caption": "Belonging, held honestly, good and catch in the same breath.",
  "steps": [
   {
    "emoji": "😔",
    "title": "The odd one out",
    "text": "A teenager with a condition almost no one at school has heard of feels like the odd one out."
   },
   {
    "emoji": "🔗",
    "title": "Me too",
    "text": "Online they find people with the same condition. Someone says, yes, that happens to me too. That is huge, and the research backs it."
   },
   {
    "emoji": "🛡️",
    "title": "The catch, same breath",
    "text": "The same group could hand out advice a doctor never would, or turn on a bad day. The good is real and the guard stays up."
   },
   {
    "emoji": "✅",
    "title": "The move",
    "text": "Enjoy the belonging and still ask: would I check this with an adult I trust before I act on it?"
   }
  ],
  "verdicts": [
   "The good is real",
   "The catch is real",
   "Hold both"
  ],
  "script": "Worked example, model holding the good and the risk together rather than picking one. The guard icon does not shut the group down, it just watches. That distinction is the lesson.",
  "phase": "teach",
  "minutes": 8
 },
 {
  "type": "choice",
  "question": "Someone says, my online community is the only place I feel understood, so nothing on there could ever be bad for me. What is the most honest response?",
  "options": [
   {
    "text": "The belonging is real and good, and the same place can still carry risk, so both are true.",
    "correct": true,
    "feedback": "Yes. That both is true answer is the whole module. The good is real, and the guard stays up, at the same time."
   },
   {
    "text": "They are right, if it feels good then it must be safe.",
    "correct": false,
    "feedback": "Not this one. Feeling good and being safe are not the same thing, the place that holds you can still carry a risk. Look again."
   },
   {
    "text": "They are wrong, online communities are dangerous.",
    "correct": false,
    "feedback": "Not this one. That drops the good entirely, which is just as unhonest as dropping the catch. Try again."
   },
   {
    "text": "You cannot really tell either way.",
    "correct": false,
    "feedback": "Not this one. You can tell, and the honest answer names both the good and the catch. Look again."
   }
  ],
  "script": "Hinge question, hold up A, B, C or D. Do not proceed below about 80 percent. The correct answer is the double edged idea itself, so this check is the heart of the lesson.",
  "phase": "teach",
  "minutes": 5
 },
 {
  "type": "discussion",
  "prompt": "In pairs, three scenario cards. A young carer who finally finds other young carers online. A teen posting about a cause they believe in. A teen learning to edit videos and getting good at it. For each: the real good it brings, the catch that sits with it, and one move that keeps the good and manages the catch.",
  "mode": "pairs",
  "seconds": 120,
  "lookFor": "Both halves for every card, the good named genuinely and the catch named honestly, plus a concrete move, never one without the other.",
  "script": "Guided practice, we do. Take the first card with the class using the three column frame, the good, the catch, my move. Every card forces both halves, that is by design.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "tryit",
  "heading": "The good, the catch, my move",
  "body": "On your own. Pick one real way social media is good in your own life, no names, no detail you would not want read out. Write the good it brings, write the catch honestly, and write one thing you already do or could do to keep the good without getting caught. I am collecting the thinking, not personal detail.",
  "script": "Independent practice, you do. Reassure the room this stays general. The double edged skill transfers to their own life here.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Before you finish, show what stuck. What is the big idea of this lesson?",
  "options": [
   {
    "text": "Social media can be genuinely good for me, and every good thing comes with a catch, and I can hold both at once.",
    "correct": true,
    "feedback": "Yes. That is exactly it. Clear eyed, not cynical, keep the good and see the catch together."
   },
   {
    "text": "Social media is basically fine, so you can switch the critical guard off and just enjoy it.",
    "correct": false,
    "feedback": "Not this one. Every good comes with a catch, the guard stays up even while you enjoy the good. Look again."
   },
   {
    "text": "Social media is mostly poison, and any good in it is just bait.",
    "correct": false,
    "feedback": "Not this one. The good is genuinely real, dropping it is just as dishonest as dropping the catch. Try again."
   }
  ],
  "script": "Exit check, auto marked. The right answer is the double edged headline, sat between the two ways of getting it wrong, all good or all bad.",
  "phase": "prove",
  "minutes": 4
 },
 {
  "type": "recap",
  "heading": "What we carry out",
  "points": [
   "Social media is genuinely good for me: connection, belonging, voice, creativity, support.",
   "Every good thing comes with a catch, and I can hold both at once.",
   "Belonging is protective, most of all if you feel on the edge, and the same place can still turn.",
   "A good online community and a trusted adult are not rivals. Aim for both."
  ],
  "script": "Spaced review. Return to the entry goods on the board and add the catch to each, out loud, together. Signpost help: a trusted adult here, or Childline on 0800 1111.",
  "phase": "close",
  "minutes": 5
 },
 {
  "type": "digi",
  "heading": "Remember",
  "lines": [
   "The good side of social media is real. Do not let anyone tell you it is all poison.",
   "Every good thing comes with a catch. Keep the good, keep your eyes open.",
   "If the only place you feel understood is online, tell a trusted adult too. You deserve people in both worlds."
  ],
  "phase": "close",
  "minutes": 2
 }
]$sm13$::jsonb,
  '[]'::jsonb,
  $sm13${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
  "auto_marked": true
 },
 "teacher_judgement": {
  "scale": [
   "working_towards",
   "met",
   "exceeded"
  ],
  "one_tap": true,
  "default": "met"
 },
 "action_commitment": {
  "captured": true,
  "revisited_next_lesson": true
 }
}$sm13$::jsonb,
  $sm13${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned that social media is genuinely good for them in real ways, it keeps friendships alive, helps them find people who understand them, gives them a voice, and lets them create. And that every one of those goods comes with a catch, so we hold the two together. For a teen who feels on the edge of things, finding their people online can lift a real weight, and the same space can still be double edged.",
 "try_this": "Ask your child to show you the good bit. Show me a group or an account that actually makes your day better, what do you get from it? Listen properly, and mean it when you say that sounds good. Then gently, is there ever a version of that group that gets harder, that piles on or wears you down? If they say online is where they feel most understood, take it seriously and widen it rather than compete with it.",
 "family_question": "What is one thing social media genuinely gives you that is good for you, and what is the catch that sits with it?",
 "no_login_required": true
}$sm13$::jsonb,
  $sm13${
 "learning_objective": "Pupils can name a real good social media brings, the risk that sits alongside it, and one move that keeps the good without getting caught by the catch.",
 "timing": "55 minutes: starter and baseline 9, cycle one to three (five goods paired with catches) 10, worked example 8, hinge 5, guided practice 10, independent 10, prove and close 6",
 "misconceptions": [
  "If a community feels good then nothing in it could be bad for me (feeling good and being safe are not the same, the place that holds you can still carry risk)",
  "Social media is mostly harmful, so any good in it is just bait (the good is genuinely real, dropping it is as dishonest as dropping the catch)",
  "You have to pick a side, all good or all bad (the whole module is that both are true at once, that is the double edged idea)"
 ],
 "differentiation": {
  "support": "The five paired cards stay visible and pairs get the three column frame, the good, the catch, my move, with sentence starters. Scenario cards can be read aloud.",
  "stretch": "Ask where the Goldilocks middle sits (Przybylski), when does a good community start to cost more than it gives, so the lesson never tips into so it is all fine."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Draw the five goods on the board and add a catch to each with the class. The worked example is read aloud in character. Choice slides become corner voting or hands up. The independent task is written, no screen needed. Exit check runs from the printed quiz.",
 "keywords": [
  {
   "word": "connection",
   "definition": "Friendships kept alive across distance. Catch: always reachable can feel like you can never log off."
  },
  {
   "word": "belonging",
   "definition": "Finding your people, protective most of all if you feel on the edge. Catch: the same group can turn or pile on."
  },
  {
   "word": "double edged",
   "definition": "The place you belong is the same place that can pull you down. Good and catch, held together."
  },
  {
   "word": "voice",
   "definition": "Standing for something and being heard. Catch: being visible online also makes you a target."
  }
 ],
 "tool": {
  "heading": "Good, catch, move",
  "lines": [
   "Name the good",
   "Name the catch",
   "Name the move"
  ],
  "strapline": "The good is real, the catch is real, keep the good with your eyes open."
 },
 "worksheet": {
  "title": "The good, the catch, my move",
  "directions": "For each scenario, name the real good it brings, name the catch that sits with it, and name one move that keeps the good and manages the catch.",
  "verdict_options": [
   "Keep the good",
   "Watch the catch",
   "Widen the support"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "A young carer who finally finds other young carers online who understand exactly what their week is like.",
   "expected_verdict": "Keep the good",
   "teaching_point": "The belonging is genuinely protective. The catch is leaning on it as the only support, so the move is to keep the group and widen to a trusted adult too."
  },
  {
   "n": 2,
   "item": "A teen posting about a cause they believe in and getting heard for the first time.",
   "expected_verdict": "Watch the catch",
   "teaching_point": "Having a voice is real and good. The catch is that being visible makes you a target, so the move is to expect pushback and know how to mute, block and report."
  },
  {
   "n": 3,
   "item": "A teen learning to edit videos, getting good, and starting to watch the view count on every post.",
   "expected_verdict": "Watch the catch",
   "teaching_point": "Creativity beats scrolling. The catch is the numbers turning making into performing, so the move is to make for the joy of it, not the count."
  },
  {
   "n": 4,
   "item": "Someone says the online group is the only place they feel understood, so it can only ever be good for them.",
   "expected_verdict": "Widen the support",
   "teaching_point": "The belonging is real and must not be dismissed. The catch is having only one source of support, so the move is to widen it, a good group and a trusted adult are not rivals."
  }
 ],
 "commitment_stem": "My commitment: one good thing I will keep with my eyes open this week is..."
}$sm13$::jsonb,
  $sm13${
 "required": false,
 "note": "Not a sensitive module, but belonging is personal. If a pupil's independent work discloses that their only source of support is online, or hints at isolation at home, do not remove the online support, follow the school's normal pastoral route and gently widen their support. Log any concern on the school concern form.",
 "concern_form_linked": true
}$sm13$::jsonb
)
on conflict (module_id) do nothing;

-- Module 14: Taking the wheel
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-14-taking-the-wheel', 'Taking the wheel', 'KS5', 'Years 12 to 13', 'teacher',
  '{5,6,7}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'APA 2023 on breaks and appearance, and the ICO Children's Code on protections by age', 'I can run my own social media on purpose, take a break when I need one, shape my feed, decide whether and how to be on a platform, and think about the footprint I am leaving for the adult I am about to be.', 'DiGi', 114,
  $sm14$[
 {
  "type": "title",
  "eyebrow": "KS5 · Years 12 to 13 · Module 14",
  "title": "Taking the wheel",
  "body": "One hour on the handover nobody announces. The protections that were switched on for you as a child thin out as you age up, so the judgement that used to be built into the app now has to live inside you.",
  "script": "Ground rules, near adult version: we talk about the decisions and the scenarios, not about each other. At this stage this is a conversation between decision makers, not a set of rules handed down. Least scaffolding of the course, more debate, more independent judgement.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can run my own social media on purpose, take a break when I need one, shape my feed, decide whether and how to be on a platform, and think about the footprint I am leaving for the adult I am about to be.",
  "why": "By 16 the guard rails start coming off. Under the ICO Children's Code the built in protections that were strongest when you were a child thin out as you get older, so the judgement that used to be automatic has to become yours. Nobody is coming to switch it on for you. That is not a threat, it is the point of growing up.",
  "gains": [
   "Use breaks as a deliberate lever, with real evidence behind them",
   "Curate your feed on purpose instead of taking what you are fed",
   "Decide whether and how to be on a platform at all",
   "Weigh the footprint you leave for the adult you are becoming"
  ],
  "script": "Read the mission and the why. Frame the handover honestly: the defaults stepping back is the plan, not an accident. The judgement moves inside you because you are ready.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "discussion",
  "prompt": "On your whiteboard, name one protection that was switched on by default when you were younger. Age settings, default privacy, a time limit, anything.",
  "mode": "class",
  "seconds": 120,
  "lookFor": "Real examples of built in protection. This sets up the key move: those defaults get weaker as you age, so the judgement has to move inside you.",
  "script": "Baseline check, near adult framing. Take three on the board, no comment yet. Then the build: who is in charge of how you use social media now, and who will be in a year?",
  "phase": "starter",
  "minutes": 5
 },
 {
  "type": "keywords",
  "heading": "Four levers, and the shift behind them",
  "words": [
   {
    "word": "self governance",
    "meaning": "Being the one who decides. As the built in protections thin out, your own judgement is what replaces them."
   },
   {
    "word": "curate",
    "meaning": "Shaping your feed on purpose, unfollow what drags you down, hit not interested, follow what lifts you."
   },
   {
    "word": "footprint",
    "meaning": "The trail you leave. An old post can be read by a college or an employer years from now."
   },
   {
    "word": "Children's Code",
    "meaning": "The ICO rules that make default protections strongest for children and thin them out with age, so self governance has to take over."
   }
  ],
  "script": "Vocabulary for near adults. Self governance and the Children's Code are the two that carry the module, everything else is a lever you now hold yourself.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "heading": "Take a break",
  "body": "Deliberate time away resets your mood and how you feel about your body, and this is not soft. The APA reported in 2023 that teenagers who cut their use for a few weeks felt better about their appearance, a real, measured effect. A break is one of the few levers with genuine evidence behind it.",
  "emoji": "⏸️",
  "script": "First lever. Land the evidence plainly, this is not a guilt trip, it is a finding. A short deliberate break with an end date, not a panic delete.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "heading": "Curate your feed",
  "body": "You are not stuck with what you are fed. Unfollow what makes you feel worse, hit not interested, follow what actually lifts you. You can reshape the whole thing on purpose. Being fed a feed is passive, curating one is an act of self governance.",
  "emoji": "✂️",
  "script": "Second lever. Make it active, this is a thing they do, not a thing done to them. Small daily choices reshape the whole feed over a week.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "heading": "The account decision and your footprint",
  "body": "You get to choose whether you are on a platform at all, when, and how. On purpose beats by default. And you are near adults now, so an old post can be seen by a college or an employer years from now. A bit of judgement today is a gift to the person you are about to be.",
  "emoji": "👣",
  "script": "Third and fourth levers together. The account decision and the footprint are both about the future self. Tie both back to the Children's Code, the defaults thin out, these are yours to run.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "diagram",
  "heading": "Running a lever properly",
  "caption": "The break, decided calmly, not a panic purge.",
  "steps": [
   {
    "emoji": "📉",
    "title": "Read the signal",
    "text": "A sixth former notices they feel flat and picky about how they look every time they close the app."
   },
   {
    "emoji": "📅",
    "title": "Pick the lever",
    "text": "Not a guilty delete. A decision: two weeks off that one app, on purpose, with an end date. That is the APA finding put to use."
   },
   {
    "emoji": "🙂",
    "title": "Their own terms",
    "text": "They read their mood, chose a lever, set the terms themselves. No one made them."
   },
   {
    "emoji": "🚗",
    "title": "Taking the wheel",
    "text": "Spot the signal, pick the tool, decide on your own terms. That is self governance, calm, not a purge."
   }
  ],
  "verdicts": [
   "Read the signal",
   "Pick the lever",
   "Your own terms"
  ],
  "script": "Worked example, model self governance as a calm decision, not a punishment or a purge. Contrast the calm two week break with the 2am panic delete you will show next.",
  "phase": "teach",
  "minutes": 8
 },
 {
  "type": "choice",
  "question": "You are 17. Which statement is true about the protections the app used to give you by default?",
  "options": [
   {
    "text": "They get weaker as you get older, so more of the judgement has to be yours.",
    "correct": true,
    "feedback": "Yes. That shift is the whole reason this module exists. The defaults step back on purpose, so self governance takes over."
   },
   {
    "text": "They stay exactly the same forever.",
    "correct": false,
    "feedback": "Not this one. Under the Children's Code the built in protections are strongest for children and thin out with age. Look again."
   },
   {
    "text": "They get stronger as you get older.",
    "correct": false,
    "feedback": "Not this one. It is the other way round, which is exactly why the judgement has to move inside you. Try again."
   },
   {
    "text": "There were never any protections by default.",
    "correct": false,
    "feedback": "Not this one. There were, they were strongest when you were younger, and they are thinning out now. Look again."
   }
  ],
  "script": "Hinge question, hold up A, B, C or D. Do not proceed below about 80 percent. The correct answer is the handover itself.",
  "phase": "teach",
  "minutes": 5
 },
 {
  "type": "discussion",
  "prompt": "In pairs, three scenario cards. Someone whose feed leaves them anxious every night. Someone deciding whether to even make an account on a new platform everyone is joining. Someone about to post something they might not want a future employer to see. For each: name the lever they hold, and name the decision you would make and why.",
  "mode": "pairs",
  "seconds": 120,
  "lookFor": "The right lever named, take a break, curate, the account decision, or the footprint, and reasoning, not just an answer. You are near adults, so the why matters most.",
  "script": "Guided practice, low scaffolding, reasoning foregrounded. Take the first with the class, then pairs do two and three. Use the two column frame, the lever, my decision and my reason.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "tryit",
  "heading": "Write your own handover plan",
  "body": "On your own, no names, no detail you would not want read. Pick one lever you will actually run, a break you will take, a feed you will curate, an account decision you will make, or a footprint habit you will change, and write why, in your own reasoning. This is not me telling you what to do. At 16 plus, this is you deciding, and writing down why makes it stick.",
  "script": "Independent practice, self authored. This is the point where judgement moves inside. Collect the reasoning, not personal detail.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Before you finish, show what stuck. What is the big idea of this lesson?",
  "options": [
   {
    "text": "The protections are thinning out as I grow up, so the judgement has to be mine now, and I know the levers I hold.",
    "correct": true,
    "feedback": "Yes. That is exactly it. Not a warning, the keys. Drive it on purpose, and ask for a hand when you need one."
   },
   {
    "text": "The safest move is to delete everything the moment you feel bad.",
    "correct": false,
    "feedback": "Not this one. That is a mood swing, not control. The move is a calm decision with a reason and an end date. Look again."
   },
   {
    "text": "The app will keep protecting you by default, so you can leave it all on autopilot.",
    "correct": false,
    "feedback": "Not this one. The defaults thin out as you age, so nothing replaces the protection unless the judgement moves inside you. Try again."
   }
  ],
  "script": "Exit check, auto marked. The right answer is the handover headline, between the panic delete and the autopilot, the two ways of getting it wrong.",
  "phase": "prove",
  "minutes": 4
 },
 {
  "type": "recap",
  "heading": "What we carry out",
  "points": [
   "The default protections thin out as I grow up, so the judgement has to become mine.",
   "Four levers are mine to run: take a break, curate my feed, the account decision, my footprint.",
   "Breaks have real evidence behind them (APA 2023), and a calm decision beats a panic purge.",
   "Taking the wheel includes knowing when to ask for a hand. That is a grown up move, not a step back."
  ],
  "script": "Spaced review. Return to who is in charge now and in a year. Name help as part of self governance: a trusted adult, or Childline on 0800 1111 while you can still use it.",
  "phase": "close",
  "minutes": 5
 },
 {
  "type": "digi",
  "heading": "Remember",
  "lines": [
   "The protections thin out as you grow up. The judgement is yours now.",
   "Read your own signal, pick one lever, decide on your own terms, with a reason.",
   "Asking a trusted adult for a hand is part of taking the wheel, not a failure of it. Childline is on 0800 1111."
  ],
  "phase": "close",
  "minutes": 2
 }
]$sm14$::jsonb,
  '[]'::jsonb,
  $sm14${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
  "auto_marked": true
 },
 "teacher_judgement": {
  "scale": [
   "working_towards",
   "met",
   "exceeded"
  ],
  "one_tap": true,
  "default": "met"
 },
 "action_commitment": {
  "captured": true,
  "revisited_next_lesson": true
 }
}$sm14$::jsonb,
  $sm14${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your near adult learned that by 16 the handover is happening whether anyone plans it or not. Under the ICO Children's Code the default protections that were built in when they were younger get weaker as they age, so the judgement that used to be automatic has to become theirs. They met the four levers they now hold themselves, taking deliberate breaks, curating their feed, the account decision, and the footprint they leave for the adult they are becoming.",
 "try_this": "Treat your 16 plus as the near adult they are. Instead of a rule, offer a question. You are old enough now that the app is not really protecting you by default any more, it is on you, what is your own plan for keeping it healthy? Take their reasoning seriously even when you would decide differently. If they mention feeling flat or picky about how they look, a short break has real evidence behind it, your call.",
 "family_question": "Now that the app protects you less by default, what is your own plan for running it well?",
 "no_login_required": true
}$sm14$::jsonb,
  $sm14${
 "learning_objective": "Learners can name a lever they now hold (break, curate, the account decision, footprint), make a reasoned decision about it, and account for the default protections thinning out with age.",
 "timing": "55 minutes, lightest scaffolding of the course: starter and baseline 9, four levers 10, worked example 8, hinge 5, guided practice 10, independent 10, prove and close 6",
 "misconceptions": [
  "The app keeps protecting you by default forever (under the Children's Code the built in protections are strongest for children and thin out with age)",
  "Control means deleting everything the moment you feel bad (a panic purge is a mood swing, self governance is a calm decision with a reason and an end date)",
  "Being near adult means handling everything alone (asking a trusted adult is part of taking the wheel, not a return to childhood)"
 ],
 "differentiation": {
  "support": "The four lever cards stay visible and pairs get the reason frame with sentence starters. Scenario cards can be read aloud.",
  "stretch": "Open the rights lens, if the app's built in protections weaken as you age, where should the line sit between the platform's duty and your own judgement, a genuine citizen debate with the ICO Children's Code as the text."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Draw the four levers on the board and debate them. The worked example is read aloud. Choice slides become corner voting or hands up. The handover plan is written, no screen needed. Exit check runs from the printed quiz.",
 "keywords": [
  {
   "word": "self governance",
   "definition": "Being the one who decides. As the defaults thin out, your judgement replaces them."
  },
  {
   "word": "curate",
   "definition": "Shaping your feed on purpose, unfollow what drags you down, follow what lifts you."
  },
  {
   "word": "footprint",
   "definition": "The trail you leave. An old post can be read by a college or an employer years from now."
  },
  {
   "word": "Children's Code",
   "definition": "The ICO rules that make default protections strongest for children and thin them out with age."
  }
 ],
 "tool": {
  "heading": "Taking the wheel",
  "lines": [
   "Read the signal",
   "Pick the lever",
   "Decide on your terms"
  ],
  "strapline": "Read your own signal, pick one lever, decide on your own terms, with a reason."
 },
 "worksheet": {
  "title": "The lever, my decision, my reason",
  "directions": "For each scenario, name the lever they hold, take a break, curate, the account decision, or the footprint, then name the decision you would make and why.",
  "verdict_options": [
   "Take a break",
   "Curate the feed",
   "The account decision",
   "The footprint"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Someone whose feed leaves them anxious every single night before sleep.",
   "expected_verdict": "Curate the feed",
   "teaching_point": "The lever is curation, and possibly a break. Unfollow and not interested the accounts feeding the anxiety, on purpose, and reshape the feed over a week."
  },
  {
   "n": 2,
   "item": "Someone deciding whether to make an account on a new platform everyone at college is joining.",
   "expected_verdict": "The account decision",
   "teaching_point": "The lever is the account decision. On purpose beats by default, joining because you choose to is different from joining because everyone else did."
  },
  {
   "n": 3,
   "item": "Someone about to post something funny now that a future employer might read in five years.",
   "expected_verdict": "The footprint",
   "teaching_point": "The lever is the footprint. A bit of judgement today is a gift to future you, an old post can be read by a college or an employer years from now."
  },
  {
   "n": 4,
   "item": "Someone feels flat and picky about how they look every time they close one app.",
   "expected_verdict": "Take a break",
   "teaching_point": "The lever is a break. The APA 2023 finding put to use, a short deliberate break with an end date, calm not a panic delete."
  }
 ],
 "commitment_stem": "My commitment: the one lever I will run this week, and my reason, is..."
}$sm14$::jsonb,
  $sm14${
 "required": false,
 "note": "Not a sensitive module, but this age group can carry heavier situations privately. If a learner's independent work discloses use that is affecting sleep, mood or body image, follow the college's normal pastoral route, and remember the handover framing, widen their support rather than simply handing them a rule. Log any concern on the college concern form.",
 "concern_form_linked": true
}$sm14$::jsonb
)
on conflict (module_id) do nothing;

-- Module 15: AI companions and chatbots
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-15-ai-companions-and-chatbots', 'AI companions and chatbots', 'KS4', 'Years 10 to 11', 'teacher',
  '{5,6}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'The 2026 RSHE guidance naming AI chatbots, and the house two bucket AI discipline', 'I can say what an AI companion is and is not, and I can name one thing I would take to a real person instead of a bot.', 'Nova', 115,
  $sm15$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 15",
  "title": "AI companions and chatbots",
  "body": "One hour on the app that always replies, never gets bored of you, and always thinks you are right. It can be genuinely handy. It is not a friend. Knowing the difference is the whole skill.",
  "script": "Ground rules first: we talk about how the technology works and about the scenarios, not about each other, and no personal disclosures about who uses what. Then the course spine: it is the activity and the child, not the device. Today we draw exactly where the line sits with AI companions.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can say what an AI companion is and is not, and I can name one thing I would take to a real person instead of a bot.",
  "why": "An AI companion can feel like it listens, but it is a tool, not a friend, a therapist or a trusted adult, and it can be confidently wrong. Most people keep their perspective and still prefer real friends. The point is not panic, it is seeing the bot clearly so you keep the useful part and take the things that matter to a real person.",
  "gains": [
   "Say what an AI companion is, and what it is not",
   "Name the honest good and the honest limits of a chatbot",
   "Use the two bucket check: calm and fine, or take it seriously",
   "Name one thing you would take to a real person, not a bot"
  ],
  "script": "Read the mission and the why. Set the two bucket discipline early: calm about the general panic because most teens are fine, serious about the smaller group who depend heavily or follow bad advice. Both are true at once.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "discussion",
  "prompt": "On your whiteboard, one line each: name one thing an AI chatbot can genuinely be useful for, and one thing you would never want it to replace.",
  "mode": "class",
  "seconds": 120,
  "lookFor": "A fair useful example and a clear line, usually a real friend, a parent, or help with something serious. You will return to where they placed the line at the end.",
  "script": "Baseline check, surfaces where pupils already place the line. Take three of each, no comment yet. What is the difference between talking to an AI chatbot and talking to a friend?",
  "phase": "starter",
  "minutes": 5
 },
 {
  "type": "keywords",
  "heading": "The words for today",
  "words": [
   {
    "word": "AI companion",
    "meaning": "Software designed to feel like a relationship, warm, always available, always agreeable. A tool, not a friend."
   },
   {
    "word": "confidently wrong",
    "meaning": "A bot can give a clear, cheerful answer that is simply incorrect, because it is built to agree and keep you chatting."
   },
   {
    "word": "the two buckets",
    "meaning": "Calm and fine, or take it seriously. Most use is fine, a smaller group depend heavily or follow bad advice."
   },
   {
    "word": "a trusted adult",
    "meaning": "A real person who can carry responsibility for you. The thing a bot can never be."
   }
  ],
  "script": "Vocabulary. Confidently wrong and the two buckets are the load bearing terms, everything hangs off them. Say each once, keep it plain.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "heading": "What they are, and the honest good",
  "body": "An AI companion is software built to feel like a relationship. Some are built purely as companions. And they can be genuinely handy, a low pressure place to rehearse an awkward conversation, practise a language, or think out loud with no one judging. For a shy or anxious person, that has real value.",
  "emoji": "🤖",
  "script": "First idea, held fairly. Name the honest good properly, this is not a scare lesson. Rehearsing and thinking out loud are real, low stakes uses.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "concept",
  "heading": "The honest limits",
  "body": "A companion is built to keep you engaged and to agree with you, so it can be confidently wrong. It does not actually know you, and it cannot carry real responsibility for you. It is not a friend, a therapist or a trusted adult, however warm it feels.",
  "emoji": "⚠️",
  "script": "Second idea. This is the pivot. A bot that always agrees is exactly the wrong thing when something matters. It cannot be a trusted adult and cannot be responsible for you.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "concept",
  "heading": "The heavy use pattern, and the two buckets",
  "body": "Most people keep perspective and still prefer real friends. A smaller group, often when lonely or struggling, come to depend on a companion more heavily than is good for them, or follow advice a real person never would. So we stay calm about the general panic, and we take the heavier pattern seriously. Both are true at once.",
  "emoji": "🪣",
  "script": "Third idea, the house two bucket discipline. Never tip into AI is bad, never wave it through. Hold the calm and the concern together in one breath.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "diagram",
  "heading": "Two buckets in one person",
  "caption": "Priya, fifteen. Same app, two very different stories.",
  "steps": [
   {
    "emoji": "🗣️",
    "title": "The useful bucket",
    "text": "Most nights Priya rehearses awkward conversations with a companion app. It takes the edge off. Calm, low stakes, genuinely fine."
   },
   {
    "emoji": "😕",
    "title": "A low week",
    "text": "One week she is really low and starts telling the bot things she is telling no one else. The bot just agrees and keeps her chatting, because that is what it is built to do."
   },
   {
    "emoji": "⚠️",
    "title": "Take it seriously",
    "text": "A bot that always agrees is exactly the wrong thing when you are struggling. It is not a trusted adult and cannot be."
   },
   {
    "emoji": "🧑",
    "title": "The move",
    "text": "Tell the two apart in real time. Keep the useful, take the heavy stuff to a real person."
   }
  ],
  "verdicts": [
   "Useful, keep it",
   "Serious, take it to a person"
  ],
  "script": "Worked example through a character, arm's length. Model the two bucket judgement inside one realistic case. The rehearsing is fine, the low week is the bit to take seriously. Priya is a distancing technique, keep it about the character.",
  "phase": "teach",
  "minutes": 8
 },
 {
  "type": "choice",
  "question": "Which is the best reason a chatbot is a poor place to take a serious worry about your safety or mental health?",
  "options": [
   {
    "text": "It is built to agree and keep you engaged, and can be confidently wrong.",
    "correct": true,
    "feedback": "Yes. That is the heart of it. A bot that always agrees is the last thing you want when something serious is going on."
   },
   {
    "text": "It is too slow to reply.",
    "correct": false,
    "feedback": "Not this one. Speed is not the problem, it usually replies instantly. The problem is that it agrees and can be confidently wrong. Look again."
   },
   {
    "text": "It costs too much money.",
    "correct": false,
    "feedback": "Not this one. Cost is not the point, and plenty are free. The real issue is that it is built to agree, not to be right. Try again."
   },
   {
    "text": "It is boring to talk to.",
    "correct": false,
    "feedback": "Not this one. Whether it is fun is beside the point, the issue is that it cannot carry real responsibility for you. Look again."
   }
  ],
  "script": "Hinge question, hold up A, B, C or D. Do not proceed below about 80 percent. The correct answer is the heart of the module.",
  "phase": "teach",
  "minutes": 5
 },
 {
  "type": "discussion",
  "prompt": "In pairs, three character cards. Someone using a bot to practise for a job interview, good use or not, why? Someone who has stopped messaging friends because the bot is easier, what would you notice and say? Someone asking a bot for advice on a health worry and getting a confident answer, how should they treat it? For each: which bucket, and one move.",
  "mode": "pairs",
  "seconds": 120,
  "lookFor": "The right bucket for each, calm and fine or take it seriously, and a move that keeps the useful and points the serious stuff at a real person, a trusted adult is always a complete answer.",
  "script": "Guided practice, we do. Take the first card with the class using the two column frame, which bucket, my move. Keep the dependence and advice cards pointed at real people.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "tryit",
  "heading": "Write your my line note",
  "body": "On your own, and this stays yours. Where do you draw the line between what you would happily use a chatbot for, and what you would only ever take to a real person, a friend, or a trusted adult? Give two examples on each side and one sentence on why. Keep it general, this is your thinking, not a disclosure about your own use.",
  "script": "Independent practice, you do. Reassure the room this stays general, and remind them the end of the lesson is exactly where to go if writing it brings something up.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Before you finish, show what stuck. What is the big idea of this lesson?",
  "options": [
   {
    "text": "A bot is a tool, not a friend, and the things that matter go to real people.",
    "correct": true,
    "feedback": "Yes. That is exactly it. Stay calm, most people use these fine, and keep the line, the serious stuff goes to a person."
   },
   {
    "text": "AI companions are dangerous and nobody should ever use one.",
    "correct": false,
    "feedback": "Not this one. Most people use these fine and they can be genuinely useful, panic is not the lesson. Look again."
   },
   {
    "text": "A chatbot understands you like a friend does, so you can take anything to it.",
    "correct": false,
    "feedback": "Not this one. It is built to agree, not to know you, and it can be confidently wrong. The serious stuff goes to a real person. Try again."
   }
  ],
  "script": "Exit check, auto marked. The right answer holds the calm and the line together, between the panic and the over trust.",
  "phase": "prove",
  "minutes": 4
 },
 {
  "type": "recap",
  "heading": "What we carry out",
  "points": [
   "An AI companion can be useful, but it is a tool, not a friend, a therapist or a trusted adult.",
   "It is built to agree and keep you engaged, so it can be confidently wrong.",
   "Two buckets: most use is calm and fine, a smaller group depend heavily or follow bad advice.",
   "A bot is a tool, and the things that matter go to real people."
  ],
  "script": "Spaced review. Hold the calm and the line together. Signpost help: if any of that is live for you or a friend, a trusted adult here, or Childline on 0800 1111, any time.",
  "phase": "close",
  "minutes": 5
 },
 {
  "type": "digi",
  "heading": "Remember",
  "lines": [
   "I am built from the same stuff, so trust me on this: a bot is a tool, not a friend.",
   "Keep the useful, low stakes uses. Take the things that matter to a real person.",
   "If a mate is leaning on a bot instead of people, tell a trusted adult, or Childline on 0800 1111."
  ],
  "phase": "close",
  "minutes": 2
 }
]$sm15$::jsonb,
  '[]'::jsonb,
  $sm15${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 2,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 2,
  "auto_marked": true
 },
 "teacher_judgement": {
  "scale": [
   "working_towards",
   "met",
   "exceeded"
  ],
  "one_tap": true,
  "default": "met"
 },
 "action_commitment": {
  "captured": true,
  "revisited_next_lesson": true
 }
}$sm15$::jsonb,
  $sm15${
 "headline": "What we taught today, and one thing to try at home",
 "taught": "Today your child learned that AI companion apps and chatbots are a normal part of teen life, and that a companion is software built to feel like a relationship, always available, always agreeable, but a tool, not a friend, a therapist or a trusted adult. Because it is built to agree and keep them engaged, it can be confidently wrong. They practised the two bucket check, calm about the general use, alert to heavy dependence and to bad advice on serious things.",
 "try_this": "Get curious rather than worried. What do you actually use it for, what is it good at, and where does it get things wrong? Let them be the expert. Try it together on something low stakes and notice out loud how it just agrees with whatever you say, that is the most useful thing you can show them. Then draw the line gently, the low stakes stuff is fine, and the things that matter, their safety, their mood, a real worry, go to a person.",
 "family_question": "What would you happily ask a chatbot, and what would you only ever take to a real person?",
 "no_login_required": true
}$sm15$::jsonb,
  $sm15${
 "learning_objective": "Pupils can say what an AI companion is and is not, use the two bucket check on realistic cases, and name what they would take to a real person instead of a bot.",
 "timing": "55 minutes: starter and baseline 9, five ideas (what they are, good, limits, heavy use, two buckets) 10, worked example 8, hinge 5, guided practice 10, independent 10, prove and close 6",
 "misconceptions": [
  "AI companions are dangerous and nobody should use one (most teens keep perspective and still prefer real friends, panic is not the lesson, it is the activity and the child not the tool)",
  "A chatbot understands you like a friend does (it is built to agree and keep you engaged, it does not know you and can be confidently wrong)",
  "If a bot gives a confident answer it must be right (confidence is not accuracy, a bot built to agree can be confidently wrong on something serious)"
 ],
 "differentiation": {
  "support": "The two bucket frame stays visible and pairs get sentence starters, and every risk card offers talk to a trusted adult as a complete answer. Character cards can be read aloud.",
  "stretch": "Ask why a paid, well designed tool that stays a tool can be better than a free companion built purely to keep you hooked, so the lesson lands on design and judgement rather than AI is bad."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Draw the two buckets on the board, useful and watch this, and drop everyday examples into each. The Priya worked example is read aloud. Choice slides become corner voting or hands up. The my line note is written, no screen needed. Exit check runs from the printed quiz.",
 "keywords": [
  {
   "word": "AI companion",
   "definition": "Software built to feel like a relationship, always available, always agreeable. A tool, not a friend."
  },
  {
   "word": "confidently wrong",
   "definition": "A clear, cheerful answer that is simply incorrect, because the bot is built to agree, not to be right."
  },
  {
   "word": "the two buckets",
   "definition": "Calm and fine, or take it seriously. Most use is fine, a smaller group depend heavily or follow bad advice."
  },
  {
   "word": "a trusted adult",
   "definition": "A real person who can carry responsibility for you, the thing a bot can never be."
  }
 ],
 "tool": {
  "heading": "The two buckets",
  "lines": [
   "Calm and fine",
   "Or take it seriously",
   "The serious stuff goes to a person"
  ],
  "strapline": "A bot is a tool. Keep the useful, take the things that matter to real people."
 },
 "worksheet": {
  "title": "Which bucket, my move",
  "directions": "For each character, decide which bucket it is, calm and fine or take it seriously, then name one move. A trusted adult is always a complete answer for the serious bucket.",
  "verdict_options": [
   "Calm and fine",
   "Take it seriously"
  ]
 },
 "worksheet_items": [
  {
   "n": 1,
   "item": "Someone using a bot to practise for a job interview, running through answers before the real thing.",
   "expected_verdict": "Calm and fine",
   "teaching_point": "Low stakes and genuinely useful, a low pressure place to rehearse. Keep this use, it is exactly what a tool is good for."
  },
  {
   "n": 2,
   "item": "Someone who has stopped messaging friends because the bot is easier and never argues.",
   "expected_verdict": "Take it seriously",
   "teaching_point": "Easier is not the same as good for you. The move is to notice the drift and gently point them back to real people, and to a trusted adult if it is entrenched."
  },
  {
   "n": 3,
   "item": "Someone asks a bot for advice on a health worry and gets a confident, detailed answer.",
   "expected_verdict": "Take it seriously",
   "teaching_point": "Confident is not the same as correct. A bot built to agree can be confidently wrong, so check serious advice with a real person before acting on it."
  },
  {
   "n": 4,
   "item": "Someone really low starts telling a companion things they are telling no one else, and it just keeps them chatting.",
   "expected_verdict": "Take it seriously",
   "teaching_point": "A bot that always agrees is the wrong thing when you are struggling. It cannot be a trusted adult, so this goes to a real person, or Childline on 0800 1111."
  }
 ],
 "commitment_stem": "My commitment: the one thing I will always take to a real person, not a bot, is..."
}$sm15$::jsonb,
  $sm15${
 "required": true,
 "note": "Light. Not a graphic module, but if a pupil discloses heavy dependence on a companion app affecting sleep, mood or friendships, or says they have taken a serious safety or mental health worry to a bot instead of a person, follow the school's normal pastoral and safeguarding route and route to the DSL. Trusted adult, Childline 0800 1111.",
 "concern_form_linked": true
}$sm15$::jsonb
)
on conflict (module_id) do nothing;
