-- 363_school_day_windows.sql
--
-- Justin, 7 October 2026: "research the best morning before school routine
-- and after school return so we can build advice in and cleverly pre empt
-- what happens ... as well as giving parents opportunity to log as a moment
-- so we can track and provide best advice."
--
-- The briefing (briefings/2026-10-07-school-day-routines-v2.html, nine
-- lenses, 75 sources verified) found the morning and the after school hour
-- are paid for by sleep and food, not the screen, that fewer prompts beat
-- more (three texts a week beat five, which raised opt out 58 percent), and
-- that the parent is in the room at 3.30 now in a way they were not in 1971.
-- The build: two times per child, so the 07:30 and 15:30 pushes become per
-- family sends from each child's actual school day (lib/home/school-window.ts),
-- one window per family by default, with a Home card that logs the moment in
-- one tap. Plus the words for the moments the briefing found no script for,
-- and the sourced findings behind them so DiGi can cite rather than assert.

-- ── Part one: the two times, per child ──────────────────────────────────────
--
-- Minutes from midnight, UK wall clock. Null means the defaults the pushes
-- have always used. Quarter hours, because the pickers offer quarter hours
-- and the cron rounds the target to the half hour it runs on.

alter table public.children
  add column if not exists school_start_minutes int
  check (school_start_minutes is null or (school_start_minutes between 450 and 570 and school_start_minutes % 15 = 0));

alter table public.children
  add column if not exists home_minutes int
  check (home_minutes is null or (home_minutes between 870 and 1110 and home_minutes % 15 = 0));

comment on column public.children.school_start_minutes is
  'When school starts, minutes from midnight UK (7:30am to 9:30am, quarter hours). The morning push and card land 50 minutes before. Null means 7:30am as before.';
comment on column public.children.home_minutes is
  'When the child is usually home, minutes from midnight UK (2:30pm to 6:30pm, quarter hours). The after school push and card land 15 minutes after. Null means 3:30pm as before.';

-- ── Part two: one window per family by default ──────────────────────────────
--
-- New subscriptions default to the after school window and the evening. The
-- after school hour is the largest screen block of the day (Ofcom's metered
-- panel: 1h24 to 2h01 between 15:00 and 20:59 against 25 to 32 minutes at
-- breakfast) and the one a parent is most often in the room for. The morning
-- is one tap away in the same picker. Existing rows keep whatever they chose.

alter table public.push_subscriptions
  alter column slots set default '{afternoon,evening}'::text[];

-- ── Part three: the words the briefing found missing ────────────────────────
--
-- Checked against the live titles first: The Morning TV Standoff, The After
-- School Snack Battle, The School Pickup Debrief, The After School Device Rush,
-- The Before School Phone Argument and The visible ending already exist and
-- the Home card points at them. These three are the gaps: the handover itself
-- for the youngest, the agreement conversation, and the night before for a
-- teenager, which the briefing found is most of the morning.

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'foundation', 'everyday-routines',
  'The first twenty minutes home',
  $st$They come out of school, see you, and fall apart. Or they get in the car and will not speak. By the time you are home there has been a row about nothing and you have not even asked about their day.$st$,
  $sy$Hello you. Here is a snack. I am not going to ask you anything for a bit. (Then nothing. Walk, or drive, or sit, and let the first twenty minutes be quiet.)$sy$,
  $nt$How was school? What did you do? Why are you being like this, I have only just picked you up.$nt$,
  $wy$A child who has held it together all day in a room of thirty lets go with the one person it is safe to let go with. That is not bad behaviour at the gate, it is trust, and it is one of the most common things parents describe about primary pick up. The hour after school is also when most children have not eaten for three or four hours, and hunger and tiredness look exactly like defiance.

So the move is to take the two biggest loads off before asking anything: food in the hand, and no questions. Children told us themselves, in the Children's Commissioner's survey of nearly two thousand, that the shouting and the rush are what they mind most about the school day edges. The question about their day will get a better answer at tea, when it is specific: who did you sit with at lunch, what was the worst bit.

This is also the moment the screen gets asked for, and in the one diary study of how screen time ends, the endings that went best were the ones agreed before the screen went on. If it goes on, say when it ends first.$wy$,
  $tn$Tonight, put tomorrow's snack in your bag before bed. Tomorrow at the gate: snack, hello, no questions. Count twenty minutes before you ask anything. Notice what they tell you without being asked.$tn$,
  $ip$If they fall apart anyway, let them. Sit near, say little, and do not try to fix it. If the screen is demanded, say yes with an ending: "Yes, until the kitchen timer goes, then it is tea."$ip$,
  $cb$In a week, log how pick up went on the Home card for a few days. If the gate is calmer and the row has moved later or gone, it has worked. If the fall apart is the same at six as at half three, it is tiredness, and the earlier night is the move.$cb$,
  $fy$When you see me after school, you do not have to say anything. I will have a snack for you. You can tell me about your day when you are ready, and if you are cross first, that is all right too.$fy$,
  'none', true, 9670
