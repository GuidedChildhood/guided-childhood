-- Guided Childhood — Migration 163
--
-- The other direction, and the promise that makes it usable.
--
-- The passport readiness review on 5 August 2026 found that every one of the
-- 296 rows in `scripts` runs parent to child. There is no row anywhere a child
-- can pick up to start a conversation they are frightened of starting. The
-- `for_your_child` field is filled on 21 of them, but that is a child facing
-- rendering of a parent script, not a thing a child opens on their own screen
-- at ten at night.
--
-- That gap is the one that decides whether the claim we make about 16 holds. A
-- young person who can raise the awkward thing themselves is the actual
-- outcome. Everything else is scaffolding around it.
--
-- WHY A NEW TABLE RATHER THAN A DIRECTION COLUMN ON `scripts`
--
-- Two reasons, and the second is the one that settles it.
--
-- The shape genuinely differs. A parent script carries not_this, why_it_works
-- and tonight. None of those mean anything when the child is the one speaking.
-- A child needs to know what to do if the grown up reacts badly, and who else
-- to go to if that happens, and a parent script has no field for either.
--
-- And there are roughly twenty call sites reading `scripts` today, in the
-- dashboard, DiGi, the recommender, the pathway progress calculation and the
-- cron refresh. Not one of them filters on direction, because until now there
-- was nothing to filter. Adding a column would have leaked child rows into
-- every parent list on the day it shipped, silently, and the failure would
-- have looked like a content bug rather than a schema one.
--
-- THE SECOND TABLE
--
-- `tell_a_parent_cards` is the review's item 3. One card per stage, and the
-- reason it exists as its own artefact rather than another lesson is that it
-- has to carry two halves. What to tell is scattered across the lessons
-- already. What happens when you do is nowhere at all.
--
-- That second half is not a nicety. A child weighs telling against losing the
-- device, and when nobody has said out loud what happens next, the answer a
-- child assumes is confiscation. So they say nothing, and the first anyone
-- hears of it is much later and much worse. Every card therefore carries a
-- promise, a what happens next, and an explicit never, and the parent side of
-- the app shows the parent the same words their child has been shown, so it is
-- a promise both of them have read rather than one the app made on their
-- behalf.
--
-- Supabase editor rules: idempotent creates, flat statements, seeds guarded
-- with `where not exists` so a re-run changes nothing.

create table if not exists public.child_scripts (
  id uuid primary key default gen_random_uuid(),
  stage_id text not null check (stage_id in ('foundation','builder','explorer','shaper','independent')),
  script_key text not null unique,
  title text not null,                 -- what the child taps, in their own words
  emoji text not null,
  when_to_use text not null,           -- the moment this is for
  opener text not null,                -- the first sentence, the hardest one
  say_this text not null,              -- the words themselves
  if_it_goes_wrong text not null,      -- when the grown up reacts badly, or not at all
  who_else text not null,              -- the other doors, always more than one
  -- Some things should not wait for a good moment. Drives the red flag on the
  -- card rather than a separate list, so a child sees it on the one they open.
  urgent boolean not null default false,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_child_scripts_stage
  on public.child_scripts (stage_id, sort_order);

create table if not exists public.tell_a_parent_cards (
  id uuid primary key default gen_random_uuid(),
  stage_id text not null unique check (stage_id in ('foundation','builder','explorer','shaper','independent')),
  headline text not null,
  intro text not null,
  tell_now jsonb not null,             -- ["...", ...] straight away, do not wait
  tell_soon jsonb not null,            -- ["...", ...] when there is a quiet moment
  what_happens jsonb not null,         -- [{"step":"...","detail":"..."}, ...]
  the_promise text not null,           -- the grown up speaking, in the first person
  never text not null,                 -- the thing that will not happen, said plainly
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.child_scripts enable row level security;
alter table public.tell_a_parent_cards enable row level security;

-- Read open to everyone, same as the other reference content. The child app
-- reads these through the service key with the link token scoping the request,
-- and the parent dashboard reads them as a signed in user. Neither table holds
-- anything about a particular family, so there is nothing here to scope.
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'child_scripts' and policyname = 'child_scripts_read') then
    create policy child_scripts_read on public.child_scripts for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'child_scripts' and policyname = 'child_scripts_service') then
    create policy child_scripts_service on public.child_scripts for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'tell_a_parent_cards' and policyname = 'tell_a_parent_cards_read') then
    create policy tell_a_parent_cards_read on public.tell_a_parent_cards for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'tell_a_parent_cards' and policyname = 'tell_a_parent_cards_service') then
    create policy tell_a_parent_cards_service on public.tell_a_parent_cards for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
  end if;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- FOUNDATION, ages 4 to 7
