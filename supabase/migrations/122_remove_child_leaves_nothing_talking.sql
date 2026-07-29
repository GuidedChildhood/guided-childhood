-- Guided Childhood — Migration 122
--
-- Settings can now take a child off an account, which is the thing that was
-- missing: three places create a child row and nothing could ever remove one.
-- Migration 120 already moved the sensitive tables to ON DELETE CASCADE, and
-- most of the rest were CASCADE from the day they were written, so a removal
-- takes the jobs, ticks, stars, stickers, passport, app link and DiGi's memory
-- of that child with it.
--
-- digi_prompts was the one left behind. It was ON DELETE SET NULL, which for
-- most tables is the tidy choice, but a DiGi prompt is not a record, it is a
-- card that gets shown. The title and body are written about a named child, so
-- nulling the child_id does not retire the card, it only removes our ability to
-- tell who it is about. The parent keeps getting notifications naming a child
-- who is no longer on the account, with nothing in the product able to explain
-- why or make them stop.
--
-- That is the same shape as the bug this whole change came out of: the data was
-- honest and there was no way to act on it. CASCADE is the right rule here
-- because the card has no meaning without the child it describes.
--
-- Two tables keep SET NULL on purpose:
--
--   orders          a paid order is a financial record. HMRC expects six years
--                   of them, so the order stays and only the link to the child
--                   goes. Nothing about an order is displayed back as advice.
--
--   digi_questions  the parent's own conversation. It is their history, not the
--                   child's record, and deleting a parent's past questions
--                   because a child left the account would be taking away
--                   something that belongs to them. DiGi is already instructed
--                   to ignore any child name in history that is not on the
--                   current list, so a stale name in there is not repeated back.
--
-- quest_ticks.child_id has no foreign key at all, which looks like a gap and is
-- not one: a tick only ever exists against a family_quest, and that quest
-- cascades from the child, so the ticks go with it down that chain. Adding a
-- constraint now would fail on any historic tick whose quest predates child_id
-- being populated, so it is left alone and written down instead.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

alter table public.digi_prompts drop constraint if exists digi_prompts_child_id_fkey;
alter table public.digi_prompts
  add constraint digi_prompts_child_id_fkey
  foreign key (child_id) references public.children(id) on delete cascade;

comment on column public.digi_prompts.child_id is
  'The child this card is about. Cascades on removal, because the card names them and would otherwise keep being shown about a child who has left the account.';

-- No backfill delete here, deliberately, and it is worth saying why because the
-- obvious version of it destroys real data.
--
-- Migration 120 could safely clear its orphans because a wellbeing check with
-- no child is meaningless. A digi_prompt with no child is NOT: the school inbox
-- (app/api/school/inbound) inserts kind 'school' cards with no child_id at all,
-- because they are about a school email rather than a particular child. So
-- "child_id is null" does not mean orphaned here, it means either orphaned or
-- perfectly normal, and nothing in the row tells the two apart.
--
-- Cards left over from a child removed by hand in the Supabase dashboard before
-- Settings could do it therefore stay. They are only on test accounts, they age
-- out of the pending list on their own, and a parent can now dismiss one. That
-- is a much smaller problem than deleting every school notification on every
-- account to tidy them up.
