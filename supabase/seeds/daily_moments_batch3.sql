-- Daily Moments Scripts — Batch 3: Real Daily Life Incidents
-- Category: daily-moments
-- Sort orders: 1331-1370
-- Covers: morning routine, school transitions, snacks, clothes, dinner, evening TV,
--         homework, sibling conflict, bedtime, and the full arc of a parenting day

INSERT INTO public.scripts (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order) VALUES

-- ── MORNING ROUTINE ──────────────────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'The Teeth Brushing Standoff',
  'It is 8am. Your child is refusing to brush their teeth. You have asked three times and you are already late.',
  'Two minutes. You choose the toothpaste, I will set the timer. Then we are done.',
  'Why do you make this so hard every single morning? Just brush your teeth.',
  'The every morning makes your child feel like a problem rather than a person who is struggling with a task. Giving choice within a non-negotiable boundary is the fastest route through sensory or autonomy resistance. The timer removes you from the role of the one making them stop.',
  'This week, let them pick their own toothbrush or toothpaste at the shops. Ownership changes the dynamic more than any strategy.',
  'none',
  true,
  1331
),

(
  'foundation',
  'daily-moments',
  'Getting Dressed is a War',
  'Your child is on their third meltdown this week about what to wear. You are going to be late again.',
  'Right. These two. Which one today?',
  'You wore that yesterday. Just put something on. I do not have time for this.',
  'An open wardrobe is too many decisions for a child who is already overwhelmed. Two options removes the executive load while preserving the sense of control. The I do not have time framing tells them their feelings are an inconvenience rather than addressing the actual barrier.',
  'Tonight, lay out two choices for tomorrow with their input. Not your choice. Their shortlist. The morning becomes the execution, not the decision.',
  'none',
  true,
  1332
),

(
  'builder',
  'daily-moments',
  'School Bag Not Packed',
  'It is 8:15am. Your child has not packed their bag. They cannot find their PE kit, their reading book, or their homework.',
  'Take what you can find. If something is missing, that is what happened today. You can sort it with your teacher.',
  'This is because you left everything to the last minute. This is not my problem.',
  'This is not my problem is technically true but leaves a child panicking at the door. Taking the natural consequence of an unpacked bag is more educational than the rescue, but it lands better when you stay warm while holding the boundary. Missing a PE lesson once is a powerful teacher.',
  'After school, a five minute bag check together. Not you doing it for them. You sitting nearby while they do it. Build the habit before the morning rush.',
  'none',
  false,
  1333
),

(
  'builder',
  'daily-moments',
  'Lunch Not Packed',
  'You are at work and you have had a text from school that your child has no lunch.',
  'If this is a text you receive: I will sort it with the school. Tonight, let us work out how to make sure it does not happen again.',
  'If this is discovered at the door: Right, we will ask school to help you today. We are going to sort this out properly tonight.',
  'The rescue with a lecture at the door produces shame without learning. Solving the practical problem first and having the logistics conversation in the evening produces a much better outcome on both fronts. Hunger at school is a real consequence but one the school can usually help with once.',
  'Tonight, one question: where should the lunch box live on a school night so it is impossible to forget? Let them answer.',
  'none',
  false,
  1334
),

(
  'foundation',
  'daily-moments',
  'How Did the Morning Go',
  'You have just dropped your child at school. The morning was hard. You need to get on with your day but it is sitting with you.',
  'This is for you: take a breath. One hard morning does not define your parenting or their day. Most children leave the house upset and walk into school fine.',
  'Do not replay the morning. Do not text the school unless something is seriously wrong.',
  'The morning rupture that loops in your head all day is a normal feature of parenting young children. Research on attachment consistently shows that the rupture is not what matters. The repair is what matters. A warm pickup, a hug, one question about their day is the repair.',
  'Tonight: a proper hello when they come home. Put the morning away. They usually already have.',
  'none',
  true,
  1335
),

-- ── SCHOOL TRANSITIONS ────────────────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'The School Drop Off Struggle',
  'Your child is clinging to you at the school gate. They are crying or refusing to go in. The teacher is waiting.',
  'I know this is hard. I love you. I will be here at pickup. Go with your teacher.',
  'Come on, there is nothing to cry about. Everyone else is going in fine.',
  'Everyone else is going in fine is among the least useful things a parent can say at a gate. It invalidates the child''s experience and adds shame to the anxiety. A brief, warm, confident goodbye is genuinely the most protective thing you can do. Prolonged negotiation at the gate increases separation anxiety over time.',
  'Agree a goodbye ritual together. A specific handshake, three squeezes, a code word. Children who have a predictable ending to the goodbye settle faster.',
  'none',
  true,
  1336
),

