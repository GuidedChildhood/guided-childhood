-- Guided Childhood, Migration 407
-- Where the phone sleeps at explorer, the mood script rewritten around the
-- named app moment, and the bedroom sleep evidence tagged so DiGi finds it.
-- (Justin, 26 November 2026, the week's top three builds.)
-- Plan: plans/2026-11-26-explorer-phone-placement-plan.md
--
-- 1. NEW SCRIPT, explorer: "Where the phone sleeps tonight".
--    Parents of 11 to 13 year olds are deciding overnight placement for the
--    first time and the placement scripts only existed at builder (216, 9640)
--    and shaper (9622, 417). A calibrated pathway, not a yes or no rule: a
--    shared landing spot, a charging ritual that includes the parent, a two
--    week trial with a review, and the answers she actually gives.
--
--    The Mumsnet read (plans/2026-11-24-mumsnet-replies-weighed.md) was that
--    "phones out of bedrooms" is obvious and that an app telling parents so
--    sounds like it is replacing basic parenting. Justin: address that it
--    seems obvious, that this is not about parents being bad, and lead with
--    the pathway's why. So the why opens by saying the parent knew the answer
--    already, and the script is about the part nobody else helps with: her
--    agreeing to it and it still holding once her friends are messaging at
--    ten. The do not disturb answer and the child's own reason as a blank
--    match the builder script made bulletproof in migration 405.
--
-- 2. REWRITE, explorer 601 "Mood drops after phone use".
--    A parent named Instagram and asked for tonight's words. It now opens
--    with a same evening line about the moment the parent actually saw,
--    names Instagram, TikTok, Snapchat and YouTube in the situation so it
--    matches how parents search, and its tonight line names the Instagram
--    guide, which the script page turns into a link to that guide on the
--    devices page (lib/scripts/guide-links.ts). Title and category are
--    unchanged. The depth fields, empty until now, are filled.
--
-- 3. EVIDENCE, the bedroom rows tagged for the overnight question.
--    Carter et al, JAMA Pediatrics 2016 (two rows) and Mireku et al,
--    Environment International 2019 were tagged morning, routines and
--    stage_arrival, so a parent asking where the phone sleeps found them only
--    by luck. Each gains phone, bedtime and new_phone, and 11-13 is confirmed
--    on every row. The second Carter row's finding is restated with the
--    paper's own figures for access without use (OR 1.79 inadequate sleep,
--    1.53 poor quality, 2.27 daytime sleepiness, 20 studies, 125,198 children
--    aged 6 to 19), replacing a "highest value house rule" line the paper
--    does not support. Associations are written as associations.
--
-- Idempotent: the insert is guarded by title and stage, the updates set the
-- same text twice, and the tag merge removes duplicates.

-- ── 1. Where the phone sleeps tonight ───────────────────────────────────────
insert into public.scripts
  (stage_id, title, situation, say_this, not_this, why_it_works, tonight,
   if_they_push_back, check_back, for_your_child,
   law_flag, is_free, sort_order, category, only_on_signal, starter_set)
select
  'explorer',
  'Where the phone sleeps tonight',
  $si$She has a phone now and where it goes at night has become a real question. You already know the answer everyone gives. The hard part is getting her to agree, and keeping it going once her friends are messaging at ten.$si$,
  $sy$I want to sort out where our phones sleep, and I want to decide it with you. My idea is they all charge in the kitchen overnight. Mine too. You have got [her thing tomorrow, like the match or the test], and you sleep better without it next to you. You choose the spot and the time, we try it for two weeks, then we look at it together. What would make that work for you?$sy$,
  $nt$"Phones out of bedrooms, that is the rule."

"I do not trust you with it at night."$nt$,
  $wy$You probably knew the answer before you opened this, and nothing here says you have been doing it wrong. The hard part is her agreeing to it. At eleven or twelve her friendships are starting to run late into the evening, so a rule handed down feels like being cut out of them, and a rule she feels cut out by is one she works around. A plan she helped make, that covers your phone too, is one she can keep, and it keeps the talk on sleep and fairness.

Where the phone sleeps is the part that counts. In 6,616 London pupils aged 11 to 12, using a phone in the hour before sleep was linked to higher odds of too little sleep, and higher again in the dark. A review of 20 studies found a phone simply being in the bedroom, even unused, was linked to shorter and poorer sleep. These studies find a link and cannot prove cause on their own, but they all point the same way, and the kitchen charger is the one move that answers both.$wy$,
  $tn$Choose the landing spot together tonight: somewhere outside every bedroom, with a charger for each phone, yours included. Agree the time phones go there, ideally half an hour before lights out, and put yours down first so she sees it. If the phone has been sleeping in her room until now, start with the time this week and add the landing spot next week. If it is her alarm, a cheap clock fixes that by tomorrow.$tn$,
  $ip$If she says "everyone else has theirs": "Maybe some do. This is two weeks, and then we decide together. If it is costing you something real with your friends, tell me and we will sort that part."

