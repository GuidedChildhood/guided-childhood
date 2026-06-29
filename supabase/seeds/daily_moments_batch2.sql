-- Daily Moments Scripts — Batch 2
-- Category: daily-moments
-- Sort orders: 1316-1330
-- Covers: group chat drama, gaming rage, everyone has it, finding something upsetting,
--         Instagram comparison, homework panic, broken phone, boredom spiral, and more

INSERT INTO public.scripts (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order) VALUES

(
  'builder',
  'daily-moments',
  'When Group Chat Drama Comes Home',
  'Your child arrives home visibly upset or quiet. You eventually discover something happened in the class group chat.',
  'Something happened in the group chat, didn''t it. You don''t have to tell me what. But I am here if you do.',
  'Let me see the messages. Who started it? Right, I am messaging their parents.',
  'Immediately escalating to the school or other parents often makes the social situation worse for your child. Children care deeply about not being seen as the one whose mum got involved. Naming what you can see and leaving the door open gets you more than demanding to see the evidence.',
  'Ask one question tonight and nothing else: is anyone being unkind to you, or were people just being silly? The answer tells you everything you need to know about the next step.',
  'none',
  false,
  1316
),

(
  'builder',
  'daily-moments',
  'Gaming Rage',
  'Your child has just thrown a controller, burst into tears, or shouted after losing a game.',
  'That was really frustrating. Take a minute. I am going to get you a drink.',
  'It is just a game. This is why I worry about you playing so much.',
  'Telling a child in the middle of a flood of emotion that it is just a game does not land. They know it is just a game. The emotion is real even when the trigger seems small. Giving them something physical to do next and some space resets the nervous system faster than reasoning.',
  'After they have calmed down, not now, ask what happened just before the rage. Loss, unfairness, or being killed by the same player twelve times? The trigger matters.',
  'none',
  false,
  1317
),

(
  'explorer',
  'daily-moments',
  'Everyone Else Has It',
  'Your child is furious that they are the only one without the app, the game, or the device that everyone else apparently has.',
  'Tell me more about that. Who has it? What do they do with it? I want to understand what I am actually saying no to.',
  'I do not care what everyone else has. We are not everyone else.',
  'We are not everyone else is technically true but sounds like the end of the conversation rather than the beginning of one. Asking questions about what they actually want to do with the thing shows you are taking them seriously. Half the time the conversation becomes more interesting than the argument.',
  'This week, look up one or two facts about what they are asking for. Come back with information, not just a position. You might learn something. You might not change your mind. But they will notice you tried.',
  'partial_ban',
  false,
  1318
),

(
  'explorer',
  'daily-moments',
  'Finding Something Upsetting on Their Device',
  'You have found something on your child''s phone or in their search history that worries you. Violence, adult content, or something else entirely.',
  'Say nothing yet. Take a breath, think about what you actually want to know, and choose a calm moment. Then: I came across something on your phone that I want to talk about. I am not angry. I want to understand what was going on.',
  'Do not wait until you are angry to have this conversation. And do not start by saying I went through your phone.',
  'How you open this conversation determines whether you get the truth or a wall. If the first thing they feel is shame or surveillance, they will not tell you the real story. Calm and curious lands better than shocked and accusatory. You want information, not a confession.',
  'Before you talk to them, decide what you actually want as the outcome. More information? A conversation about what they saw? A plan going forward? Knowing your own goal helps you stay calm when they get defensive.',
  'none',
  false,
  1319
),

(
  'shaper',
  'daily-moments',
  'The Instagram Comparison Crash',
  'Your teenager has gone quiet or said something self-critical after time on Instagram. You think they are comparing themselves to what they are seeing.',
  'You seem a bit flat after being on there. Instagram is genuinely designed to make everyone feel like everyone else has something they don''t. Even the people posting it feel it.',
  'Just stop using it then. You know it is not real.',
  'Telling a teenager that social media is not real does not help because the emotional response is real even when the content is not. Naming the design of the platform rather than their response to it shifts it from a personal weakness to a systemic problem. You are not broken for feeling this. The app is built to make you feel this.',
  'One question, not tonight: what do you actually feel when you come off it? Good, flat, or somewhere in between? You do not need to change anything yet. Just notice.',
  'partial_ban',
  false,
  1320
),