(
  'builder',
  'daily-moments',
  'The School Pickup Debrief',
  'You have picked up your child. They are either completely silent or erupting at everything since the moment they got in the car.',
  'Nothing yet. Just drive. Offer a snack. After ten minutes: anything good happen today?',
  'How was school? What did you do? Was it a good day? Did anything happen?',
  'The barrage of questions on pickup is the exact moment children need least from you. They have been regulated all day and they need to decompress first. A snack, ten minutes of silence or music, one low-stakes question is the highest-yield pickup strategy. The stories arrive later.',
  'Notice what time the conversation actually starts on the days it does. That is the decompression window. Match your questions to it.',
  'none',
  false,
  1337
),

-- ── SNACKS AND FOOD ───────────────────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'The After School Snack Battle',
  'Your child is raiding the cupboards the moment they come in. You want them to eat dinner in an hour.',
  'Have some of this. Dinner is in about an hour so something small is fine.',
  'Do not eat that now, you will ruin your dinner. Wait.',
  'A child who has been at school all day is often genuinely hungry. Hunger after school is biological, not manipulative. A small snack does not ruin dinner in most children. Fighting it creates a power struggle over food which is the thing you most want to avoid.',
  'Keep a snack bowl at child level with the things you are happy for them to eat freely. It removes the negotiation entirely.',
  'none',
  false,
  1338
),

(
  'builder',
  'daily-moments',
  'Choosing Healthy Snacks',
  'Your child wants crisps or biscuits. You want them to have something more nutritious. This happens every afternoon.',
  'You can have some of those and some of this. Both is fine.',
  'Those are not a snack. Why can you not just eat an apple?',
  'The why can you not just eat an apple framing puts your child on trial for normal food preferences. Children who are offered ultra-processed food alongside whole food without a moral charge eat a more balanced diet over time than children who have junk food locked away. Restriction increases fixation.',
  'This week, put fruit and vegetables out alongside the crisps. No comment. Just both available. Notice what happens over five days.',
  'none',
  false,
  1339
),

-- ── EVENING: CLOTHES AND HOUSEHOLD ────────────────────────────────────────────

(
  'builder',
  'daily-moments',
  'Clothes Not in the Washing Bag',
  'You are doing the washing. Your child''s clothes are on the floor, on the chair, or in a pile next to the washing bag but not in it.',
  'Anything on the floor tonight does not get washed. Just so you know.',
  'How many times do I have to tell you? These need to go in the basket. This is so simple.',
  'How many times signals that you expect compliance without having created the conditions for it. A natural consequence delivered without emotion is more educational than the same instruction repeated loudly. Wearing a damp PE kit once, or missing a favourite top for a week, is a remarkably effective teacher.',
  'Show them where the basket is one more time. Then let the consequence do the work this week. Say nothing more about it.',
  'none',
  false,
  1340
),

-- ── EVENING: DINNER ───────────────────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'Choosing Dinner is a Crisis',
  'You asked what they want for dinner. Now there is a thirty minute debate, someone is crying, and you still do not know what you are making.',
  'I am making pasta tonight. You can choose the sauce. Those are the two options.',
  'Fine, what does everyone want? Tell me and I will make it.',
  'The open offer of what do you want invites a negotiation that has no natural end. Children genuinely cannot manage that level of executive decision-making when they are tired and hungry. Two clear options within a decision you have already made is not restrictive. It is kind.',
  'Pick two or three meals that always work and rotate them through the week. Predictability is not boring. It is calming.',
  'none',
  true,
  1341
),

(
  'builder',
  'daily-moments',
  'They Will Not Eat What You Have Made',
  'You have cooked dinner. Your child looks at it, says they hate it, and wants something else.',
  'This is dinner tonight. You do not have to eat it but there is nothing else until breakfast.',
  'Fine, I will make you something different. But next time you are going to eat what I cook.',
  'Next time you are going to eat what I cook is a promise neither of you can keep and sets up tomorrow''s battle before tonight is over. Holding the boundary without drama and without alternative is the single most consistent thing parents can do to address picky eating over time. Hunger is not an emergency.',
  'If they choose not to eat, do not comment. Clear the table. Let them go. If they say they are hungry later, a glass of milk or a piece of bread is fine.',
  'none',
  false,
  1342
),