--
-- Short sentences, no clauses, and the words are ones a five year old already
-- owns. At this stage a child is not managing a situation, they are fetching
-- an adult, so every script ends with the adult arriving.
-- ════════════════════════════════════════════════════════════════════════════

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'foundation', 'foundation_scared', 'Something scared me', '😰',
  'When something on a screen gave you a funny feeling in your tummy, or made you want to look away.',
  'Can I tell you about something I saw?',
  'I saw something on the screen and it made me feel scared. I did not like it. Can you come and sit with me?',
  'If they are busy, say it again and say it is important. You are allowed to say it twice. Waiting is not your job.',
  'Any grown up who looks after you. A teacher, a grandparent, whoever is with you right now.',
  false, 10
where not exists (select 1 from public.child_scripts where script_key = 'foundation_scared');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'foundation', 'foundation_not_for_kids', 'I saw something not for kids', '🙈',
  'When a video or a picture came on that you knew straight away was not meant for you.',
  'Something came on the screen that I do not think was for kids.',
  'A video came on that was not for kids. I did not go looking for it. It just came on. Can you help me?',
  'If you are worried you will be in trouble, say the true thing anyway. It just came on. Telling is the good bit, not the bad bit.',
  'Any grown up who looks after you. If the first one is busy, go to the next one.',
  false, 20
where not exists (select 1 from public.child_scripts where script_key = 'foundation_not_for_kids');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'foundation', 'foundation_unkind_game', 'Someone was unkind in my game', '🎮',
  'When someone in a game said something that made you feel small or sad.',
  'Something happened in my game and it made me feel sad.',
  'Someone in my game said something unkind to me. It made me feel sad. I did not say anything back. Can we look at it together?',
  'If they say it is only a game, tell them how it made you feel. Your feeling is the important bit, not the game.',
  'A teacher, a grandparent, or an older brother or sister you trust.',
  false, 30
where not exists (select 1 from public.child_scripts where script_key = 'foundation_unkind_game');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'foundation', 'foundation_broke_rule', 'I did something I was not meant to', '🫣',
  'When you broke one of the screen rules and it is sitting in your tummy.',
  'I need to tell you something and I feel a bit wobbly about it.',
  'I did something on the screen I was not meant to do. I want to tell you myself before you find out. I am sorry.',
  'If they are cross at first, wait. Being cross for a minute is not the same as being cross with you. Telling first is always better than being found out.',
  'If it feels too big, ask another grown up to be there while you say it.',
  false, 40
where not exists (select 1 from public.child_scripts where script_key = 'foundation_broke_rule');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'foundation', 'foundation_stranger', 'Someone I do not know talked to me', '🚪',
  'When someone you have never met in real life sent you a message or talked to you in a game.',
  'Someone talked to me and I do not know who they are.',
  'Someone I do not know talked to me in my game. I do not know who they are. I did not answer. Can you look?',
  'Say it out loud even if they are in the middle of something. This one does not wait.',
  'Any grown up at all. This is one where the nearest grown up is the right grown up.',
  true, 50
where not exists (select 1 from public.child_scripts where script_key = 'foundation_stranger');

-- ════════════════════════════════════════════════════════════════════════════
-- BUILDER, ages 8 to 10
--
-- First real accounts, first group chats, first spending. The child can now
-- describe what happened, so the scripts start carrying detail, and the first
-- money one appears because this is the age it lands.
-- ════════════════════════════════════════════════════════════════════════════

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'builder', 'builder_stranger_dm', 'A stranger messaged me', '💬',
  'When someone you do not know in real life started a chat with you, in a game or an app.',
  'Someone messaged me and I do not know them. Can I show you?',
  'Someone I have never met messaged me in a game. They were being really friendly and asking me questions about myself. It felt a bit odd. I have not replied. Can you look at it with me?',
  'If they say just block them and move on, ask them to look at the messages first. What was said matters, not only that it happened.',
  'A teacher, or any grown up in your family. If someone asks you to keep a secret from your parents, that is exactly when you tell one.',
  true, 10
