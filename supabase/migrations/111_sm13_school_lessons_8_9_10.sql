-- Migration 111: 13+ Social Media Literacy, schools in depth, sensitive safeguarding trio
-- Seeds three SENSITIVE school_lessons rows for the 13+ social media curriculum:
--   Module 8  strangers, DMs and grooming        (sm13-08-strangers-dms-and-grooming)
--   Module 9  nudes, the law and sextortion       (sm13-09-nudes-the-law-and-sextortion)
--   Module 10 rabbit holes and radicalisation     (sm13-10-rabbit-holes-and-radicalisation)
-- Built from each module's VERSION A. SCHOOLS IN DEPTH seven beat plan.
-- Calm, non graphic, the young person is never at fault, firm DSL note on every row.
-- British English, no dashes in any copy. Every deck closes on the support signpost.
-- Idempotent: on conflict (module_id) do nothing.

-- ===========================================================================
-- Module 8: Strangers, DMs and grooming
-- ===========================================================================
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-08-strangers-dms-and-grooming', 'Strangers, DMs and grooming', 'KS4', 'Years 10 to 11', 'teacher',
  '{2,6}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'NSPCC on grooming and private messaging',
  'I can name the signs that a private chat is going wrong, and the steps I take if it does.',
  'Nova', 108,
  $sm8$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 8",
  "title": "Strangers, DMs and grooming",
  "body": "One hour on private messages. Most are fine, a few are not, and today you learn to read the pattern and always have a move.",
  "script": "Settle the room and set the register early. This is a serious one and I am going to talk to you like the near adults you are. Nothing today is a warning or an accusation, and nothing anyone says in honest discussion goes on a report. We talk about the signs and the scenarios, never about each other. By the end of the hour you will be able to read a chat the way I want you to.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can name the signs that a private chat is going wrong, and the steps I take if it does.",
  "why": "Most people you meet online are fine, and most direct messages are nothing to worry about. This lesson is about the small number of adults who use private chat to get close to a young person, because private is hidden. You cannot always spot the person, so you learn to spot the pattern, and you always have a plan.",
  "gains": [
   "Name the six signals that a private chat is going wrong",
   "Read a pattern over time rather than judging one first message",
   "Say the response steps in order, from do not reply to tell a trusted adult",
   "Explain why a young person is never at fault for what an adult does"
  ],
  "script": "Read the mission and the why out loud. The big framing move: this is not stop talking to people online. It is knowing the pattern that a small number of adults use, so you are never caught out. Entry question on the board, a stranger sends a friendly message and seems really nice, is that a problem. Take three answers, no comment yet. We come back to them at the end.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "keywords",
  "heading": "Words for today",
  "words": [
   {
    "word": "grooming",
    "meaning": "When an adult builds trust with a young person in order to harm them. It is child abuse, and it is always the adult's fault, never the young person's."
   },
   {
    "word": "private message",
    "meaning": "A one to one chat that others cannot see from the outside. It is where this lesson lives, because hidden is exactly what the pattern needs."
   },
   {
    "word": "the pattern",
    "meaning": "Signals that stack up over time. No single one proves anything, but two or three together are the signal to stop and tell someone."
   },
   {
    "word": "CEOP",
    "meaning": "The Child Exploitation and Online Protection command. The place to report anything where an adult has contacted a young person."
   }
  ],
  "script": "Say each word, take the fear out of grooming by naming it plainly and calmly. The one to keep hold of is the pattern: we are not going to try to guess who is good or bad from one message, we are going to count signals over time.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🌤️",
  "heading": "Start with the calm truth",
  "body": "Most of what happens online is in private messages you cannot see from the outside, and most of it is completely fine. This lesson is about a small number of adults who use private chat to get close to a young person, because it is hidden. The NSPCC is clear that criminals use private messaging to build trust with children. So that is where we look, not because everyone is a threat, but because knowing the pattern means you are never caught out.",
  "script": "Land the calm truth first, so the room does not tip into fear. Most messages are nothing to worry about. We are studying a pattern used by a small number of adults, and once you can see it, it loses its power. Hold that steady tone the whole way through.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "diagram",
  "heading": "Six signals a chat is going wrong",
  "caption": "No single card proves anything. It is the pattern stacking up over time that tells you, and being unsure is already enough to stop.",
  "steps": [
   {
    "emoji": "💬",
    "title": "Flattery turned up high",
    "text": "You are so mature, you are not like others your age."
   },
   {
    "emoji": "🎁",
    "title": "Gifts and offers",
    "text": "Free credits, money, followers, something for nothing."
   },
   {
    "emoji": "🤫",
    "title": "Secrecy",
    "text": "Keep this between us, do not tell your parents."
   },
   {
    "emoji": "➡️",
    "title": "Moving the chat",
    "text": "Come off here onto a quieter app, just us, somewhere harder to see."
   },
   {
    "emoji": "📈",
    "title": "Requests that grow",
    "text": "Small at first, then a photo, where you live, a meet up."
   },
   {
    "emoji": "🌥️",
    "title": "Pressure and guilt",
    "text": "Warm one minute, then guilt or pressure the moment you pull back."
   }
  ],
  "script": "Reveal the six one at a time, one signal per card, and keep it non graphic. The line to repeat: no single one proves anything, the pattern is the signal. Two or three of these stacking up means stop replying and tell a trusted adult. You never have to be certain first.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "choice",
  "question": "Hinge question. Someone you have only ever talked to online says, delete these messages and add me on a different app so it is just us. What is that?",
  "options": [
   {
    "text": "Two grooming signals together, secrecy and moving the chat",
    "correct": true,
    "feedback": "Yes. Secrecy plus moving the chat to somewhere quieter is the pattern stacking up. You do not need to be sure of anything else. That is the moment to stop and tell a trusted adult."
   },
   {
    "text": "A normal thing friends do",
    "correct": false,
    "feedback": "Real friends do not need you to delete messages or hide the chat from your parents. Look again at the six cards, this is secrecy and moving the chat together."
   },
   {
    "text": "A technical problem with the app",
    "correct": false,
    "feedback": "This is not about the app being annoying. Asking you to delete the messages and move somewhere just us is two signals of the pattern we named."
   }
  ],
  "script": "Whole class check, hold up your answer. If most say the first option, move on. If not, back to the six cards. The misconception to smash: a request to move apps and keep it secret is not friendly, it is the pattern.",
  "phase": "teach",
  "minutes": 5
 },
 {
  "type": "scenario",
  "label": "Worked example, invented, no real person",
  "platform": "message",
  "handle": "new follower",
  "avatar": "🙂",
  "meta": "Direct message · day two",
  "text": "you seem so mature for your age 😊 honestly you are not like other people I talk to. hey this app is annoying, add me on the other one, just us? and maybe do not mention it to anyone, they would not get it",
  "image": "💭",
  "prompt": "Read this the way we read a pattern. How many signals can you count, and what should the person on the other end do next?",
  "script": "Model it aloud. I am not deciding if this person is bad. I am counting signals. Flattery turned up high, that is one. Move to another app, that is two. Keep it secret, that is three. Three signals in, you do not need to be sure. You stop replying and you tell a trusted adult. Count the pattern, act early, do not wait to be certain.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "concept",
  "emoji": "🧭",
  "heading": "Count the pattern, act early",
  "body": "The trap sounds like this, but they are so nice to me, I do not want to be rude, maybe I am overthinking it. Here is the move. You never owe a stranger a reply, and being unsure is already enough. You do not have to be certain, you do not have to explain yourself, and you never have to keep a secret an adult asks you to keep. The secrecy is the trick, and the moment you tell a trusted adult, the trick stops working.",
  "script": "This is the calibration slide. Say it plainly: you do not owe anyone online a reply, and unsure is enough to act. And the sentence that must land, you are never at fault for what an adult does, ever. Telling is always the right move.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "practise",
  "minutes": 10,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "In pairs, and through a made up friend, not yourselves. A friend tells you a chat has started to feel off, ticking some of the signals we named. What do you say back, and what are the five response steps in the right order?",
  "lookFor": "The five steps in order: do not reply, do not meet, keep the evidence with a screenshot, block, tell a trusted adult who can report to CEOP. Plus a calm, warm thing to say to the friend, you are not in trouble and you did the right thing telling me.",
  "script": "Two minutes on the timer, pairs, framed as helping a friend because it is easier to see clearly for someone else first. Circulate, then take one strong helper card from a few pairs. Keep it outward facing, no personal disclosures in the room, that is the ground rule."
 },
 {
  "type": "diagram",
  "heading": "Your five steps, in order",
  "caption": "The steps are the same every time. You are never stuck, there is always a step and always a grown up.",
  "steps": [
   {
    "emoji": "✋",
    "title": "Do not reply",
    "text": "You owe a stranger nothing. Silence is a complete answer."
   },
   {
    "emoji": "🚷",
    "title": "Do not meet",
    "text": "No matter what has been offered or promised."
   },
   {
    "emoji": "📸",
    "title": "Keep the evidence",
    "text": "Screenshot the messages and the account before anything."
   },
   {
    "emoji": "⛔",
    "title": "Block them",
    "text": "Once the evidence is kept, close the door."
   },
   {
    "emoji": "🧑",
    "title": "Tell a trusted adult",
    "text": "Who can report to CEOP. You are never in trouble for telling."
   }
  ],
  "script": "Walk the five steps in order. The one pupils forget is keep the evidence before you block, so say it twice. End on the last step: telling an adult is not getting yourself into trouble, it is the thing that ends it.",
  "phase": "practise",
  "minutes": 4
 },
 {
  "type": "choice",
  "question": "Exit check. A friend says a chat has felt wrong and they are scared they will be in trouble for talking to the person. What is the true thing to tell them?",
  "options": [
   {
    "text": "You are not in trouble, none of this is your fault, and telling a trusted adult is the right move",
    "correct": true,
    "feedback": "Exactly right. A young person is never at fault for what an adult does. Telling a trusted adult, who can report to CEOP, is always the right move, and it is the thing that ends it."
   },
   {
    "text": "Delete everything and never mention it to anyone",
    "correct": false,
    "feedback": "Deleting and staying silent is what the secrecy trick relies on. Keep the evidence and tell a trusted adult, that is what takes the weight off and stops it."
   },
   {
    "text": "It is probably their own fault for replying, so they should just handle it alone",
    "correct": false,
    "feedback": "Never. The fault is always with the adult, never the young person. Nobody should carry this alone, and a trusted adult is always the safe person to tell."
   }
  ],
  "script": "Silent, independent answers, this one is your evidence for the outcome. A pupil who picks the first option has met it. Anyone who leans toward blame needs the calibration slide again, the back button works.",
  "phase": "prove",
  "minutes": 3
 },
 {
  "type": "recap",
  "heading": "What to hold on to",
  "points": [
   "It is the pattern over time that tells you, not one nice message.",
   "You never owe a stranger a reply, and being unsure is already enough to stop.",
   "The five steps: do not reply, do not meet, keep the evidence, block, tell a trusted adult.",
   "You are never at fault for what an adult does, and you are never alone with it."
  ],
  "script": "Return to the entry answers on the friendly stranger and ask which one holds up now. Read the recap, one point each. Land the last line hardest, it is the whole safeguarding message of the lesson.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "Where to go, always",
  "lines": [
   "If anything today brought something to mind, for you or a friend, you are never in trouble and never alone.",
   "Talk to a trusted adult here in school, any time you need to.",
   "You can also talk to Childline, any time, on 0800 1111.",
   "Anything where an adult has contacted a young person can be reported to CEOP, and the people there are calm and on your side."
  ],
  "script": "Let DiGi hold the close. Keep the support signpost on screen as pupils leave: a trusted adult, Childline 0800 1111, and CEOP. Next lesson we look at private images, the law, and how it protects you rather than catches you out."
 }
]$sm8$::jsonb,
  '[]'::jsonb,
  $sm8${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 1,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 1,
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
}$sm8$::jsonb,
  $sm8${
 "headline": "What we taught today, and one calm thing to say at home",
 "taught": "Today your child learned that most contact online is fine, and that a small number of adults use private messages to get close to a young person. They learned to read the pattern rather than judge one message, and the five steps if a chat ever feels wrong: do not reply, do not meet, keep the evidence, block, and tell a trusted adult.",
 "try_this": "Keep it about the pattern, not about frightening them. Try, if someone you only knew online started saying keep this between us, what would you make of that? Then agree together that no adult ever has a good reason to ask a young person to keep a secret from their parents.",
 "family_question": "If anything online ever felt wrong, what would help you know you could tell me, and that you would never be in trouble and never lose your phone for it?",
 "no_login_required": true
}$sm8$::jsonb,
  $sm8${
 "learning_objective": "Pupils can name the signs that a private chat is going wrong and lay out the response steps in order, understanding that the young person is never at fault.",
 "timing": "55 minutes: recall 5, new input 10, worked example 8, hinge 5, guided practice 10, independent practice 10, review and signpost 7",
 "misconceptions": [
  "A friendly first message is the danger (it is the pattern stacking up over time that tells you, not one nice message)",
  "You have to be certain before you act (being unsure is already enough, you never owe a stranger a reply)",
  "Talking to the person means you are in trouble (a young person is never at fault for what an adult does, and telling is always the right move)"
 ],
 "differentiation": {
  "support": "Keep the six signal cards and the five step plan visible throughout, and give pairs sentence starters for the helper card.",
  "stretch": "Discuss why platforms now limit who can message under 18 accounts, under the Online Safety Act, so pupils see the system is being built to protect them, not just the individual being told to be careful."
 },
 "paper_fallback": "The whole lesson runs from the printed pack. Draw the six signals and the five steps on the board, read the invented chat aloud, and run the hinge and exit checks as read aloud questions with corner voting. No screen needed.",
 "keywords": [
  {
   "word": "grooming",
   "definition": "When an adult builds trust with a young person in order to harm them. It is child abuse, and always the adult's fault."
  },
  {
   "word": "the pattern",
   "definition": "Signals that stack up over time. No single one proves anything, but two or three together are the signal to stop and tell someone."
  },
  {
   "word": "CEOP",
   "definition": "The Child Exploitation and Online Protection command, where anything about an adult contacting a young person can be reported."
  }
 ],
 "commitment_stem": "My commitment: if a chat ever felt wrong, for me or a friend, the first step I would take is"
}$sm8$::jsonb,
  $sm8${
 "required": true,
 "note": "SENSITIVE MODULE. Read before teaching and brief the DSL that this lesson is running. Grooming is child abuse and any disclosure is a safeguarding matter. Do not investigate or question a pupil yourself, do not ask to see the messages beyond what they volunteer, do not promise secrecy, and do not remove or delete anything. If a pupil discloses during the lesson, at the door afterwards, or days later, respond calmly, thank them for telling you, reassure them they are not in trouble and it is not their fault, then follow the school safeguarding procedure and pass to the designated safeguarding lead the same day. Use the school concern form for anything raised, the platform records no disclosures by design. Pass on low level concerns too, including any pupil who seems unusually affected or hangs back.",
 "concern_form_linked": true
}$sm8$::jsonb
)
on conflict (module_id) do nothing;

