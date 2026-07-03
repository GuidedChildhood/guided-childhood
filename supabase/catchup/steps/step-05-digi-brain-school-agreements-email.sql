-- GUIDED CHILDHOOD CATCH UP · STEP 05 · digi-brain-school-agreements-email
-- Paste into a NEW query tab, Run, look for the COMPLETE message.

-- Guided Childhood: DiGi's brain
-- Run AFTER 018_curriculum_matrix.sql.
-- Three tables: the expert knowledge corpus DiGi cites (researchers, clinical
-- experts, associations and reports, extendable forever by inserting rows),
-- structured per family memory DiGi saves and learns from, and the proactive
-- prompt queue DiGi fills so it leads with watch fors, daily life tips and
-- parent care rather than only answering.

create table if not exists public.expert_knowledge (
  id           uuid primary key default uuid_generate_v4(),
  source_type  text not null check (source_type in ('researcher','expert','association','report')),
  source_name  text not null,
  finding      text not null,
  age_bands    text[] not null default '{}',
  topics       text[] not null default '{}',
  url          text,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);
alter table public.expert_knowledge enable row level security;
create policy "Expert knowledge is public" on public.expert_knowledge for select using (true);
create policy "Service role manages expert knowledge" on public.expert_knowledge for all using (auth.role() = 'service_role');

