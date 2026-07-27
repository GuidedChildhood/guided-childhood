-- Migration 105: social media 13plus, PARENT co view guides, modules 7 to 11
-- Seeds the PARENT (Version C) rows for five 13plus curriculum modules into
-- public.lessons, following the tested parent lesson pattern (013 fields, 017
-- slides column, 018 status column). Content in the database, never hardcoded
-- (non negotiable 6). British English, no dashes in any copy.
--
-- Modules 8, 9 and 10 are sensitive safeguarding topics. Their parent copy is
-- calm and non graphic, keeps the young person blameless throughout, and every
-- DiGi close signposts a trusted adult and Childline on 0800 1111. Module 9 also
-- names the IWF Report Remove tool and CEOP.
--
-- Idempotent: each insert is guarded by where not exists on the title, so the
-- migration is safe to run more than once. No DO blocks. Text fields are single
-- quoted with doubled apostrophes; each slides deck uses a unique dollar quote
-- tag so its JSON reads naturally.

-- ── Module 7: How people treat each other (sort_order 1070) ──────────────────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'How people treat each other',
  'Being treated badly online is not the same as a playground fallout, because it follows your child home. It arrives in the bedroom, on the phone in their hand, with no natural point where it stops, which is why it can weigh so heavily. It takes several shapes, a pile on where a group turns on one person, cruel messages, fake accounts and rumours, being deliberately cut out of a chat or a game, public shaming, and private screenshots leaked and passed around. The Anti Bullying Alliance and Internet Matters find it can cause real, lasting harm, that exclusion strikes at belonging, and that girls are more often targeted.',
  'When you understand that it follows them home, two things change. You take it seriously rather than telling them to just log off, which keeps them coming to you. And you can teach the response that actually helps, a calm sequence of keep evidence, block, report and tell someone, so your child feels equipped rather than trapped. Children who believe telling an adult will only make it worse tend to stay silent, so the most protective thing you can offer is to be the calm adult who helps them use the tools, not the one who takes the phone away.',
  'Pick a quiet moment, not a crisis, and ask what they would do if someone was being got at in a group chat. Let them think it through, then add the four moves together, keep evidence, block, report, tell someone. Walk through where the block and report buttons live in their main app so it is not new when they need it. Agree that if anything happens, to them or a friend, the deal is they tell you and you help, you do not confiscate. Name the outside help too, so they know it exists, Childline on 0800 1111 and the school''s anti bullying route.',
  'Online unkindness follows a child home, so the answer is tools and support, not silence and not blame. Your job is to be the calm adult who helps them keep evidence, block, report and tell, so they never carry it alone.',
  'How do I help my teenager when someone is being cruel to them in a group chat?',
  1070, 'live',
  $s7$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 13 to 15",
      "title": "How people treat each other",
      "body": "A short co view guide. What online unkindness really is, and the calm four move response you can teach tonight."
    },
    {
      "type": "objective",
      "outcome": "I can name the shapes online unkindness takes, and the tools that answer it.",
      "why": "Being got at online is not a playground fallout, it follows a child home into the bedroom, onto the phone in their hand, with no natural point where it stops. That is why it can weigh so heavily, and why a calm response matters.",
      "gains": [
        "Name the shapes it takes, from a pile on to a leaked screenshot",
        "Teach the four move response, keep evidence, block, report, tell someone",
        "Be the calm adult a child will actually come to",
        "Know the outside help, so your child knows it exists"
      ]
    },
    {
      "type": "concept",
      "emoji": "🏠",
      "heading": "It follows them home",
      "body": "A fallout at school used to stay at school. Online it comes with them, into their room, onto the phone in their hand, and there is no bell that ends it. It takes several shapes, a pile on where a group turns on one person, cruel messages, fake accounts and rumours, being cut out of a chat or a game on purpose, public shaming, and private screenshots passed around. The Anti Bullying Alliance and Internet Matters find it can cause real, lasting harm, that exclusion strikes at belonging, and that girls are more often targeted."
    },
    {
      "type": "choice",
      "question": "Your child says a friend is being piled on in a group chat and it is getting worse. What is the strongest first thing to help them do?",
      "options": [
        { "text": "Tell them to just log off and ignore it", "correct": false, "feedback": "Logging off does not stop it following them home, and it quietly teaches them not to bring these things to you. The calm tools are what help." },
        { "text": "Keep evidence, then block, report and tell a trusted adult", "correct": true, "feedback": "Yes. A calm sequence, keep evidence, block, report, tell someone, means they feel equipped rather than trapped, and never handling it alone." },
        { "text": "Take the phone away so it cannot reach them", "correct": false, "feedback": "Confiscation reads as punishment and it makes a child hide the next thing. Being the calm adult who helps them use the tools is what protects them." }
      ]
    },
    {
      "type": "concept",
      "emoji": "🧰",
      "heading": "Tools and support, not silence or blame",
      "body": "Children who believe telling an adult will only make it worse tend to stay silent. So the most protective thing you can offer is to be the calm adult who helps them keep evidence, block, report and tell, not the one who takes the phone. Walk through where the block and report buttons live in their main app now, so it is not new when they need it, and agree the deal, they tell you and you help, you do not confiscate."
    },
    {
      "type": "digi",
      "heading": "How DiGi holds it",
      "lines": [
        "When a child says someone is being cruel to them or a friend online, DiGi stays calm and never brushes it off.",
        "It names that this is not their fault and not theirs to carry alone.",
        "It walks them through keep evidence, block and report, one calm step at a time.",
        "And it points them firmly to a trusted adult, and to Childline on 0800 1111."
      ]
    }
  ]$s7$::jsonb
