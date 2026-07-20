-- Guided Childhood — Migration 074
-- The rehearsal evidence bank: what children actually say in the core rehearsal
-- moments, by age, and what the leading experts teach the adult to do next.
-- Grounds DiGi's role play child, the coach, and the suggested lines in named,
-- checkable sources, defensible to a hostile expert. Idempotent: each insert is
-- skipped if the source is already in the bank. Topics are chosen to match the
-- keyword retrieval in lib/digi/brain.ts (underscores read as spaces there).

set lock_timeout = '3s';

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Dr Becky Kennedy, Good Inside, two things are true',
  'Two things are true holds the feeling and the boundary at once: the child''s upset is real and the limit still stands. When a screen goes off, a child of 4 to 10 typically blurts five more minutes or you are so unfair, and the job is not to argue them out of the feeling. The sturdy response validates first and then holds, as in, you really wish you could keep watching, and screen time is done.',
  '{4-7,8-10,11-13}', array['screen_time', 'tantrum', 'boundaries', 'bedtime', 'phone'],
  'https://www.goodinside.com', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Dr Becky Kennedy, Good Inside, two things are true');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Dr Becky Kennedy, sturdy leadership and screen endings',
  'Sturdy leadership means the parent decides warmly rather than asking permission to hold the boundary, because my job is not to make my kid happy, it is to make decisions I believe are best for my kid. Her script for ending device time is, sweetie, it is time to put down your device like we talked about, I get it, it is hard, it is hard for me too. Children push hardest on a wobbling boundary, so say it once, kindly, and expect the protest without treating the protest as a problem.',
  '{4-7,8-10,11-13,13-15}', array['screen_time', 'handover', 'phone', 'boundaries', 'mood'],
  'https://fortune.com/well/article/dr-becky-potential-cost-of-not-setting-screen-time-boundaries-for-kids-has-never-been-higher/', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Dr Becky Kennedy, sturdy leadership and screen endings');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Siegel and Bryson, The Whole Brain Child',
  'A child mid meltdown has flipped their lid: the upstairs brain that reasons and self regulates is offline, so logic and consequences cannot land yet. A 4 to 7 year old whose programme is switched off may scream, grab or shout I hate you, and that is a brain state, not a character flaw. Connect and redirect: soothe the right brain first with tone and closeness, name the feeling to tame it, and only problem solve once the storm has passed.',
  '{4-7,8-10}', array['tantrum', 'mood', 'screen_time', 'bedtime', 'sibling'],
  'https://drdansiegel.com/whole-brain-child-handouts/', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Siegel and Bryson, The Whole Brain Child');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Gottman Institute, emotion coaching',
  'Emotion coaching validates the feeling before setting the limit, on the rule that all feelings are acceptable and some behaviours are not. The five steps are notice the emotion, treat it as a moment for connection, help the child name it, empathise, then set the limit and problem solve together, as in, it is okay to be angry at your brother, and hitting is not okay. Children of emotion coaching parents calm sooner and fight the limit less over time.',
  '{}', array['mood', 'tantrum', 'sibling', 'boundaries'],
  'https://www.gottman.com/blog/emotion-coaching-step-5-helping-the-child-problem-solve-and-setting-limits/', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Gottman Institute, emotion coaching');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Dr Ross Greene, Lives in the Balance',
  'Kids do well if they can, so homework refusal and morning battles signal a lagging skill or an unsolved problem, not low motivation or defiance. A child who says I am not doing it, or it is boring, or this is stupid is usually stuck, and punishment adds heat without adding skill. Plan B starts with the empathy step, I have noticed mornings have been really hard lately, what is up, then the adult names their concern, then both are invited to solve it together.',
  '{4-7,8-10,11-13,13-15}', array['homework', 'morning', 'routines', 'school'],
  'https://livesinthebalance.org', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Dr Ross Greene, Lives in the Balance');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Sue Atkins, The Parenting Coach',
  'The boundary that works is calm, confident and said once, without wobble, lecture or a raised voice. On the smartphone ask, when a child of 8 to 13 says everyone else has one, she coaches parents to acknowledge the feeling first, I can see this feels really unfair, then state the family decision plainly, we have decided as a family to wait, because we care about your wellbeing. Getting a phone should become a planned milestone moment, not a battle the parent finally loses.',
  '{8-10,11-13}', array['phone', 'boundaries', 'screen_time', 'social_media'],
  'https://sueatkinsparentingcoach.com/2024/02/building-confidence-in-saying-no-to-smartphones-until-aged-14-tips-scripts-for-parents/', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Sue Atkins, The Parenting Coach');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Catherine Knibbs, cybertrauma and healthy development',
  'What looks like bad behaviour around devices is often a developing nervous system responding to the digital world, so speak to the state under the behaviour rather than the behaviour alone. Gaming rage at the end of a session is dysregulation, not disrespect, and a child who has seen something upsetting online needs the parent to stay regulated and stay the safe person to tell. If telling costs the child their device, they learn to stop telling.',
  '{}', array['gaming', 'disclosure', 'safety', 'trauma', 'mood'],
  'https://www.internetmatters.org/hub/author/catherineknibbs/', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Catherine Knibbs, cybertrauma and healthy development');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'association', 'NSPCC, distressing online content',
  'When a child sees something upsetting online, the advice is to stay calm, listen without visible panic, and reassure them they are not in trouble and did the right thing by telling you. Children often disclose sideways, my friend saw this thing, or go quiet and delete their history, because their biggest fear is losing the device or being blamed. Ask gently how they got to it, reassure, and never punish the telling.',
  '{}', array['disclosure', 'safety', 'online_safety', 'upset'],
  'https://www.nspcc.org.uk/keeping-children-safe/online-safety/inappropriate-explicit-content/distressing-content/', true
