-- Guided Childhood — Migration 261
-- Six scripts that fall straight out of the situations and forecasts briefing.
--
-- Justin, 6 September 2026, asked for DiGi to know the exact moments parents
-- live in and to forecast what arrives next; the verified briefing
-- (briefings/2026-09-06-digi-situations-and-forecasts-v2.html) named six
-- scripts the evidence writes almost by itself. The platform map
-- (plans/2026-09-06-situations-platform-map.md) checked each one against the
-- 292 scripts already in the table, so none of these repeats a row that
-- exists: the builder match stop and the explorer real money scripts
-- (migration 186) stay where they are and these sit before, after and beside
-- them.
--
--   foundation  screen time      the ending set by the content, not a countdown
--   builder     gaming           the first gift card, before the first spend
--   builder     school and AI    ask the AI together, hints not answers
--   builder     family rules     the Year 6 phone plan, before the box is opened
--   explorer    staying safe     the no confiscation promise, said out loud
--   explorer    everyday         the parent's own phone, one protected slot
--
-- The evidence, at the strength it supports and no further: Hiniker 2016
-- (technology mediated endings beat parent called ones in preschoolers, the
-- two minute warning made it worse); Ofcom 2026 (97% of 8 to 17s play online,
-- 53% spend; 56% of ten year olds to 83% of eleven year olds own a phone);
-- Xiao and Lund 2025 (none of the top grossing games with loot boxes ask a
-- parent); Bastani 2025 (answers hurt the exam, hints did not); the Children's
-- Commissioner 2025 and the DSIT consultation 2026 (children go quiet when
-- telling costs them the phone); Carter 2016 (the bedroom rule); McDaniel and
-- Radesky 2018 and Pew 2024 (the parent's phone is inside the loop). Every
-- figure names its country. No script ends in a confiscation; every one gives
-- the child something to be competent at.

-- ── 1. foundation, screen time, 4 to 7 ──────────────────────────────────────

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'foundation', 'screen-time',
  'The two minute warning is making it worse',
  $st$You give the warning, you count down, and the ending still ends in tears. Every day. You have started to dread the word "off" as much as they do.$st$,
  $sy$When this episode finishes, the tablet finishes too. Not me, the tablet. Let us watch the last bit together and see the end come. Then it is your turn to press the button.$sy$,
  $nt$Two minutes. One minute. Thirty seconds. I said OFF. Right, that is it, no tablet tomorrow.$nt$,
  $wy$The countdown feels like fairness, and for a four year old it is a slow burning threat with a parent attached to it. Researchers who watched 55 families of under sixes found that endings set by the technology, the episode finishing or the device timing itself out, went far better than endings called by a parent, and the spoken two minute warning made the ending worse on every measure they looked at. The child was not being defiant. A warning from you makes you the thing that ends the fun; an episode ending is just the world.

So the move is to hand the ending to the content. Pick programmes with a clear finish, set the device to stop itself where you can, and agree the stopping point before it starts, when they are calm enough to agree to anything. Then let them press the button. A child who ends it is competent; a child who has it ended on them is bereaved.

This is the first version of a rule that will follow them all the way to the console at ten and the phone at eleven: stop at the real finishing line, agreed in advance, never a clock time that lands in the middle of something.$wy$,
  $tn$Tonight, before the tablet comes out, say how many episodes and let them say it back. When the last one ends, hand them the tablet to switch off themselves.$tn$,
  $ip$If they beg for one more at the end, do not argue about time. Say "the deal was two, and you said it too," and offer the next thing straight away, something with your hands and theirs in it.$ip$,
  $cb$In a week, notice whether the ending has gone from a fight to a grumble. If the grumble is about the next thing rather than the tablet, it has worked.$cb$,
  $fy$Your grown up is going to let the programme decide when it ends, not their voice. You get to press the button. Ending it yourself is a big kid thing to do.$fy$,
  'none', true, 9650
where not exists (select 1 from public.scripts where title = 'The two minute warning is making it worse');

-- ── 2. builder, gaming, 8 to 10 ─────────────────────────────────────────────

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'builder', 'gaming',
  'The first gift card, before the first spend',
  $st$They have started asking for Robux, V Bucks or a skin, or you have a feeling the asking is about to start. No money has gone anywhere yet. This is the good moment, and it does not come again.$st$,
  $sy$Here is how game money works in our house. Once a month you get one card, this much, and it is yours to spend however you like in the game. When it is gone, it is gone until next month, and I will never top it up in between, so think about what you really want. Show me what you buy, not because I am checking, because I want to see it.$sy$,
  $nt$You are not wasting my money on fake stuff in a game. Ask me again and the game goes.$nt$,
  $wy$The money arrives before the phone. In the UK, 97 percent of 8 to 17 year olds play games online and 53 percent of them spend real money inside those games, and among children who spent last month a third say they often regret it. Under 14s mostly pay with a gift card, which makes the card the best lever a parent has ever been handed: a fixed amount, agreed in advance, that runs out.

The games will not help you. A study of the 100 highest grossing iPhone games found that not one of those selling loot boxes asked for a parent's consent before letting a child buy, despite the industry's own rule saying they should. Fortnite's maker paid $245 million for a button layout that charged children with one accidental tap. So treat the rules as absent and build your own, and build them before the first spend, while it is a plan rather than an argument.

The card does three things a lecture cannot. It makes the money real, because it is a thing in their hand with a number on it. It teaches running out, which is the whole of budgeting. And it takes you out of the role of the person who says no every time, which is the role that makes children hide the next purchase.$wy$,
  $tn$Tonight, turn off one tap purchase on every device they use and put a password on the store that they do not know. Then decide the monthly amount together and say when the first card is coming.$tn$,
  $ip$If they say everyone has more, ask what the last thing their friend bought actually cost in pounds. Most children do not know. Then say the amount is the amount, and it is theirs, which is more than most of their friends have.$ip$,
  $cb$After the first card runs out, ask what they bought and whether it was worth it a week later. That conversation is the lesson; the card is just the way in.$cb$,
  $fy$Games are made by people whose job is to get you to spend, and they are very good at it. Your card is real money that is really yours. Spending it slowly is a skill most grown ups never learn.$fy$,
  'none', true, 9651
where not exists (select 1 from public.scripts where title = 'The first gift card, before the first spend');

-- ── 3. builder, school and AI, 8 to 10 ──────────────────────────────────────

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'builder', 'school-and-ai',
  'Ask the AI together, hints not answers',
  $st$They have discovered that a chatbot will do the homework, or you have a feeling they are about to. Either way, they are meeting AI on their own, and you would rather be in the room.$st$,
  $sy$Show me how you ask it. Let us try it together. Here is our rule: it is allowed to explain and to quiz you, and it is not allowed to give you the answer. Ask it "how would I work this out" rather than "what is the answer". And then we check what it says, because it gets things wrong and sounds sure when it does.$sy$,
  $nt$You are cheating. No AI in this house.$nt$,
  $wy$AI arrives well before the phone. In the US, 81 percent of 9 to 12 year olds already use some form of AI, and in the UK over half of 8 to 17s have. The child is learning it either way; the only question is whether a parent is beside them for the first lessons.

The rule comes from a randomised trial with nearly a thousand secondary pupils. A chatbot that gave answers lifted their practice scores and then left them 17 percent worse on the exam once it was taken away. A version that gave only hints lifted practice by 127 percent and largely avoided the harm. Answers replace thinking; hints scaffold it. The rule "explain and quiz, never answer" is that trial in one sentence a nine year old can hold.

The checking habit matters as much. Ofcom found teenagers confident they could spot AI content, and a quarter of the confident ones failed when tested. A child who learns at nine that the chatbot can be wrong, because they caught it being wrong with you, has the one defence that will still work at fifteen. This is the Sesame Street finding in a new coat: the screen plus a grown up saying something about it beats the screen alone, every time.$wy$,
  $tn$Tonight, ask it one homework question together the wrong way and the right way, and watch the difference. Then ask it something you both know the answer to, and see whether it gets it right.$tn$,
  $ip$If they say it is faster to just get the answer, agree that it is, and ask what happens in the test when it is not there. Then let them choose one question to do with hints only, and one to do without any help at all.$ip$,
  $cb$In a fortnight, ask what they asked it this week, the way you would ask about a lesson. If they tell you about a time it was wrong, the habit has taken.$cb$,
  $fy$AI is a brilliant helper and a terrible cheat. Ask it to explain, ask it to test you, and never let it do the thinking for you, because the thinking is the bit that makes you clever. And check it. It is wrong more often than it sounds.$fy$,
  'none', true, 9652
where not exists (select 1 from public.scripts where title = 'Ask the AI together, hints not answers');

-- ── 4. builder, family rules, 8 to 10 ───────────────────────────────────────

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'builder', 'family-rules',
  'The Year 6 phone plan, before the box is opened',
  $st$Year 6 has started, or is about to, and the phone question is in the air. Half their class already has one. You can feel the negotiation coming and you would rather it were a plan.$st$,
  $sy$You are probably getting a phone before secondary school, and I want us to plan it together now rather than fight about it in October. So let us decide three things while it is easy. Where it sleeps at night, which is not your bedroom. What it is for to start with. And a promise from me: if you ever show me something bad on it, the phone stays yours. Telling me never costs you the phone.$sy$,
  $nt$We will see. Stop asking. If you keep going on about it you will not get one at all.$nt$,
  $wy$The first phone lands with the move to secondary school. In the UK, ownership jumps from 56 percent of ten year olds to 83 percent of eleven year olds, and Ofcom calls starting senior school the tipping point. A parent who plans in Year 6 is planning in the one year when the phone is still an idea rather than an object, and every decision is easier before the box is opened.

Three decisions carry almost all the evidence. Where it charges, because a device in the bedroom overnight, even switched off, costs sleep across 125,000 children, and the first phone shows up in sleep before it shows up anywhere else. What it is for, because a phone that starts narrow can widen, and one that starts wide cannot be narrowed without a war. And the no confiscation promise, because the Children's Commissioner found many children would not turn to their family first when something goes wrong online, and the reason is that telling has cost them the phone before.

Saying all three now, out loud, in the child's hearing, does something a rule imposed in October cannot: it makes the child a co author of the plan, and children keep plans they helped write.$wy$,
  $tn$Tonight, ask them where they think the phone should charge at night and why. Whatever they say, you have started the plan, and you have not said no.$tn$,
  $ip$If they say everyone already has one, that is nearly true and it is not the argument. Say "which is why we are planning yours properly, so it goes well." The plan is the yes; the fight was the no.$ip$,
  $cb$When the phone actually arrives, go back to the three decisions before anything is set up. The charging spot goes in first, before the first app.$cb$,
  $fy$You are probably getting a phone soon, and your grown up wants to plan it with you instead of arguing about it. Three things to decide together: where it sleeps, what it is for, and the promise that telling them about something bad never costs you the phone.$fy$,
  'none', true, 9653
where not exists (select 1 from public.scripts where title = 'The Year 6 phone plan, before the box is opened');

-- ── 5. explorer, staying safe, 11 to 12 ─────────────────────────────────────

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'explorer', 'staying-safe',
  'The no confiscation promise, said out loud',
  $st$The phone is here, or nearly. You want them to tell you when something goes wrong on it, and you have a quiet fear that they will not. You are right to have it, and there is one sentence that changes it.$st$,
  $sy$I need you to hear this properly. If you ever see something on your phone that scares you, or someone sends you something horrible, or you get into something you cannot get out of, you come and show me, and the phone stays yours. I will not take it off you for telling me. Telling me is the thing that keeps it.$sy$,
  $nt$If I find anything dodgy on that phone it is gone, and you will not be getting it back.$nt$,
  $wy$Children go quiet when telling costs them the phone. The Children's Commissioner for England found many children would not turn to their family first when something went wrong online, and urged parents to let children talk about what they saw without simply confiscating the device. In the government's national consultation of over 116,000 people, children asked for feature fixes rather than an age wall: explicit images, stranger contact, livestreaming. They want protecting from the platforms. What they are guarding against is losing the phone.

The promise works because it removes the only reason a child has to hide. A twelve year old who sees something frightening is already frightened; the question in their head is not "is this bad" but "what happens to me if I say." If the answer is "the phone goes," the calculation is made in a second, and it is made against you. If the answer is "the phone stays," you become the first call rather than the last resort.

It has to be said before it is needed, out loud, in plain words, and then kept the first time it is tested, because the first time is the only time that counts. A child who tells you once and keeps the phone will tell you for the rest of their childhood.$wy$,
  $tn$Tonight, say the promise in those words, and then ask them to tell you one thing they have seen online that they were not sure about. Whatever they say, thank them and change nothing.$tn$,
  $ip$If they say "you would still be angry," say "I might be upset about the thing, and I will never be angry at you for showing me." The distinction is the whole promise, and children understand it faster than adults expect.$ip$,
  $cb$The first time they show you something, notice what you do with your face and your hands before you notice what you say. If the phone stayed in their hand, you kept the promise.$cb$,
  $fy$Your grown up has promised that showing them something bad never costs you the phone. Hold them to it. And use it, because the sooner a grown up sees a problem, the smaller it is.$fy$,
  'none', true, 9654
where not exists (select 1 from public.scripts where title = 'The no confiscation promise, said out loud');

-- ── 6. explorer, everyday routines, 11 to 12 ────────────────────────────────

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'explorer', 'everyday-routines',
  'Your own phone, one protected slot a day',
  $st$You have asked them to put the phone down at tea and they have looked at yours, on the table, face up, buzzing. You know they are right. You are also exhausted, and the phone is the one thing that is yours.$st$,
  $sy$You are right, and I am not going to pretend you are not. From tonight my phone goes in the same place as yours at tea. Not because I am perfect at this, because I am not, but because the rule is for the house, not for you. If you catch me with it, you can say so.$sy$,
  $nt$That is different, I am an adult, I have things I need to deal with. Do as you are told.$nt$,
  $wy$The parent's phone is inside the loop. Among 1,453 US teenagers, 46 percent said a parent is at least sometimes distracted by their phone when the teen is trying to talk, while only 31 percent of parents said it happens regularly. Children notice the gap. And the research on younger children found the loop runs both ways: a hard day pushes a parent onto the phone, and the phone during time together predicts a harder child later, with the parent's stress sitting in the middle.

The point of one slot is that it is possible. Nobody exhausted can do a phone free evening, and a rule you cannot keep teaches your child that rules are for saying, not doing. One slot, tea or bath or the first ten minutes after school, kept every day, is a rule you can keep in front of them, and a rule the parent visibly keeps is the only kind children call fair. The one randomised trial that improved children's mental health cut screens for the whole household, parents included, not for the child alone.

Letting them call you on it is not weakness. It hands them the same standard you are asking of them, and a twelve year old who is allowed to say "phone" to a parent is a twelve year old who has been told, in the clearest way there is, that the rule is real.$wy$,
  $tn$Tonight, put your phone where theirs goes before you sit down, and say that you have. Then leave it there through the whole meal, including the buzz you are sure is important.$tn$,
  $ip$If they say "you are on yours all the time," do not defend it. Say "I probably am, and I am starting with tea." The admission is the credibility; the argument would have spent it.$ip$,
  $cb$In a week, ask them whether they have noticed. If they say you lasted three days, that is honest data, and you start again on day four.$cb$,
  $fy$Your grown up is putting their phone away at tea too, and you are allowed to say "phone" if you catch them. Rules for the whole house are the fair ones.$fy$,
  'none', true, 9655
where not exists (select 1 from public.scripts where title = 'Your own phone, one protected slot a day');
