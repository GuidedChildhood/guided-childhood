-- Guided Childhood: expert knowledge bank expansion
-- Run AFTER 019_digi_brain.sql. Extends the corpus DiGi retrieves and cites,
-- deepening the clinical mental health, sleep, safeguarding and parent
-- wellbeing coverage so DiGi can spot the early signs and lead with a
-- calibrated next step, always signposting a human for crisis.
--
-- Style rules match the existing seed: real sources represented at the level
-- of their established position (no invented statistics), no apostrophes and
-- no dashes so the text stays clean and SQL safe. Idempotent by content: a
-- guard skips the insert if these rows are already present.

do $$
begin
  if not exists (
    select 1 from public.expert_knowledge where source_name = 'NICE guidance'
  ) then

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics) values

-- Sleep
('researcher', 'Prof Matthew Walker', 'Sleep is the foundation of adolescent brain development and emotional regulation, and teenagers are biologically wired to fall asleep later, so early school starts plus late night screens compound a real sleep debt that shows up as low mood the next day.', '{11-13,13-15,16+}', '{sleep,mood,anxiety}'),
('researcher', 'Prof Charles Czeisler', 'Evening light and the mental stimulation of a device delay the release of melatonin and push sleep onset later. The hour before bed is the highest leverage change a family can make, more than any single content rule.', '{8-10,11-13,13-15,16+}', '{sleep,routines}'),

-- Parent wellbeing and co regulation
('researcher', 'Roskam and Mikolajczak', 'Parental burnout is distinct from ordinary stress: exhaustion, emotional distancing from the child, and a loss of fulfilment in parenting. It predicts harm and it responds to recovery and support, never to guilt, so a depleted parent needs help, not blame.', '{4-7,8-10,11-13,13-15,16+}', '{parent_wellbeing,mood}'),
('expert', 'Dr Dan Siegel', 'Name it to tame it: helping a child put a word to a big feeling calms the emotional brain and makes them able to think again. Co regulate first, solve the problem second, because a flooded child cannot reason.', '{4-7,8-10,11-13}', '{mood,relationships}'),
('expert', 'Dr Dan Hughes', 'PACE, playfulness, acceptance, curiosity and empathy, builds enough safety that a child will open up. Curiosity about why a child did something opens the door that judgement closes.', '{8-10,11-13,13-15}', '{relationships,trauma}'),

-- Spotting mental health issues
('association', 'Royal College of Psychiatrists', 'Warning signs of adolescent depression are a persistent low mood, withdrawal from friends and things they used to enjoy, and changes to sleep or appetite that last more than two weeks. This is the point to see a GP, not to wait and see.', '{11-13,13-15,16+}', '{mood,anxiety,crisis}'),
('association', 'NICE guidance', 'Self harm in young people needs a calm, non judgemental response and a professional assessment, never shock or punishment. Staying connected, reducing access to means, and getting a GP or CAMHS involved is the pathway. Removing the phone in anger drives it underground.', '{11-13,13-15,16+}', '{safety,trauma,crisis}'),
('association', 'Beat eating disorders', 'Appearance comparison online can fuel disordered eating. Early signs are new food rules, over exercise, body checking and eating alone. Eating disorders have the best outcomes when caught early, so raise a worry with a GP sooner rather than later.', '{11-13,13-15,16+}', '{body_image,social_media,mood}'),
('researcher', 'Dr Jacqueline Nesi', 'It is rarely screen time itself that predicts harm, it is specific behaviours: appearance comparison, constant feedback seeking, and exposure to harmful content. Target the behaviour, not the clock, because two teenagers with the same hours can have very different experiences.', '{11-13,13-15,16+}', '{social_media,mood,body_image}'),

-- Gaming and attention
('association', 'World Health Organization', 'Most gaming is healthy and social. Gaming disorder is rare and is defined by a genuine loss of control and real damage to school, sleep and relationships sustained over about a year, not by hours alone. Judge the impact, not the time on the clock.', '{11-13,13-15,16+}', '{gaming,screen_time}'),
('expert', 'Dr Anna Lembke', 'Apps and games use variable rewards, the same mechanism as a slot machine, to drive compulsive checking. Naming that design out loud to a child removes the shame and hands back some control, because they can see the machine rather than blame themselves.', '{11-13,13-15,16+}', '{screen_time,gaming,social_media}'),
('expert', 'CHADD and ADHD research', 'Children with ADHD are more pulled toward high stimulation games and apps and more affected when they stop, so willpower alone is unfair to expect. External structure, timers and a clear next activity help far more than a lecture.', '{8-10,11-13,13-15}', '{gaming,screen_time,routines}'),

-- Online safety and misinformation
('researcher', 'Prof Sander van der Linden', 'Prebunking works: teaching a child how manipulation and misinformation are built, before they meet it, gives durable resistance that fact checking after the fact does not. Show them the tricks and they spot the play themselves.', '{11-13,13-15,16+}', '{misinformation,safety}'),
('association', 'NSPCC and CEOP', 'Grooming follows a pattern: secrecy, gifts and flattery, moving the chat to a private app, then slowly escalating requests. The single strongest protection is a child who believes they can tell you what happened without losing their device or being in trouble.', '{8-10,11-13,13-15}', '{safety,trauma}'),
('association', 'Internet Matters and UKCIS', 'In the early years, co viewing and shared device use teaches judgement better than filters alone. Filters buy time, conversation builds the skill that lasts once the filters are gone.', '{4-7,8-10}', '{safety,screen_time,relationships}'),
('association', 'Ofcom media use research', 'Most children in the UK are online well before the official platform age limits, so assuming a child is not exposed is the risk. Preparation and honest conversation matter more than a belief that a rule has kept them out.', '{8-10,11-13}', '{social_media,safety}'),

-- Talking about the hardest things
('association', 'Samaritans media guidance', 'Talking openly and calmly about suicide does not plant the idea, and asking directly is protective. Listen first, avoid graphic detail, and route to a human: Samaritans 116 123, or 999 if there is immediate danger.', '{13-15,16+}', '{crisis,safety}'),

-- The concerned reading, held fairly
('researcher', 'Prof Jean Twenge', 'The concerned reading of the evidence links the sharp rise in adolescent distress since about 2012 to heavy smartphone and social media use. It is a reason for structure and vigilance in the sensitive window, especially for girls, not a settled case for a blanket ban.', '{11-13,13-15}', '{social_media,mood,anxiety}');

  end if;
end $$;