where not exists (select 1 from public.child_scripts where script_key = 'builder_stranger_dm');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'builder', 'builder_group_chat_mean', 'Someone was mean in the group chat', '😔',
  'When the group chat turned on you, or on someone else, and you have been carrying it around.',
  'Something is going on in the group chat and I do not really know what to do about it.',
  'Someone has been saying mean things about me in the group chat. Other people joined in. I did not say anything back. I do not want you to ring anyone yet, I just want to tell you what is happening.',
  'If they want to ring the school or another parent straight away, say you want to talk about it first. You are allowed to ask for a plan before an action.',
  'A teacher you like, the school pastoral lead, or Childline on 0800 1111. Childline is free and they do not have to tell anyone.',
  false, 20
where not exists (select 1 from public.child_scripts where script_key = 'builder_group_chat_mean');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'builder', 'builder_spent_money', 'I spent money I should not have', '💷',
  'When you bought something in a game, or it turned out to cost real money and you did not realise.',
  'I have done something with money and I need to tell you.',
  'I spent money in a game. I did not realise it was real money at first, and then I did it again. I am sorry. I want to help pay it back.',
  'If they are cross, let them be cross, and stay in the room. Offering to pay some of it back is the bit that shows you meant it.',
  'If it is a big amount and you are scared, ask another grown up to be with you when you say it.',
  false, 30
where not exists (select 1 from public.child_scripts where script_key = 'builder_spent_money');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'builder', 'builder_saw_something', 'I saw something I wish I had not', '🙈',
  'When something came up that you cannot stop thinking about, whether you went looking or not.',
  'I saw something online and it is still in my head.',
  'I saw something I wish I had not seen. I keep thinking about it. I do not really want to describe all of it, but I wanted you to know, because it is bothering me.',
  'If they ask a lot of questions at once, say you will answer them but you need to go slowly. You do not have to describe every part of it to be believed.',
  'Any grown up you trust, or Childline on 0800 1111 if you would rather say it to someone outside the family first.',
  false, 40
where not exists (select 1 from public.child_scripts where script_key = 'builder_saw_something');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'builder', 'builder_want_app', 'Everyone has it and I do not', '📱',
  'When you want an app or a game your friends have, and you want a real conversation rather than a row.',
  'Can we talk about an app properly, not right now if now is bad?',
  'Most of my friends have it and I feel left out of things. I know you have worries about it. Can we talk about what those are, and what I would have to show you for it to be a yes one day?',
  'If the answer is no, ask what would need to change and when you can ask again. A no with a date is a much better thing to walk away with than a no.',
  'Nobody else. This one is a family decision, and going round your parents to another adult will cost you the trust you need for the yes.',
  false, 50
where not exists (select 1 from public.child_scripts where script_key = 'builder_want_app');

-- ════════════════════════════════════════════════════════════════════════════
-- EXPLORER, ages 11 to 13
--
-- Secondary school, the first real social accounts, and the age where being
-- left out becomes the main event. The review named Explorer the weak rung, so
-- these carry a bit more weight than the stage either side.
-- ════════════════════════════════════════════════════════════════════════════

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'explorer', 'explorer_left_out', 'I am being left out on purpose', '🫥',
  'When you can see it happening, the group without you, the plans you find out about after, and it is wearing you down.',
  'Something has been going on for a while and I have not told you about it.',
  'I am being left out on purpose. There is a group chat I am not in and I keep seeing things I was not invited to. It has been going on for weeks. I did not tell you because I did not want you to make it a big thing.',
  'If the first thing they say is that you should just find new friends, say that is not what you need right now. You need them to hear how long it has been going on.',
  'A form tutor or head of year, or Childline on 0800 1111. Being frozen out is bullying even though nobody said anything.',
  false, 10
where not exists (select 1 from public.child_scripts where script_key = 'explorer_left_out');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'explorer', 'explorer_unknown_contact', 'Someone I have never met wants to talk', '🚩',
  'When someone online is being very friendly, very quickly, and something about it does not sit right.',
  'I need to show you some messages. I think something is off.',
  'Someone I have never met has been messaging me. They are being really nice, they ask a lot about me, and they said not to mention it to you. That is why I am mentioning it. Can you look?',
  'If they panic and take the phone off you, say you brought it to them yourself and you need to be able to do that again. Say it calmly, and say it later if you have to.',
  'Any adult you trust. If an adult has asked you for photos or asked to meet, this goes to a parent and to the police through CEOP. Do not sit on that one.',
  true, 20
