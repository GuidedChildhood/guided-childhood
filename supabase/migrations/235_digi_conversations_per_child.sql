-- ────────────────────────────────────────────────────────────────────────────
-- 235 · One DiGi thread per child
--
-- Justin, 1 September 2026: "make sure the child toggle works on digi and the
-- history moves with child select so digi can take correct details into
-- thinking."
--
-- The route already resolves ?child= and files memory, concerns, questions and
-- feedback against the selected child (the 18 August multi child work). The
-- conversation itself was the last piece still keyed to the user alone: one
-- blended thread for the family, shown unchanged whichever pill was lit, and
-- fed back into the prompt so a question about Olga was answered with Teo's
-- recent conversation in DiGi's head.
--
-- One row per (user, child). The existing thread moves to the primary child,
-- who is who it was almost certainly about (every write before 18 August was
-- filed against the primary child on the same reasoning). child_id stays
-- nullable for the account with no children yet; the partial index below keeps
-- that to one row too. The daily message cap stays PER FAMILY: the route sums
-- messages_today across the rows, so a second child never doubles the free
-- allowance.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.digi_conversations
  add column if not exists child_id uuid references public.children(id) on delete cascade;

-- The one row per user rule gives way to one per (user, child).
alter table public.digi_conversations
  drop constraint if exists digi_conversations_user_id_key;

create unique index if not exists idx_digi_conversations_user_child
  on public.digi_conversations (user_id, child_id)
  where child_id is not null;

create unique index if not exists idx_digi_conversations_user_orphan
  on public.digi_conversations (user_id)
  where child_id is null;

-- The existing family thread belongs to the primary child.
update public.digi_conversations dc
set child_id = c.id
from public.children c
where c.parent_id = dc.user_id
  and c.is_primary = true
  and dc.child_id is null;