where not exists (select 1 from public.lessons where title = 'How people treat each other');

-- ── Module 8: Strangers, DMs and grooming (sort_order 1080, sensitive) ───────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'Strangers, DMs and grooming',
  'A small number of adults use private messaging to build trust with a young person and pull the chat somewhere hidden. It is not about a scary stranger in a hoodie, it is a pattern, over the top flattery, gifts, secrecy, moving to another app, requests that slowly grow, and guilt if the child pulls back. Most contact your child has online is completely fine. The point is that they know the pattern and know they can always come to you.',
  'The single thing that keeps a child safe here is that they will tell you if something feels off. Grooming works by making a child feel they cannot tell anyone, so anything that makes home feel safe to talk in is real protection. The NSPCC is clear that private messaging is where this happens, because it is hidden. A child who knows they will not be blamed or have their phone taken is a child who talks. A child who fears the reaction stays quiet, which is exactly what an abuser relies on.',
  'Keep it calm and keep it about the pattern, not about frightening them. Ask what they would make of an online only friend who started saying keep this between us. Let them reason it out. Agree together that no adult ever has a good reason to ask a young person to keep a secret from their parents, and that a request to move onto a different, quieter app is worth a pause. Most of all, say the sentence that matters, if anything online ever feels wrong you can tell me, you will never be in trouble, and I will never just take your phone away. Then mean it, because the first time you react with calm, you have earned every conversation after it.',
  'It is the pattern that tells you, not one nice message, and a child is never at fault for what an adult does. Your job is not to scare them off strangers, it is to be the calm place they come to the moment something feels off.',
  'What do I say if my child tells me an online chat has started to feel strange?',
  1080, 'live',
  $s8$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 13 to 15 · Sensitive topic, calm tone",
      "title": "Strangers, DMs and grooming",
      "body": "A short co view guide. Most contact online is fine. This is the pattern to know, and how to stay the calm place your child comes to."
    },
    {
      "type": "objective",
      "outcome": "I can name the pattern of an online chat going wrong, and keep home a safe place to talk.",
      "why": "A small number of adults use private messaging to build trust with a young person and pull the chat somewhere hidden. It is not a scary stranger in a hoodie, it is a pattern, and the thing that keeps a child safe is knowing they can always come to you.",
      "gains": [
        "Recognise the pattern, flattery, gifts, secrecy, moving app, growing requests, guilt",
        "Keep calm so home stays safe to talk in",
        "Say the one sentence that matters, and mean it",
        "Know the help, a trusted adult, Childline and CEOP"
      ]
    },
    {
      "type": "concept",
      "emoji": "🧩",
      "heading": "The pattern, not the person",
      "body": "You cannot always spot the person, so you learn the pattern. Over the top flattery, you are so mature. Gifts or offers, something for nothing. Secrecy, keep this between us. Moving the chat onto a quieter app. Requests that slowly grow. And guilt if your child pulls back. Most contact your child has online is completely fine. The point is that they know the pattern, and know they can always come to you. A child is never at fault for what an adult does."
    },
    {
      "type": "choice",
      "question": "Your child mentions an online friend has asked them to delete their messages and carry on chatting on a different app, just the two of them. What is the calm read?",
      "options": [
        { "text": "It is normal, friends move between apps all the time", "correct": false, "feedback": "Moving to a quieter app and asking to keep it secret are two signals together. It is worth a calm pause, not a panic." },
        { "text": "Two signals together, secrecy and moving the chat, worth a calm pause", "correct": true, "feedback": "Yes. No adult has a good reason to ask a young person to keep a secret from their parents. Name it calmly and stay their safe place." },
        { "text": "Time to take the phone and ban the app", "correct": false, "feedback": "A big reaction teaches a child to hide the next thing, which is exactly what an abuser relies on. Calm keeps the door open." }
      ]
    },
    {
      "type": "concept",
      "emoji": "🛟",
      "heading": "Say the sentence, and mean it",
      "body": "Grooming works by making a child feel they cannot tell anyone. So anything that makes home feel safe to talk in is real protection. Say it plainly, if anything online ever feels wrong you can tell me, you will never be in trouble, and I will never just take your phone away. Then mean it, because the first time you react with calm, you have earned every conversation after it. If a chat ever felt wrong, your child has done nothing wrong, and telling a trusted adult is always the right move."
    },
    {
      "type": "digi",
      "heading": "How DiGi holds it",
      "lines": [
        "When a child says a chat has started to feel strange, or someone wants to move app and keep it secret, DiGi does not judge or lecture.",
        "It names the pattern calmly and reassures the child they have done nothing wrong.",
        "It walks them to one clear step and to a trusted adult.",
        "And where it fits, it names Childline on 0800 1111, or reporting to CEOP."
      ]
    }
  ]$s8$::jsonb