where not exists (select 1 from public.child_scripts where script_key = 'explorer_unknown_contact');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'explorer', 'explorer_broke_rule', 'I broke a rule and I am not going to lie about it', '🫤',
  'When you went past what was agreed and you would rather say it than wait for it to surface.',
  'I want to tell you something before you find it yourself.',
  'I broke one of our rules. I was on it after the time we agreed, and I did it more than once. I am telling you because I would rather you heard it from me. I know there will be a consequence.',
  'If the consequence feels much bigger because you told them, say that out loud. Telling should cost you less than hiding, or nobody tells anything ever again.',
  'If you cannot face saying it, write it down and hand it to them. Written still counts.',
  false, 30
where not exists (select 1 from public.child_scripts where script_key = 'explorer_broke_rule');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'explorer', 'explorer_want_account', 'I want an account and I want to talk about it properly', '📲',
  'When you want a social account and you want to make the case rather than have the argument.',
  'Can we sit down about this properly, when you have got time?',
  'I want an account. I am not asking you to say yes today. I want to know what worries you about it, and what I would need to show you over the next few months for it to become a yes. I would rather do it with you than go behind you.',
  'If it is a flat no with no reason, ask for one reason and one thing that would change it. You are asking for a route, not a favour.',
  'Nobody else. Setting one up secretly is the thing that makes the next yes years further away.',
  false, 40
where not exists (select 1 from public.child_scripts where script_key = 'explorer_want_account');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'explorer', 'explorer_stuck_in_head', 'Something I saw is stuck in my head', '🌀',
  'When something you saw keeps coming back, at night, or when you are trying to do something else.',
  'Something I saw a while ago is still bothering me.',
  'I saw something a while back and it keeps coming into my head, mostly at night. I did not tell you when it happened. I do not want to go through all of it right now, I just need you to know it is there.',
  'If they ask why you did not say at the time, tell them the truth. You were not sure how they would react. That is worth them hearing.',
  'A school counsellor, your GP, or Childline on 0800 1111. Things that stick around are worth telling someone about.',
  false, 50
where not exists (select 1 from public.child_scripts where script_key = 'explorer_stuck_in_head');

-- ════════════════════════════════════════════════════════════════════════════
-- SHAPER, ages 13 to 15
--
-- The stage the lesson library is strongest on and the one with the most at
-- stake. Two of these five are marked urgent, and both are written on the
-- assumption that the young person reading them is already frightened.
-- ════════════════════════════════════════════════════════════════════════════

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'shaper', 'shaper_asked_for_photo', 'Someone asked me for a photo', '📸',
  'When someone has asked for an image of you, whether you know them or not, and whether you sent one or not.',
  'Someone has asked me for something and I want to tell you before it goes any further.',
  'Someone asked me to send a photo of myself. I have not sent anything. They keep asking and they said it is normal. I wanted to tell you now rather than after.',
  'If they go straight to taking your phone, say you came to them first and you need that to still be worth doing. Ask them to help with the situation before the device.',
  'Any adult you trust, or Childline on 0800 1111. If the person asking is an adult, this goes to the police through CEOP as well.',
  true, 10
where not exists (select 1 from public.child_scripts where script_key = 'shaper_asked_for_photo');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'shaper', 'shaper_being_threatened', 'Someone has a photo and is threatening me', '🚨',
  'When someone has an image of you and is using it to demand money, or more images, or anything at all. This is the one that does not wait until morning.',
  'I am in trouble and I need help right now.',
  'Someone has a photo of me and they are saying they will send it to everyone unless I do what they say. I am scared and I do not know what to do. I need you to help me. Please do not shout.',
  'If they get angry, keep going anyway. This one is bigger than the row. Say the words I need help and stay where they are.',
  'Tell a parent or any adult tonight, and report it. Childline is 0800 1111 and the Internet Watch Foundation can get images taken down. Do not pay, and do not send more. It never stops after the first time.',
  true, 20