where not exists (select 1 from public.scripts where title = 'The first twenty minutes home');

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'builder', 'screen-time',
  'The stopping point agreed in a calm moment',
  $st$Every screen ends in a fight, and the fight is always at the ending. You give a two minute warning and it makes no difference, or it makes it worse.$st$,
  $sy$(Not at the screen. At the weekend, or on the walk home.) The hard bit is always the stopping, so let us decide the stopping before we start. When you put it on after school, what ends it? The end of the episode, the kitchen timer, or tea on the table? You pick, and then that is the deal and I will not add a warning.$sy$,
  $nt$Two minutes! One minute! Right, that is it, off, now. Or: fine, one more, but that is the last one.$nt$,
  $wy$The one close study of how screen time ends in families, 28 families and 380 endings, found two things. Endings set by the technology itself, the episode finishing or the timer going, went better than a parent interrupting. And children who had been warned were more upset, not less, which the researchers think is partly because parents warn when they already expect trouble. Advance notice alone did not help in a separate behaviour study either.

What did help was the ending being routine rather than a surprise, and the child knowing it before the screen went on. The NHS sleep guidance for school age children says the same about bedtime: a short fixed sequence and the same cue every time. So the conversation happens in a calm moment, away from the screen, and the child chooses the ending. Then the ending is the deal, not your mood, and you have nothing to negotiate at half past four.

The RCPCH tells families to agree their screen plan in exactly this way, as a family, when nobody is mid episode.$wy$,
  $tn$Tonight, name the ending for tomorrow together: episode, timer or tea. Write it on the fridge in their words. Tomorrow, when it ends, say only "That was the deal. Well done." Nothing else.$tn$,
  $ip$If they push at the ending, do not add a warning or a countdown, and do not lecture. Point at the fridge. "You chose the timer. I am sticking to your choice." If they lose it, they lose it, and the deal holds tomorrow.$ip$,
  $cb$In a week, count the endings that went without a fight. Three of five is a win in the first week. If none did, the ending they chose is too soft (the end of the episode on autoplay is not an ending) and you pick a harder one together.$cb$,
  $fy$Stopping is the hard bit for everyone, grown ups too. So you get to choose what ends it before you start, and then it is your rule, not mine. When it ends, you did the hard bit yourself.$fy$,
  'none', true, 9671
where not exists (select 1 from public.scripts where title = 'The stopping point agreed in a calm moment');

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, if_they_push_back, check_back, for_your_child, law_flag, is_free, sort_order)
select 'explorer', 'screen-time',
  'The morning was decided last night',
  $st$Mornings are a wall: cannot wake them, snapping at everyone, no breakfast, phone in hand before their feet are on the floor, and you are the one who ends up shouting.$st$,
  $sy$(In the evening, not at 7am.) I think our mornings are being decided the night before, and I do not want to fight you at seven. So two things from tonight: the phone charges in the kitchen, and screens stop an hour before you go to sleep. Pick the time. In the morning I will not say a word about the phone, and breakfast will be there.$sy$,
  $nt$Get up! You are always like this. If you had not been on that phone all night. Give me the phone, now.$nt$,
  $wy$Two randomised crossover experiments, one in 8 to 12 year olds and one in teenagers, show what an hour less sleep for a few nights does: worse mood, worse attention, less control over feelings. In 6,616 London pupils aged 11 to 12, using a phone in the hour before sleep nearly doubled the odds of too little sleep on school nights, and using it in the dark more than doubled them. The same children reach for the phone on waking. So the morning you are meeting is the night before, and no amount of shouting at seven changes last night.

The UK's Chief Medical Officers put it in one line each: leave phones outside the bedroom when it is bedtime, and screen free meal times are a good idea. The RCPCH adds the hour before sleep. Across 355,358 adolescents, enough sleep and eating breakfast carry associations with how a child does that are several times larger than technology use itself.

