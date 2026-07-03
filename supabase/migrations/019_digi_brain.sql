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