where not exists (select 1 from public.child_scripts where script_key = 'shaper_being_threatened');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'shaper', 'shaper_comparing', 'I cannot stop comparing myself', '🪞',
  'When the feed is making you feel worse about how you look or who you are, and closing the app is not fixing it.',
  'Can I tell you something about how I have been feeling?',
  'I keep comparing myself to people online and it is making me feel rubbish about myself. I know most of it is not real. Knowing that does not seem to help. I did not want to say it out loud but it has been going on a while.',
  'If they say just delete the app, tell them that is not the whole answer and you would rather work out the actual thing underneath it.',
  'A school counsellor, your GP, or Childline on 0800 1111. Feeling this way for weeks is a thing worth getting help with, not a thing to wait out.',
  false, 30
where not exists (select 1 from public.child_scripts where script_key = 'shaper_comparing');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'shaper', 'shaper_worried_friend', 'A friend said something that worried me', '💛',
  'When a friend has said something about hurting themselves, and you are carrying it on your own.',
  'I need to talk to you about a friend and I think it is serious.',
  'A friend of mine said something that really worried me. It was about hurting themselves. They asked me not to tell anyone. I am telling you anyway because I do not think I should be the only one who knows.',
  'If they say it is not your business, say you cannot be the only person holding it. You are asking for help with the weight, not permission to have it.',
  'Tell a parent or a teacher today. Their safeguarding lead can act without it blowing up. Childline is 0800 1111 for you too, not only for them.',
  true, 40
where not exists (select 1 from public.child_scripts where script_key = 'shaper_worried_friend');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'shaper', 'shaper_regret_sent', 'I sent something and I regret it', '😞',
  'When you sent a message or an image you wish you could take back, and it is out of your hands now.',
  'I did something I regret and I would rather you heard it from me.',
  'I sent something I wish I had not sent. I cannot take it back. I do not know who has seen it. I am telling you because I need help sorting it out, not because I want to be told it was stupid. I already know.',
  'If the first response is anger, say you know it was a mistake and you need help with what happens next. Bring them back to the next step.',
  'Any adult you trust. If it was an image of you and you are under 18, the Internet Watch Foundation can get it taken down, and Childline on 0800 1111 will walk you through it.',
  true, 50
where not exists (select 1 from public.child_scripts where script_key = 'shaper_regret_sent');

-- ════════════════════════════════════════════════════════════════════════════
-- INDEPENDENT, ages 16 and above
--
-- The handover stage. These read adult to adult, because the outcome we are
-- claiming is a young person who still picks up the phone, not one who is
-- still being managed. The last one exists because at this age the most common
-- reason for not talking is knowing it will turn into a project.
-- ════════════════════════════════════════════════════════════════════════════

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'independent', 'independent_cannot_get_out', 'I am in something I cannot get out of', '🕸️',
  'When something online has gone further than you meant it to and you cannot see a way back on your own.',
  'I need to talk to you about something and I need you to hear all of it first.',
  'I have got into something I cannot get out of on my own. It has been building for a while. I am not asking you to fix it, I am asking you to help me work out the next step. Can you let me get through it before you react?',
  'If they interrupt, ask again for the whole thing first. Setting that up at the start is what makes it possible to say the rest.',
  'Any adult you trust. At 16 and over you can also go straight to your GP, the police, or a charity yourself, and telling a parent afterwards still counts as telling.',
  false, 10
where not exists (select 1 from public.child_scripts where script_key = 'independent_cannot_get_out');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'independent', 'independent_scammed', 'I think I have been scammed', '🎣',
  'When money has gone, or your account is not yours any more, and the first instinct is to say nothing.',
  'I have been caught out by something and I need a hand with it.',
  'I think I have been scammed. I have lost money and I feel like an idiot about it. I know what I should have spotted. I need help working out who to report it to and how to stop it going further.',
  'If the reaction is how could you fall for that, say these are built by people who do this professionally. Then get back to the practical bit.',
  'Your bank first, then Action Fraud. Both take this seriously and neither will make you feel stupid.',
  false, 20
where not exists (select 1 from public.child_scripts where script_key = 'independent_scammed');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'independent', 'independent_meeting_someone', 'I am meeting someone I met online', '📍',
  'When you have decided to meet someone in person and you want somebody to know where you are.',
  'I am meeting someone and I want you to know the details.',
  'I am meeting someone I met online. I have decided to go. I am telling you where, when, and what time I will message you. I am not asking permission, I am making sure somebody knows.',
  'If they try to stop you outright, offer the safety part instead. Somewhere public, a check in time, and a share of your location beats going without anyone knowing.',
  'A friend as well as a parent. Two people knowing where you are is better than one.',
  false, 30
