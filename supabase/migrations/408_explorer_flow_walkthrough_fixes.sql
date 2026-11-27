-- Guided Childhood, Migration 408
-- The fixes from the expert flow walkthrough of migration 407 (Justin, 27
-- November 2026: "yes" to all five).
-- Plan: plans/2026-11-27-explorer-flow-fixes-plan.md
--
-- 1. "Where the phone sleeps tonight" (explorer).
--    The acknowledgement Justin asked for after Mumsnet ("you already know
--    this, and you are not doing it wrong") sat in the why, which is folded
--    on a phone, and in the third sentence of the situation, which is clamped
--    to two lines. It now leads the situation, with the words a parent
--    actually types (first phone, bedroom), which is also what lets DiGi and
--    the library search find it. And the script said "you choose the spot"
--    while naming the kitchen three times; every mention now says the spot
--    outside the bedrooms that you chose together.
--
-- 2. "Mood drops after phone use" (explorer 601).
--    It asked "what you were looking at", which the starter script "Mood
--    change after phone use" (explorer 8) lists as the thing not to say. They
--    are different moments, a flat evening and a tearful shut down, so 601
--    now asks how she is rather than what she saw, and points to the other
--    script for the tearful one. The situation names "came off" and "down",
--    the words parents use, and the tonight line now promises only what the
--    Instagram guide covers (step 3 below).
--
-- 3. The Instagram device guide.
--    601 sends parents here for sleep mode, hidden words and tidying the feed,
--    and the guide had none of them. Three steps added, in Instagram's own
--    names for each setting, and last_reviewed_at moved.
--
-- Titles are unchanged, so every proof list that names these scripts by title
-- (lib/content/device-issues.ts) still lands. Idempotent: plain sets.

-- ── 1. Where the phone sleeps tonight ───────────────────────────────────────
update public.scripts
set situation = $si$Her first phone, and you already know the bedroom answer. You are not doing it wrong. The hard part is her agreeing to it, and it holding once her friends are messaging at ten.$si$,
    say_this = $sy$I want to sort out where our phones sleep, and I want to decide it with you. My idea is they all charge somewhere outside our bedrooms overnight, like the kitchen or the landing. Mine too. You have got [her thing tomorrow, like the match or the test], and you sleep better without it next to you. You choose the spot and the time, we try it for two weeks, then we look at it together. What would make that work for you?$sy$,
    why_it_works = $wy$You probably knew the answer before you opened this, and nothing here says you have been doing it wrong. The hard part is her agreeing to it. At eleven or twelve her friendships are starting to run late into the evening, so a rule handed down feels like being cut out of them, and a rule she feels cut out by is one she works around. A plan she helped make, that covers your phone too, is one she can keep, and it keeps the talk on sleep and fairness.

Where the phone sleeps is the part that counts. In 6,616 London pupils aged 11 to 12, using a phone in the hour before sleep was linked to higher odds of too little sleep, and higher again in the dark. A review of 20 studies found a phone simply being in the bedroom, even unused, was linked to shorter and poorer sleep. These studies find a link and cannot prove cause on their own, but they all point the same way, and a shared charging spot outside the bedrooms is the one move that answers both.$wy$,
    if_they_push_back = $ip$If she says "everyone else has theirs": "Maybe some do. This is two weeks, and then we decide together. If it is costing you something real with your friends, tell me and we will sort that part."

If she says "I will put it on do not disturb": "Good idea in the day. At night it is still next to you, and sleep is worse with it there even on silent. It goes in the spot we chose, and mine goes there too."

If she says "you just do not trust me": "I do trust you. This is about sleep, which is why mine goes there too."$ip$,
    for_your_child = $fy$We are trying something for two weeks. All our phones, mine too, sleep outside our bedrooms at night. You help choose where and when, and after two weeks we decide together whether to keep it.$fy$
where stage_id = 'explorer' and title = 'Where the phone sleeps tonight';

-- ── 2. Mood drops after phone use ───────────────────────────────────────────
update public.scripts
set situation = $si$She came off Instagram, TikTok, Snapchat or YouTube and seems down, worse than when she picked it up, and you want something to say this evening.$si$,
    say_this = $sy$You came off Instagram earlier and seemed a bit flat. I am not after your phone. Some of what I scroll gets to me too, so if something got to you, I would like to hear it.$sy$,
    why_it_works = $wy$Naming the moment you actually saw, tonight, keeps it about her evening. Saying it gets to you too takes the shame out of it, and asking how she is leaves her in charge of how much she tells you. A dip after scrolling is common, and it is usually one thing: a comparison, a photo of something she was not invited to, a comment. She will only tell you which if she is not worried about losing the phone for saying so. Once you know, the settings can help with the rest.$wy$,
    tonight = $tn$Say it this evening, within an hour or so of noticing, side by side, in the car or while cooking. If she tells you what it was, listen before you fix anything. Later in the week, sit down together with the Instagram guide in Devices to turn on hidden words, check sleep mode, and tidy her feed with Not interested and mute.$tn$,
    if_they_push_back = $ip$If she says "I am fine": "OK. I noticed, that is all, and the door is open." Then leave it, and try another evening with a different moment you saw.

If she says "it is not the app": believe her first and ask how she is. Sometimes the phone is just where the bad news arrived.

If she is tearful and will not talk at all, that is a different evening. Use "Mood change after phone use": leave the door open and do not ask.$ip$
where stage_id = 'explorer' and title = 'Mood drops after phone use';

-- ── 3. The Instagram guide ──────────────────────────────────────────────────
update public.device_guides
set steps = $st$[
  "**Confirm they have a Teen Account.** These are private by default with restricted messaging.",
  "**Set up Supervision** (Settings, then Supervision) to set daily limits and see new followers.",
  "**Set the account to private** and limit messaging to people they follow.",
  "**Turn on Restricted or Sensitive Content controls** to reduce mature content in Explore.",
  "**Check Sleep mode is on.** Teen Accounts mute notifications overnight, from 10pm to 7am, and send an auto reply to messages.",
  "**Check Hidden Words is on** (Settings, then Hidden Words) so offensive comments and message requests are filtered out.",
  "**Tidy the feed together.** Tap Not interested on posts that leave her feeling worse, mute or unfollow the accounts behind them, and use Reset suggested content (Settings, then Content preferences) for a fresh start.",
  "**Set a daily time limit and a break reminder.**"
]$st$::jsonb,
    last_reviewed_at = now()
where device_key = 'instagram';