(
  'foundation',
  'daily-moments',
  'Healthy Dinner Refusal',
  'You have made something nutritious. Your child is asking for nuggets, pasta, or something beige.',
  'I hear you. This is what we have tonight. Have as much or as little as you like.',
  'You need vegetables. You cannot just live on pasta. Try at least one bite.',
  'The try one bite rule has consistently negative outcomes in research on picky eating. It teaches children to manage your anxiety about their eating rather than to develop a genuine relationship with food. Staying neutral, continuing to offer, and refusing to cook alternatives is the evidence-based approach.',
  'If this is every night with the same foods refused, talk to your GP. Restricted eating in young children can flag sensory issues that respond well to early support.',
  'none',
  false,
  1343
),

-- ── EVENING: TV AND SCREENS ────────────────────────────────────────────────────

(
  'builder',
  'daily-moments',
  'Evening TV Will Not Turn Off',
  'It is 7:30pm. You have said the TV is going off. It has not gone off. You have been saying it for twenty minutes.',
  'Right. TV off now. I know you want to finish the episode. I am turning it off and we will find where you got to together tomorrow.',
  'I said turn it off. Why do you never listen to me? That is it, no TV tomorrow.',
  'No TV tomorrow is a punishment that arrives at the wrong moment and is hard to enforce consistently. It creates tomorrow''s battle tonight. Turning the TV off yourself, with calm, removes you from the negotiation and signals that the decision is made. Finding where they got to tomorrow removes the injustice of the missing ending.',
  'This week, agree the evening TV window before it starts, not after it has already run long. The agreement beforehand is what prevents the battle at the end.',
  'none',
  false,
  1344
),

(
  'explorer',
  'daily-moments',
  'TV Shows That Are Too Old',
  'Your child is watching something on Netflix or YouTube that you feel is not appropriate for their age. They say all their friends watch it.',
  'I want to watch the first episode with you tonight. Then we can decide together.',
  'That is not appropriate. Turn it off. Where did you even find that?',
  'Immediate prohibition produces underground watching, not protected children. Watching alongside them changes your position from censor to guide. You can name what you see, ask questions about how it lands, and make a shared decision. In most cases the show is less alarming than the title suggested.',
  'If after watching you decide it is not right: I watched it with you and I do not think it is for now. Not for another year or two. That is a decision, not a punishment.',
  'none',
  false,
  1345
),

-- ── HOMEWORK ─────────────────────────────────────────────────────────────────

(
  'builder',
  'daily-moments',
  'Homework Every Night is a Battle',
  'Homework is a nightly source of conflict. Your child avoids it, refuses it, or melts down the moment you mention it.',
  'Right, fifteen minutes. You do it, I will be in the kitchen. Come and find me if you get stuck.',
  'We do this every single night. Sit down and do your homework. It is not that hard.',
  'It is not that hard is almost never true for the child sitting in front of it. The battle is usually about confidence, not compliance. Fifteen minutes with a visible end point and your presence nearby but not hovering is consistently more productive than standing over them demanding effort.',
  'If the same subject produces a meltdown every week, mention it to the teacher. It often flags a gap the school has not identified.',
  'none',
  false,
  1346
),

(
  'explorer',
  'daily-moments',
  'The Forgotten Homework Discovery',
  'At 9pm you discover your child has not done homework that is due tomorrow.',
  'Right. How much is there? Let us see what we can actually do in the next thirty minutes.',
  'This is because you wasted the whole evening. I am not staying up to help you.',
  'Withdrawing help as a consequence leaves a child going to school unprepared, which damages their relationship with the school rather than teaching the intended lesson. Staying calm and doing what can be done in thirty minutes gives you a much better conversation tomorrow about what the plan is going forward.',
  'Tomorrow, not tonight: one question only. Where could you have fitted this in? Not a lecture. One question. Let them work it out.',
  'none',
  false,
  1347
),

-- ── SIBLING CONFLICT AND FIGHTING ────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'They Will Not Stop Fighting',
  'Your children have been arguing since they came home. You have intervened four times. Nothing is working.',
  'Right, separate rooms, separate activities. You can come back together when you are both calm.',
  'Stop it. Why are you always fighting? What is wrong with you two?',
  'What is wrong with you two invites children to define themselves as a problem rather than two people who are stuck in a conflict. Sibling conflict is developmental and normal. Separation without judgment gives both children the regulation break they need. Most sibling arguments dissolve within twenty minutes if you remove the audience.',
  'Notice what time of day the fighting peaks. Hunger and tiredness are the two most common drivers. A snack or ten minutes of quiet often solves what felt like a personality clash.',
  'none',
  true,
  1348
),