where not exists (select 1 from public.lessons where title = 'Strangers, DMs and grooming');

-- ── Module 9: Nudes, the law and sextortion (sort_order 1090, sensitive) ─────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'Nudes, the law and sextortion',
  'There are three things a teenager needs to understand here, and all three are calmer than the fear around them. The law on private images of under 18s exists to protect young people, and UK guidance is clear they should not be unnecessarily criminalised. Sextortion is a money scam, a fast, flirty contact asks for an image then threatens to share it unless the young person pays, and teenage boys are heavily targeted. And AI can now fake a nude from an ordinary photo, which is a real harm to the real person in it. In every case, the young person is the victim, never the one at fault.',
  'The thing that hurts children here is not the image, it is the fear and the silence. A young person caught in a sextortion scam is often terrified they are in trouble and will lose everything, so they pay, and comply, and say nothing, which is exactly what the criminal wants. The single most protective thing you can do is make sure your child already knows, before anything ever happens, that they will not be in trouble with you and that you will help calmly. That knowledge is what turns a frightening night into a phone call to a parent instead of a spiral alone.',
  'You do not need a heavy conversation, you need one clear message delivered calmly. Tell them that if anyone online ever pressures them about a private photo, or threatens them, they come straight to you, they will not be in trouble, and you will sort it together. If it helps, explain the scam plainly, that it is organised crime, that they move fast and target lots of people, and that the answer is never to pay and never to face it alone. Name the tools together, Childline on 0800 1111 and the IWF Report Remove tool for getting an image taken down. The goal is simple, that your child hears from you, first, that you are their safe place, so that fear never wins.',
  'In every version of this, your child is the victim, not the culprit, and the law is on their side. Your job is to lower the fear before it ever arrives, so that if the worst happens, your child comes to you calmly and quickly, and nobody faces it alone.',
  'How do I tell my teenager they can come to me if someone ever threatens to share a private photo?',
  1090, 'live',
  $s9$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 14 to 16 · Sensitive topic, calm tone",
      "title": "Nudes, the law and sextortion",
      "body": "A short co view guide, calm the whole way through. The law is on your child's side, and the most protective thing is lowering the fear before it ever arrives."
    },
    {
      "type": "objective",
      "outcome": "I can explain, calmly, why the law protects my child, and the steady steps if a private image is ever used against them.",
      "why": "What hurts children here is not the image, it is the fear and the silence. A young person is the victim, never the one at fault, and knowing that is what lets them ask for help instead of hiding.",
      "gains": [
        "Understand the law is built to protect young people, not catch them out",
        "Spot sextortion for the money scam it is",
        "Know the steady steps, do not pay, do not comply further, keep evidence, get a trusted adult",
        "Name the help, Childline, the IWF Report Remove tool and CEOP"
      ]
    },
    {
      "type": "concept",
      "emoji": "🛡️",
      "heading": "Three things, all calmer than the fear",
      "body": "The law on private images of under 18s exists to protect young people, and UK guidance is clear they should not be unnecessarily criminalised. Sextortion is a money scam, a fast, flirty contact asks for an image then threatens to share it unless the young person pays, and teenage boys are heavily targeted. And AI can now fake a nude from an ordinary photo, which is a real harm to the real person in it. In every case, your child is the victim, never the one at fault."
    },
    {
      "type": "choice",
      "question": "A teenager is targeted by a sextortion scam and is terrified they are the one in trouble. What is true?",
      "options": [
        { "text": "They are the criminal here", "correct": false, "feedback": "No. A young person targeted this way is the victim, and the law is designed to protect them. That fear is exactly what the scam relies on." },
        { "text": "They are the victim, the law is on their side, and telling a trusted adult is the right move", "correct": true, "feedback": "Yes. The fear is the trap and the truth breaks it. Do not pay, do not comply further, keep evidence, and get a trusted adult." },
        { "text": "Paying quietly will make it stop", "correct": false, "feedback": "Paying only tells a criminal it works, so the demands keep coming. The answer is never to pay and never to face it alone." }
      ]
    },
    {
      "type": "concept",
      "emoji": "💬",
      "heading": "Lower the fear before it arrives",
      "body": "The single most protective thing you can do is make sure your child already knows, before anything ever happens, that they will not be in trouble with you and that you will help calmly. Tell them plainly that if anyone online ever pressures them about a private photo, or threatens them, they come straight to you, they will not be in trouble, and you will sort it together. That knowledge turns a frightening night into a phone call to a parent instead of a spiral alone."
    },
    {
      "type": "digi",
      "heading": "How DiGi holds it",
      "lines": [
        "When a child raises private images, a threat to share one, or a fake image of someone they know, DiGi stays calm and never judges.",
        "It says plainly that the child is not in trouble and not alone.",
        "It names the steady steps, do not pay, do not comply further, keep evidence, and get a trusted adult.",
        "And it points to Childline on 0800 1111, the IWF Report Remove tool, and reporting to CEOP where an adult is involved."
      ]
    }
  ]$s9$::jsonb
