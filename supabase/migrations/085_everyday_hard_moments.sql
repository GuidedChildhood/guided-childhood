-- Guided Childhood — Migration 085
-- The everyday hard moments beyond screens, in the spirit of Dr Becky Kennedy:
-- crying when tired, rude words, consequences that seem not to land, the big
-- miss out that cannot be changed (a broken foot days before the end of school
-- bouncy castle), the child who goes silent, and end of term burnout. Six
-- moment cards that teach DiGi and give parents the calm pathway, plus four
-- expert bank rows so every answer stands on named teaching. Idempotent.

set lock_timeout = '3s';

with incoming (title, category, age_bands, icon, science_brief, digi_opener, solutions, expert_note, sort_order) as (
  values
  ('Crying because they are tired',
   'Emotions', ARRAY['4-7','8-10']::text[], '🥱',
   'A tired brain loses its grip on feelings first: sleep pressure switches off the self regulation a child only just has, so the tears about the wrong cup are really tears about an empty tank. Arguing with the topic misses the cause.',
   'Do the tears tend to come at the same sort of time each day, or after the same sort of day, because the pattern usually points at the tiredness, not the trigger?',
   ARRAY['Respond to the tiredness, not the topic: fewer words, closeness, a calm lap, since a tired brain cannot use reasoning anyway.','Skip the lesson in the moment. Nothing said mid meltdown is remembered, the teaching happens tomorrow when the tank is full.','Quietly bring the next night earlier rather than announcing it as a consequence, so sleep is care, never a punishment.']::text[],
   'Dr Becky Kennedy: see the hard moment as a child having a hard time, not giving you a hard time.',
   370),

  ('Saying rude or hurtful things',
   'Emotions', ARRAY['4-7','8-10','11-13','13-15']::text[], '🗯️',
   'Rude words from a child are usually a feeling too big for their skills leaking out sideways, not their true opinion of you. The most generous interpretation, a good kid having a hard time, keeps you sturdy enough to hold the line without wounding back.',
   'Do the rude words come out in the heat of a moment, or coldly in calm ones, because heat of the moment rudeness is dysregulation and needs a different response?',
   ARRAY['Hold the line on the words without matching them: I will not be spoken to like that, AND I really want to hear what is going on for you.','Let the wave pass before anything else. A child mid storm cannot repair, and demanding an instant sorry usually buys a fake one.','Come back later for the repair, warmly: that was not okay, and I know you are better than those words, what was happening for you?']::text[],
   'Dr Becky Kennedy: the most generous interpretation of the behaviour is the one that changes it.',
   371),

  ('Seems not to care about consequences',
   'Emotions', ARRAY['8-10','11-13']::text[], '🛡️',
   'A child who shrugs at every consequence is usually protecting themselves from shame, not proving the consequence too small. Punishment escalation teaches hiding and hardening; the skill gap or the stuck problem underneath is where change actually lives.',
   'When the consequence lands and they shrug, what do you read underneath it, real indifference, or a child who has decided not to let you see it hurt?',
   ARRAY['Drop the escalation race. If three consequences did not work, a fourth will not, so shift from bigger penalties to solving the problem underneath.','Get curious in a calm hour: I have noticed the consequences do not seem to matter to you, and I am guessing something else is going on, what is up?','Keep boundaries as boundaries, not as pain. The point of a limit is safety and values, and it works even when the child refuses to look bothered.']::text[],
   'Dr Ross Greene: kids do well if they can. A consequence cannot teach a skill the child does not yet have.',
   372),

  ('Missing out on the big thing',
   'Emotions', ARRAY['4-7','8-10','11-13','13-15']::text[], '🎪',
   'When an injury or a rule means missing something that cannot be rerun, the end of school party, the bouncy castle everyone else is on, a child grieves, and grief in children often wears anger. The anger lands on the safest person, which is the parent who held the limit.',
   'Is the anger aimed at the limit itself, or is the limit just the nearest place for the heartbreak of missing out to land?',
   ARRAY['Validate the loss at full size, do not shrink it: missing this is genuinely horrible and you are allowed to be furious about it.','Resist fixing and silver linings. There will be other parties is true and useless; feeling it with them is what actually helps.','Hold the safety limit warmly and separately: the no to the bouncy castle protects the foot, it is not a verdict on their fun, and you can be sad together about it.']::text[],
   'Dr Becky Kennedy: two things are true, the limit stands and the sadness deserves company, not correction.',
   373),

  ('Angry and will not talk',
   'Emotions', ARRAY['8-10','11-13','13-15']::text[], '🚪',
   'Silence after anger is often a child regulating the only way they know, holding the storm in until it is manageable. Chasing them with questions reads as pressure and extends the shutdown; quiet availability shortens it.',
   'When they go quiet, does space bring them back sooner, or do they need to know you are nearby before they can come out of it?',
   ARRAY['Say one door opening line and then genuinely stop: I am not cross, I am here when you are ready, and let silence be okay.','Stay findable and ordinary, pottering nearby, since presence without pressure is what makes coming back easy.','When they do come back, receive them without a debrief demand. A snack and a normal moment first, the talk often follows on its own.']::text[],
   'Catherine Knibbs: speak to the nervous system state, not the silence, and stay the safe person to come back to.',
   374),

  ('End of term burnout',
   'Emotions', ARRAY['4-7','8-10','11-13']::text[], '🎈',
   'The last weeks of term stack late nights, big events and goodbyes on a child who has spent every drop of self control at school. The wobbles, tears and battles at home are the bill arriving, not a discipline problem appearing from nowhere.',
   'Looking at the last fortnight, how much has been late nights and big days, because the fix for end of term behaviour is usually recovery, not consequences?',
   ARRAY['Lower the bar on purpose for a week: fewer demands, simpler evenings, and let good enough be good enough.','Rebuild sleep quietly, earlier nights sold as cosiness, a film and bed, never as a punishment for the behaviour.','Name it kindly so they understand themselves: you have done a whole term, no wonder everything feels wobbly, we will take it slow.']::text[],
   'Child mental health practice: after sustained effort children need recovery, and behaviour recovers with rest.',
   375)
)
insert into public.daily_moments (title, category, age_bands, icon, science_brief, digi_opener, solutions, expert_note, sort_order, active)
select i.title, i.category, i.age_bands, i.icon, i.science_brief, i.digi_opener, to_jsonb(i.solutions), i.expert_note, i.sort_order, true
from incoming i
where not exists (select 1 from public.daily_moments d where d.title = i.title);

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Dr Becky Kennedy, rudeness and the most generous interpretation',
  'Rude and hurtful words from a child are a feeling too big for their current skills leaking out, not their true assessment of the parent. The sturdy response holds the boundary on the words while staying connected, as in, I will not be spoken to that way, and I really want to hear what is going on. Demanding an instant apology mid storm buys a fake one; the real repair happens later, in the calm.',
  '{4-7,8-10,11-13,13-15}', array['rude', 'disrespect', 'anger', 'boundaries', 'mood'],
  'https://www.goodinside.com', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Dr Becky Kennedy, rudeness and the most generous interpretation');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Dr Becky Kennedy, disappointment that cannot be fixed',
  'When a child misses something that cannot be rerun, an injury before the big party, the job is to feel it with them, not to fix it or find the silver lining. Grief in children often wears anger, and the anger lands on the safest adult, usually the one who held the limit. Validate the loss at full size, hold any safety limit warmly and separately, and let the sadness have company rather than correction.',
  '{4-7,8-10,11-13,13-15}', array['disappointment', 'missing_out', 'anger', 'injury', 'sad', 'mood'],
  'https://www.goodinside.com', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Dr Becky Kennedy, disappointment that cannot be fixed');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'expert', 'Ross Greene and Kennedy, when consequences seem not to land',
  'A child who shrugs at every consequence is usually shielding themselves from shame, not proving the punishment too small, and escalating penalties teaches hiding rather than skill. The move is from bigger consequences to solving the problem underneath: I have noticed the consequences do not seem to matter, I am guessing something else is going on, what is up. Boundaries stay, but as safety and values, not as pain to be maximised.',
  '{8-10,11-13,13-15}', array['consequences', 'discipline', 'punishment', 'boundaries', 'shame'],
  'https://livesinthebalance.org', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Ross Greene and Kennedy, when consequences seem not to land');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'researcher', 'Sleep research, the overtired child',
  'Sleep pressure degrades emotional regulation before anything else, so an overtired child cries harder, angers faster and reasons less, and the presenting topic of the tears is rarely the cause. Respond to the tiredness, closeness and fewer words, save any teaching for a rested moment, and rebuild sleep as care rather than as a consequence. End of term and holiday disruption reliably produce this picture in otherwise settled children.',
  '{4-7,8-10,11-13}', array['tired', 'sleep', 'tantrum', 'crying', 'bedtime', 'mood'],
  'https://www.sleepfoundation.org/children-and-sleep', true
where not exists (select 1 from public.expert_knowledge where source_name = 'Sleep research, the overtired child');
