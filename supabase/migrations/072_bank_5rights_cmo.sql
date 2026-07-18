-- Guided Childhood — Migration 072
-- Two bodies the bank was missing, both defensible to a hostile expert: the
-- 5Rights Foundation and the UK Chief Medical Officers. Added directly (not via
-- the fortnightly updater) because they are load bearing and known. Idempotent:
-- the insert is skipped if the source is already in the bank.

set lock_timeout = '3s';

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'association', '5Rights Foundation',
  'Children have rights in the digital world, and services should be age appropriate by default. The UK Age Appropriate Design Code, which 5Rights drove, requires the highest privacy settings for a child to be on by default, so the responsibility sits with the platform, not the parent alone.',
  '{}', array['rights', 'design', 'privacy', 'online-safety'],
  'https://5rightsfoundation.com', true
where not exists (select 1 from public.expert_knowledge where source_name = '5Rights Foundation');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url, active)
select 'report', 'UK Chief Medical Officers',
  'The UK Chief Medical Officers found the evidence does not support a single safe screen time limit. Their advice to families is to protect sleep, keep screens out of the bedroom, keep mealtimes screen free, and prioritise physical activity and time together, so the focus is on what a healthy day holds, not a number of minutes.',
  '{}', array['screen-time', 'sleep', 'wellbeing', 'balance'],
  'https://www.gov.uk/government/publications/uk-cmo-commentary-on-screen-time-and-social-media-map-of-reviews', true
where not exists (select 1 from public.expert_knowledge where source_name = 'UK Chief Medical Officers');