(
  'builder',
  'daily-moments',
  'They Are Fighting Over Something Specific',
  'Your children are arguing over whose turn it is, who had it longer, or who broke whose thing.',
  'Right, everyone stops. One at a time. You first. Then you.',
  'I do not want to hear it. Sort it out between yourselves.',
  'Sort it out yourselves works well with children over ten who have the tools for conflict resolution. For younger children it usually means the loudest or most persistent child wins, and the resentment builds. Giving each child thirty uninterrupted seconds to say their piece de-escalates faster than any other approach.',
  'After the immediate situation is resolved: what would fair look like here? Ask both of them. The answer is usually closer than you expected.',
  'none',
  false,
  1349
),

(
  'explorer',
  'daily-moments',
  'Older Sibling Being Unkind',
  'Your older child is being consistently unkind, dismissive, or exclusionary toward a younger sibling.',
  'A word quietly with the older child: I have noticed what is happening with your brother or sister. I am not accusing you. But I need it to stop.',
  'You should be ashamed of how you treat them. You are the older one. You should know better.',
  'You should know better activates shame rather than empathy, which closes down the conversation. A private, low-temperature conversation about what you have noticed and what you need from them is more likely to change the behaviour. Teenagers are often unkind to younger siblings because of their own stress, not because they dislike them.',
  'If it continues, one brief conversation: what is going on with you at the moment? The behaviour is usually a signal.',
  'none',
  false,
  1350
),

-- ── BEDTIME ROUTINE ───────────────────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'Getting Up for Bed is a Battle',
  'It is bedtime. Your child is still downstairs. They are asking for one more thing: one more drink, one more hug, one more question.',
  'One drink, one wee, one story, one hug. That is the list. Then that is it.',
  'I have told you to go to bed four times now. That is it. Go. Now.',
  'Go now said four times has already lost its authority by the fourth time. A concrete list of what is allowed resets the negotiation on your terms. Children ask for one more things because the transition to bed is emotionally difficult, not because they are trying to be difficult. A clear sequence makes the ending predictable.',
  'Make a bedtime routine chart together this week with pictures for younger children. When the chart is done, the night is done. The chart ends the night, not you.',
  'none',
  true,
  1351
),

(
  'builder',
  'daily-moments',
  'Will Not Go to Sleep',
  'Your child is in bed but calling out, coming downstairs, or has been awake for over an hour.',
  'You are in bed, you are safe, you do not need to be asleep yet. Stay in your room quietly. I will check on you in ten minutes.',
  'Go to sleep. There is nothing to worry about. Just close your eyes.',
  'Close your eyes does nothing for a child whose nervous system is still activated. You do not need to be asleep yet removes the performance pressure of sleep itself, which paradoxically makes sleep arrive faster. The ten minute check-in promise keeps the anxiety manageable without rewarding the calling out.',
  'Check the bedroom environment: temperature, light, sound. Blackout blinds, white noise, and a cool room change the sleep context more reliably than behaviour management.',
  'none',
  false,
  1352
),

(
  'explorer',
  'daily-moments',
  'Sleep Pattern Has Gone',
  'Your child is going to sleep late, waking in the night, or waking too early. Their mood and behaviour during the day are suffering.',
  'Something is off with your sleep and I can see it is affecting you. Can we look at what the evenings look like and try to shift it?',
  'You are exhausted because you will not just go to sleep. This is your own fault.',
  'Sleep problems in children aged 10 to 15 are rarely willful. They are usually a combination of circadian shift, screen exposure, anxiety, or social stress. Naming that you can see the effect on them without blame opens a collaborative conversation. This is your fault closes it entirely.',
  'One screen-free hour before bed for a week. Not as a punishment. As a genuine sleep experiment. Ask them to rate their sleep at the end of the week.',
  'none',
  false,
  1353
),