where not exists (select 1 from public.child_scripts where script_key = 'independent_meeting_someone');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'independent', 'independent_not_okay', 'I am not okay', '🌧️',
  'When it has stopped being a bad week and started being how things are.',
  'I need to tell you that I am not doing very well.',
  'I am not okay. It is not one thing that happened, it has been building for a while. I am telling you because I do not want to keep managing it on my own. I do not need you to have an answer, I need you to know.',
  'If they try to fix it immediately, tell them what you actually want from them. Sometimes that is a GP appointment and sometimes it is a cup of tea and no advice.',
  'Your GP will take this seriously. Samaritans are on 116 123, free, any hour. If you are in danger right now, 999.',
  true, 40
where not exists (select 1 from public.child_scripts where script_key = 'independent_not_okay');

insert into public.child_scripts (stage_id, script_key, title, emoji, when_to_use, opener, say_this, if_it_goes_wrong, who_else, urgent, sort_order)
select 'independent', 'independent_just_listen', 'I need you to listen, not fix it', '👂',
  'When you want to tell them something but you already know it will turn into a plan, and that is why you have not.',
  'Can I tell you about something without it turning into a project?',
  'I want to tell you what is going on, but I need you to just listen. No plan, no ringing anyone, no solutions unless I ask for one. If you can do that, I will tell you a lot more, a lot more often.',
  'If they start fixing anyway, say the word listen and stop talking for a second. Most people catch it the second time.',
  'Anyone who is good at this. It is a real skill and not everyone who loves you has it.',
  false, 50
where not exists (select 1 from public.child_scripts where script_key = 'independent_just_listen');

-- ════════════════════════════════════════════════════════════════════════════
-- THE TELLING CARDS, one per stage
--
-- Both halves in every row. What to tell, and what happens when you do.
-- ════════════════════════════════════════════════════════════════════════════

insert into public.tell_a_parent_cards (stage_id, headline, intro, tell_now, tell_soon, what_happens, the_promise, never, sort_order)
select 'foundation', 'Come and tell me', 'There is nothing on a screen you can see that you cannot come and tell me about. Nothing.',
  $j$["Someone you do not know talked to you","Something scared you or made your tummy feel funny","Something came on that was not for kids","Someone asked you to keep a secret from me"]$j$::jsonb,
  $j$["Someone was unkind in a game","You broke one of our screen rules","Something made you feel sad and you are not sure why"]$j$::jsonb,
  $j$[{"step":"I will sit down with you","detail":"Not standing up, not from the other room. I will come and sit with you."},{"step":"I will not be cross with you for telling","detail":"I might be cross about what happened. That is different, and it is never at you."},{"step":"We will sort it out together","detail":"You will not have to do any of the sorting on your own."}]$j$::jsonb,
  'If you tell me something, the first thing that happens is a cuddle, not a telling off.',
  'You will not lose the tablet just for telling me something. That is not how this works.',
  10
where not exists (select 1 from public.tell_a_parent_cards where stage_id = 'foundation');

insert into public.tell_a_parent_cards (stage_id, headline, intro, tell_now, tell_soon, what_happens, the_promise, never, sort_order)
select 'builder', 'What to tell me, and what I will do', 'You are online more on your own now, so here is the deal, written down, so you never have to guess how I will react.',
  $j$["Anyone you do not know messaging you","Anyone asking you to keep something from me","Money that has come out of an account","Anything that frightened you"]$j$::jsonb,
  $j$["Something unkind in a group chat","Something you saw that you cannot stop thinking about","A rule you broke","Something you want that I have said no to before"]$j$::jsonb,
  $j$[{"step":"I will listen to the whole thing first","detail":"No questions until you have finished. You get to tell it your way."},{"step":"We will decide together what happens next","detail":"I will tell you what I am going to do before I do it. No surprise phone calls to other parents."},{"step":"The consequence is for what happened, not for telling","detail":"Telling me makes it smaller every time. It has never once made it bigger."}]$j$::jsonb,
  'I would rather hear it from you badly than find it out later neatly.',
  'I will not take your device off you as the first thing I do. If something has to change we will talk about it first.',
  20
