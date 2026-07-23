-- Guided Childhood — Migration 092
-- The Social Media Ready module: the dedicated, higher level spine for the one
-- topic parents worry about most. Social media is spread thin across the
-- general lessons (the algorithm in Builder, group chats and the footprint in
-- the middle stages, sextortion and deepfakes later), so this migration adds
-- the six lessons that complete a single ramp from ages 8 to 16 and beyond:
-- what it even is, the account decision, the highlight reel, the settings that
-- keep you private, the honest mood check, and taking the wheel at 16. Every
-- lesson carries category 'social media', so the Lessons page can pull the
-- whole spine together as one route.
--
-- Grounded in the nuanced evidence base, not the panic: Amy Orben (small
-- effects, windows of sensitivity), Candice Odgers (preparation over fear),
-- Andrew Przybylski (the Goldilocks amount, the global picture), Sonia
-- Livingstone (the four Cs of online risk), Catherine Knibbs (the nervous
-- system and the telling plan), with Jonathan Haidt and Jean Twenge held
-- honestly as the concern side against the counter evidence. The through line
-- is ours: sixteen is a ramp, not a cliff edge, so the teaching starts years
-- before any account, one idea at a time.
--
-- Two parts. Part A extends DiGi's retrieval brain (expert_knowledge, built on
-- migration 091) with the actual research base, the papers and the UK sources,
-- so the module and DiGi both answer from the same grounded corpus. Part B
-- seeds the six deep Rosenshine lessons (seven beats each, the 074 format).
--
-- Idempotent: every insert is guarded (source_name for the brain, title for
-- the lessons), dollar quoted JSON, no dashes in any copy.

set lock_timeout = '3s';

-- ════════════════════════════════════════════════════════════════════════════
-- PART A · The research base, wired into DiGi's brain
-- ════════════════════════════════════════════════════════════════════════════

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'research', 'Orben and Przybylski, the small effect',
  'The largest analyses, Orben and Przybylski in Nature Human Behaviour, find the association between screen use and adolescent wellbeing is real but tiny, on the order of a few tenths of a percent of the variance, about the same as wearing glasses or eating potatoes. The honest reading is not nothing and not a catastrophe: for most children the effect is small, for a few it matters more, so the work is knowing your own child rather than fearing the average.',
  '{11-13,13-15,16+}', array['social_media','mental_health','wellbeing','evidence'],
  'https://www.nature.com/articles/s41562-018-0506-1', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Orben and Przybylski, the small effect');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'research', 'Przybylski and Weinstein, the Goldilocks amount',
  'Przybylski and Weinstein tested more than a hundred thousand teenagers and found a Goldilocks pattern: a moderate amount of screen use sat alongside slightly higher wellbeing than none at all, and only heavy use tracked lower. The takeaway is that the dose matters more than the substance. The goal is not zero, it is a sensible middle, which is exactly what a calibrated pathway builds toward rather than a blanket ban.',
  '{11-13,13-15,16+}', array['social_media','wellbeing','balance','evidence'],
  'https://journals.sagepub.com/doi/10.1177/0956797616678438', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Przybylski and Weinstein, the Goldilocks amount');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'research', 'Vuorre and Przybylski, the global picture',
  'Vuorre and Przybylski looked across millions of people in scores of countries and could not find the fingerprint you would expect if social media were driving a global collapse in wellbeing: the trends do not line up cleanly across places and years. It does not prove no one is harmed, it means the simple story of one cause is not supported at scale, and it argues for targeting the children who struggle rather than frightening every family.',
  '{11-13,13-15,16+}', array['social_media','mental_health','wellbeing','evidence'],
  'https://royalsocietypublishing.org/doi/10.1098/rsos.221451', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Vuorre and Przybylski, the global picture');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Odgers and Jensen, facts fears and the future',
  'Odgers and Jensen, in a major review for the Journal of Child Psychology and Psychiatry, weigh the facts against the fears and conclude the panic has outrun the evidence: the average links are weak, the harms concentrate in children already vulnerable, and time spent fearing screens is time not spent on sleep, poverty and support. The lesson for a parent is to watch the individual child, protect the basics, and prepare rather than prohibit.',
  '{11-13,13-15,16+}', array['social_media','mental_health','wellbeing','evidence','readiness'],
  'https://acamh.onlinelibrary.wiley.com/doi/10.1111/jcpp.13190', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Odgers and Jensen, facts fears and the future');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Sonia Livingstone, the four Cs of online risk',
  'Sonia Livingstone and the EU Kids Online team sort every online risk into four Cs: content a child sees, contact from others, conduct the child takes part in, and contract, the ways platforms and data can exploit them. It is the calmest map there is, because it turns a vague dread into four nameable things a family can actually teach and check, one at a time, rather than one giant fear of the internet.',
  '{8-10,11-13,13-15,16+}', array['social_media','safety','settings','readiness','evidence'],
  'https://www.lse.ac.uk/media-and-communications/research/research-projects/eu-kids-online', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Sonia Livingstone, the four Cs of online risk');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'data', 'Ofcom, when children actually start',
  'Ofcom, the UK regulator, reports each year on what children really do online. The pattern is steady: many children use messaging and video apps well before the platforms official age of thirteen, and a large share have a profile of their own by the time they leave primary school. It is the plainest argument for starting the conversation early, because the data says the playground already has, long before the birthday a family might be waiting for.',
  '{8-10,11-13,13-15}', array['social_media','readiness','peers','data'],
  'https://www.ofcom.org.uk/research-and-data/media-literacy-research/childrens', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Ofcom, when children actually start');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'case', 'The Molly Russell inquest, why the feed matters',
  'The 2022 inquest into the death of Molly Russell found that the negative effects of online content contributed to her death, after she was served a stream of algorithmically recommended posts about self harm and despair. It is the clearest UK evidence that the danger is not screens in the abstract but a feed that amplifies the darkest thing a struggling child pauses on. It is why the algorithm lesson and the mood check are not optional, and why a calm adult to come back to is the real protection.',
  '{11-13,13-15,16+}', array['social_media','algorithm','mental_health','safety','disclosure'],
  'https://www.judiciary.uk/prevention-of-future-death-reports/molly-russell-prevention-of-future-deaths-report', true