where not exists (select 1 from public.lessons where title = 'Nudes, the law and sextortion');

-- ── Module 10: Rabbit holes and radicalisation (sort_order 1100, sensitive) ──
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'Rabbit holes and radicalisation',
  'A rabbit hole is what happens when a feed keeps serving more extreme versions of whatever held your child''s attention, because stronger reactions hold attention longer. One pause on an angry video can be enough, and soon the feed is narrowed and heated, and it feels like the truth because it is everywhere they look. This is how misinformation, deepfakes, self harm content and the manosphere reach children who never went looking for any of it. At the inquest into the death of Molly Russell, the coroner concluded that harmful content she had not searched for contributed to her death. That is the risk, held calmly, and it is a design problem, not a failing in your child.',
  'When you understand that the extreme content is engineered to provoke, two things change. You stop reading your child''s anger or fear as their new personality and start reading it as something the feed may be feeding, which keeps you on the same side. And you can teach the actual protective skill, spotting the rabbit hole and curating out of it, which lasts far longer than trying to police every video. The evidence is that seeing the mechanism, not fearing the internet, is what builds durable judgement, and that scare tactics tend to backfire at this age.',
  'Watch something together without judgement and get curious about the machine, not the content. Ask why they think it showed them that, and what it would show them if they paused on it. If a strong claim comes up, check it side by side as a team, who is really saying this and why, and look at whether a striking clip might be a deepfake before anyone shares it. Agree a simple family line, that a post making you want to share it out of anger is the exact moment to slow down and check. And keep the door wide open on the hard end. Tell them plainly that if they ever see content about self harm or suicide, or something frightening, you want to hear it, you will not overreact or take the phone away, and you will help.',
  'The extreme content your child meets online is engineered to provoke, not agreed to be true. Your job is not to police every video, it is to help them spot the rabbit hole, curate their way out, and know they can always bring the dark stuff to you.',
  'What do I do if my teenager''s feed has turned angry and bleak?',
  1100, 'live',
  $s10$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 14 to 16 · Sensitive topic, calm tone",
      "title": "Rabbit holes and radicalisation",
      "body": "A short co view guide. How a feed narrows toward the extreme, and how to help your child spot it and climb out."
    },
    {
      "type": "objective",
      "outcome": "I can spot when a feed is narrowing toward extreme content, and help my child curate a way out.",
      "why": "A rabbit hole is what happens when a feed keeps serving more extreme versions of whatever held attention, because stronger reactions hold attention longer. It is a design problem, not a failing in your child.",
      "gains": [
        "See how one pause can narrow a whole feed",
        "Read anger or fear as something the feed may be feeding",
        "Teach the skill, spot the rabbit hole and curate out",
        "Keep the door open on self harm and frightening content"
      ]
    },
    {
      "type": "concept",
      "emoji": "🕳️",
      "heading": "The feed narrows toward the extreme",
      "body": "One pause on an angry video can be enough. Soon the feed is narrowed and heated, and it feels like the truth because it is everywhere they look. This is how misinformation, deepfakes, self harm content and the manosphere reach children who never went looking for any of it. At the inquest into the death of Molly Russell, the coroner concluded that harmful content she had not searched for contributed to her death. That is the risk, held calmly. Nobody is weak for being pulled in, the pull is designed."
    },
    {
      "type": "choice",
      "question": "Your teenager's feed keeps showing more and more extreme videos on a topic they only paused on once. What is the best read of why?",
      "options": [
        { "text": "The topic is genuinely the most important thing happening", "correct": false, "feedback": "Not quite. The feed narrowed toward what provoked the strongest reaction, not toward what matters most." },
        { "text": "The feed narrowed toward whatever provoked the strongest reaction", "correct": true, "feedback": "Yes. It is engineered to provoke, not agreed to be true. Seeing the mechanism is the protective skill." },
        { "text": "They must have secretly searched for it", "correct": false, "feedback": "One pause is enough. Reading their anger as the feed feeding it, rather than their new personality, keeps you on the same side." }
      ]
    },
    {
      "type": "concept",
      "emoji": "🌱",
      "heading": "Curate out, keep the door open",
      "body": "Start reading a shift in mood as something the feed may be feeding, rather than your child's new personality, which keeps you on the same side. Agree a simple family line, that a post making you want to share it out of anger is the exact moment to slow down and check. And keep the door wide open on the hard end. Tell them plainly that if they ever see content about self harm or suicide, or something frightening, you want to hear it, you will not overreact or take the phone away, and you will help."
    },
    {
      "type": "digi",
      "heading": "How DiGi holds it",
      "lines": [
        "When a child describes a feed that has turned angry, frightening or bleak, DiGi does not judge or lecture.",
        "It names the mechanism calmly and asks what the content is trying to make them feel.",
        "It hands them one small move, check the source or curate the feed.",
        "And if a child raises self harm or something frightening, DiGi stays calm and routes them straight to a trusted adult and Childline on 0800 1111."
      ]
    }
  ]$s10$::jsonb