-- ===========================================================================
-- Module 9: Nudes, the law and sextortion (the most careful module)
-- ===========================================================================
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-09-nudes-the-law-and-sextortion', 'Nudes, the law and sextortion', 'KS4', 'Years 10 to 11', 'teacher',
  '{2,4,6}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'UKCIS sharing nudes guidance and NCA on sextortion',
  'I can explain, calmly, why the law is on a young person''s side here, and I know the exact steps and help if a private image is ever shared or used against someone.',
  'Nova', 109,
  $sm9$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 9",
  "title": "Nudes, the law and sextortion",
  "body": "One hour, kept calm the whole way. Before anything else: if any of this ever happens to you or a friend, you are not in trouble, you have done nothing wrong, and you are not alone.",
  "script": "Set the safe frame before anything. One promise from me: nothing today is a warning or an accusation. It is information that protects you. We talk about the law and the scenarios, never about each other, and questions can be written anonymously if that is easier. Hold the words you are not in trouble on screen from the start.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can explain, calmly, why the law is on a young person's side here, and I know the steps and help if a private image is ever shared or used against someone.",
  "why": "The reason this topic matters is not the image, it is the fear. Fear of getting in trouble is exactly what stops a young person telling someone, and silence is what lets things get worse. So we lower the fear on purpose. When you know you are a victim, not a criminal, and that help exists, the panic drops and the right steps become possible.",
  "gains": [
   "Explain, in both halves, why the law here protects young people",
   "Recognise sextortion as a money scam run by criminals, not a relationship",
   "Understand that a fake or AI image makes the person in it a victim, always",
   "Say the five response steps and three calm things to steady a friend"
  ],
  "script": "Read the mission and the why. Name the fear early so the lesson can lower it. Anonymous entry question, true or false, if a teenager sends a private photo of themselves and it gets shared, they are the one in trouble. Collect the split without reading names. The whole hour moves the room from a false fear to an accurate, calmer understanding.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "keywords",
  "heading": "Words for today",
  "words": [
   {
    "word": "sextortion",
    "meaning": "A money scam where a criminal gets a private image and threatens to share it unless you pay. It is organised crime, not a relationship, and it is never your fault."
   },
   {
    "word": "victim",
    "meaning": "The person a crime is done to. In every scenario today, the young person is the victim, never the culprit."
   },
   {
    "word": "Report Remove",
    "meaning": "A tool run by the IWF, the Internet Watch Foundation, that helps a young person get a nude image of themselves taken down."
   },
   {
    "word": "deepfake",
    "meaning": "A fake image or video made to look real. A faked nude of a real person is a real harm, and that person is a victim."
   }
  ],
  "script": "Say each word calmly. The one to keep is victim: today is about understanding that the law is built so that being a victim never makes you a criminal, which is exactly what lets you ask for help.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🛡️",
  "heading": "The law, and why it protects you",
  "body": "Here is the law in both halves, because you need both. Making, sharing or possessing an indecent image of anyone under 18 is a criminal offence, even a self made one. That sounds frightening, so here is the half that matters just as much. UK guidance, UKCIS, is clear that children should not be unnecessarily criminalised, and formal action against a young person is used only in exceptional cases, with a recorded outcome that avoids criminalising them. The reason you learn both halves together is this: the law is built to protect you, so being a victim never makes you a criminal, which means you can always ask for help.",
  "script": "Teach both halves in one breath, never the first half alone. The offence exists, and the protective guidance exists, and it is the second half that makes it safe to seek help. Do not quote offence section numbers. Land the line: the law is on your side, so a victim here can always ask for help.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "concept",
  "emoji": "💸",
  "heading": "Sextortion is a money scam",
  "body": "Sextortion is financially motivated. A flirty new contact turns friendly fast, asks for a private image, then threatens to share it unless you pay. It is not a relationship, it is organised crime, and the person on the other end does this to many people every day. The NCA reports that teenage boys aged 14 to 17 are particularly targeted. Two things are always true: paying only tells the criminal it works, so the demands keep coming, and staying silent is exactly what they are counting on.",
  "script": "Name it plainly as organised crime, not a relationship, so the shame has nowhere to land. The two anchors: do not pay, do not stay silent. Boys are heavily targeted, so make sure the boys in the room hear this is aimed at them too, calmly.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "concept",
  "emoji": "🧪",
  "heading": "Fake and AI images",
  "body": "Some apps claim to make a fake nude from an ordinary photo of a real person who never sent anything. Ofcom has flagged the rise of this. It is treated as a real harm, not a joke, and the person in the fake image is a victim, full stop. Making or sharing a fake indecent image of someone under 18 is a serious matter and a safeguarding concern, and if it involves a classmate, an adult in school needs to know.",
  "script": "Keep this non graphic and short. The point to land: a fake image makes the real person a victim, always, and it is a safeguarding matter, not a joke. If it is about a classmate, tell an adult in school.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "choice",
  "question": "Hinge question. A teenager is targeted by a sextortion scam and is terrified they will be in trouble. Which of these is true?",
  "options": [
   {
    "text": "They are the victim, the law is on their side, and telling a trusted adult is the right move",
    "correct": true,
    "feedback": "Exactly. A young person targeted here is a victim, not a criminal. The fear is the trap, and the truth breaks it. Telling a trusted adult is the right move."
   },
   {
    "text": "Paying will make it stop",
    "correct": false,
    "feedback": "Paying only tells a criminal it works, so the demands keep coming. The move is do not pay, do not comply further, keep the evidence, and tell a trusted adult."
   },
   {
    "text": "They are the criminal here",
    "correct": false,
    "feedback": "No. A young person targeted by this scam is the victim. UK guidance is clear that children should not be unnecessarily criminalised. Look again at the law card."
   }
  ],
  "script": "Whole class check, hold up your answer. If most say the first option, move on. If not, back to the law card, because that fear is exactly what we are here to fix. Victim, not culprit.",
  "phase": "teach",
  "minutes": 5
 },
 {
  "type": "scenario",
  "label": "Worked example, invented, no real person",
  "platform": "message",
  "handle": "new contact",
  "avatar": "🙂",
  "meta": "Direct message · same evening",
  "text": "the mood just flipped. one minute friendly, next minute pay up or I send this to everyone you know. Alex feels pure panic. but watch what Alex does next, because this is the plan.",
  "image": "💭",
  "prompt": "Alex is 15 and terrified. Using what we have learned, what should Alex do, step by step, and what is the one thing Alex is wrong to believe?",
  "script": "Model the response through Alex, kept entirely non graphic, no image content shown ever. Alex does not pay, paying only proves it works. Alex sends nothing more and stops replying. Alex keeps the evidence, screenshots the threat and the account. Alex tells a trusted adult tonight, not alone. And Alex uses Report Remove. The one wrong belief is that this is his fault. He did nothing wrong, he was targeted by a criminal, and the fear was the only thing standing between him and the plan.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "diagram",
  "heading": "The five steps, in order",
  "caption": "Steady every time. The fear is the trap, and the plan is what breaks it.",
  "steps": [
   {
    "emoji": "🚫",
    "title": "Do not pay",
    "text": "Paying only tells a criminal it works, so the demands keep coming."
   },
   {
    "emoji": "✋",
    "title": "Send nothing more",
    "text": "Do not comply further, and stop replying."
   },
   {
    "emoji": "📸",
    "title": "Keep the evidence",
    "text": "Screenshot the threat and the account. Do not delete anything."
   },
   {
    "emoji": "🧑",
    "title": "Tell a trusted adult",
    "text": "Tonight, not alone. You are not in trouble and you are not the first."
   },
   {
    "emoji": "🧰",
    "title": "Use Report Remove",
    "text": "The IWF tool that helps get an image of an under 18 taken down."
   }
  ],
  "script": "Walk the five steps in order. The two that get missed are do not pay and keep the evidence before anything is deleted, so say them twice. End on Report Remove and a trusted adult, the help is calm and it works.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "discussion",
  "phase": "practise",
  "minutes": 10,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "In pairs, and through a made up friend, not yourselves. A friend comes to you frightened after something like this. Write the five steps in order, and three true, calm sentences to lower their panic.",
  "lookFor": "The five steps in order, plus three steadying sentences, for example, you are not in trouble, this is not your fault, we will sort this together with a trusted adult. No personal detail, no names, no story, the plan and the reassurance only.",
  "script": "Two minutes on the timer, pairs, framed as steadying a friend, because in a real moment calm is the thing that helps most, and because you may be the person a friend comes to. Circulate, then take one strong card from a few pairs. Hold the ground rule, no personal disclosures in the room."
 },
 {
  "type": "choice",
  "question": "Exit check. A friend has had a private image shared and is sure they will be arrested if they tell anyone. What do you say and do?",
  "options": [
   {
    "text": "You are not in trouble and not alone, the law protects you, so let us tell a trusted adult and use Report Remove together",
    "correct": true,
    "feedback": "Exactly right. The young person is the victim, the law is on their side, and formal action against a young person is used only in exceptional cases. A trusted adult, Report Remove and calm help are the way through."
   },
   {
    "text": "Just delete the app and never tell anyone",
    "correct": false,
    "feedback": "Silence is exactly what makes this worse, and deleting the evidence does not help. Keep the evidence, tell a trusted adult, and use Report Remove. You are not in trouble."
   },
   {
    "text": "It is their own fault, so they should sort it out alone",
    "correct": false,
    "feedback": "Never. The young person here is the victim, not the culprit, and nobody should face this alone. A trusted adult, Childline and Report Remove are all on their side."
   }
  ],
  "script": "Silent, independent answers, this is your evidence for the outcome. A pupil who picks the first option has met it. Anyone leaning toward blame or silence needs the law card again, the back button works.",
  "phase": "prove",
  "minutes": 3
 },
 {
  "type": "recap",
  "heading": "What to hold on to",
  "points": [
   "The fear is the trap, and the truth breaks it: you are the victim, not the culprit.",
   "The law is taught in both halves, and the protective half means help is always open to you.",
   "The plan is steady: do not pay, send nothing more, keep the evidence, tell a trusted adult, use Report Remove.",
   "If this ever happens to you or a friend, you are not in trouble, you have done nothing wrong, and you are not alone."
  ],
  "script": "Return to the anonymous entry split and give the accurate answer: a young person targeted here is a victim, and formal action against a young person is only for exceptional cases. Read the recap, one point each, and land the last line as the whole message of the hour.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "Where to go, always",
  "lines": [
   "If this ever happens to you or a friend, you are not in trouble, you have done nothing wrong, and you are not alone.",
   "Talk to a trusted adult here in school, or Childline any time on 0800 1111.",
   "Report Remove, run by the IWF, helps get an image of an under 18 taken down.",
   "Anything involving an adult can be reported to CEOP, and everyone on the other end of these is calm and on your side."
  ],
  "script": "Let DiGi hold the close and keep the full support list on screen as pupils leave: a trusted adult, Childline 0800 1111, CEOP, and the IWF Report Remove tool. The law protects you, and help works."
 }
]$sm9$::jsonb,
  '[]'::jsonb,
  $sm9${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 1,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 1,
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
}$sm9$::jsonb,
  $sm9${
 "headline": "What we taught today, and one calm thing to say at home",
 "taught": "Today your child learned three things, all calmer than the fear around them. The law on private images of under 18s exists to protect young people, and UK guidance is clear they should not be unnecessarily criminalised. Sextortion is a money scam that targets teenagers, especially boys. And a fake or AI image makes the real person a victim. In every case the young person is the victim, never at fault, and there is a clear plan and calm help.",
 "try_this": "You do not need a heavy sit down, just one clear message delivered calmly. Try, I want you to know something in case you ever need it. If anyone online ever pressures you about a private photo or threatens you, you come straight to me, you will not be in trouble, and we will sort it together. Name the tools together, Childline on 0800 1111 and the IWF Report Remove tool.",
 "family_question": "If you were ever scared about something like this, what would help you come to me first, calmly, instead of facing it alone?",
 "no_login_required": true
}$sm9$::jsonb,
  $sm9${
 "learning_objective": "Pupils can explain calmly why the law here protects young people, in both halves, and lay out the response steps and reassurance if a private image is ever shared or used against someone.",
 "timing": "55 minutes: recall 5, new input 12, worked example 8, hinge 5, guided practice 10, independent practice 10, review and signpost 7",
 "misconceptions": [
  "A young person who sent an image and had it shared is the one in trouble (they are the victim, and UK guidance is clear children should not be unnecessarily criminalised)",
  "Paying a sextortion demand makes it stop (paying only tells a criminal it works, so the demands keep coming)",
  "A fake or AI nude is just a joke (it is a real harm, the person in it is a victim, and it is a safeguarding matter)"
 ],
 "differentiation": {
  "support": "Keep the law card, the five steps and the reassurance sentences visible throughout, and give pairs sentence starters. Allow anonymous written questions.",
  "stretch": "Discuss why teaching the protective half of the law openly is thought to help victims come forward, the UKCIS rationale, so pupils understand the reasoning, not just the rule. Keep every extension non graphic."
 },
 "paper_fallback": "The whole lesson runs from the printed pack with no image content shown at any point. Read the law in both halves, the Alex worked example and the scenarios aloud, and run the hinge and exit checks as read aloud questions. The support routes stay on the board throughout.",
 "keywords": [
  {
   "word": "sextortion",
   "definition": "A money scam where a criminal gets a private image and threatens to share it unless you pay. Organised crime, never the young person's fault."
  },
  {
   "word": "victim",
   "definition": "The person a crime is done to. In every scenario here the young person is the victim, never the culprit."
  },
  {
   "word": "Report Remove",
   "definition": "A tool run by the IWF that helps a young person get a nude image of themselves taken down."
  }
 ],
 "commitment_stem": "My commitment: if this ever happened to me or a friend, the first calm thing I would do is"
}$sm9$::jsonb,
  $sm9${
 "required": true,
 "note": "MOST SENSITIVE MODULE. Brief the DSL before this lesson is delivered, not after. Disclosures are likely, during the lesson, at the door afterwards, or days later, often framed as asking for a friend, so treat any hint as a disclosure and involve the DSL the same day, treating possible sextortion as urgent. Never ask a pupil to show, send, describe, forward, save or delete any image, and do not view or receive one if offered, an adult viewing or receiving it can create a further offence and destroy evidence. Do not investigate on the pupil's device, do not screenshot anything yourself, and do not contact the account. Reassure the pupil in plain words that they are not in trouble and it is not their fault, and do not promise confidentiality. The platform records no disclosures by design, so use the school concern form. Where a case is live, the pathway is DSL, then CEOP and the IWF Report Remove route with the pupil supported and messages preserved as evidence. Normalise a quiet exit route at the start and check on anyone who uses it. Expect historic cases as well as current ones.",
 "concern_form_linked": true
}$sm9$::jsonb
)
on conflict (module_id) do nothing;