where not exists (select 1 from public.expert_knowledge where source_name = 'The Molly Russell inquest, why the feed matters');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'policy', 'The Online Safety Act and the Childrens Code',
  'UK law now puts duties on the platforms as well as the family: the Online Safety Act 2023 requires services to assess and reduce risk to children and to check ages more seriously, and the ICO Age Appropriate Design Code, driven by Baroness Kidron and 5Rights, requires that settings default to high privacy for children. The practical message for a parent is that safer defaults are arriving, but defaults still change and vary, so walking the settings of any new app together remains the durable skill.',
  '{13-15,16+}', array['social_media','settings','privacy','safety','policy'],
  'https://www.gov.uk/government/publications/online-safety-act-explainer', true
where not exists (select 1 from public.expert_knowledge where source_name = 'The Online Safety Act and the Childrens Code');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Haidt and Twenge, the concern side held honestly',
  'Jonathan Haidt, in The Anxious Generation, and Jean Twenge argue that a great rewiring of childhood around smartphones and social media drove the rise in teen anxiety and depression from about 2012, and press for later phones and phone free schools. Many researchers, Odgers and Orben among them, counter that the correlation is weak and the timing arguments do not hold up, warning against mistaking a real worry for a proven cause. The fair position is to take the concern seriously, act on the strong parts, delay, protect sleep, keep phones out of bedrooms, without claiming a certainty the evidence does not yet support.',
  '{11-13,13-15,16+}', array['social_media','mental_health','wellbeing','evidence','readiness'],
  'https://www.anxiousgeneration.com', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Haidt and Twenge, the concern side held honestly');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'guidance', 'Royal College guidance, balance not abstinence',
  'The Royal College of Paediatrics and Child Health and allied UK bodies decline to set a single screen time limit, because the evidence does not support one number for every child. Their guidance asks families to weigh sleep, physical activity, time together and whether screens get in the way of any of them, and to keep the conversation open. It is a clinical vote for balance and judgement over a blanket rule, which is the same ground a calibrated pathway stands on.',
  '{4-7,8-10,11-13,13-15,16+}', array['social_media','balance','wellbeing','sleep','evidence'],
  'https://www.rcpch.ac.uk/resources/screen-time-guide', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Royal College guidance, balance not abstinence');