where not exists (select 1 from public.lessons where title = 'Rabbit holes and radicalisation');

-- ── Module 11: The inner life (sort_order 1110) ─────────────────────────────
insert into public.lessons
  (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select
  'shaper', 'parent', 'social media', 'The inner life',
  'Social media can shift how your child feels without either of you clocking it. A session can leave them flat, wound up or low, and the app never flags it, because it counts minutes, not mood. Three habits do the damage quietly, doomscrolling on bad news, treating likes as a score for their worth, and comparing their real self to everyone else''s edited highlight reel. The fix is small and teachable, an honest check on how a session actually leaves them.',
  'When your child can name how the feed lands on their mood, they stop being carried by it. The research is encouraging here, cutting back on heavy use tends to lift wellbeing (APA 2023), and doomscrolling is linked to more anxiety and stress (Sharma and colleagues, 2022), so a simple honest check is not fussing, it is protective. And because it is a habit they run themselves, it lasts far longer than a limit you impose. This is steering, not banning. Moderate use is genuinely fine.',
  'Model the check yourself first, out loud, no lecture, along the lines of I felt okay before that, a bit meh after, funny how that happens. Then ask, gently, whether they ever notice how an app left them when they come off it. Not as a trap, as a shared curiosity. Watch one real moment together, a bad news spiral or a post that did not get the likes they hoped, and name it as a team, that is doomscrolling, that is the like count getting into your head. Agree one small thing together, a mood check when they close an app, muting a few accounts that leave them flat, or a rule that likes never get to run the day. A habit they help write is a habit they keep.',
  'The feed can move your child''s mood without telling them, and the honest check puts them back in charge of it. Your job is not to police the feeling, it is to help them notice it, so they can steer.',
  'How do I get my teenager to notice how an app leaves them feeling?',
  1110, 'live',
  $s11$[
    {
      "type": "title",
      "eyebrow": "Shaper · Ages 13 to 15",
      "title": "The inner life",
      "body": "A short co view guide. The feed can move your child's mood without telling them. The honest check puts them back in charge."
    },
    {
      "type": "objective",
      "outcome": "I can help my child run an honest check on how a session leaves them, and name one habit that protects their mood.",
      "why": "Social media can shift how your child feels without either of you clocking it, because it counts minutes, not mood. The honest check is small, teachable, and it lasts because they run it themselves.",
      "gains": [
        "Name the quiet habits, doomscrolling, likes as worth, the highlight gap",
        "Model and teach the honest before and after check",
        "Steer rather than ban, moderate use is genuinely fine",
        "Know when a low mood is worth saying out loud"
      ]
    },
    {
      "type": "concept",
      "emoji": "🌙",
      "heading": "It counts minutes, not mood",
      "body": "A session can leave your child flat, wound up or low, and the app never flags it. Three habits do the damage quietly, doomscrolling on bad news, treating likes as a score for their worth, and comparing their real self to everyone else's edited highlight reel. The research is encouraging, cutting back on heavy use tends to lift wellbeing, and doomscrolling is linked to more anxiety and stress, so a simple honest check is not fussing, it is protective."
    },
    {
      "type": "choice",
      "question": "Your child keeps scrolling upsetting news they can do nothing about, feeling worse with every post but unable to stop. What is that, and what helps?",
      "options": [
        { "text": "Nothing to note, they will get bored eventually", "correct": false, "feedback": "That is doomscrolling, and it is linked to more anxiety and stress. Naming it out loud together is what breaks the spell." },
        { "text": "Doomscrolling, and naming it together with an honest mood check helps", "correct": true, "feedback": "Yes. Watch one real moment together and name it as a team, then agree one small habit they help write." },
        { "text": "A reason to ban the app for good", "correct": false, "feedback": "This is steering, not banning. Moderate use is genuinely fine, and easing off heavy use tends to lift mood, not wreck it." }
      ]
    },
    {
      "type": "concept",
      "emoji": "🧭",
      "heading": "Model it, then steer together",
      "body": "Model the check yourself first, out loud, no lecture, I felt okay before that, a bit meh after, funny how that happens. Then ask gently whether they ever notice how an app leaves them. Agree one small thing together, a mood check when they close an app, muting a few accounts that leave them flat, or a rule that likes never get to run the day. A habit they help write is a habit they keep. And if the honest check keeps coming back low, that is worth saying to someone."
    },
    {
      "type": "digi",
      "heading": "How DiGi holds it",
      "lines": [
        "When a child says an app leaves them flat, low or wound up, DiGi does not judge or lecture.",
        "It walks them through the honest check, before and after, and asks what the app was doing in that session.",
        "It hands them one small move and a trusted adult to try it with.",
        "And if the mood keeps coming back low, DiGi calmly names Childline on 0800 1111 and a trusted adult as the next step."
      ]
    }
  ]$s11$::jsonb
where not exists (select 1 from public.lessons where title = 'The inner life');