-- ===========================================================================
-- Module 10: Rabbit holes and radicalisation
-- ===========================================================================
insert into public.school_lessons
  (module_id, title, key_stage, year_band, audience, efcw_strands, statutory_hooks, ailit_domains,
   evidence_anchor, single_action_outcome, character_cast, sort_order, slides, video_beats, assessment,
   parent_note, teacher_notes, dsl_note)
values (
  'sm13-10-rabbit-holes-and-radicalisation', 'Rabbit holes and radicalisation', 'KS4', 'Years 10 to 11', 'teacher',
  '{5,6}'::int[], ARRAY['RSHE 2026','EfCW']::text[], ARRAY['Engage with AI']::text[],
  'Molly Russell inquest and Ofcom on misinformation and deepfakes',
  'I can spot when a feed is narrowing toward more extreme content, and I can name one way I check a source or curate my way out.',
  'Nova', 110,
  $sm10$[
 {
  "type": "title",
  "eyebrow": "KS4 · Years 10 to 11 · Module 10",
  "title": "Rabbit holes and radicalisation",
  "body": "One hour on the machinery that turns a feed into a recruiter, and the moves that break its grip. Calm and non graphic throughout.",
  "script": "Settle the room and set the register. This lesson touches self harm and suicide content, misogyny and extremism, so we keep it calm and non graphic, no images of harmful content, no method detail, ever. We talk about how the content works, never about ourselves or naming anyone. The support signpost is on screen from the start, not only at the end, and you can come to me at any point.",
  "phase": "starter",
  "minutes": 1
 },
 {
  "type": "objective",
  "outcome": "I can spot when a feed is narrowing toward more extreme content, and I can name one way I check a source or curate my way out.",
  "why": "The same engine that keeps you scrolling also narrows what you see, pushing you toward more extreme versions of whatever held your attention. It is not showing you extreme content because it is true or because most people agree. It is showing it because fear and anger hold attention, and the machine has learned that. Once you can spot the rabbit hole, you can climb out of it.",
  "gains": [
   "Explain what a rabbit hole is and why a feed narrows",
   "Name the shapes it takes, from echo chambers to engineered outrage",
   "Read anger or fear as a signal to slow down and check, not to share",
   "Name one move out: check the source, curate the feed, or tell a trusted adult"
  ],
  "script": "Read the mission and the why. The reframe that protects them: extreme content is engineered to provoke, not agreed to be true, and nobody is weak for being pulled in, the pull is designed. Entry question on the board, how do you think a feed decides to show someone more and more of one kind of thing. Take three answers, return to them at the end.",
  "phase": "starter",
  "minutes": 3
 },
 {
  "type": "keywords",
  "heading": "Words for today",
  "words": [
   {
    "word": "rabbit hole",
    "meaning": "When a feed keeps offering more extreme versions of whatever held you, because stronger reactions hold attention longer."
   },
   {
    "word": "echo chamber",
    "meaning": "When you get shown more of one view until it feels like everyone agrees, when really the feed just narrowed."
   },
   {
    "word": "deepfake",
    "meaning": "Video or audio faked well enough that seeing is no longer believing. Ofcom has flagged this as a growing problem for trust."
   },
   {
    "word": "curate",
    "meaning": "To shape your own feed on purpose, following things that pull it back toward calm and true. A feed is a garden, not a fixed thing."
   }
  ],
  "script": "Say each word calmly. The one to keep is curate: the lesson ends on the fact that you are not stuck with the feed you have, you hold the trowel.",
  "phase": "starter",
  "minutes": 2
 },
 {
  "type": "concept",
  "emoji": "🌀",
  "heading": "The feed narrows",
  "body": "One idea first. In an earlier lesson we agreed the feed shows you what keeps you watching, not what is true. Now follow that thread. If the thing that keeps you watching is something that scares or angers you, the feed serves more of it, because stronger reactions hold attention longer. That is a rabbit hole. It is not an accident of the machine, it is the machine working exactly as built.",
  "script": "Land the mechanism before any content. The feed narrows toward whatever provokes the strongest reaction, and nothing provokes a stronger reaction than fear and anger. Not because it is true, because it works. Hold that steady, it is the whole lesson.",
  "phase": "teach",
  "minutes": 3
 },
 {
  "type": "diagram",
  "heading": "The shapes it takes",
  "caption": "None of this is an accident. It is the machine working as built, so seeing it is the skill.",
  "steps": [
   {
    "emoji": "🔁",
    "title": "Echo chamber",
    "text": "More of one view until it feels like everyone agrees, when the feed just narrowed."
   },
   {
    "emoji": "📰",
    "title": "Misinformation",
    "text": "False claims spread faster than corrections because they are built to be shared."
   },
   {
    "emoji": "🎭",
    "title": "Deepfakes",
    "text": "Video and audio faked well enough that seeing is no longer believing."
   },
   {
    "emoji": "⚠️",
    "title": "Recommended harm",
    "text": "Content the algorithm can serve, including self harm and suicide content nobody went looking for."
   },
   {
    "emoji": "😠",
    "title": "Misogyny and extremism",
    "text": "So called manfluencers push fear, anger and myths, and the algorithm amplifies it, especially to boys."
   }
  ],
  "script": "Reveal the five one at a time, icons only, no harmful imagery. On recommended harm, name why this is on the curriculum, calmly: at the inquest into the death of Molly Russell, the coroner concluded that harmful content she had not searched for, content the algorithm served her, contributed to her death. Say it once, steady, then move on.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "choice",
  "question": "Hinge question. A feed keeps showing someone more and more extreme videos on a topic they only paused on once. What is the best reading of why?",
  "options": [
   {
    "text": "The algorithm narrowed toward what provoked the strongest reaction",
    "correct": true,
    "feedback": "Exactly. One pause was read as interest, and the engine narrowed the world to the thing that provoked the strongest reaction. Not agreed, not important, just engineered to hold attention."
   },
   {
    "text": "The topic is genuinely the most important thing happening",
    "correct": false,
    "feedback": "The feed does not measure importance, it measures attention. It narrowed toward what provoked the strongest reaction, which is a very different thing from what matters."
   },
   {
    "text": "Most people agree with the videos",
    "correct": false,
    "feedback": "It feels that way, but that is the echo chamber. Your feed narrowed, it did not take a vote. The best reading is that the algorithm chased the strongest reaction."
   }
  ],
  "script": "Whole class check, hold up your answer. If most say the first option, move on. If not, look again, because that reading is the whole lesson. The feed narrows toward the strongest reaction.",
  "phase": "teach",
  "minutes": 5
 },
 {
  "type": "scenario",
  "label": "Worked example, invented, no real person",
  "platform": "feed",
  "handle": "the feed",
  "avatar": "📱",
  "meta": "one week later · recommended for you",
  "text": "Sam, sixteen, watched one gym video, then one that was half fitness and half a man saying girls have it easy and Sam is being lied to. Sam paused, just curious. By the weekend the feed is mostly that, angrier each time, and it feels like the truth because it is everywhere Sam looks.",
  "image": "🌀",
  "prompt": "Sam never went looking for this. Using the mechanism, explain what happened, then name three moves Sam can make to climb out.",
  "script": "Model the thread through Sam, kept at arm's length, no real accounts, no harmful content. Sam did not go looking, one pause and the engine narrowed the world to the thing that provoked the strongest reaction. Now the climb out. Sam names it, this is a rabbit hole, this is engineered to make me angry. He checks who is actually saying it and why. He follows a couple of accounts that push the feed the other way. And he talks to someone he trusts. Seeing it, and curating against it, is the skill.",
  "phase": "teach",
  "minutes": 4
 },
 {
  "type": "concept",
  "emoji": "🪜",
  "heading": "The climb out",
  "body": "The trap sounds like this. Everyone knows this. They do not want you to see this. You are the only one being honest. That pull, that heat in your chest, that is the tell. Here is the move. When something makes you angry or scared enough to share it right now, that is the exact moment to stop and check who is really saying this and why. Name it out loud, this is a rabbit hole, and it loses its grip. And you are not stuck with the feed you have, you can curate it back toward calm and true.",
  "script": "This is the calibration slide. The anger or fear the content stirs is a signal to slow down and check, not to share. Naming the rabbit hole out loud is the first move, curating is the second, and telling a trusted adult is always a complete answer for the dark end.",
  "phase": "teach",
  "minutes": 2
 },
 {
  "type": "discussion",
  "phase": "practise",
  "minutes": 10,
  "mode": "pairs",
  "seconds": 120,
  "prompt": "In pairs, and through characters at arm's length. One, a viral clip that turns out to be a deepfake, how would you check it before sharing? Two, an account insisting everyone agrees, how do you test whether that is real or a narrowed feed? Three, a friend whose feed has turned angry and bleak, what do you notice and do?",
  "lookFor": "For each, the mechanism named, plus one move: check the source, curate the feed, or reach a trusted adult. For the friend, tell a trusted adult is always a complete answer. Analysis only, no describing specific harmful content or accounts.",
  "script": "Two minutes on the timer, pairs, all through characters, the distancing technique. Circulate, then take one strong answer per card. Keep the friend scenario pointed at help, and hold the ground rule, no personal disclosures, no detail about specific content."
 },
 {
  "type": "tryit",
  "heading": "How I would spot it",
  "body": "On your own, and this stays yours. Pick one of the five shapes, echo chamber, misinformation, deepfakes, recommended harm, or misogyny content, and write down the two or three signs you would look for, and the one thing you would do first. This is analysis, not a personal disclosure, so no accounts and no detail about specific content. If while you write this anything comes to mind about yourself or a friend, that is exactly what the support signpost is for, and it is on the board now.",
  "script": "Ten minutes, independent, the skill transferred. Keep the support line visible while they write. Circulate and grab one strong plan to read out. This is your evidence of the mechanism being understood, never any personal disclosure.",
  "phase": "practise",
  "minutes": 10
 },
 {
  "type": "choice",
  "question": "Exit check. A post makes you so angry you want to share it right now. What is the skilled move?",
  "options": [
   {
    "text": "Treat the anger as a signal to slow down and check who is really saying this and why",
    "correct": true,
    "feedback": "Exactly. Extreme content is engineered to provoke, so the heat it stirs is your cue to pause and check the source, not to share. Naming the rabbit hole is how you take back the wheel."
   },
   {
    "text": "Share it straight away while people are paying attention",
    "correct": false,
    "feedback": "That is the machine working as designed. The urge to share out of anger is the exact moment to stop and check. Misinformation spreads fast precisely because it is built to be shared."
   },
   {
    "text": "Assume it must be true because it made you feel so strongly",
    "correct": false,
    "feedback": "Strong feeling is not evidence, it is what the feed optimises for. The move is to slow down, check who is saying it and why, and curate your way out."
   }
  ],
  "script": "Silent, independent answers, this is your evidence for the outcome. A pupil who picks the first option has met it. Anyone else needs the climb out slide again, the back button works.",
  "phase": "prove",
  "minutes": 3
 },
 {
  "type": "recap",
  "heading": "What to hold on to",
  "points": [
   "The feed narrows toward whatever provokes the strongest reaction, not what is true or agreed.",
   "Extreme content is engineered to provoke, so the anger it stirs is a cue to slow down and check.",
   "You can curate: a feed is a garden, not a fixed thing, and you hold the trowel.",
   "You never have to sit with the dark stuff alone, there is always a trusted adult."
  ],
  "script": "Return to the entry answers on how a feed narrows and ask which one holds up now. Read the recap, one point each. Keep the support signpost on screen as you close, it stays visible for a sensitive topic.",
  "phase": "close",
  "minutes": 2
 },
 {
  "type": "digi",
  "heading": "Where to go, always",
  "lines": [
   "I can see the rabbit hole, and I can curate my way out.",
   "You never have to carry the dark stuff on your own.",
   "If anything you see is about self harm or suicide, or is frightening you, talk to a trusted adult here, or Childline any time on 0800 1111.",
   "Anything where contact from someone feels wrong can be reported to CEOP, and the people there are calm and on your side."
  ],
  "script": "Let DiGi hold the close and keep the support signpost on screen: a trusted adult, Childline 0800 1111, and CEOP. Next lesson we look at the inner life, how all this lands on your mood, and how to run your own honest check."
 }
]$sm10$::jsonb,
  '[]'::jsonb,
  $sm10${
 "retrieval_starter": {
  "questions": 1,
  "auto_marked": true
 },
 "in_lesson_checks": {
  "count": 1,
  "auto_marked": true
 },
 "exit_quiz": {
  "questions": 1,
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
}$sm10$::jsonb,
  $sm10${
 "headline": "What we taught today, and one calm thing to say at home",
 "taught": "Today your child learned what a rabbit hole is: a feed that keeps serving more extreme versions of whatever held their attention, because stronger reactions hold attention longer. They learned the shapes it takes, from echo chambers and misinformation to deepfakes and engineered outrage, and the protective skill, spotting the narrowing and curating out of it. It is a design problem in the feed, not a failing in your child.",
 "try_this": "Watch something together and get curious about the machine, not the content. Why do you think it showed you that? What would it show you if you paused on it? Agree a simple family line, that a post making you want to share it out of anger is the exact moment to slow down and check. And keep the door wide open: if they ever see content about self harm or suicide, or something frightening, you want to hear it, and you will not overreact or take the phone away.",
 "family_question": "What is one thing that would help you always feel able to bring the dark or frightening stuff to me, knowing I will stay calm?",
 "no_login_required": true
}$sm10$::jsonb,
  $sm10${
 "learning_objective": "Pupils can spot when a feed is narrowing toward more extreme content and name one move out, understanding the extreme content as engineered to provoke rather than true.",
 "timing": "55 minutes: recall 5, new input 10, worked example 8, hinge 5, guided practice 10, independent practice 10, review and signpost 7",
 "misconceptions": [
  "Extreme content shows up because it is true or because most people agree (it shows up because fear and anger hold attention, and the feed narrows toward the strongest reaction)",
  "A person is weak for being pulled into a rabbit hole (nobody is weak, the pull is designed, one pause can be enough)",
  "You are stuck with the feed you have (you can curate it, following things that pull it back toward calm and true)"
 ],
 "differentiation": {
  "support": "Keep the five shape cards visible and give pairs sentence starters. The friend scenario always offers tell a trusted adult as a complete answer.",
  "stretch": "Ask why the same amplification that spreads a rabbit hole can also spread a correction, so the lesson stays about seeing the machine rather than fearing the internet. Keep every extension non graphic."
 },
 "paper_fallback": "The whole lesson runs from the printed pack with no harmful imagery, no method detail and no specific accounts. Draw the narrowing feed and the five shapes on the board, read the Sam worked example aloud, and run the hinge and exit checks as read aloud questions. Keep the support signpost on the board throughout, not only at the end.",
 "keywords": [
  {
   "word": "rabbit hole",
   "definition": "When a feed keeps offering more extreme versions of whatever held you, because stronger reactions hold attention longer."
  },
  {
   "word": "echo chamber",
   "definition": "When you get shown more of one view until it feels like everyone agrees, when really the feed just narrowed."
  },
  {
   "word": "curate",
   "definition": "To shape your own feed on purpose, following things that pull it back toward calm and true."
  }
 ],
 "commitment_stem": "My commitment: next time a post makes me want to share it out of anger, I will"
}$sm10$::jsonb,
  $sm10${
 "required": true,
 "note": "SENSITIVE MODULE, and it sits inside the Prevent duty as well as safeguarding. Touches self harm, suicide content, misogyny and extremism. Plan with the DSL before teaching and flag the class in advance. Teach it calm and non graphic, no images of harmful content and no method detail ever, and keep the support signpost visible throughout, not only at the end. If a pupil discloses viewing self harm or suicide content, contact from an extreme group, or their own distress, respond calmly, do not explore the detail, follow the school safeguarding procedure the same day and route to the designated safeguarding lead, and consider the Prevent duty where extremism is disclosed. Do not investigate on a pupil's device and do not promise secrecy. Use the school concern form, the platform records no disclosures by design. Pass on low level concerns too, including any pupil who seems unusually affected or goes quiet.",
 "concern_form_linked": true
}$sm10$::jsonb
)
on conflict (module_id) do nothing;