So the deal is about the night, made in the evening, with the teenager choosing the time. The morning then needs nothing from you but breakfast on the table and your own phone face down.$wy$,
  $tn$Tonight, put a charger in the kitchen before you say anything. Then have the conversation above, once, and let them pick the screens off time. Tomorrow morning: breakfast out, your phone down, not one word about theirs.$tn$,
  $ip$If they say everyone else keeps their phone in their room, agree that lots do, and that lots are shattered. If they say they need it for the alarm, the kitchen charger comes with a five pound alarm clock. Hold the night rule for a fortnight before judging it.$ip$,
  $cb$In two weeks, log the mornings on the Home card. If waking is easier on three school days out of five, the night rule is doing it. If nothing has moved, the sleep time itself is the problem and that is a GP conversation, not a phone one.$cb$,
  $fy$I am not fighting you about the phone in the morning any more. The phone charges in the kitchen at night, and screens stop an hour before sleep, at a time you choose. That is the whole deal. Mornings will be calmer for both of us.$fy$,
  'none', true, 9672
where not exists (select 1 from public.scripts where title = 'The morning was decided last night');

-- ── Part four: the findings behind the two windows, sourced ─────────────────
--
-- Before this there were four rows tagged morning and five tagged after_school
-- in expert_knowledge. These are the verified ledger entries from the briefing
-- that DiGi needs at 7.20 and 3.45: every figure checked against the primary
-- source on 7 October 2026. Idempotent on the finding text.

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url)
select v.source_type, v.source_name, v.finding, v.age_bands::text[], v.topics::text[], v.url
from (values
  ('researcher', 'Orben and Przybylski, Nature Human Behaviour 2019',
   'The morning is paid for by sleep and food, not the screen. Across three datasets and 355,358 adolescents, the associations of getting enough sleep (β +0.07 to +0.25) and eating breakfast (β +0.12 to +0.17) with wellbeing were several times the size of technology use (medians β −0.005 to −0.035, at most 0.4 percent of the variance). For a parent at 7.20 that means the regular bedtime and something to eat move more than any rule about the television (UK and US).',
   '{4-7,8-10,11-13,13-15,16+}', '{morning,sleep,routines,screen_time}',
   'https://ora.ox.ac.uk/objects/uuid:5d844350-a359-47d3-b10c-4bfb93ce613b'),
  ('researcher', 'Kelly, Kelly and Sacker, Pediatrics 2013 (Millennium Cohort Study)',
   'An irregular bedtime at 3, 5 and 7 predicted more behaviour difficulties at 7 in a dose response way across 10,230 UK children, and children who moved from irregular to regular bedtimes between ages showed clear improvements in behaviour scores. The effect was reversible, which is the hopeful part: a bedtime made regular this term shows up in the morning next term (UK).',
   '{4-7,8-10}', '{morning,sleep,routines,mood}',
   'https://doi.org/10.1542/peds.2013-1906'),
  ('researcher', 'Vriend et al, Journal of Pediatric Psychology 2013, and Baum et al, JCPP 2014',
   'Two randomised crossover experiments show what one hour less sleep does within days. In 32 children aged 8 to 12, four nights of an hour less impaired emotion regulation, mood, memory and attention; in 50 teenagers, 6.5 hours in bed against 10 worsened mood and emotion regulation. Small samples, but experiments, which almost nothing about screens is. The snappy child at breakfast is very often the tired child (Canada and US).',
   '{8-10,11-13,13-15}', '{morning,sleep,mood,routines}',
   'https://doi.org/10.1093/jpepsy/jst033'),
  ('researcher', 'Mireku et al, Environment International 2019 (SCAMP, 6,616 London pupils)',
   'Using a phone in the hour before sleep raised the odds of insufficient weekday sleep by 1.82 in 6,616 London pupils aged 11 to 12, using it in the dark by 2.13, and TV in the hour before sleep by 1.40. The same children reach for the phone on waking, so the phone charging outside the bedroom is a morning move made the night before (UK).',
   '{11-13,13-15}', '{morning,sleep,phone,routines}',
   'https://doi.org/10.1016/j.envint.2018.11.069'),
  ('association', 'UK Chief Medical Officers, commentary on screen time and social media, February 2019',
   'The four UK Chief Medical Officers found the research insufficient to set screen time limits and took a precautionary approach instead, with plain advice: "Leave phones outside the bedroom when it is bedtime" and "Screen-free meal times are a good idea". Those two lines are the morning and the after school hour in miniature: the bedroom at night, the table at breakfast and tea (UK).',
   '{4-7,8-10,11-13,13-15,16+}', '{morning,after_school,sleep,balanced_use,routines}',
   'https://assets.publishing.service.gov.uk/media/5c5b1510e5274a316cee5be8/UK_CMO_commentary_on_screentime_and_social_media_map_of_reviews.pdf'),
  ('association', 'West Suffolk NHS Foundation Trust, Sleep: a guide for school aged children, 2022',
   'The NHS paediatric sleep leaflet gives the shape of a transition that works: a heads up thirty minutes out, countdown reminders, four or five activities in the same order, and the same cue phrase every time, longer where a child has ADHD. The same shape works for the end of a screen after school: the sequence and the cue are what the child learns, not the argument (UK).',
   '{4-7,8-10}', '{after_school,morning,routines,sleep,transition}',
   'https://www.wsh.nhs.uk/CMS-Documents/Patient-leaflets/PaediatricDepartment/6339-1-Sleep-a-guide-for-school-age-children.pdf'),
  ('report', 'Ofcom, Children''s Online Experiences 2026, metered panel of 701 children aged 8 to 14',
   'Ofcom''s passive meter puts the breakfast window (5am to 9am) at 25 to 32 minutes a day on phones, tablets and computers, and the after school and evening block (3pm to 9pm) at 1h24 to 2h01, the largest of the day. Weekdays and weekends are averaged (3h24 against 4h07) and TV sets are not counted. The after school hour, not the morning, is where the screen time actually is (UK).',
   '{8-10,11-13,13-15}', '{after_school,morning,screen_time,balanced_use}',
   'https://www.ofcom.org.uk/siteassets/resources/documents/online-safety/research-statistics-and-data/protecting-children/childrens-online-experiences-research-report.pdf'),
  ('report', 'Department for Education, breakfast clubs early adopters parent survey, 2026 (5,487 parents)',
   'Before school, 41 percent of primary children in the surveyed schools watch TV and 28 percent use a device, while 80 percent eat breakfast at home. Parents using a free breakfast club give longer working hours (53 percent), the child enjoying it (43 percent) and an easier drop off (35 percent) as reasons; a smoother morning at home is named by 20 percent. No table measures lateness, so nothing here says clubs or screens change it (UK).',
   '{4-7,8-10}', '{morning,routines,school}',
   'https://assets.publishing.service.gov.uk/media/6a901438f5b35599aec18e7f/Data_tables_breakfast_clubs_early_adopters.xlsx'),
  ('researcher', 'Haycraft et al, Preventive Medicine Reports 2020 (204 UK children aged 11 to 12)',
   'In the after school period, under 1 percent of 11 to 12 year olds'' time was with friends, about 46 percent with family or siblings and about 20 percent alone, and more time alone was associated with more screen use. Cross sectional, so it describes rather than proves, but it says the after school screen is often company for a child on their own. The move is company and food before it is a rule (UK).',
   '{11-13}', '{after_school,screen_time,routines,friendships}',
   'https://pmc.ncbi.nlm.nih.gov/articles/PMC7236051/'),
  ('researcher', 'Hagger et al, Perspectives on Psychological Science 2016 (23 labs, 2,141 people)',
   'The idea that self control runs out like a tank, the mechanism behind the popular label for the after school meltdown, failed a 23 lab preregistered replication: the effect was d 0.04, against the d 0.62 the literature had claimed. The after school fall apart is real, children do hold it together all day and let go with the safe person, but it is not a syndrome and it does not need a name. Describe what you see, feed them, and give it twenty minutes (adults, lab tasks).',
   '{4-7,8-10,11-13}', '{after_school,mood,tantrum,routines}',
   'https://doi.org/10.1177/1745691616652873'),
  ('report', 'Children''s Commissioner for England, children and stress, 2020 (nearly 2,000 children)',
   'Asked what stresses them, children named the edges of the school day in their own words: "My Dad shouting and rowing. Being late for anything" (a boy of 11). The rush and the shouting are what children mind about mornings, not the television, which is one reason the morning card leads with the parent''s state and one low demand move rather than a rule for the child (UK).',
   '{8-10,11-13,13-15}', '{morning,parent_stress,mood,routines}',
   'https://www.childrenscommissioner.gov.uk/blog/children-and-stress-whats-worrying-them-most/'),
  ('researcher', 'Cortes, Fricke, Loeb and Song, Education Finance and Policy 2021 (3,473 families)',
   'In the one direct test of how often to text parents, three messages a week beat one and five: five a week raised opt out by 58 percent and helped nobody, and one a week was too little to change behaviour. That is why the school day card is one window a day, the parent''s choice of which, and never both by default (US).',
   '{4-7}', '{routines,parent_wellbeing,forecast}',
   'https://users.nber.org/~cortesk/NBER_w24827_1-3-5_texts.pdf')
) as v(source_type, source_name, finding, age_bands, topics, url)
where not exists (select 1 from public.expert_knowledge e where e.finding = v.finding);
