-- GUIDED CHILDHOOD CATCH UP · STEP 02 · lessons-hub
-- Paste into a NEW query tab, Run, look for the COMPLETE message.

-- Guided Childhood: Lessons Hub (not yet linked in the app)
-- Run AFTER 012_ai_checkin.sql.
-- General digital parenting curriculum content, organized by stage, separate
-- from ai_lessons (which stays AI-literacy specific). The /dashboard/lessons
-- pages exist but are not linked from navigation yet. Real content will be
-- teaching modules with slides, matching the format built for schools. This
-- table and its seed rows are a placeholder until that format lands.
--
-- audience of 'parent' or 'teacher' lets the same topic exist in two voices,
-- parent facing and school facing, without a rewrite of the schema. This
-- mirrors the pattern already proven in ai_lessons.

create table if not exists public.lessons (
  id             uuid primary key default uuid_generate_v4(),
  stage_id       text not null
                   check (stage_id in ('foundation','builder','explorer','shaper','independent')),
  audience       text not null default 'parent'
                   check (audience in ('parent','teacher')),
  category       text not null, -- screen_habits / safety / wellbeing / online_risks
  title          text not null,
  the_idea       text not null,
  why_it_matters text not null,
  try_this       text not null,
  key_message    text not null,
  digi_prompt    text not null,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

alter table public.lessons enable row level security;

-- Lessons are educational and public, same pattern as ai_lessons and scripts.
create policy "Lessons are public"
  on public.lessons for select
  using (true);

create policy "Service role full access to lessons"
  on public.lessons for all
  using (auth.role() = 'service_role');

create index if not exists lessons_stage_idx on public.lessons (stage_id, audience, sort_order);

-- ─────────────────────────────────────────────
-- Seed: 2 parent-facing lessons per stage, plus one teacher-facing lesson
-- to prove out the school-facing variant. This is placeholder content until
-- the slide based lesson format (matching the schools build) replaces it.
-- ─────────────────────────────────────────────
insert into public.lessons (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order) values

-- Foundation (ages 4 to 7)
('foundation', 'parent', 'screen_habits', 'Building the first device routine',
 'A timer and a fixed spot for the device do more than any rule you say out loud.',
 'Children at this age cannot regulate device use themselves. A visible, predictable routine removes the daily negotiation before it starts.',
 'Tonight, agree a fixed screen time and a charging spot outside the bedroom. Use a visual timer, sand timer or a smart speaker, so the timer is the rule, not you.',
 'The routine is the boundary. You are not the referee, the timer is.',
 'How do I build a screen time routine for a 4 to 7 year old without daily fights?', 10),
('foundation', 'parent', 'safety', 'What to do before you hand over a screen',
 'Same room, same screen is the entire safety plan at this age. Nothing else matters yet.',
 'Supervision at this stage is not about trust, it is about developmental readiness. A 5 year old cannot judge what is safe to click.',
 'Sit with your child for their next screen session. Notice what they gravitate toward. That tells you what to set up next, not a settings menu.',
 'At this age, safety means presence, not permissions.',
 'What settings actually matter for a young child using a shared family device?', 20),

-- Builder (ages 8 to 10)
('builder', 'parent', 'screen_habits', 'Setting the bedroom rule before it is hard',
 'Where a device sleeps at night matters more than how long it is used during the day.',
 'Sleep is the non negotiable. Set the bedroom rule now, before a personal device arrives, and it becomes how things have always worked.',
 'Ask as a family question, not an announcement: where should our devices sleep? Let everyone including you follow the same answer.',
 'Set it before they need it, and it is a family norm, not a punishment.',
 'How do I introduce the bedroom rule at this age without a fight?', 10),
('builder', 'parent', 'safety', 'Talking about strangers online without frightening them',
 'The goal is not fear, it is a clear, calm plan for what to do if something feels wrong.',
 'Scare tactics make children hide problems instead of reporting them. A calm, rehearsed response keeps the door open.',
 'Practise one sentence with your child: if anything online ever feels weird, you tell me straight away and I will not be angry. Say it out loud together.',
 'A child who has rehearsed telling you is a child who actually will.',
 'How do I talk to my 8 to 10 year old about online strangers without scaring them?', 20),

-- Explorer (ages 11 to 13)
('explorer', 'parent', 'online_risks', 'Understanding the algorithm together',
 'Showing curiosity about how a feed is built protects more than any warning about screen time.',
 'This is the highest risk window identified by Cambridge MRC research. Children here are forming identity through comparison, and the algorithm amplifies whatever it finds.',
 'Open their feed together tonight. Ask one question: why do you think it showed you that? Stay curious for ten minutes, no judgment.',
 'The parent who can talk about the algorithm without alarm is the strongest protective factor at this age.',
 'How do I have the algorithm conversation with my 11 to 13 year old?', 10),
('explorer', 'parent', 'wellbeing', 'Reading the mood signal before it becomes a pattern',
 'A single bad evening is not a pattern. A dip every Sunday after the same app is.',
 'Mood tracking without judgment gives you real evidence before you say anything, instead of a hunch you cannot explain to your child.',
 'For one week, note mood before and after phone use, just a word or two. Share it as an observation, not a conclusion: I noticed this, does it feel true to you?',
 'Track for a week before you speak. Evidence lands better than instinct.',
 'How do I know if my child''s mood changes are actually linked to phone use?', 20),

-- Shaper (ages 13 to 15)
('shaper', 'parent', 'safety', 'Keeping the door open when something goes wrong',
 'A teenager who fears losing their phone is a teenager who hides the problem instead of telling you.',
 'Things do go wrong online at this age. What determines the outcome is whether your child believes you are the first call, not the last.',
 'Say this once, clearly, before anything happens: if anything ever goes wrong online, I am the first call you make, not the last. I will not overreact.',
 'Say it before it is needed. That is the whole strategy.',
 'How do I keep my 13 to 15 year old talking to me about problems online?', 10),
('shaper', 'parent', 'online_risks', 'Talking about digital footprint without a lecture',
 'What they post now follows them further than they can currently imagine, and lecturing them about it never lands.',
 'Identity formation is happening in public at this age. A judgment free look at their own footprint teaches more than a warning ever will.',
 'Ask your teenager to search their own name with you. Look at what comes up together, as curious observers, not as an inspection.',
 'Show them their footprint. Do not describe it to them.',
 'How do I talk to my teenager about their digital footprint without it becoming a lecture?', 20),

-- Independent (ages 16 and above)
('independent', 'parent', 'wellbeing', 'Building genuine digital literacy before they leave home',
 'The goal at 16 is not compliance, it is a young person who can articulate their own relationship with technology.',
 'Within a year or two most will be managing their digital life with nobody checking in. The habits and self-awareness need to be theirs, not yours.',
 'Suggest a joint digital audit. Go through their online presence together as peers. Ask: what does this say about you, and what would you change?',
 'You are not managing their digital life anymore. You are helping them see it clearly.',
 'How do I help my 16 year old build real digital literacy before they leave home?', 10),
('independent', 'parent', 'safety', 'Deepfakes, sextortion, and having the direct conversation',
 'This is not a distant risk at this age. A specific, matter of fact conversation now is genuine protection.',
 'AI generated content and sextortion scams target this age group directly. Vague warnings do not prepare anyone. Specifics do.',
 'Have one direct, unemotional conversation: if anyone ever threatens you with an image, real or fake, you come to me immediately, no matter what led to it. This is a when, not an if.',
 'Specific and calm beats vague and alarmed, every time.',
 'How do I talk to my 16 plus year old about deepfakes and sextortion risks?', 30),

-- Teacher-facing variant (same underlying topic as the Explorer mood lesson, reframed for the classroom)
('explorer', 'teacher', 'wellbeing', 'Reading the mood signal in the classroom',
 'A single low day is not a pattern. A dip that repeats around the same lesson or same time each week is worth noting.',
 'Teachers see patterns parents do not, because the classroom is a consistent environment. A brief, factual note home is more useful than a general concern.',
 'If you notice a repeated pattern, log the day and context, then share it with the parent as a specific observation, not a diagnosis: this is what I have noticed, has this come up at home?',
 'Specific, repeated, and factual. That is what makes a home note useful.',
 'What should I include in a note home about a pattern of mood change I have noticed at school?', 10)
;

select 'STEP 02 COMPLETE · lessons-hub' as status;