(
  'builder',
  'daily-moments',
  'The Homework Panic Spiral',
  'It is Sunday evening. Your child suddenly reveals they have not started a piece of work due tomorrow. They have been on their device all weekend.',
  'Right. Let us see what there actually is. Show me the task. We are going to do what we can in the next hour and that is all.',
  'This is what happens when you spend all weekend on screens. I cannot help you with this now.',
  'Withdrawing help as a consequence in this moment teaches the wrong lesson. The lesson you want them to learn is that there is always a next step, however late it gets. Staying calm and helping them triage the work gives you a much better conversation about screens later, when you are both not panicking.',
  'Tomorrow, not tonight, ask one question: what would have made it easier to remember? Not a lecture. One question.',
  'none',
  false,
  1321
),

(
  'shaper',
  'daily-moments',
  'When You Discover They Have Been Messaging Someone Unknown',
  'You have found out your teenager has been messaging someone online that you do not know. It could be innocent. It could be more than that.',
  'I need to talk to you about something. I am not accusing you of anything. I came across some messages and I want to understand who this person is and what is going on.',
  'You are in serious trouble. Who is this person? Give me your phone right now.',
  'Starting with serious trouble closes the conversation before it opens. You need information first. Most of the time there is an innocent explanation. Sometimes there is not. Either way, you need them talking, not defensive. Calm and curious gets you closer to the truth than alarmed and accusatory.',
  'After the conversation, whatever you find, do not punish communication. Punishing them for talking to people online teaches them to hide it better. The conversation about safety matters more than the consequence.',
  'none',
  false,
  1322
),

(
  'foundation',
  'daily-moments',
  'When They Say Everything Is Boring Without a Screen',
  'You have taken the device away or limited screen time and your child is telling you that everything is boring. Nothing you suggest is good enough.',
  'I hear you. Bored is uncomfortable. Give it ten minutes and see what your brain comes up with.',
  'You never used to need a screen to have fun. Go and find something to do.',
  'The brain takes time to shift from the high stimulation of a screen to the lower stimulation of real-world play. The uncomfortable gap is real, not performed. Naming it, giving it a time limit, and stepping back is usually enough. The ten minutes almost always produces something.',
  'This week, have one thing ready that requires no setup when the device goes off. Lego on the table. A ball in the garden. A snack. Something physical and low-stakes.',
  'none',
  true,
  1323
),

(
  'builder',
  'daily-moments',
  'When They Haven''t Eaten Because They Were Gaming',
  'You realise your child has not eaten anything since breakfast because they have been absorbed in a game.',
  'Right, device off. Food first. You can come back to it after you have eaten.',
  'You are addicted to that thing. Look at you, you haven''t even eaten.',
  'The addiction frame is rarely helpful at this age and immediately makes the conversation about the screen rather than the need. A child who forgets to eat while absorbed in an activity is showing normal developmental engagement. Food first, conversation later. Brief and direct works here.',
  'Tomorrow, agree a food check-in time on gaming days. Not rules about gaming. Just a time they know food will be ready and the game pauses.',
  'none',
  false,
  1324
),

(
  'explorer',
  'daily-moments',
  'When the Phone Breaks or Gets Lost',
  'Your child''s phone has been broken, lost, or stolen. They are devastated and possibly panicking about being out of contact with their friends.',
  'I know that feels awful. We will sort out what happens next tomorrow. Tonight, what do you actually need to tell people and can we do that from another device?',
  'This is why you should look after your things. We cannot afford to replace that.',
  'The this is why lecture in the moment of distress does not land as a lesson. It lands as blame when they are already upset. Solving the immediate practical problem first and saving the conversation about care and cost for tomorrow produces a much better outcome on both fronts.',
  'When they are calm, have a brief practical conversation about what happens next. Not as a punishment. As a plan.',
  'none',
  false,
  1325
),

