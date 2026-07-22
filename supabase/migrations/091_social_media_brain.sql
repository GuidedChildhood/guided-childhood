-- Guided Childhood — Migration 091
-- Social media is the big one, so DiGi's brain gets it in depth, and grounded
-- in the nuanced evidence base, not the moral panic: Amy Orben on windows of
-- sensitivity and small individual effects, Candice Odgers on the panic
-- distracting from real drivers, Catherine Knibbs on the nervous system and the
-- telling plan. The through line is ours: sixteen is a ramp, not a cliff edge,
-- so the teaching starts years before any account, one idea at a time, education
-- and positivity over fear. Fifteen expert_knowledge rows DiGi retrieves when a
-- parent asks about social media. Idempotent, guarded on source_name.

set lock_timeout = '3s';

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Amy Orben, windows of sensitivity',
  'Amy Orben and colleagues at Cambridge find the link between social media use and adolescent wellbeing is small on average and highly individual, with windows of heightened sensitivity, roughly ages 11 to 13 in girls and 14 to 15 in boys, and again around 19. The lesson is not a blanket ban at one age but timing, individual difference and preparation: know the sensitive windows, know your own child, and build the skills before and during them rather than hoping a birthday fixes it.',
  '{8-10,11-13,13-15,16+}', array['social_media','mental_health','comparison','readiness','wellbeing'],
  'https://www.nature.com/articles/s41467-022-29296-3', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Amy Orben, windows of sensitivity');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Candice Odgers, beyond the moral panic',
  'Candice Odgers argues the evidence does not support the claim that smartphones and social media alone rewired a generation: the correlations are weak and offline factors like family, poverty and sleep matter more. Her warning is that panic distracts from the real drivers and from equipping children. The response is preparation and safer design, not fear: teach the skills, fix the settings, protect sleep, and keep the conversation open, rather than treating every screen as the cause.',
  '{8-10,11-13,13-15,16+}', array['social_media','mental_health','readiness','cliff_edge','wellbeing'],
  'https://www.nature.com/articles/d41586-024-00902-2', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Candice Odgers, beyond the moral panic');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Catherine Knibbs, the nervous system and telling',
  'Catherine Knibbs frames online harms through the child nervous system: frightening or shaming content lands in the body, and a child who fears being in trouble hides it. The protective factors are a calm safe adult to come back to and a rehearsed telling plan, because the first fear is being in trouble. The standing message is you will never be in trouble for telling me. Regulation first, then the conversation.',
  '{8-10,11-13,13-15}', array['social_media','safety','sextortion','mental_health','disclosure'],
  'https://www.childrenandtech.co.uk', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Catherine Knibbs, the nervous system and telling');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'guidance', 'Guided Childhood, sixteen is a ramp not a cliff edge',
  'A child handed unrestricted social media on a birthday with no preparation faces a cliff edge; a child who has met the ideas gradually for years, the algorithm, comparison, settings, footprint and the telling plan, walks on with open eyes. So the teaching starts years before any account, one small idea at a time, and readiness is built rather than switched on. Never a flat allow or deny, always the next calibrated step on the ramp.',
  '{4-7,8-10,11-13,13-15,16+}', array['social_media','readiness','cliff_edge','preparation'],
  'https://www.guidedchildhood.com', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Guided Childhood, sixteen is a ramp not a cliff edge');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'guidance', 'When to start learning, concepts before accounts',
  'The age to start learning about social media is long before an account. From about 8 to 10 a child can learn that a screen can sell and that real and fake both exist. From 11 to 13, before most accounts, they can grasp how a feed is built from watch time, that filters are not faces, and how comparison works. From 13 to 15 they walk the real settings and read their own footprint. The account comes after the understanding, not before it.',
  '{8-10,11-13,13-15}', array['social_media','algorithm','comparison','readiness','settings'],
  'https://www.internetmatters.org', true
where not exists (select 1 from public.expert_knowledge where source_name = 'When to start learning, concepts before accounts');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'researcher', 'The algorithm, watch time is the vote',
  'The core idea to teach about any feed is that it is built from watch time, so what you linger on is a vote for more of it, and the feed optimises to hold attention, not to serve you. A child who understands this can notice when the feed chose the next video rather than them, and step out on purpose. Taught well before an account, it is the single most protective concept on social media.',
  '{11-13,13-15,16+}', array['social_media','algorithm','attention'],
  'https://www.commonsensemedia.org', true