(
  'foundation',
  'daily-moments',
  'The Midnight Requests',
  'It is 11pm. Your child is downstairs again or calling out for a drink, a cuddle, or because they had a bad dream.',
  'Come here. Let me settle you. Back to bed in five minutes.',
  'It is midnight. Get back to bed right now. You are too old for this.',
  'The you are too old for this removes dignity from a child who is genuinely unsettled. Night waking in children under 8 is normal and episodic. A brief, warm, matter-of-fact response that does not reward the waking with extended attention is the right balance. Five minutes of comfort followed by a firm but gentle return to bed is not spoiling them.',
  'If night waking is happening more than three nights a week for more than two weeks, mention it to the GP. It can signal anxiety or sleep disruption that responds to simple support.',
  'none',
  false,
  1354
),

-- ── GENERAL DAILY PRESSURE POINTS ─────────────────────────────────────────────

(
  'builder',
  'daily-moments',
  'A Day Where Everything Went Wrong',
  'Today was just a hard day. Multiple incidents, multiple conflicts, multiple things you handled less well than you wanted to.',
  'This one is for you. Breathe. One hard day does not make you a bad parent. You showed up. That is the job.',
  'Do not list all the things you should have done differently before you have slept.',
  'The parenting research literature is consistent on one thing above all others: children need a parent who is present and who repairs after hard moments, not a parent who handles every moment perfectly. You will have a chance to repair tomorrow. That is what the research actually shows matters.',
  'One repair tomorrow. Pick one moment from today and acknowledge it briefly. I was not great this morning. I am sorry for that. That is enough.',
  'none',
  true,
  1355
),

(
  'builder',
  'daily-moments',
  'Screen Time Before School Has Happened Again',
  'Despite the agreement, your child has been on their device this morning before school. You discovered it too late to do anything before they left.',
  'Nothing this morning. Tonight: I noticed the device was on before school. That was not the agreement. What happened?',
  'Right, that is it. No device this evening. I told you.',
  'An immediate evening removal feels just to the parent but arbitrary to the child because the gap between the behaviour and the consequence is too long. A calm conversation tonight asking what happened gives you information and treats your child as someone capable of having a conversation rather than just receiving punishment.',
  'If it happens again, a conversation about the charging location. Structural change beats repeated consequence.',
  'none',
  false,
  1356
),

(
  'explorer',
  'daily-moments',
  'The Messy Bedroom',
  'Your child''s bedroom is in a state. You have asked them to tidy it multiple times. It is still a mess.',
  'Your room needs to happen this weekend. Saturday before lunch. That is the deal.',
  'Your room is disgusting. How can you live like this? You are tidying it now.',
  'Now as an instruction on a weekday evening rarely produces a clean room. It produces a row. A specific, boundaried time at the weekend with a clear consequence if it does not happen gives both of you a clean framework. The you are disgusting framing tells them you judge them, not just the room.',
  'Set the consequence before the weekend. If it is not done by Saturday lunch, one weekend activity comes off the table. Name it in advance. Then enforce it calmly if needed.',
  'none',
  false,
  1357
),

(
  'shaper',
  'daily-moments',
  'They Were Rude to You Today',
  'Your child spoke to you in a way that was genuinely unkind. You did not respond well. Or you held it together but you are still stinging.',
  'If they are still around: I need to say something. The way you spoke to me earlier was not okay. I am not angry now. But I need you to know.',
  'Do not pretend it did not happen. Do not let it slide to keep the peace.',
  'Letting rudeness pass without naming it teaches your child that the behaviour is acceptable. Naming it calmly, without punishment, and at a slightly delayed moment lands better than immediate escalation. I need you to know is different from a lecture. It is one sentence. One sentence is enough.',
  'If this is a pattern and not an isolated incident, that is worth a brief conversation about what is going on for them generally. Persistent rudeness is often a sign of something else.',
  'none',
  false,
  1358
),

(
  'foundation',
  'daily-moments',
  'A Good Day Worth Noticing',
  'Something went well today. Maybe a conversation happened. Maybe there was no fight at bedtime. Maybe you handled something better than you expected.',
  'This is for you: tell someone. A friend, a partner, yourself. The hard days get talked about. The good ones often do not.',
  'Do not discount it because tomorrow might be hard again.',
  'The negativity bias in parenting is real. Hard days lodge. Easy days slip. Deliberately naming a day that went well is not naivety. It is calibration. Research on wellbeing consistently shows that actively noticing positive moments protects parents against burnout and improves their capacity for hard days.',
  'Tonight, one thing: write it down or say it out loud. That was a good day. Or even, that moment was good. That is enough.',
  'none',
  true,
  1359
);
