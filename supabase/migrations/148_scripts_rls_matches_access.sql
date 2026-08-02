-- Guided Childhood — Migration 148
--
-- The database and the app disagreed about who has paid, and the database wins.
--
-- Justin: "we have a lot of scripts for foundation but not so many for the
-- other stages." Then the count came back and every script was present:
-- Foundation 27, Builder 36, Explorer 61, Shaper 86, Independent 36. 246 rows,
-- all there, and the later stages are the BIGGEST.
--
-- So the scripts page was not short of content. It was being handed fewer rows
-- than it asked for, silently, by row level security.
--
-- THE MISMATCH, exactly. lib/access.ts grants full access three ways:
--
--   1. the founder allowlist (an env var, so RLS can never see it)
--   2. subscription_status = 'active'
--   3. a trial_ends_at still in the future
--
-- The policy written in 001 granted it ONE way: subscription_status = 'active'.
--
-- So for a parent in their seven day trial, and for the founder on his own
-- product, the app decides they are paid and renders no paywall, while the
-- database quietly returns only the rows flagged is_free. Nothing errors.
-- Nothing logs. The page just has less on it.
--
-- AND THE SHAPE OF WHAT SURVIVED IS THE TELL. Free scripts per stage:
--
--   Foundation 5, Builder 3, Explorer 1, Shaper 1, Independent 1.
--
-- Which is precisely what Justin described. Foundation looked reasonably
-- stocked, the later stages looked empty, and the obvious conclusion was that
-- we had not written enough for the older ages. We had written the most for the
-- older ages. A trialling parent was seeing eleven scripts out of two hundred
-- and forty six and forming their opinion of the product on that.
--
-- This is the second time in two days that the honest looking answer was the
-- product quietly under reporting itself rather than a feature missing. Worth
-- saying out loud: when content "looks thin", count the rows before writing
-- more of it.
--
-- THE FIX is to make the policy say what lib/access.ts says. Two of the three
-- routes can be expressed in SQL. The third cannot, because the founder
-- allowlist lives in an environment variable, so the founder needs a profile
-- row that qualifies on its own terms. That is a data fix and it is at the
-- bottom of this file rather than left as a note nobody runs.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

drop policy if exists "Paid scripts visible to active members" on public.scripts;

create policy "Paid scripts visible to active members"
  on public.scripts for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and (
          subscription_status = 'active'
          -- The trial. This is the clause whose absence caused the whole thing:
          -- a parent is given seven days to judge the product and was shown
          -- four percent of it.
          or (trial_ends_at is not null and trial_ends_at > now())
        )
    )
  );

-- The founder, who cannot be matched by any policy because the allowlist that
-- lets him in is an env var read in Node. Scoped to the one address rather than
-- anything clever, and safe to run on a database where it is already true.
update public.profiles p
set subscription_status = 'active'
from auth.users u
where u.id = p.id
  and lower(u.email) = 'justin@thesocialbillboard.com'
  and coalesce(p.subscription_status, '') <> 'active';

-- CHECK IT WORKED. Signed in as a trialling parent this should return the full
-- count for their stage rather than one row:
--
--   select stage_id, count(*) from public.scripts group by stage_id;
--
-- Run as the service role it always returned 246. That is the point: the number
-- was only ever wrong from where a parent was standing.
