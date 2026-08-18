-- Guided Childhood — Migration 209
-- The four strands question is about ONE child.
--
-- Every question the check in asks says "your child" out loud: "when something
-- online worries your child, do they come and tell you", "what is your child
-- watching most right now". literacy_checkins has carried no child_id since
-- migration 075, so on an account with two children the answers pile into one
-- undifferentiated list and lib/pathway/literacy-status.ts reads them as one
-- reading for the household.
--
-- Justin, 18 August 2026: "we are working on making all aspects such as
-- scripts, moments, lessons child related not family." A parent answering about
-- their nine year old's YouTube habit has said nothing at all about their
-- fifteen year old, and the strand tick should not move for him.
--
-- Additive and nullable. Rows written before today genuinely were about the
-- household as far as anyone knew, so they keep a null child and the reading
-- treats them as covering everybody, the same grandfather rule the passport
-- lane uses for lesson_pass_by. Nothing is backfilled and nothing is invented.

alter table public.literacy_checkins
  add column if not exists child_id uuid references public.children(id) on delete cascade;

-- The status reader asks for one child's recent answers on one strand, so the
-- index leads with the pair it filters on and keeps created_at for the window.
create index if not exists idx_literacy_checkins_child
  on public.literacy_checkins (child_id, strand, created_at desc);
