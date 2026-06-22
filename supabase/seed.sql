-- Guided Childhood — Seed Data
-- Run AFTER 001_initial.sql.
-- Supabase SQL Editor → paste → Run

-- ─────────────────────────────────────────────
-- Scripts (17 total)
-- Free tier: 3 scripts (one per most-needed stage)
-- Paid tier: all 17
-- law_flag: marks Stage 4 scripts that change when ban is active
-- ─────────────────────────────────────────────

insert into public.scripts
  (stage_id, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values

-- ── FOUNDATION (4–7) ──────────────────────────────────────────────────────────

(
  'foundation',
  'First device moment',
  'Your child is about to use a screen for the first time, or is asking for their own device.',
  'We are going to use this together at first. I will show you how it works and we will figure out what the rules are as a family.',
  'You can have it but only for 20 minutes.',
  'At this stage the brain is learning what screens feel like. The boundary is not about the clock, it is about co-regulation. Being present at first use sets the tone for every conversation you will have about devices for the next decade.',
  'Sit with them for the first 15 minutes. Do not scroll your own phone. Ask one question about what they are watching or playing.',
  'none',
  true,
  1
),

(
  'foundation',
  'Meltdown when screen time ends',
  'Your child cries, argues, or has a meltdown when you turn off the TV or tablet.',
  'I know that feels really hard. Your brain wants to keep going. That is normal. Let us do a quick wind-down together and then I will tell you when we can watch again.',
  'Stop crying or you will lose screen time tomorrow.',
  'The meltdown is a nervous system response, not a behaviour problem. Dopamine drops sharply when stimulation stops. Shaming the reaction teaches the child to hide their feelings, not regulate them. Naming the feeling and offering a bridge activity rewires the transition over time.',
  'Give a two-minute warning before every screen ending this week. Watch whether the meltdowns reduce.',
  'none',
  false,
  2
),

(
  'foundation',
  'Asking for their own phone',
  'Your 5, 6, or 7 year old asks why they cannot have their own phone like their friend.',
  'Your brain is still growing the part that helps you put the phone down. When that part is stronger you will be ready. Right now we share mine when we need it.',
  'You are too young, end of conversation.',
  'The prefrontal cortex, which governs impulse control, is not developed enough at this age to self-regulate device use. Explaining the biology rather than asserting authority keeps the conversation open and plants a frame the child will return to.',
  'Find a short age-appropriate explanation of how the brain grows. Watch it together. Make it a shared discovery, not a lecture.',
  'none',
  false,
  3
),

-- ── BUILDER (8–10) ────────────────────────────────────────────────────────────

(
  'builder',
  'First social platform request',
  'Your 8, 9, or 10 year old asks to join a messaging app or game chat because their friends are on it.',
  'I want you to be connected with your friends. Let us look at this together and work out whether it is designed for your age and what the rules would be if you joined.',
  'Absolutely not, you are not old enough.',
  'Blanket refusal at this stage pushes the conversation underground. The child will access it via a friend''s device within the week. Investigating it together keeps you in the loop, teaches critical platform literacy, and means the rules are co-created rather than imposed.',
  'Look up the platform''s minimum age requirement together. Ask them why they think that age limit exists.',
  'none',
  true,
  4
),

(
  'builder',
  'Gaming going over time',
  'Your child agrees to 45 minutes and is still playing an hour later.',
  'The game is designed to keep you in. That is not a character flaw, it is an engineering decision. What would help you stop more easily? Let us think about a system together.',
  'You said 45 minutes. You lied to me.',
  'Framing the overage as a design problem rather than a moral failure keeps the relationship intact and teaches media literacy. Children who understand the mechanics of engagement are better equipped to resist them than children who are simply punished for being affected by them.',
  'Ask them to show you one mechanic in the game that is designed to keep you playing. Discuss it without judgment.',
  'none',
  false,
  5
),

(
  'builder',
  'Asking to watch YouTube unsupervised',
  'Your child wants to watch YouTube in their room on their own.',
  'YouTube is built to keep you watching. That is not your fault, it is how it works. For now, can we keep it in the living room so I can see what comes up? When you are older and we both feel confident about it, we can talk about moving it.',
  'I do not trust you on there alone.',
  'Locating the device in a shared space is a structural intervention, not a surveillance one. The child hears "I trust you, I do not trust the algorithm." That is a meaningful distinction that builds rather than erodes the relationship.',
  'Move one device to a common area this week. Say nothing more about it.',
  'none',
  false,
  6
),

-- ── EXPLORER (11–13) ──────────────────────────────────────────────────────────

(
  'explorer',
  'The social media ask',
  'Your 11, 12, or 13 year old asks to join Instagram, TikTok, or Snapchat.',
  'I know most of your friends are on there. Before we decide, I want to show you something about how those platforms are designed, because it changes how I think about it. Can we look at it together?',
  'No. Those apps are dangerous and I am not letting you near them.',
  'The research is not "social media bad." It is "heavy use without structure, at this developmental stage, with certain emotional vulnerabilities, is associated with worse outcomes." The conversation should be about structure and readiness, not a blanket ban that damages trust and pushes them to hide their use.',
  'Watch one short explainer about how the algorithm works with them. No agenda. Just curiosity.',
  'partial_ban',
  true,
  7
),

(
  'explorer',
  'Mood change after phone use',
  'Your child comes off their phone irritable, withdrawn, or tearful and will not talk about what they saw.',
  'You seem like something got to you. I am not going to ask you to tell me what it was. But if something is sitting with you and you want to talk later, I am here. That is it.',
  'What is wrong with you? What were you even looking at?',
  'Interrogating the child immediately after an emotional response to content closes the door. The child learns to hide their phone use more carefully, not to process the content more healthily. Leaving the door explicitly open, with no pressure, is the move that gets you the conversation three days later.',
  'Do not ask about the phone. Ask about them. "How are you feeling right now" is a better question than "what were you looking at."',
  'none',
  false,
  8
),

(
  'explorer',
  'Screenshot and group chat incident',
  'Your child is involved in a group chat incident where screenshots were shared or someone was excluded.',
  'This happens a lot. The question is not who is bad. The question is what do we do now. What does the person who was hurt need? And what do you need?',
  'You should not have sent that. You knew it was wrong.',
  'At this stage, peer relationships are the developmental priority. Shaming the behaviour fractures the parent relationship at precisely the moment the child needs to trust an adult. The goal is to return to the affected peer and repair, not to extract a confession.',
  'Ask one question: "What would have made it go differently?" Listen to the answer. Do not correct it.',
  'none',
  false,
  9
),

-- ── SHAPER (13–15) ────────────────────────────────────────────────────────────

(
  'shaper',
  'Refusing to come off their phone',
  'Your teenager refuses to put the phone down for dinner, homework, or sleep.',
  'I am not going to fight about the phone. But the bedroom rule stays. Phone charges outside the room tonight. That is not negotiable. Everything else we can talk about.',
  'Give me that phone right now.',
  'The bedroom rule is the highest-leverage structural intervention in adolescent device research. Sleep disruption is the mechanism for most phone-related harm at this stage. Holding the line on the bedroom, while negotiating everything else, keeps the relationship functional and the highest-risk behaviour addressed.',
  'Buy a cheap alarm clock today so the phone has no excuse to be in the room.',
  'partial_ban',
  true,
  10
),

(
  'shaper',
  'Social media causing anxiety',
  'Your teenager is clearly anxious about something happening on social media but will not tell you what.',
  'You do not have to tell me what is happening. But I want you to know that whatever it is, I am not going to make it worse by reacting badly. If you do want to talk, I will just listen first.',
  'Just delete the app if it is stressing you out.',
  'Telling an anxious teenager to delete the app removes their social infrastructure. At 13 to 15, social media is not optional entertainment, it is the medium through which peer relationships operate. The research-backed move is to stay close, not to amputate the connection.',
  'Ask them to rate how they are feeling on a scale of one to ten, morning and evening, for one week. No questions. Just the number.',
  'full_ban_u16',
  false,
  11
),

(
  'shaper',
  'Late night device use',
  'You discover your teenager is using their phone after lights out, often until 1 or 2am.',
  'I found out you were on your phone late. I am not angry. I am worried about your sleep because of what I know about how it affects your mood and your brain. I want to sort this together rather than take the phone.',
  'How could you lie to me like that? That is it, no phone for a week.',
  'Sleep deprivation at this age is associated with depression, anxiety, poor academic performance, and increased risk-taking. The research is unambiguous. But punishing the symptom with phone removal for a week does not address the underlying drive. Co-designing the bedroom rule with them gives it more durability.',
  'Put the router on a smart plug. Set it to switch off at 10pm. Tell them in advance. Make it a household rule, not a punishment.',
  'none',
  false,
  12
),

-- ── INDEPENDENT (16+) ─────────────────────────────────────────────────────────

(
  'independent',
  'Content causing distress',
  'Your 16 or 17 year old has seen something online that has clearly affected them, possibly around self-harm, eating, or extremist content.',
  'Something has clearly got to you. You do not have to tell me what. But I want you to know that I have seen difficult things online too and I know how they can sit with you. Is there anything you need right now?',
  'Show me what you were looking at.',
  'At this age, autonomy is the developmental imperative. Demanding to see the content violates it and ends the conversation. The parent''s role shifts from gatekeeper to trusted adult. The question "what do you need" is more useful than "what did you see" because it centres the young person rather than the content.',
  'Research the PAPYRUS or Childline resources on what to do if your child has seen self-harm content. Have the number ready, but do not mention it unless they bring it up.',
  'full_ban_u16',
  false,
  13
),

(
  'independent',
  'University or job and social media',
  'Your 16+ year old is thinking about their digital footprint as they apply to sixth form, apprenticeships, or jobs.',
  'The stuff you put online now will still be there when someone who does not know you searches your name in ten years. It is worth one hour going through your public profiles together and deciding what you actually want someone to see.',
  'You need to clean up your social media, employers look at it.',
  'The conversation lands better as a practical exercise than a warning. Doing it together positions the parent as a useful resource rather than a monitor. The young person learns the skill of intentional digital identity management, which is worth more than the cleaned-up profile.',
  'Sit together and Google their name. Look at what comes up. No judgment. Just information.',
  'none',
  true,
  14
),

(
  'independent',
  'Phone-free conversation',
  'You want to have a real conversation but your teenager is half-present and scrolling.',
  'I want to talk to you properly for ten minutes. Can we both put our phones face down? I will go first.',
  'Put the phone away when I am talking to you.',
  'Modelling the behaviour removes the double standard. Teenagers are acutely sensitive to hypocrisy. When the parent puts their own phone away first, the request shifts from instruction to invitation. Ten minutes is achievable. An open-ended conversation with no time boundary is not.',
  'Put your own phone in another room during dinner tonight. Say nothing about it. See what happens.',
  'none',
  false,
  15
),

-- ── CROSS-STAGE (applies at multiple stages) ──────────────────────────────────

(
  'explorer',
  'Family agreement conversation',
  'You want to establish clear family rules about devices but every attempt becomes an argument.',
  'I want to make a family agreement about phones. Not rules I am imposing, an agreement we all sign. Can we spend 20 minutes on it this weekend? You get to put things in it too.',
  'These are the rules and that is final.',
  'Co-created agreements have significantly better compliance than imposed rules. Research on adolescent behaviour consistently shows that perceived fairness and autonomy are the mechanisms. The agreement also creates a reference point for future conversations that is not a power struggle.',
  'Write three things you want in the agreement. Ask them to write three things. Meet in the middle.',
  'none',
  false,
  16
),

(
  'shaper',
  'The ban conversation',
  'Your teenager is asking about or affected by the UK social media age restrictions.',
  'The law has changed on social media for under-16s. I know that affects you. I want to talk about what that actually means for us, not just say yes or no.',
  'The government has banned it so that is that.',
  'The ban creates a legal surface but not a relational one. Teenagers who feel the rule is arbitrary and external find workarounds. The parent''s role is to connect the law to the underlying reason, which is the research on adolescent brain development and algorithm design, in a way that makes sense to the young person.',
  'Look up the government''s stated reason for the ban together. Ask them what they think about it.',
  'full_ban_u16',
  false,
  17
);