create table if not exists public.digi_memory (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  child_id   uuid references public.children(id) on delete set null,
  kind       text not null check (kind in ('observation','concern','win','preference','context')),
  content    text not null,
  source     text not null default 'chat' check (source in ('chat','tracker','moments','system')),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_digi_memory_user on public.digi_memory(user_id, created_at desc);
alter table public.digi_memory enable row level security;
create policy "Users manage own digi memory" on public.digi_memory for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.digi_prompts (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  child_id   uuid references public.children(id) on delete set null,
  kind       text not null check (kind in ('watch_for','tip','parent_care','new_research','celebration')),
  title      text not null,
  body       text not null,
  reason     text,
  status     text not null default 'pending' check (status in ('pending','seen','dismissed','acted')),
  created_at timestamptz not null default now()
);
create index if not exists idx_digi_prompts_user on public.digi_prompts(user_id, status, created_at desc);
alter table public.digi_prompts enable row level security;
create policy "Users manage own digi prompts" on public.digi_prompts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics) values
('researcher', 'Prof Candace Odgers', 'Screen effects depend on the childs vulnerability and environment, not the device alone. Structure and warm relationships are protective, the same hours of use land differently in different homes.', '{4-7,8-10,11-13,13-15,16+}', '{screen_time,mood,routines}'),
('researcher', 'Prof Candace Odgers', 'Large correlational studies find small average associations between screen use and wellbeing. Panic is not the evidence based response, targeted support for already struggling children is.', '{8-10,11-13,13-15,16+}', '{screen_time,mood,anxiety}'),
('researcher', 'Dr Amy Orben', 'Developmental sensitivity windows exist: roughly ages 11 to 13 for girls and 14 to 15 for boys, when social media use and lower life satisfaction are most linked. Watchfulness matters most in these windows.', '{11-13,13-15}', '{social_media,mood,anxiety}'),
('researcher', 'Dr Amy Orben', 'Average effects of screen time on wellbeing are small, individual variation is large. Track your own childs pattern rather than applying a universal rule.', '{8-10,11-13,13-15,16+}', '{screen_time,mood}'),
('researcher', 'Prof Andrew Przybylski', 'The Goldilocks pattern: moderate digital engagement is not associated with harm and can be beneficial, harm concentrates at the extremes of very heavy use, especially when it displaces sleep and activity.', '{8-10,11-13,13-15,16+}', '{screen_time,sleep,gaming}'),
('researcher', 'Prof Sonia Livingstone', 'Children need skills and agency online, not only restriction. Heavy restriction lowers risk but also strips away digital opportunity and learning, guided use builds resilience.', '{4-7,8-10,11-13,13-15,16+}', '{safety,screen_time,relationships}'),
('researcher', 'Prof Sonia Livingstone', 'Active mediation, talking about and sharing online life, protects better than covert monitoring, which damages trust when discovered.', '{8-10,11-13,13-15,16+}', '{relationships,safety,social_media}'),
('expert', 'Dr Becky Kennedy', 'Sturdy leadership: hold the boundary and validate the feeling at the same time. The boundary is the decision, empathy is the delivery. Neither alone works.', '{4-7,8-10,11-13,13-15}', '{routines,mood,relationships}'),
('expert', 'Dr Becky Kennedy', 'Behaviour is a signal, not the problem. A meltdown at screen off is a child struggling with a transition, not defiance, teach the skill, keep the boundary.', '{4-7,8-10,11-13}', '{screen_time,gaming,mood}'),
('expert', 'Dr Becky Kennedy', 'Repair beats perfection. If you shouted, going back later to say sorry and reconnect teaches more emotional regulation than never losing your temper would.', '{4-7,8-10,11-13,13-15,16+}', '{relationships,parent_wellbeing,mood}'),
('expert', 'Catherine Knibbs', 'Children process distressing online experiences like real world trauma. Respond with calm and curiosity, never device confiscation as punishment for disclosure, or the next incident stays secret.', '{8-10,11-13,13-15,16+}', '{safety,trauma,relationships}'),
('expert', 'Catherine Knibbs', 'Secrecy is the risk multiplier online. The single most protective factor is a child who believes they can tell you anything they saw without losing their device.', '{8-10,11-13,13-15,16+}', '{safety,trauma,social_media}'),
('expert', 'Sue Atkins', 'Structure beats willpower for families. Predictable routines around screens remove the daily negotiation, the routine is the boundary so the parent does not have to be.', '{4-7,8-10,11-13}', '{routines,screen_time}'),
('expert', 'Sue Atkins', 'Side by side conversations, in the car, on the school run, while cooking, open children up far more than face to face interrogation. Use the school run as the talking window.', '{4-7,8-10,11-13,13-15,16+}', '{relationships,mood,routines}'),
('expert', 'Dr Tanya Byron', 'The Byron Review principle: risk online cannot be eliminated, so the goal is resilience through graduated, age appropriate access with support, the same way we teach road safety.', '{4-7,8-10,11-13,13-15,16+}', '{safety,screen_time}'),
('researcher', 'Dr Lisa Damour', 'For adolescent girls, treat feelings as data, not emergencies. Distress after social media use is information to explore together, not automatically a crisis or a reason to confiscate.', '{11-13,13-15,16+}', '{anxiety,mood,social_media}'),
('researcher', 'Dr Lisa Damour', 'Sleep displacement is the clearest mechanism by which phones harm adolescent mental health. Protecting nine hours does more than any content rule.', '{11-13,13-15,16+}', '{sleep,mood,anxiety}'),
('researcher', 'danah boyd', 'Teenagers seek autonomy and social connection online, not danger. Blanket restriction pushes the same behaviour underground where no adult can help.', '{11-13,13-15,16+}', '{social_media,relationships,safety}'),
('expert', 'Devorah Heitner', 'Mentorship over monitoring: children need adults who help them navigate what they will inevitably encounter, not surveillance that ends the conversation.', '{8-10,11-13,13-15,16+}', '{safety,relationships,social_media}'),
('researcher', 'Prof Christopher Ferguson', 'Media technology panics follow a repeating historical pattern and the measured effects are consistently smaller than public fear. Calibrate concern to your childs actual signals, not headlines.', '{4-7,8-10,11-13,13-15,16+}', '{screen_time,mood}'),
('association', 'NHS and RCPCH guidance', 'There is no evidence based universal safe screen time number. The useful questions: is screen use displacing sleep, exercise, schoolwork or family time, and is the child in control of stopping?', '{4-7,8-10,11-13,13-15,16+}', '{screen_time,sleep,routines}'),
('association', 'NHS and RCPCH guidance', 'Device free bedrooms are the single highest impact household rule for childrens sleep and mood, and the evidence is strongest here of any screen intervention.', '{4-7,8-10,11-13,13-15,16+}', '{sleep,routines,mood}'),
('association', 'MindEd and NHS guidance', 'Parent mental health is child mental health: parental stress and burnout transmit directly to children. A regulated parent is the intervention, parents caring for their own sleep, support and downtime is not selfish, it is protective.', '{4-7,8-10,11-13,13-15,16+}', '{parent_wellbeing,mood,routines}'),
('association', 'UK crisis signposting', 'Red flags need humans, not apps: self harm, suicidal talk, disclosure of abuse or grooming. Same day GP or NHS 111, CAMHS via GP referral, Childline 0800 1111 for the child, Samaritans 116 123 for anyone, CEOP for online exploitation reports.', '{4-7,8-10,11-13,13-15,16+}', '{safety,trauma,anxiety,crisis}');

