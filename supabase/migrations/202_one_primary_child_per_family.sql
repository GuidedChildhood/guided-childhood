-- One primary child per family, enforced.
--
-- children.is_primary has defaulted to TRUE since migration 001 with no unique
-- constraint anywhere in 201 migrations. So any insert path that omitted it
-- minted another primary, and on the live account four of five children carried
-- the flag at once.
--
-- WHY THAT WAS EXPENSIVE. 45 call sites read the primary child as
-- .eq('is_primary', true) followed by maybeSingle() or single(). PostgREST
-- returns PGRST116 on more than one row for BOTH, so those reads returned an
-- error and null data, and almost every caller discards the error. It failed in
-- three shapes, all silent: hard stops (the agreement week check returning "No
-- child on the account yet", the monthly review skipping the family entirely),
-- rows written with child_id null and attributed to nobody, and copy falling
-- back to "your child" with the stage 3 default so a family got advice pitched
-- at the wrong age.
--
-- The data is clean as of today. All four insert paths set is_primary
-- explicitly and correctly: onboarding writes true for the first child and
-- false for siblings, the starter pack only inserts when the family has none,
-- and the quest manager sets it from a count. So the index can only ever catch
-- a NEW path that forgets, which is exactly what it is for.
--
-- Partial rather than a plain unique: only the true rows are constrained, so a
-- family can hold any number of non primary children.
create unique index if not exists idx_children_one_primary
  on public.children (parent_id)
  where is_primary;

comment on index public.idx_children_one_primary is
  'One primary child per parent. is_primary defaults true and 45 reads use maybeSingle/single on it, which error rather than picking a row when there is more than one. Added 17 August 2026 after four of five live children carried the flag.';