where not exists (select 1 from public.tell_a_parent_cards where stage_id = 'builder');

insert into public.tell_a_parent_cards (stage_id, headline, intro, tell_now, tell_soon, what_happens, the_promise, never, sort_order)
select 'explorer', 'The deal on telling me', 'You are old enough now to handle a lot of this yourself. Some of it you should not have to. This is where the line is.',
  $j$["An adult you do not know contacting you","Anyone asking for photos of you","Anyone threatening you about anything","A friend who has said something about hurting themselves"]$j$::jsonb,
  $j$["Being left out or picked on, even if it has been going on a while","Something you saw that is sticking with you","A rule you have broken","Something you want, that you would rather ask about than go round"]$j$::jsonb,
  $j$[{"step":"I hear it all before I say anything","detail":"You will not get cut off halfway through with a question."},{"step":"Nothing happens without you knowing first","detail":"I will not ring the school or another parent before I have told you I am going to."},{"step":"We work out the next step together","detail":"You get a say in what happens, even when it is serious."},{"step":"Coming to me always costs you less","detail":"That is the whole arrangement. If telling me ever costs you more than hiding, tell me that too."}]$j$::jsonb,
  'You will never be in more trouble for telling me than for hiding it. I will hold to that even when it is hard for me.',
  'I will not read your messages behind your back as a reaction to you being honest with me.',
  30
where not exists (select 1 from public.tell_a_parent_cards where stage_id = 'explorer');

insert into public.tell_a_parent_cards (stage_id, headline, intro, tell_now, tell_soon, what_happens, the_promise, never, sort_order)
select 'shaper', 'What I need to know, and what I will do about it', 'Most of your life online is yours now, and I am not asking to see it. There is a short list of things where I need to be told, and this is what happens when you do.',
  $j$["Anyone threatening you, about an image or anything else","Anyone asking you for images","An adult contacting you privately","A friend talking about hurting themselves","Anything where you are frightened right now"]$j$::jsonb,
  $j$["Something you sent that you regret","Feeling worse about yourself week after week","Something that keeps coming back at night","Money gone, or an account that is not yours any more"]$j$::jsonb,
  $j$[{"step":"I stay calm, out loud","detail":"Whatever I feel, the first thing you hear from me will not be shouting."},{"step":"We deal with the situation before the device","detail":"Taking your phone off you at that moment would only teach you not to tell me next time."},{"step":"I tell you before I involve anyone else","detail":"School, another parent, the police, you hear it from me first and you get a say in it."},{"step":"It stays between us unless safety says otherwise","detail":"I will not tell family or friends your business to get it off my chest."}]$j$::jsonb,
  'If you are being threatened about an image, there is nothing you could have done that makes that your fault, and I will not treat it as though it is.',
  'I will never make you regret coming to me. If I get it wrong, tell me, and I will take that seriously.',
  40
where not exists (select 1 from public.tell_a_parent_cards where stage_id = 'shaper');

insert into public.tell_a_parent_cards (stage_id, headline, intro, tell_now, tell_soon, what_happens, the_promise, never, sort_order)
select 'independent', 'You do not have to tell me anything, and here is why you might', 'You are 16. Almost none of this is mine to police any more, and I am not going to pretend otherwise. What is left is an offer, not a rule.',
  $j$["You are in danger, or someone is threatening you","You are not okay, and it is not a bad week any more","You are meeting someone you have only known online"]$j$::jsonb,
  $j$["Money gone or an account taken over","Something building that you cannot see the way out of","Something you want to say out loud without it becoming a project"]$j$::jsonb,
  $j$[{"step":"I listen the way you ask me to","detail":"If you say listen and do not fix, that is what you get. Say the word and I will stop."},{"step":"I do not act without you","detail":"You are an adult. Nothing gets reported, rung or arranged unless you want it to, unless you are in real danger."},{"step":"Practical help, no lecture attached","detail":"Money, a lift, a phone call you cannot face making. You will not be charged for it in I told you so."},{"step":"The door does not close","detail":"Not at 18, not at 25, not after a row. There is no version of this where you have used it up."}]$j$::jsonb,
  'I would rather you rang me at three in the morning from somewhere you should not be than not rang me at all.',
  'I will not use something you told me in confidence against you in an argument later.',
  50
where not exists (select 1 from public.tell_a_parent_cards where stage_id = 'independent');