-- Guided Childhood: the school link
-- Run AFTER 019_digi_brain.sql.
-- Parents forward school emails to a private per family DiGi address (one
-- time forwarding rule filtered by the school's sender, works with Gmail,
-- Outlook or anything else, no OAuth needed). An inbound webhook extracts
-- the actionable items (kit reminders, payments, homework, trips, deadlines)
-- into school_actions and surfaces them through the existing digi_prompts
-- dashboard cards. Raw email bodies are not retained, only the extracted
-- actions, which keeps the child data footprint minimal.

create table if not exists public.school_connections (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  school_name      text not null,
  sender_addresses text[] not null default '{}',
  forward_token    text not null unique,
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);
alter table public.school_connections enable row level security;
create policy "Users manage own school connections" on public.school_connections for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.school_actions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  kind        text not null check (kind in ('kit','payment','homework','event','deadline','notice')),
  title       text not null,
  detail      text,
  due_date    date,
  status      text not null default 'open' check (status in ('open','done','dismissed')),
  created_at  timestamptz not null default now()
);
create index if not exists idx_school_actions_user on public.school_actions(user_id, status, due_date);
alter table public.school_actions enable row level security;
create policy "Users manage own school actions" on public.school_actions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The dashboard prompt cards gain a school kind.
alter table public.digi_prompts drop constraint if exists digi_prompts_kind_check;
alter table public.digi_prompts add constraint digi_prompts_kind_check
  check (kind in ('watch_for','tip','parent_care','new_research','celebration','school'));

-- Guided Childhood — Migration 021
-- The family agreement builder. One living agreement per account,
-- negotiated per stage, signed by parent and child, with a review date
-- so the agreement gets revisited each term instead of going stale.
-- Version counts how many times the family has re agreed it.

create table if not exists public.family_agreements (
  id                    uuid        primary key default uuid_generate_v4(),
  user_id               uuid        not null references auth.users(id) on delete cascade,
  version               int         not null default 1,
  stage_id              text,
  agreed_date           date,
  review_date           date,

  -- Agreement sections, filled in by the family together
  family_values         text,
  bedroom_rule_time     text,
  bedroom_rule_location text,
  social_media_terms    text,
  when_things_go_wrong  text,
  extra_agreements      text,

  signed_by_parent      boolean     not null default false,
  signed_by_child       boolean     not null default false,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique(user_id)
);

alter table public.family_agreements enable row level security;

create policy "Users can manage their own family agreement"
  on public.family_agreements
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Guided Childhood — Migration 022
-- Email system support. email_log makes every lifecycle send idempotent:
-- one row per user per email key, so the daily cron can never double
-- send. Weekly digests use a dated key (digest-2026-28). email_opt_out
-- on profiles is the one switch the unsubscribe link flips.

create table if not exists public.email_log (
  id         uuid        primary key default uuid_generate_v4(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  email_key  text        not null,
  sent_at    timestamptz not null default now(),
  unique(user_id, email_key)
);

create index if not exists idx_email_log_user
  on public.email_log(user_id);

alter table public.email_log enable row level security;

-- Written only by the service role (cron and server routes). Users can
-- see their own send history, nothing else.
create policy "Users can view their own email log"
  on public.email_log
  for select
  using (auth.uid() = user_id);

alter table public.profiles
  add column if not exists email_opt_out boolean not null default false;

select 'STEP 05 COMPLETE · digi-brain-school-agreements-email' as status;
