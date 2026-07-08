-- Guided Childhood Schools: membership checks as security definer functions
-- Run AFTER 027. SAFE TO RUN REPEATEDLY. Dashboard safe: flat statements,
-- no dollar quoting, no semicolons inside strings.
--
-- Why: policies that check membership by querying school_educators from
-- inside another table policy have been fragile in production (the school
-- row read kept failing while looking correct). The canonical Supabase
-- pattern is a security definer function: it evaluates the membership
-- check with owner rights, immune to policy interplay. Every school
-- policy now delegates to one of these three helpers.

create or replace function public.is_school_member(sid uuid)
returns boolean
language sql stable security definer set search_path = public
as 'select exists (select 1 from public.school_educators where school_id = sid and user_id = auth.uid())';

create or replace function public.is_school_lead(sid uuid)
returns boolean
language sql stable security definer set search_path = public
as 'select exists (select 1 from public.school_educators where school_id = sid and user_id = auth.uid() and role in (''lead'', ''head''))';

create or replace function public.is_class_member(cid uuid)
returns boolean
language sql stable security definer set search_path = public
as 'select exists (select 1 from public.school_classes c join public.school_educators e on e.school_id = c.school_id where c.id = cid and e.user_id = auth.uid())';

create or replace function public.is_delivery_member(did uuid)
returns boolean
language sql stable security definer set search_path = public
as 'select exists (select 1 from public.lesson_deliveries d join public.school_classes c on c.id = d.class_id join public.school_educators e on e.school_id = c.school_id where d.id = did and e.user_id = auth.uid())';

drop policy if exists "Educators read own school" on public.school_accounts;

create policy "Educators read own school"
  on public.school_accounts for select using (public.is_school_member(id));

drop policy if exists "Leads update own school" on public.school_accounts;

create policy "Leads update own school"
  on public.school_accounts for update using (public.is_school_lead(id));

drop policy if exists "Educators manage own school classes" on public.school_classes;

create policy "Educators manage own school classes"
  on public.school_classes for all using (public.is_school_member(school_id));

drop policy if exists "Educators manage own school pupils" on public.pupils;

create policy "Educators manage own school pupils"
  on public.pupils for all using (public.is_class_member(class_id));

drop policy if exists "Educators manage own deliveries" on public.lesson_deliveries;

create policy "Educators manage own deliveries"
  on public.lesson_deliveries for all using (public.is_class_member(class_id));

drop policy if exists "Educators manage delivery children: checks" on public.check_responses;

create policy "Educators manage delivery children: checks"
  on public.check_responses for all using (public.is_delivery_member(delivery_id));

drop policy if exists "Educators manage delivery children: judgements" on public.teacher_judgements;

create policy "Educators manage delivery children: judgements"
  on public.teacher_judgements for all using (public.is_delivery_member(delivery_id));

drop policy if exists "Educators manage delivery children: commitments" on public.action_commitments;

create policy "Educators manage delivery children: commitments"
  on public.action_commitments for all using (public.is_delivery_member(delivery_id));

drop policy if exists "Educators manage delivery children: evidence" on public.evidence_items;

create policy "Educators manage delivery children: evidence"
  on public.evidence_items for all using (public.is_delivery_member(delivery_id));

drop policy if exists "Educators read own school reports" on public.generated_reports;

create policy "Educators read own school reports"
  on public.generated_reports for select using (public.is_school_member(school_id));
