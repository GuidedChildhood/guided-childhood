-- Guided Childhood Schools: Phase 2 onboarding policies
-- Run AFTER 018_schools_product.sql.
-- 018 gave educators read/manage access to existing school data but no way
-- to create a school in the first place. Phase 2's educator workspace needs:
--  - any signed in user can create a school account (they become its first
--    educator in the same transaction, role lead)
--  - a user can insert their own school_educators row (self enrolment at
--    school creation; invited colleagues come later via service role)

create policy "Authenticated users can create a school"
  on public.school_accounts for insert
  with check (auth.uid() is not null);

create policy "Users can enrol themselves as educators"
  on public.school_educators for insert
  with check (user_id = auth.uid());

-- Leads can update their school details (name, phase).
create policy "Leads update own school"
  on public.school_accounts for update
  using (exists (
    select 1 from public.school_educators e
    where e.school_id = id and e.user_id = auth.uid() and e.role in ('lead','head')));