where not exists (select 1 from public.expert_knowledge where source_name = 'NSPCC, distressing online content');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'association', 'Internet Matters, dealing with inappropriate content',
  'Threatening to take the device away after a child reports something harmful drives the behaviour underground and stifles future conversation about their online life. The recommended response keeps the child talking: thank them for telling you, look at the content and next steps together, and keep any access decision separate from the disclosure itself. This is the mechanism behind first call, not last call scripts.',
  '{8-10,11-13,13-15,16+}', array['disclosure', 'safety', 'online_safety', 'phone'],
  'https://www.internetmatters.org/issues/inappropriate-content/deal-with-it/', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Internet Matters, dealing with inappropriate content');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'researcher', 'Blake and McAuliffe, fairness development',
  'By around age 8 children reject unfair shares even when the unfairness favours them, and fairness becomes the lens through which family rules are judged. Sibling device fights at 8 to 10 nearly always run on this logic, he got longer than me, that is not fair, you always take her side, and vague turn taking feeds it. Make time visible and predictable with a timer both children can see, and acknowledge the fairness claim before restating the plan.',
  '{4-7,8-10,11-13}', array['sibling', 'fairness', 'screen_time', 'gaming'],
  'https://www.bu.edu/cdl/files/2013/08/BlakeMcAuliffe2011.pdf', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Blake and McAuliffe, fairness development');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'report', 'Ofcom, Children and Parents Media Use 2025',
  'Smartphone ownership jumps from 56 percent of ten year olds to 83 percent of eleven year olds, with the move to secondary school the tipping point. So when a year 6 or year 7 child says everyone else has a phone, they are describing something close to literal truth, not exaggerating for effect. Dismissing the claim lands as unfair; the stronger response takes the social reality seriously while holding the family''s own timeline.',
  '{8-10,11-13}', array['phone', 'school', 'social_media', 'screen_time'],
  'https://www.ofcom.org.uk/media-use-and-attitudes/media-habits-children/children-and-parents-media-use-and-attitudes-report-2025', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Ofcom, Children and Parents Media Use 2025');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'association', 'Child Mind Institute, helping kids with transitions',
  'Young children struggle with the transition itself, not only with the thing being ended, so the screen off protest at 4 to 7 is a transition problem before it is a defiance problem. Predictable warnings help: a countdown the child can see, five more minutes then we turn it off and get ready for bed, and naming what comes next. A sudden stop with no runway reliably produces the meltdown parents then misread as addiction.',
  '{4-7,8-10}', array['transition', 'tantrum', 'screen_time', 'bedtime', 'morning', 'routines'],
  'https://childmind.org/article/how-can-we-help-kids-with-transitions/', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Child Mind Institute, helping kids with transitions');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'association', 'Childnet, online games and the pause problem',
  'Online multiplayer matches cannot be paused, and leaving mid match means your character is eliminated and your teammates are abandoned, which for an 8 to 15 year old is a real social cost with school friends. The child who says I cannot come off, we are mid game is often stating a fact about the game, not defying the parent. End sessions at the match boundary, finish this one and do not start another, agreed before play begins.',
  '{8-10,11-13,13-15,16+}', array['gaming', 'boundaries', 'transition'],
  'https://www.childnet.com/blog/what-do-i-need-to-know-about-fortnite-a-guide-for-parents-and-carers/', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Childnet, online games and the pause problem');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'researcher', 'BMC Womens Health, adolescent girls and appearance comparison',
  'Adolescent girls describe social media as a mirror, making upward appearance comparisons with friends, celebrities and influencers, and comparisons against close friends are the ones most strongly linked to body dissatisfaction. A girl of 11 to 15 typically voices it as why do I not look like her, or everyone''s life is better than mine. The helpful adult response names the comparison rather than attacking the app, stays curious, and never dismisses with just stop looking at it.',
  '{11-13,13-15,16+}', array['social_media', 'comparison', 'mood', 'anxiety'],
  'https://bmcwomenshealth.biomedcentral.com/articles/10.1186/s12905-022-01845-4', true
where not exists (select 1 from public.expert_knowledge where source_name = 'BMC Womens Health, adolescent girls and appearance comparison');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'researcher', 'Kuczynski and colleagues, resistance in middle childhood',
  'Children''s pushback matures along a predictable arc: angry refusal declines across ages 2 to 5, verbal negotiation with persuasive reasons and offered compromises dominates middle childhood, and adolescents add autonomy and privacy claims plus covert resistance such as quiet workarounds. Expect a 9 year old to bargain and a 14 year old to say it is my phone and my life. Treating negotiation as a developing skill rather than cheek keeps the conversation open while the limit holds.',
  '{}', array['boundaries', 'phone', 'autonomy', 'negotiation', 'handover'],
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC6366431/', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Kuczynski and colleagues, resistance in middle childhood');
