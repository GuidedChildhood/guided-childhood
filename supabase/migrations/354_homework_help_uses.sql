-- Homework help, the child's side (25 September 2026).
--
-- How many times a child asked for a homework hint today, and nothing else.
-- The homework itself, typed or photographed, is never stored: Justin's
-- answer was "photos yes, not kept", and the text is held to the same rule.
-- This row exists only so one child link cannot run the model all night.
--
-- Service role only. The child app has no account; its routes run on the
-- server with the link token as the auth, the same as kid_homework_notes.

create table if not exists public.kid_homework_help_uses (
  child_id  uuid not null references public.children(id) on delete cascade,
  day       date not null,
  uses      integer not null default 0,
  primary key (child_id, day)
);

alter table public.kid_homework_help_uses enable row level security;
revoke all on public.kid_homework_help_uses from anon, authenticated;
grant select, insert, update, delete on public.kid_homework_help_uses to service_role;

comment on table public.kid_homework_help_uses is
  'Daily count of homework hints per child, for the cap. The homework itself is never stored.';