-- ════════════════════════════════════════════════════════════════════════════
-- PART B · The six deep lessons of the Social Media Ready module
-- ════════════════════════════════════════════════════════════════════════════

-- ── Stage 2, Builder (8 to 10) · the ramp opens ─────────────────────────────
insert into public.lessons (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select 'builder', 'parent', 'social media', 'What social media really is',
  'Social media is a set of grown up sharing apps built to keep people looking as long as possible. A child can understand what it is, and why it pulls, years before they ever hold an account.',
  'Ofcom finds most children meet social media in the playground long before they own it, and Candice Odgers argues the strongest protection is preparation, not a later birthday. Plain words now mean the pressure at eleven meets understanding, not a blank.',
  'Ask which apps their friends talk about. No judgement, just a map. Pick one and work out together what it is really for, and who makes money when it is used.',
  'You do not have it yet, and you already get to understand it.',
  'How do I start talking about social media with my nine year old before they have any of it?',
  981, 'live',
  $s1$[
    {"type":"title","phase":"starter","minutes":1,"eyebrow":"Builder · Ages 8 to 10 · Social media ready","title":"What social media really is","body":"A ten minute lesson for you and your child together, on the apps everyone talks about and no one explains.","script":"Starter recall: what did we learn about why stopping a screen feels hard? The rewards stop suddenly. Today: which apps are built to hand out those little rewards on purpose?"},
    {"type":"objective","phase":"starter","minutes":1,"outcome":"I can say what social media is, and name one reason it is built to keep people looking.","why":"You will hear about these apps in the playground long before you have one. Knowing what they are, calmly, means you meet them ready instead of surprised.","gains":["I can say what social media is in my own words","I know it is built to hold attention","I know the playground talks about it before anyone has it"]},
    {"type":"concept","phase":"teach","minutes":2,"emoji":"📱","heading":"Apps built to hold you","body":"Social media is apps where people share and watch: videos, photos, messages, likes. They are free to use because the company earns money from your attention, so every part is designed to keep you looking a little longer.","script":"Small step check before moving on: ask them why a free app would want you to look for longer. Money from attention. Wait for that to land. It is the key idea under everything else."},
    {"type":"concept","phase":"teach","minutes":2,"emoji":"🗣️","heading":"The playground gets there first","body":"Long before you have any of it, other children will talk about it. That is normal, and it is exactly why we learn about it now. When someone says everyone has it, you will already know what it is, and that not everyone does.","script":"Odgers, child sized: the answer to playground pressure is not a later birthday, it is getting in first with understanding. Tell them: you are learning this early on purpose, so it is never new and scary."},
    {"type":"choice","phase":"practise","minutes":2,"question":"A social media app is free to download. How does the company actually make money?","options":[{"text":"From your attention and your time on the app","correct":true,"feedback":"Yes. Free to you means your attention is what they sell. That is why it is built to hold you."},{"text":"It does not make money, it is just for fun","correct":false,"feedback":"A big app costs a lot to run. If you are not paying with money, your attention is what pays."}]},
    {"type":"choice","phase":"prove","minutes":2,"question":"A friend says everyone in our class has this app. What is the calm, true thing to remember?","options":[{"text":"I must be the only one without it","correct":false,"feedback":"Everyone has it is almost never true, it is just what pressure sounds like. You know what the app is, and that is the strong bit."},{"text":"Everyone has it is usually not true, and I already understand what it is","correct":true,"feedback":"Exactly. You got in first. Understanding beats the birthday, every time."}]},
    {"type":"digi","phase":"close","minutes":1,"heading":"DiGi says","lines":["Social media is apps built to hold your attention.","Free to you means your time is what pays.","You are learning it early on purpose, so it is never new."]}
  ]$s1$::jsonb
where not exists (select 1 from public.lessons where title = 'What social media really is');

-- ── Stage 3, Explorer (11 to 13) · the account decision ─────────────────────
insert into public.lessons (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select 'explorer', 'parent', 'social media', 'Before you make an account',
  'The account comes after the understanding, not before it. Before signing up, a young person can learn what an account really is, who can see it, and why the sensible order is skills first.',
  'Amy Orben places eleven to thirteen as a window of heightened sensitivity, and Sonia Livingstone sorts online risk into content, contact, conduct and contract. Meeting those four ideas before the first account is what readiness actually means.',
  'If they are asking for an app, do the sign up together, slowly, reading what each permission asks for. Treat it as a joint decision you make as a team, not a gate you guard.',
  'Understand it first, then open it. That order is the whole game.',
  'My twelve year old wants their first account. How do I make the sign up a lesson, not a fight?',
  982, 'live',
  $s2$[
    {"type":"title","phase":"starter","minutes":1,"eyebrow":"Explorer · Ages 11 to 13 · Social media ready","title":"Before you make an account","body":"Fifteen minutes together on the decision itself: what an account is, who can see it, and why order matters.","script":"Starter recall: how does a free app make its money? Your attention. Today: before you hand it your attention, what are you actually signing up to?"},
    {"type":"objective","phase":"starter","minutes":1,"outcome":"I can name what an account gives away, and check the four risks before I sign up: content, contact, conduct, contract.","why":"An account is not just a login, it is a door. Knowing what comes through it, before you open it, is the difference between using an app and being caught out by one.","gains":["I can name Livingstone's four risks in plain words","I know what a sign up really asks for","I can decide as a team, not on impulse"]},
    {"type":"concept","phase":"teach","minutes":3,"emoji":"🚪","heading":"An account is a door, both ways","body":"When you make an account you can see out, but people and companies can see in: your posts, sometimes your location, who you talk to, what holds you. The four things to check are content you might see, contact from others, conduct you take part in, and the contract, what the app takes in return.","script":"Small step check: ask them to name the four Cs back to you in their own words. Content, contact, conduct, contract. Livingstone's map turns one big fear into four things you can actually check. Do not move on until all four land."},
    {"type":"scenario","phase":"teach","minutes":3,"label":"Evidence","platform":"feed","handle":"sign up · new account","avatar":"✍️","meta":"Allow this app to:","text":"Access your contacts · Use your location · Send you notifications · Show your profile to everyone by default","image":"⚙️","prompt":"Before you tap Agree, which of these would you turn off first, and why?","script":"Let them choose before you weigh in. Location and profile to everyone are the two to change first. This is the moment the lesson is real: the settings walk starts at sign up, not after something goes wrong."},
    {"type":"choice","phase":"practise","minutes":2,"question":"You are about to make a new account. What is the strong first move?","options":[{"text":"Sign up fast and sort the settings out later","correct":false,"feedback":"Later often means never, and the default profile may already be public. The settings walk belongs at the start."},{"text":"Go through the settings and permissions together before the account is really used","correct":true,"feedback":"Yes. Set it private, turn off location, decide who can message, then use it. Skills first, account second."},{"text":"Copy a friend's settings exactly","correct":false,"feedback":"Their choices are not yours, and defaults differ. Walk your own settings so you understand each one."}]},
    {"type":"choice","phase":"prove","minutes":2,"question":"Which of these is the contract risk in Livingstone's four Cs?","options":[{"text":"A stranger messaging you","correct":false,"feedback":"That is contact. Close, but the contract is about the app itself, not another person."},{"text":"The app collecting your data and using it in ways you did not really agree to","correct":true,"feedback":"Exactly. Contract is the deal with the platform: your data, your attention, the fine print. It is the one people forget."},{"text":"Something upsetting appearing in your feed","correct":false,"feedback":"That is content. The contract is the quiet deal you sign with the company itself."}]},
    {"type":"digi","phase":"close","minutes":1,"heading":"DiGi says","lines":["An account is a door that opens both ways.","Check the four: content, contact, conduct, contract.","Understand it first, then open it."]}
  ]$s2$::jsonb
where not exists (select 1 from public.lessons where title = 'Before you make an account');

-- ── Stage 3, Explorer (11 to 13) · comparison ───────────────────────────────
insert into public.lessons (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select 'explorer', 'parent', 'social media', 'Real life is not a highlight reel',
  'A feed is an edited highlight reel, filtered and chosen from a hundred takes. Comparing your ordinary day to other people''s best bits is comparing against something that was never real.',
  'Orben and colleagues find girls aged eleven to thirteen are especially sensitive to appearance comparison during this window. Naming the highlight reel, rather than banning the app, is the response the evidence supports.',
  'Scroll a feed together and count the edits on one post: the filter, the pose, the twentieth take, the good day chosen from a hard week. Then name one real, unglamorous good thing about your own day.',
  'Filters are not faces, and a feed is not a life.',
  'My daughter compares herself to everyone online and it is denting her confidence. What helps?',
  983, 'live',
  $s3$[
    {"type":"title","phase":"starter","minutes":1,"eyebrow":"Explorer · Ages 11 to 13 · Social media ready","title":"Real life is not a highlight reel","body":"Fifteen minutes together on why a feed makes you feel behind, and how to see through it.","script":"Starter recall: what are the four things to check before an account? Content, contact, conduct, contract. Today is about content, the highlight reel, and the quiet way it moves how you feel about yourself."},
    {"type":"objective","phase":"starter","minutes":1,"outcome":"I can explain why comparing myself to a feed is unfair, and name what a post hides.","why":"Comparison is not a weakness, it is what brains do. But a feed feeds it something fake: everyone's best moment, edited, all at once. Seeing that is how you stop losing to it.","gains":["I can explain what a highlight reel is","I know filters and takes hide the real version","I can name my own real good thing, unedited"]},
    {"type":"concept","phase":"teach","minutes":3,"emoji":"✨","heading":"Everyone posts their best bit","body":"No one posts the boring afternoon, the argument, the twentieth take that finally looked right. A feed is a wall of everyone's single best moment, filtered and chosen. Comparing your whole ordinary day to that is a game rigged against you before you start.","script":"Small step check: ask what a post leaves out. The takes, the filter, the bad days, the effort. Wait for it. Then the line that lands: you are comparing your behind the scenes to their highlight reel."},
    {"type":"scenario","phase":"teach","minutes":3,"label":"Evidence","platform":"feed","handle":"aimee.does.life","avatar":"🌴","meta":"Suggested for you","text":"just a casual perfect morning, no makeup, no filter, feeling so grateful 🥰 (photo 34 of the same pose)","image":"🤳","stats":"❤ 22.4K   ↻ 1.9K   💬 803","prompt":"What does this post want you to think, and what did it actually take to make?","script":"No makeup and no filter, on take thirty four, is the trick in one line. Let them spot the gap between the claim and the effort. This is Orben's comparison window: naming it out loud is the protection."},
    {"type":"choice","phase":"practise","minutes":2,"question":"You scroll for ten minutes and start to feel like everyone's life is better than yours. What is actually true?","options":[{"text":"Everyone else really does have a better life","correct":false,"feedback":"You are seeing their chosen best bits, not their real days. The feeling is real, the comparison is not fair."},{"text":"You are comparing your ordinary day to a wall of edited highlights","correct":true,"feedback":"Exactly. Behind the scenes against a highlight reel. Once you can name it, it loses most of its sting."},{"text":"You just need to post something better too","correct":false,"feedback":"That keeps you inside the game. The move is to notice the mood, not to compete with the reel."}]},
    {"type":"choice","phase":"prove","minutes":2,"question":"A post says no filter, no makeup, effortless. What is the wise thing to remember?","options":[{"text":"They must just look like that all the time","correct":false,"feedback":"Effortless is usually the most worked on look of all. The claim is part of the edit."},{"text":"The most polished posts are often the ones claiming to be the most natural","correct":true,"feedback":"Yes. Filters are not faces, and effortless is a style, not the truth. You see the reel, not the takes."},{"text":"I should feel bad for not looking that way","correct":false,"feedback":"Never. You are measuring your real self against a made thing. That is the unfair game to step out of."}]},
    {"type":"digi","phase":"close","minutes":1,"heading":"DiGi says","lines":["A feed is everyone's best bit, edited, all at once.","You are comparing your behind the scenes to their highlight reel.","Filters are not faces. Notice the mood, then look up."]}
  ]$s3$::jsonb
where not exists (select 1 from public.lessons where title = 'Real life is not a highlight reel');

-- ── Stage 4, Shaper (13 to 15) · the settings walk ──────────────────────────
insert into public.lessons (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select 'shaper', 'parent', 'social media', 'The settings that keep you private',
  'Every platform ships with safety settings that belong in place before real use: private by default, messages limited to friends, location off, and block, mute and report known and rehearsed.',
  'Teen accounts and family centres now default some of this, but the Online Safety Act and Livingstone both point to the durable skill being to walk the settings of any new app together, because defaults change and vary.',
  'Open the app they actually use and walk five settings tonight: account private, who can message, who can comment, location off, and where block and report live. Do it together, one tap each.',
  'Lock it before you live in it, and learn the settings, not one app.',
  'What are the exact settings I should walk through with my teenager on their apps?',
  984, 'live',
  $s4$[
    {"type":"title","phase":"starter","minutes":1,"eyebrow":"Shaper · Ages 13 to 15 · Social media ready","title":"The settings that keep you private","body":"Fifteen minutes with a real app open, walking the settings that do the quiet protecting.","script":"Starter recall: why is comparing yourself to a feed unfair? It is everyone's edited best bit. Today gets practical: the settings that decide who can reach you in the first place."},
    {"type":"objective","phase":"starter","minutes":1,"outcome":"I can set an account to private and walk the five safety settings on any app, not just one.","why":"Most trouble online starts with a setting left open: a public profile, open messages, location on. Closing them takes five minutes and prevents most of it.","gains":["I can make an account private","I know the five settings to check on any app","I know how to block, mute and report before I need to"]},
    {"type":"concept","phase":"teach","minutes":3,"emoji":"🔒","heading":"Private by default, the five checks","body":"On any app, five settings do most of the work: account set to private, messages limited to people you know, comments limited too, location and precise location turned off, and block, mute and report found and understood. Learn the five checks, not one app, because you will meet new apps and the settings move.","script":"Small step check: ask them to list the five back. Private, messages, comments, location, block and report. This is the skill that transfers. Do not move on until they can recall the list without looking."},
    {"type":"scenario","phase":"teach","minutes":3,"label":"Evidence","platform":"feed","handle":"privacy settings · your account","avatar":"🛠️","meta":"Current settings","text":"Account: Public · Messages: Everyone · Location: On · Story: Everyone can reply · Tag: Anyone can tag you","image":"📵","prompt":"Which of these five do you change first, and what does each one open if you leave it?","script":"Walk it together, top to bottom. Public plus messages from everyone plus location on is the exact combination that lets a stranger find, reach and locate a teen. Let them make each change with their own thumb. Ownership is what makes it stick."},
    {"type":"choice","phase":"practise","minutes":2,"question":"You download a brand new app your friends have started using. What is the first thing to do?","options":[{"text":"Start using it, the defaults are probably fine","correct":false,"feedback":"Defaults vary and often start open. New app means walk the five checks first, every time."},{"text":"Walk the five settings: private, messages, comments, location, block and report","correct":true,"feedback":"Exactly. The skill is the five checks, not one memorised app. That is what keeps you safe as apps change."},{"text":"Wait until something goes wrong, then change them","correct":false,"feedback":"By then the open settings have already done their damage. The walk happens before, not after."}]},
    {"type":"choice","phase":"prove","minutes":2,"question":"Why learn the five checks rather than just fixing the settings on one app?","options":[{"text":"There is no difference, one app is enough","correct":false,"feedback":"There will always be a next app, and its menus will look different. The transferable skill is the point."},{"text":"Because you will meet new apps and the menus move, so the skill has to travel","correct":true,"feedback":"Yes. Apps change, defaults change, the five checks stay the same. Learn the skill, not the screen."},{"text":"Because settings never matter after the first time","correct":false,"feedback":"They matter every time, on every app, which is exactly why the walk is a habit, not a one off."}]},
    {"type":"digi","phase":"close","minutes":1,"heading":"DiGi says","lines":["Five checks on any app: private, messages, comments, location, block and report.","Learn the skill, not one screen. Apps change, the checks do not.","Lock it before you live in it."]}
  ]$s4$::jsonb
where not exists (select 1 from public.lessons where title = 'The settings that keep you private');

-- ── Stage 4, Shaper (13 to 15) · the mood check ─────────────────────────────
insert into public.lessons (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select 'shaper', 'parent', 'social media', 'The honest check on your mood',
  'Social media moves your mood up, down or flat, and usually you never notice the move happening. The honest check is one word for how you feel before a scroll, and one word after.',
  'Because Orben and Odgers both show the effects are small on average but real for some, the evidence points to noticing your own pattern rather than a blanket rule. Sleep slipping and mood dropping straight after use are the signals worth a gentle change.',
  'For one week, name a mood word before and after a scroll. No banning, just noticing. By Friday a pattern shows, and once you can see it, you get to choose it.',
  'Notice the mood, then choose. And sleep is protected first.',
  'How do I help my teen notice when scrolling is making them feel worse, without confiscating the phone?',
  985, 'live',
  $s5$[
    {"type":"title","phase":"starter","minutes":1,"eyebrow":"Shaper · Ages 13 to 15 · Social media ready","title":"The honest check on your mood","body":"Fifteen minutes on the quiet skill of reading your own weather before and after a screen.","script":"Starter recall: name two of the five settings checks. Any two. Today moves from the outside of the app to the inside of you: what a scroll does to how you feel."},
    {"type":"objective","phase":"starter","minutes":1,"outcome":"I can run the honest check on my own mood, and name the signals worth acting on.","why":"The same hour on a screen can lift you or flatten you. Which one is happening is information, and most people never look. Looking is the whole skill.","gains":["I can run the one word check before and after","I know the signals worth a gentle change","I know sleep gets protected first, always"]},
    {"type":"concept","phase":"teach","minutes":3,"emoji":"🌤️","heading":"One word before, one word after","body":"Before you pick up the phone, notice one word for how you feel. Bored. Fine. Low. Buzzing. Then use it as normal. Then after, notice the word again: better, same, or worse. You are not banning anything, you are watching your own weather, and after a week the pattern is impossible to miss.","script":"Small step check: ask them to run it once, right now. One word before, imagine the scroll, one word after. Knibbs framing: the feeling is real and it is information. The check just makes it visible, and visible is choosable."},
    {"type":"scenario","phase":"teach","minutes":3,"label":"Evidence","platform":"message","handle":"the honest check · your week","avatar":"📓","text":"Mon: bored then worse · Tue: low then worse · Wed: fine then fine · Thu: low then worse · Fri: bored then worse","image":"🔁","prompt":"What pattern is this week showing, and what is the one small change it points to?","script":"Let them read their own data. Low or bored going in, worse coming out, four times in five. The change is not delete the app, it is when I feel low, I do something else first. Small, specific, chosen by them. That is what the evidence supports over a blanket ban."},
    {"type":"choice","phase":"practise","minutes":2,"question":"You feel low, so you open the app to feel better, and twenty minutes later you feel worse. What does the honest check tell you?","options":[{"text":"Nothing, that is just how phones are","correct":false,"feedback":"It is telling you something specific: for you, scrolling while low tends to make low worse. That is usable."},{"text":"When I go in low, I tend to come out worse, so low is a cue to do something else first","correct":true,"feedback":"Exactly. Not a ban, a pattern you can act on. Notice the mood, then choose the door."},{"text":"I should just try to enjoy it more","correct":false,"feedback":"The check is not about trying harder, it is about noticing the pattern and making one small change when you spot it."}]},
    {"type":"choice","phase":"prove","minutes":2,"question":"Which of these is the signal most worth a gentle change, and what is the first thing to protect?","options":[{"text":"Enjoying a funny group call with mates, protect nothing","correct":false,"feedback":"That is the good side of a screen. The signals to watch are the ones that flatten you, not the ones that lift you."},{"text":"Sleep slipping and mood dropping straight after use, and sleep is protected first","correct":true,"feedback":"Yes. Sleep is the first domino, so it comes first, phone out of the bedroom, before anything else changes."},{"text":"Getting lots of likes, protect the likes","correct":false,"feedback":"Likes are the machine's measure, not your wellbeing. Watch sleep and mood, and guard sleep first."}]},
    {"type":"digi","phase":"close","minutes":1,"heading":"DiGi says","lines":["One word before, one word after. That is the honest check.","The same hour can lift you or flatten you. Look at which.","Watch sleep and mood. Protect sleep first."]}
  ]$s5$::jsonb
where not exists (select 1 from public.lessons where title = 'The honest check on your mood');

-- ── Stage 5, Independent (16 plus) · taking the wheel ───────────────────────
insert into public.lessons (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, slides)
select 'independent', 'parent', 'social media', 'Taking the wheel at 16',
  'Sixteen is a ramp, not a cliff. The years of small lessons hand over now into full use with open eyes: the algorithm, comparison, settings, footprint and the telling plan, all already known, and the good of it enjoyed on purpose.',
  'A young person handed unrestricted access with no preparation faces a cliff edge; one who met the ideas for years walks on ready. Odgers and Orben both argue readiness is built over time, not switched on at a birthday.',
  'Sit as equals and name two things: the good you each genuinely get from it, and the one habit you each want to keep in check. Agree a shared norm you both keep, phones out of the bedroom at night.',
  'The ramp was the point. You take the wheel knowing the road.',
  'My teen is turning sixteen. How do we mark the handover to full social media without it being a free for all?',
  986, 'live',
  $s6$[
    {"type":"title","phase":"starter","minutes":1,"eyebrow":"Independent · 16 plus · Social media ready","title":"Taking the wheel at 16","body":"The lesson at the top of the ramp: a conversation between near equals about using it well, for good.","script":"Recall the whole road in a line each: what social media is, the account decision, the highlight reel, the settings walk, the honest check. This is the handover, and the point of every step before it: you take the wheel already knowing the road."},
    {"type":"objective","phase":"starter","minutes":1,"outcome":"I can name what I want from social media, what I want to keep in check, and one shared norm I will hold.","why":"Full access is not the end of the pathway, it is the graduation. You are not being handed a cliff, you are driving a road you have been learning for years.","gains":["I can name the good I want from it","I can name the habit I keep in check","I hold one shared norm, chosen not imposed"]},
    {"type":"concept","phase":"teach","minutes":3,"emoji":"🛣️","heading":"A ramp, not a cliff","body":"The whole point of starting early was this moment: not a birthday that flips a switch from off to everything, but a ramp you have been walking. You already know how the feed works, why comparison bites, how the settings sit, what a footprint is, and who you tell if something goes wrong. That is what ready looks like.","script":"Small step check: ask them to name three things they already knew before today that a friend handed a phone at sixteen with no preparation would not. The algorithm, the highlight reel, the settings, the telling plan. That gap is the pathway's whole value."},
    {"type":"scenario","phase":"teach","minutes":3,"label":"Evidence","platform":"message","handle":"the handover · you and them","avatar":"🤝","text":"The good I get: staying close to mates, making things, finding people like me. The habit I keep in check: late night scrolling when I am tired. The norm we both keep: phones charge outside the bedroom.","image":"🌙","prompt":"Fill this in together, honestly, both of you including the parent. What is your version?","script":"Both sides answer, including you. Naming the good out loud matters as much as the risk, because a young person who can bring you the good will bring you the bad too. The shared norm works because you keep it as well, not just them."},
    {"type":"choice","phase":"practise","minutes":2,"question":"What is the difference between a cliff edge and a ramp at sixteen?","options":[{"text":"There is no difference, sixteen is just when it is allowed","correct":false,"feedback":"That is the cliff: off one day, everything the next, with no skills built. The ramp is the opposite of that."},{"text":"A cliff is sudden full access with no preparation; a ramp is years of skills so full access is just the next step","correct":true,"feedback":"Exactly. You have been walking the ramp the whole time. Sixteen is a step on it, not a leap off one."},{"text":"A ramp means stricter rules forever","correct":false,"feedback":"The opposite. The ramp earns trust and hands over the wheel, because the skills are already there."}]},
    {"type":"choice","phase":"prove","minutes":2,"question":"Why does naming the good of social media matter, not just the risks?","options":[{"text":"It does not, only the dangers are worth talking about","correct":false,"feedback":"Teaching only danger breeds fear and secrecy, and a secret struggle is the one that gets dangerous."},{"text":"Because a young person who can bring you the good will bring you the bad too, and honesty runs both ways","correct":true,"feedback":"Yes. Connection, creativity and belonging are real. Naming them keeps the door open for the hard things as well."},{"text":"Because the good cancels out the risks","correct":false,"feedback":"It does not cancel them, it balances the picture, so the conversation stays honest instead of one sided."}]},
    {"type":"digi","phase":"close","minutes":1,"heading":"DiGi says","lines":["Sixteen is a ramp, not a cliff. You knew the road before you drove it.","Name the good and the habit to keep in check, both of you.","The pathway was always heading here: you, taking the wheel, ready."]}
  ]$s6$::jsonb
where not exists (select 1 from public.lessons where title = 'Taking the wheel at 16');
