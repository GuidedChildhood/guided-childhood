-- Guided Childhood — Migration 298
--
-- Part one: the parent's evening reminder time.
--
-- Justin, 13 September 2026: a Duolingo grade habit for parents. The 21:00
-- push went to everyone at the same minute whatever their day looked like.
-- The cron now reminds each parent at THEIR time, only when today is not
-- done: a time they pick here, or, when this is null, an hour after when
-- they usually finish (learned from daily_sessions.completed_at, see
-- lib/push/evening.ts), or 21:00 when we know nothing yet.
--
-- Minutes from midnight, UK wall clock, evening only. Null means learn it.

alter table public.profiles
  add column if not exists reminder_minutes int
  check (reminder_minutes is null or (reminder_minutes between 1020 and 1320 and reminder_minutes % 30 = 0));

comment on column public.profiles.reminder_minutes is
  'Evening reminder time in minutes from midnight UK (17:00 to 22:00, half hours). Null learns it from when the parent usually finishes.';

-- Part two: four scripts for the gaps the two sweeps named.
--
-- The ten problems briefing (9 September 2026) and the by age sweep
-- (13 September 2026) found four problems parents raise often that had no
-- script: boredom at the moment it happens (4 to 7), the visible ending for a
-- child with ADHD or autism (8 to 10), a parent who is physically frightened
-- when a phone is taken (11 to 13), and the pornography conversation (13 to
-- 15). Every one is named in lib/content/device-issues.ts as the proof path
-- for its issue, and scripts/check-device-issues.mjs fails if a title here
-- drifts from the bank. No script ends in a confiscation; every one gives the
-- child something to be competent at. The evidence at its own strength:
-- Tam and Inzlicht 2024 (switching to escape boredom increases it, seven
-- experiments, 1,223 people); Dettmer 2000 (visual timers cut transition
-- problems for autistic children against verbal warnings); the Mumsnet
-- corpus of 9 September (three threads describing a frightened parent, and
-- the prospective cohort where screens as leverage predicted more use);
-- the Children's Commissioner 2023 (average first exposure thirteen,
-- 27 percent by eleven).

-- ── 1. foundation, screen time, 4 to 7 ──────────────────────────────────────

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'foundation', 'screen-time',
  'Bored is where it starts',
  $st$The tablet went off ten minutes ago and they have followed you round the kitchen saying they are bored, and you are one whine from handing it back so you can get anything done.$st$,
  $sy$Bored is fine. Bored is the bit before you think of something. I am going to be in here for twenty minutes, and you are going to be bored for about three of them, and then something will happen. Your chart is on the fridge if your brain wants a hint.$sy$,
  $nt$Fine, have it back, but only ten minutes. Or: I am not your entertainment, go and find something to do.$nt$,
  $wy$Boredom is not the problem, it is the doorway, and the screen is what stops a child walking through it. Seven experiments with more than a thousand people found that skipping and switching to escape boredom made people more bored and less satisfied, not less. A child who is handed the tablet at the first whine learns that bored is unbearable, and the next whine comes sooner.

The three minutes are real. Almost every child who is left with nothing, kindly and calmly, finds something within a few minutes, and the finding is the skill. What breaks it is the parent filling the gap, with a screen or with themselves. So the move is to name the boredom out loud as ordinary, put a time on your own unavailability so it is not a rejection, and leave a hint in the room: the paper chart they made, a box, a window.

This is the first version of a rule that follows them to sixteen: the thing after the screen is theirs to find. A child who can be bored at five can be alone with their thoughts at fifteen.$wy$,
  $tn$Tonight, before any screen, make the chart together: six things they can do on their own, drawn by them, stuck on the fridge. Tomorrow when the whine comes, point at it and say nothing else.$tn$,
  $ip$If the whining climbs, do not negotiate and do not lecture. Say "I know, bored is horrible for a bit," and carry on with what you were doing. The second week is easier than the first.$ip$,
  $cb$In a week, notice how long the gap is between the screen going off and them finding something. If it has gone from twenty minutes of following you to five, it has worked.$cb$,
  $fy$When the screen goes off and you feel bored, that is your brain about to think of something. Your chart on the fridge is full of things you chose. Bored is the bit before the good bit.$fy$,
  'none', true, 9660
where not exists (select 1 from public.scripts where title = 'Bored is where it starts');

-- ── 2. builder, screen time, 8 to 10 ────────────────────────────────────────

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'builder', 'screen-time',
  'The visible ending, for the child who finds stopping hardest',
  $st$Every parent says stopping is hard. Yours does not stop, they come apart, and you have started to wonder whether the screen is the only thing that holds their day together. It might be. That does not make the ending impossible, it makes it something to build.$st$,
  $sy$The screen is going to stop at the end of this level, and the timer on the shelf is going to show us how long that is. When it goes green, the next thing is the trampoline, and I will come and do the first minute with you. Same every day, so your brain knows what is coming.$sy$,
  $nt$Right, off, now, I have told you three times. Or, quietly giving up: just leave them on it, it is not worth the fight.$nt$,
  $wy$For a child with ADHD or autism the screen is often doing real work: it is predictable, it is regulating, and the switch out of it is genuinely harder, not merely resisted. Parents of these children carry a guilt the whole category sells them, and it is misplaced. The screen is not the enemy. The ending that arrives from nowhere is.

The thing that helps is not a firmer voice, it is a visible ending. A timer the child can see counting down, the stopping point tied to something in the game rather than a clock time, and the next activity named before the screen goes on, so the transition is a move toward something rather than a fall off a cliff. A study of autistic children found visual timers cut problem behaviour at transitions where spoken warnings alone did not. Same every day matters more than the length of the session.