(
  'shaper',
  'daily-moments',
  'When Your Rules Are Different From Their Friends'' Parents',
  'Your teenager is furious that their friend is allowed something you have decided against. They see your approach as unfair or embarrassing.',
  'I understand you think this is unfair. Different families make different choices and I have made mine. I am always happy to hear your argument but I will not change my mind because another parent said yes.',
  'If their parents want to let them do that, that is their problem. In this house we do things differently.',
  'That is their problem dismisses the real social difficulty your child is experiencing. Acknowledging that different families make different choices validates the situation without undermining your decision. You can hold your position without making other parents the villains.',
  'Ask yourself honestly whether your position is about safety or habit. Sometimes revisiting a rule with new information is the right thing. Sometimes it is not. Know which one this is before you have the conversation.',
  'partial_ban',
  false,
  1326
),

(
  'builder',
  'daily-moments',
  'Sibling Fights Over One Device',
  'Two children are fighting over who gets the device, how long each has had it, and whether the other one is cheating the time.',
  'Right, I am taking it. Neither of you gets it until you can agree a plan between you. Come and find me when you have one.',
  'I do not care who started it. You are both as bad as each other.',
  'You are both as bad as each other does nothing to solve the problem and makes both children feel aggrieved. Removing the object and making the resolution their responsibility removes you from the referee role. Most children will reach an agreement faster than you expect when the alternative is no device at all.',
  'Make a simple device schedule with their input this week. Even a rough one. Having an agreed plan reduces the negotiation every time.',
  'none',
  false,
  1327
),

(
  'shaper',
  'daily-moments',
  'When They See Something Violent or Disturbing Online',
  'Your teenager has seen something online that has upset or disturbed them. They may come to you or you may notice they seem off.',
  'Tell me as much or as little as you want. Whatever you saw, your reaction to it is normal. Some things online are genuinely disturbing.',
  'Why were you even watching that? What platform was it on? I am putting parental controls on everything.',
  'Why were you watching that makes them feel stupid or ashamed for something that was likely algorithmic rather than sought. Parental controls as the immediate response shifts the focus from them to the device. What they need first is for their response to be named as normal. Then you can have the wider conversation.',
  'Once they are settled: was it something that appeared, or something they went looking for? Not an accusation. Just a question. The answer changes what you do next.',
  'none',
  false,
  1328
),

(
  'independent',
  'daily-moments',
  'When They Stop Talking to You and Talk to Their Phone',
  'Your 16 or 17 year old no longer tells you anything directly. You find out what is happening in their life through glimpses of conversations or social media rather than from them.',
  'I know you have your own life and I am not trying to get in the way of it. I just want to know how you are. Not the detail. Just you.',
  'You used to tell me everything. I feel like I don''t even know you anymore.',
  'I don''t even know you anymore puts the emotional weight on them to fix your feelings, which usually produces withdrawal rather than opening up. I just want to know how you are is low pressure and specific. It asks for mood, not detail. Teenagers can usually answer that.',
  'One brief check-in this week with no agenda. A meal. A car journey. Not a sit-down conversation. Just proximity and one question.',
  'none',
  false,
  1329
),

(
  'explorer',
  'daily-moments',
  'When They Use Their Phone to Avoid an Awkward Situation',
  'You notice your child pulls out their phone whenever something uncomfortable happens: a family gathering, a social situation that feels hard, silence in the car.',
  'Nothing right now. Later, in private: I noticed you find it easier to go on your phone when things feel a bit uncomfortable. Most people do. What is it like when you put it away?',
  'Put that away. This is rude. Pay attention to what is happening around you.',
  'Put that away shuts the behaviour down without addressing what is underneath it. The phone is managing anxiety, not creating it. Naming it privately and gently as a pattern you have noticed, without shame, opens a conversation that the public reprimand never would.',
  'Notice where you reach for your own phone when things feel uncomfortable. Children learn this from watching us, not from instruction.',
  'none',
  false,
  1330
);
