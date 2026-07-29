-- Guided Childhood — Migration 120
-- Two things the go-live check turned up, both about the wellbeing data.
--
-- 1. CONSENT. wellbeing_checks holds mood, sleep, social, screen mood, open
-- communication and free text notes against a named child. That is special
-- category data under Article 9 of UK GDPR, which needs a condition on top of
-- the lawful basis, and realistically that is explicit consent. Nothing
-- recorded whether a parent had given it, so there was no way to prove it and
-- no way to honour a withdrawal. These columns are that record: which version
-- of the wording they agreed to, and when.
--
-- Storing the VERSION matters as much as the timestamp. Consent is to a
-- specific description of what we do, so if the wording changes, the old
-- agreement does not automatically cover the new thing, and a bare boolean
-- cannot tell you which promise was made.
--
-- 2. ERASURE. The child_id on the three tables that hold something personal
-- about a child was ON DELETE SET NULL, so removing a child left the rows
-- behind with the child_id nulled. For ordinary data that is a tidy way to keep
-- history. For health data it is the worst of both: the rows survive, they
-- cannot be attributed to anyone, they cannot be produced for a subject access
-- request, and there is no lawful basis left for holding them. Orphaned special
-- category data is not anonymised data, it is data you can no longer account
-- for. CASCADE is the honest behaviour: the child goes, their record goes.
--
-- Account level deletion already cascades correctly (auth.users to profiles to
-- children, and wellbeing_checks.parent_id to profiles), so this only changes
-- what happens when a single child is removed from a family that stays.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

alter table public.profiles
  add column if not exists wellbeing_consent_at timestamptz,
  add column if not exists wellbeing_consent_version text;

comment on column public.profiles.wellbeing_consent_at is
  'When this parent gave explicit consent to us keeping wellbeing data about their child. Null means no consent, and the check in must ask before writing.';
comment on column public.profiles.wellbeing_consent_version is
  'Which version of the consent wording they agreed to, so a later change to what we do is not silently covered by an older agreement.';

alter table public.wellbeing_checks drop constraint if exists wellbeing_checks_child_id_fkey;
alter table public.wellbeing_checks
  add constraint wellbeing_checks_child_id_fkey
  foreign key (child_id) references public.children(id) on delete cascade;

alter table public.digi_feedback drop constraint if exists digi_feedback_child_id_fkey;
alter table public.digi_feedback
  add constraint digi_feedback_child_id_fkey
  foreign key (child_id) references public.children(id) on delete cascade;

alter table public.digi_memory drop constraint if exists digi_memory_child_id_fkey;
alter table public.digi_memory
  add constraint digi_memory_child_id_fkey
  foreign key (child_id) references public.children(id) on delete cascade;

-- Anything already orphaned by the old rule. There is no one these belong to
-- and no basis for keeping them.
delete from public.wellbeing_checks where child_id is null;
delete from public.digi_memory where child_id is null and user_id is null;