And say the honest thing out loud: for this child, the screen may be part of how they cope, and the plan is to make the ending kind, not to take the coping away.$wy$,
  $tn$Tonight, put a visual timer where they can see it, agree the stopping point as a level or an episode rather than a time, and name the next thing before you press start. Do the first minute of the next thing with them.$tn$,
  $ip$If the ending still comes apart, do not add consequences. Shorten the session next time and keep everything else identical. Predictability is the treatment; the length is the dial.$ip$,
  $cb$In a fortnight, compare the endings on the days the timer was visible with the days it was not. Keep whichever the child did better with, and tell them what you noticed.$cb$,
  $fy$Stopping is harder for some brains, and yours might be one of them. That is not naughty. Your timer shows you exactly when the end is coming, and your grown up will do the first minute of the next thing with you.$fy$,
  'none', true, 9661
where not exists (select 1 from public.scripts where title = 'The visible ending, for the child who finds stopping hardest');

-- ── 3. explorer, staying safe, 11 to 13 ─────────────────────────────────────

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'explorer', 'staying-safe',
  'When you are frightened of your own child',
  $st$You went to take the phone and they did not let go. Maybe they pushed, maybe a wall got punched, maybe you are not sure what would have happened if you had held on. You have not told anyone, because who do you tell that you are scared of a twelve year old.$st$,
  $sy$I am not going to take it out of your hand. Not now, not ever, because I am not going to fight you for a phone. We are both going to stop, and later, when we are both calm, we are going to sort out what happens next. I love you and I am going to go and make a cup of tea.$sy$,
  $nt$Give it to me NOW. Or, holding on and pulling. Or, afterwards: you are lucky I did not call the police.$nt$,
  $wy$First, the thing nobody says: some parents are physically afraid of their child in these moments, and it is more common than you would think, and it is not a failure. Three separate parents in one month described exactly this, and every one of them thought they were the only one.

Second, the mechanism. Taking a phone out of a child's hand in the heat of it is not a neutral act, it is the trigger. In a group of nearly eight thousand children followed over time, screens used as in the moment leverage, taken for bad and given for good, predicted more screen time later, not less, and more of the problem use it was meant to stop. For an eleven to sixteen year old the confiscation IS the fight.

So the move is to refuse the fight and keep the consequence. You do not grab. You say what you will not do, you name that there will be a later, and you leave the room, because a parent walking away is not losing, it is ending the part where somebody gets hurt. Later, calm, the two of you decide what changes, and it is written down, and it is not "I take the phone."

If you were hit, that is not a screen problem and you should not carry it alone. Your GP, the school, or Family Lives on 0808 800 2222 are the right calls, and making one is not betraying your child.$wy$,
  $tn$Tonight, when you are both calm, say the first sentence above out loud as a promise for next time, and mean it. Then agree one thing that changes, written down, that is not a confiscation.$tn$,
  $ip$If they say "so I can do what I want," say "no, it means we decide things when we are calm, not when we are shouting." A child who is never grabbed has nothing to fight, and a rule made calmly is one they helped make.$ip$,
  $cb$The next time it flares, notice whether you reached for the phone. If your hands stayed by your sides and you left the room, you did the whole of it.$cb$,
  $fy$Your grown up has promised never to fight you for the phone. That means the shouting part ends sooner, and the deciding part happens when everybody is calm. You can hold them to that.$fy$,
  'none', true, 9662
where not exists (select 1 from public.scripts where title = 'When you are frightened of your own child');

-- ── 4. shaper, staying safe, 13 to 15 ───────────────────────────────────────

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'shaper', 'staying-safe',
  'The pornography conversation, before and after',
  $st$You found it in the history, or a friend's parent rang, or you have simply done the maths on their age and realised the conversation you were going to have "when they are older" is already late.$st$,
  $sy$I want to talk about something that is awkward for both of us, and I would rather it was awkward than not said. Most people your age have seen porn, on purpose or by accident, and I am not going to be angry about it. What I want you to know is that it is made up, like a film, and real people do not behave like that with each other. If anything you have seen has stuck with you, you can tell me and nothing bad happens.$sy$,
  $nt$Have you been watching porn? Or, silence, and a filter switched on without a word.$nt$,
  $wy$The average age of first exposure is thirteen, and more than a quarter have seen it by eleven, usually by accident, on someone else's phone, in a group chat. So the conversation is not about whether, it is about what they make of it, and a child who has seen something confusing and has nobody to ask fills the gap with the thing itself.

Filters are worth having and they are not the answer: the research on them finds you need to filter dozens of households to prevent one exposure. What changes what a child takes from it is one adult saying, calmly, that it is fiction, that consent and kindness are the real thing, and that telling costs nothing. The no confiscation promise does more here than any setting, because the child who fears losing the phone is the child who tells no one.

Keep it short and keep the door open. The first conversation is not the whole conversation, it is permission for the rest.$wy$,
  $tn$Tonight, say the first two sentences and then stop talking. Let the silence be theirs. If they say nothing, say "that is fine, the door is open," and leave it there.$tn$,
  $ip$If they say "that is disgusting, why are you talking about this," say "because I would rather be embarrassing than absent." Then drop it, and try again in a fortnight with a lighter touch.$ip$,
  $cb$In a month, notice whether they have brought anything to you unprompted, about this or anything else online. If they have, the conversation worked, whatever they said at the time.$cb$,
  $fy$Your grown up is going to talk to you about something awkward, and they have promised not to be angry. You are allowed to say nothing. You are also allowed to ask anything, and the answer will be honest.$fy$,
  'none', true, 9663
where not exists (select 1 from public.scripts where title = 'The pornography conversation, before and after');