where not exists (select 1 from public.expert_knowledge where source_name = 'The algorithm, watch time is the vote');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'researcher', 'Comparison and the highlight reel',
  'Social media shows a highlight reel, edited and filtered, so comparison is against something that is not real, and girls in the 11 to 13 window are especially sensitive to appearance comparison. The teaching is not to fear it but to name it: filters are not faces, everyone posts their best bits, and how a feed makes you feel is information worth acting on. Notice the mood, then choose.',
  '{11-13,13-15}', array['social_media','comparison','self_esteem','body_image','mental_health'],
  'https://www.nature.com/articles/s41467-022-29296-3', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Comparison and the highlight reel');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'guidance', 'Settings and safety, private by default',
  'Every platform a UK teen meets has safety settings that belong in place before use: a private account by default, messages and comments limited to friends, location off, and block, mute and report known and rehearsed. Teen accounts and family centres now default some of this, but defaults change, so the real skill is walking the settings of any new app together, not memorising one platform.',
  '{13-15,16+}', array['social_media','settings','safety','privacy'],
  'https://familycenter.meta.com', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Settings and safety, private by default');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'guidance', 'Footprint and reputation, owning your record',
  'What goes online tends to stay: screenshots outlive disappearing messages, and a footprint is read later by schools and employers. The teaching is calm, not scary: think before you post, nothing is ever truly private, and you are writing a record you will want to own. Framed as authorship, owning your online story, not as a threat held over them.',
  '{13-15,16+}', array['social_media','footprint','reputation','privacy'],
  'https://www.gov.uk/government/publications/education-for-a-connected-world', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Footprint and reputation, owning your record');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Sextortion and the photo ask, the first call plan',
  'When someone asks a child for a photo, or a shared image is used to threaten them, the danger is silence driven by shame. The plan, rehearsed in advance: you are not in trouble, stop replying, do not pay or send more, screenshot the evidence, and tell a trusted adult who contacts the platform, the NSPCC or the police. The rehearsed first call plan matters more than any lecture, because the real risk is a child handling it alone.',
  '{11-13,13-15,16+}', array['social_media','sextortion','safety','disclosure'],
  'https://www.nspcc.org.uk', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Sextortion and the photo ask, the first call plan');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'guidance', 'Group chats and pile ons, the exit and the ally',
  'Group chats are where much of the difficulty lives: pile ons, exclusion, and screenshots taken out of context. The teaching is the exit and the ally, when a chat turns nasty you can mute it, leave it, and say so out loud, and being the one who checks on the person targeted matters. A child who knows that leaving a group is allowed is protected from a great deal.',
  '{11-13,13-15}', array['social_media','group_chat','bullying','safety'],
  'https://www.childnet.com', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Group chats and pile ons, the exit and the ally');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Mental health signals, a check in not a panic',
  'Signs worth a gentle check in, never alarm: sleep slipping, mood dropping straight after use, pulling away from offline life, secrecy, or real distress when asked to stop. Because the evidence says effects are individual, these are signals to open a conversation and adjust, not proof of harm. The move is curiosity and one small change together, sleep protected first, rather than confiscation.',
  '{11-13,13-15,16+}', array['social_media','mental_health','sleep','mood','wellbeing'],
  'https://www.nature.com/articles/s41467-022-29296-3', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Mental health signals, a check in not a panic');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'researcher', 'The playground drives it, get in first',
  'Children learn about social media in the playground long before they have it, so the pressure of everyone has it is real and arrives early. Waiting until 16 and saying nothing leaves the playground as the only teacher. The answer is to get in first: talk about it before they can have it, so when the pressure comes they meet it with understanding, not only a no.',
  '{8-10,11-13,13-15}', array['social_media','peers','readiness','fomo'],
  'https://www.ofcom.org.uk/research-and-data/media-literacy-research/childrens', true
where not exists (select 1 from public.expert_knowledge where source_name = 'The playground drives it, get in first');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'guidance', 'The good of it too, teach positive use',
  'Social media is not only risk: it is connection, creativity, identity and belonging, especially for a child who feels alone offline. Teaching only the dangers breeds fear and secrecy. Name the good as well, the friend kept close, the thing made and shared, the community found, so a child learns to use it well and brings you the good and the bad alike.',
  '{11-13,13-15,16+}', array['social_media','positivity','wellbeing','connection'],
  'https://www.commonsensemedia.org', true
where not exists (select 1 from public.expert_knowledge where source_name = 'The good of it too, teach positive use');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'guidance', 'How to teach it, Rosenshine and relational',
  'Teach it relationally and in small steps, never a lecture. The house lesson runs the Rosenshine beats: recall the last idea, one new idea only, model it, try it together, a quick check, and a catchphrase to carry. Child friendly and positive, one concept at a time, spread over years, so understanding is layered gently rather than dumped at 16.',
  '{8-10,11-13,13-15}', array['social_media','teaching','lessons','readiness'],
  'https://www.aft.org/sites/default/files/Rosenshine.pdf', true
where not exists (select 1 from public.expert_knowledge where source_name = 'How to teach it, Rosenshine and relational');