If she says "I will put it on do not disturb": "Good idea in the day. At night it is still next to you, and sleep is worse with it there even on silent. Kitchen it is, mine too."

If she says "you just do not trust me": "I do trust you. This is about sleep, which is why mine goes there too."$ip$,
  $cb$After two weeks, sit down with her. What has been easier, what has been annoying, does the time need to move? Keep the landing spot and change the rest with her. If late messages are the real pull, agree what she tells her friends, for example "my phone goes down at half nine", so going quiet is a plan her friends already know about.$cb$,
  $fy$We are trying something for two weeks. All our phones, mine too, sleep in the kitchen at night. You help choose where and when, and after two weeks we decide together whether to keep it.$fy$,
  'none', false,
  (select coalesce(max(sort_order), 0) + 1 from public.scripts),
  'screen-time', false, false
where not exists (
  select 1 from public.scripts
  where stage_id = 'explorer' and title = 'Where the phone sleeps tonight'
);

-- ── 2. Mood drops after phone use, rewritten ───────────────────────────────
update public.scripts
set situation = $si$She comes off Instagram, TikTok, Snapchat or YouTube in a worse mood than when she picked it up, and you want something to say this evening.$si$,
    say_this = $sy$You came off Instagram earlier and seemed a bit flat. I am not after your phone. I just wondered what you were looking at, because some of it gets to me too.$sy$,
    not_this = $nt$"That app is making you miserable, I am deleting it."

"Why do you even look at it if it upsets you?"$nt$,
    why_it_works = $wy$Naming the moment you actually saw, tonight, keeps it about her evening. Saying it gets to you too takes the shame out of it. A dip after scrolling is common, and it is usually one thing: a comparison, a photo of something she was not invited to, a comment. She can only tell you which if she is not worried about losing the phone for saying so. Once you know what it was, the settings can help with the rest.$wy$,
    tonight = $tn$Say it this evening, within an hour or so of noticing, side by side, in the car or while cooking. If she tells you what it was, listen before you fix anything. Later in the week, sit down together with the Instagram guide in Devices to tidy her feed and check the Teen Account settings, such as sleep mode, hidden words and the sensitive content setting.$tn$,
    if_they_push_back = $ip$If she says "I am fine": "OK. I noticed, that is all, and the door is open." Then leave it, and try another evening with a different moment you saw.

If she says "it is not the app": believe her first and ask what it was. Sometimes the phone is just where the bad news arrived.$ip$,
    check_back = $cb$Over the next week, notice whether the dip follows one app more than the others, or one time of day. If it keeps coming back, ask her what she would change: unfollow, mute, or a set time off. Her fix is more likely to stick than yours.$cb$,
    for_your_child = $fy$Sometimes I come off my phone feeling worse and I do not always know why. If that happens to you, you can tell me, and telling me does not mean I take it away.$fy$
where stage_id = 'explorer' and title = 'Mood drops after phone use';

-- ── 3. The bedroom evidence, tagged for the overnight question ──────────────
update public.expert_knowledge
set topics = (select array(select distinct unnest(topics || array['phone', 'bedtime', 'new_phone', 'sleep']::text[]))),
    age_bands = (select array(select distinct unnest(age_bands || array['11-13']::text[])))
where source_name like 'Carter et al, JAMA Pediatrics 2016%'
   or source_name = 'JAMA Pediatrics meta analysis (Carter et al)'
   or source_name like 'Mireku et al, Environment International 2019%';

update public.expert_knowledge
set source_name = 'Carter et al, JAMA Pediatrics 2016 (device in the bedroom, unused)',
    finding = $fd$Across 20 studies and 125,198 children aged 6 to 19, having a portable device in the bedroom at night, even without using it, was associated with higher odds of inadequate sleep (OR 1.79), poor sleep quality (OR 1.53) and daytime sleepiness (OR 2.27). Using it at bedtime raised the odds further. It is an association, and it is why the overnight landing spot outside the bedroom matters, and why it helps for the parent's phone to sleep there too.$fd$
where source_name = 'JAMA Pediatrics meta analysis (Carter et al)'
   or source_name = 'Carter et al, JAMA Pediatrics 2016 (device in the bedroom, unused)';
